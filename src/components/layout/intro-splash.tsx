"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./intro-splash.module.css";

export const VIEW = "32 246 960 530";
export const LEFT_TOP = "M45 253.5H139Q144 253.5 148 258L316 452C338 479 338 520 317 547L276 602C286 573 266 538 236 500L41 263Q37 253.5 45 253.5Z";
export const LEFT_BOTTOM = "M236 500L41 761Q37 770 45 770H139Q144 770 148 765L276 602C286 573 266 538 236 500Z";
export const BAR = "M344 381Q344 373.5 352 373.5C389 375 419 404 419 440V652L388 706C378 726 360 735 344 724Z";
export const W_LEFT = "M344 724C360 735 378 726 388 706L460 572C475 553 491 541 511 541C535 541 553 556 566 579C545 575 530 592 511 623L434 746C424 761 409 770 391 770C366 770 344 750 344 724Z";
export const W_RIGHT = "M511 623C530 592 545 575 566 579L636 706C646 726 663 735 680 724C680 750 658 770 632 770C614 770 600 761 590 747Z";

/** The logo, in the pieces it assembles from. */
function Arm({ side }: { side: "left" | "right" }) {
  return (
    <svg viewBox={VIEW} className={`${styles.piece} ${styles[side]}`} aria-hidden="true">
      <defs>
        <linearGradient id={`kw-navy-${side}`} gradientUnits="userSpaceOnUse" x1="205" y1="425" x2="312" y2="560">
          <stop stopColor="#232b62" /><stop offset=".6" stopColor="#5a6cae" /><stop offset="1" stopColor="#8fabd9" />
        </linearGradient>
        <linearGradient id={`kw-teal-${side}`} gradientUnits="userSpaceOnUse" x1="252" y1="530" x2="130" y2="690">
          <stop stopColor="#033a35" /><stop offset="1" stopColor="#008080" />
        </linearGradient>
      </defs>
      {/* The right arm is the left one turned half a circle. */}
      <g transform={side === "right" ? "rotate(180 511.5 511.8)" : undefined}>
        <path d={LEFT_BOTTOM} fill={`url(#kw-teal-${side})`} />
        <path d={LEFT_TOP} fill={`url(#kw-navy-${side})`} />
      </g>
    </svg>
  );
}

/**
 * Plays on every full load of the home page. Not on in-site navigation, and not
 * on other pages, where a visitor arrives wanting something specific.
 */
export function IntroSplash() {
  const pathname = usePathname();
  const [show, setShow] = useState(pathname === "/");

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setShow(false), 2600);
    return () => clearTimeout(t);
  }, [show]);

  if (!show) return null;

  return (
    <div className={styles.splash} aria-hidden="true">
      <div className={styles.mark}>
        <Arm side="left" />
        <Arm side="right" />
        <svg viewBox={VIEW} className={`${styles.piece} ${styles.w}`}>
          <defs>
            <linearGradient id="kw-bar" gradientUnits="userSpaceOnUse" x1="370" y1="600" x2="400" y2="730">
              <stop stopColor="#008080" /><stop offset=".55" stopColor="#007672" /><stop offset="1" stopColor="#033a35" />
            </linearGradient>
            <linearGradient id="kw-w1" gradientUnits="userSpaceOnUse" x1="375" y1="770" x2="560" y2="545">
              <stop stopColor="#8fabd9" /><stop offset=".2" stopColor="#44508f" /><stop offset=".4" stopColor="#232b62" /><stop offset=".82" stopColor="#232b62" /><stop offset="1" stopColor="#7b92c9" />
            </linearGradient>
            <linearGradient id="kw-w2" gradientUnits="userSpaceOnUse" x1="550" y1="610" x2="650" y2="765">
              <stop stopColor="#141338" /><stop offset=".5" stopColor="#232b62" /><stop offset="1" stopColor="#8fabd9" />
            </linearGradient>
          </defs>
          <path d={BAR} fill="url(#kw-bar)" />
          <path d={BAR} fill="url(#kw-bar)" transform="matrix(-1 0 0 1 1024 0)" />
          <path d={W_RIGHT} fill="url(#kw-w2)" />
          <path d={W_LEFT} fill="url(#kw-w1)" />
        </svg>
        <svg viewBox={VIEW} className={`${styles.piece} ${styles.dots}`}>
          <defs>
            <radialGradient id="kw-dot" cx=".66" cy=".27" r=".75">
              <stop stopColor="#777" /><stop offset=".35" stopColor="#3a3a3c" /><stop offset="1" stopColor="#1d1d1f" />
            </radialGradient>
          </defs>
          <circle cx="438" cy="295" r="41.5" fill="url(#kw-dot)" />
          <circle cx="585" cy="295" r="41.5" fill="url(#kw-dot)" />
        </svg>
      </div>
      <div className={styles.word}>
        {"KIWIK".split("").map((c, i) => (
          <span key={i} style={{ "--i": i } as React.CSSProperties}>{c}</span>
        ))}
      </div>
      <div className={styles.tag}>Software, designed and built for you</div>
      <div className={styles.bar} />
    </div>
  );
}
