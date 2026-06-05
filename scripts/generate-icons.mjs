// Rasterize the app icon SVG into the PNG sizes the PWA manifest and iOS need.
// Run with: pnpm icons
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = new URL('../public/', import.meta.url)
const source = fileURLToPath(new URL('app-icon.svg', root))
const ogSource = fileURLToPath(new URL('og-image.svg', root))

const iconTargets = [
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
]

const out = (name) => fileURLToPath(new URL(name, root))

await Promise.all([
  ...iconTargets.map(({ size, name }) =>
    sharp(source).resize(size, size).png().toFile(out(name)),
  ),
  // Open Graph / Twitter card image (2:1 landscape).
  sharp(ogSource).resize(1200, 630).png().toFile(out('og-image.png')),
])

console.log(
  `generated ${iconTargets.map((t) => t.name).join(', ')}, og-image.png`,
)
