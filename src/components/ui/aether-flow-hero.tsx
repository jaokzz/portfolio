"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { GooeyText } from "./gooey-text-morphing";

/* ── Particle canvas — desktop only ────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Skip on mobile — too heavy for phones
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let cw = 0, ch = 0; // cached dimensions
    const mouse = { x: -9999, y: -9999, radius: 160 };

    class Particle {
      x: number; y: number; ox: number; oy: number;
      vx: number; vy: number;
      phase: number; speed: number; amplitude: number;
      size: number; opacity: number; color: string;
      t = 0;

      constructor(w: number, h: number) {
        this.ox = this.x = Math.random() * w;
        this.oy = this.y = Math.random() * h;
        this.vx = 0; this.vy = 0;
        this.phase = Math.random() * Math.PI * 2;
        this.speed = 0.002 + Math.random() * 0.003;
        this.amplitude = 30 + Math.random() * 50;
        this.size = Math.random() * 1.6 + 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        const shades = ["168,85,247", "196,132,252", "139,92,246", "124,58,237"];
        this.color = shades[Math.floor(Math.random() * shades.length)];
      }

      update(w: number, h: number) {
        this.t += this.speed;
        const tx = this.ox + Math.sin(this.t + this.phase) * this.amplitude;
        const ty = this.oy + Math.cos(this.t * 1.3 + this.phase) * (this.amplitude * 0.6);
        const dx = mouse.x - this.x, dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.vx -= (dx / dist) * force * 5;
          this.vy -= (dy / dist) * force * 5;
        }
        this.vx += (tx - this.x) * 0.015;
        this.vy += (ty - this.y) * 0.015;
        this.vx *= 0.85; this.vy *= 0.85;
        this.x += this.vx; this.y += this.vy;
        if (this.x < -10) this.x = w + 10;
        if (this.x > w + 10) this.x = -10;
        if (this.y < -10) this.y = h + 10;
        if (this.y > h + 10) this.y = -10;
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${this.color},${this.opacity})`;
        ctx!.fill();
      }
    }

    let particles: Particle[] = [];
    const init = (w: number, h: number) => {
      cw = w; ch = h;
      particles = [];
      // Cap at 120 particles even on large screens
      const n = Math.min(Math.floor((w * h) / 8000), 120);
      for (let i = 0; i < n; i++) particles.push(new Particle(w, h));
    };

    const connect = (w: number, h: number) => {
      const threshold = 120 * 120;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < threshold) {
            const op = (1 - d2 / threshold) * 0.25;
            const nearMouse =
              Math.hypot(particles[a].x - mouse.x, particles[a].y - mouse.y) < mouse.radius;
            ctx!.strokeStyle = nearMouse
              ? `rgba(196,132,252,${op * 2})`
              : `rgba(124,58,237,${op})`;
            ctx!.lineWidth = 0.5;
            ctx!.beginPath();
            ctx!.moveTo(particles[a].x, particles[a].y);
            ctx!.lineTo(particles[b].x, particles[b].y);
            ctx!.stroke();
          }
        }
      }
    };

    const resize = () => {
      cw = canvas!.offsetWidth;
      ch = canvas!.offsetHeight;
      canvas!.width = cw;
      canvas!.height = ch;
      init(cw, ch);
    };

    const animate = () => {
      raf = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, cw, ch);
      particles.forEach((p) => { p.update(cw, ch); p.draw(); });
      connect(cw, ch);
    };

    // RAF-throttled mouse — avoids running more than once per frame
    let mouseScheduled = false;
    const onMove = (e: MouseEvent) => {
      if (mouseScheduled) return;
      mouseScheduled = true;
      requestAnimationFrame(() => {
        const r = canvas!.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
        mouseScheduled = false;
      });
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    resize();
    animate();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Hidden on mobile via CSS — canvas is never initialized there anyway
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full hidden md:block" />;
}

/* ── Magnetic button ────────────────────────────────── */
function MagneticCTA({ href, children, variant = "primary" }: {
  href: string; children: React.ReactNode; variant?: "primary" | "ghost";
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  const isPrimary = variant === "primary";
  return (
    <motion.a
      ref={ref}
      href={href}
      style={isPrimary
        ? { x: sx, y: sy, background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 0 28px rgba(168,85,247,0.45)" }
        : { x: sx, y: sy, borderColor: "rgba(168,85,247,0.35)", background: "rgba(168,85,247,0.05)" }
      }
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={isPrimary
        ? { boxShadow: "0 0 50px rgba(168,85,247,0.7)" }
        : { borderColor: "rgba(168,85,247,0.7)", background: "rgba(168,85,247,0.1)" }
      }
      whileTap={{ scale: 0.96 }}
      className={isPrimary
        ? "group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-sm overflow-hidden text-white border border-transparent"
        : "group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-sm border text-purple-300"
      }
    >
      {isPrimary && (
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 skew-x-12" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.a>
  );
}

/* ── Stagger variants ───────────────────────────────── */
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.25 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: "easeOut" as const } },
};

/* ── Hero ───────────────────────────────────────────── */
export default function AetherFlowHero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#07070f" }}
    >
      {/* Grid pattern */}
      <div className="absolute inset-0 z-0 grid-pattern opacity-50" />

      {/* Radial purple glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse, rgba(168,85,247,0.07) 0%, transparent 70%)" }}
      />

      {/* Particle canvas — desktop only */}
      <div className="absolute inset-0 z-1">{mounted && <ParticleCanvas />}</div>

      {/* Content */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-28 sm:pt-36"
      >

        {/* Name */}
        <motion.div variants={fadeUp}>
          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[105px] font-black tracking-tighter leading-none mb-2">
            <span className="text-white">João </span>
            <span className="gradient-purple">Vitor</span>
          </h1>
        </motion.div>

        {/* Gooey role */}
        <motion.div variants={fadeUp} className="h-16 sm:h-20 md:h-24 flex items-center justify-center my-4">
          <GooeyText
            texts={["Dev Frontend", "Automações", "Next.js", "Web Designer", "Criativo"]}
            morphTime={1.3}
            cooldownTime={2}
            className="w-full h-full"
            textClassName="text-3xl sm:text-4xl md:text-5xl font-bold gradient-purple"
          />
        </motion.div>

        {/* Description */}
        <motion.p
          variants={fadeUp}
          className="max-w-lg mx-auto text-base md:text-lg text-zinc-400 leading-relaxed mb-8 sm:mb-12"
        >
          Construo experiências digitais que{" "}
          <span className="text-purple-300 font-medium">surpreendem</span>. Sites modernos,
          landing pages de alta conversão e automações para WhatsApp — Iporã do Oeste, SC.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          <MagneticCTA href="#projects" variant="primary">
            Ver Projetos
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </MagneticCTA>
          <MagneticCTA href="#contact" variant="ghost">
            Entrar em contato
          </MagneticCTA>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeUp} className="mt-10 flex items-center justify-center gap-6 sm:gap-12 text-center">
          {[
            { v: "15+", l: "Projetos" },
            { v: "3+", l: "Anos" },
            { v: "100%", l: "Satisfação" },
          ].map((s) => (
            <div key={s.l} className="flex flex-col gap-0.5">
              <span className="text-2xl sm:text-3xl font-black gradient-purple">{s.v}</span>
              <span className="text-xs text-zinc-600 tracking-widest uppercase">{s.l}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-purple-500/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
