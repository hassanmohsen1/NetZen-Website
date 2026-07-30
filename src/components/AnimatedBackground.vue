<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const canvas = ref(null)
let ctx = null
let rafId = null
let width = 0
let height = 0
let dpr = 1
let nodes = []
let packets = []
let intro = 0 // 0 -> 1 reveal progress
let running = true
let resizePending = false

const mouse = { x: -9999, y: -9999, active: false }

// Brand palette (RGB triplets)
const BLUE = '0, 91, 192'
const BLUE_LIGHT = '26, 113, 228'
const ORANGE = '190, 86, 0'

const LINK_DIST = 150
const MOUSE_DIST = 190

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function rand(min, max) {
  return min + Math.random() * (max - min)
}

function resize() {
  if (!canvas.value) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = window.innerWidth
  height = window.innerHeight
  canvas.value.width = Math.floor(width * dpr)
  canvas.value.height = Math.floor(height * dpr)
  canvas.value.style.width = width + 'px'
  canvas.value.style.height = height + 'px'
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  initNodes()
}

function initNodes() {
  // Density scales with viewport area, capped for performance
  const count = Math.min(Math.max(Math.floor((width * height) / 16000), 28), 95)
  nodes = []
  for (let i = 0; i < count; i++) {
    const hub = Math.random() < 0.14
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: rand(-0.22, 0.22),
      vy: rand(-0.22, 0.22),
      baseR: hub ? rand(2.4, 4) : rand(0.9, 1.9),
      hub,
      phase: Math.random() * Math.PI * 2,
    })
  }
  packets = []
}

function spawnPacket() {
  if (nodes.length < 2) return
  const a = nodes[(Math.random() * nodes.length) | 0]
  let best = null
  let bestD = LINK_DIST * LINK_DIST
  for (const b of nodes) {
    if (b === a) continue
    const dx = a.x - b.x
    const dy = a.y - b.y
    const d = dx * dx + dy * dy
    if (d < bestD) {
      bestD = d
      best = b
    }
  }
  if (best) {
    packets.push({ a, b: best, t: 0, speed: rand(0.006, 0.014), col: Math.random() < 0.5 ? ORANGE : BLUE_LIGHT })
  }
}

function step() {
  if (!running) return
  ctx.clearRect(0, 0, width, height)

  if (intro < 1) intro = Math.min(1, intro + 0.012)
  const ease = 1 - Math.pow(1 - intro, 3) // easeOutCubic

  // Update positions
  for (const n of nodes) {
    n.x += n.vx
    n.y += n.vy
    if (n.x < -20) n.x = width + 20
    else if (n.x > width + 20) n.x = -20
    if (n.y < -20) n.y = height + 20
    else if (n.y > height + 20) n.y = -20

    // Gentle repel from cursor
    if (mouse.active) {
      const dx = n.x - mouse.x
      const dy = n.y - mouse.y
      const d = Math.hypot(dx, dy)
      if (d < 130 && d > 0.01) {
        const f = ((130 - d) / 130) * 0.9
        n.x += (dx / d) * f
        n.y += (dy / d) * f
      }
    }
    n.phase += 0.02
  }

  // Draw links between nearby nodes
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i]
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j]
      const dx = a.x - b.x
      const dy = a.y - b.y
      const d = Math.hypot(dx, dy)
      if (d < LINK_DIST) {
        const alpha = (1 - d / LINK_DIST) * 0.16 * ease
        ctx.strokeStyle = `rgba(${BLUE}, ${alpha})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
    }
  }

  // Links to cursor
  if (mouse.active) {
    for (const n of nodes) {
      const d = Math.hypot(n.x - mouse.x, n.y - mouse.y)
      if (d < MOUSE_DIST) {
        const alpha = (1 - d / MOUSE_DIST) * 0.5
        ctx.strokeStyle = `rgba(${BLUE_LIGHT}, ${alpha})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(n.x, n.y)
        ctx.lineTo(mouse.x, mouse.y)
        ctx.stroke()
      }
    }
  }

  // Draw nodes with glow
  for (const n of nodes) {
    const col = n.hub ? ORANGE : BLUE
    const r = (n.baseR + (n.hub ? Math.sin(n.phase) * 0.7 : 0)) * ease
    if (r <= 0) continue

    // soft glow
    const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4)
    glow.addColorStop(0, `rgba(${col}, ${(n.hub ? 0.28 : 0.18) * ease})`)
    glow.addColorStop(1, `rgba(${col}, 0)`)
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2)
    ctx.fill()

    // core
    ctx.fillStyle = `rgba(${col}, ${(n.hub ? 0.95 : 0.65) * ease})`
    ctx.beginPath()
    ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
    ctx.fill()

    // hub ring
    if (n.hub) {
      ctx.strokeStyle = `rgba(${col}, ${0.25 * ease})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(n.x, n.y, r + 4 + Math.sin(n.phase) * 1.5, 0, Math.PI * 2)
      ctx.stroke()
    }
  }

  // Data packets travelling along edges
  for (let i = packets.length - 1; i >= 0; i--) {
    const p = packets[i]
    p.t += p.speed
    if (p.t >= 1) {
      packets.splice(i, 1)
      continue
    }
    const t = p.t
    const x = p.a.x + (p.b.x - p.a.x) * t
    const y = p.a.y + (p.b.y - p.a.y) * t
    // fade in/out along the path
    const fade = Math.sin(t * Math.PI)
    ctx.fillStyle = `rgba(${p.col}, ${0.95 * fade * ease})`
    ctx.shadowBlur = 10
    ctx.shadowColor = `rgba(${p.col}, ${0.9 * fade})`
    ctx.beginPath()
    ctx.arc(x, y, 2.2, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  }

  // Occasionally emit a new packet
  if (intro > 0.6 && packets.length < 22 && Math.random() < 0.05) spawnPacket()

  rafId = requestAnimationFrame(step)
}

function renderStatic() {
  // Reduced-motion: one calm static frame
  intro = 1
  ctx.clearRect(0, 0, width, height)
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i]
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j]
      const d = Math.hypot(a.x - b.x, a.y - b.y)
      if (d < LINK_DIST) {
        ctx.strokeStyle = `rgba(${BLUE}, ${(1 - d / LINK_DIST) * 0.14})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
    }
  }
  for (const n of nodes) {
    const col = n.hub ? ORANGE : BLUE
    ctx.fillStyle = `rgba(${col}, ${n.hub ? 0.9 : 0.6})`
    ctx.beginPath()
    ctx.arc(n.x, n.y, n.baseR, 0, Math.PI * 2)
    ctx.fill()
  }
}

