import { assertValidSkip, detectColor, sortColors } from '../core/detectColor'
import type {
  PrimaryColorOptions,
  PrimaryColorResult,
  ResolvedPrimaryColorOptions,
} from '../core/types'

import { getImageData } from './imageData'

export const defaultPrimaryColorOptions = {
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

const loadImage = (element: HTMLImageElement): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    const src = element.currentSrc || element.src

    if (element.crossOrigin) {
      img.crossOrigin = element.crossOrigin
    } else if (shouldUseAnonymousCrossOrigin(src)) {
      img.crossOrigin = 'anonymous'
    }
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load image.'))
    img.src = src
  })

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
    this.load().catch(() => undefined)
  }

  private async load(): Promise<void> {
    const result = await getPrimaryColor(this.element, this.options)

    this.primary = result.color
    this.options.callback?.call(this.element, result.color, result.topColors)
  }

  static getImageData = getImageData

  static sortColors = sortColors
}
