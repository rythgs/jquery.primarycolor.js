import fs from 'node:fs'
import path from 'node:path'

import $ from 'jquery'
import { describe, expect, it } from 'vitest'

describe('UMD bundle', () => {
  it('script tag 互換で $.fn.primaryColor を登録する', () => {
    const bundlePath = path.resolve('dist/jquery.primarycolor.umd.js')
    const bundle = fs.readFileSync(bundlePath, 'utf8')

    Object.assign(window, { $, jQuery: $ })
    window.eval(bundle)

    expect(typeof $.fn.primaryColor).toBe('function')
  })
})
