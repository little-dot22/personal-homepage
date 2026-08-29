import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { drawFish } from "../../lib/fishDraw";
import { supabase, supabaseConfigured } from "../../lib/supabase";
import type { FishAppearance, FishRow } from "../../lib/types";

type SimState = "wander" | "toFood" | "orbit" | "eat";

interface SimFish {
  row: FishRow;
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  state: SimState;
  orbitAngle: number;
  orbitSign: 1 | -1;
  speed: number;
  phase: number;
  size: number;
  idle: number;
  repick: number;
  eatT: number;
  glow: number;
}

interface Food {
  id: string;
  x: number;
  y: number;
  vy: number;
  age: number;
  state: "falling" | "rest" | "gone";
}

export interface EatPayload {
  fishId: string;
  feedCount: number;
  level: number;
  leveledUp: boolean;
}

interface Bubble {
  key: string;
  fishId: string;
  name: string;
  text: string;
  color: string;
}

interface Props {
  fish: FishRow[];
  userId: string | null;
  canFeed: boolean;
  onEat: (p: EatPayload) => void;
  onFedToday: () => void;
  onActionBlocked: (msg: string) => void;
}

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

const appOf = (row: FishRow): FishAppearance => ({
  name: row.name,
  color: row.color,
  accent: row.accent,
  shape: row.shape,
  pattern: row.pattern,
  tail: row.tail,
  fin: row.fin,
  eye: row.eye
});

const fishSize = (row: FishRow) =>
  42 * (1 + Math.min(row.feed_count, 40) * 0.012);

const spawnFish = (row: FishRow, w: number, h: number): SimFish => ({
  row,
  x: 80 + Math.random() * Math.max(100, w - 160),
  y: 120 + Math.random() * Math.max(100, h - 200),
  vx: 0,
  vy: 0,
  tx: 0,
  ty: 0,
  state: "wander",
  orbitAngle: 0,
  orbitSign: 1,
  speed: 34 + Math.random() * 26,
  phase: Math.random() * Math.PI * 2,
  size: fishSize(row),
  idle: 0,
  repick: 0,
  eatT: 0,
  glow: 0
});

