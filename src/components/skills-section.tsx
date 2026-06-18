"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { RevealImageList } from "@/components/ui/reveal-images";
import type { RevealImageListItemProps } from "@/components/ui/reveal-images";

const items: RevealImageListItemProps[] = [
  { text: "Sites que vendem" },
  { text: "Design moderno" },
  { text: "Entrega no prazo" },
  { text: "Suporte real" },
  { text: "Resultado garantido" },
];

export default function SkillsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="skills"
      className="py-24 px-6 relative overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #07070f, #0a0a16, #07070f)" }}
      ref={ref}
    >
      {/* BG glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.06) 0%, transparent 70%)" }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-16 items-start">

          {/* Left — reveal list */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <span className="text-xs font-semibold tracking-widest uppercase mb-3 block" style={{ color: "#c084fc" }}>
                O que você recebe
              </span>
              <p className="text-zinc-500 text-sm max-w-sm hidden sm:block">
                Passe o mouse para ver o que cada entrega significa na prática.
              </p>
            </motion.div>

            <RevealImageList items={items} />
          </motion.div>

          {/* Right — pitch */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="lg:sticky lg:top-32 space-y-6 pt-2"
          >
            <h2 className="text-3xl font-black leading-tight">
              <span className="text-white">Você não compra código.</span>
              <br />
              <span className="gradient-purple">Você compra resultado.</span>
            </h2>

            <p className="text-zinc-500 text-sm leading-relaxed">
              Cada projeto entregue tem um objetivo claro: fazer o seu negócio crescer online.
              Design bonito, performance técnica e suporte pós-entrega — sem enrolação.
            </p>

            <div className="space-y-3">
              {[
                "Prazo combinado, entregue",
                "Sem papo técnico desnecessário",
                "Suporte direto comigo, sem terceiros",
                "Resultado visível nos primeiros 30 dias",
              ].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="flex items-center gap-3 text-sm text-zinc-400"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "#a855f7", boxShadow: "0 0 6px #a855f7" }}
                  />
                  {item}
                </motion.div>
              ))}
            </div>

            <motion.a
              href="#contact"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors group"
            >
              Quero meu site
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </motion.a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
