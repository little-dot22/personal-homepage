import sponge from "../../assert/bikini/sponge.webp";
import patrick from "../../assert/bikini/patrick.webp";
import squidward from "../../assert/bikini/squidward.webp";
import krabs from "../../assert/bikini/krabs.webp";
import pearl from "../../assert/bikini/pearl.webp";
import plankton from "../../assert/bikini/plankton.webp";
import sandy from "../../assert/bikini/Sandy.webp";
import gary from "../../assert/bikini/GarytheSnail.webp";
import krusty from "../../assert/bikini/krusty.webp";
import swordfishWebp from "../../assert/decoration/SwordfishSilhouette.webp";
import whaleWebp from "../../assert/decoration/WhaleSilhouette.webp";

const sources: Record<string, string> = {
  sponge,
  patrick,
  squidward,
  krabs,
  pearl,
  plankton,
  sandy,
  gary,
  krusty
};

const images: Record<string, HTMLImageElement> = {};

for (const [name, url] of Object.entries(sources)) {
  const img = new Image();
  img.src = url;
  images[name] = img;
}

export function getSprite(name: string): HTMLImageElement | null {
  const img = images[name];
  if (!img || !img.complete || !img.naturalWidth) return null;
  return img;
}

// ---------- 剪影：桌面用高清 origin 图（懒加载），手机用轻量 webp ----------

export const useHiResSilhouettes =
  typeof window !== "undefined" && window.innerWidth >= 768;

const lite: Record<string, HTMLImageElement> = {};
for (const [name, url] of Object.entries({
  swordfish: swordfishWebp,
  whale: whaleWebp
})) {
  const img = new Image();
  img.src = url;
  lite[name] = img;
}

const hiRes: Record<string, HTMLImageElement | null> = {
  swordfish: null,
  whale: null
};
const hiResLoading: Record<string, boolean> = {
  swordfish: false,
  whale: false
};
const hiResLoaders: Record<string, () => Promise<{ default: string }>> = {
  swordfish: () => import("../../assert/decoration/swordfish-origin.png"),
  whale: () => import("../../assert/decoration/WhaleSilhouette-origin.png")
};

function ready(img: HTMLImageElement | null | undefined): img is HTMLImageElement {
  return Boolean(img && img.complete && img.naturalWidth);
}

export function getSilhouetteSprite(name: string): HTMLImageElement | null {
  const fallback = lite[name];
  if (!useHiResSilhouettes) {
    return ready(fallback) ? fallback : null;
  }
  const cached = hiRes[name];
  if (ready(cached)) return cached;
  if (!hiResLoading[name]) {
    hiResLoading[name] = true;
    void hiResLoaders[name]().then((mod) => {
      const img = new Image();
      img.src = mod.default;
      hiRes[name] = img;
    });
  }
  return ready(fallback) ? fallback : null;
}
