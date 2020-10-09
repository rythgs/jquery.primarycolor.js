# jquery.primarycolor.js

Get the primary color of the image

## Demo

http://rythgs.co/demo/primarycolor/

## How to use

```js
$(function () {
  $('img').primaryColor(function (color, colors) {
    $(this)
      .parents('.wrapper')
      .css('background-color', 'rgb(' + color + ')')
  })
})
```

### Callback function

| arguments | type   | desc          |
| --------- | ------ | ------------- |
| color     | string | Primary color |
| colors    | array  | Top 5 colors  |

## License

MIT
