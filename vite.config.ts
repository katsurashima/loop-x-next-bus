import { defineConfig } from 'vite'

// GitHub Pages project site is served from https://<user>.github.io/<repo>/,
// so the build must use the repo name as the base path.
export default defineConfig({
  base: '/loop-x-next-bus/',
})
