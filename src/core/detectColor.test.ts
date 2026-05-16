import { describe, expect, it } from 'vitest'

import { detectColor } from './detectColor'

type Pixel = readonly [red: number, green: number, blue: number, alpha?: number]

const createImageData = (pixels: Pixel[]): ImageData => {
  const data = new Uint8ClampedArray(pixels.length * 4)

  pixels.forEach(([red, green, blue, alpha = 255], index) => {
    const offset = index * 4

    data[offset] = red
    data[offset + 1] = green
    data[offset + 2] = blue
    data[offset + 3] = alpha
  })

  return { data, width: pixels.length, height: 1 } as ImageData
}

describe('detectColor', () => {
  it('最も多い色をプライマリカラーとして返す', () => {
    const imageData = createImageData([
      [255, 0, 0],
      [0, 255, 0],
      [0, 255, 0],
      [0, 255, 0],
    ])
    const [{ rgb, count }, colors] = detectColor(imageData)

    expect(rgb).toBe('0,255,0')
    expect(count).toBe(3)
    expect(colors['255,0,0']).toBe(1)
  })

  it('透明色をスキップする', () => {
    const imageData = createImageData([
      [255, 0, 0, 0],
      [0, 255, 0],
      [0, 255, 0],
    ])
    const [{ rgb, count }, colors] = detectColor(imageData)

    expect(rgb).toBe('0,255,0')
    expect(count).toBe(2)
    expect(
      Object.values(colors).reduce((acc, current) => acc + current, 0),
    ).toBe(2)
  })

  it('skip に応じて走査ピクセルを間引く', () => {
    const imageData = createImageData([
      [255, 0, 0],
      [0, 255, 0],
      [255, 0, 0],
      [0, 255, 0],
    ])
    const [{ rgb, count }, colors] = detectColor(imageData, 1)

    expect(rgb).toBe('255,0,0')
    expect(count).toBe(2)
    expect(colors['0,255,0']).toBeUndefined()
  })

  it.each([[-1], [0.5], [Number.NaN], [Number.POSITIVE_INFINITY]])(
    'skip が非負安全整数でない場合はエラーにする: %s',
    (skip) => {
      const imageData = createImageData([[255, 0, 0]])

      expect(() => detectColor(imageData, skip)).toThrow(
        'Please set "skip" to a non-negative safe integer.',
      )
    },
  )
})
