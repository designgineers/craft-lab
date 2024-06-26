import typographyPlugin from '@tailwindcss/typography'
import { type Config } from 'tailwindcss'
import animatePlugin from 'tailwindcss-animate'
import radixPlugin from 'tailwindcss-radix'
import { extendedTheme } from './app/utils/extended-theme.ts'

export default {
	content: ['./app/**/*.{ts,tsx,jsx,js}'],
	darkMode: 'class',
	theme: {
		container: {
			center: true,
			screens: {
				'2xl': '1400px',
			},
		},
		extend: extendedTheme,
	},
	plugins: [animatePlugin, radixPlugin, typographyPlugin],
} satisfies Config
