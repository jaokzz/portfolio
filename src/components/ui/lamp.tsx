"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-start overflow-x-hidden w-full pt-24 pb-20",
        className
      )}
      style={{ background: "#07070f" }}
    >
      {/* Lamp beam effect — purely decorative, absolute */}
      <div className="absolute top-0 left-0 right-0 h-80 flex items-start justify-center overflow-hidden pointer-events-none">
        <div className="relative flex w-full items-start justify-center scale-y-110">
          {/* Left conic beam */}
          <motion.div
            initial={{ opacity: 0.3, width: "12rem" }}
            whileInView={{ opacity: 1, width: "28rem" }}
            transition={{ delay: 0.2, duration: 0.9, ease: "easeInOut" }}
            style={{
              backgroundImage: `conic-gradient(from 70deg at center top, #7c3aed, transparent, transparent)`,
            }}
            className="absolute right-1/2 h-56 overflow-hidden"
          >
            <div className="absolute w-full left-0 h-40 bottom-0" style={{ background: "linear-gradient(to top, #07070f, transparent)" }} />
            <div className="absolute w-32 h-full left-0 bottom-0" style={{ background: "linear-gradient(to right, #07070f, transparent)" }} />
          </motion.div>

          {/* Right conic beam */}
          <motion.div
            initial={{ opacity: 0.3, width: "12rem" }}
            whileInView={{ opacity: 1, width: "28rem" }}
            transition={{ delay: 0.2, duration: 0.9, ease: "easeInOut" }}
            style={{
              backgroundImage: `conic-gradient(from 290deg at center top, transparent, transparent, #7c3aed)`,
            }}
            className="absolute left-1/2 h-56 overflow-hidden"
          >
            <div className="absolute w-32 h-full right-0 bottom-0" style={{ background: "linear-gradient(to left, #07070f, transparent)" }} />
            <div className="absolute w-full right-0 h-40 bottom-0" style={{ background: "linear-gradient(to top, #07070f, transparent)" }} />
          </motion.div>

          {/* Glow orb */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 h-32 w-96 rounded-full opacity-30 blur-3xl"
            style={{ background: "#7c3aed" }}
          />

          {/* Inner bright glow */}
          <motion.div
            initial={{ width: "6rem", opacity: 0 }}
            whileInView={{ width: "14rem", opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.9, ease: "easeInOut" }}
            className="absolute top-0 left-1/2 -translate-x-1/2 h-24 rounded-full blur-2xl"
            style={{ background: "#a855f7" }}
          />

          {/* Lamp line */}
          <motion.div
            initial={{ width: "10rem", opacity: 0 }}
            whileInView={{ width: "28rem", opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.9, ease: "easeInOut" }}
            className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5"
            style={{ background: "linear-gradient(90deg, transparent, #c084fc, #a855f7, #c084fc, transparent)" }}
          />
        </div>
      </div>

      {/* Content — sits below the lamp beam */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto px-5 mt-40">
        {children}
      </div>
    </div>
  );
};
