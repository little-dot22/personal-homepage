import type { CSSProperties } from "react";
import {
  EYE_IDS,
  EYE_LABELS,
  FIN_IDS,
  FIN_LABELS,
  PATTERN_IDS,
  PATTERN_LABELS,
  PRESET_COLORS,
  SHAPE_IDS,
  SHAPE_LABELS,
  TAIL_IDS,
  TAIL_LABELS
} from "../../lib/fishDraw";
import type { FishAppearance } from "../../lib/types";
import FishPreview from "./FishPreview";

interface Props {
  value: FishAppearance;
  onChange: (v: FishAppearance) => void;
  showName?: boolean;
}

function OptionRow({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="opt-row">
      <span className="opt-label">{label}</span>
      <div className="opt-items">{children}</div>
    </div>
  );
}

export default function AppearanceEditor({ value, onChange, showName = true }: Props) {
  const set = (patch: Partial<FishAppearance>) => onChange({ ...value, ...patch });

  return (
    <div className="appearance-editor">
      <div className="appearance-top">
        <FishPreview appearance={value} />
        {showName && (
          <input
            className="fish-name-input"
            value={value.name}
            maxLength={12}
            placeholder="给鱼起个名字（12字内）"
            onChange={(e) => set({ name: e.target.value })}
          />
        )}
      </div>

      <OptionRow label="鱼形">
        {SHAPE_IDS.map((id) => (
          <button
            key={id}
            type="button"
            className={"opt-btn" + (value.shape === id ? " on" : "")}
            onClick={() => set({ shape: id })}
          >
            {SHAPE_LABELS[id]}
          </button>
        ))}
      </OptionRow>

      <OptionRow label="主色">
        <div className="swatches">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={"swatch" + (value.color === c ? " on" : "")}
              style={{ background: c } as CSSProperties}
              onClick={() => set({ color: c })}
            />
          ))}
          <label className="swatch custom" style={{ background: value.color } as CSSProperties}>
            <input
              type="color"
              value={value.color}
              onChange={(e) => set({ color: e.target.value })}
            />
          </label>
        </div>
      </OptionRow>

      <OptionRow label="辅色">
        <div className="swatches">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={"swatch" + (value.accent === c ? " on" : "")}
              style={{ background: c } as CSSProperties}
              onClick={() => set({ accent: c })}
            />
          ))}
          <label className="swatch custom" style={{ background: value.accent } as CSSProperties}>
            <input
              type="color"
              value={value.accent}
              onChange={(e) => set({ accent: e.target.value })}
            />
          </label>
        </div>
      </OptionRow>

      <OptionRow label="花纹">
        {PATTERN_IDS.map((id) => (
          <button
            key={id}
            type="button"
            className={"opt-btn" + (value.pattern === id ? " on" : "")}
            onClick={() => set({ pattern: id })}
          >
            {PATTERN_LABELS[id]}
          </button>
        ))}
      </OptionRow>

      <OptionRow label="尾巴">
        {TAIL_IDS.map((id) => (
          <button
            key={id}
            type="button"
            className={"opt-btn" + (value.tail === id ? " on" : "")}
            onClick={() => set({ tail: id })}
          >
            {TAIL_LABELS[id]}
          </button>
        ))}
      </OptionRow>

      <OptionRow label="背鳍">
        {FIN_IDS.map((id) => (
          <button
            key={id}
            type="button"
            className={"opt-btn" + (value.fin === id ? " on" : "")}
            onClick={() => set({ fin: id })}
          >
            {FIN_LABELS[id]}
          </button>
        ))}
      </OptionRow>

      <OptionRow label="眼睛">
        {EYE_IDS.map((id) => (
          <button
            key={id}
            type="button"
            className={"opt-btn" + (value.eye === id ? " on" : "")}
            onClick={() => set({ eye: id })}
          >
            {EYE_LABELS[id]}
          </button>
        ))}
      </OptionRow>
    </div>
  );
}
