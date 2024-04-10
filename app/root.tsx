import { parseWithZod } from '@conform-to/zod'
import { invariantResponse } from '@epic-web/invariant'
import {
	json,
	type LoaderFunctionArgs,
	type ActionFunctionArgs,
	type HeadersFunction,
	type LinksFunction,
	type MetaFunction,
} from '@remix-run/node'
import {
	Form,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useFetchers,
	useLoaderData,
} from '@remix-run/react'
import { withSentry } from '@sentry/remix'
import { useEffect } from 'react'
import { HoneypotProvider } from 'remix-utils/honeypot/react'
import { z } from 'zod'
import { GeneralErrorBoundary } from './components/error-boundary.tsx'
import { makeFavicon, type Seed } from './components/logo.tsx'
import { EpicProgress } from './components/progress-bar.tsx'
import { useToast } from './components/toaster.tsx'
import { Button } from './components/ui/button.tsx'
import { href as iconsHref } from './components/ui/icon.tsx'
import { EpicToaster } from './components/ui/sonner.tsx'
import tailwindStyleSheetUrl from './styles/tailwind.css?url'
import { getAccountId, logout } from './utils/auth.server.ts'
import { ClientHintCheck, getHints, useHints } from './utils/client-hints.tsx'
import { prisma } from './utils/db.server.ts'
import { getEnv } from './utils/env.server.ts'
import { honeypot } from './utils/honeypot.server.ts'
import { combineHeaders, getDomainUrl } from './utils/misc.tsx'
import { useNonce } from './utils/nonce-provider.ts'
import { useRequestInfo } from './utils/request-info.ts'
import { type Theme, setTheme, getTheme } from './utils/theme.server.ts'
import { makeTimings, time } from './utils/timing.server.ts'
import { getToast } from './utils/toast.server.ts'

export const links: LinksFunction = () => {
	return [
		// Preload svg sprite as a resource to avoid render blocking
		{ rel: 'preload', href: iconsHref, as: 'image' },
		// Preload CSS as a resource to avoid render blocking
		{ rel: 'mask-icon', href: '/favicons/mask-icon.svg' },
		{
			rel: 'alternate icon',
			type: 'image/png',
			href: '/favicons/favicon-32x32.png',
		},
		{ rel: 'apple-touch-icon', href: '/favicons/apple-touch-icon.png' },
		{
			rel: 'manifest',
			href: '/site.webmanifest',
			crossOrigin: 'use-credentials',
		} as const, // necessary to make typescript happy
		//These should match the css preloads above to avoid css as render blocking resource
		{
			rel: 'icon',
			type: 'image/svg+xml',
			href: '/favicons/favicon.svg',
			id: 'favicon',
		},
		{ rel: 'stylesheet', href: tailwindStyleSheetUrl },
	].filter(Boolean)
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: data ? 'Epic Notes' : 'Error | Epic Notes' },
		{ name: 'description', content: `Your own captain's log` },
	]
}

function genSeed() {
	return Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 1
}

export async function loader({ request }: LoaderFunctionArgs) {
	const timings = makeTimings('root loader')
	const accountId = await time(() => getAccountId(request), {
		timings,
		type: 'getAccountId',
		desc: 'getAccountId in root',
	})

	const group = await time(() => prisma.group.findFirstOrThrow(), {
		timings,
		type: 'find group',
		desc: 'find group in root',
	})

	const account = accountId
		? await time(
				() =>
					prisma.profile
						.findUniqueOrThrow({
							select: {
								id: true,
								name: true,
								image: { select: { id: true } },
								roles: {
									select: {
										name: true,
										permissions: {
											select: { entity: true, action: true, access: true },
										},
									},
								},
								account: {
									select: {
										id: true,
										name: true,
										handle: true,
									},
								},
							},
							where: {
								accountId_groupId: {
									accountId,
									groupId: group.id,
								},
							},
						})
						.then(({ account, id, name, ...profile }) => ({
							...account,
							...profile,
							profileId: id,
							displayName: name,
						})),
				{ timings, type: 'find account', desc: 'find account in root' },
			)
		: null
	if (accountId && !account) {
		console.info('something weird happened')
		// something weird happened... The account is authenticated but we can't find
		// them in the database. Maybe they were deleted? Let's log them out.
		await logout({ request, redirectTo: '/' })
	}
	const { toast, headers: toastHeaders } = await getToast(request)
	const honeyProps = honeypot.getInputProps()

	return json(
		{
			seed: [genSeed(), genSeed(), genSeed(), genSeed()] satisfies Seed,
			account,
			requestInfo: {
				hints: getHints(request),
				origin: getDomainUrl(request),
				path: new URL(request.url).pathname,
				accountPrefs: {
					theme: getTheme(request),
				},
			},
			ENV: getEnv(),
			toast,
			honeyProps,
		},
		{
			headers: combineHeaders(
				{ 'Server-Timing': timings.toString() },
				toastHeaders,
			),
		},
	)
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
	const headers = {
		'Server-Timing': loaderHeaders.get('Server-Timing') ?? '',
	}
	return headers
}

