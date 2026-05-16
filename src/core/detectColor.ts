import { isApproximateColor, sortColors, toRGBString } from './color'
import type { ColorCounter, PrimaryColorObject } from './types'

export const assertValidSkip = (skip: number): void => {
  if (!Number.isSafeInteger(skip) || skip < 0) {
    throw new Error('Please set "skip" to a non-negative safe integer.')
  }
}

export const detectColor = (
  { data }: ImageData,
  skip = 0,
): [PrimaryColorObject, ColorCounter] => {
  assertValidSkip(skip)

  const primary: PrimaryColorObject = { rgb: '', count: 0 }
  const colors: ColorCounter = {}

  // 1px ごとに画像データを走査する ( 1px ごとに rgba の 4 要素ある )
  for (let px = 0, len = data.length; px < len; px += (skip + 1) * 4) {
    // 透明度を持つものは無視
    // eslint-disable-next-line no-continue
    if ((data[px + 3] ?? 0) < 255) continue

    const tmpRgb = toRGBString(
      data[px] ?? 0,
      data[px + 1] ?? 0,
      data[px + 2] ?? 0,
    )
    // primary color との近似色判定を行い
    // 近似色と判断されたら rgb を入れ替える
    const rgb =
      primary.rgb && isApproximateColor(primary.rgb, tmpRgb)
        ? primary.rgb
        : tmpRgb

    // すでに同じ色が出現しているかカウント
    // 保持しているプライマリカラーより出現回数が多くなったら入れ替え
    colors[rgb] = (colors[rgb] ?? 0) + 1
    if ((colors[rgb] ?? 0) > primary.count) {
      primary.rgb = rgb
      primary.count = colors[rgb] ?? 0
    }
  }

  return [primary, colors]
}

export { sortColors }
