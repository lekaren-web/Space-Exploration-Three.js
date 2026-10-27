import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
import { bodies } from './bodies.js'
import { surface, ringTexture, glowTexture } from './textures.js'

const YEAR_SECONDS = 30 // one Earth orbit takes 30 seconds at 1× speed
const DAY_SECONDS = 2.5 // one Earth day takes 2.5 seconds at 1× speed
const HOME_BASE = new THREE.Vector3(0, 95, 235)
const HOME = HOME_BASE.clone()
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

// Renderer, camera, controls
const stage = document.getElementById('stage')
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
stage.append(renderer.domElement)
renderer.domElement.setAttribute('aria-hidden', 'true')

const labels = new CSS2DRenderer()
labels.domElement.className = 'labels'
labels.domElement.setAttribute('aria-hidden', 'true') // the Fly to list already names every body
stage.append(labels.domElement)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 4000)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.minDistance = 4
controls.maxDistance = 650
controls.enablePan = false

function resize() {
  const { clientWidth: w, clientHeight: h } = stage
  renderer.setSize(w, h)
  labels.setSize(w, h)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  // On tall, narrow screens look down from higher up, so the orbits fill the height instead of
  // shrinking into a thin band.
  if (camera.aspect < 0.8) HOME.set(0, 330, 120).multiplyScalar(Math.min(1.5, 0.62 / camera.aspect))
  else HOME.copy(HOME_BASE).multiplyScalar(Math.max(1, Math.min(1.8, 1.35 / camera.aspect)))
}
addEventListener('resize', resize)
resize()
camera.position.copy(HOME)

// Background stars
{
  const count = 5000
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const tints = [[1, 1, 1], [0.75, 0.85, 1], [1, 0.88, 0.75]]
  for (let i = 0; i < count; i++) {
    const r = 900 + Math.random() * 600
    const u = Math.random() * 2 - 1, t = Math.random() * Math.PI * 2, s = Math.sqrt(1 - u * u)
    positions.set([r * s * Math.cos(t), r * u, r * s * Math.sin(t)], i * 3)
    const tint = tints[(Math.random() * tints.length) | 0], b = 0.4 + Math.random() * 0.6
    colors.set(tint.map((c) => c * b), i * 3)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  scene.add(new THREE.Points(geometry, new THREE.PointsMaterial({ size: 1.6, sizeAttenuation: false, vertexColors: true })))
}

// Light comes from the Sun; a little ambient keeps night sides from going fully black.
scene.add(new THREE.PointLight(0xfff4e6, 2.6, 0, 0))
scene.add(new THREE.AmbientLight(0xffffff, 0.07))

// Bodies
const byId = new Map()
for (const b of bodies) {
  const group = new THREE.Group() // moves along the orbit
  const tilt = new THREE.Group() // holds the axial tilt
  tilt.rotation.z = THREE.MathUtils.degToRad(b.tilt || 0)
  group.add(tilt)

  const geometry = new THREE.SphereGeometry(b.radius, 64, 32)
  const material = b.id === 'sun'
    ? new THREE.MeshBasicMaterial({ map: surface('sun', 512) })
    : new THREE.MeshStandardMaterial({ map: surface(b.id, b.id === 'earth' ? 1024 : b.radius > 1 ? 512 : 256), roughness: 1, metalness: 0 })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.userData.id = b.id
  tilt.add(mesh)

  if (b.id === 'sun') {
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), blending: THREE.AdditiveBlending, depthWrite: false }))
    glow.scale.setScalar(b.radius * 7)
    group.add(glow)
  }
  if (b.id === 'earth') {
    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(b.radius * 1.02, 64, 32),
      new THREE.MeshStandardMaterial({ map: surface('clouds', 512), transparent: true, depthWrite: false }),
    )
    tilt.add(clouds)
    b.clouds = clouds
  }
  if (b.rings) {
    const inner = b.radius * 1.25, outer = b.radius * 2.3
    const ring = new THREE.RingGeometry(inner, outer, 128, 1)
    // Map texture u to distance from the center so the bands run around the ring.
    const pos = ring.attributes.position, uv = ring.attributes.uv, v = new THREE.Vector3()
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)
      uv.setXY(i, (v.length() - inner) / (outer - inner), 0.5)
    }
    const ringMesh = new THREE.Mesh(ring, new THREE.MeshStandardMaterial({ map: ringTexture(), transparent: true, side: THREE.DoubleSide, depthWrite: false }))
    ringMesh.rotation.x = -Math.PI / 2
    tilt.add(ringMesh)
  }

  const label = document.createElement('div')
  label.className = 'label'
  label.textContent = b.name
  const tag = new CSS2DObject(label)
  tag.position.set(0, b.radius + 1.6, 0)
  group.add(tag)

  const parent = b.parent ? byId.get(b.parent).group : scene
  parent.add(group)

  if (b.orbit) {
    const points = new THREE.EllipseCurve(0, 0, b.orbit, b.orbit).getPoints(256)
    const line = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(p.x, 0, p.y))),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: b.parent ? 0.18 : 0.1 }),
    )
    ;(b.parent ? byId.get(b.parent).group : scene).add(line)
  }

  byId.set(b.id, { ...b, group, mesh, label, start: Math.random() * Math.PI * 2, extra: 0 })
}
const meshes = [...byId.values()].map((b) => b.mesh)

