"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, MessageSquare, Send, MapPin, AtSign, GitFork, CheckCircle2 } from "lucide-react";

function GlowInput({ label, type = "text", value, onChange, placeholder, required, rows }: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder: string;
  required?: boolean; rows?: number;
}) {
  const [focused, setFocused] = useState(false);
  const baseStyle = {
    background: focused ? "rgba(168,85,247,0.06)" : "rgba(255,255,255,0.02)",
    border: `1px solid ${focused ? "rgba(168,85,247,0.4)" : "rgba(255,255,255,0.06)"}`,
    boxShadow: focused ? "0 0 20px rgba(168,85,247,0.08), inset 0 0 10px rgba(168,85,247,0.03)" : "none",
    transition: "all 0.3s ease",
  };
  const cls = "w-full px-4 py-3 rounded-xl text-sm text-white placeholder-zinc-600 outline-none resize-none ";

  return (
    <div>
      <label className="block text-xs font-medium text-zinc-400 mb-2 tracking-wide uppercase">{label}</label>
      {rows ? (
        <textarea
          rows={rows}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cls}
          style={baseStyle}
        />
      ) : (
        <input
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cls}
          style={baseStyle}
        />
      )}
    </div>
  );
}

export default function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "a4a71507-c12d-4001-8d35-6128d754b2ac",
          name: form.name,
          email: form.email,
          message: form.message,
          subject: `Portfolio — ${form.name}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        setTimeout(() => setSent(false), 4000);
        setForm({ name: "", email: "", message: "" });
      }
    } catch {
      // silently ignore network errors — user can retry
    }
  };

  const contacts = [
    { icon: MessageSquare, label: "WhatsApp", value: "+55 (49) 9 9999-0000", href: "https://wa.me/5549999990000", accent: "#a855f7" },
    { icon: Mail, label: "E-mail", value: "joao@jaokdev.com.br", href: "mailto:joao@jaokdev.com.br", accent: "#c084fc" },
    { icon: AtSign, label: "Instagram", value: "@jaokdev", href: "https://instagram.com/jaokdev", accent: "#a855f7" },
    { icon: GitFork, label: "GitHub", value: "github.com/jaokzz", href: "https://github.com/jaokzz", accent: "#c084fc" },
  ];

  return (
    <section
      id="contact"
      className="py-28 px-6 relative"
      style={{ background: "linear-gradient(to bottom, #07070f, #0a0a16)" }}
      ref={ref}
    >
      {/* bg glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(168,85,247,0.06) 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: "#a855f7" }}>
            Contato
          </span>
          <h2 className="text-4xl md:text-6xl font-black mb-5 leading-none">
            <span className="text-white">Vamos trabalhar</span>{" "}
            <span className="gradient-purple">juntos</span>
          </h2>
          <p className="text-zinc-500 text-lg max-w-lg mx-auto">
            Tem um projeto? Me manda uma mensagem e a gente bate um papo sem compromisso.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Location */}
            <div
              className="p-6 rounded-2xl border"
              style={{ background: "#0d0d1a", borderColor: "rgba(168,85,247,0.12)" }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}>
                  <MapPin className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-zinc-600 uppercase tracking-widest">Localização</p>
                  <p className="text-white font-semibold">Iporã do Oeste, SC — Brasil</p>
                </div>
              </div>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Atendo presencialmente no oeste de SC e remotamente para todo o Brasil.
              </p>
            </div>

            {/* Contact links */}
            <div className="grid sm:grid-cols-2 gap-3">
              {contacts.map((c, i) => {
                const Icon = c.icon;
                return (
                  <motion.a
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.08 + 0.2 }}
                    whileHover={{
                      borderColor: `${c.accent}40`,
                      boxShadow: `0 8px 20px ${c.accent}12`,
                      y: -3,
                    }}
                    className="group flex items-center gap-3 p-4 rounded-xl border transition-colors duration-300 "
                    style={{ background: "#0d0d1a", borderColor: "rgba(168,85,247,0.1)" }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                      style={{ background: `${c.accent}10`, border: `1px solid ${c.accent}25` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: c.accent }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-zinc-600">{c.label}</p>
                      <p className="text-zinc-300 text-sm font-medium truncate group-hover:text-white transition-colors">{c.value}</p>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-8 rounded-2xl border space-y-5"
              style={{
                background: "#0d0d1a",
                borderColor: "rgba(168,85,247,0.12)",
                boxShadow: "0 0 40px rgba(168,85,247,0.04)",
              }}
            >
              <GlowInput label="Nome" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Seu nome" required />
              <GlowInput label="E-mail" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="seu@email.com" required />
              <GlowInput label="Mensagem" value={form.message} onChange={(v) => setForm({ ...form, message: v })} placeholder="Me conta sobre seu projeto..." required rows={5} />

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(168,85,247,0.5)" }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-xl text-white font-bold text-sm relative overflow-hidden  flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                  boxShadow: "0 0 20px rgba(168,85,247,0.3)",
                }}
              >
                <span className="absolute inset-0 opacity-0 hover:opacity-100 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-opacity duration-500 skew-x-12 translate-x-[-100%] hover:translate-x-[100%]" />
                {sent ? (
                  <><CheckCircle2 className="w-4 h-4 text-green-300" /> Mensagem enviada!</>
                ) : (
                  <><Send className="w-4 h-4" /> Enviar mensagem</>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
