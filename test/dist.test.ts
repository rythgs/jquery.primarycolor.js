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

  it('CJS exports are require-able', () => {
    Reflect.deleteProperty($.fn, 'primaryColor')

    const root = require('../dist/index.cjs')

    expect(typeof root.getPrimaryColor).toBe('function')
    expect($.fn.primaryColor).toBeUndefined()

    const jquery = require('../dist/jquery.cjs')

    expect(jquery.default).toBeDefined()
    expect(typeof $.fn.primaryColor).toBe('function')
  })
})
