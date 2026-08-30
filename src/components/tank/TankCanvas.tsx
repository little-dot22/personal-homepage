import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import {
  bikiniScale,
  drawCloud,
  renderStaticBg,
  sandGroundY
} from "../../lib/bikini";
import { getSprite } from "../../lib/bikiniAssets";
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
  feederId: string | null;
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
  onEat: (p: EatPayload) => void;
  onAnnounce: (msg: string) => void;
  onActionBlocked: (msg: string) => void;
}

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

const mapFeedError = (msg: string): string => {
  if (
    msg.includes("not authenticated") ||
    msg.includes("JWT expired") ||
    msg.includes("invalid JWT") ||
    msg.includes("AuthApiError")
  ) {
    return "登录已过期，请重新登录后再投喂";
  }
  if (msg.includes("fish not found")) {
    return "这条鱼已被放生，鱼食落空了";
  }
  return "投喂结算失败，请稍后再试";
};

const appOf = (row: FishRow): FishAppearance => ({
  name: row.name,
  color: row.color,
  accent: row.accent,
  shape: row.shape,
  pattern: row.pattern,
  tail: row.tail,
  fin: row.fin,
  eye: row.eye,
  custom_drawing: row.custom_drawing ?? null
});

const fishSize = (row: FishRow) => 42 + Math.min(row.level, 100) * 0.58;

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
  onEat,
  onAnnounce,
  onActionBlocked
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const simRef = useRef<Map<string, SimFish>>(new Map());
  const foodRef = useRef<Food[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const bubbleElsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const settledFoodIdsRef = useRef<Set<string>>(new Set());
  const myFoodIdsRef = useRef<Set<string>>(new Set());
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  const fishRef = useRef(fish);
  fishRef.current = fish;
  const userIdRef = useRef(userId);
  userIdRef.current = userId;
  const onEatRef = useRef(onEat);
  onEatRef.current = onEat;
  const onAnnounceRef = useRef(onAnnounce);
  onAnnounceRef.current = onAnnounce;
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

  // 同步鱼列表 → 模拟对象；删除的鱼连说话气泡一起移除
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
    const remaining = bubblesRef.current.filter((b) => ids.has(b.fishId));
    if (remaining.length !== bubblesRef.current.length) {
      bubblesRef.current = remaining;
      setBubbles(remaining);
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
        const p = msg.payload as {
          id?: string;
          x?: number;
          y?: number;
          feederId?: string | null;
        };
        if (p && p.id && typeof p.x === "number" && typeof p.y === "number") {
          foodRef.current.push({
            id: p.id,
            x: p.x,
            y: p.y,
            vy: 0,
            age: 0,
            state: "falling",
            feederId: p.feederId ?? null
          });
        }
      })
      .on("broadcast", { event: "ate" }, (msg) => {
        const p = msg.payload as {
          fishId?: string;
          foodId?: string;
          level?: number;
          leveledUp?: boolean;
        };
        if (!p || !p.fishId) return;
        const foodKey = p.foodId ?? "";
        if (settledFoodIdsRef.current.has(foodKey)) return;
        settledFoodIdsRef.current.add(foodKey);
        resolveEat(p.fishId, p.foodId ?? null);
        const isMine = Boolean(p.foodId) && myFoodIdsRef.current.has(p.foodId!);
        myFoodIdsRef.current.delete(p.foodId ?? "");
        if (!isMine) {
          const row = simRef.current.get(p.fishId)?.row;
          const name = row?.name ?? "一条鱼";
          onAnnounceRef.current(
            p.leveledUp
              ? `${name} 抢到了鱼食，升到 Lv.${p.level}！`
              : `${name} 抢到了鱼食！`
          );
        }
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
    const bgCanvas = document.createElement("canvas");
    const bgCtx = bgCanvas.getContext("2d");
    const resize = () => {
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, W * dpr);
      canvas.height = Math.max(1, H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bgCanvas.width = Math.max(1, W);
      bgCanvas.height = Math.max(1, H);
      if (bgCtx) renderStaticBg(bgCtx, W, H);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    window.addEventListener("resize", resize);

    // 水气泡装饰
    const particles = Array.from({ length: 26 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 2 + Math.random() * 5,
      speed: 12 + Math.random() * 22,
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
          // 只有投喂者本人的客户端结算，防止多端重复结算
          if (
            f.feederId &&
            f.feederId === userIdRef.current &&
            !settledFoodIdsRef.current.has(f.id)
          ) {
            settledFoodIdsRef.current.add(f.id);
            myFoodIdsRef.current.delete(f.id);
            const winner = arrived[Math.floor(Math.random() * arrived.length)];
            const winnerId = winner.row.id;
            resolveEat(winnerId, f.id);
            void (async () => {
              const client = supabase;
              if (!supabaseConfigured || !client) return;
              const { data, error } = await client.rpc("feed_fish", {
                p_fish_id: winnerId
              });
              if (error) {
                onActionBlockedRef.current(mapFeedError(error.message));
                return;
              }
              const r = data[0] as {
                fish_id: string;
                feed_count: number;
                level: number;
                leveled_up: boolean;
              };
              broadcast("ate", {
                fishId: r.fish_id,
                foodId: f.id,
                level: r.level,
                leveledUp: r.leveled_up
              });
              onEatRef.current({
                fishId: r.fish_id,
                feedCount: r.feed_count,
                level: r.level,
                leveledUp: r.leveled_up
              });
            })();
          }
        } else if (f.age > 120) {
          f.state = "gone";
        }
      }
      foodRef.current = foodRef.current.filter((f) => f.state !== "gone");
    };

    const draw = (t: number, dt: number) => {
      // 比基尼海滩背景
      if (bgCtx && bgCanvas.width > 0) {
        ctx.drawImage(bgCanvas, 0, 0, W, H);
        const s = bikiniScale(H);
        // 花云
        drawCloud(ctx, W * 0.2, H * 0.12, t, s * 0.9);
        drawCloud(ctx, W * 0.55, H * 0.18, t + 2, s * 1.1);
        drawCloud(ctx, W * 0.86, H * 0.09, t + 4, s * 0.8);
        // 剪影（上半屏，双向，游在角色与鱼之后）
        for (const sw of silhouettes) {
          const img = getSprite(sw.name);
          if (!img) continue;
          const w = sw.size * (img.naturalWidth / img.naturalHeight);
          const y = sw.y + Math.sin(t * 1.5 + sw.phase) * 6;
          ctx.save();
          ctx.translate(sw.x, y);
          if (sw.toRight) ctx.scale(-1, 1);
          ctx.drawImage(img, -w / 2, -sw.size / 2, w, sw.size);
          ctx.restore();
        }
        // 水母：右上角聚成一堆漂游，各自上下浮动
        const jellySpots: Array<[number, number, number, number]> = [
          [0.8, 0.11, 0.4, 1.1],
          [0.875, 0.18, 0.6, 0.9],
          [0.84, 0.075, 0.9, 1.3]
        ];
        for (let i = 0; i < jellySpots.length; i++) {
          const [bx, by, ph, ph2] = jellySpots[i];
          const img = getSprite("jelly");
          if (!img) continue;
          const h = (64 + i * 8) * s;
          const w = h * (img.naturalWidth / img.naturalHeight);
          const jx = W * bx + Math.sin(t * 0.4 + ph) * 20;
          const jy = H * by + Math.sin(t * 1.1 + ph2) * 11;
          ctx.drawImage(img, jx - w / 2, jy - h / 2, w, h);
        }
        // 角色（图片素材，站进沙地里、绘制在沙滩图层之上）
        const groundY = sandGroundY(H);
        const drawChar = (
          name: string,
          x: number,
          targetH: number,
          bob: number
        ) => {
          const img = getSprite(name);
          if (!img) return;
          const w = targetH * (img.naturalWidth / img.naturalHeight);
          ctx.drawImage(img, x - w / 2, groundY - bob - targetH, w, targetH);
        };
        // 蟹堡王居中，更大
        drawChar("krusty", W * 0.5, 400 * s, 0);
        // 组一：海绵宝宝 + 小蜗 + 派大星 + 珊迪（屏幕左侧，互相挨着）
        drawChar("sponge", W * 0.135, 170 * s, Math.abs(Math.sin(t * 2.2)) * 2);
        drawChar("gary", W * 0.17, 78 * s, Math.abs(Math.sin(t * 1.4 + 1)) * 1.5);
        drawChar("patrick", W * 0.205, 168 * s, Math.abs(Math.sin(t * 1.8 + 1)) * 2);
        drawChar("sandy", W * 0.25, 165 * s, Math.abs(Math.sin(t * 2 + 3)) * 2);
        // 组二：蟹老板 + 珍珍（蟹堡王门口）
        drawChar("krabs", W * 0.475, 150 * s, Math.abs(Math.sin(t * 2 + 0.5)) * 1.5);
        drawChar("pearl", W * 0.53, 170 * s, Math.abs(Math.sin(t * 1.7 + 0.8)) * 2);
        // 组四：章鱼哥（组二与组三之间）
        drawChar("squidward", W * 0.7, 175 * s, Math.abs(Math.sin(t * 1.5 + 2)) * 2);
        // 组三：痞老板（屏幕右侧，独自一组）
        drawChar("plankton", W * 0.88, 62 * s, Math.abs(Math.sin(t * 6)) * 5);
      }

      // 气泡
      for (const b of particles) {
        b.y -= (b.speed * dt) / H;
        if (b.y < -0.05) {
          b.y = 1.05;
          b.x = Math.random();
        }
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(
          b.x * W + Math.sin(t * 2 + b.phase) * 6,
          b.y * H,
          b.r,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      // 鱼食
      for (const f of foodRef.current) {
        const pulse = 1 + Math.sin(t * 6) * 0.15;
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.fillStyle = "#d8a24a";
        ctx.strokeStyle = "rgba(90,60,20,0.55)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 5 * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "rgba(255,235,180,0.9)";
        ctx.beginPath();
        ctx.arc(-1.5, -1.5, 1.8 * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 鱼
      for (const s of simRef.current.values()) {
        ctx.save();
        ctx.translate(s.x, s.y);
        const bob = Math.sin(t * 1.8 + s.phase) * 4;
        ctx.translate(0, bob);
        const rot =
          clamp(s.vy * 0.004, -0.3, 0.3) +
          Math.sin(t * 1.2 + s.phase) * 0.04;
        ctx.rotate(rot);
        const eatScale =
          s.state === "eat"
            ? 1 + Math.sin(Math.min(1, s.eatT) * Math.PI) * 0.18
            : 1;
        drawFish(ctx, {
          appearance: appOf(s.row),
          size: s.size * eatScale,
          time: t + s.phase * 10,
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
        if (!el) continue;
        if (!f) {
          el.style.display = "none";
          continue;
        }
        el.style.display = "";
        el.style.transform = `translate(${Math.round(f.x - 60)}px, ${Math.round(
          f.y - f.size * 0.9 - 46
        )}px)`;
      }
    };

    const updateTooltip = () => {
      const tip = tooltipRef.current;
      if (!tip) return;
      const mp = mouseRef.current;
      let hovered: SimFish | null = null;
      if (mp.active) {
        for (const s of simRef.current.values()) {
          if (Math.hypot(s.x - mp.x, s.y - mp.y) < s.size * 0.55 + 14) {
            hovered = s;
            break;
          }
        }
      }
      if (hovered) {
        tip.textContent = `${hovered.row.name} · Lv.${hovered.row.level}`;
        tip.style.color = hovered.row.color;
        tip.style.display = "block";
        tip.style.transform = `translate(${Math.round(hovered.x)}px, ${Math.round(
          hovered.y - hovered.size * 0.9 - 30
        )}px) translate(-50%, -100%)`;
      } else {
        tip.style.display = "none";
      }
    };

    // 说话：以长时间静默为主，偶尔有鱼说话
    // 静默 16~60 秒 → 约 55% 概率 1 条鱼说 9 秒，13% 概率 2 条鱼同时说，32% 概率继续安静
    let speechTimer = 0;
    let bubbleTimer = 0;

    const pickSpeakers = () => {
      const candidates = [...simRef.current.values()].filter(
        (s) => s.row.statements.length > 0
      );
      if (candidates.length === 0) return;
      const roll = Math.random();
      let count = 0;
      if (roll < 0.55) count = 1;
      else if (roll < 0.68) count = 2;
      if (count === 0) return;

      const pool = [...candidates];
      const picked: Bubble[] = [];
      for (let i = 0; i < count && pool.length > 0; i++) {
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
      bubbleTimer = window.setTimeout(() => {
        bubblesRef.current = [];
        setBubbles([]);
      }, 9000);
    };

    const scheduleSpeech = () => {
      speechTimer = window.setTimeout(() => {
        pickSpeakers();
        scheduleSpeech();
      }, 16000 + Math.random() * 44000);
    };
    scheduleSpeech();

    // 剪影（剑鱼/鲸鱼）：每 10~20 秒出现一条，双向直线游动；越大越稀有，最大半屏
    const silhouettes: Array<{
      name: string;
      x: number;
      y: number;
      speed: number;
      size: number;
      phase: number;
      toRight: boolean;
    }> = [];
    let swimTimer = 5;
    const rollSilhouetteSize = () => {
      const r = Math.random();
      if (r < 0.5) return H * (0.06 + Math.random() * 0.05);
      if (r < 0.8) return H * (0.11 + Math.random() * 0.09);
      if (r < 0.95) return H * (0.2 + Math.random() * 0.12);
      return H * (0.32 + Math.random() * 0.18);
    };

    let last = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;
      swimTimer -= dt;
      if (swimTimer <= 0 && silhouettes.length < 2) {
        const toRight = Math.random() < 0.5;
        silhouettes.push({
          name: Math.random() < 0.5 ? "swordfish" : "whale",
          x: toRight ? -200 : W + 200,
          y: H * (0.14 + Math.random() * 0.2),
          speed: 65 + Math.random() * 40,
          size: rollSilhouetteSize(),
          phase: Math.random() * Math.PI * 2,
          toRight
        });
        swimTimer = 10 + Math.random() * 10;
      }
      for (const sw of silhouettes) {
        sw.x += (sw.toRight ? 1 : -1) * sw.speed * dt;
      }
      for (let i = silhouettes.length - 1; i >= 0; i--) {
        const sw = silhouettes[i];
        if (sw.toRight ? sw.x > W + sw.size : sw.x < -sw.size - 100) {
          silhouettes.splice(i, 1);
        }
      }
      updateFish(dt, foodRef.current);
      updateFood(dt);
      draw(t, dt);
      updateBubblePositions();
      updateTooltip();
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(speechTimer);
      clearTimeout(bubbleTimer);
      ro.disconnect();
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!userIdRef.current) {
      onActionBlockedRef.current("登录后即可投喂和养鱼");
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = crypto.randomUUID();
    const feederId = userIdRef.current;
    foodRef.current.push({
      id,
      x,
      y,
      vy: 0,
      age: 0,
      state: "falling",
      feederId
    });
    myFoodIdsRef.current.add(id);
    broadcast("food", { id, x, y, feederId });
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current = { ...mouseRef.current, active: false };
  };

  return (
    <div ref={wrapRef} className="tank-wrap">
      <canvas
        ref={canvasRef}
        className="tank-canvas"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      <div ref={tooltipRef} className="fish-tooltip" />
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
