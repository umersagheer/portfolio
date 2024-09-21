import type { Config } from 'tailwindcss'
import { nextui } from '@nextui-org/react'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
        sourceCodePro: ['var(--font-source-code-pro)', 'monospace']
      }
    }
  },
  darkMode: 'class',
  plugins: [
    nextui({
      addCommonColors: true,
      themes: {
        light: {
          colors: {
            background: '#FFFFFF', // or DEFAULT
            foreground: '#11181C', // or 50 to 900 DEFAULT
            primary: {
              50: '#f2eafa',
              100: '#e4d4f4',
              200: '#c9a9e9',
              300: '#ae7ede',
              400: '#9353d3',
              500: '#7828c8',
              600: '#6020a0',
              700: '#481878',
              800: '#301050',
              900: '#180828',
              foreground: '#FFFFFF',
              DEFAULT: '#7828c8'
            },
            secondary: {
              50: '#e6f1fe',
              100: '#cce3fd',
              200: '#99c7fb',
              300: '#66aaf9',
              400: '#338ef7',
              500: '#006FEE',
              600: '#005bc4',
              700: '#004493',
              800: '#002e62',
              900: '#001731',
              foreground: '#FFFFFF',
              DEFAULT: '#006FEE'
            }
            // ... rest of the colors
          }
        },
        dark: {
          colors: {
            background: '#000000', // or DEFAULT
            foreground: '#ECEDEE', // or 50 to 900 DEFAULT
            primary: {
              50: '#180828',
              100: '#301050',
              200: '#481878',
              300: '#6020a0',
              400: '#7828c8',
              500: '#9353d3',
              600: '#ae7ede',
              700: '#c9a9e9',
              800: '#e4d4f4',
              900: '#f2eafa',
              foreground: '#FFFFFF',
              DEFAULT: '#9353d3'
            },
            secondary: {
              50: '#001731',
              100: '#002e62',
              200: '#004493',
              300: '#005bc4',
              400: '#006FEE',
              500: '#338ef7',
              600: '#66aaf9',
              700: '#99c7fb',
              800: '#cce3fd',
              900: '#e6f1fe',
              foreground: '#FFFFFF',
              DEFAULT: '#338ef7'
            }
          }
          // ... rest of the colors
        }
      }
    })
  ]
}
export default config
