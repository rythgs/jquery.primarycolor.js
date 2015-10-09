/**
 * -------------------------------------------------------------------------------------------
 * jquery.primarycolor.js v1.2.2
 * Licensed under MIT (https://github.com/rythgs/jquery.primarycolor.js/blob/master/LICENCE)
 * -------------------------------------------------------------------------------------------
 */
;(function($, window, document, undefined) {

  'use strict';

  var pluginName = 'primaryColor',
      dataName   = 'primary-color',
      defaults   = {
        skip: 5, // 総なめすると重いので 5px 飛ばしで走査する
        callback: null
      };

  function Plugin(element, options) {
    this.element   = element;
    this.settings  = $.extend({}, defaults, this.configure(options));
    this._defaults = defaults;
    this._name     = pluginName;
    this.primary   = { rgb: '', count: 0 };
    this.init();
  }

  $.extend(Plugin.prototype, {
    init: function() {
      $(new Image()).on('load', $.proxy(this.onLoad, this)).prop('src', this.element.src || '');
    },
    configure: function(options) {
      if ( typeof options === 'function' ) {
        return {callback: options};
      } else if ( typeof options === 'object' || !options ) {
        return options;
      }
      return {};
    },
    getImageData: function() {
      var canvas = document.createElement('canvas');
      canvas.width = this.element.width;
      canvas.height = this.element.height;
      var context = canvas.getContext('2d');
      context.drawImage(this.element, 0, 0);
      return context.getImageData(0, 0, this.element.width, this.element.height);
    },
    isApproximateColor: function(color1, color2) {
      if ( !color1 || !color2 ) {
        return false;
      }
      var c1 = color1.split(','),
          c2 = color2.split(','),
          r  = c1[0] - c2[0],
          g  = c1[1] - c2[1],
          b  = c1[2] - c2[2],
          l  = Math.sqrt(r * r + g * g + b * b);
      return l < 60;
    },
    onLoad: function() {
      var image_data   = this.getImageData(),
          data         = image_data.data,
          pixel_length = data.length / 4,
          // 取得した色の出現回数を格納しておく
          colors = {};

      // 1px ごとに画像データを走査する ( 1px ごとに rgba の 4 要素ある )
      for ( var px = 0; px < pixel_length; px = px + this.settings.skip * 4 ) {

        // 透明度を持つものは無視
        if ( data[px+3] < 255 ) {
          continue;
        }

        var rgb = [ data[px], data[px+1], data[px+2] ].join(',');
        // primary color との近似色判定
        if ( this.primary.rgb && this.isApproximateColor(this.primary.rgb, rgb) ) {
          rgb = this.primary.rgb;
        }

        // すでに同じ色が出現しているかカウント
        // 保持しているプライマリカラーより出現回数が多くなったら入れ替え
        colors[rgb] = colors[rgb] || 0;
        var count = ++colors[rgb];
        if ( count > this.primary.count ) {
          this.primary.rgb = rgb;
          this.primary.count = count;
        }
      }

      $.data(this.element, dataName, this.primary.rgb);

      if ( typeof this.settings.callback === 'function' ) {
        this.settings.callback.call(this.element, this.primary.rgb);
      }
    }
  });

  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if ( !$.data(this, 'plugin_' + pluginName) ) {
        $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
      }
    });
  };

})(jQuery, window, document);
