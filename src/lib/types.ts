export type ShapeId = "round" | "slim" | "puffer" | "tri";
export type PatternId = "none" | "stripes" | "spots";
export type TailId = "fan" | "fork";
export type FinId = "small" | "big";
export type EyeId = "normal" | "big";

export interface FishRow {
  id: string;
  owner_id: string;
  name: string;
  color: string;
  accent: string;
  shape: ShapeId;
  pattern: PatternId;
  tail: TailId;
  fin: FinId;
  eye: EyeId;
  statements: string[];
  level: number;
  feed_count: number;
  created_at: string;
  updated_at?: string;
}

export interface FishAppearance {
  name: string;
  color: string;
  accent: string;
  shape: ShapeId;
  pattern: PatternId;
  tail: TailId;
  fin: FinId;
  eye: EyeId;
}
