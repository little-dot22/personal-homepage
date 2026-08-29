import type { FishAppearance } from "./types";

export const SHAPE_IDS = ["round", "slim", "puffer", "tri"] as const;
export const PATTERN_IDS = ["none", "stripes", "spots"] as const;
export const TAIL_IDS = ["fan", "fork"] as const;
export const FIN_IDS = ["small", "big"] as const;
export const EYE_IDS = ["normal", "big"] as const;

export const SHAPE_LABELS: Record<string, string> = {
  round: "圆胖",
  slim: "修长",
  puffer: "河豚",
  tri: "三角"
};

export const PATTERN_LABELS: Record<string, string> = {
  none: "纯色",
  stripes: "条纹",
  spots: "斑点"
};

export const TAIL_LABELS: Record<string, string> = {
  fan: "扇形尾",
  fork: "叉形尾"
};

export const FIN_LABELS: Record<string, string> = {
  small: "小背鳍",
  big: "大背鳍"
};

export const EYE_LABELS: Record<string, string> = {
  normal: "小眼睛",
  big: "大眼睛"
};

export const PRESET_COLORS = [
  "#E8A87C",
  "#FF6B6B",
  "#FFD166",
  "#A8E6CF",
  "#40E0D0",
  "#4FC3FF",
  "#A855F7",
  "#F472B6",
  "#8ED081",
  "#D9E2EC"
];

export function lighten(hex: string, amt: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
  const b = Math.max(0, Math.min(255, (n & 255) + amt));
  return `rgb(${r},${g},${b})`;
}

function bodyPath(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  shape: FishAppearance["shape"]
) {
  ctx.beginPath();
  switch (shape) {
    case "round":
      ctx.moveTo(w * 0.5, 0);
      ctx.quadraticCurveTo(w * 0.3, -h * 0.55, -w * 0.1, -h * 0.45);
      ctx.quadraticCurveTo(-w * 0.35, -h * 0.38, -w * 0.32, 0);
      ctx.quadraticCurveTo(-w * 0.35, h * 0.38, -w * 0.1, h * 0.45);
      ctx.quadraticCurveTo(w * 0.3, h * 0.55, w * 0.5, 0);
      break;
    case "slim":
      ctx.moveTo(w * 0.5, 0);
      ctx.quadraticCurveTo(w * 0.32, -h * 0.28, -w * 0.15, -h * 0.32);
      ctx.quadraticCurveTo(-w * 0.42, -h * 0.34, -w * 0.44, 0);
      ctx.quadraticCurveTo(-w * 0.42, h * 0.34, -w * 0.15, h * 0.32);
      ctx.quadraticCurveTo(w * 0.32, h * 0.28, w * 0.5, 0);
      break;
    case "puffer":
      ctx.moveTo(w * 0.5, 0);
      ctx.quadraticCurveTo(w * 0.42, -h * 0.5, w * 0.02, -h * 0.52);
      ctx.quadraticCurveTo(-w * 0.38, -h * 0.52, -w * 0.4, 0);
      ctx.quadraticCurveTo(-w * 0.38, h * 0.52, w * 0.02, h * 0.52);
      ctx.quadraticCurveTo(w * 0.42, h * 0.5, w * 0.5, 0);
      break;
    case "tri":
      ctx.moveTo(w * 0.5, 0);
      ctx.lineTo(-w * 0.36, -h * 0.44);
      ctx.lineTo(-w * 0.3, 0);
      ctx.lineTo(-w * 0.36, h * 0.44);
      break;
  }
  ctx.closePath();
}

export function bodyHeightRatio(shape: FishAppearance["shape"]): number {
  switch (shape) {
    case "slim":
      return 0.5;
    case "puffer":
      return 0.72;
    case "round":
      return 0.66;
    case "tri":
      return 0.6;
  }
}

function tailBaseX(shape: FishAppearance["shape"]): number {
  switch (shape) {
    case "slim":
      return -0.42;
    case "puffer":
      return -0.38;
    case "tri":
      return -0.33;
    case "round":
      return -0.3;
  }
}

export interface DrawFishOptions {
  appearance: FishAppearance;
  size: number;
  time: number;
  facing: 1 | -1;
  glow?: number;
}

export const GRID_COLS = 24;
export const GRID_ROWS = 16;
export const GRID_CELLS = GRID_COLS * GRID_ROWS;

export const blankDrawing = (): Array<string | null> =>
  Array(GRID_CELLS).fill(null);

function drawPixelCells(
  ctx: CanvasRenderingContext2D,
  drawing: Array<string | null>,
  cell: number,
  h: number,
  size: number,
  time: number
) {
  const wob = Math.sin(time * 4) * cell * 0.45;
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const color = drawing[r * GRID_COLS + c];
      if (!color) continue;
      ctx.fillStyle = color;
      const wobY = wob * ((r - GRID_ROWS / 2) / GRID_ROWS);
      ctx.fillRect(
        -size / 2 + c * cell,
        -h / 2 + r * cell + wobY,
        cell + 0.5,
        cell + 0.5
      );
    }
  }
}

