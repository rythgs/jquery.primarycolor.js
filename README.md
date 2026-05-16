# jquery.primarycolor.js

Get the primary color of the image

## Demo

http://rythgs.co/demo/primarycolor/

## Install

```sh
npm install jquery.primarycolor.js jquery
```

## Modern API

```ts
import { getPrimaryColor } from 'jquery.primarycolor.js'

const image = document.querySelector('img')

if (image instanceof HTMLImageElement) {
  const { color, topColors } = await getPrimaryColor(image, { skip: 5 })

  document.body.style.backgroundColor = `rgb(${color})`
  console.log(topColors)
}
```

## jQuery plugin

```ts
import $ from 'jquery'
import 'jquery.primarycolor.js/jquery'

$(() => {
  $('img').primaryColor(function (color) {
    $(this).parents('.wrapper').css('background-color', `rgb(${color})`)
  })
})
```

Options:

```ts
$('img').primaryColor({
  skip: 5,
  callback(color, colors) {
    $(this).parents('.wrapper').css('background-color', `rgb(${color})`)
    console.log(colors)
  },
})
```

## UMD / script tag

```html
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="dist/jquery.primarycolor.umd.js"></script>

<script>
  $('img').primaryColor(function (color, colors) {
    $(this)
      .parents('.wrapper')
      .css('background-color', 'rgb(' + color + ')')
  })
</script>
```

## Legacy usage

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

## Package exports

- `jquery.primarycolor.js` — Promise-based TypeScript API
- `jquery.primarycolor.js/jquery` — jQuery plugin adapter

UMD is distributed as `dist/jquery.primarycolor.umd.js` for script tag usage.

## License

MIT
