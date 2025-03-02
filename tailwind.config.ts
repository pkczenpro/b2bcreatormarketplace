import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				primary: {
					'50': '#E7F6FD',
					'100': '#CEEDFB',
					'200': '#9DDBF7',
					'300': '#6DC9F4',
					'400': '#3CB7F0',
					'500': '#0BA5EC',
					'600': '#0984BD',
					'700': '#07638E',
					'800': '#04425E',
					'900': '#033247',
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				neutral: {
					'50': '#F6F6F8',
					'100': '#F0F1F3',
					'200': '#E0E2E7',
					'300': '#C2C6CE',
					'400': '#A3A9B6',
					'500': '#858D9D',
					'600': '#667085',
					'700': '#525A6A',
					'800': '#3D4350',
					'900': '#292D35'
				},
				danger: {
					'50': '#FDECEB',
					'100': '#FCDAD7',
					'200': '#F9B4AF',
					'300': '#F68F88',
					'400': '#F36960',
					'500': '#F04438',
					'600': '#C0362D',
					'700': '#902922',
					'800': '#601B16',
					'900': '#481411'
				},
				warning: {
					'50': '#FEF4E6',
					'100': '#FDE9CE',
					'200': '#FCD39D',
					'300': '#FABC6B',
					'400': '#F9A63A',
					'500': '#F79009',
					'600': '#C67307',
					'700': '#945605',
					'800': '#633A04',
					'900': '#4A2B03'
				},
				success: {
					'50': '#DCF7EB',
					'100': '#C6F0DC',
					'200': '#99E2C0',
					'300': '#6CD3A3',
					'400': '#3FC587',
					'500': '#12B76A',
					'600': '#0E9255',
					'700': '#0B6E40',
					'800': '#07492A',
					'900': '#053720'
				},
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
				}
			},
			fontSize: {
				h1: [
					'48px',
					{
						lineHeight: '1.2',
						fontWeight: '400'
					}
				],
				h2: [
					'40px',
					{
						lineHeight: '1.3',
						fontWeight: '500'
					}
				],
				h3: [
					'32px',
					{
						lineHeight: '1.4',
						fontWeight: '600'
					}
				],
				h4: [
					'28px',
					{
						lineHeight: '1.5',
						fontWeight: '400'
					}
				],
				h5: [
					'24px',
					{
						lineHeight: '1.6',
						fontWeight: '500'
					}
				],
				h6: [
					'20px',
					{
						lineHeight: '1.7',
						fontWeight: '600'
					}
				],
				'text-large': [
					'18px',
					{
						lineHeight: '1.7',
						fontWeight: '400'
					}
				],
				'text-medium': [
					'16px',
					{
						lineHeight: '1.6',
						fontWeight: '400'
					}
				],
				'text-small': [
					'14px',
					{
						lineHeight: '1.5',
						fontWeight: '400'
					}
				]
			},
			fontWeight: {
				regular: '400',
				medium: '500',
				bold: '700',
				bolder: '800'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				arial: ['Arial', 'Helvetica', 'sans-serif'],
				courier: ['Courier New', 'Courier', 'monospace'],
				georgia: ['Georgia', 'serif'],
				lucida: ['Lucida Console', 'monospace'],
				tahoma: ['Tahoma', 'sans-serif'],
				times: ['Times New Roman', 'serif'],
				trebuchet: ['Trebuchet MS', 'sans-serif'],
				verdana: ['Verdana', 'sans-serif'],
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} as Config;
