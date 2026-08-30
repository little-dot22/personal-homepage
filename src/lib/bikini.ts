// 比基尼海滩风格背景与卡通角色（Canvas 手绘，简化卡通风）

export const bikiniScale = (H: number) =>
  Math.min(1.05, Math.max(0.5, H / 760));

export const bikiniHorizon = (H: number) => H * 0.52;

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

function hill(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y);
  ctx.quadraticCurveTo(x - w * 0.2, y - h, x + w * 0.2, y - h);
  ctx.quadraticCurveTo(x + w / 2, y, x + w / 2, y);
  ctx.closePath();
  ctx.fill();
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
  rr(ctx, -58, -152, 116, 152, 34);
  ctx.fillStyle = "#eba64e";
  ctx.fill();
  ctx.strokeStyle = "#b87a2c";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.save();
  rr(ctx, -58, -152, 116, 152, 34);
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
    ctx.moveTo(i * 24, -152);
    ctx.lineTo(i * 24 - 20, 0);
    ctx.stroke();
  }
  ctx.restore();
  ctx.fillStyle = "#4da357";
  ctx.strokeStyle = "#33773d";
  ctx.lineWidth = 2.5;
  for (let i = -2; i <= 2; i++) {
    ctx.save();
    ctx.translate(i * 18, -152);
    ctx.rotate(i * 0.22);
    ctx.beginPath();
    ctx.ellipse(0, -34, 13, 38, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  rr(ctx, -22, -56, 44, 56, 22);
  ctx.fillStyle = "#6d4423";
  ctx.fill();
  ctx.strokeStyle = "#4a2d15";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "#ffd166";
  ctx.beginPath();
  ctx.arc(13, -28, 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#cfeefb";
  ctx.strokeStyle = "#7fb7cc";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(40, -104, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "#7fb7cc";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(40, -121);
  ctx.lineTo(40, -87);
  ctx.moveTo(23, -104);
  ctx.lineTo(57, -104);
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
  ctx.ellipse(0, -62, 82, 70, 0, Math.PI, Math.PI * 2);
  ctx.lineTo(82, 0);
  ctx.lineTo(-82, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#7a4d31";
  for (const [px, py, pr] of [
    [-38, -84, 16],
    [30, -96, 12],
    [48, -40, 18],
    [-52, -36, 14]
  ] as const) {
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }
  rr(ctx, -20, -34, 40, 34, 20);
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
  rr(ctx, -52, -150, 104, 150, 26);
  ctx.fillStyle = "#b3aea2";
  ctx.fill();
  ctx.strokeStyle = "#8a857a";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#8a857a";
  ctx.lineWidth = 2.5;
  for (const ex of [-22, 22]) {
    ctx.beginPath();
    ctx.ellipse(ex, -98, 12, 17, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.fillStyle = "#3a3a3a";
  ctx.beginPath();
  ctx.arc(-22, -94, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(22, -94, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#b3aea2";
  ctx.strokeStyle = "#8a857a";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -70);
  ctx.quadraticCurveTo(6, -34, 12, -28);
  ctx.quadraticCurveTo(0, -16, -12, -28);
  ctx.quadraticCurveTo(-6, -34, 0, -70);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(12, -28);
  ctx.lineTo(12, -18);
  ctx.stroke();
  rr(ctx, -26, -38, 52, 38, 26);
  ctx.fillStyle = "#4a463f";
  ctx.fill();
  ctx.strokeStyle = "#33302a";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}

function krustyKrab(ctx: CanvasRenderingContext2D, x: number, groundY: number, s: number) {
  ctx.save();
  ctx.translate(x, groundY);
  ctx.scale(s, s);
  // 蟹钳
  const claw = (cx: number, cy: number, dir: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(dir);
    ctx.fillStyle = "#e5484d";
    ctx.strokeStyle = "#a92a2e";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, -26, 22, 34, -0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(18, -40, 16, 24, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };
  claw(-88, -96, 0.3);
  claw(88, -96, -0.3);
  // 主体木屋
  rr(ctx, -96, -118, 192, 118, 30);
  ctx.fillStyle = "#d2a264";
  ctx.fill();
  ctx.strokeStyle = "#a5763a";
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.strokeStyle = "#b98847";
  ctx.lineWidth = 2.5;
  for (let i = 1; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(-90, -118 + i * 18);
    ctx.lineTo(90, -118 + i * 18);
    ctx.stroke();
  }
  // 遮阳篷
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#e5484d" : "#ffffff";
    ctx.beginPath();
    ctx.moveTo(-96 + i * 32, -118);
    ctx.lineTo(-80 + i * 32, -140);
    ctx.lineTo(-48 + i * 32, -140);
    ctx.lineTo(-64 + i * 32, -118);
    ctx.closePath();
    ctx.fill();
  }
  // 蟹堡标志
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#a5763a";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, -52, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#e5484d";
  ctx.beginPath();
  ctx.ellipse(0, -50, 11, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  for (const ex of [-8, 8]) {
    ctx.beginPath();
    ctx.arc(ex, -62, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  // 门与窗
  rr(ctx, -26, -58, 52, 58, 24);
  ctx.fillStyle = "#8a5a2b";
  ctx.fill();
  ctx.strokeStyle = "#65401d";
  ctx.lineWidth = 3;
  ctx.stroke();
  for (const wx of [-62, 62]) {
    ctx.fillStyle = "#cfeefb";
    ctx.strokeStyle = "#7fb7cc";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(wx, -88, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  // 旗杆
  ctx.strokeStyle = "#7a5a33";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(96, -118);
  ctx.lineTo(96, -196);
  ctx.stroke();
  ctx.fillStyle = "#e5484d";
  ctx.beginPath();
  ctx.moveTo(96, -196);
  ctx.lineTo(132, -186);
  ctx.lineTo(96, -176);
  ctx.closePath();
  ctx.fill();
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
  ctx.moveTo(-38, -78);
  ctx.lineTo(38, -78);
  ctx.lineTo(30, 0);
  ctx.lineTo(-30, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(0, -78, 38, 8, 0, 0, Math.PI * 2);
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
  ctx.restore();
}

export function renderStaticBg(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const s = bikiniScale(H);
  const horizon = bikiniHorizon(H);

  const water = ctx.createLinearGradient(0, 0, 0, H);
  water.addColorStop(0, "#8fd4f2");
  water.addColorStop(0.6, "#5fb6e2");
  water.addColorStop(1, "#3f96cc");
  ctx.fillStyle = water;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#8fd09b";
  hill(ctx, W * 0.12, horizon + 4, 210, 80);
  hill(ctx, W * 0.42, horizon + 4, 260, 110);
  hill(ctx, W * 0.78, horizon + 4, 220, 88);

  const sand = ctx.createLinearGradient(0, horizon, 0, H);
  sand.addColorStop(0, "#f7e3a9");
  sand.addColorStop(1, "#dcb877");
  ctx.fillStyle = sand;
  ctx.beginPath();
  ctx.moveTo(0, H);
  ctx.lineTo(0, horizon + 6);
  for (let x = 0; x <= W; x += 48) {
    ctx.quadraticCurveTo(x + 24, horizon + 6 + Math.sin(x * 0.045) * 9, x + 48, horizon + 6);
  }
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(160,120,60,0.22)";
  for (let i = 0; i < 110; i++) {
    const x = (i * 7919) % Math.max(W, 1);
    const span = Math.max(H - horizon - 50, 1);
    const y = horizon + 24 + ((i * 4057) % span);
    ctx.fillRect(x, y, 2, 2);
  }

  sandFlower(ctx, W * 0.19, horizon + 26, s);
  sandFlower(ctx, W * 0.40, horizon + 46, s * 1.15);
  sandFlower(ctx, W * 0.61, horizon + 24, s * 0.9);
  sandFlower(ctx, W * 0.83, horizon + 36, s);

  pineapple(ctx, W * 0.055, horizon + 24, s);
  rockHouse(ctx, W * 0.265, horizon + 28, s);
  tikiHouse(ctx, W * 0.47, horizon + 24, s);
  krustyKrab(ctx, W * 0.675, horizon + 20, s);
  chumBucket(ctx, W * 0.9, horizon + 40, s);
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

export function drawSponge(
  ctx: CanvasRenderingContext2D,
  x: number,
  groundY: number,
  t: number,
  s: number
) {
  const bob = Math.abs(Math.sin(t * 2.2)) * 4;
  ctx.save();
  ctx.translate(x, groundY - bob);
  ctx.scale(s, s);
  rr(ctx, -30, -74, 60, 74, 8);
  ctx.fillStyle = "#f7dd4f";
  ctx.fill();
  ctx.strokeStyle = "#c9a72e";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "#d9bd3c";
  for (const [hx, hy] of [
    [-16, -60],
    [2, -66],
    [16, -50],
    [-10, -40],
    [12, -28],
    [-18, -24]
  ] as const) {
    ctx.beginPath();
    ctx.arc(hx, hy, 3.4, 0, Math.PI * 2);
    ctx.fill();
  }
  // 眼睛
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#c9a72e";
  ctx.lineWidth = 2.5;
  for (const ex of [-15, 11]) {
    ctx.beginPath();
    ctx.ellipse(ex, -42, 9, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  const blink = t % 3.4 < 0.12;
  if (!blink) {
    ctx.fillStyle = "#3f8fe0";
    ctx.beginPath();
    ctx.arc(-15, -40, 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(11, -40, 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1c2b3a";
    ctx.beginPath();
    ctx.arc(-15, -40, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(11, -40, 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.strokeStyle = "#c9a72e";
    ctx.lineWidth = 2.5;
    for (const ex of [-15, 11]) {
      ctx.beginPath();
      ctx.moveTo(ex - 8, -42);
      ctx.lineTo(ex + 8, -42);
      ctx.stroke();
    }
  }
  // 鼻子
  ctx.fillStyle = "#d9a13d";
  ctx.strokeStyle = "#b8852e";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(-2, -30, 4.5, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // 嘴
  ctx.strokeStyle = "#a9812a";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(-2, -26, 13, 0.25, Math.PI - 0.25);
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(-8, -24, 7, 8);
  ctx.fillRect(0, -24, 7, 8);
  ctx.strokeStyle = "#a9812a";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-8, -24, 7, 8);
  ctx.strokeRect(0, -24, 7, 8);
  // 腮帮
  ctx.fillStyle = "#d9a13d";
  for (const fx of [-24, 21]) {
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(fx, -18 + i * 5, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // 衬衫领带
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#d5dbe0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-16, -8);
  ctx.lineTo(16, -8);
  ctx.lineTo(12, 4);
  ctx.lineTo(-12, 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#e5484d";
  ctx.beginPath();
  ctx.moveTo(-4, -8);
  ctx.lineTo(4, -8);
  ctx.lineTo(2, 4);
  ctx.lineTo(-2, 4);
  ctx.closePath();
  ctx.fill();
  // 短裤
  ctx.fillStyle = "#7a4d31";
  ctx.beginPath();
  ctx.moveTo(-16, 4);
  ctx.lineTo(16, 4);
  ctx.lineTo(18, 22);
  ctx.lineTo(-18, 22);
  ctx.closePath();
  ctx.fill();
  // 腿鞋
  ctx.fillStyle = "#f7dd4f";
  ctx.fillRect(-14, 22, 7, 16);
  ctx.fillRect(7, 22, 7, 16);
  ctx.fillStyle = "#222222";
  rr(ctx, -18, 36, 16, 10, 4);
  ctx.fill();
  rr(ctx, 3, 36, 16, 10, 4);
  ctx.fill();
  // 挥手
  const wave = Math.sin(t * 3);
  ctx.save();
  ctx.translate(30, -46);
  ctx.rotate(-0.6 - wave * 0.5);
  ctx.fillStyle = "#f7dd4f";
  ctx.strokeStyle = "#c9a72e";
  ctx.lineWidth = 2.5;
  rr(ctx, -4, -6, 26, 10, 5);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  ctx.restore();
}

export function drawPatrick(
  ctx: CanvasRenderingContext2D,
  x: number,
  groundY: number,
  t: number,
  s: number
) {
  const bob = Math.abs(Math.sin(t * 1.8 + 1)) * 3;
  ctx.save();
  ctx.translate(x, groundY - bob);
  ctx.scale(s, s);
  ctx.fillStyle = "#f28ab5";
  ctx.strokeStyle = "#cf6e9d";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    const px = Math.cos(a) * 40;
    const py = Math.sin(a) * 40 - 46;
    const na = a + Math.PI * 2 / 10;
    const nx = Math.cos(na) * 15;
    const ny = Math.sin(na) * 15 - 46;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
    ctx.quadraticCurveTo(nx, ny, Math.cos(a + Math.PI * 2 / 5) * 40, Math.sin(a + Math.PI * 2 / 5) * 40 - 46);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // 短裤
  ctx.fillStyle = "#b06bd0";
  ctx.strokeStyle = "#8a4fb8";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-22, -8);
  ctx.lineTo(22, -8);
  ctx.lineTo(30, 20);
  ctx.lineTo(-30, 20);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#8a4fb8";
  ctx.fillRect(-4, 2, 8, 10);
  // 肚脐
  ctx.strokeStyle = "#cf6e9d";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -14, 3, 0, Math.PI * 2);
  ctx.stroke();
  // 眼眉
  ctx.fillStyle = "#4a2c3a";
  const blink = t % 4.1 < 0.15;
  if (!blink) {
    ctx.beginPath();
    ctx.ellipse(-11, -42, 4.5, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(7, -42, 4.5, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillRect(-16, -44, 11, 3);
    ctx.fillRect(2, -44, 11, 3);
  }
  ctx.strokeStyle = "#4a2c3a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-18, -56);
  ctx.lineTo(-4, -50);
  ctx.moveTo(18, -56);
  ctx.lineTo(4, -50);
  ctx.stroke();
  // 嘴
  ctx.beginPath();
  ctx.arc(-3, -34, 8, 0.2, Math.PI - 0.2);
  ctx.stroke();
  ctx.restore();
}

export function drawSquidward(
  ctx: CanvasRenderingContext2D,
  x: number,
  groundY: number,
  t: number,
  s: number
) {
  const bob = Math.abs(Math.sin(t * 1.5 + 2)) * 2.5;
  ctx.save();
  ctx.translate(x, groundY - bob);
  ctx.scale(s, s);
  // 头
  ctx.fillStyle = "#8fd7c4";
  ctx.strokeStyle = "#5fb3a0";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, -70, 26, 34, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // 身体
  rr(ctx, -20, -58, 40, 72, 14);
  ctx.fill();
  ctx.stroke();
  // 眼睛
  ctx.fillStyle = "#ffffff";
  for (const ex of [-11, 9]) {
    ctx.beginPath();
    ctx.ellipse(ex, -76, 8, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#8fd7c4";
  for (const ex of [-11, 9]) {
    ctx.fillRect(ex - 9, -88, 18, 8);
  }
  ctx.fillStyle = "#b3452f";
  ctx.beginPath();
  ctx.arc(-11, -71, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(9, -71, 3, 0, Math.PI * 2);
  ctx.fill();
  // 大鼻子
  ctx.fillStyle = "#8fd7c4";
  ctx.strokeStyle = "#5fb3a0";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -62);
  ctx.quadraticCurveTo(30, -52, 34, -34);
  ctx.quadraticCurveTo(26, -26, 14, -32);
  ctx.quadraticCurveTo(8, -40, 0, -46);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // 嘴
  ctx.strokeStyle = "#5fb3a0";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(-4, -28, 10, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  // 触手
  ctx.fillStyle = "#8fd7c4";
  ctx.strokeStyle = "#5fb3a0";
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.ellipse(-15 + i * 10, 20, 7, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

export function drawKrabs(
  ctx: CanvasRenderingContext2D,
  x: number,
  groundY: number,
  t: number,
  s: number
) {
  const bob = Math.abs(Math.sin(t * 2 + 0.5)) * 2.5;
  ctx.save();
  ctx.translate(x, groundY - bob);
  ctx.scale(s, s);
  ctx.fillStyle = "#e5484d";
  ctx.strokeStyle = "#b03034";
  ctx.lineWidth = 3;
  // 身体
  ctx.beginPath();
  ctx.ellipse(0, -34, 36, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // 眼睛柱
  ctx.strokeStyle = "#b03034";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-14, -52);
  ctx.lineTo(-16, -70);
  ctx.moveTo(12, -52);
  ctx.lineTo(14, -70);
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  for (const ex of [-16, 14]) {
    ctx.beginPath();
    ctx.ellipse(ex, -76, 8, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.fillStyle = "#1c2b3a";
  ctx.beginPath();
  ctx.arc(-16, -74, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(14, -74, 3, 0, Math.PI * 2);
  ctx.fill();
  // 大钳
  const claw = (cx: number, dir: number) => {
    ctx.save();
    ctx.translate(cx, -30);
    ctx.scale(dir, 1);
    ctx.beginPath();
    ctx.ellipse(30, 0, 26, 18, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(48, -8);
    ctx.quadraticCurveTo(62, -18, 58, -30);
    ctx.quadraticCurveTo(56, -16, 52, -12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };
  claw(-34, -1);
  claw(36, 1);
  // 嘴
  ctx.strokeStyle = "#8f2629";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, -22, 8, 0.3, Math.PI - 0.3);
  ctx.stroke();
  // 裤子腿
  ctx.fillStyle = "#4a5fd0";
  ctx.strokeStyle = "#37479f";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-24, -16);
  ctx.lineTo(24, -16);
  ctx.lineTo(20, 4);
  ctx.lineTo(-20, 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#e5484d";
  ctx.strokeStyle = "#b03034";
  for (const lx of [-14, 6]) {
    ctx.beginPath();
    ctx.ellipse(lx, 14, 7, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

export function drawPearl(
  ctx: CanvasRenderingContext2D,
  x: number,
  groundY: number,
  t: number,
  s: number
) {
  const bob = Math.abs(Math.sin(t * 1.7 + 0.8)) * 3;
  ctx.save();
  ctx.translate(x, groundY - bob);
  ctx.scale(s, s);
  // 头
  ctx.fillStyle = "#a7c4dd";
  ctx.strokeStyle = "#7d9cb8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-30, -10);
  ctx.quadraticCurveTo(-30, -84, 0, -84);
  ctx.quadraticCurveTo(32, -84, 32, -10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // 下巴白区
  ctx.fillStyle = "#eef6fb";
  ctx.beginPath();
  ctx.moveTo(-18, -14);
  ctx.quadraticCurveTo(0, 4, 18, -14);
  ctx.lineTo(22, -6);
  ctx.quadraticCurveTo(0, 12, -22, -6);
  ctx.closePath();
  ctx.fill();
  // 气孔
  ctx.fillStyle = "#7d9cb8";
  ctx.beginPath();
  ctx.ellipse(0, -84, 5, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  // 眼睛
  ctx.fillStyle = "#ffffff";
  for (const ex of [-13, 13]) {
    ctx.beginPath();
    ctx.ellipse(ex, -52, 8, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#7d9cb8";
    ctx.stroke();
  }
  ctx.fillStyle = "#3f8fe0";
  ctx.beginPath();
  ctx.arc(-13, -50, 3.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(13, -50, 3.6, 0, Math.PI * 2);
  ctx.fill();
  // 蝴蝶结
  ctx.fillStyle = "#f28ab5";
  ctx.strokeStyle = "#cf6e9d";
  ctx.lineWidth = 2;
  for (const [bx, br] of [
    [28, 9],
    [40, 9]
  ] as const) {
    ctx.beginPath();
    ctx.ellipse(bx, -66, br, 7, bx === 28 ? 0.4 : -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.fillStyle = "#cf6e9d";
  ctx.beginPath();
  ctx.arc(34, -66, 3, 0, Math.PI * 2);
  ctx.fill();
  // 身体
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#d5dbe0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-12, -10);
  ctx.lineTo(12, -10);
  ctx.lineTo(16, 18);
  ctx.lineTo(-16, 18);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

export function drawPlankton(
  ctx: CanvasRenderingContext2D,
  x: number,
  groundY: number,
  t: number,
  s: number
) {
  const hop = Math.abs(Math.sin(t * 6)) * 7;
  ctx.save();
  ctx.translate(x, groundY - hop);
  ctx.scale(s, s);
  ctx.fillStyle = "#7fbf52";
  ctx.strokeStyle = "#5d9a3a";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(0, -10, 9, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "#5d9a3a";
  ctx.lineWidth = 2;
  for (const ax of [-5, 5]) {
    ctx.beginPath();
    ctx.moveTo(ax, -22);
    ctx.lineTo(ax * 1.4, -34);
    ctx.stroke();
    ctx.fillStyle = "#7fbf52";
    ctx.beginPath();
    ctx.arc(ax * 1.4, -36, 2.4, 0, Math.PI * 2);
    ctx.fill();
  }
  // 浓眉
  ctx.strokeStyle = "#3a5c24";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-8, -18);
  ctx.lineTo(8, -14);
  ctx.stroke();
  // 独眼
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(0, -8, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffd166";
  ctx.beginPath();
  ctx.arc(0, -8, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e5484d";
  ctx.beginPath();
  ctx.arc(0, -8, 2.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
