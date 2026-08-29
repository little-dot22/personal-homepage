import { useState } from "react";
import { createPortal } from "react-dom";
import { blankDrawing } from "../../lib/fishDraw";
import { supabase } from "../../lib/supabase";
import type { FishAppearance } from "../../lib/types";
import AppearanceEditor from "./AppearanceEditor";
import PixelFishEditor from "./PixelFishEditor";

function mapAdoptError(msg: string): string {
  if (msg.includes("already has fish")) return "你已经有一条鱼啦";
  if (msg.includes("tank full")) return "鱼缸已满（50/50），暂时不能领养";
  if (msg.includes("not authenticated")) return "请先登录";
  return msg;
}

export default function AdoptWizard({
  onClose,
  onDone
}: {
  onClose: () => void;
  onDone: () => void;
}) {
  const [mode, setMode] = useState<"template" | "draw">("template");
  const [name, setName] = useState("");
  const [appearance, setAppearance] = useState<FishAppearance>({
    name: "",
    color: "#E8A87C",
    accent: "#FFD166",
    shape: "round",
    pattern: "none",
    tail: "fan",
    fin: "small",
    eye: "normal"
  });
  const [drawing, setDrawing] = useState<Array<string | null>>(blankDrawing());
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const adopt = async () => {
    if (!supabase) return;
    setBusy(true);
    setErr(null);
    const { error } = await supabase.rpc("adopt_fish", {
      p_name: name.trim() || appearance.name.trim() || "无名鱼",
      p_color: appearance.color,
      p_accent: appearance.accent,
      p_shape: appearance.shape,
      p_pattern: appearance.pattern,
      p_tail: appearance.tail,
      p_fin: appearance.fin,
      p_eye: appearance.eye,
      p_custom_drawing: mode === "draw" ? drawing : null
    });
    setBusy(false);
    if (error) {
      setErr(mapAdoptError(error.message));
      return;
    }
    onDone();
  };

  const drawingEmpty =
    mode === "draw" && drawing.every((c) => c === null);

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">领养你的鱼</h2>
        <p className="modal-sub">选一个模板，或者亲手画一条独一无二的鱼</p>

        <input
          className="fish-name-input"
          value={name}
          maxLength={12}
          placeholder="给鱼起个名字（12字内）"
          onChange={(e) => setName(e.target.value)}
        />

        <div className="auth-tabs">
          <button
            type="button"
            className={"opt-btn" + (mode === "template" ? " on" : "")}
            onClick={() => setMode("template")}
          >
            模板
          </button>
          <button
            type="button"
            className={"opt-btn" + (mode === "draw" ? " on" : "")}
            onClick={() => setMode("draw")}
          >
            手绘
          </button>
        </div>

        {mode === "template" ? (
          <AppearanceEditor
            value={{ ...appearance, name }}
            onChange={(v) => {
              setAppearance(v);
              setName(v.name);
            }}
            showName={false}
          />
        ) : (
          <PixelFishEditor drawing={drawing} onChange={setDrawing} />
        )}

        {err && <p className="form-err">{err}</p>}
        {drawingEmpty && (
          <p className="form-err">画布还是空的，先画一条鱼吧</p>
        )}
        <button
          className="btn-primary"
          disabled={busy || drawingEmpty}
          onClick={() => void adopt()}
        >
          {busy ? "投放中…" : "投放进鱼缸"}
        </button>
      </div>
    </div>,
    document.body
  );
}
