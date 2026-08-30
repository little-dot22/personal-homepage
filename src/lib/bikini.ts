// 比基尼海滩背景（沙地 + 花云；蟹堡王与角色用图片素材，居中布局）

export const bikiniScale = (H: number, W = 2000) =>
  Math.min(1.2, Math.max(0.55, Math.min(H / 900, W / 1150)));

export const bikiniHorizon = (H: number) => H * 0.9;

export function sandGroundY(H: number): number {
  return bikiniHorizon(H) + 12;
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

export function renderStaticBg(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const s = bikiniScale(H, W);
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

  sandFlower(ctx, W * 0.06, sandTop + 8, s);
  sandFlower(ctx, W * 0.94, sandTop + 10, s * 1.1);
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
