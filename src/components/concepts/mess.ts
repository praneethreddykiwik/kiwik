/**
 * The paperwork a business runs on, drawn rather than photographed. Everything
 * here is made up to illustrate a problem; none of it quotes a client.
 */
export type Piece =
  | { kind: "sheet"; title: string; rows: string[][] }
  | { kind: "note"; text: string; color?: string }
  | { kind: "chat"; lines: [string, "in" | "out"][] }
  | { kind: "mail"; subject: string; lines: string[] }
  | { kind: "bill"; title: string; lines: string[]; stamp?: string }
  | { kind: "call"; name: string; count: string };

export interface MessScene {
  slug: string;
  tab: string;
  before: string;
  after: string;
  pieces: Piece[];
}

const sheet = (title: string, ...rows: string[][]): Piece => ({ kind: "sheet", title, rows });
const note = (text: string, color?: string): Piece => ({ kind: "note", text, color });
const chat = (...lines: [string, "in" | "out"][]): Piece => ({ kind: "chat", lines });
const mail = (subject: string, ...lines: string[]): Piece => ({ kind: "mail", subject, lines });
const bill = (title: string, stamp: string | undefined, ...lines: string[]): Piece => ({ kind: "bill", title, lines, stamp });
const call = (name: string, count: string): Piece => ({ kind: "call", name, count });

export const SCENES: MessScene[] = [
  {
    slug: "helm-events",
    tab: "Spreadsheets everywhere",
    before: "An event run on spreadsheets, emails and memory",
    after: "One place to run the whole event",
    pieces: [
      sheet("vendors_FINAL_v7", ["Florist", "??", "unpaid"], ["Sound", "6pm", "paid"], ["Tent", "late", "half"]),
      chat(["did the florist confirm??", "in"], ["checking", "out"]),
      note("call the caterer before 4!!"),
      mail("Re: Re: Re: venue change", "Which version is right?", "Please ignore my last mail"),
      bill("Invoice 118", "OVERDUE", "Lights", "Stage"),
      sheet("guests (2) copy", ["Table 4", "8", "?"], ["Table 5", "6", "ok"], ["Table 6", "", "?"]),
      call("Venue manager", "3 missed"),
      note("who has the keys?", "#ffd9d2"),
      chat(["new layout?", "in"], ["sent it on Monday", "out"], ["where", "in"]),
      mail("Budget, latest latest", "See attached", "and the other one"),
      bill("Quote: decor", undefined, "Arch", "Aisle", "Flowers"),
      note("3 events, 1 week"),
    ],
  },
  {
    slug: "fooducia",
    tab: "Orders by message",
    before: "Orders in messages, stock in someone's head",
    after: "The order comes first, then the harvest",
    pieces: [
      chat(["2 kg tomato pls", "in"], ["and spinach", "in"], ["ok", "out"]),
      note("spinach: gone soft again", "#ffd9d2"),
      sheet("order list tue", ["Flat 1204", "4 items", "?"], ["Flat 803", "2 items", "ok"], ["Flat 611", "", "call"]),
      call("Block B, flat 803", "2 missed"),
      mail("Where is my delivery?", "It is past nine", "Third time this week"),
      bill("Market run", undefined, "Okra", "Beans", "Greens"),
      note("no change for 500"),
      chat(["is this fresh?", "in"], ["came on Monday", "out"]),
      sheet("stock", ["Carrot", "12", "?"], ["Beans", "3", "low"], ["Greens", "0", "out"]),
      note("driver off on friday"),
      bill("Waste", "WRITE OFF", "Greens", "Herbs"),
      chat(["diet plan?", "in"], ["will call you", "out"]),
    ],
  },
  {
    slug: "clean-ai",
    tab: "Prices by guesswork",
    before: "A price over the phone, and a hope that someone turns up",
    after: "A photo in, an itemised price out",
    pieces: [
      chat(["how much for 2 BHK?", "in"], ["depends", "out"]),
      call("Cleaning (Ravi?)", "4 missed"),
      note("said 10am. it is 1pm", "#ffd9d2"),
      bill("Estimate", undefined, "Kitchen", "Bath", "Extra??"),
      mail("Complaint: final price", "You said half of this", "Please call"),
      sheet("cleaners", ["Anil", "busy", "?"], ["Meera", "free", "far"], ["Tariq", "", "new"]),
      chat(["can you send a photo", "out"], ["of what", "in"]),
      note("verified? ask"),
      bill("Job 41", "DISPUTED", "Sofa", "Carpet"),
      call("Unknown number", "1 missed"),
      mail("Reschedule again", "Sorry, tomorrow", "for sure"),
      note("stairs, no lift"),
    ],
  },
  {
    slug: "sowcha",
    tab: "Lost in the inbox",
    before: "A label answering the same question a hundred times",
    after: "A place that tells the story once, properly",
    pieces: [
      chat(["price pls", "in"], ["price?", "in"], ["PRICE", "in"]),
      note("photos for the rose line"),
      mail("Is this still available?", "I saw it in March", "size M?"),
      sheet("pieces", ["Anarkali", "2", "?"], ["Wrap", "1", "kept"], ["Sage", "0", ""]),
      chat(["can I see more", "in"], ["sending", "out"]),
      note("write the sage story", "#e3efd9"),
      bill("Atelier", undefined, "Thread", "Dye", "Linen"),
      call("Customer, Jubilee Hills", "2 missed"),
      mail("Lookbook, small file", "does not open", "send again?"),
      note("who replied to Asha?"),
      chat(["do you ship", "in"], ["yes", "out"], ["where", "in"]),
      sheet("messages", ["Asha", "wait", ""], ["Nila", "done", ""], ["Priya", "??", ""]),
    ],
  },
];

