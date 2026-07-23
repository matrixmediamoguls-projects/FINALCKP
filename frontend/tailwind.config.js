/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				display: ['Oxanium', 'system-ui', '-apple-system', 'sans-serif'],
				interface: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
				data: ['JetBrains Mono', 'monospace'],
				sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
				serif: ['Oxanium', 'system-ui', '-apple-system', 'sans-serif'],
				monospace: ['JetBrains Mono', 'monospace'],
				// Compatibility aliases for existing screens.
				heading: ['Oxanium', 'system-ui', '-apple-system', 'sans-serif'],
				primary: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace'],
			},
			letterSpacing: {
				'tech-wide': '0.10em',
				'tech-widest': '0.20em',
			},

			colors: {
				// ✅ KEEP (used by shadcn / system)
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',

				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},

				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',

				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},

				// ✅ NEW BRIGHTENED SYSTEM (YOUR REAL COLORS)
				brand: {
					background: "#0A0A0B",
					surface: "#111113",
					surfaceElevated: "#18181B",

					primary: "#A3FF3F",
					primarySoft: "#D8FF8A",

					accent: "#F5D061",
					accentGlow: "#FFE27A",

					textPrimary: "#FAFAFA",
					textSecondary: "#C5C5D0",
					textMuted: "#8A8A95",

					border: "#2A2A2E",

					error: "#FF5A5F",
					success: "#4ADE80"
				},
				occult: {
					primary: 'rgba(255, 255, 255, 0.95)',
					secondary: 'rgba(255, 255, 255, 0.70)',
					muted: 'rgba(255, 255, 255, 0.45)',
					amber: '#FF9F1C',
					orange: '#FF5722',
				}
			},

			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function ({ addUtilities }) {
			addUtilities({
				'.text-glow-orange': {
					'text-shadow': '0 0 12px rgba(255, 115, 0, 0.25)',
				},
				'.text-glow-strong': {
					'text-shadow': '0 0 16px rgba(255, 115, 0, 0.4)',
				},
			})
		},
	],
}
