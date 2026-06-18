"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, GitFork } from "lucide-react";

const projects = [
  {
    number: "01",
    title: "MP Team",
    category: "Site Institucional",
    description:
      "Site para academia de personal training com design premium, animações avançadas e identidade visual única.",
    tags: ["Next.js", "Tailwind", "GSAP", "Vercel"],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80",
    logo: "/img/logo-mp.svg",
    href: "#",
    github: "https://github.com/jaokzz",
    accent: "#a855f7",
  },
  {
    number: "02",
    title: "Armazém Bar & Burguer",
    category: "Cardápio Digital",
    description:
      "Landing page e cardápio interativo para bar e hamburgueria local. Interface rápida, responsiva e fácil de navegar.",
    tags: ["React", "Tailwind", "Framer Motion"],
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&q=80",
    logo: "/img/logo-armazem.svg",
    href: "#",
    github: "https://github.com/jaokzz",
    accent: "#c084fc",
  },
  {
    number: "03",
    title: "WhatsApp Bot",
    category: "Automação",
    description:
      "Atendimento automático 24h via WhatsApp com fluxos inteligentes, respostas dinâmicas e integração com CRM.",
    tags: ["Node.js", "Baileys", "MongoDB"],
    image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=900&q=80",
    logo: null,
    href: "#",
    github: "https://github.com/jaokzz",
    accent: "#a855f7",
  },
  {
    number: "04",
    title: "Landing Page Conversão",
    category: "Performance",
    description:
      "Template de alta conversão com formulário otimizado, analytics integrado e carregamento sub-segundo.",
    tags: ["Next.js", "TypeScript", "Shadcn"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80",
    logo: null,
    href: "#",
    github: "https://github.com/jaokzz",
    accent: "#c084fc",
  },
];

function ProjectCard({
  project,
  index,
  inView,
}: {
  project: (typeof projects)[0];
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - r.top) / r.height - 0.5) * 6,
      y: -((e.clientX - r.left) / r.width - 0.5) * 6,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.7, ease: "easeOut" }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: hovered ? "transform 0.1s ease" : "transform 0.6s ease",
      }}
      className="group relative rounded-2xl overflow-hidden flex flex-col"
      whileHover={{ boxShadow: `0 24px 60px ${project.accent}18` }}
    >
      {/* Inner border color is driven by inline style on the div below */}
      <div
        className="rounded-2xl overflow-hidden border flex flex-col h-full transition-colors duration-400"
        style={{
          background: "#0d0d1a",
          borderColor: hovered ? `${project.accent}35` : "rgba(168,85,247,0.1)",
        }}
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden flex-shrink-0">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background: hovered
                ? `linear-gradient(to bottom, transparent 20%, ${project.accent}18 60%, #0d0d1a 100%)`
                : "linear-gradient(to bottom, transparent 30%, #0d0d1a 100%)",
            }}
          />
          {/* Number badge */}
          <span
            className="absolute top-4 left-4 text-xs font-black tracking-widest font-mono"
            style={{ color: project.accent }}
          >
            {project.number}
          </span>
          {/* Logo badge */}
          {project.logo && (
            <div
              className="absolute top-3 right-3 px-2.5 py-1.5 rounded-lg backdrop-blur-md"
              style={{
                background: "rgba(7,7,15,0.7)",
                border: `1px solid ${project.accent}30`,
              }}
            >
              <img
                src={project.logo}
                alt={project.title}
                className="h-5 w-auto object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6 gap-3">
          {/* Category label */}
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: project.accent }}>
            {project.category}
          </span>

          {/* Title */}
          <h3 className="text-xl font-black text-white leading-tight group-hover:text-purple-100 transition-colors duration-300">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-zinc-500 text-sm leading-relaxed flex-1">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md text-xs font-medium"
                style={{
                  background: `${project.accent}0f`,
                  border: `1px solid ${project.accent}25`,
                  color: `${project.accent}cc`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Divider */}
          <div
            className="h-px w-full mt-1"
            style={{ background: `linear-gradient(90deg, ${project.accent}30, transparent)` }}
          />

          {/* Actions */}
          <div className="flex items-center justify-between pt-0.5">
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 group/link"
              style={{ color: project.accent }}
            >
              Ver projeto
              <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200" />
            </a>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              <GitFork className="w-3.5 h-3.5" />
              Código
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="projects" className="py-28 px-6 relative" ref={ref}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 right-1/4 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(168,85,247,0.05) 0%, transparent 70%)" }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        >
          <div>
            <span
              className="text-xs font-semibold tracking-widest uppercase mb-4 block"
              style={{ color: "#a855f7" }}
            >
              Portfólio
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black leading-none">
              <span className="text-white">Projetos</span>{" "}
              <span className="gradient-purple">Recentes</span>
            </h2>
          </div>
          <p className="text-zinc-500 text-sm max-w-xs sm:text-right leading-relaxed">
            Cada projeto entregue com atenção aos detalhes, performance máxima e resultado real.
          </p>
        </motion.div>

        {/* Grid — 2×2 uniforme */}
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} inView={inView} />
          ))}
        </div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <a
            href="https://github.com/jaokzz"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-medium text-zinc-500 hover:text-white border border-transparent hover:border-purple-500/20 hover:bg-purple-500/5 transition-all duration-300"
          >
            <GitFork className="w-4 h-4" />
            Ver todos no GitHub
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
