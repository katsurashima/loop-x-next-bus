// Rasterize the app icon SVG into the PNG sizes the PWA manifest and iOS need.
// Run with: pnpm icons
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = new URL('../public/', import.meta.url)
const source = fileURLToPath(new URL('app-icon.svg', root))

const targets = [
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
]

await Promise.all(
  targets.map(({ size, name }) =>
    sharp(source)
      .resize(size, size)
      .png()
      .toFile(fileURLToPath(new URL(name, root))),
  ),
)

console.log(`generated ${targets.map((t) => t.name).join(', ')}`)
