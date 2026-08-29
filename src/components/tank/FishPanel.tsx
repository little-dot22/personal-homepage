import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MAX_LEVEL, shanghaiToday } from "../../lib/level";
import { supabase } from "../../lib/supabase";
import type { FishAppearance, FishRow } from "../../lib/types";
import AppearanceEditor from "./AppearanceEditor";

export default function FishPanel({
  fish,
  onClose,
  onSaved,
  onRelease
}: {
  fish: FishRow;
  onClose: () => void;
  onSaved: (msg: string) => void;
  onRelease: () => void;
}) {
  const [tab, setTab] = useState<"appearance" | "statements" | "status">(
    fish.level > 0 ? "status" : "appearance"
  );
  const [appearance, setAppearance] = useState<FishAppearance>({
    name: fish.name,
    color: fish.color,
    accent: fish.accent,
    shape: fish.shape,
    pattern: fish.pattern,
    tail: fish.tail,
    fin: fish.fin,
    eye: fish.eye
  });
  const [statements, setStatements] = useState<string[]>(() => {
    const arr = [...fish.statements];
    while (arr.length < fish.level) arr.push("");
    return arr;
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [confirmRelease, setConfirmRelease] = useState(false);

  const doRelease = async () => {
    if (!supabase) return;
    setBusy(true);
    setErr(null);
    const { error } = await supabase.rpc("release_fish", {
      p_fish_id: fish.id
    });
    setBusy(false);
    if (error) {
      setErr(
        error.message.includes("not your fish")
          ? "只能放生自己的鱼"
          : error.message
      );
      return;
    }
    onRelease();
  };

  useEffect(() => {
    setStatements((prev) => {
      const arr = prev.slice(0, fish.level);
      while (arr.length < fish.level) arr.push("");
      return arr;
    });
  }, [fish.level]);

  const saveAppearance = async () => {
    if (!supabase) return;
    setBusy(true);
    setErr(null);
    const { error } = await supabase
      .from("fish")
      .update({
        name: appearance.name.trim() || "无名鱼",
        color: appearance.color,
        accent: appearance.accent,
        shape: appearance.shape,
        pattern: appearance.pattern,
        tail: appearance.tail,
        fin: appearance.fin,
        eye: appearance.eye
      })
      .eq("id", fish.id);
    setBusy(false);
    if (error) setErr(error.message);
    else onSaved("外观已保存");
  };

  const saveStatements = async () => {
    if (!supabase) return;
    setBusy(true);
    setErr(null);
    const trimmed = statements
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, fish.level);
    const { error } = await supabase
      .from("fish")
      .update({ statements: trimmed })
      .eq("id", fish.id);
    setBusy(false);
    if (error) setErr(error.message);
    else onSaved("语句已保存");
  };

  const leveledToday = fish.last_levelup_date === shanghaiToday();
  const progress = Math.min(100, Math.round((fish.level / MAX_LEVEL) * 100));

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">我的鱼 · {fish.name}</h2>
        <div className="auth-tabs">
          <button
            type="button"
            className={"opt-btn" + (tab === "status" ? " on" : "")}
            onClick={() => setTab("status")}
          >
            状态
          </button>
          <button
            type="button"
            className={"opt-btn" + (tab === "appearance" ? " on" : "")}
            onClick={() => setTab("appearance")}
          >
            外观
          </button>
          <button
            type="button"
            className={"opt-btn" + (tab === "statements" ? " on" : "")}
            onClick={() => setTab("statements")}
          >
            语句
          </button>
        </div>

        {tab === "status" && (
          <div className="status-block">
            <div className="status-line">
              <span className="opt-label">等级</span>
              <span className="level-badge">Lv.{fish.level} / {MAX_LEVEL}</span>
            </div>
            <div className="status-line">
              <span className="opt-label">累计被投喂</span>
              <span>{fish.feed_count} 次</span>
            </div>
            <div className="status-line">
              <span className="opt-label">今日升级</span>
              <span style={{ color: leveledToday ? "#40e0d0" : "var(--dim)" }}>
                {fish.level >= MAX_LEVEL
                  ? "已满级"
                  : leveledToday
                    ? "已升级"
                    : "尚未升级"}
              </span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="modal-sub">
              每条鱼每天最多升 1 级，满级 {MAX_LEVEL} 级；等级决定可编辑的语句数（当前可编辑 {fish.level} 条）
            </p>
          </div>
        )}

        {tab === "appearance" && (
          <>
            <AppearanceEditor
              value={appearance}
              onChange={setAppearance}
              showName={false}
            />
            {err && <p className="form-err">{err}</p>}
            <button
              className="btn-primary"
              disabled={busy}
              onClick={() => void saveAppearance()}
            >
              {busy ? "保存中…" : "保存外观"}
            </button>
          </>
        )}

        {tab === "statements" && (
          <div className="statements-block">
            {fish.level === 0 ? (
              <p className="modal-sub">
                你的鱼还是 0 级。投喂 1 次升到 1 级后，就可以为它编辑第一句话了。
              </p>
            ) : (
              <>
                <p className="modal-sub">
                  你的鱼是 Lv.{fish.level}，可以编辑 {fish.level} 条语句，它会随机说出其中一条
                </p>
                {statements.map((s, i) => (
                  <textarea
                    key={i}
                    className="stmt-input"
                    rows={2}
                    maxLength={60}
                    placeholder={`第 ${i + 1} 句话（60 字内）`}
                    value={s}
                    onChange={(e) =>
                      setStatements((prev) =>
                        prev.map((p, j) => (j === i ? e.target.value : p))
                      )
                    }
                  />
                ))}
                {err && <p className="form-err">{err}</p>}
                <button
                  className="btn-primary"
                  disabled={busy}
                  onClick={() => void saveStatements()}
                >
                  {busy ? "保存中…" : "保存语句"}
                </button>
              </>
            )}
          </div>
        )}

        <div className="release-block">
          {!confirmRelease ? (
            <button
              type="button"
              className="btn-danger"
              onClick={() => setConfirmRelease(true)}
            >
              放生这条鱼
            </button>
          ) : (
            <div className="release-confirm">
              <p className="release-warn">
                确认放生？这条鱼会永久消失，等级、语句、外观全部清空；放生后可以重新领养一条 0 级的新鱼。
              </p>
              <div className="release-actions">
                <button
                  type="button"
                  className="btn-danger"
                  disabled={busy}
                  onClick={() => void doRelease()}
                >
                  {busy ? "放生中…" : "确认放生"}
                </button>
                <button
                  type="button"
                  className="opt-btn"
                  onClick={() => setConfirmRelease(false)}
                >
                  取消
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