function rounded(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
}

/** Draws one piece into a w by h box at 0,0. Sizes are relative to a 400 x 333 card. */
export function drawPiece(c: CanvasRenderingContext2D, p: Piece, w: number, h: number, hand: string, sans: string) {
  const k = w / 400;
  const H = h / k;
  c.save();
  c.scale(k, k);
  const text = (t: string, x: number, y: number, size: number, color: string, weight = 500, family = sans, max?: number) => {
    c.font = `${weight} ${size}px ${family}`;
    c.fillStyle = color;
    c.textBaseline = "middle";
    c.fillText(t, x, y, max);
  };
  const fill = (color: string) => {
    c.fillStyle = color;
    c.fillRect(0, 0, 400, H);
  };
  if (p.kind === "note") {
    fill(p.color || "#ffe89a");
    c.fillStyle = "rgba(0,0,0,.05)";
    c.fillRect(0, 0, 400, 26);
    const words = p.text.split(" ");
    const lines: string[] = [];
    c.font = `700 62px ${hand}`;
    for (const word of words) {
      const last = lines[lines.length - 1];
      if (last && c.measureText(`${last} ${word}`).width < 340) lines[lines.length - 1] = `${last} ${word}`;
      else lines.push(word);
    }
    lines.forEach((l, i) => text(l, 34, H / 2 + 14 + (i - (lines.length - 1) / 2) * 62, 62, "#3a3320", 700, hand));
  } else if (p.kind === "sheet") {
    fill("#ffffff");
    c.fillStyle = "#e4efe7";
    c.fillRect(0, 0, 400, 62);
    text(p.title, 22, 32, 27, "#2c4a37", 700, sans, 356);
    c.strokeStyle = "#dfe3e6";
    c.lineWidth = 2;
    const rows = 5;
    const rh = (H - 62) / rows;
    for (let i = 0; i <= rows; i++) {
      c.beginPath();
      c.moveTo(0, 62 + i * rh);
      c.lineTo(400, 62 + i * rh);
      c.stroke();
    }
    for (const x of [185, 290]) {
      c.beginPath();
      c.moveTo(x, 62);
      c.lineTo(x, H);
      c.stroke();
    }
    p.rows.forEach((row, i) => row.forEach((cell, j) => text(cell, [20, 200, 305][j], 62 + rh * (i + 0.5), 25, /\?|late|unpaid|out|low|call/.test(cell) ? "#c2452f" : "#4a525a", 500, sans, [155, 80, 85][j])));
  } else if (p.kind === "chat") {
    fill("#eef1f4");
    const gap = 72;
    const top = H / 2 - ((p.lines.length - 1) * gap) / 2;
    p.lines.forEach(([t, side], i) => {
      c.font = `500 29px ${sans}`;
      const bw = Math.min(330, c.measureText(t).width + 48);
      const x = side === "in" ? 26 : 374 - bw;
      rounded(c, x, top + i * gap - 28, bw, 56, 26);
      c.fillStyle = side === "in" ? "#ffffff" : "#cfe6dd";
      c.fill();
      text(t, x + 24, top + i * gap + 1, 29, "#2c333a", 500, sans, bw - 40);
    });
  } else if (p.kind === "mail") {
    fill("#ffffff");
    c.beginPath();
    c.arc(54, 66, 26, 0, Math.PI * 2);
    c.fillStyle = "#c9d2de";
    c.fill();
    c.fillStyle = "#e6e9ed";
    rounded(c, 96, 44, 150, 14, 7);
    c.fill();
    rounded(c, 96, 70, 96, 12, 6);
    c.fill();
    text(p.subject, 28, 138, 30, "#20262c", 700, sans, 346);
    p.lines.forEach((l, i) => text(l, 28, 190 + i * 44, 26, "#69727c", 500, sans, 346));
  } else if (p.kind === "bill") {
    fill("#fbfaf6");
    text(p.title, 30, 54, 34, "#2c2f33", 700, sans, 340);
    p.lines.forEach((l, i) => {
      const y = 118 + i * 48;
      text(l, 30, y, 27, "#565d64");
      c.fillStyle = "#d6d6d0";
      rounded(c, 270, y - 8, 96, 16, 8);
      c.fill();
    });
    c.setLineDash([8, 8]);
    c.strokeStyle = "#cfcfc8";
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(30, H - 62);
    c.lineTo(370, H - 62);
    c.stroke();
    c.setLineDash([]);
    if (p.stamp) {
      c.save();
      c.translate(230, H - 92);
      c.rotate(-0.16);
      c.strokeStyle = "#c2452f";
      c.lineWidth = 5;
      c.font = `800 38px ${sans}`;
      const bw = c.measureText(p.stamp).width + 36;
      rounded(c, -bw / 2, -32, bw, 64, 8);
      c.stroke();
      c.textAlign = "center";
      text(p.stamp, 0, 2, 38, "#c2452f", 800);
      c.restore();
    }
  } else {
    fill("#2a3038");
    text("Missed call", 34, 74, 27, "#ff9a88", 600);
    text(p.name, 34, 148, 42, "#ffffff", 700, sans, 332);
    text(p.count, 34, 208, 32, "#aeb7c2", 500);
    c.beginPath();
    c.arc(344, H - 60, 32, 0, Math.PI * 2);
    c.fillStyle = "#c2452f";
    c.fill();
  }
  c.restore();
}

/** All twelve pieces of a scene in one 4 by 3 picture. */
export function messAtlas(scene: MessScene, hand: string, sans: string, size = 2048): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = Math.round(size * 0.625);
  const c = canvas.getContext("2d")!;
  const w = canvas.width / 4;
  const h = canvas.height / 3;
  scene.pieces.forEach((p, i) => {
    c.save();
    c.beginPath();
    c.rect((i % 4) * w, Math.floor(i / 4) * h, w, h);
    c.clip();
    c.translate((i % 4) * w, Math.floor(i / 4) * h);
    drawPiece(c, p, w, h, hand, sans);
    c.restore();
  });
  return canvas;
}

export function fontsOf(el: Element = document.body) {
  const css = getComputedStyle(el);
  const sans = getComputedStyle(document.body).fontFamily || "sans-serif";
  const hand = css.getPropertyValue("--font-hand").trim() || "cursive";
  return { sans, hand };
}
