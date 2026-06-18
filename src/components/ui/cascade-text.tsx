"use client";

import React, { useMemo, useState, type ElementType, type CSSProperties } from "react";

export interface TextRevealProps {
  text: string;
  as?: ElementType;
  href?: string;
  target?: string;
  className?: string;
  style?: CSSProperties;
  fontSize?: string;
  staggerDelay?: number;
  duration?: number;
  easing?: string;
  color?: string;
  hoverColor?: string;
  direction?: "up" | "down";
  onClick?: (e: React.MouseEvent) => void;
}

const TextReveal = React.memo(function TextReveal({
  text,
  as: Component = "div",
  href,
  target,
  className = "",
  style,
  fontSize = "3rem",
  staggerDelay = 25,
  duration = 250,
  easing = "ease-in-out",
  color = "inherit",
  hoverColor = "#a855f7",
  direction = "up",
  onClick,
}: TextRevealProps) {
  const [hovered, setHovered] = useState(false);

  const chars = useMemo(() => {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
      return Array.from(segmenter.segment(text), (s) => s.segment);
    }
    return [...text];
  }, [text]);

  const sign = direction === "up" ? 1 : -1;

  const rootProps: Record<string, unknown> = {
    className: `inline-block relative no-underline font-extrabold uppercase tracking-tight overflow-hidden cursor-pointer select-none ${className}`.trim(),
    style: {
      fontSize,
      color: hovered ? hoverColor : color,
      transition: "color 0.35s ease",
      lineHeight: 1,
      ...style,
    },
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onClick,
    "aria-label": text,
  };

  if (Component === "a") {
    rootProps.href = href ?? "#";
    if (target) rootProps.target = target;
    if (target === "_blank") rootProps.rel = "noopener noreferrer";
  }

  const inner = React.createElement(
    "span",
    { className: "inline-flex overflow-hidden relative", style: { height: "1em" }, "aria-hidden": "true" },
    chars.map((char, i) =>
      React.createElement(
        "span",
        {
          key: i,
          className: "inline-block relative will-change-transform",
          style: {
            textShadow: `0 ${sign}em currentColor`,
            transition: `transform ${duration}ms ${easing}`,
            transitionDelay: `${i * staggerDelay}ms`,
            transform: hovered ? `translateY(${-sign}em)` : "translateY(0)",
          },
        },
        char === " " ? " " : char
      )
    )
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return React.createElement(Component as any, rootProps, inner);
});

TextReveal.displayName = "TextReveal";
export { TextReveal };
