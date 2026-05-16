import { afterEach, describe, expect, it, vi } from 'vitest'

import { PrimaryColor, getPrimaryColor } from './primaryColor'

const imageData = {
  data: new Uint8ClampedArray([
    0, 255, 0, 255, 0, 255, 0, 255, 255, 0, 0, 255, 0, 255, 0, 255,
  ]),
  height: 2,
  width: 2,
} as ImageData

const installCanvasMock = () => {
  const createElement = vi.spyOn(document, 'createElement')

  createElement.mockImplementation((tagName, options) => {
    if (tagName === 'canvas') {
      return {
        width: 0,
        height: 0,
        getContext: () => ({
          drawImage: vi.fn(),
          getImageData: vi.fn(() => imageData),
        }),
      } as unknown as HTMLCanvasElement
    }

    return Document.prototype.createElement.call(document, tagName, options)
  })
}

const installImageMock = () => {
  const images: TestImage[] = []

  class TestImage extends EventTarget {
    constructor() {
      super()
      images.push(this)
    }

    crossOrigin = ''

    currentSrc = ''

    height = 2

    naturalHeight = 2

    naturalWidth = 2

    onerror: (() => void) | null = null

    onload: (() => void) | null = null

    width = 2

    set src(value: string) {
      this.currentSrc = value
      queueMicrotask(() => this.onload?.())
    }

    get src(): string {
      return this.currentSrc
    }
  }

  vi.stubGlobal('Image', TestImage)

  return images
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('getPrimaryColor', () => {
  it('HTMLImageElement から Promise API でプライマリカラーを返す', async () => {
    installCanvasMock()
    installImageMock()

    const img = document.createElement('img')
    img.src = 'data:image/png;base64,test'

    await expect(getPrimaryColor(img, { skip: 0 })).resolves.toEqual({
      color: '0,255,0',
      count: 3,
      topColors: ['0,255,0', '255,0,0'],
    })
  })

  it('data URL には crossOrigin を設定しない', async () => {
    installCanvasMock()
    const images = installImageMock()

    const img = document.createElement('img')
    img.src = 'data:image/png;base64,test'

    await getPrimaryColor(img, { skip: 0 })

    expect(images[0]?.crossOrigin).toBe('')
  })
})

describe('PrimaryColor', () => {
  it('callback 互換 API を維持する', async () => {
    installCanvasMock()
    installImageMock()

    const img = document.createElement('img')
    img.src = 'data:image/png;base64,test'

    await new Promise<void>((resolve) => {
      const primaryColor = new PrimaryColor(img, {
        skip: 0,
        callback(color, topColors) {
          expect(color).toBe('0,255,0')
          expect(topColors).toEqual(['0,255,0', '255,0,0'])
          expect(primaryColor.primaryColor).toBe('0,255,0')
          resolve()
        },
      })
    })
  })
})
