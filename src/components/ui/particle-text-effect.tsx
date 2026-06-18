"use client"

import { useEffect, useRef } from "react"

interface Vec2 { x: number; y: number }

// BG color must match the hero section exactly
const BG = { r: 7, g: 7, b: 15 }

const WORDS  = ["EU", "SOU", "JOÃO VITOR"]
const COLORS = [
  { r: 196, g: 132, b: 252 }, // EU        → light purple
  { r: 168, g: 85,  b: 247 }, // SOU       → main purple
  { r: 240, g: 235, b: 255 }, // JOÃO VITOR → near-white
]

// How many frames to wait before advancing to the next word (≈ 60 fps)
// EU stays 3 s → SOU stays 3 s → JOÃO VITOR stays forever
const TIMINGS = [180, 180] // frames for EU, then SOU

class Particle {
  pos: Vec2 = { x: 0, y: 0 }
  vel: Vec2 = { x: 0, y: 0 }
  acc: Vec2 = { x: 0, y: 0 }
  target: Vec2 = { x: 0, y: 0 }

  closeEnoughTarget = 100
  maxSpeed = 1.0
  maxForce = 0.1
  isKilled = false

  startColor = { ...BG }
  targetColor = { ...BG }
  colorWeight = 0
  colorBlendRate = 0.008

  move() {
    const dx = this.target.x - this.pos.x
    const dy = this.target.y - this.pos.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const prox = dist < this.closeEnoughTarget ? dist / this.closeEnoughTarget : 1
    const mag  = dist || 1

    const steer = {
      x: (dx / mag) * this.maxSpeed * prox - this.vel.x,
      y: (dy / mag) * this.maxSpeed * prox - this.vel.y,
    }
    const sm = Math.sqrt(steer.x * steer.x + steer.y * steer.y) || 1
    this.acc.x += (steer.x / sm) * this.maxForce
    this.acc.y += (steer.y / sm) * this.maxForce

    this.vel.x += this.acc.x
    this.vel.y += this.acc.y
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    this.acc.x = 0
    this.acc.y = 0
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.colorWeight < 1)
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1)
    const r = Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight)
    const g = Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight)
    const b = Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight)
    ctx.fillStyle = `rgb(${r},${g},${b})`
    ctx.fillRect(this.pos.x, this.pos.y, 2, 2)
  }

  kill(w: number, h: number) {
    if (this.isKilled) return
    const cx = w / 2, cy = h / 2, mag = (w + h) / 2
    const dx = Math.random() * w - cx
    const dy = Math.random() * h - cy
    const m  = Math.sqrt(dx * dx + dy * dy) || 1
    this.target = { x: cx + (dx / m) * mag, y: cy + (dy / m) * mag }
    this.startColor = {
      r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
      g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
      b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
    }
    this.targetColor = { ...BG }
    this.colorWeight = 0
    this.isKilled = true
  }
}

export default function HeroParticleText() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    particles: [] as Particle[],
    frame: 0,
    wordIndex: 0,
    done: false,   // true once JOÃO VITOR is showing and settled
    raf: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width  = 900
    canvas.height = 160
    const ctx   = canvas.getContext("2d")!
    const state = stateRef.current

    ctx.fillStyle = `rgb(${BG.r},${BG.g},${BG.b})`
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const spawnPos = (): Vec2 => {
      const cx = canvas.width / 2, cy = canvas.height / 2
      const mag = (canvas.width + canvas.height) / 2
      const dx  = Math.random() * canvas.width  - cx
      const dy  = Math.random() * canvas.height - cy
      const m   = Math.sqrt(dx * dx + dy * dy) || 1
      return { x: cx + (dx / m) * mag, y: cy + (dy / m) * mag }
    }

    const showWord = (wordIdx: number) => {
      const word  = WORDS[wordIdx]
      const color = COLORS[wordIdx]

      const off = document.createElement("canvas")
      off.width  = canvas.width
      off.height = canvas.height
      const oc = off.getContext("2d")!
      oc.fillStyle    = "white"
      oc.font         = "900 82px system-ui, -apple-system, 'Segoe UI', sans-serif"
      oc.textAlign    = "center"
      oc.textBaseline = "middle"
      oc.fillText(word, canvas.width / 2, canvas.height / 2)

      const { data } = oc.getImageData(0, 0, canvas.width, canvas.height)
      const list = state.particles
      let pi = 0

      // Collect lit pixels then shuffle → fluid formation effect
      const coords: number[] = []
      for (let i = 0; i < data.length; i += 6 * 4) coords.push(i)
      for (let i = coords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [coords[i], coords[j]] = [coords[j], coords[i]]
      }

      for (const idx of coords) {
        if (data[idx + 3] === 0) continue
        const x = (idx / 4) % canvas.width
        const y = Math.floor(idx / 4 / canvas.width)

        let p: Particle
        if (pi < list.length) {
          p = list[pi]
          p.isKilled = false
          pi++
        } else {
          p = new Particle()
          const sp = spawnPos()
          p.pos  = { x: sp.x, y: sp.y }
          p.maxSpeed       = Math.random() * 3 + 2    // slower than default
          p.maxForce       = p.maxSpeed * 0.04
          p.colorBlendRate = Math.random() * 0.015 + 0.005
          list.push(p)
        }

        p.startColor = {
          r: p.startColor.r + (p.targetColor.r - p.startColor.r) * p.colorWeight,
          g: p.startColor.g + (p.targetColor.g - p.startColor.g) * p.colorWeight,
          b: p.startColor.b + (p.targetColor.b - p.startColor.b) * p.colorWeight,
        }
        p.targetColor = { ...color }
        p.colorWeight = 0
        p.target = { x, y }
      }

      // Kill any surplus particles from a denser previous word
      for (let i = pi; i < list.length; i++) list[i].kill(canvas.width, canvas.height)
    }

    const animate = () => {
      ctx.fillStyle = `rgba(${BG.r},${BG.g},${BG.b},0.15)`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const list = state.particles
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i]
        p.move()
        p.draw(ctx)
        if (p.isKilled && (
          p.pos.x < -10 || p.pos.x > canvas.width + 10 ||
          p.pos.y < -10 || p.pos.y > canvas.height + 10
        )) {
          list.splice(i, 1)
        }
      }

      state.frame++

      // One-time sequence: EU → SOU → JOÃO VITOR, then stop
      if (!state.done) {
        if (state.wordIndex === 0 && state.frame === TIMINGS[0]) {
          state.wordIndex = 1
          showWord(1)
        } else if (state.wordIndex === 1 && state.frame === TIMINGS[0] + TIMINGS[1]) {
          state.wordIndex = 2
          state.done = true
          showWord(2)
        }
      }

      state.raf = requestAnimationFrame(animate)
    }

    showWord(0)
    animate()

    return () => cancelAnimationFrame(state.raf)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ maxWidth: "100%", height: "auto", display: "block" }}
      aria-label="João Vitor"
    />
  )
}
