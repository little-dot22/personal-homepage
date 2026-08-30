import sponge from "../../assert/bikini/sponge.webp";
import patrick from "../../assert/bikini/patrick.webp";
import squidward from "../../assert/bikini/squidward.webp";
import krabs from "../../assert/bikini/krabs.webp";
import pearl from "../../assert/bikini/pearl.webp";
import plankton from "../../assert/bikini/plankton.webp";
import sandy from "../../assert/bikini/Sandy.webp";
import gary from "../../assert/bikini/GarytheSnail.webp";
import krusty from "../../assert/bikini/krusty.webp";
import swordfish from "../../assert/decoration/SwordfishSilhouette.webp";
import whale from "../../assert/decoration/WhaleSilhouette.webp";

const sources: Record<string, string> = {
  sponge,
  patrick,
  squidward,
  krabs,
  pearl,
  plankton,
  sandy,
  gary,
  krusty,
  swordfish,
  whale
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
