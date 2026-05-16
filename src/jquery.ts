import $ from 'jquery'

import {
  PrimaryColor,
  defaultPrimaryColorOptions,
  resolvePrimaryColorOptions,
} from './browser/primaryColor'
import type { PrimaryColorCallback, PrimaryColorOptions } from './core/types'

type PrimaryColorPluginOptions = PrimaryColorOptions | PrimaryColorCallback

export interface PrimaryColorPlugin {
  (options?: PrimaryColorPluginOptions): JQuery
  options: Required<Pick<PrimaryColorOptions, 'skip'>> & Pick<PrimaryColorOptions, 'callback'>
}

declare global {
  interface JQuery<TElement = HTMLElement> {
    primaryColor: PrimaryColorPlugin & ((options?: PrimaryColorPluginOptions) => JQuery<TElement>)
  }
}

const jqueryWithPlugin = $ as JQueryStatic & {
  fn: JQuery & { primaryColor: PrimaryColorPlugin }
}

const normalizeOptions = (options?: PrimaryColorPluginOptions): PrimaryColorOptions =>
  typeof options === 'function'
    ? { ...jqueryWithPlugin.fn.primaryColor.options, callback: options }
    : { ...jqueryWithPlugin.fn.primaryColor.options, ...options }

const isImageElement = (element: Element): element is HTMLImageElement =>
  (typeof HTMLImageElement !== 'undefined' && element instanceof HTMLImageElement) ||
  element.tagName.toLowerCase() === 'img'

const pluginFunction = function primaryColor(
  this: JQuery,
  options?: PrimaryColorPluginOptions,
): JQuery {
  return this.each((_, element) => {
    if (!isImageElement(element)) {
      return
    }

    const opts = resolvePrimaryColorOptions(normalizeOptions(options))

    if (!$.data(element, 'primary-color')) {
      $.data(element, 'primary-color', new PrimaryColor(element as HTMLImageElement, opts))
    }
  })
} as PrimaryColorPlugin

pluginFunction.options = { ...defaultPrimaryColorOptions }

jqueryWithPlugin.fn.primaryColor = pluginFunction

export default $
export { getPrimaryColor } from './browser/primaryColor'
export type { PrimaryColorCallback, PrimaryColorOptions } from './core/types'
