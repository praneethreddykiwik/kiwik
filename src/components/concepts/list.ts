export interface Concept {
  id: number;
  name: string;
  idea: string;
  motion: string;
  swatch: string[];
}

export const CONCEPTS: Concept[] = [
  { id: 1, name: "Pieces", idea: "Your scattered paperwork flips over and locks together into a working product.", motion: "3D cards flip and dock", swatch: ["#eef3fb", "#1a2150", "#ffe89a"] },
  { id: 2, name: "Before and after", idea: "The same Monday morning, on either side of a line you drag.", motion: "Drag and scroll wipes, glass handle", swatch: ["#d9d4cc", "#0a5c5a", "#ffffff"] },
  { id: 3, name: "Say it", idea: "Type the problem in your own words and the page answers.", motion: "Breathing gradient orb, drawn answer", swatch: ["#c8f3e6", "#b8c6ff", "#151a40"] },
  { id: 4, name: "Walk through", idea: "Walk down a corridor of paperwork and out into a bright room of finished products.", motion: "3D walk that follows your scroll", swatch: ["#cfc9bf", "#ffffff", "#0d8a80"] },
  { id: 5, name: "Your name on it", idea: "Type your business name and watch a website, an app and a dashboard appear with it.", motion: "Live preview that builds as you type", swatch: ["#fff4ec", "#ff6a3d", "#1c1a2e"] },
  { id: 6, name: "Same minute, two ways", idea: "One customer, two phones, the same clock. With Kiwik and without.", motion: "Two stories played in step, with a time bar", swatch: ["#e8ecf1", "#12a67a", "#2a2f3a"] },
  { id: 7, name: "Peel it back", idea: "The spreadsheet peels off like paper. The product was underneath all along.", motion: "3D page peel with scroll or drag", swatch: ["#f6f6f2", "#2e7d4f", "#141a44"] },
  { id: 8, name: "Clear the desk", idea: "A desk buried in paper is swept clear, and a laptop opens on what we built.", motion: "3D desk, flying paper, opening laptop", swatch: ["#e9e2d6", "#5b6cff", "#22201c"] },
  { id: 9, name: "The showroom", idea: "A ring of giant screens you can turn. The problem is on the back of each one.", motion: "3D curved screens, drag to turn", swatch: ["#101425", "#5ee0d0", "#ffffff"] },
  { id: 10, name: "Every sheet is an hour", idea: "Two sliders turn your wasted hours into a pile of paper you can see.", motion: "3D paper pile that grows and clears", swatch: ["#ffe45c", "#ffffff", "#15161c"] },
  { id: 11, name: "Live screens", idea: "The live hero, but the ribbon carries working product screens instead of stock photos.", motion: "Two-lane ribbon of animated app screens", swatch: ["#f4f6fb", "#1a2150", "#0d8a80"] },
  { id: 12, name: "Glass words", idea: "Everything we build, as liquid glass pills drifting over a living colour field.", motion: "Paper mesh gradient under glass marquees", swatch: ["#c7d2ff", "#7ee0d2", "#ffffff"] },
  { id: 13, name: "Liquid metal orbit", idea: "The Kiwik mark in liquid metal, with our services circling it.", motion: "Paper liquid metal logo, 3D orbit", swatch: ["#eef0f5", "#9aa3b8", "#0d8a80"] },
  { id: 14, name: "Three devices", idea: "A laptop, a tablet and a phone, each running something we would build for you.", motion: "React Three Fiber devices with live screens", swatch: ["#e9ecf3", "#14182c", "#5ee0d0"] },
  { id: 15, name: "Particle words", idea: "Nine thousand points that keep re-forming into the next thing we build.", motion: "React Three Fiber particle morph", swatch: ["#fafafd", "#1a2150", "#0d8a80"] },
  { id: 16, name: "Code to product", idea: "Code being written on the left becomes the product on the right, line by line.", motion: "Typed code, screen assembling in step", swatch: ["#0f1430", "#5ee0d0", "#ffffff"] },
  { id: 17, name: "Tell us the problem", idea: "A client types the problem; a first plan writes itself underneath.", motion: "Paper pulsing border, typed conversation", swatch: ["#5b6cff", "#5ee0d0", "#ffffff"] },
  { id: 18, name: "Data landscape", idea: "Your business as a living landscape of numbers, the view a good dashboard gives.", motion: "React Three Fiber instanced columns", swatch: ["#d9def0", "#1a2150", "#0d8a80"] },
  { id: 19, name: "In, through, out", idea: "Emails, orders and spreadsheets flow into one system and come out done.", motion: "Animated flow, Paper metaballs core", swatch: ["#ffffff", "#5b6cff", "#0d8a80"] },
  { id: 20, name: "Sketch to software", idea: "A napkin sketch of a website, wiped into the finished thing by a line of light.", motion: "Scan-line wipe between two drawings", swatch: ["#f4f7ff", "#3a4fb0", "#5ee0d0"] },
];
