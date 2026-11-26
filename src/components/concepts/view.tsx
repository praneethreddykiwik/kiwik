"use client";

import React from "react";
import dynamic from "next/dynamic";

const VIEWS: Record<number, React.ComponentType> = {
  1: dynamic(() => import("./c01-pieces")),
  2: dynamic(() => import("./c02-before-after")),
  3: dynamic(() => import("./c03-say-it")),
  4: dynamic(() => import("./c04-walk")),
  5: dynamic(() => import("./c05-your-name")),
  6: dynamic(() => import("./c06-two-ways")),
  7: dynamic(() => import("./c07-peel")),
  8: dynamic(() => import("./c08-desk")),
  9: dynamic(() => import("./c09-showroom")),
  10: dynamic(() => import("./c10-hours")),
  11: dynamic(() => import("./c11-screens")),
  12: dynamic(() => import("./c12-glass-words")),
  13: dynamic(() => import("./c13-metal-orbit")),
  14: dynamic(() => import("./c14-devices")),
  15: dynamic(() => import("./c15-particles")),
  16: dynamic(() => import("./c16-code-to-product")),
  17: dynamic(() => import("./c17-ask")),
  18: dynamic(() => import("./c18-data")),
  19: dynamic(() => import("./c19-flow")),
  20: dynamic(() => import("./c20-sketch")),
};

export function ConceptView({ id }: { id: number }) {
  const View = VIEWS[id];
  return View ? <View /> : null;
}
