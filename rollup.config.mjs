export default {
  input: 'dist/jquery.js',
  external: ['jquery'],
  output: {
    file: 'dist/jquery.primarycolor.umd.js',
    format: 'umd',
    exports: 'named',
    name: 'jqueryPrimaryColor',
    globals: {
      jquery: '$',
    },
    sourcemap: true,
  },
}
