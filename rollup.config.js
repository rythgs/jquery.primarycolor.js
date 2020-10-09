import babel from '@rollup/plugin-babel'
import sourcemaps from 'rollup-plugin-sourcemaps'

export default {
  input: 'dist/plugin.js',
  output: {
    file: 'dist/plugin-bundle.js',
    format: 'iife',
    sourcemap: true,
    globals: {
      jquery: 'jQuery',
    },
  },
  external: ['jquery'],
  plugins: [
    babel({ exclude: 'node_modules/**', babelHelpers: 'bundled' }),
    sourcemaps(),
  ],
}
