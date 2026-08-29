-- ============================================================
-- 赛博鱼缸 · Supabase 数据库初始化脚本
-- 使用方法：Supabase 控制台 → SQL Editor → 粘贴本文件全部内容 → Run
-- 注意：VITE_SUPABASE_ANON_KEY（anon 公钥）可以放前端 .env，
--       service_role key 千万不要放进任何前端文件。
-- ============================================================

-- ---------- 鱼表 ----------
create table if not exists public.fish (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users (id) on delete cascade,
  name text not null default '无名鱼' check (char_length(name) between 1 and 12),
  color text not null default '#E8A87C',
  accent text not null default '#FFFFFF',
  shape text not null default 'round',
  pattern text not null default 'none',
  tail text not null default 'fan',
  fin text not null default 'small',
  eye text not null default 'normal',
  statements jsonb not null default '[]'::jsonb,
  level int not null default 0,
  feed_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- 投喂记录（用于“每天一次”判定） ----------
create table if not exists public.feedings (
  id uuid primary key default gen_random_uuid(),
  feeder_id uuid not null references auth.users (id) on delete cascade,
  fish_id uuid not null references public.fish (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists idx_feedings_feeder_day
  on public.feedings (feeder_id, created_at desc);

-- ---------- RLS ----------
alter table public.fish enable row level security;
alter table public.feedings enable row level security;

drop policy if exists "fish_read_all" on public.fish;
create policy "fish_read_all" on public.fish
  for select using (true);

drop policy if exists "fish_insert_owner" on public.fish;
create policy "fish_insert_owner" on public.fish
  for insert with check (auth.uid() = owner_id);

drop policy if exists "fish_update_owner" on public.fish;
create policy "fish_update_owner" on public.fish
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "fish_delete_owner" on public.fish;
create policy "fish_delete_owner" on public.fish
  for delete using (auth.uid() = owner_id);

drop policy if exists "feedings_read_all" on public.feedings;
create policy "feedings_read_all" on public.feedings
  for select using (true);

drop policy if exists "feedings_insert_self" on public.feedings;
create policy "feedings_insert_self" on public.feedings
  for insert with check (auth.uid() = feeder_id);

-- ---------- RPC：领养（限每人 1 条 / 鱼缸上限 50 条） ----------
create or replace function public.adopt_fish(
  p_name text,
  p_color text,
  p_accent text,
  p_shape text,
  p_pattern text,
  p_tail text,
  p_fin text,
  p_eye text
)
returns public.fish
language plpgsql
security definer
set search_path = public
as $$
declare
  v_fish public.fish;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if exists (select 1 from public.fish where owner_id = auth.uid()) then
    raise exception 'already has fish';
  end if;
  if (select count(*) from public.fish) >= 50 then
    raise exception 'tank full';
  end if;
  insert into public.fish (owner_id, name, color, accent, shape, pattern, tail, fin, eye)
  values (auth.uid(), p_name, p_color, p_accent, p_shape, p_pattern, p_tail, p_fin, p_eye)
  returning * into v_fish;
  return v_fish;
end;
$$;

-- ---------- RPC：投喂（服务端校验每日一次 + 自动升级） ----------
create or replace function public.feed_fish(p_fish_id uuid)
returns table (fish_id uuid, feed_count int, level int, leveled_up boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_fish public.fish;
  v_level int;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if exists (
    select 1 from public.feedings f
    where f.feeder_id = auth.uid()
      and f.created_at >= (date_trunc('day', (now() at time zone 'Asia/Shanghai')) at time zone 'Asia/Shanghai')
  ) then
    raise exception 'already fed today';
  end if;

  select * into v_fish from public.fish where id = p_fish_id;
  if v_fish is null then
    raise exception 'fish not found';
  end if;

  insert into public.feedings (feeder_id, fish_id) values (auth.uid(), p_fish_id);

  v_fish.feed_count := v_fish.feed_count + 1;
  -- 累计 n(n+1)/2 次投喂 = n 级，最高 10 级
  v_level := least(10, floor((sqrt(8 * v_fish.feed_count + 1) - 1) / 2));

  update public.fish
  set feed_count = v_fish.feed_count, level = v_level, updated_at = now()
  where id = p_fish_id;

  return query select v_fish.id, v_fish.feed_count, v_level, v_level > v_fish.level;
end;
$$;

-- ---------- 开启 fish 表实时订阅 ----------
alter publication supabase_realtime add table public.fish;
