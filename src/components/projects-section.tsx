"use client";

import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";
import { Clock } from "lucide-react";

export default function ProjectsSection() {
  return (
    <section id="projects" className="relative overflow-hidden">
      <LampContainer>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: "easeInOut" }}
          className="flex flex-col items-center text-center gap-6 px-4"
        >
          {/* Badge */}
          <div
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(168,85,247,0.3)",
              color: "#c084fc",
            }}
          >
            <Clock className="w-3 h-3" />
            Em breve
          </div>

          {/* Headline */}
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight tracking-tight pb-2">
            <span
              className="block"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #e9d5ff 50%, #a855f7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Algo grande
            </span>
            <span
              className="block"
              style={{
                background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              está chegando.
            </span>
          </h2>

          {/* Subtext */}
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-lg">
            Projetos reais, resultados reais. Estou montando o portfólio completo com cada
            entrega que já fiz — cada site, cada automação, cada cliente satisfeito.
          </p>

          {/* Divider detail */}
          <div className="flex items-center gap-3 mt-2">
            <div className="w-12 h-px" style={{ background: "linear-gradient(90deg, transparent, #7c3aed)" }} />
            <span className="text-xs text-zinc-600 tracking-widest uppercase font-medium">em construção</span>
            <div className="w-12 h-px" style={{ background: "linear-gradient(90deg, #7c3aed, transparent)" }} />
          </div>

          {/* CTA */}
          <motion.a
            href="#contact"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="mt-2 px-7 py-3 rounded-xl text-sm font-bold text-white transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              boxShadow: "0 0 30px rgba(124,58,237,0.35)",
            }}
          >
            Quero ser o próximo case →
          </motion.a>

          {/* Nota fina */}
          <p className="text-zinc-600 text-xs mt-1">
            Enquanto isso, me chama para conversar sobre o seu projeto.
          </p>
        </motion.div>
      </LampContainer>
    </section>
  );
}
