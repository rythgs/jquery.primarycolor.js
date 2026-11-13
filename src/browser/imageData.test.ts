import { describe, expect, it } from 'vitest'

import { getImageData } from './imageData'

describe('getImageData', () => {
  it('サイズを持たない画像は分かりやすいエラーにする', () => {
    const img = { height: 0, naturalHeight: 0, naturalWidth: 0, width: 0 } as HTMLImageElement

    expect(() => getImageData(img)).toThrow('Image has no intrinsic size.')
  })
})
