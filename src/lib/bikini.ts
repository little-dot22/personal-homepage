// 比基尼海滩风格背景与卡通角色（Canvas 手绘，向原作致敬的细节化造型）

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

// ---------- 房屋 ----------

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
  // 冠叶（双层）
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
  // 门（木板纹）
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
  // 窗
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
  // 苔藓
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
  // 门
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
  // 眉脊
  ctx.fillStyle = "#a29d90";
  ctx.strokeStyle = "#8a857a";
  ctx.lineWidth = 2.5;
  rr(ctx, -34, -104, 68, 12, 6);
  ctx.fill();
  ctx.stroke();
  // 眼窝
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
  // 长鼻
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
  // 门（嘴）
  rr(ctx, -26, -36, 52, 36, 26);
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
  // 蟹钳（带锯齿）
  const claw = (cx: number, cy: number, dir: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(dir);
    ctx.fillStyle = "#e5484d";
    ctx.strokeStyle = "#a92a2e";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, -24, 22, 32, -0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(10, -44);
    ctx.quadraticCurveTo(24, -66, 40, -70);
    ctx.quadraticCurveTo(36, -54, 30, -46);
    ctx.quadraticCurveTo(26, -40, 22, -34);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };
  claw(-86, -92, 0.32);
  claw(86, -92, -0.32);
  // 主体
  rr(ctx, -96, -114, 192, 114, 28);
  ctx.fillStyle = "#d2a264";
  ctx.fill();
  ctx.strokeStyle = "#a5763a";
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.strokeStyle = "#b98847";
  ctx.lineWidth = 2.5;
  for (let i = 1; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(-90, -114 + i * 18);
    ctx.lineTo(90, -114 + i * 18);
    ctx.stroke();
  }
  // 遮阳篷
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#e5484d" : "#ffffff";
    ctx.strokeStyle = "#a92a2e";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-96 + i * 32, -114);
    ctx.lineTo(-80 + i * 32, -138);
    ctx.lineTo(-48 + i * 32, -138);
    ctx.lineTo(-64 + i * 32, -114);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  // 蟹堡标志
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#a5763a";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, -50, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#e5484d";
  ctx.beginPath();
  ctx.ellipse(0, -48, 11, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  for (const ex of [-8, 8]) {
    ctx.beginPath();
    ctx.arc(ex, -60, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  // 门与窗
  rr(ctx, -26, -56, 52, 56, 24);
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
    ctx.arc(wx, -86, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  // 旗杆
  ctx.strokeStyle = "#7a5a33";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(96, -114);
  ctx.lineTo(96, -192);
  ctx.stroke();
  ctx.fillStyle = "#e5484d";
  ctx.beginPath();
  ctx.moveTo(96, -192);
  ctx.lineTo(132, -182);
  ctx.lineTo(96, -172);
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

  // 沙粒与贝壳
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

  // 沙沿水线
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
  krustyKrab(ctx, W * 0.675, sandTop + 2, s);
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

// ---------- 角色（细节化造型） ----------

export function drawSponge(
  ctx: CanvasRenderingContext2D,
  x: number,
  groundY: number,
  t: number,
  s: number
) {
  const bob = Math.abs(Math.sin(t * 2.2)) * 3;
  ctx.save();
  ctx.translate(x, groundY - bob);
  ctx.scale(s, s);
  // 波浪边身体
  const body = () => {
    ctx.beginPath();
    ctx.moveTo(-33, -82);
    ctx.bezierCurveTo(-28, -90, -20, -87, -14, -86);
    ctx.bezierCurveTo(-6, -92, 6, -90, 14, -86);
    ctx.bezierCurveTo(24, -92, 33, -86, 35, -80);
    ctx.bezierCurveTo(41, -74, 38, -64, 37, -58);
    ctx.bezierCurveTo(42, -50, 40, -40, 37, -32);
    ctx.bezierCurveTo(42, -24, 39, -13, 34, -8);
    ctx.bezierCurveTo(35, 0, 30, 6, 26, 10);
    ctx.bezierCurveTo(23, 16, 14, 18, 10, 20);
    ctx.bezierCurveTo(2, 24, -4, 24, -12, 20);
    ctx.bezierCurveTo(-20, 16, -28, 11, -31, 4);
    ctx.bezierCurveTo(-38, -4, -36, -15, -35, -24);
    ctx.bezierCurveTo(-41, -32, -39, -43, -36, -52);
    ctx.bezierCurveTo(-42, -62, -39, -74, -33, -82);
    ctx.closePath();
  };
  body();
  ctx.fillStyle = "#fbe66d";
  ctx.fill();
  ctx.strokeStyle = "#b8921f";
  ctx.lineWidth = 3.5;
  ctx.stroke();
  // 洞
  for (const [hx, hy, hr] of [
    [-21, -56, 5.5],
    [-5, -68, 4],
    [13, -50, 6.5],
    [-13, -34, 4],
    [12, -26, 5],
    [23, -44, 3.5],
    [-25, -20, 4.5],
    [1, -12, 3.5]
  ] as const) {
    ctx.fillStyle = "#dcc24a";
    ctx.beginPath();
    ctx.arc(hx, hy, hr, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(184,146,31,0.35)";
    ctx.beginPath();
    ctx.arc(hx + 1.5, hy + 1.5, hr * 0.55, 0, Math.PI * 2);
    ctx.fill();
  }
  // 眼睛
  const blink = t % 3.4 < 0.12;
  for (const ex of [-16, 12]) {
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#b8921f";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(ex, -44, 10, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (blink) {
      ctx.strokeStyle = "#b8921f";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(ex - 9, -44);
      ctx.lineTo(ex + 9, -44);
      ctx.stroke();
    } else {
      ctx.fillStyle = "#5aa8e8";
      ctx.beginPath();
      ctx.arc(ex, -41, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1c2b3a";
      ctx.beginPath();
      ctx.arc(ex, -41, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    // 睫毛
    ctx.strokeStyle = "#b8921f";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ex - 10, -56);
    ctx.lineTo(ex - 13, -62);
    ctx.moveTo(ex + 10, -56);
    ctx.lineTo(ex + 13, -62);
    ctx.stroke();
  }
  // 鼻子
  ctx.fillStyle = "#fbe66d";
  ctx.strokeStyle = "#b8921f";
  ctx.lineWidth = 2.5;
  ctx.save();
  ctx.translate(-1, -26);
  ctx.rotate(-0.12);
  ctx.beginPath();
  ctx.ellipse(0, 0, 6, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  // 嘴
  ctx.fillStyle = "#7a2e23";
  ctx.strokeStyle = "#5c1f16";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-22, -20);
  ctx.quadraticCurveTo(0, 4, 24, -20);
  ctx.quadraticCurveTo(0, 14, -22, -20);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(-8, -22, 7, 7);
  ctx.fillRect(1, -22, 7, 7);
  ctx.fillStyle = "#e5484d";
  ctx.beginPath();
  ctx.ellipse(0, -12, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  // 脸颊
  ctx.fillStyle = "#d9a13d";
  for (const fx of [-28, 26]) {
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(fx, -10 + i * 5, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // 衬衫领带
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#c9ccd1";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-17, 4);
  ctx.lineTo(17, 4);
  ctx.lineTo(13, 18);
  ctx.lineTo(-13, 18);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#e5484d";
  ctx.strokeStyle = "#a92a2e";
  ctx.beginPath();
  ctx.moveTo(-4.5, 2);
  ctx.lineTo(4.5, 2);
  ctx.lineTo(2.5, 16);
  ctx.lineTo(-2.5, 16);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // 短裤 + 腰带
  ctx.fillStyle = "#8a5a2b";
  ctx.strokeStyle = "#65401d";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-17, 16);
  ctx.lineTo(17, 16);
  ctx.lineTo(19, 34);
  ctx.lineTo(-19, 34);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#3a2a15";
  ctx.fillRect(-17, 14, 34, 5);
  ctx.fillStyle = "#f2d25c";
  ctx.fillRect(-3, 14, 6, 5);
  // 腿
  ctx.fillStyle = "#fbe66d";
  ctx.strokeStyle = "#b8921f";
  ctx.lineWidth = 2;
  ctx.fillRect(-15, 34, 7, 18);
  ctx.fillRect(8, 34, 7, 18);
  // 袜子（红蓝条纹）
  for (const lx of [-15, 8]) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(lx, 46, 7, 10);
    ctx.fillStyle = "#5aa8e8";
    ctx.fillRect(lx, 47, 7, 2.5);
    ctx.fillStyle = "#e5484d";
    ctx.fillRect(lx, 51.5, 7, 2.5);
  }
  // 鞋
  ctx.fillStyle = "#222222";
  rr(ctx, -19, 54, 17, 11, 5);
  ctx.fill();
  rr(ctx, 2, 54, 17, 11, 5);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.arc(-14, 58, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(7, 58, 2.5, 0, Math.PI * 2);
  ctx.fill();
  // 挥手手臂
  const wave = Math.sin(t * 3);
  ctx.save();
  ctx.translate(35, -52);
  ctx.rotate(-0.5 - wave * 0.5);
  ctx.fillStyle = "#fbe66d";
  ctx.strokeStyle = "#b8921f";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, -4);
  ctx.lineTo(24, -4);
  ctx.lineTo(24, 5);
  ctx.lineTo(0, 5);
  ctx.closePath();
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
  const bob = Math.abs(Math.sin(t * 1.8 + 1)) * 2.5;
  ctx.save();
  ctx.translate(x, groundY - bob);
  ctx.scale(s, s);
  // 五角星身体（圆胖）
  ctx.fillStyle = "#f79cc5";
  ctx.strokeStyle = "#d96f9d";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    const px = Math.cos(a) * 42;
    const py = Math.sin(a) * 42 - 48;
    const na = a + Math.PI / 10;
    const nx = Math.cos(na) * 17;
    const ny = Math.sin(na) * 17 - 48;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
    ctx.quadraticCurveTo(
      nx,
      ny,
      Math.cos(a + Math.PI / 5) * 42,
      Math.sin(a + Math.PI / 5) * 42 - 48
    );
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // 肚皮
  ctx.fillStyle = "#fbc3dc";
  ctx.beginPath();
  ctx.ellipse(0, -18, 20, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  // 短裤（绿底紫花）
  ctx.fillStyle = "#6fae58";
  ctx.strokeStyle = "#4e8a3c";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-24, -6);
  ctx.lineTo(24, -6);
  ctx.lineTo(31, 22);
  ctx.lineTo(-31, 22);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#a55fc4";
  for (const [fx, fy] of [
    [-16, 8],
    [0, 14],
    [16, 6],
    [-8, 18],
    [9, 18]
  ] as const) {
    ctx.beginPath();
    ctx.arc(fx, fy, 3.4, 0, Math.PI * 2);
    ctx.fill();
  }
  // 肚脐
  ctx.strokeStyle = "#d96f9d";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -10, 3, 0, Math.PI * 2);
  ctx.stroke();
  // 眉毛
  ctx.strokeStyle = "#4a2c3a";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-19, -58);
  ctx.lineTo(-5, -52);
  ctx.moveTo(19, -58);
  ctx.lineTo(5, -52);
  ctx.stroke();
  // 眼睛
  const blink = t % 4.1 < 0.15;
  ctx.fillStyle = "#4a2c3a";
  if (!blink) {
    ctx.beginPath();
    ctx.ellipse(-11, -44, 4.5, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(7, -44, 4.5, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillRect(-16, -46, 11, 3);
    ctx.fillRect(2, -46, 11, 3);
  }
  // 嘴
  ctx.fillStyle = "#7a2e23";
  ctx.strokeStyle = "#5c1f16";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-14, -32);
  ctx.quadraticCurveTo(0, -18, 14, -32);
  ctx.quadraticCurveTo(0, -26, -14, -32);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(-4, -33, 5, 5);
  ctx.restore();
}

export function drawSquidward(
  ctx: CanvasRenderingContext2D,
  x: number,
  groundY: number,
  t: number,
  s: number
) {
  const bob = Math.abs(Math.sin(t * 1.5 + 2)) * 2;
  ctx.save();
  ctx.translate(x, groundY - bob);
  ctx.scale(s, s);
  ctx.fillStyle = "#7fd0bd";
  ctx.strokeStyle = "#4e9d8c";
  ctx.lineWidth = 3;
  // 大头
  ctx.beginPath();
  ctx.moveTo(-26, -58);
  ctx.quadraticCurveTo(-27, -92, 0, -92);
  ctx.quadraticCurveTo(27, -92, 26, -58);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // 身体
  ctx.beginPath();
  ctx.moveTo(-26, -58);
  ctx.lineTo(-18, 14);
  ctx.lineTo(18, 14);
  ctx.lineTo(26, -58);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // 眼睛（黄色眼白 + 半垂眼皮）
  ctx.fillStyle = "#ffe9a8";
  ctx.strokeStyle = "#4e9d8c";
  ctx.lineWidth = 2.5;
  for (const ex of [-11, 9]) {
    ctx.beginPath();
    ctx.ellipse(ex, -72, 8, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.fillStyle = "#7fd0bd";
  for (const ex of [-11, 9]) {
    ctx.beginPath();
    ctx.ellipse(ex, -66, 8.5, 7, 0, Math.PI, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#5c2d24";
  ctx.beginPath();
  ctx.arc(-11, -70, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(9, -70, 3, 0, Math.PI * 2);
  ctx.fill();
  // 大鼻子
  ctx.fillStyle = "#8fdcc9";
  ctx.strokeStyle = "#4e9d8c";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -60);
  ctx.quadraticCurveTo(32, -48, 36, -26);
  ctx.quadraticCurveTo(28, -18, 16, -24);
  ctx.quadraticCurveTo(8, -34, 0, -44);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // 嘴（大下唇）
  ctx.fillStyle = "#7fd0bd";
  ctx.strokeStyle = "#4e9d8c";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-14, -18);
  ctx.quadraticCurveTo(0, -8, 14, -18);
  ctx.quadraticCurveTo(6, 6, 0, 8);
  ctx.quadraticCurveTo(-6, 6, -14, -18);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(-6, -19, 12, 5);
  // 触手
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = "#7fd0bd";
    ctx.strokeStyle = "#4e9d8c";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(-15 + i * 10, 22, 7, 11, 0, 0, Math.PI * 2);
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
  const bob = Math.abs(Math.sin(t * 2 + 0.5)) * 2;
  ctx.save();
  ctx.translate(x, groundY - bob);
  ctx.scale(s, s);
  ctx.fillStyle = "#e5484d";
  ctx.strokeStyle = "#b03034";
  ctx.lineWidth = 3;
  // 身体
  ctx.beginPath();
  ctx.ellipse(0, -34, 37, 27, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // 肚皮
  ctx.fillStyle = "#f0737a";
  ctx.beginPath();
  ctx.ellipse(0, -26, 24, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  // 眼柄
  ctx.strokeStyle = "#b03034";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-14, -54);
  ctx.lineTo(-17, -74);
  ctx.moveTo(12, -54);
  ctx.lineTo(15, -74);
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#b03034";
  ctx.lineWidth = 2.5;
  for (const ex of [-17, 15]) {
    ctx.beginPath();
    ctx.ellipse(ex, -80, 8.5, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.fillStyle = "#3f8f4d";
  ctx.beginPath();
  ctx.arc(-17, -78, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(15, -78, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1c2b3a";
  ctx.beginPath();
  ctx.arc(-17, -78, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(15, -78, 2, 0, Math.PI * 2);
  ctx.fill();
  // 大钳（锯齿）
  const claw = (cx: number, dir: number) => {
    ctx.save();
    ctx.translate(cx, -32);
    ctx.scale(dir, 1);
    ctx.fillStyle = "#e5484d";
    ctx.strokeStyle = "#b03034";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(30, 0, 27, 18, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(48, -6);
    ctx.quadraticCurveTo(66, -16, 62, -32);
    ctx.quadraticCurveTo(57, -14, 52, -10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };
  claw(-34, -1);
  claw(36, 1);
  // 嘴
  ctx.fillStyle = "#8f2629";
  ctx.strokeStyle = "#6d1c1f";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-12, -18);
  ctx.quadraticCurveTo(0, -6, 12, -18);
  ctx.quadraticCurveTo(0, -12, -12, -18);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(-4, -19, 4, 4);
  ctx.fillRect(1, -19, 4, 4);
  // 裤子
  ctx.fillStyle = "#5b7bd4";
  ctx.strokeStyle = "#3f5aa8";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-25, -14);
  ctx.lineTo(25, -14);
  ctx.lineTo(21, 6);
  ctx.lineTo(-21, 6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#3a2a15";
  ctx.fillRect(-25, -16, 50, 5);
  ctx.fillStyle = "#f2d25c";
  ctx.fillRect(-3, -16, 6, 5);
  // 腿
  ctx.fillStyle = "#e5484d";
  ctx.strokeStyle = "#b03034";
  for (const lx of [-14, 6]) {
    ctx.beginPath();
    ctx.ellipse(lx, 16, 7, 10, 0, 0, Math.PI * 2);
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
  const bob = Math.abs(Math.sin(t * 1.7 + 0.8)) * 2.5;
  ctx.save();
  ctx.translate(x, groundY - bob);
  ctx.scale(s, s);
  // 头
  ctx.fillStyle = "#cfd8e3";
  ctx.strokeStyle = "#96a3b5";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-30, -8);
  ctx.quadraticCurveTo(-31, -84, 0, -84);
  ctx.quadraticCurveTo(32, -84, 32, -8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // 下巴
  ctx.fillStyle = "#f2f6fa";
  ctx.beginPath();
  ctx.moveTo(-18, -12);
  ctx.quadraticCurveTo(0, 6, 18, -12);
  ctx.lineTo(23, -4);
  ctx.quadraticCurveTo(0, 14, -23, -4);
  ctx.closePath();
  ctx.fill();
  // 气孔
  ctx.fillStyle = "#96a3b5";
  ctx.beginPath();
  ctx.ellipse(-4, -84, 5, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  // 金发马尾
  ctx.fillStyle = "#f2c94c";
  ctx.strokeStyle = "#cf9f2e";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(2, -88, 9, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-2, -92);
  ctx.quadraticCurveTo(6, -116, 16, -112);
  ctx.quadraticCurveTo(10, -104, 4, -98);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // 蝴蝶结
  ctx.fillStyle = "#f28ab5";
  ctx.strokeStyle = "#cf6e9d";
  ctx.lineWidth = 2;
  for (const [bx, br] of [
    [28, 9],
    [40, 9]
  ] as const) {
    ctx.beginPath();
    ctx.ellipse(bx, -62, br, 7, bx === 28 ? 0.4 : -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.fillStyle = "#cf6e9d";
  ctx.beginPath();
  ctx.arc(34, -62, 3, 0, Math.PI * 2);
  ctx.fill();
  // 眼睛
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#96a3b5";
  ctx.lineWidth = 2;
  for (const ex of [-13, 13]) {
    ctx.beginPath();
    ctx.ellipse(ex, -52, 8, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.fillStyle = "#5aa8e8";
  ctx.beginPath();
  ctx.arc(-13, -50, 3.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(13, -50, 3.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1c2b3a";
  ctx.beginPath();
  ctx.arc(-13, -50, 1.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(13, -50, 1.6, 0, Math.PI * 2);
  ctx.fill();
  // 睫毛
  ctx.strokeStyle = "#96a3b5";
  ctx.lineWidth = 1.5;
  for (const ex of [-13, 13]) {
    ctx.beginPath();
    ctx.moveTo(ex - 7, -60);
    ctx.lineTo(ex - 9, -64);
    ctx.moveTo(ex + 7, -60);
    ctx.lineTo(ex + 9, -64);
    ctx.stroke();
  }
  // 微笑 + 红晕
  ctx.strokeStyle = "#7d8ca0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -40, 8, 0.3, Math.PI - 0.3);
  ctx.stroke();
  ctx.fillStyle = "rgba(242,138,181,0.5)";
  ctx.beginPath();
  ctx.arc(-22, -38, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(22, -38, 3, 0, Math.PI * 2);
  ctx.fill();
  // 身体
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#d5dbe0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-12, -8);
  ctx.lineTo(12, -8);
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
  // 身体
  ctx.fillStyle = "#2e7d32";
  ctx.strokeStyle = "#1b5e20";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(0, -10, 10, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // 触须
  ctx.strokeStyle = "#1b5e20";
  ctx.lineWidth = 2;
  for (const ax of [-5, 5]) {
    ctx.beginPath();
    ctx.moveTo(ax, -24);
    ctx.lineTo(ax * 1.5, -38);
    ctx.stroke();
    ctx.fillStyle = "#2e7d32";
    ctx.beginPath();
    ctx.arc(ax * 1.5, -40, 2.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#1b5e20";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  // 浓眉
  ctx.strokeStyle = "#123a16";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-9, -20);
  ctx.lineTo(9, -14);
  ctx.stroke();
  // 独眼
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#1b5e20";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, -9, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffd166";
  ctx.beginPath();
  ctx.arc(0, -9, 4.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e5484d";
  ctx.beginPath();
  ctx.arc(0, -9, 2.4, 0, Math.PI * 2);
  ctx.fill();
  // 嘴（坏笑）
  ctx.strokeStyle = "#123a16";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-6, 0);
  ctx.quadraticCurveTo(0, 5, 6, 0);
  ctx.stroke();
  // 小手臂
  ctx.fillStyle = "#2e7d32";
  ctx.strokeStyle = "#1b5e20";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(-12, -6, 4, 2.4, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(12, -6, 4, 2.4, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}
