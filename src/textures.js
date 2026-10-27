// Planet surfaces painted in code. Each texture is an equirectangular canvas: every pixel is mapped to
// a point on a unit sphere and colored from 3D value noise, so there's no seam at the date line and no
// pinching at the poles.
import * as THREE from 'three'

function hash(x, y, z) {
  let h = (x * 374761393 + y * 668265263 + z * 2147483647) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295
}

function smooth(t) { return t * t * (3 - 2 * t) }
function lerp(a, b, t) { return a + (b - a) * t }

function noise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z)
  const xf = smooth(x - xi), yf = smooth(y - yi), zf = smooth(z - zi)
  const c = (dx, dy, dz) => hash(xi + dx, yi + dy, zi + dz)
  return lerp(
    lerp(lerp(c(0, 0, 0), c(1, 0, 0), xf), lerp(c(0, 1, 0), c(1, 1, 0), xf), yf),
    lerp(lerp(c(0, 0, 1), c(1, 0, 1), xf), lerp(c(0, 1, 1), c(1, 1, 1), xf), yf),
    zf,
  )
}

function fbm(x, y, z, octaves = 5) {
  let sum = 0, amp = 0.5, freq = 1, norm = 0
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise(x * freq, y * freq, z * freq)
    norm += amp
    amp *= 0.5
    freq *= 2
  }
  return sum / norm
}

