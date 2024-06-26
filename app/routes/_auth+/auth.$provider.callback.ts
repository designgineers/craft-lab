import { redirect, type LoaderFunctionArgs } from '@remix-run/node'
import {
	authenticator,
	getSessionExpirationDate,
	getAccountId,
} from '#app/utils/auth.server.ts'
import { ProviderNameSchema, providerLabels } from '#app/utils/connections.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { combineHeaders } from '#app/utils/misc.tsx'
import {
	destroyRedirectToHeader,
	getRedirectCookieValue,
} from '#app/utils/redirect-cookie.server.ts'
import {
	createToastHeaders,
	redirectWithToast,
} from '#app/utils/toast.server.ts'
import { verifySessionStorage } from '#app/utils/verification.server.ts'
import { handleNewSession } from './login.server.ts'
import { onboardingEmailSessionKey } from './onboarding.tsx'
import { prefilledProfileKey, providerIdKey } from './onboarding_.$provider.tsx'

const destroyRedirectTo = { 'set-cookie': destroyRedirectToHeader }

export async function loader({ request, params }: LoaderFunctionArgs) {
	const providerName = ProviderNameSchema.parse(params.provider)
	const redirectTo = getRedirectCookieValue(request)
	const label = providerLabels[providerName]

	const authResult = await authenticator
		.authenticate(providerName, request, { throwOnError: true })
		.then(
			data => ({ success: true, data }) as const,
			error => ({ success: false, error }) as const,
		)

	if (!authResult.success) {
		console.error(authResult.error)
		throw await redirectWithToast(
			'/login',
			{
				title: 'Auth Failed',
				description: `There was an error authenticating with ${label}.`,
				type: 'error',
			},
			{ headers: destroyRedirectTo },
		)
	}

	const { data: profile } = authResult

	const existingConnection = await prisma.connection.findUnique({
		select: { accountId: true },
		where: {
			providerName_providerId: { providerName, providerId: profile.id },
		},
	})

	const accountId = await getAccountId(request)

	if (existingConnection && accountId) {
		if (existingConnection.accountId === accountId) {
			return redirectWithToast(
				'/settings/profile/connections',
				{
					title: 'Already Connected',
					description: `Your "${profile.handle}" ${label} account is already connected.`,
				},
				{ headers: destroyRedirectTo },
			)
		} else {
			return redirectWithToast(
				'/settings/profile/connections',
				{
					title: 'Already Connected',
					description: `The "${profile.handle}" ${label} account is already connected to another account.`,
				},
				{ headers: destroyRedirectTo },
			)
		}
	}

	// If we're already logged in, then link the account
	if (accountId) {
		await prisma.connection.create({
			data: {
				providerName,
				providerId: profile.id,
				accountId,
			},
		})
		return redirectWithToast(
			'/settings/profile/connections',
			{
				title: 'Connected',
				type: 'success',
				description: `Your "${profile.handle}" ${label} account has been connected.`,
			},
			{ headers: destroyRedirectTo },
		)
	}

	// Connection exists already? Make a new session
	if (existingConnection) {
		return makeSession({ request, accountId: existingConnection.accountId })
	}

	// if the email matches a account in the db, then link the account and
	// make a new session
	const account = await prisma.account.findUnique({
		select: { id: true },
		where: { email: profile.email.toLowerCase() },
	})
	if (account) {
		await prisma.connection.create({
			data: {
				providerName,
				providerId: profile.id,
				accountId: account.id,
			},
		})
		return makeSession(
			{ request, accountId: account.id },
			{
				headers: await createToastHeaders({
					title: 'Connected',
					description: `Your "${profile.handle}" ${label} account has been connected.`,
				}),
			},
		)
	}

	// this is a new account, so let's get them onboarded
	const verifySession = await verifySessionStorage.getSession()
	verifySession.set(onboardingEmailSessionKey, profile.email)
	verifySession.set(prefilledProfileKey, {
		...profile,
		email: profile.email.toLowerCase(),
		handle: profile.handle?.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase(),
	})
	verifySession.set(providerIdKey, profile.id)
	const onboardingRedirect = [
		`/onboarding/${providerName}`,
		redirectTo ? new URLSearchParams({ redirectTo }) : null,
	]
		.filter(Boolean)
		.join('?')
	return redirect(onboardingRedirect, {
		headers: combineHeaders(
			{ 'set-cookie': await verifySessionStorage.commitSession(verifySession) },
			destroyRedirectTo,
		),
	})
}

async function makeSession(
	{
		request,
		accountId,
		redirectTo,
	}: { request: Request; accountId: string; redirectTo?: string | null },
	responseInit?: ResponseInit,
) {
	redirectTo ??= '/'
	const session = await prisma.session.create({
		select: { id: true, expirationDate: true, accountId: true },
		data: {
			expirationDate: getSessionExpirationDate(),
			accountId,
		},
	})
	return handleNewSession(
		{ request, session, redirectTo, remember: true },
		{ headers: combineHeaders(responseInit?.headers, destroyRedirectTo) },
	)
}
