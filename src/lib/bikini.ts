// 比基尼海滩背景（沙地 + 矢量房屋 + 花云；角色与蟹堡王使用图片素材渲染）

export const bikiniScale = (H: number) =>
  Math.min(1.15, Math.max(0.5, H / 950));

export const bikiniHorizon = (H: number) => H * 0.9;

function rr(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function sandFlower(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.strokeStyle = "#4e9a4a";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-4, -18, 2, -34);
  ctx.stroke();
  const petals = ["#ff9fc2", "#ffd166", "#9fd8ff", "#ffb3a6", "#c9a6ff"];
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    ctx.fillStyle = petals[i];
    ctx.beginPath();
    ctx.arc(Math.cos(a) * 11, -40 + Math.sin(a) * 11, 8.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#ffe88a";
  ctx.beginPath();
  ctx.arc(0, -40, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function pineapple(ctx: CanvasRenderingContext2D, x: number, groundY: number, s: number) {
  ctx.save();
  ctx.translate(x, groundY);
  ctx.scale(s, s);
  rr(ctx, -58, -150, 116, 150, 30);
  ctx.fillStyle = "#e9a54d";
  ctx.fill();
  ctx.strokeStyle = "#b8792c";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.save();
  rr(ctx, -58, -150, 116, 150, 30);
  ctx.clip();
  ctx.strokeStyle = "#cf9138";
  ctx.lineWidth = 2.5;
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.moveTo(-58, i * 24 + 4);
    ctx.lineTo(58, i * 24 + 24);
    ctx.stroke();
  }
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 24, -150);
    ctx.lineTo(i * 24 - 20, 0);
    ctx.stroke();
  }
  ctx.restore();
  for (let layer = 0; layer < 2; layer++) {
    ctx.fillStyle = layer === 0 ? "#3d9c4e" : "#4db75f";
    ctx.strokeStyle = "#2e7a3d";
    ctx.lineWidth = 2.5;
    for (let i = -2; i <= 2; i++) {
      ctx.save();
      ctx.translate(i * 16, -150 + layer * 4);
      ctx.rotate(i * 0.24 - layer * 0.12);
      ctx.beginPath();
      ctx.ellipse(0, -36, 13 - layer * 2, 40, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }
  rr(ctx, -22, -54, 44, 54, 22);
  ctx.fillStyle = "#6d4423";
  ctx.fill();
  ctx.strokeStyle = "#4a2d15";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.strokeStyle = "rgba(74,45,21,0.55)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -54);
  ctx.lineTo(0, 0);
  ctx.stroke();
  ctx.fillStyle = "#ffd166";
  ctx.beginPath();
  ctx.arc(13, -27, 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#cfeefb";
  ctx.strokeStyle = "#7fb7cc";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(40, -102, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "#7fb7cc";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(40, -119);
  ctx.lineTo(40, -85);
  ctx.moveTo(23, -102);
  ctx.lineTo(57, -102);
  ctx.stroke();
  ctx.restore();
}

function rockHouse(ctx: CanvasRenderingContext2D, x: number, groundY: number, s: number) {
  ctx.save();
  ctx.translate(x, groundY);
  ctx.scale(s, s);
  ctx.fillStyle = "#8b5a3c";
  ctx.strokeStyle = "#6b4226";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, -58, 82, 70, 0, Math.PI, Math.PI * 2);
  ctx.lineTo(82, 0);
  ctx.lineTo(-82, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#7a4d31";
  for (const [px, py, pr] of [
    [-38, -80, 16],
    [30, -92, 12],
    [48, -38, 18],
    [-52, -34, 14]
  ] as const) {
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#6fae58";
  for (const [mx, my, mr] of [
    [-58, -40, 10],
    [-30, -100, 8],
    [56, -60, 9]
  ] as const) {
    ctx.beginPath();
    ctx.arc(mx, my, mr, 0, Math.PI * 2);
    ctx.fill();
  }
  rr(ctx, -20, -32, 40, 32, 20);
  ctx.fillStyle = "#45291a";
  ctx.fill();
  ctx.strokeStyle = "#33200f";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}

function tikiHouse(ctx: CanvasRenderingContext2D, x: number, groundY: number, s: number) {
  ctx.save();
  ctx.translate(x, groundY);
  ctx.scale(s, s);
  rr(ctx, -52, -148, 104, 148, 24);
  ctx.fillStyle = "#b3aea2";
  ctx.fill();
  ctx.strokeStyle = "#8a857a";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "#a29d90";
  ctx.strokeStyle = "#8a857a";
  ctx.lineWidth = 2.5;
  rr(ctx, -34, -104, 68, 12, 6);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#7d786c";
  for (const ex of [-22, 22]) {
    ctx.beginPath();
    ctx.ellipse(ex, -88, 13, 16, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#ffffff";
  for (const ex of [-22, 22]) {
    ctx.beginPath();
    ctx.ellipse(ex, -86, 8, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#3a3a3a";
  ctx.beginPath();
  ctx.arc(-22, -82, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(22, -82, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#a29d90";
  ctx.strokeStyle = "#8a857a";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-10, -60);
  ctx.quadraticCurveTo(0, -30, 10, -22);
  ctx.lineTo(26, -22);
  ctx.quadraticCurveTo(22, -40, 12, -58);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  rr(ctx, -26, -36, 52, 36, 26);
  ctx.fillStyle = "#4a463f";
  ctx.fill();
  ctx.strokeStyle = "#33302a";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}

function chumBucket(ctx: CanvasRenderingContext2D, x: number, groundY: number, s: number) {
  ctx.save();
  ctx.translate(x, groundY);
  ctx.scale(s, s);
  ctx.fillStyle = "#7d8890";
  ctx.strokeStyle = "#5a636b";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-38, -76);
  ctx.lineTo(38, -76);
  ctx.lineTo(30, 0);
  ctx.lineTo(-30, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(0, -76, 38, 8, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#909ba3";
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "#5a636b";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, -46, 26, Math.PI, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#3d4348";
  ctx.beginPath();
  ctx.ellipse(0, -26, 20, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#6d7780";
  ctx.beginPath();
  ctx.arc(-14, -18, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(14, -18, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function renderStaticBg(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const s = bikiniScale(H);
  const horizon = bikiniHorizon(H);

  const water = ctx.createLinearGradient(0, 0, 0, H);
  water.addColorStop(0, "#8fd4f2");
  water.addColorStop(0.7, "#5fb6e2");
  water.addColorStop(1, "#3f96cc");
  ctx.fillStyle = water;
  ctx.fillRect(0, 0, W, H);

  // 沙地（最多占屏幕 1/10 高）
  const sandTop = horizon;
  const sand = ctx.createLinearGradient(0, sandTop, 0, H);
  sand.addColorStop(0, "#f7e3a9");
  sand.addColorStop(1, "#dcb877");
  ctx.fillStyle = sand;
  ctx.beginPath();
  ctx.moveTo(0, H);
  ctx.lineTo(0, sandTop + 4);
  for (let x = 0; x <= W; x += 48) {
    ctx.quadraticCurveTo(
      x + 24,
      sandTop + 4 + Math.sin(x * 0.05) * 5,
      x + 48,
      sandTop + 4
    );
  }
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(160,120,60,0.25)";
  for (let i = 0; i < 80; i++) {
    const x = (i * 7919) % Math.max(W, 1);
    const span = Math.max(H - sandTop - 6, 1);
    const y = sandTop + 6 + ((i * 4057) % span);
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  for (let i = 0; i < 10; i++) {
    const x = ((i * 104729 + 9999) % Math.max(W - 30, 1)) + 10;
    const y = sandTop + 6 + ((i * 2657) % Math.max(H - sandTop - 14, 1));
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x <= W; x += 24) {
    const y = sandTop + 4 + Math.sin(x * 0.05) * 5;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  sandFlower(ctx, W * 0.19, sandTop + 8, s);
  sandFlower(ctx, W * 0.40, sandTop + 12, s * 1.1);
  sandFlower(ctx, W * 0.61, sandTop + 8, s * 0.9);
  sandFlower(ctx, W * 0.83, sandTop + 10, s);

  pineapple(ctx, W * 0.055, sandTop + 4, s);
  rockHouse(ctx, W * 0.265, sandTop + 6, s);
  tikiHouse(ctx, W * 0.47, sandTop + 4, s);
  chumBucket(ctx, W * 0.9, sandTop + 8, s);
}

export function drawCloud(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  t: number,
  s: number
) {
  ctx.save();
  ctx.translate(x + Math.sin(t * 0.3) * 12, y + Math.sin(t * 0.7) * 5);
  ctx.scale(s, s);
  ctx.fillStyle = "#eaf7fd";
  ctx.strokeStyle = "#bcd9e8";
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + t * 0.05;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * 26, Math.sin(a) * 26, 19, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.fillStyle = "#fbfdff";
  ctx.beginPath();
  ctx.arc(0, 0, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}
