import { useState } from "react";
import { supabase } from "../../lib/supabase";

function mapAuthError(msg: string): string {
  if (msg.includes("Invalid login credentials")) return "邮箱或密码错误";
  if (msg.includes("User already registered")) return "该邮箱已注册，请直接登录";
  if (msg.includes("Email signups are disabled")) return "站点尚未开启邮箱注册，请联系站长";
  if (msg.includes("at least 6 characters")) return "密码至少 6 位";
  if (msg.includes("valid email")) return "邮箱格式不正确";
  if (msg.includes("rate limit")) return "尝试太频繁，请稍后再试";
  return msg;
}

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!supabase) return;
    setErr(null);
    setInfo(null);
    if (!email.trim() || !password) {
      setErr("请输入邮箱和密码");
      return;
    }
    if (mode === "signup" && password.length < 6) {
      setErr("密码至少 6 位");
      return;
    }
    if (mode === "signup" && password !== confirm) {
      setErr("两次输入的密码不一致");
      return;
    }
    setBusy(true);
    const { error } =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email: email.trim(), password })
        : await supabase.auth.signUp({ email: email.trim(), password });
    setBusy(false);
    if (error) {
      setErr(mapAuthError(error.message));
    } else if (mode === "signup") {
      setInfo("注册成功！若站点开启了邮箱验证，请先查收验证邮件再登录");
    } else {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">
          {mode === "login" ? "登录鱼缸" : "注册账号"}
        </h2>
        <div className="auth-tabs">
          <button
            type="button"
            className={"opt-btn" + (mode === "login" ? " on" : "")}
            onClick={() => {
              setMode("login");
              setErr(null);
            }}
          >
            登录
          </button>
          <button
            type="button"
            className={"opt-btn" + (mode === "signup" ? " on" : "")}
            onClick={() => {
              setMode("signup");
              setErr(null);
            }}
          >
            注册
          </button>
        </div>
        <label className="field-label">邮箱</label>
        <input
          className="text-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <label className="field-label">密码（至少 6 位）</label>
        <input
          className="text-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void submit();
          }}
          placeholder="••••••••"
        />
        {mode === "signup" && (
          <>
            <label className="field-label">确认密码</label>
            <input
              className="text-input"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void submit();
              }}
              placeholder="再次输入密码"
            />
          </>
        )}
        {err && <p className="form-err">{err}</p>}
        {info && <p className="form-info">{info}</p>}
        <button className="btn-primary" disabled={busy} onClick={() => void submit()}>
          {busy ? "请稍候…" : mode === "login" ? "登录" : "注册并登录"}
        </button>
      </div>
    </div>
  );
}
