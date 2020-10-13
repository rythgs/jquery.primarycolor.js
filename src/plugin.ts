import $ from 'jquery'

import { PrimaryColor } from './lib/PrimaryColor'

$.fn.primaryColor = Object.assign<
  PrimaryColorFunction,
  PrimaryColorGlobalOptions
>(
  function primaryColor(
    this: JQuery,
    options: PrimaryColorOptions | Pick<PrimaryColorOptions, 'callback'>,
  ): JQuery {
    let opts: PrimaryColorOptions
    if (typeof options === 'function') {
      opts = $.extend({}, $.fn.primaryColor.options, { callback: options })
    } else {
      opts = $.extend({}, $.fn.primaryColor.options, options)
    }

    if (opts.skip < 1) {
      throw new Error('Please set "skip" to a value greater than 1.')
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
  },
  {
    options: {
      skip: 5,
    },
  },
)
