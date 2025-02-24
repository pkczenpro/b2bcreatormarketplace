import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          50: '#E7F6FD',
          100: '#CEEDFB',
          200: '#9DDBF7',
          300: '#6DC9F4',
          400: '#3CB7F0',
          500: '#0BA5EC',
          600: '#0984BD',
          700: '#07638E',
          800: '#04425E',
          900: '#033247',
        },

        // Neutral colors
        neutral: {
          50: '#F6F6F8',
          100: '#F0F1F3',
          200: '#E0E2E7',
          300: '#C2C6CE',
          400: '#A3A9B6',
          500: '#858D9D',
          600: '#667085',
          700: '#525A6A',
          800: '#3D4350',
          900: '#292D35',
        },

        // Danger colors
        danger: {
          50: '#FDECEB',
          100: '#FCDAD7',
          200: '#F9B4AF',
          300: '#F68F88',
          400: '#F36960',
          500: '#F04438',
          600: '#C0362D',
          700: '#902922',
          800: '#601B16',
          900: '#481411',
        },

        // Warning colors
        warning: {
          50: '#FEF4E6',
          100: '#FDE9CE',
          200: '#FCD39D',
          300: '#FABC6B',
          400: '#F9A63A',
          500: '#F79009',
          600: '#C67307',
          700: '#945605',
          800: '#633A04',
          900: '#4A2B03',
        },

        // Success colors
        success: {
          50: '#DCF7EB',
          100: '#C6F0DC',
          200: '#99E2C0',
          300: '#6CD3A3',
          400: '#3FC587',
          500: '#12B76A',
          600: '#0E9255',
          700: '#0B6E40',
          800: '#07492A',
          900: '#053720',
        },
      },
      fontSize: {
        // Heading Sizes (H1 - H6)
        'h1': ['48px', { lineHeight: '1.2', fontWeight: '400' }],
        'h2': ['40px', { lineHeight: '1.3', fontWeight: '500' }],
        'h3': ['32px', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['28px', { lineHeight: '1.5', fontWeight: '400' }],
        'h5': ['24px', { lineHeight: '1.6', fontWeight: '500' }],
        'h6': ['20px', { lineHeight: '1.7', fontWeight: '600' }],
        
        // Content Text Sizes
        'text-large': ['18px', { lineHeight: '1.7', fontWeight: '400' }],
        'text-medium': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'text-small': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      fontWeight: {
        // Font weights for content types
        regular: '400',
        medium: '500',
        bold: '700',
        bolder: '800',
      },
    },
  },
  plugins: [],
} as Config;
