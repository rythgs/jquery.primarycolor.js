import $ from 'jquery'

import { PrimaryColor, detectColor } from './lib/PrimaryColor'

export { detectColor }

function pluginFunction(
  this: JQuery,
  options: PrimaryColorOptions | Pick<PrimaryColorOptions, 'callback'>,
): JQuery {
  const opts: PrimaryColorOptions =
    typeof options === 'function'
      ? $.extend({}, $.fn.primaryColor.options, { callback: options })
      : $.extend({}, $.fn.primaryColor.options, options)

  if (opts.skip < 0) {
    throw new Error('Please set "skip" to a value greater than 0.')
  }

  return this.each((index, element) => {
    if (!$.data(element, 'primary-color')) {
      $.data(
        element,
        'primary-color',
        new PrimaryColor(element as HTMLImageElement, opts),
      )
    }
  })
}

pluginFunction.options = { skip: 5 }

$.fn.primaryColor = pluginFunction
