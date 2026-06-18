"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="py-10 px-6 border-t" style={{ borderColor: "rgba(168,85,247,0.1)" }}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <a href="#hero" className="">
          <span className="shimmer-text text-lg font-black tracking-tight">jaokdev</span>
        </a>

        <p className="text-xs text-zinc-700">
          Feito com <span className="text-purple-500">♥</span> em Iporã do Oeste, SC
        </p>

        <p className="text-xs text-zinc-700">
          © {new Date().getFullYear()} João Vitor. Todos os direitos reservados.
        </p>
      </div>

      {/* Bottom gradient line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="mt-8 h-px w-full max-w-6xl mx-auto origin-left"
        style={{ background: "linear-gradient(90deg, #7c3aed, #a855f7, #c084fc, #a855f7, transparent)" }}
      />
    </footer>
  );
}
