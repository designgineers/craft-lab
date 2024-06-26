/*
TODO: Update this component to use your client-side framework's link
component. We've provided examples of how to do this for Next.js,
Remix, and Inertia.js in the Catalyst documentation:

https://catalyst.tailwindui.com/docs#client-side-router-integration
*/

import { DataInteractive as HeadlessDataInteractive } from '@headlessui/react'
import React from 'react'

export const Link = React.forwardRef(function Link(
	{
		children,
		...props
	}: { href: string } & React.ComponentPropsWithoutRef<'a'>,
	ref: React.ForwardedRef<HTMLAnchorElement>,
) {
	return (
		<HeadlessDataInteractive>
			<a {...props} ref={ref}>
				{children}
			</a>
		</HeadlessDataInteractive>
	)
})
