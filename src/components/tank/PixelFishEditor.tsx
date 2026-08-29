import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { GRID_CELLS, GRID_COLS, GRID_ROWS, PRESET_COLORS } from "../../lib/fishDraw";

interface Props {
  drawing: Array<string | null>;
  onChange: (d: Array<string | null>) => void;
}

export default function PixelFishEditor({ drawing, onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState("#E8A87C");
  const [brush, setBrush] = useState<1 | 2>(1);
  const [erase, setErase] = useState(false);
  const paintingRef = useRef(false);
  const drawingRef = useRef(drawing);
  drawingRef.current = drawing;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = "rgba(255,255,255,0.05)";
    const cell = w / GRID_COLS;
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if ((r + c) % 2 === 0) ctx.fillRect(c * cell, r * cell, cell, cell);
      }
    }

    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const col = drawing[r * GRID_COLS + c];
        if (!col) continue;
        ctx.fillStyle = col;
        ctx.fillRect(c * cell, r * cell, cell + 0.5, cell + 0.5);
      }
    }

    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = 1;
    for (let c = 1; c < GRID_COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * cell, 0);
      ctx.lineTo(c * cell, h);
      ctx.stroke();
    }
    for (let r = 1; r < GRID_ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * cell);
      ctx.lineTo(w, r * cell);
      ctx.stroke();
    }
  }, [drawing]);

  const posFromEvent = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { col: -1, row: -1 };
    const rect = canvas.getBoundingClientRect();
    return {
      col: Math.floor(((e.clientX - rect.left) / rect.width) * GRID_COLS),
      row: Math.floor(((e.clientY - rect.top) / rect.height) * GRID_ROWS)
    };
  };

  const applyAt = (col: number, row: number) => {
    if (col < 0 || row < 0 || col >= GRID_COLS || row >= GRID_ROWS) return;
    const d = drawingRef.current.slice();
    const set = (c: number, r: number) => {
      if (c < 0 || r < 0 || c >= GRID_COLS || r >= GRID_ROWS) return;
      d[r * GRID_COLS + c] = erase ? null : color;
    };
    set(col, row);
    if (brush === 2) {
      set(col + 1, row);
      set(col, row + 1);
      set(col + 1, row + 1);
    }
    onChange(d);
  };

  return (
    <div className="pixel-editor">
      <canvas
        ref={canvasRef}
        className="pixel-canvas"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          paintingRef.current = true;
          const { col, row } = posFromEvent(e);
          applyAt(col, row);
        }}
        onPointerMove={(e) => {
          if (!paintingRef.current) return;
          const { col, row } = posFromEvent(e);
          applyAt(col, row);
        }}
        onPointerUp={() => {
          paintingRef.current = false;
        }}
      />

      <div className="opt-row">
        <span className="opt-label">画笔颜色</span>
        <div className="swatches">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={"swatch" + (color === c && !erase ? " on" : "")}
              style={{ background: c } as CSSProperties}
              onClick={() => {
                setColor(c);
                setErase(false);
              }}
            />
          ))}
          <label className="swatch custom" style={{ background: color } as CSSProperties}>
            <input
              type="color"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                setErase(false);
              }}
            />
          </label>
        </div>
      </div>

      <div className="opt-row">
        <span className="opt-label">工具</span>
        <div className="opt-items">
          <button
            type="button"
            className={"opt-btn" + (brush === 1 && !erase ? " on" : "")}
            onClick={() => {
              setBrush(1);
              setErase(false);
            }}
          >
            细笔
          </button>
          <button
            type="button"
            className={"opt-btn" + (brush === 2 && !erase ? " on" : "")}
            onClick={() => {
              setBrush(2);
              setErase(false);
            }}
          >
            粗笔
          </button>
          <button
            type="button"
            className={"opt-btn" + (erase ? " on" : "")}
            onClick={() => setErase(true)}
          >
            橡皮
          </button>
          <button
            type="button"
            className="opt-btn danger"
            onClick={() => onChange(Array(GRID_CELLS).fill(null))}
          >
            清空
          </button>
        </div>
      </div>
      <p className="modal-sub">
        在网格里画一条向右游的小鱼（头朝右），画满 24×16 格即可投放
      </p>
    </div>
  );
}
