import type { CSSProperties, ReactNode } from "react";
import type { NavItem } from "../context/NavContext";

const PLACEHOLDER = "内容建设中 · 这里将承载属于你的故事";

export default function SectionPage({
  item,
  children
}: {
  item: NavItem;
  children?: ReactNode;
}) {
  return (
    <main
      className="section-page"
      style={{ "--accent": item.color } as CSSProperties}
    >
      <div className="section-head">
        <span className="section-tag">SECTOR</span>
        <h1 className="section-hero">{item.label}</h1>
        <p className="section-sub">{PLACEHOLDER}</p>
      </div>
      {children ?? (
        <div className="cards">
          <div className="card" />
          <div className="card" />
          <div className="card" />
        </div>
      )}
    </main>
  );
}