export function drawPixelFish(
  ctx: CanvasRenderingContext2D,
  o: DrawFishOptions & { drawing: Array<string | null> }
) {
  const { drawing, size, time, facing, glow } = o;
  if (drawing.length !== GRID_CELLS) return;
  const cell = size / GRID_COLS;
  const h = cell * GRID_ROWS;

  ctx.save();
  ctx.scale(facing, 1);
  drawPixelCells(ctx, drawing, cell, h, size, time);
  if (glow && glow > 0) {
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = glow * 0.6;
    drawPixelCells(ctx, drawing, cell, h, size, time);
  }
  ctx.restore();
}

export function drawFish(ctx: CanvasRenderingContext2D, o: DrawFishOptions) {
  const a = o.appearance;
  if (
    a.custom_drawing &&
    a.custom_drawing.length === GRID_CELLS &&
    a.custom_drawing.some((c) => c !== null)
  ) {
    drawPixelFish(ctx, { ...o, drawing: a.custom_drawing });
    return;
  }
  const w = o.size;
  const h = o.size * bodyHeightRatio(a.shape);
  const tailSwing = Math.sin(o.time * 4) * h * 0.3;

  ctx.save();
  ctx.scale(o.facing, 1);
  if (o.glow && o.glow > 0) {
    ctx.shadowColor = a.color;
    ctx.shadowBlur = 18 * o.glow;
  }

  // 尾巴
  const bx = tailBaseX(a.shape) * w;
  ctx.fillStyle = lighten(a.accent, -20);
  ctx.beginPath();
  if (a.tail === "fork") {
    ctx.moveTo(bx, -h * 0.14);
    ctx.lineTo(-w * 0.58, -h * 0.4 + tailSwing);
    ctx.lineTo(-w * 0.46, tailSwing * 0.35);
    ctx.lineTo(-w * 0.58, h * 0.4 + tailSwing);
    ctx.lineTo(bx, h * 0.14);
  } else {
    ctx.moveTo(bx, -h * 0.14);
    ctx.quadraticCurveTo(-w * 0.62, -h * 0.4 + tailSwing, -w * 0.5, tailSwing * 0.3);
    ctx.quadraticCurveTo(-w * 0.62, h * 0.4 + tailSwing, bx, h * 0.14);
  }
  ctx.closePath();
  ctx.fill();

  // 身体
  const grad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
  grad.addColorStop(0, lighten(a.color, 30));
  grad.addColorStop(0.55, a.color);
  grad.addColorStop(1, lighten(a.color, -25));
  ctx.fillStyle = grad;
  bodyPath(ctx, w, h, a.shape);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.18)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 花纹（裁剪到身体内）
  ctx.save();
  bodyPath(ctx, w, h, a.shape);
  ctx.clip();
  if (a.pattern === "stripes") {
    ctx.strokeStyle = a.accent;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = Math.max(1.5, w * 0.045);
    for (let i = -2; i <= 4; i++) {
      const x = w * 0.42 - i * w * 0.16;
      ctx.beginPath();
      ctx.moveTo(x, -h * 0.6);
      ctx.quadraticCurveTo(x + w * 0.08, 0, x, h * 0.6);
      ctx.stroke();
    }
  } else if (a.pattern === "spots") {
    ctx.fillStyle = a.accent;
    ctx.globalAlpha = 0.6;
    const spots: Array<[number, number]> = [
      [0.16, -0.14],
      [0.05, 0.1],
      [0.3, 0.16],
      [0.2, -0.26],
      [-0.08, -0.08],
      [0.38, -0.04]
    ];
    for (const [sx, sy] of spots) {
      ctx.beginPath();
      ctx.arc(sx * w, sy * h, w * 0.05, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // 背鳍
  ctx.fillStyle = lighten(a.accent, -10);
  ctx.beginPath();
  const fx = w * 0.06;
  const finScale = a.fin === "big" ? 1.5 : 1;
  ctx.moveTo(fx - w * 0.14, -h * 0.3);
  ctx.quadraticCurveTo(
    fx,
    -h * 0.66 * finScale - Math.abs(tailSwing) * 0.2,
    fx + w * 0.1,
    -h * 0.34
  );
  ctx.closePath();
  ctx.fill();

  // 眼睛
  const er = a.eye === "big" ? w * 0.085 : w * 0.06;
  const ex = w * 0.33;
  const ey = -h * 0.12;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(ex, ey, er, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#101828";
  ctx.beginPath();
  ctx.arc(ex + er * 0.25, ey, er * 0.52, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(ex + er * 0.45, ey - er * 0.3, er * 0.18, 0, Math.PI * 2);
  ctx.fill();

  // 嘴
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(w * 0.46, h * 0.06, w * 0.03, -0.5, 0.9);
  ctx.stroke();

  ctx.restore();
}
