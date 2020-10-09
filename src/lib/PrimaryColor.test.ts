/**
 * @jest-environment jsdom
 */

import { PrimaryColor } from './PrimaryColor'

describe('isApproximateColor', () => {
  it('近似色であれば true', () => {
    const result = PrimaryColor.isApproximateColor('0,0,0', '1,1,1')
    expect(result).toBe(true)
  })
  it('引数が与えられなければ false', () => {
    const result1 = PrimaryColor.isApproximateColor('0,0,0', '')
    expect(result1).toBe(false)
    const result2 = PrimaryColor.isApproximateColor('', '1,1,1')
    expect(result2).toBe(false)
  })
})

describe('sortColors', () => {
  it('カラーパレット降順ソート確認', () => {
    const data = {
      '0,0,0': 1,
      '1,1,1': 20,
      '3,3,244': 2,
      '244,244,244': 5,
    }
    const result = PrimaryColor.sortColors(data)
    expect(result).toEqual(['1,1,1', '244,244,244', '3,3,244', '0,0,0'])
  })
})

describe('PrimaryColor', () => {
  it('getter', () => {
    const img = document.createElement('img')
    const result = new PrimaryColor(img, { skip: 5 })
    expect(result.primaryColor).toEqual('')
  })

  it('not Image element', () => {
    const div = document.createElement('div')
    const result = new PrimaryColor(div, { skip: 5 })
    expect(result.primaryColor).toEqual('')
  })
})