function hex(c) {
  const n = parseInt(c.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

// Pick a color from a list of stops for t in [0, 1].
function ramp(stops, t) {
  const cols = stops.map(hex)
  const x = Math.min(0.9999, Math.max(0, t)) * (cols.length - 1)
  const i = Math.floor(x), f = x - i
  return cols[i].map((v, k) => v + (cols[i + 1][k] - v) * f)
}

function paint(width, shade) {
  const height = width / 2
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(width, height)
  for (let py = 0; py < height; py++) {
    const lat = (0.5 - py / height) * Math.PI
    for (let px = 0; px < width; px++) {
      const lon = (px / width) * Math.PI * 2
      const x = Math.cos(lat) * Math.cos(lon), y = Math.sin(lat), z = Math.cos(lat) * Math.sin(lon)
      const [r, g, b, a = 255] = shade(x, y, z, lat, lon)
      const i = (py * width + px) * 4
      img.data[i] = r
      img.data[i + 1] = g
      img.data[i + 2] = b
      img.data[i + 3] = a
    }
  }
  ctx.putImageData(img, 0, 0)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

// Gas giants: color by latitude, with the bands pushed around by noise so they swirl.
function banded(stops, { k = 9, warp = 0.35, s = 3 } = {}) {
  return (x, y, z, lat) => {
    const w = fbm(x * s, y * s * 2, z * s, 4) - 0.5
    const band = 0.5 + 0.5 * Math.sin(lat * k + w * warp * 10)
    const grain = (fbm(x * 12, y * 30, z * 12, 3) - 0.5) * 0.12
    return ramp(stops, band + grain)
  }
}

const shaders = {
  sun: (x, y, z) => {
    const n = fbm(x * 4, y * 4, z * 4) * 0.7 + fbm(x * 18, y * 18, z * 18, 3) * 0.3
    return ramp(['#d9480f', '#f76707', '#ff922b', '#ffc078', '#fff3bf'], n * 1.15)
  },
  mercury: (x, y, z) => {
    const n = fbm(x * 5, y * 5, z * 5)
    const crater = fbm(x * 22, y * 22, z * 22, 2)
    return ramp(['#5c5853', '#8a857e', '#b5b0a8', '#d3cec6'], n + (crater > 0.66 ? -0.25 : 0))
  },
  venus: (x, y, z, lat) => {
    const n = fbm(x * 3 + lat, y * 6, z * 3, 5)
    return ramp(['#b8894e', '#d9b373', '#ecd5a1', '#f5e6c4'], n * 1.1)
  },
  earth: (x, y, z, lat) => {
    const land = fbm(x * 2.2 + 3, y * 2.2, z * 2.2 - 1, 6)
    if (Math.abs(lat) > 1.25 + (land - 0.5) * 0.3) return hex('#eef4f8')
    if (land > 0.55) {
      const dry = fbm(x * 6, y * 6, z * 6, 3)
      return Math.abs(lat) < 0.45 && dry > 0.55 ? ramp(['#b08d57', '#c9a96e'], dry) : ramp(['#2f6b34', '#4f8a3c', '#7a8f4a'], (land - 0.55) * 4)
    }
    return ramp(['#0b2f63', '#164d8c', '#2a6fb0'], land * 1.6)
  },
  clouds: (x, y, z) => {
    const n = fbm(x * 4 + 7, y * 6, z * 4, 5)
    const a = Math.max(0, (n - 0.5) * 3.2)
    return [255, 255, 255, Math.min(220, a * 255)]
  },
  moon: (x, y, z) => {
    const maria = fbm(x * 2.5, y * 2.5, z * 2.5, 4)
    const n = fbm(x * 14, y * 14, z * 14, 4)
    return ramp(['#5f5f62', '#8d8d90', '#b4b4b6', '#d6d6d6'], n * 0.6 + (maria > 0.58 ? 0.05 : 0.38))
  },
  mars: (x, y, z, lat) => {
    if (Math.abs(lat) > 1.35) return hex('#f1ece4')
    const n = fbm(x * 4, y * 4, z * 4)
    return ramp(['#6e2a16', '#9c4426', '#c46a3d', '#dd935e'], n * 1.1)
  },
  jupiter: (x, y, z, lat, lon) => {
    const base = banded(['#8f5a37', '#c99a6b', '#efe2c9', '#b98457', '#e6d0ad', '#a86f46'], { k: 11 })(x, y, z, lat)
    // Great Red Spot, about 22° south.
    const dLat = (lat + 0.38) / 0.09, dLon = (((lon - 4.2 + Math.PI) % (Math.PI * 2)) - Math.PI) / 0.22
    const d = dLat * dLat + dLon * dLon
    if (d < 1) return ramp(['#b4462a', '#d07a4f'], d)
    return base
  },
  saturn: banded(['#bfa46a', '#d9c28e', '#efe2bd', '#cdb57e', '#e3d2a2'], { k: 13, warp: 0.15 }),
  uranus: banded(['#8fcfd8', '#a6dde3', '#b9e6ea'], { k: 6, warp: 0.08, s: 2 }),
  neptune: (x, y, z, lat, lon) => {
    const base = banded(['#2b4fb3', '#3a63cf', '#4f7be0', '#3456be'], { k: 7, warp: 0.2 })(x, y, z, lat)
    const dLat = (lat + 0.35) / 0.1, dLon = (((lon - 2 + Math.PI) % (Math.PI * 2)) - Math.PI) / 0.2
    return dLat * dLat + dLon * dLon < 1 ? hex('#1b2f7a') : base
  },
  pluto: (x, y, z, lat, lon) => {
    const n = fbm(x * 4, y * 4, z * 4)
    // Tombaugh Regio, the bright "heart", near the equator.
    const dLat = (lat - 0.2) / 0.45, dLon = (((lon - Math.PI + Math.PI) % (Math.PI * 2)) - Math.PI) / 0.5
    if (dLat * dLat + dLon * dLon < 1 + (n - 0.5)) return ramp(['#efe3d2', '#f8f1e6'], n)
    return ramp(['#5a3f2e', '#8a6248', '#b78d6c', '#d1b294'], n * 1.15)
  },
}

export function surface(id, width = 512) {
  return paint(width, shaders[id])
}

// Saturn's rings: bands of varying brightness, with the Cassini Division as a dark gap.
export function ringTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 1
  const ctx = canvas.getContext('2d')
  for (let x = 0; x < 512; x++) {
    const t = x / 511
    const cassini = t > 0.58 && t < 0.64
    const a = cassini ? 0.06 : 0.25 + 0.55 * noise(t * 40, 0, 0) * (t < 0.15 ? t / 0.15 : 1) * (t > 0.92 ? (1 - t) / 0.08 : 1)
    const [r, g, b] = ramp(['#8a7b5c', '#d8c8a0', '#efe3c4'], noise(t * 18, 3, 0))
    ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${a})`
    ctx.fillRect(x, 0, 1, 1)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// Soft radial glow for the Sun.
export function glowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 256
  const ctx = canvas.getContext('2d')
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  g.addColorStop(0, 'rgba(255, 210, 140, 0.9)')
  g.addColorStop(0.25, 'rgba(255, 160, 70, 0.35)')
  g.addColorStop(0.6, 'rgba(255, 120, 40, 0.08)')
  g.addColorStop(1, 'rgba(255, 120, 40, 0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}