// Simulation state
let time = 0
let speed = 1
let paused = reduceMotion
let focus = null
let flight = null // camera tween in progress
let align = null // planet-alignment tween in progress
const lastFocusPos = new THREE.Vector3()

function angle(b) {
  return b.start + b.extra + (time / (b.year * YEAR_SECONDS)) * Math.PI * 2
}

function place() {
  for (const b of byId.values()) {
    if (b.orbit) {
      const a = angle(b)
      b.group.position.set(Math.cos(a) * b.orbit, 0, -Math.sin(a) * b.orbit)
    }
  }
}

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function worldPos(b, out = new THREE.Vector3()) {
  return b.group.getWorldPosition(out)
}

function flyTo(id) {
  focus = id ? byId.get(id) : null
  const target = focus ? worldPos(focus) : new THREE.Vector3()
  let to
  if (focus) {
    const dir = camera.position.clone().sub(target).setY(0).normalize()
    const dist = focus.radius * (focus.id === 'sun' ? 4.2 : 6) + 4
    to = target.clone().add(dir.multiplyScalar(dist)).add(new THREE.Vector3(0, focus.radius * 1.6 + 1, 0))
  } else {
    to = HOME.clone()
  }
  flight = { from: camera.position.clone(), to, fromTarget: controls.target.clone(), toTarget: target, t: 0, duration: reduceMotion ? 0 : 1.4 }
  lastFocusPos.copy(target)
  ui.select(id)
}

function alignPlanets() {
  // Rotate every orbit forward to the same angle, the long way around for none of them.
  align = { t: 0, duration: reduceMotion ? 0 : 2.2, items: [] }
  for (const b of byId.values()) {
    if (!b.orbit || b.parent) continue
    const current = ((angle(b) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
    const delta = (Math.PI * 2 - current) % (Math.PI * 2)
    align.items.push({ b, from: b.extra, to: b.extra + delta })
  }
}

// Interface
const ui = (() => {
  const list = document.getElementById('bodies')
  const info = document.getElementById('info')
  const speedInput = document.getElementById('speed')
  const speedOut = document.getElementById('speed-out')
  const pauseBtn = document.getElementById('pause')
  const labelsBtn = document.getElementById('labels')

  for (const b of bodies) {
    const li = document.createElement('li')
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.dataset.id = b.id
    btn.setAttribute('aria-pressed', 'false')
    btn.innerHTML = `<span class="swatch" style="--c:${b.color}" aria-hidden="true"></span>`
    btn.append(b.name)
    if (b.parent) btn.classList.add('child')
    btn.addEventListener('click', () => flyTo(focus?.id === b.id ? null : b.id))
    li.append(btn)
    list.append(li)
  }

  function renderInfo(id) {
    info.dataset.state = id ? 'body' : 'overview'
    if (!id) {
      info.innerHTML = `<p class="kind">Overview</p><h2>The solar system</h2>
        <p>Pick a planet from the list or click one in the scene to fly there. Drag to look around, scroll or pinch to zoom.</p>
        <p class="note">Not to scale: sizes and distances are squeezed so everything fits. Orbit and day lengths keep their real ratios.</p>`
      return
    }
    const b = byId.get(id)
    info.innerHTML = `<p class="kind"></p><h2></h2><p class="text"></p><dl></dl>`
    info.querySelector('.kind').textContent = b.kind
    info.querySelector('h2').textContent = b.name
    info.querySelector('.text').textContent = b.text
    const dl = info.querySelector('dl')
    for (const [k, v] of b.facts) {
      const row = document.createElement('div')
      row.innerHTML = '<dt></dt><dd></dd>'
      row.querySelector('dt').textContent = k
      row.querySelector('dd').textContent = v
      dl.append(row)
    }
  }

  function select(id) {
    for (const btn of list.querySelectorAll('button')) btn.setAttribute('aria-pressed', String(btn.dataset.id === id))
    renderInfo(id)
  }

  function setPaused(p) {
    paused = p
    pauseBtn.textContent = paused ? 'Play' : 'Pause'
    pauseBtn.setAttribute('aria-pressed', String(paused))
  }

  speedInput.addEventListener('input', () => {
    speed = Number(speedInput.value)
    speedOut.textContent = `${speed}×`
  })
  pauseBtn.addEventListener('click', () => setPaused(!paused))
  document.getElementById('align').addEventListener('click', alignPlanets)
  document.getElementById('overview').addEventListener('click', () => flyTo(null))
  labelsBtn.addEventListener('click', () => {
    const on = labelsBtn.getAttribute('aria-pressed') !== 'true'
    labelsBtn.setAttribute('aria-pressed', String(on))
    labels.domElement.hidden = !on
  })
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && focus) flyTo(null)
  })

  setPaused(paused)
  renderInfo(null)
  return { select }
})()

