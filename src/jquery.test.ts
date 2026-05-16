import $ from 'jquery'
import { afterEach, describe, expect, it, vi } from 'vitest'

import './jquery'

const installImageMock = () => {
  class TestImage extends EventTarget {
    crossOrigin = ''

    currentSrc = ''

    height = 1

    naturalHeight = 1

    naturalWidth = 1

    onerror: (() => void) | null = null

    onload: (() => void) | null = null

    width = 1

    set src(value: string) {
      this.currentSrc = value
    }

    get src(): string {
      return this.currentSrc
    }
  }

  vi.stubGlobal('Image', TestImage)
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('jquery plugin', () => {
  it('$.fn.primaryColor を登録し JQuery を返す', () => {
    installImageMock()

    const $img = $('<img src="data:image/png;base64,test" />')
    const result = $img.primaryColor(() => undefined)

    expect(typeof $.fn.primaryColor).toBe('function')
    expect(result).toBe($img)
    expect($.data($img[0], 'primary-color')).toBeDefined()
  })
})
