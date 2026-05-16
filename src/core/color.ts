import type { ColorCounter, RGBString } from './types'

interface OKLabColor {
  a: number
  b: number
  lightness: number
}

const parseRGBString = (color: string): readonly [number, number, number] => {
  const [red = 0, green = 0, blue = 0] = color.split(',').map(Number)

  return [red, green, blue]
}

const toLinearSRGB = (channel: number): number => {
  const normalized = channel / 255

  return normalized <= 0.04045 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4)
}

const toOKLab = (color: string): OKLabColor => {
  const [red, green, blue] = parseRGBString(color)
  const linearRed = toLinearSRGB(red)
  const linearGreen = toLinearSRGB(green)
  const linearBlue = toLinearSRGB(blue)

  const l = Math.cbrt(
    0.412_221_470_8 * linearRed + 0.536_332_536_3 * linearGreen + 0.051_445_992_9 * linearBlue,
  )
  const m = Math.cbrt(
    0.211_903_498_2 * linearRed + 0.680_699_545_1 * linearGreen + 0.107_396_956_6 * linearBlue,
  )
  const s = Math.cbrt(
    0.088_302_461_9 * linearRed + 0.281_718_837_6 * linearGreen + 0.629_978_700_5 * linearBlue,
  )

  return {
    lightness: 0.210_454_255_3 * l + 0.793_617_785 * m - 0.004_072_046_8 * s,
    a: 1.977_998_495_1 * l - 2.428_592_205 * m + 0.450_593_709_9 * s,
    b: 0.025_904_037_1 * l + 0.782_771_766_2 * m - 0.808_675_766 * s,
  }
}

export const getOKLabDistance = (color1: string, color2: string): number => {
  const lab1 = toOKLab(color1)
  const lab2 = toOKLab(color2)
  const lightness = lab1.lightness - lab2.lightness
  const a = lab1.a - lab2.a
  const b = lab1.b - lab2.b

  return Math.sqrt(lightness * lightness + a * a + b * b)
}

export const isApproximateColor = (color1: string, color2: string, threshold = 0.08): boolean => {
  if (!color1 || !color2) {
    return false
  }

  return getOKLabDistance(color1, color2) < threshold
}

export const toRGBString = (red: number, green: number, blue: number): RGBString =>
  `${red},${green},${blue}`

export const sortColors = (colors: ColorCounter): RGBString[] =>
  Object.keys(colors).sort((a, b) => (colors[b] ?? 0) - (colors[a] ?? 0)) as RGBString[]