export default function TankCanvas({
  fish,
  userId,
  canFeed,
  onEat,
  onFedToday,
  onActionBlocked
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<Map<string, SimFish>>(new Map());
  const foodRef = useRef<Food[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const bubbleElsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  const fishRef = useRef(fish);
  fishRef.current = fish;
  const canFeedRef = useRef(canFeed);
  canFeedRef.current = canFeed;
  const userIdRef = useRef(userId);
  userIdRef.current = userId;
  const onEatRef = useRef(onEat);
  onEatRef.current = onEat;
  const onFedTodayRef = useRef(onFedToday);
  onFedTodayRef.current = onFedToday;
  const onActionBlockedRef = useRef(onActionBlocked);
  onActionBlockedRef.current = onActionBlocked;

  const broadcast = (event: string, payload: unknown) => {
    channelRef.current?.send({ type: "broadcast", event, payload });
  };

  const resolveEat = (fishId: string, foodId: string | null) => {
    foodRef.current = foodRef.current.filter((f) => f.id !== foodId);
    const winner = simRef.current.get(fishId);
    if (winner) {
      winner.state = "eat";
      winner.eatT = 0;
      winner.glow = 1;
    }
    for (const s of simRef.current.values()) {
      if (s !== winner && (s.state === "toFood" || s.state === "orbit")) {
        s.state = "wander";
        s.repick = 0;
      }
    }
  };

  // 同步鱼列表 → 模拟对象
  useEffect(() => {
    const wrap = wrapRef.current;
    const sim = simRef.current;
    const ids = new Set(fish.map((f) => f.id));
    for (const [id] of sim) {
      if (!ids.has(id)) sim.delete(id);
    }
    for (const row of fish) {
      const existing = sim.get(row.id);
      if (existing) {
        existing.row = row;
        existing.size = fishSize(row);
      } else {
        sim.set(
          row.id,
          spawnFish(row, wrap?.clientWidth ?? 900, wrap?.clientHeight ?? 600)
        );
      }
    }
  }, [fish]);

  // 实时广播：食物落下 / 进食结果
  useEffect(() => {
    if (!supabaseConfigured || !supabase) return;
    const client = supabase;
    const channel = client.channel("tank-events");
    channelRef.current = channel;
    channel
      .on("broadcast", { event: "food" }, (msg) => {
        const p = msg.payload as { id?: string; x?: number; y?: number };
        if (p && p.id && typeof p.x === "number" && typeof p.y === "number") {
          foodRef.current.push({
            id: p.id,
            x: p.x,
            y: p.y,
            vy: 0,
            age: 0,
            state: "falling"
          });
        }
      })
      .on("broadcast", { event: "ate" }, (msg) => {
        const p = msg.payload as { fishId?: string; foodId?: string };
        if (p && p.fishId) resolveEat(p.fishId, p.foodId ?? null);
      })
      .subscribe();
    return () => {
      client.removeChannel(channel);
      channelRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 主循环
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    const resize = () => {
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, W * dpr);
      canvas.height = Math.max(1, H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    window.addEventListener("resize", resize);

    // 场景装饰
    const particles = Array.from({ length: 26 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 2 + Math.random() * 5,
      speed: 12 + Math.random() * 22,
      phase: Math.random() * Math.PI * 2
    }));
    const plants = Array.from({ length: 9 }, (_, i) => ({
      x: (i + 0.5) * (1 / 9) + (Math.random() - 0.5) * 0.05,
      h: 60 + Math.random() * 110,
      phase: Math.random() * Math.PI * 2,
      len: 0.75 + Math.random() * 0.7
    }));
    const rays = Array.from({ length: 5 }, (_, i) => ({
      x: (i + 0.35) * (1 / 5),
      w: 90 + Math.random() * 120,
      phase: Math.random() * Math.PI * 2
    }));

    const updateFish = (dt: number, foods: Food[]) => {
      for (const s of simRef.current.values()) {
        s.glow = Math.max(0, s.glow - dt * 1.6);
        if (s.state === "eat") {
          s.eatT += dt;
          if (s.eatT > 1.0) {
            s.state = "wander";
            s.repick = 0;
          }
          continue;
        }
        if (s.state === "wander") {
          s.repick -= dt;
          if (s.repick <= 0) {
            s.tx = 60 + Math.random() * Math.max(80, W - 120);
            s.ty = 90 + Math.random() * Math.max(80, H - 170);
            s.repick = 2 + Math.random() * 3;
          }
          if (s.idle > 0) {
            s.idle -= dt;
            continue;
          }
          if (Math.random() < 0.004) s.idle = 0.6 + Math.random() * 0.9;
        }

        let target: { x: number; y: number } | null = null;
        if (s.state === "toFood" || s.state === "orbit") {
          const f = foods.find((fd) => fd.state !== "gone" && dist(s, fd) < 260);
          if (!f) {
            s.state = "wander";
            s.repick = 0;
          } else if (s.state === "toFood") {
            target = f;
            if (dist(s, f) < 30) {
              s.state = "orbit";
              s.orbitAngle = Math.random() * Math.PI * 2;
              s.orbitSign = Math.random() < 0.5 ? -1 : 1;
            }
          } else {
            s.orbitAngle += s.orbitSign * 2.2 * dt;
            target = {
              x: f.x + Math.cos(s.orbitAngle) * 26,
              y: f.y + Math.sin(s.orbitAngle) * 26
            };
          }
        } else {
          target = { x: s.tx, y: s.ty };
          for (const f of foods) {
            if (f.state === "gone") continue;
            if (dist(s, f) < 240) {
              s.state = "toFood";
              target = f;
              break;
            }
          }
        }

        if (target) {
          const dx = target.x - s.x;
          const dy = target.y - s.y;
          const d = Math.hypot(dx, dy) || 1;
          const sp = s.speed * (s.state === "toFood" ? 1.35 : 1);
          const k = Math.min(1, dt * 3);
          s.vx += ((dx / d) * sp - s.vx) * k;
          s.vy += ((dy / d) * sp - s.vy) * k;
        }
        s.x = clamp(s.x + s.vx * dt, 26, W - 26);
        s.y = clamp(s.y + s.vy * dt, 66, H - 40);
      }
    };

    const updateFood = (dt: number) => {
      for (const f of foodRef.current) {
        f.age += dt;
        if (f.state === "falling") {
          f.vy = Math.min(70, f.vy + 55 * dt);
          f.y += f.vy * dt;
          if (f.y >= H - 38) {
            f.y = H - 38;
            f.state = "rest";
          }
        }
      }
      for (const f of foodRef.current) {
        if (f.state === "gone" || f.age < 1.4) continue;
        const arrived = [...simRef.current.values()].filter(
          (s) =>
            (s.state === "toFood" || s.state === "orbit") && dist(s, f) < 42
        );
        if (arrived.length > 0) {
          const winner = arrived[Math.floor(Math.random() * arrived.length)];
          const winnerId = winner.row.id;
          resolveEat(winnerId, f.id);
          broadcast("ate", { fishId: winnerId, foodId: f.id });
          void (async () => {
            const client = supabase;
            if (!supabaseConfigured || !client) return;
            const { data, error } = await client.rpc("feed_fish", {
              p_fish_id: winnerId
            });
            if (error) {
              onActionBlockedRef.current("投喂结算失败，请稍后再试");
              return;
            }
            const r = data[0] as {
              fish_id: string;
              feed_count: number;
              level: number;
              leveled_up: boolean;
            };
            onEatRef.current({
              fishId: r.fish_id,
              feedCount: r.feed_count,
              level: r.level,
              leveledUp: r.leveled_up
            });
          })();
        } else if (f.age > 120) {
          f.state = "gone";
        }
      }
      foodRef.current = foodRef.current.filter((f) => f.state !== "gone");
    };

    const draw = (now: number, dt: number) => {
      // 水体
      const water = ctx.createLinearGradient(0, 0, 0, H);
      water.addColorStop(0, "#0a2e4a");
      water.addColorStop(0.5, "#0c3a5c");
      water.addColorStop(1, "#071f33");
      ctx.fillStyle = water;
      ctx.fillRect(0, 0, W, H);

      // 光线
      for (const ray of rays) {
        const sway = Math.sin(now * 0.5 + ray.phase) * 24;
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, "rgba(160,220,255,0.08)");
        g.addColorStop(1, "rgba(160,220,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(ray.x * W, 0);
        ctx.lineTo(ray.x * W + sway + ray.w * 0.6, 0);
        ctx.lineTo(ray.x * W + sway - 20, H);
        ctx.lineTo(ray.x * W - ray.w, H);
        ctx.closePath();
        ctx.fill();
      }

      // 气泡
      for (const b of particles) {
        b.y -= (b.speed * dt) / H;
        if (b.y < -0.05) {
          b.y = 1.05;
          b.x = Math.random();
        }
        ctx.strokeStyle = "rgba(200,235,255,0.22)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(
          b.x * W + Math.sin(now * 2 + b.phase) * 6,
          b.y * H,
          b.r,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      // 水草
      for (const p of plants) {
        const sway = Math.sin(now * 1.2 + p.phase) * 12;
        ctx.strokeStyle = "rgba(40,160,140,0.5)";
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(p.x * W, H);
        ctx.quadraticCurveTo(
          p.x * W + sway,
          H - p.h * 0.55,
          p.x * W + sway * p.len * 1.6,
          H - p.h
        );
        ctx.stroke();
      }

      // 沙底
      const sand = ctx.createLinearGradient(0, H - 30, 0, H);
      sand.addColorStop(0, "rgba(190,160,110,0.22)");
      sand.addColorStop(1, "rgba(150,120,80,0.42)");
      ctx.fillStyle = sand;
      ctx.fillRect(0, H - 30, W, 30);

      // 鱼食
      for (const f of foodRef.current) {
        const pulse = 1 + Math.sin(now * 6) * 0.15;
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.fillStyle = "#d8a24a";
        ctx.beginPath();
        ctx.arc(0, 0, 5 * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,235,180,0.85)";
        ctx.beginPath();
        ctx.arc(-1.5, -1.5, 1.8 * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 鱼
      for (const s of simRef.current.values()) {
        ctx.save();
        ctx.translate(s.x, s.y);
        const bob = Math.sin(now * 1.8 + s.phase) * 4;
        ctx.translate(0, bob);
        const rot =
          clamp(s.vy * 0.004, -0.3, 0.3) +
          Math.sin(now * 1.2 + s.phase) * 0.04;
        ctx.rotate(rot);
        const eatScale =
          s.state === "eat"
            ? 1 + Math.sin(Math.min(1, s.eatT) * Math.PI) * 0.18
            : 1;
        drawFish(ctx, {
          appearance: appOf(s.row),
          size: s.size * eatScale,
          time: now + s.phase * 10,
          facing: s.vx < 0 ? -1 : 1,
          glow: s.glow
        });
        ctx.restore();
      }
    };

    const updateBubblePositions = () => {
      for (const b of bubblesRef.current) {
        const el = bubbleElsRef.current.get(b.key);
        const f = simRef.current.get(b.fishId);
        if (!el || !f) continue;
        el.style.transform = `translate(${Math.round(f.x - 60)}px, ${Math.round(
          f.y - f.size * 0.9 - 46
        )}px)`;
      }
    };

    // 说话轮换：每 10 秒随机选最多 3 条有语句的鱼
    const pickSpeakers = () => {
      const candidates = [...simRef.current.values()].filter(
        (s) => s.row.statements.length > 0
      );
      const count = Math.min(3, candidates.length);
      const pool = [...candidates];
      const picked: Bubble[] = [];
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        const f = pool.splice(idx, 1)[0];
        const stmts = f.row.statements;
        picked.push({
          key: `${f.row.id}-${i}-${Math.random().toString(36).slice(2)}`,
          fishId: f.row.id,
          name: f.row.name,
          text: stmts[Math.floor(Math.random() * stmts.length)],
          color: f.row.color
        });
      }
      bubblesRef.current = picked;
      setBubbles(picked);
    };
    pickSpeakers();
    const speechTimer = window.setInterval(pickSpeakers, 10000);

    let last = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;
      updateFish(dt, foodRef.current);
      updateFood(dt);
      draw(t, dt);
      updateBubblePositions();
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(speechTimer);
      ro.disconnect();
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = async (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!userIdRef.current) {
      onActionBlockedRef.current("登录后即可投喂和养鱼");
      return;
    }
    if (!canFeedRef.current) {
      onActionBlockedRef.current("今天已经投喂过啦，明天再来吧");
      return;
    }
    const client = supabase;
    if (!supabaseConfigured || !client) return;
    const { error } = await client.rpc("throw_food");
    if (error) {
      onActionBlockedRef.current(
        error.message.includes("already fed today")
          ? "今天已经投喂过啦，明天再来吧"
          : "投喂失败，请稍后再试"
      );
      return;
    }
    onFedTodayRef.current();
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = crypto.randomUUID();
    foodRef.current.push({ id, x, y, vy: 0, age: 0, state: "falling" });
    broadcast("food", { id, x, y });
  };

  return (
    <div ref={wrapRef} className="tank-wrap">
      <canvas ref={canvasRef} className="tank-canvas" onClick={handleClick} />
      {bubbles.map((b) => (
        <div
          key={b.key}
          ref={(el) => {
            if (el) bubbleElsRef.current.set(b.key, el);
            else bubbleElsRef.current.delete(b.key);
          }}
          className="speech-bubble"
        >
          <span className="speech-name" style={{ color: b.color }}>
            {b.name}
          </span>
          <span className="speech-text">{b.text}</span>
        </div>
      ))}
    </div>
  );
}
