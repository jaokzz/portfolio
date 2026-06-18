"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";
const AnimatedShaderBackground = dynamic(
  () => import("@/components/ui/animated-shader-background"),
  { ssr: false, loading: () => null }
);
import { SlideButton } from "@/components/ui/slide-button";

function GlowInput({ label, type = "text", value, onChange, placeholder, rows, isInvalid }: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder: string;
  rows?: number; isInvalid?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);

  const showError = touched && !focused && isInvalid && value.length > 0;

  const baseStyle = {
    background: focused
      ? "rgba(168,85,247,0.06)"
      : showError
      ? "rgba(239,68,68,0.04)"
      : "rgba(255,255,255,0.02)",
    border: `1px solid ${
      focused
        ? "rgba(168,85,247,0.4)"
        : showError
        ? "rgba(239,68,68,0.4)"
        : "rgba(255,255,255,0.06)"
    }`,
    boxShadow: focused
      ? "0 0 20px rgba(168,85,247,0.08), inset 0 0 10px rgba(168,85,247,0.03)"
      : showError
      ? "0 0 12px rgba(239,68,68,0.06)"
      : "none",
    transition: "all 0.25s ease",
  };
  const cls = "w-full px-4 py-3 rounded-xl text-sm text-white placeholder-zinc-600 outline-none resize-none ";

  const sharedProps = {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    placeholder,
    onFocus: () => setFocused(true),
    onBlur: () => { setFocused(false); setTouched(true); },
    className: cls,
    style: baseStyle,
  };

  return (
    <div>
      <label className="block text-xs font-medium text-zinc-400 mb-2 tracking-wide uppercase">{label}</label>
      {rows ? (
        <textarea rows={rows} {...sharedProps} />
      ) : (
        <input type={type} {...sharedProps} />
      )}
    </div>
  );
}

export default function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isNameValid = form.name.trim().split(/\s+/).filter(Boolean).length >= 2;
  const isMessageValid = form.message.trim().length >= 15;
  const isFormValid = isNameValid && isEmailValid && isMessageValid;

  const validationMessage = !isNameValid
    ? "Nome precisa ter pelo menos nome e sobrenome"
    : !isEmailValid
    ? "E-mail inválido"
    : !isMessageValid
    ? "Mensagem muito curta (mínimo 15 caracteres)"
    : "";

  const handleSlideSubmit = async () => {
    if (!isFormValid || submitStatus !== "idle") return;
    setSubmitStatus("loading");
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
        setSubmitStatus("success");
        setTimeout(() => {
          setForm({ name: "", email: "", message: "" });
          setSubmitStatus("idle");
        }, 3000);
      } else {
        setSubmitStatus("error");
        setTimeout(() => setSubmitStatus("idle"), 3000);
      }
    } catch {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }
  };

  const contacts = [
    {
      svg: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.118 1.528 5.845L0 24l6.335-1.51A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.369l-.36-.213-3.732.889.935-3.618-.234-.372A9.818 9.818 0 012.182 12c0-5.42 4.398-9.818 9.818-9.818S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/>
        </svg>
      ),
      label: "WhatsApp",
      value: "+55 (49) 99184-1920",
      href: "https://wa.me/5549991841920",
      accent: "#25D366",
    },
    {
      svg: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
          <path d="M24 5.457v13.909c0 2.012-1.636 3.636-3.636 3.636H3.636C1.636 23.002 0 21.378 0 19.366V5.457c0-.28.032-.55.09-.806L10.09 12 .09 18.35A3.636 3.636 0 010 19.366V5.457C0 3.445 1.636 1.82 3.636 1.82h16.728C22.364 1.82 24 3.445 24 5.457zM23.01 4.67L12 11.435 .99 4.67A3.608 3.608 0 003.636 3.64h16.728c1.112 0 2.105.508 2.646 1.03z"/>
        </svg>
      ),
      label: "Gmail",
      value: "jaokzk.22@gmail.com",
      href: "mailto:jaokzk.22@gmail.com",
      accent: "#EA4335",
    },
    {
      svg: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      ),
      label: "Instagram",
      value: "@jaokdev",
      href: "https://instagram.com/jaokdev",
      accent: "#E1306C",
    },
    {
      svg: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
        </svg>
      ),
      label: "GitHub",
      value: "github.com/jaokzz",
      href: "https://github.com/jaokzz",
      accent: "#ffffff",
    },
  ];

  return (
    <section
      id="contact"
      className="py-28 px-6 relative"
      style={{ background: "linear-gradient(to bottom, #07070f, #0a0a16)" }}
      ref={ref}
    >
      {/* Aurora shader background — desktop only */}
      <AnimatedShaderBackground />

      {/* Fallback static glow for mobile */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden md:hidden">
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
              {contacts.map((c, i) => (
                  <motion.a
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.08 + 0.2 }}
                    whileHover={{
                      borderColor: `${c.accent}50`,
                      boxShadow: `0 8px 20px ${c.accent}18`,
                      y: -3,
                    }}
                    className="group flex items-center gap-3 p-4 rounded-xl border transition-colors duration-300"
                    style={{ background: "#0d0d1a", borderColor: "rgba(168,85,247,0.1)" }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                      style={{ background: `${c.accent}18`, border: `1px solid ${c.accent}35`, color: c.accent }}
                    >
                      {c.svg}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-zinc-600">{c.label}</p>
                      <p className="text-zinc-300 text-sm font-medium truncate group-hover:text-white transition-colors">{c.value}</p>
                    </div>
                  </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div
              className="p-5 sm:p-8 rounded-2xl border space-y-5"
              style={{
                background: "#0d0d1a",
                borderColor: "rgba(168,85,247,0.12)",
                boxShadow: "0 0 40px rgba(168,85,247,0.04)",
              }}
            >
              <GlowInput
                label="Nome"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                placeholder="Nome e Sobrenome"
                isInvalid={!isNameValid}
              />
              <GlowInput
                label="E-mail"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                placeholder="seu@email.com"
                isInvalid={!isEmailValid}
              />
              <GlowInput
                label="Mensagem"
                value={form.message}
                onChange={(v) => setForm({ ...form, message: v })}
                placeholder="Me conta sobre seu projeto... (mín. 15 caracteres)"
                rows={5}
                isInvalid={!isMessageValid}
              />

              <SlideButton
                onSlideComplete={handleSlideSubmit}
                status={submitStatus}
                disabled={!isFormValid}
                validationMessage={validationMessage}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
