import { heroui } from '@heroui/react'

// HeroUI v2.8+ on Tailwind v4 is loaded as a CSS `@plugin` rather than from
// tailwind.config.ts. Referenced by src/app/globals.css.
export default heroui({
  addCommonColors: true,
  themes: {
    light: {
      colors: {
        background: '#FFFFFF',
        foreground: '#11181C',
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
          DEFAULT: '#7828c8'
        },
        focus: '#9353d3'
      }
    },
    dark: {
      colors: {
        background: '#000000',
        foreground: '#ECEDEE',
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
        },
        focus: '#9353d3'
      }
    }
  }
})
