import { isApproximateColor, sortColors, toRGBString } from './color'
import type { ColorCounter, PrimaryColorObject, RGBString } from './types'

interface ColorBucket {
  blue: number
  count: number
  green: number
  red: number
}

interface ColorCandidate extends ColorBucket {
  rgb: RGBString
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

export const detectColor = ({ data }: ImageData, skip = 0): [PrimaryColorObject, ColorCounter] => {
  assertValidSkip(skip)

  const buckets: Record<string, ColorBucket> = {}

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
      buckets[key] = { blue, count: 1, green, red }
    }
  }

  const candidates: ColorCandidate[] = []

  for (const bucket of Object.values(buckets)) {
    const rgb = toAverageRGBString(bucket)
    const candidate = candidates.find((current) =>
      isApproximateColor(current.rgb, rgb, OKLAB_MERGE_THRESHOLD),
    )

    if (candidate) {
      candidate.count += bucket.count
      candidate.red += bucket.red
      candidate.green += bucket.green
      candidate.blue += bucket.blue
      candidate.rgb = toAverageRGBString(candidate)
    } else {
      candidates.push({ ...bucket, rgb })
    }
  }

  const primary: PrimaryColorObject = { rgb: '', count: 0 }
  const colors: ColorCounter = {}

  for (const candidate of candidates) {
    colors[candidate.rgb] = (colors[candidate.rgb] ?? 0) + candidate.count

    if (candidate.count > primary.count) {
      primary.rgb = candidate.rgb
      primary.count = candidate.count
    }
  }

  return [primary, colors]
}

export { sortColors }
