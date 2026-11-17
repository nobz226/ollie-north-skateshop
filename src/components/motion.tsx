"use client";

// Animation primitives and gothic ornaments shared across pages.

import Image from "next/image";
import { motion, MotionValue, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fades and lifts its children into view once, when scrolled to. */
export function Reveal({
  children,
  delay = 0,
  y = 40,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Renders "*word*" as an <em> accent (rubricated red inside headings). */
function renderWord(text: string) {
  const match = text.match(/^\*(.+)\*(\W*)$/);
  return match ? (
    <>
      <em>{match[1]}</em>
      {match[2]}
    </>
  ) : (
    text
  );
}

/**
 * Headline whose words surface out of the dark one after another,
 * sharpening from a blur like ink soaking into paper.
 * Wrap a word in *asterisks* to render it as an italic accent.
 */
export function SplitReveal({
  text,
  className,
  delay = 0,
  as: Tag = "h2",
  inView = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3";
  inView?: boolean;
}) {
  const words = text.split(" ");
  const MotionTag = motion[Tag];
  const word = {
    hidden: { opacity: 0, y: "0.35em", filter: "blur(10px)" },
    visible: (i: number) => ({
      opacity: 1,
      y: "0em",
      filter: "blur(0px)",
      transition: { duration: 1.1, ease: EASE, delay: delay + i * 0.08 },
    }),
  };
  return (
    <MotionTag
      className={className}
      initial="hidden"
      {...(inView
        ? { whileInView: "visible", viewport: { once: true, margin: "-60px" } }
        : { animate: "visible" })}
    >
      {words.map((text, i) => (
        <motion.span key={i} className="inline-block" variants={word} custom={i}>
          {renderWord(text)}
          {i < words.length - 1 && " "}
        </motion.span>
      ))}
    </MotionTag>
  );
}

/** Paragraph whose words light up one by one as it scrolls through the viewport. */
export function InkReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <InkWord key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {renderWord(w)}
          {i < words.length - 1 && " "}
        </InkWord>
      ))}
    </p>
  );
}

function InkWord({
  children,
  progress,
  range,
}: {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

/** Infinite horizontal ticker. Children are rendered twice for a seamless loop. */
export function Marquee({
  children,
  reverse = false,
  className,
}: {
  children: ReactNode;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden whitespace-nowrap", className)}>
      <div
        className={cn(
          "inline-flex w-max hover:[animation-play-state:paused]",
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        )}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Element that drifts slightly toward the cursor while hovered. */
export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x, y }}
      onMouseMove={(e) => {
        const rect = ref.current!.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.25);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** The client's hand-inked "Carnivorables" wordmark. */
export function Wordmark({
  className,
  tone = "bone",
  priority = false,
}: {
  className?: string;
  tone?: "bone" | "ink";
  priority?: boolean;
}) {
  return (
    <Image
      src={`/brand/wordmark-${tone}.png`}
      alt="Carnivorables"
      width={2400}
      height={506}
      priority={priority}
      className={cn("h-auto w-full select-none", className)}
      draggable={false}
    />
  );
}

/** Spores drifting up through the dark like embers (decorative). */
export function Embers({ className, count = 14 }: { className?: string; count?: number }) {
  // Deterministic positions so server and client render the same markup
  const embers = Array.from({ length: count }, (_, i) => ({
    left: `${(i * 37 + 11) % 100}%`,
    size: 2 + ((i * 7) % 4),
    delay: `${(i * 1.7) % 14}s`,
    duration: `${11 + ((i * 5) % 9)}s`,
    red: i % 3 === 0,
  }));
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {embers.map((e, i) => (
        <span
          key={i}
          className="absolute -bottom-4 animate-rise rounded-full"
          style={{
            left: e.left,
            width: e.size,
            height: e.size,
            animationDelay: e.delay,
            animationDuration: e.duration,
            background: e.red ? "#d65a4c" : "#f2c46d",
            boxShadow: `0 0 ${e.size * 4}px ${e.red ? "rgba(214,90,76,0.8)" : "rgba(242,196,109,0.7)"}`,
          }}
        />
      ))}
    </div>
  );
}

/** Symmetrical ink flourish used as a section divider. Draws itself when scrolled into view. */
export function Flourish({ className }: { className?: string }) {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1, transition: { duration: 1.8, ease: EASE } },
  };
  const half = (
    <>
      <motion.path variants={draw} d="M132 20 C150 20 158 10 172 10 C184 10 188 22 178 26 C170 29 165 20 172 17" />
      <motion.path variants={draw} d="M186 20 L236 20" />
      <motion.path variants={draw} d="M150 20 C160 26 168 32 180 33" />
    </>
  );
  return (
    <motion.svg
      viewBox="0 0 240 40"
      className={cn("h-8 w-56 text-bone/40", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      aria-hidden
    >
      {half}
      <g transform="translate(240 0) scale(-1 1)">{half}</g>
      <motion.path
        variants={draw}
        d="M120 9 L127 20 L120 31 L113 20 Z"
        className="fill-blood-500"
        stroke="none"
      />
    </motion.svg>
  );
}

/** A curling corner ornament. Rotate it for the other corners. */
export function CornerFlourish({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={cn("h-12 w-12 text-bone/35", className)} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" aria-hidden>
      <path d="M2 58 V18 C2 8 8 2 18 2 H58" />
      <path d="M8 58 V22 C8 13 13 8 22 8 H58" opacity="0.5" />
      <path d="M2 30 C14 30 22 24 20 16 C18 10 11 11 12 16 C13 19 17 19 17 16" />
      <path d="M30 2 C30 14 24 22 16 20" />
    </svg>
  );
}

/** Four corner ornaments framing a positioned parent. */
export function Corners({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-4 sm:inset-6", className)} aria-hidden>
      <CornerFlourish className="absolute left-0 top-0" />
      <CornerFlourish className="absolute right-0 top-0 rotate-90" />
      <CornerFlourish className="absolute bottom-0 right-0 rotate-180" />
      <CornerFlourish className="absolute bottom-0 left-0 -rotate-90" />
    </div>
  );
}
