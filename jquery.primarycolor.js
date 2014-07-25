$.fn.primaryColor = function(opts) {

    var _defaults = {
        skip: 5,            // 総なめすると重いので 5px 飛ばしで走査する
        exclude: ['0,0,0'], // 除外する色 なんか黒が取得されるのでデフォルトで設定しとく
        callback: null
    };

    opts = $.extend({}, _defaults, opts);

    return this.each(function() {

        var canvas  = document.createElement('canvas'),
            context = canvas.getContext('2d'),
            image = new Image(),
            $self = $(this),
            color = $self.attr('data-primary-color');

        // すでに取得済みなら return;
        if ( color ) {
            if ( typeof opts.callback === 'function' ) {
                opts.callback.call($self[0], color);
            }
            return true;
        }

        $(image).on('load', function() {

            // canvas に画像を描画
            context.drawImage(this, 0, 0);

            // 画像データを取得
            var image_data   = context.getImageData(0, 0, image.width, image.height),
                pixel_length = image_data.data.length,
                data         = image_data.data;

            var colors = {},        // 取得した色の出現回数を格納しておく
                primary_color = {   // プライマリカラーを格納
                    rgb: '',
                    count: 0
                };

            // 1px ごとに画像データを走査する ( 1px ごとに rgba の 4 要素ある )
            for ( var px = 0; px < pixel_length; px = px + opts.skip * 4 ) {

                var rgb = [ data[px], data[px+1], data[px+2] ].join(',');

                // すでに同じ色が出現しているかカウントする
                // 除外カラーにあるものはカウントしない
                if ( !~$.inArray(rgb, opts.exclude) ) {
                    if ( rgb in colors ) {
                        colors[rgb]++;
                    } else {
                        colors[rgb] = 1;
                    }
                }

                var count = colors[rgb];

                // 保持しているプライマリカラーより出現回数が多くなったら入れ替え
                if ( count > primary_color.count ) {
                    primary_color.rgb = rgb;
                    primary_color.count = count;
                }
            }

            $self.attr('data-primary-color', primary_color.rgb);

            if ( typeof opts.callback === 'function' ) {
                opts.callback.call($self[0], primary_color.rgb);
            }
        });

        image.src = this.src || '';
    });
};