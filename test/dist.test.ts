import { createRequire } from 'node:module'

import $ from 'jquery'
import { describe, expect, it } from 'vitest'

const require = createRequire(import.meta.url)

describe('package dist exports', () => {
  it('root ESM export exposes modern API without registering the jQuery plugin', async () => {
    Reflect.deleteProperty($.fn, 'primaryColor')

    const mod = await import('../dist/index.js')

    expect(typeof mod.getPrimaryColor).toBe('function')
    expect($.fn.primaryColor).toBeUndefined()
  })

  it('jQuery ESM subpath registers plugin', async () => {
    await import('../dist/jquery.js')

    expect(typeof $.fn.primaryColor).toBe('function')
  })

  it('CommonJS consumers can require() the ESM build through package exports', () => {
    const root = require('jquery.primarycolor.js')

    expect(typeof root.getPrimaryColor).toBe('function')

    const plugin = require('jquery.primarycolor.js/jquery')

    expect(typeof plugin.default.fn.primaryColor).toBe('function')
  })
})