const ThemeFormSchema = z.object({
	theme: z.enum(['system', 'light', 'dark']),
})

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData()
	const submission = parseWithZod(formData, {
		schema: ThemeFormSchema,
	})

	invariantResponse(submission.status === 'success', 'Invalid theme received')

	const { theme } = submission.value

	const responseInit = {
		headers: { 'set-cookie': setTheme(theme) },
	}
	return json({ result: submission.reply() }, responseInit)
}

function Document({
	children,
	nonce,
	theme = 'light',
	env = {},
	allowIndexing = true,
}: {
	children: React.ReactNode
	nonce: string
	theme?: Theme
	env?: Record<string, string>
	allowIndexing?: boolean
}) {
	return (
		<html lang="en" className={`${theme} h-full overflow-x-hidden`}>
			<head>
				<ClientHintCheck nonce={nonce} />
				<Meta />
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				{allowIndexing ? null : (
					<meta name="robots" content="noindex, nofollow" />
				)}
				<Links />
			</head>
			<body className="grid min-h-screen bg-background text-foreground">
				{children}
				<script
					nonce={nonce}
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(env)}`,
					}}
				/>
				<ScrollRestoration nonce={nonce} />
				<Scripts nonce={nonce} />
			</body>
		</html>
	)
}

function App() {
	const data = useLoaderData<typeof loader>()
	const nonce = useNonce()
	const theme = 'light'
	const allowIndexing = data.ENV.ALLOW_INDEXING !== 'false'
	useToast(data.toast)

	useEffect(() => {
		const favicon = document.getElementById('favicon')
		const svg = makeFavicon(data.seed)
		if (svg && favicon) {
			favicon.setAttribute('href', svg)
		}
	})

	return (
		<Document
			nonce={nonce}
			theme={theme}
			allowIndexing={allowIndexing}
			env={data.ENV}
		>
			{data.account ? (
				<Form action="/logout" method="POST">
					<Button>Logout</Button>
				</Form>
			) : null}
			<div>
				<Outlet />
			</div>
			<EpicToaster closeButton position="top-center" theme={theme} />
			<EpicProgress />
		</Document>
	)
}

function AppWithProviders() {
	const data = useLoaderData<typeof loader>()
	return (
		<HoneypotProvider {...data.honeyProps}>
			<App />
		</HoneypotProvider>
	)
}

export default withSentry(AppWithProviders)

/**
 * @returns the account's theme preference, or the client hint theme if the account
 * has not set a preference.
 */
export function useTheme() {
	const hints = useHints()
	const requestInfo = useRequestInfo()
	const optimisticMode = useOptimisticThemeMode()
	if (optimisticMode) {
		return optimisticMode === 'system' ? hints.theme : optimisticMode
	}
	return requestInfo.accountPrefs.theme ?? hints.theme
}

/**
 * If the account's changing their theme mode preference, this will return the
 * value it's being changed to.
 */
export function useOptimisticThemeMode() {
	const fetchers = useFetchers()
	const themeFetcher = fetchers.find(f => f.formAction === '/')

	if (themeFetcher && themeFetcher.formData) {
		const submission = parseWithZod(themeFetcher.formData, {
			schema: ThemeFormSchema,
		})

		if (submission.status === 'success') {
			return submission.value.theme
		}
	}
}

// function ThemeSwitch({
// 	accountPreference,
// }: {
// 	accountPreference?: Theme | null
// }) {
// 	const fetcher = useFetcher<typeof action>()

// 	const [form] = useForm({
// 		id: 'theme-switch',
// 		lastResult: fetcher.data?.result,
// 	})

// 	const optimisticMode = useOptimisticThemeMode()
// 	const mode = optimisticMode ?? accountPreference ?? 'system'
// 	const nextMode =
// 		mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system'
// 	const modeLabel = {
// 		light: (
// 			<Icon name="sun">
// 				<span className="sr-only">Light</span>
// 			</Icon>
// 		),
// 		dark: (
// 			<Icon name="moon">
// 				<span className="sr-only">Dark</span>
// 			</Icon>
// 		),
// 		system: (
// 			<Icon name="laptop">
// 				<span className="sr-only">System</span>
// 			</Icon>
// 		),
// 	}

// 	return (
// 		<fetcher.Form method="POST" {...getFormProps(form)}>
// 			<input type="hidden" name="theme" value={nextMode} />
// 			<div className="flex gap-2">
// 				<button
// 					type="submit"
// 					className="flex h-8 w-8 cursor-pointer items-center justify-center"
// 				>
// 					{modeLabel[mode]}
// 				</button>
// 			</div>
// 		</fetcher.Form>
// 	)
// }

export function ErrorBoundary() {
	// the nonce doesn't rely on the loader so we can access that
	const nonce = useNonce()

	// NOTE: you cannot use useLoaderData in an ErrorBoundary because the loader
	// likely failed to run so we have to do the best we can.
	// We could probably do better than this (it's possible the loader did run).
	// This would require a change in Remix.

	// Just make sure your root route never errors out and you'll always be able
	// to give the account a better UX.

	return (
		<Document nonce={nonce}>
			<GeneralErrorBoundary />
		</Document>
	)
}
