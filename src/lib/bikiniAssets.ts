import sponge from "../../assert/bikini/sponge.png";
import patrick from "../../assert/bikini/patrick.png";
import squidward from "../../assert/bikini/squidward.png";
import krabs from "../../assert/bikini/krabs.png";
import pearl from "../../assert/bikini/pearl.png";
import plankton from "../../assert/bikini/plankton.png";
import sandy from "../../assert/bikini/Sandy.png";
import gary from "../../assert/bikini/GarytheSnail.png";
import krusty from "../../assert/bikini/krusty.png";
import swordfish from "../../assert/decoration/SwordfishSilhouette.png";
import whale from "../../assert/decoration/WhaleSilhouette.png";

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
