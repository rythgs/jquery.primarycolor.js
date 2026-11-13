import { assertValidSkip, detectColor, sortColors } from '../core/detectColor'
import type {
  PrimaryColorOptions,
  PrimaryColorResult,
  ResolvedPrimaryColorOptions,
} from '../core/types'

import { getImageData } from './imageData'

export const defaultPrimaryColorOptions: { readonly skip: 5 } = {
  skip: 5,
} as const satisfies ResolvedPrimaryColorOptions

export const resolvePrimaryColorOptions = (
  options: PrimaryColorOptions = {},
): ResolvedPrimaryColorOptions => {
  const resolved = { ...defaultPrimaryColorOptions, ...options }

  assertValidSkip(resolved.skip)

  return resolved
}

const shouldUseAnonymousCrossOrigin = (src: string): boolean => {
  try {
    const url = new URL(src, window.location.href)

    if (['blob:', 'data:', 'file:'].includes(url.protocol)) {
      return false
    }

    if (window.location.protocol === 'file:') {
      return false
    }

    return url.origin !== window.location.origin
  } catch {
    return false
  }
}

const loadImage = (element: HTMLImageElement): Promise<HTMLImageElement> => {
  const src = element.currentSrc || element.src
  const crossOrigin =
    element.crossOrigin ?? (shouldUseAnonymousCrossOrigin(src) ? 'anonymous' : null)

  // 読み込み済みで CORS モードを変えずに済む場合は、再リクエストせず要素をそのまま使う
  if (element.complete && element.naturalWidth > 0 && crossOrigin === element.crossOrigin) {
    return Promise.resolve(element)
  }

  return new Promise((resolve, reject) => {
    const img = new Image()

    if (crossOrigin) {
      img.crossOrigin = crossOrigin
    }
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load image.'))

    if (src) {
      img.src = src
    } else if (!element.srcset) {
      reject(new Error('Failed to load image.'))
    } else {
      // srcset のみで未読み込みの要素は currentSrc / src が空なので srcset ごと引き継ぐ
      img.sizes = element.sizes
      img.srcset = element.srcset
    }
  })
}

export const getPrimaryColor = async (
  element: HTMLImageElement,
  options: PrimaryColorOptions = {},
): Promise<PrimaryColorResult> => {
  const resolved = resolvePrimaryColorOptions(options)
  const img = await loadImage(element)
  const [primaryColor, colors] = detectColor(getImageData(img), resolved.skip)

  return {
    color: primaryColor.rgb,
    topColors: sortColors(colors).slice(0, 5),
    count: primaryColor.count,
  }
}

export class PrimaryColor {
  private primary = ''

  get primaryColor(): string {
    return this.primary
  }

  constructor(
    private readonly element: HTMLImageElement,
    private readonly options: ResolvedPrimaryColorOptions,
  ) {
    void this.load()
  }

  private async load(): Promise<void> {
    let result: PrimaryColorResult

    try {
      result = await getPrimaryColor(this.element, this.options)
    } catch {
      // 読み込み・CORS の失敗時はコールバックを呼ばない。コールバック自身の例外は握りつぶさない
      return
    }

    this.primary = result.color
    this.options.callback?.call(this.element, result.color, result.topColors)
  }

  static getImageData: typeof getImageData = getImageData

  static sortColors: typeof sortColors = sortColors
}
