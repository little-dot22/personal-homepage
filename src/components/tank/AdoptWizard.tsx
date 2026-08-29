import { useState } from "react";
import { supabase } from "../../lib/supabase";
import type { FishAppearance } from "../../lib/types";
import AppearanceEditor from "./AppearanceEditor";

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
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const adopt = async () => {
    if (!supabase) return;
    setBusy(true);
    setErr(null);
    const { error } = await supabase.rpc("adopt_fish", {
      p_name: appearance.name.trim() || "无名鱼",
      p_color: appearance.color,
      p_accent: appearance.accent,
      p_shape: appearance.shape,
      p_pattern: appearance.pattern,
      p_tail: appearance.tail,
      p_fin: appearance.fin,
      p_eye: appearance.eye
    });
    setBusy(false);
    if (error) {
      setErr(mapAdoptError(error.message));
      return;
    }
    onDone();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">领养你的鱼</h2>
        <p className="modal-sub">设计一条独一无二的鱼，把它放进赛博鱼缸</p>
        <AppearanceEditor value={appearance} onChange={setAppearance} />
        {err && <p className="form-err">{err}</p>}
        <button className="btn-primary" disabled={busy} onClick={() => void adopt()}>
          {busy ? "投放中…" : "投放进鱼缸"}
        </button>
      </div>
    </div>
  );
}
