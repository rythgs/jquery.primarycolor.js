/**
 * -------------------------------------------------------------------------------------------
 * jquery.primarycolor.js v1.3.0
 * Licensed under MIT (https://github.com/rythgs/jquery.primarycolor.js/blob/master/LICENCE)
 * -------------------------------------------------------------------------------------------
 */
;(function(factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('jquery'), window, document)
  } else {
    factory(jQuery, window, document)
  }
})(function($, window, document, undefined) {
  const pluginName = 'primaryColor'
  const dataName = 'primary-color'
  const defaults = {
    skip: 5, // 総なめすると重いので 5px 飛ばしで走査する
    callback: null
  }

  function Plugin(element, options) {
    this.element = element
    this.settings = $.extend({}, defaults, this.configure(options))
    this._defaults = defaults
    this._name = pluginName
    this.primary = {
      rgb: '',
      count: 0
    }
    this.init()
  }

  $.extend(Plugin.prototype, {
    init: function() {
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      $(img)
        .on('load', $.proxy(this.onLoad, this))
        .prop('src', this.element.src || '')
    },
    configure: function(options) {
      if (typeof options === 'function') {
        return {
          callback: options
        }
      } else if (typeof options === 'object' || !options) {
        return options
      }
      return {}
    },
    getImageData: function(img) {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.width = img.width
      canvas.height = img.height
      context.drawImage(img, 0, 0)
      return context.getImageData(0, 0, img.width, img.height)
    },
    isApproximateColor: function(color1, color2) {
      if (!color1 || !color2) {
        return false
      }
      const c1 = color1.split(',')
      const c2 = color2.split(',')
      const r = c1[0] - c2[0]
      const g = c1[1] - c2[1]
      const b = c1[2] - c2[2]
      const l = Math.sqrt(r * r + g * g + b * b)
      return l < 60
    },
    sortColors: function(colors) {
      return Object.keys(colors).sort(function(a, b) {
        return colors[b] - colors[a]
      })
    },
    onLoad: function(e) {
      const imageData = this.getImageData(e.currentTarget)
      const data = imageData.data
      const pixelLength = data.length / 4

      // 取得した色の出現回数を格納しておく

      const colors = {}

      // 1px ごとに画像データを走査する ( 1px ごとに rgba の 4 要素ある )
      for (let px = 0; px < pixelLength; px = px + this.settings.skip * 4) {
        // 透明度を持つものは無視
        if (data[px + 3] < 255) {
          continue
        }

        let rgb = [data[px], data[px + 1], data[px + 2]].join(',')
        // primary color との近似色判定
        if (this.primary.rgb && this.isApproximateColor(this.primary.rgb, rgb)) {
          rgb = this.primary.rgb
        }

        // すでに同じ色が出現しているかカウント
        // 保持しているプライマリカラーより出現回数が多くなったら入れ替え
        colors[rgb] = colors[rgb] || 0
        const count = ++colors[rgb]
        if (count > this.primary.count) {
          this.primary.rgb = rgb
          this.primary.count = count
        }
      }

      $.data(this.element, dataName, this.primary.rgb)

      if (typeof this.settings.callback === 'function') {
        this.settings.callback.call(this.element, this.primary.rgb, this.sortColors(colors).slice(0, 5))
      }
    }
  })

  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin(this, options))
      }
    })
  }
})
