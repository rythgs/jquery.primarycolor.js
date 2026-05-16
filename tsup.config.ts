import { defineConfig } from 'tsup'

export default defineConfig({
  clean: false,
  dts: true,
  entry: ['src/index.ts', 'src/jquery.ts'],
  external: ['jquery'],
  format: ['esm', 'cjs'],
  outDir: 'dist',
  sourcemap: true,
  target: 'es2022',
})
