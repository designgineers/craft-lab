import { invariant } from '@epic-web/invariant'
import { redirect } from '@remix-run/node'
import { verifySessionStorage } from '#app/utils/verification.server.ts'
import {
	onboardingEmailSessionKey,
	onboardingGroupIdSessionKey,
} from './onboarding.tsx'
import { type VerifyFunctionArgs } from './verify.server.ts'

export async function handleVerification({ submission }: VerifyFunctionArgs) {
	invariant(
		submission.status === 'success',
		'Submission should be successful by now',
	)
	const verifySession = await verifySessionStorage.getSession()
	verifySession.set(onboardingEmailSessionKey, submission.value.target)
	return redirect('/onboarding', {
		headers: {
			'set-cookie': await verifySessionStorage.commitSession(verifySession),
		},
	})
}

export async function handleInviteVerification({
	submission,
}: VerifyFunctionArgs) {
	invariant(
		submission.status === 'success',
		'Submission should be successful by now',
	)
	const verifySession = await verifySessionStorage.getSession()
	const [groupId, email] = submission.value.target.split(':')
	verifySession.set(onboardingGroupIdSessionKey, groupId)
	verifySession.set(onboardingEmailSessionKey, email)
	return {
		'set-cookie': await verifySessionStorage.commitSession(verifySession),
	}
}
