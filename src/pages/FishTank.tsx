import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import AdoptWizard from "../components/tank/AdoptWizard";
import AuthModal from "../components/tank/AuthModal";
import FishPanel from "../components/tank/FishPanel";
import TankCanvas, {
  type EatPayload
} from "../components/tank/TankCanvas";
import { supabase, supabaseConfigured } from "../lib/supabase";
import type { FishRow } from "../lib/types";

export default function FishTankPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [fish, setFish] = useState<FishRow[]>([]);
  const [showAuth, setShowAuth] = useState(false);
  const [showAdopt, setShowAdopt] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const userId = session?.user.id ?? null;
  const myFish = fish.find((f) => f.owner_id === userId) ?? null;

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2800);
  }, []);

  useEffect(() => {
    if (!supabaseConfigured || !supabase) return;
    void supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setSession(s)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabaseConfigured || !supabase) return;
    const client = supabase;
    let alive = true;
    const load = async () => {
      const { data } = await client
        .from("fish")
        .select("*")
        .order("created_at");
      if (alive && data) setFish(data as FishRow[]);
    };
    void load();
    const channel = client.channel("fish-table");
    channel
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "fish" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setFish((prev) => [...prev, payload.new as FishRow]);
          } else if (payload.eventType === "UPDATE") {
            setFish((prev) =>
              prev.map((f) =>
                f.id === (payload.new as FishRow).id
                  ? (payload.new as FishRow)
                  : f
              )
            );
          } else if (payload.eventType === "DELETE") {
            const oldId = (payload.old as { id: string }).id;
            setFish((prev) => prev.filter((f) => f.id !== oldId));
          }
        }
      )
      .subscribe();
    return () => {
      alive = false;
      client.removeChannel(channel);
    };
  }, []);

  const handleEat = useCallback(
    (p: EatPayload) => {
      const eaten = fish.find((f) => f.id === p.fishId);
      const name = eaten?.name ?? "一条鱼";
      showToast(
        p.leveledUp
          ? `${name} 抢到了鱼食，升到 Lv.${p.level}！`
          : `${name} 抢到了鱼食！`
      );
    },
    [fish, showToast]
  );

  const handleSaved = useCallback(
    (msg: string) => showToast(msg),
    [showToast]
  );

  if (!supabaseConfigured) {
    return (
      <div className="tank-page tank-setup">
        <div className="setup-card">
          <h2>赛博鱼缸 · 尚未接入后端</h2>
          <p>
            1. 到 supabase.com 创建免费项目
            <br />
            2. SQL Editor 中运行仓库里的 <code>supabase/schema.sql</code>
            <br />
            3. 把 Project URL 与 anon key 填入 <code>.env</code> 后重新推送部署
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="tank-page">
      <TankCanvas
        fish={fish}
        userId={userId}
        onEat={handleEat}
        onAnnounce={showToast}
        onActionBlocked={showToast}
      />

      <div className="tank-hud">
        <span className="hud-chip">鱼缸 {fish.length}/50</span>
        {myFish && (
          <span className="hud-chip" style={{ color: myFish.color }}>
            {myFish.name} · Lv.{myFish.level}
          </span>
        )}
        {userId ? (
          <>
            {myFish ? (
              <button
                type="button"
                className="hud-btn"
                onClick={() => setShowPanel(true)}
              >
                我的鱼
              </button>
            ) : fish.length >= 50 ? (
              <span className="hud-chip warn">鱼缸已满，只能围观</span>
            ) : (
              <button
                type="button"
                className="hud-btn primary"
                onClick={() => setShowAdopt(true)}
              >
                领养一条鱼
              </button>
            )}
            <button
              type="button"
              className="hud-btn"
              onClick={() => void supabase!.auth.signOut()}
            >
              退出
            </button>
          </>
        ) : (
          <button
            type="button"
            className="hud-btn primary"
            onClick={() => setShowAuth(true)}
          >
            登录 / 注册
          </button>
        )}
      </div>

      <p className="tank-tip">
        点击水面投喂（不限次数）· 每条鱼每天最多升 1 级 · 悬浮鱼身查看名字等级
      </p>

      {toast && <div className="tank-toast">{toast}</div>}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showAdopt && (
        <AdoptWizard
          onClose={() => setShowAdopt(false)}
          onDone={() => {
            setShowAdopt(false);
            showToast("领养成功！你的鱼游进了鱼缸");
          }}
        />
      )}
      {showPanel && myFish && (
        <FishPanel
          fish={myFish}
          onClose={() => setShowPanel(false)}
          onSaved={handleSaved}
          onRelease={() => {
            setShowPanel(false);
            showToast("小鱼已放生，可以重新领养了");
          }}
        />
      )}
    </div>
  );
}
