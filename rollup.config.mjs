export default {
  input: 'dist/jquery.js',
  external: ['jquery'],
  output: {
    file: 'dist/jquery.primarycolor.umd.js',
    format: 'umd',
    exports: 'named',
    name: 'jqueryPrimaryColor',
    globals: {
      // jQuery.noConflict() 後も参照できるよう $ ではなく jQuery を使う
      jquery: 'jQuery',
    },
    sourcemap: true,
  },
}