function onResize() {
  if (resizePending) return
  resizePending = true
  requestAnimationFrame(() => {
    resizePending = false
    resize()
    if (prefersReduced) renderStatic()
  })
}

function onPointerMove(e) {
  mouse.x = e.clientX
  mouse.y = e.clientY
  mouse.active = true
}

function onPointerLeave() {
  mouse.active = false
  mouse.x = -9999
  mouse.y = -9999
}

function onVisibility() {
  if (document.hidden) {
    running = false
    if (rafId) cancelAnimationFrame(rafId)
  } else if (!prefersReduced) {
    running = true
    rafId = requestAnimationFrame(step)
  }
}

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  resize()
  if (prefersReduced) {
    renderStatic()
  } else {
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    rafId = requestAnimationFrame(step)
  }
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  running = false
  if (rafId) cancelAnimationFrame(rafId)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerleave', onPointerLeave)
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<template>
  <div class="animated-bg" aria-hidden="true">
    <!-- Soft colour wash for depth -->
    <div class="wash wash-1"></div>
    <div class="wash wash-2"></div>
    <!-- Interactive network -->
    <canvas ref="canvas" class="net-canvas"></canvas>
    <!-- Vignette to keep centre content readable -->
    <div class="vignette"></div>
  </div>
</template>

<style scoped>
.animated-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.net-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  animation: canvas-in 1.4s ease-out both;
}

@keyframes canvas-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.wash {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  will-change: transform;
}

.wash-1 {
  width: 620px;
  height: 620px;
  top: -12%;
  right: -6%;
  background: radial-gradient(circle, rgba(0, 91, 192, 0.16) 0%, transparent 70%);
  animation: wash-drift-1 16s ease-in-out infinite;
}

.wash-2 {
  width: 520px;
  height: 520px;
  bottom: -10%;
  left: -8%;
  background: radial-gradient(circle, rgba(190, 86, 0, 0.1) 0%, transparent 70%);
  animation: wash-drift-2 20s ease-in-out infinite;
}

@keyframes wash-drift-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-40px, 40px) scale(1.08); }
}

@keyframes wash-drift-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(40px, -30px) scale(1.1); }
}

.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 70% 55% at 50% 45%,
    rgba(249, 249, 255, 0.55) 0%,
    transparent 60%
  );
}

@media (prefers-reduced-motion: reduce) {
  .net-canvas { animation: none; }
  .wash-1,
  .wash-2 { animation: none; }
}
</style>
