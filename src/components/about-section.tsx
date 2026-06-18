"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Coffee, Dumbbell, Rocket } from "lucide-react";

function CountUp({ target, suffix = "", inView }: { target: number; suffix?: string; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); return; }
      setCount(Math.floor(start));
    }, 35);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <>{count}{suffix}</>;
}

const stats = [
  { target: 15, suffix: "+", label: "Projetos" },
  { target: 100, suffix: "%", label: "Satisfação" },
  { target: 3, suffix: "+", label: "Anos" },
  { target: 24, suffix: "h", label: "Suporte" },
];

const facts = [
  { icon: MapPin, text: "Iporã do Oeste, Santa Catarina" },
  { icon: Coffee, text: "Desenvolvedor apaixonado por tecnologia" },
  { icon: Dumbbell, text: "Frequentador assíduo da academia" },
  { icon: Rocket, text: "Sempre aprendendo algo novo" },
];

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="py-28 px-6 relative" ref={ref}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(168,85,247,0.06) 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — photo */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {/* Gradient border wrapper */}
            <div
              className="relative rounded-2xl max-w-sm mx-auto lg:mx-0 p-px"
              style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.5), rgba(124,58,237,0.2))" }}
            >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
              <img
                src="/img/joao-foto.jpeg"
                alt="João Vitor"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to top, #07070f 0%, transparent 55%)" }} />

              {/* Floating status badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
                className="absolute bottom-5 left-5 right-5 z-20"
              >
                <div
                  className="rounded-xl p-3.5 backdrop-blur-md"
                  style={{
                    background: "rgba(13,13,26,0.85)",
                    border: "1px solid rgba(168,85,247,0.25)",
                    boxShadow: "0 0 20px rgba(168,85,247,0.1)",
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-400" />
                    </span>
                    <div>
                      <p className="text-white text-xs font-semibold">Disponível para projetos</p>
                      <p className="text-zinc-500 text-xs">Respondo em até 24h</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            </div>

            {/* Decorative glow orbs */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full -z-10"
              style={{ background: "radial-gradient(ellipse, rgba(168,85,247,0.15) 0%, transparent 70%)" }} />
            <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full -z-10"
              style={{ background: "radial-gradient(ellipse, rgba(168,85,247,0.1) 0%, transparent 70%)" }} />
          </motion.div>

          {/* Right — text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          >
            <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: "#a855f7" }}>
              Sobre mim
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Dev, criador e{" "}
              <span className="gradient-purple">parceiro de negócios</span>
            </h2>

            <div className="space-y-4 text-zinc-500 leading-relaxed mb-8 text-sm">
              <p>
                Sou o <strong className="text-white">João Vitor</strong>, desenvolvedor web
                freelancer de Iporã do Oeste (SC). Crio sites modernos e automações que ajudam
                negócios locais a crescerem no digital.
              </p>
              <p>
                Meu diferencial é a proximidade com o cliente — conheço pessoalmente boa parte
                dos negócios da região. Isso significa soluções que realmente funcionam para a
                realidade local, não templates genéricos.
              </p>
              <p>
                Stack principal: <span className="text-purple-300 font-medium">Next.js, React, Tailwind CSS, Framer Motion</span> e
                automações de <span className="text-purple-300 font-medium">WhatsApp</span>.
                Deploy na Vercel e Hostinger, com suporte pós-entrega.
              </p>
            </div>

            {/* Facts */}
            <div className="space-y-2.5 mb-8">
              {facts.map((fact, i) => {
                const Icon = fact.icon;
                return (
                  <motion.div
                    key={fact.text}
                    initial={{ opacity: 0, x: 16 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: i * 0.08 + 0.4 }}
                    className="flex items-center gap-3 text-sm text-zinc-500"
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color: "#a855f7" }} />
                    {fact.text}
                  </motion.div>
                );
              })}
            </div>

            {/* Stats with count-up */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.08 + 0.5 }}
                  whileHover={{ y: -4, boxShadow: "0 8px 25px rgba(168,85,247,0.15)" }}
                  className="p-4 rounded-xl text-center border transition-all duration-300 "
                  style={{ background: "#0d0d1a", borderColor: "rgba(168,85,247,0.12)" }}
                >
                  <p className="text-2xl font-black mb-0.5 gradient-purple tabular-nums">
                    <CountUp target={stat.target} suffix={stat.suffix} inView={inView} />
                  </p>
                  <p className="text-xs text-zinc-600">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
