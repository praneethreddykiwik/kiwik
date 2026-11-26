import { Archivo, Bricolage_Grotesque, Caveat, Fraunces } from "next/font/google";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", preload: false, display: "swap" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", preload: false, display: "swap" });
const caveat = Caveat({ subsets: ["latin"], weight: ["700"], variable: "--font-hand", preload: false, display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], axes: ["SOFT", "opsz"], variable: "--font-fraunces", preload: false, display: "swap" });

export const conceptFonts = `${archivo.variable} ${bricolage.variable} ${caveat.variable} ${fraunces.variable}`;
