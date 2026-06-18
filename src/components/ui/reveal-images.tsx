"use client";

import { useState } from "react";
import { TextReveal } from "@/components/ui/cascade-text";

interface RevealImageListItemProps {
  text: string;
  label?: string;
  index?: number;
}

function RevealImageListItem({ text, index = 0 }: RevealImageListItemProps) {
  const [hovered, setHovered] = useState(false);
  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      className="group relative border-b border-white/5 last:border-0 transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hover background bar */}
      <div
        className="absolute inset-0 rounded-lg transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: hovered ? 1 : 0,
          background: "linear-gradient(90deg, rgba(124,58,237,0.06) 0%, transparent 80%)",
        }}
      />

      {/* Left accent line */}
      <div
        className="absolute left-0 top-0 w-0.5 rounded-full transition-all duration-500"
        style={{
          height: hovered ? "100%" : "0%",
          background: "linear-gradient(to bottom, #7c3aed, #c084fc)",
        }}
      />

      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3">
        {/* Number */}
        <span
          className="text-xs font-mono font-bold mr-3 sm:mr-5 flex-shrink-0 transition-colors duration-300"
          style={{ color: hovered ? "#a855f7" : "rgba(255,255,255,0.15)" }}
        >
          {num}
        </span>

        {/* Text with cascade animation */}
        <div className="flex-1 min-w-0">
          <TextReveal
            text={text}
            as="div"
            fontSize="clamp(1.1rem, 4.5vw, 3.2rem)"
            color="#ffffff"
            hoverColor="#a855f7"
            staggerDelay={22}
            duration={280}
            direction="up"
            style={{ fontWeight: 900, letterSpacing: "-0.02em", padding: 0 }}
          />
        </div>

        {/* Arrow — hidden on mobile */}
        <span
          className="ml-4 flex-shrink-0 text-xl font-light transition-all duration-300 hidden sm:block"
          style={{
            color: "#a855f7",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateX(0)" : "translateX(-8px)",
          }}
        >
          →
        </span>
      </div>
    </div>
  );
}

interface RevealImageListProps {
  items: RevealImageListItemProps[];
}

function RevealImageList({ items }: RevealImageListProps) {
  return (
    <div className="flex flex-col">
      {items.map((item, index) => (
        <RevealImageListItem key={index} text={item.text} index={index} />
      ))}
    </div>
  );
}

export { RevealImageList };
export type { RevealImageListItemProps };
