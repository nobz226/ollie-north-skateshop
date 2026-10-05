"use client";

// Small, reusable animation primitives shared across pages.

import { motion, useMotionValue, useSpring } from "framer-motion";
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

/**
 * Headline whose words rise out of a clipping mask one after another.
 * Wrap a word in *asterisks* to render it as a wonky italic accent.
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
  // The trigger lives on the heading itself: the words start clipped by their
  // masks, so an IntersectionObserver on each word would never fire.
  const word = {
    hidden: { y: "110%", rotate: 4 },
    visible: (i: number) => ({
      y: "0%",
      rotate: 0,
      transition: { duration: 0.9, ease: EASE, delay: delay + i * 0.07 },
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
      {words.map((text, i) => {
        // "*word*" (optionally followed by punctuation) renders as an italic accent
        const match = text.match(/^\*(.+)\*(\W*)$/);
        return (
          <span key={i} className="inline-block overflow-hidden align-bottom pt-[0.05em] -mt-[0.05em] pb-[0.22em] -mb-[0.22em]">
            <motion.span className="inline-block" variants={word} custom={i}>
              {match ? (
                <>
                  <em>{match[1]}</em>
                  {match[2]}
                </>
              ) : (
                text
              )}
              {i < words.length - 1 && " "}
            </motion.span>
          </span>
        );
      })}
    </MotionTag>
  );
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

/** Circular text badge that slowly rotates around a centre element. */
export function RotatingBadge({
  text,
  children,
  className,
}: {
  text: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative h-36 w-36", className)}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-spin-slow">
        <defs>
          <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-current" style={{ fontFamily: "var(--font-mono)", fontSize: 14 }}>
          <textPath href="#badge-circle" textLength="486" lengthAdjust="spacing">{text}</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
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
        x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
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

/** Sundew-style glistening droplets that float gently (decorative). */
export function DewDrops({ className }: { className?: string }) {
  const drops = [
    { top: "12%", left: "8%", size: 14, delay: "0s" },
    { top: "70%", left: "4%", size: 9, delay: "1.2s" },
    { top: "28%", left: "88%", size: 18, delay: "0.6s" },
    { top: "78%", left: "92%", size: 11, delay: "2s" },
    { top: "50%", left: "48%", size: 7, delay: "3s" },
  ];
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden>
      {drops.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full animate-float"
          style={{
            top: d.top,
            left: d.left,
            width: d.size,
            height: d.size,
            animationDelay: d.delay,
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(240,207,122,0.7) 40%, rgba(201,149,42,0.35) 75%, transparent)",
            boxShadow: "0 0 12px rgba(227,180,72,0.45)",
          }}
        />
      ))}
    </div>
  );
}

/**
 * The MD Plants mark: a Venus flytrap trap in profile.
 * Jaws snap shut when a parent with the `group` class is hovered.
 */
export function TrapMark({ className }: { className?: string }) {
  const teeth = [
    [15, 9.6, 13.6, 5.4],
    [20, 7.8, 19.6, 3.4],
    [25, 7, 25.8, 2.6],
    [29.6, 7.4, 31.6, 3.4],
    [33.4, 9.2, 36.6, 6.2],
  ];
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden>
      {/* stem */}
      <path d="M8 20 Q4 24 2 34" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      {/* upper jaw */}
      <g className="origin-[8px_20px] transition-transform duration-300 ease-out group-hover:rotate-[16deg]">
        <path d="M8 20 C12 9 26 5 34 10 C29 15 19 18.5 8 20 Z" className="fill-trap-500" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        {teeth.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        ))}
      </g>
      {/* lower jaw */}
      <g className="origin-[8px_20px] transition-transform duration-300 ease-out group-hover:-rotate-[16deg]">
        <path d="M8 20 C12 31 26 35 34 30 C29 25 19 21.5 8 20 Z" className="fill-trap-500" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        {teeth.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={40 - y1} x2={x2} y2={40 - y2} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        ))}
      </g>
    </svg>
  );
}
