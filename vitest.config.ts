import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'lcov'],
    },
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'test/**/*.test.ts'],
  },
})
