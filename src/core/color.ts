import type { ColorCounter, RGBString } from './types'

export const isApproximateColor = (
  color1: string,
  color2: string,
  threshold = 35,
): boolean => {
  if (!color1 || !color2) {
    return false
  }

  const [r1 = 0, g1 = 0, b1 = 0] = color1.split(',').map(Number)
  const [r2 = 0, g2 = 0, b2 = 0] = color2.split(',').map(Number)
  const r = r1 - r2
  const g = g1 - g2
  const b = b1 - b2
  const l = Math.sqrt(r * r + g * g + b * b)

  return l < threshold
}

export const toRGBString = (
  red: number,
  green: number,
  blue: number,
): RGBString => `${red},${green},${blue}`

export const sortColors = (colors: ColorCounter): RGBString[] =>
  Object.keys(colors).sort(
    (a, b) => (colors[b] ?? 0) - (colors[a] ?? 0),
  ) as RGBString[]
