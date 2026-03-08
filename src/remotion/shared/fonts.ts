import { loadFont as loadPoppins } from '@remotion/google-fonts/Poppins'
import { loadFont as loadSourceCodePro } from '@remotion/google-fonts/SourceCodePro'

const poppinsFont = loadPoppins('normal', {
  weights: ['400', '600', '700', '800', '900'],
})

const sourceCodeProFont = loadSourceCodePro('normal', {
  weights: ['400', '600', '700'],
  ignoreTooManyRequestsWarning: true,
})

export const poppinsFontFamily = poppinsFont.fontFamily
export const sourceCodeProFontFamily = sourceCodeProFont.fontFamily
