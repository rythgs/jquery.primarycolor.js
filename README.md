# jquery.primarycolor.js

Get the primary color of the image

## Demo

http://rythgs.co/demo/primarycolor/

## Install

```sh
bun add jquery.primarycolor.js jquery
```

## Modern API

The root export is side-effect free and does not register the jQuery plugin.

```ts
import { getPrimaryColor } from 'jquery.primarycolor.js'

const image = document.querySelector('img')

if (image instanceof HTMLImageElement) {
  const { color, topColors } = await getPrimaryColor(image, { skip: 5 })

  if (color) {
    document.body.style.backgroundColor = `rgb(${color})`
  }
  console.log(topColors)
}
```

Options:

- `skip`: non-negative safe integer. `5` means reading one pixel and skipping the next 5 pixels.

Notes:

- `color` is an RGB string such as `"12,34,56"`.
- `color` can be an empty string when no opaque pixel is found.
- Image loading, CORS, or tainted canvas failures reject the returned Promise.
- Cross-origin images require both `<img crossorigin="anonymous">` and an image server that sends a compatible `Access-Control-Allow-Origin` header. Without server-side CORS permission, browsers taint the canvas and block color extraction.

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

Plugin notes:

- Non-image elements are ignored and the original jQuery object is returned.
- Each image element is processed once. Later calls for the same element keep the first options/callback.
- Image loading, CORS, or tainted canvas failures do not call the callback.

## UMD / script tag

```html
<script src="https://code.jquery.com/jquery-4.0.0.min.js"></script>
<script src="dist/jquery.primarycolor.umd.js"></script>

<!-- Or from a CDN: -->
<!-- <script src="https://cdn.jsdelivr.net/npm/jquery.primarycolor.js/dist/jquery.primarycolor.umd.js"></script> -->

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

- `jquery.primarycolor.js` — side-effect-free Promise-based TypeScript API
- `jquery.primarycolor.js/jquery` — jQuery plugin adapter that registers `$.fn.primaryColor`

UMD is distributed as `dist/jquery.primarycolor.umd.js` for script tag usage.

If you use the jQuery plugin from a bundler, import `jquery.primarycolor.js/jquery`
explicitly. Importing `jquery.primarycolor.js` alone does not register the plugin.

## License

MIT
