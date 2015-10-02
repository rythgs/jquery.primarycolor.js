# jquery.primarycolor.js

画像のプライマリカラーを取得する jQuery プラグイン

## Demo

http://rythgs.co/demo/primarycolor/

## How to use

```js
$(function() {
  $('img').primaryColor({
    callback: function(color) {
      $(this).parents('.wrapper').css('background-color', 'rgb('+color+')');
    }
  });
});
```

## License

MIT