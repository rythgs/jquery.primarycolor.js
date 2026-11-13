import { getLabDistance, rgbToOKLab, sortColors, toRGBString } from './color'
import type { OKLabColor } from './color'
import type { ColorCounter, PrimaryColorObject, RGBString } from './types'

interface ColorBucket {
  blue: number
  count: number
  green: number
  red: number
}

interface QuantizedBucket extends ColorBucket {
  key: string
}

interface ColorCandidate extends ColorBucket {
  // マージ判定の基準色。平均色に追従させると走査順で結果が変わるため、最初のバケットの色で固定する
  lab: OKLabColor
}

const OKLAB_MERGE_THRESHOLD = 0.04
const QUANTIZE_SHIFT = 3

export const assertValidSkip = (skip: number): void => {
  if (!Number.isSafeInteger(skip) || skip < 0) {
    throw new Error('Please set "skip" to a non-negative safe integer.')
  }
}

const getQuantizedKey = (red: number, green: number, blue: number): string =>
  `${red >> QUANTIZE_SHIFT},${green >> QUANTIZE_SHIFT},${blue >> QUANTIZE_SHIFT}`

const toAverageRGBString = ({ blue, count, green, red }: ColorBucket): RGBString =>
  toRGBString(Math.round(red / count), Math.round(green / count), Math.round(blue / count))

const toAverageOKLab = ({ blue, count, green, red }: ColorBucket): OKLabColor =>
  rgbToOKLab(Math.round(red / count), Math.round(green / count), Math.round(blue / count))

// 出現数の多い順 (同数ならキー順) に並べ、走査順に依存しないマージ結果にする
const compareBuckets = (a: QuantizedBucket, b: QuantizedBucket): number =>
  b.count - a.count || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0)

export const detectColor = ({ data }: ImageData, skip = 0): [PrimaryColorObject, ColorCounter] => {
  assertValidSkip(skip)

  const buckets: Record<string, QuantizedBucket> = {}

  // 1px ごとに画像データを走査する ( 1px ごとに rgba の 4 要素ある )
  for (let px = 0, len = data.length; px < len; px += (skip + 1) * 4) {
    // 透明度を持つものは無視
    if ((data[px + 3] ?? 0) < 255) continue

    const red = data[px] ?? 0
    const green = data[px + 1] ?? 0
    const blue = data[px + 2] ?? 0
    const key = getQuantizedKey(red, green, blue)
    const bucket = buckets[key]

    if (bucket) {
      bucket.count += 1
      bucket.red += red
      bucket.green += green
      bucket.blue += blue
    } else {
      buckets[key] = { blue, count: 1, green, key, red }
    }
  }

  const candidates: ColorCandidate[] = []

  for (const { blue, count, green, red } of Object.values(buckets).sort(compareBuckets)) {
    const lab = toAverageOKLab({ blue, count, green, red })
    const candidate = candidates.find(
      (current) => getLabDistance(current.lab, lab) < OKLAB_MERGE_THRESHOLD,
    )

    if (candidate) {
      candidate.count += count
      candidate.red += red
      candidate.green += green
      candidate.blue += blue
    } else {
      candidates.push({ blue, count, green, lab, red })
    }
  }

  const colors: ColorCounter = {}

  for (const candidate of candidates) {
    const rgb = toAverageRGBString(candidate)

    colors[rgb] = (colors[rgb] ?? 0) + candidate.count
  }

  // 平均色が同じ候補は合算されるため、colors と食い違わないよう集計後の値から選ぶ
  const primary: PrimaryColorObject = { rgb: '', count: 0 }

  for (const [rgb, count] of Object.entries(colors)) {
    if (count > primary.count) {
      primary.rgb = rgb as RGBString
      primary.count = count
    }
  }

  return [primary, colors]
}

export { sortColors }
