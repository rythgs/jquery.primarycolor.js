import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/jquery.ts'],
    format: ['esm', 'cjs'],
    // ブラウザ向けだが Node (SSR / テスト) からも読み込まれるため特定の実行環境を前提にしない
    platform: 'neutral',
    target: 'es2024',
    dts: true,
    sourcemap: true,
    outputOptions: { exports: 'named' },
  },
  {
    // script タグ向け UMD。dist/jquery.primarycolor.umd.js として出力される
    entry: { 'jquery.primarycolor': 'src/jquery.ts' },
    format: 'umd',
    platform: 'browser',
    target: 'es2024',
    globalName: 'jqueryPrimaryColor',
    sourcemap: true,
    dts: false,
    // 1 つ目の設定の出力を消さないようにする
    clean: false,
    outputOptions: {
      exports: 'named',
      // jQuery.noConflict() 後も参照できるよう $ ではなく jQuery を使う
      globals: { jquery: 'jQuery' },
    },
  },
])
