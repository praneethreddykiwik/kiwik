/** Product screens drawn on a canvas, for WebGL textures. No photos. */

const NAVY = "#1a2150";
const TEAL = "#0d8a80";
const SOFT = "#e8ecf5";

function rr(x: CanvasRenderingContext2D, X: number, Y: number, W: number, H: number, r: number, fill: string) {
  x.fillStyle = fill;
  x.beginPath();
  x.roundRect(X, Y, W, H, r);
  x.fill();
}

function text(x: CanvasRenderingContext2D, s: string, X: number, Y: number, size: number, color = NAVY, weight = 700) {
  x.fillStyle = color;
  x.font = `${weight} ${size}px system-ui, -apple-system, sans-serif`;
  x.fillText(s, X, Y);
}

/** A website: nav, headline, button, three cards. */
export function drawWebsite(x: CanvasRenderingContext2D, W: number, H: number, t = 0) {
  x.fillStyle = "#ffffff";
  x.fillRect(0, 0, W, H);
  const u = W / 100;
  rr(x, 5 * u, 4 * u, 12 * u, 2.6 * u, u, NAVY);
  for (let i = 0; i < 4; i++) rr(x, (55 + i * 10) * u, 4.4 * u, 7 * u, 1.8 * u, u, SOFT);
  const g = x.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, "#dfe5ff");
  g.addColorStop(1, "#d3f2ec");
  x.fillStyle = g;
  x.beginPath();
  x.roundRect(5 * u, 11 * u, 90 * u, H - 34 * u, 2 * u);
  x.fill();
  text(x, "Fresh food,", 10 * u, 22 * u, 6 * u);
  text(x, "delivered tonight", 10 * u, 29.5 * u, 6 * u);
  rr(x, 10 * u, 34 * u, 18 * u, 4.5 * u, 2.2 * u, TEAL);
  text(x, "Order now", 12.5 * u, 37.2 * u, 2.2 * u, "#ffffff");
  const lift = Math.sin(t * 2) * 0.8 * u;
  rr(x, 60 * u, 16 * u + lift, 28 * u, 22 * u, 2 * u, "#ffffff");
  rr(x, 63 * u, 19 * u + lift, 22 * u, 10 * u, 1.5 * u, "#ffd7c2");
  rr(x, 63 * u, 31 * u + lift, 14 * u, 1.8 * u, u, SOFT);
  for (let i = 0; i < 3; i++) {
    const X = (5 + i * 31) * u;
    rr(x, X, H - 20 * u, 28 * u, 16 * u, 2 * u, "#f5f6fa");
    rr(x, X + 2 * u, H - 18 * u, 8 * u, 8 * u, 1.5 * u, ["#c9e9df", "#d9dcff", "#fbe7a1"][i]);
    rr(x, X + 12 * u, H - 17 * u, 13 * u, 1.8 * u, u, "#d6dbe8");
    rr(x, X + 12 * u, H - 13.5 * u, 9 * u, 1.8 * u, u, SOFT);
  }
}

/** A phone app: greeting, a big card, a list. */
export function drawApp(x: CanvasRenderingContext2D, W: number, H: number, t = 0) {
  x.fillStyle = "#f6f7fb";
  x.fillRect(0, 0, W, H);
  const u = W / 100;
  text(x, "Good evening", 8 * u, 16 * u, 7 * u);
  text(x, "Your order is on its way", 8 * u, 24 * u, 4.6 * u, "#6b7087", 500);
  rr(x, 8 * u, 30 * u, 84 * u, 46 * u, 6 * u, NAVY);
  text(x, "Arriving in", 14 * u, 42 * u, 4.6 * u, "#aab3ff", 600);
  text(x, `${12 - (Math.floor(t) % 5)} min`, 14 * u, 56 * u, 11 * u, "#ffffff", 800);
  rr(x, 14 * u, 64 * u, 72 * u, 3 * u, 1.5 * u, "rgba(255,255,255,.18)");
  rr(x, 14 * u, 64 * u, (40 + 30 * ((Math.sin(t) + 1) / 2)) * u, 3 * u, 1.5 * u, "#5ee0d0");
  for (let i = 0; i < 4; i++) {
    const Y = (84 + i * 22) * u;
    rr(x, 8 * u, Y, 84 * u, 18 * u, 4 * u, "#ffffff");
    rr(x, 12 * u, Y + 3 * u, 12 * u, 12 * u, 3 * u, ["#ffd7c2", "#c9e9df", "#d9dcff", "#fbe7a1"][i]);
    rr(x, 28 * u, Y + 5 * u, 36 * u, 3 * u, 1.5 * u, "#c5cbe0");
    rr(x, 28 * u, Y + 10 * u, 24 * u, 3 * u, 1.5 * u, SOFT);
    text(x, ["₹420", "₹180", "₹960", "₹240"][i], 72 * u, Y + 11 * u, 4.4 * u, NAVY, 700);
  }
  rr(x, 8 * u, H - 22 * u, 84 * u, 13 * u, 6.5 * u, TEAL);
  text(x, "Track order", 34 * u, H - 13.5 * u, 4.8 * u, "#ffffff");
}

/** A dashboard: KPIs, a line chart and bars. */
export function drawDashboard(x: CanvasRenderingContext2D, W: number, H: number, t = 0) {
  x.fillStyle = "#0f1430";
  x.fillRect(0, 0, W, H);
  const u = W / 100;
  rr(x, 0, 0, 16 * u, H, 0, "#151b3d");
  for (let i = 0; i < 6; i++) rr(x, 4 * u, (8 + i * 7) * u, 8 * u, 2 * u, u, i === 0 ? "#5ee0d0" : "#2a3260");
  const kpi = [["Orders", "1,284"], ["Revenue", "₹8.4L"], ["New customers", "312"]];
  kpi.forEach(([k, v], i) => {
    const X = (20 + i * 26.5) * u;
    rr(x, X, 5 * u, 24 * u, 13 * u, 1.6 * u, "#1a2150");
    text(x, k, X + 2 * u, 9.5 * u, 1.9 * u, "#8f98c9", 600);
    text(x, v, X + 2 * u, 15 * u, 3.6 * u, "#ffffff", 800);
  });
  rr(x, 20 * u, 21 * u, 50 * u, H - 26 * u, 1.6 * u, "#1a2150");
  x.strokeStyle = "#5ee0d0";
  x.lineWidth = 0.5 * u;
  x.beginPath();
  for (let i = 0; i <= 40; i++) {
    const X = 23 * u + (i / 40) * 44 * u;
    const Y = H - 10 * u - (i / 40) * (H - 42 * u) - Math.sin(i * 0.6 + t * 1.5) * 2.2 * u;
    if (i) x.lineTo(X, Y);
    else x.moveTo(X, Y);
  }
  x.stroke();
  rr(x, 73 * u, 21 * u, 24 * u, H - 26 * u, 1.6 * u, "#1a2150");
  for (let i = 0; i < 6; i++) {
    const h = (0.3 + 0.6 * Math.abs(Math.sin(i * 1.7 + t))) * (H - 40 * u);
    rr(x, (75.5 + i * 3.5) * u, H - 8 * u - h, 2.2 * u, h, 0.6 * u, i === 5 ? "#5ee0d0" : "#4b56a8");
  }
}

export const DRAWERS = { website: drawWebsite, app: drawApp, dashboard: drawDashboard };
