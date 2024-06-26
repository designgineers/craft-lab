import { type Strategy } from 'remix-auth'
import { type Timings } from '../timing.server.ts'

// Define a account type for cleaner typing
export type ProviderAccount = {
	id: string
	email: string
	handle?: string
	name?: string
	imageUrl?: string
}

export interface AuthProvider {
	getAuthStrategy(): Strategy<ProviderAccount, any>
	handleMockAction(request: Request): Promise<void>
	resolveConnectionData(
		providerId: string,
		options?: { timings?: Timings },
	): Promise<{
		displayName: string
		link?: string | null
	}>
}
