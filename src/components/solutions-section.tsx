"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, Shield, Rocket } from "lucide-react";

const features = [
  {
    icon: Rocket,
    title: "Performance máxima",
    desc: "Sites com 95+ no Lighthouse, carregamento sub-segundo e SEO técnico otimizado.",
  },
  {
    icon: Zap,
    title: "Animações fluidas",
    desc: "Framer Motion, GSAP e CSS avançado para experiências que impressionam.",
  },
  {
    icon: Shield,
    title: "Entrega garantida",
    desc: "Processo claro, prazos reais e suporte após lançamento.",
  },
];

export default function SolutionsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="solutions"
      ref={ref}
      className="py-24 px-6 overflow-hidden relative"
      style={{ background: "linear-gradient(to bottom, #07070f, #0a0a16)" }}
    >
      {/* Faint grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
          {/* MacBook image — lateral */}
          <motion.div
            initial={{ opacity: 0, x: -60, scale: 0.92 }}
            animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative flex-shrink-0 w-full lg:w-[480px]"
          >
            {/* Pulsing glow orb behind */}
            <motion.div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 50% 60%, rgba(124,58,237,0.35) 0%, rgba(168,85,247,0.1) 45%, transparent 70%)",
                transform: "scale(1.2)",
              }}
              animate={{ opacity: [0.6, 1, 0.6], scale: [1.1, 1.25, 1.1] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Second spread glow */}
            <motion.div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 50% 60%, rgba(196,132,252,0.12) 0%, transparent 65%)",
                transform: "scale(1.4)",
              }}
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            {/* Laptop with float + tilt + glow pulse */}
            <motion.img
              src="/img/macbook-hero.png"
              alt="MacBook Pro com projeto em desenvolvimento"
              className="relative w-full object-contain"
              animate={{
                y: [0, -14, -6, -14, 0],
                rotate: [0, 1.5, 0, -1, 0],
                filter: [
                  "drop-shadow(0 8px 40px rgba(124,58,237,0.4)) drop-shadow(0 0 20px rgba(168,85,247,0.2))",
                  "drop-shadow(0 20px 60px rgba(124,58,237,0.7)) drop-shadow(0 0 40px rgba(168,85,247,0.5))",
                  "drop-shadow(0 12px 45px rgba(124,58,237,0.5)) drop-shadow(0 0 25px rgba(168,85,247,0.3))",
                  "drop-shadow(0 20px 60px rgba(124,58,237,0.7)) drop-shadow(0 0 40px rgba(168,85,247,0.5))",
                  "drop-shadow(0 8px 40px rgba(124,58,237,0.4)) drop-shadow(0 0 20px rgba(168,85,247,0.2))",
                ],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Text side */}
          <div className="flex-1">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="text-xs font-semibold tracking-widest uppercase block mb-4"
              style={{ color: "#c084fc" }}
            >
              Como trabalho
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="text-4xl md:text-5xl font-black leading-none mb-6"
            >
              <span className="text-white">Soluções digitais</span>
              <br />
              <span className="gradient-purple">do início ao fim</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-zinc-400 text-base leading-relaxed mb-10 max-w-md"
            >
              Da ideia ao deploy — entrego projetos completos com código limpo, design moderno e
              atenção a cada detalhe que faz a diferença para o usuário final.
            </motion.p>

            <div className="space-y-5">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, x: 30 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.45 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                    className="flex items-start gap-4 group"
                  >
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: "rgba(124,58,237,0.12)",
                        border: "1px solid rgba(168,85,247,0.25)",
                        boxShadow: "0 0 12px rgba(124,58,237,0.1)",
                      }}
                    >
                      <Icon className="w-4 h-4" style={{ color: "#a855f7" }} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm mb-0.5 group-hover:text-purple-300 transition-colors">
                        {f.title}
                      </h3>
                      <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-10"
            >
              <a
                href="#projects"
                className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors group"
              >
                Ver projetos reais
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