// Click a body in the scene to fly to it (a drag doesn't count as a click).
const raycaster = new THREE.Raycaster()
let down = null
renderer.domElement.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY } })
renderer.domElement.addEventListener('pointerup', (e) => {
  if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 4) return
  const rect = renderer.domElement.getBoundingClientRect()
  const pointer = new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1)
  raycaster.setFromCamera(pointer, camera)
  const hit = raycaster.intersectObjects(meshes, false)[0]
  if (hit) flyTo(hit.object.userData.id)
})

// Labels: hide a label when its body is behind another one, and the Moon's unless you're near Earth.
const toBody = new THREE.Vector3()
function updateLabels() {
  if (labels.domElement.hidden) return
  for (const b of byId.values()) {
    worldPos(b, toBody)
    const dist = camera.position.distanceTo(toBody)
    raycaster.set(camera.position, toBody.clone().sub(camera.position).normalize())
    const hit = raycaster.intersectObjects(meshes, false)[0]
    const blocked = hit && hit.object.userData.id !== b.id && hit.distance < dist - b.radius
    const tooFar = b.parent && camera.position.distanceTo(worldPos(byId.get(b.parent))) > 45
    const focused = focus && focus.id === b.id
    b.label.style.visibility = blocked || tooFar || focused ? 'hidden' : ''
  }
}

// Loop
const clock = new THREE.Clock()
const now = new THREE.Vector3()
function frame() {
  const dt = Math.min(clock.getDelta(), 0.1)
  if (!paused) time += dt * speed

  if (align) {
    align.t = align.duration ? Math.min(1, align.t + dt / align.duration) : 1
    for (const { b, from, to } of align.items) b.extra = from + (to - from) * ease(align.t)
    if (align.t === 1) align = null
  }
  place()

  for (const b of byId.values()) {
    if (!b.day || paused) continue
    b.mesh.rotation.y += (dt * speed * Math.PI * 2) / ((b.day / 24) * DAY_SECONDS)
    if (b.clouds) b.clouds.rotation.y += (dt * speed * Math.PI * 2) / (1.3 * DAY_SECONDS)
  }
  byId.get('sun').mesh.rotation.y += paused ? 0 : dt * speed * 0.05

  if (flight) {
    // Keep aiming at the body while it moves during the flight.
    if (focus) flight.toTarget = worldPos(focus, now).clone()
    flight.t = flight.duration ? Math.min(1, flight.t + dt / flight.duration) : 1
    const k = ease(flight.t)
    const moved = focus ? flight.toTarget.clone().sub(lastFocusPos) : new THREE.Vector3()
    flight.to.add(moved)
    lastFocusPos.copy(flight.toTarget)
    camera.position.lerpVectors(flight.from, flight.to, k)
    controls.target.lerpVectors(flight.fromTarget, flight.toTarget, k)
    if (flight.t === 1) flight = null
  } else if (focus) {
    // Follow the focused body along its orbit.
    worldPos(focus, now)
    const moved = now.clone().sub(lastFocusPos)
    camera.position.add(moved)
    controls.target.add(moved)
    lastFocusPos.copy(now)
  }

  controls.update()
  updateLabels()
  renderer.render(scene, camera)
  labels.render(scene, camera)
  requestAnimationFrame(frame)
}
place()
document.body.classList.add('ready')
frame()
