import { describe, expect, it } from 'vitest'

import { getOKLabDistance, isApproximateColor, sortColors } from './color'

describe('getOKLabDistance', () => {
  it('知覚的に近い色ほど距離が小さい', () => {
    expect(getOKLabDistance('250,0,0', '248,2,1')).toBeLessThan(
      getOKLabDistance('250,0,0', '0,255,0'),
    )
  })
})

describe('isApproximateColor', () => {
  it('OKLab 距離で近似色であれば true', () => {
    expect(isApproximateColor('0,0,0', '1,1,1')).toBe(true)
  })

  it('引数が与えられなければ false', () => {
    expect(isApproximateColor('0,0,0', '')).toBe(false)
    expect(isApproximateColor('', '1,1,1')).toBe(false)
  })
})

describe('sortColors', () => {
  it('カラーパレットを出現回数の降順でソートする', () => {
    expect(
      sortColors({
        '0,0,0': 1,
        '1,1,1': 20,
        '3,3,244': 2,
        '244,244,244': 5,
      }),
    ).toEqual(['1,1,1', '244,244,244', '3,3,244', '0,0,0'])
  })
})
