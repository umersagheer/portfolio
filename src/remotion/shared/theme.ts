import { poppinsFontFamily, sourceCodeProFontFamily } from './fonts'

export const colors = {
  background: '#05070a',
  foreground: '#ECEDEE',
  white: '#ffffff',
  primary: '#9353d3',
  primaryLight: '#ae7ede',
  primaryDark: '#7828c8',
  secondary: '#338ef7',
  secondaryDark: '#006FEE',
  danger: '#f31260',
  border: '#27272a',
  codeBg: '#0d1117',
  codeBorder: '#30363d',
  muted: '#71717a',
  surface: '#111318',
  surfaceSoft: '#171a21',
  surfaceStrong: '#0b0d12',
}

export const gradient = `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`

export const fontFamily = {
  poppins: poppinsFontFamily,
  mono: sourceCodeProFontFamily,
}
