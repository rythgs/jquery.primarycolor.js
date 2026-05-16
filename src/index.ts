import './jquery'

export { getImageData } from './browser/imageData'
export {
  PrimaryColor,
  defaultPrimaryColorOptions,
  getPrimaryColor,
  resolvePrimaryColorOptions,
} from './browser/primaryColor'
export { isApproximateColor, sortColors } from './core/color'
export { detectColor } from './core/detectColor'

export type {
  ColorCounter,
  PrimaryColorCallback,
  PrimaryColorObject,
  PrimaryColorOptions,
  PrimaryColorResult,
  RGBString,
} from './core/types'
