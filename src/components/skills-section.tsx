"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Code2, Globe, Smartphone, Bot, Zap, Database, Layers, GitBranch, Wind, Flame } from "lucide-react";

const skills = [
  { name: "Next.js / React", icon: Globe, level: 92, color: "#a855f7" },
  { name: "TypeScript", icon: Layers, level: 80, color: "#c084fc" },
  { name: "Tailwind CSS", icon: Wind, level: 95, color: "#c084fc" },
  { name: "Framer Motion", icon: Zap, level: 82, color: "#a855f7" },
  { name: "Node.js", icon: Flame, level: 75, color: "#a855f7" },
  { name: "MongoDB", icon: Database, level: 70, color: "#c084fc" },
  { name: "WhatsApp Bot", icon: Bot, level: 88, color: "#c084fc" },
  { name: "Vercel / Deploy", icon: GitBranch, level: 90, color: "#a855f7" },
  { name: "React Native", icon: Smartphone, level: 65, color: "#a855f7" },
  { name: "GSAP", icon: Code2, level: 72, color: "#c084fc" },
];

const services = [
  {
    icon: Globe,
    title: "Landing Pages",
    description: "Sites de alta conversão com animações fluidas, SEO otimizado e carregamento rápido.",
    accent: "#a855f7",
  },
  {
    icon: Smartphone,
    title: "Sites Responsivos",
    description: "Interfaces perfeitas em qualquer dispositivo — mobile-first desde o início.",
    accent: "#c084fc",
  },
  {
    icon: Bot,
    title: "Automações WhatsApp",
    description: "Chatbots inteligentes para atendimento 24h, fluxos automáticos e integração com sistemas.",
    accent: "#a855f7",
  },
  {
    icon: Zap,
    title: "Sites Institucionais",
    description: "Presença digital profissional com design moderno e conteúdo estratégico.",
    accent: "#c084fc",
  },
];

export default function SkillsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="skills"
      className="py-28 px-6 relative"
      style={{ background: "linear-gradient(to bottom, #07070f, #0a0a16, #07070f)" }}
      ref={ref}
    >
      {/* BG glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(168,85,247,0.05) 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: "#c084fc" }}>
            Tecnologias
          </span>
          <h2 className="text-4xl md:text-6xl font-black mb-5 leading-none">
            <span className="text-white">Skills &</span>{" "}
            <span className="gradient-purple">Serviços</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Skill bars */}
          <div className="space-y-5">
            {skills.map((skill, i) => {
              const Icon = skill.icon;
              return (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-125" style={{ color: skill.color }} />
                      <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">{skill.name}</span>
                    </div>
                    <span className="text-xs font-mono" style={{ color: skill.color }}>{skill.level}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                      transition={{ delay: i * 0.06 + 0.3, duration: 0.9, ease: "easeOut" }}
                      className="h-full rounded-full relative"
                      style={{ background: `linear-gradient(90deg, ${skill.color}80, ${skill.color})` }}
                    >
                      {/* Glow tip */}
                      <span
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                        style={{ background: skill.color, boxShadow: `0 0 8px ${skill.color}` }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Service cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {services.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <motion.div
                  key={svc.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                  whileHover={{
                    borderColor: `${svc.accent}40`,
                    boxShadow: `0 8px 30px ${svc.accent}15`,
                    y: -4,
                  }}
                  className="group p-5 rounded-2xl border transition-colors duration-300 "
                  style={{ background: "#0d0d1a", borderColor: "rgba(168,85,247,0.1)" }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `${svc.accent}10`,
                      border: `1px solid ${svc.accent}25`,
                      boxShadow: `0 0 15px ${svc.accent}10`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: svc.accent }} />
                  </div>
                  <h3 className="font-bold text-white text-sm mb-2 group-hover:text-purple-200 transition-colors">{svc.title}</h3>
                  <p className="text-zinc-600 text-xs leading-relaxed">{svc.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
