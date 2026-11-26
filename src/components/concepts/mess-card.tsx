"use client";

import React, { useEffect, useRef } from "react";
import { drawPiece, fontsOf, type Piece } from "./mess";

/** One piece of paperwork as ordinary page content. */
export function MessCard({ piece, className, style }: { piece: Piece; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let live = true;
    const draw = () => {
      const c = ref.current?.getContext("2d");
      if (!live || !c || !ref.current) return;
      const { sans, hand } = fontsOf(ref.current);
      c.clearRect(0, 0, 480, 400);
      drawPiece(c, piece, 480, 400, hand, sans);
    };
    draw();
    document.fonts?.ready.then(draw);
    return () => {
      live = false;
    };
  }, [piece]);
  return <canvas ref={ref} width={480} height={400} aria-hidden="true" className={className} style={style} />;
}
