import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import {
  CSS3DObject,
  CSS3DRenderer
} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { NAV_ITEMS, useNav } from "../context/NavContext";

const RADIUS = 380;

interface SphereItem {
  obj: CSS3DObject;
  azimuth: number;
  depth: number;
}

export default function TitleSphere() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { hovered } = useNav();
  const hoveredRef = useRef(hovered);

  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      1,
      5000
    );
    camera.position.z = 1300;

    const renderer = new CSS3DRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.rotation.x = -0.16;
    group.rotation.y = Math.PI;
    scene.add(group);

    const items: SphereItem[] = [];

    NAV_ITEMS.forEach((item, i) => {
      const azimuth = (i * Math.PI * 2) / 3;

      const host = document.createElement("div");
      host.className = "sphere-host";

      const label = document.createElement("span");
      label.className = "sphere-title";
      label.textContent = item.label;
      label.style.color = item.color;

      host.appendChild(label);
      const obj = new CSS3DObject(host);
      obj.position.set(
        Math.sin(azimuth) * RADIUS,
        0,
        -Math.cos(azimuth) * RADIUS
      );
      group.add(obj);

      const entry: SphereItem = { obj, azimuth, depth: 0 };
      items.push(entry);

      label.addEventListener("click", () => {
        if (entry.depth < 0.45) navigate(item.path);
      });
    });

    let angle = Math.PI;
    let raf = 0;
    const clock = new THREE.Clock();
    const worldPos = new THREE.Vector3();

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const current = hoveredRef.current;

      if (current !== null) {
        const desired = Math.PI - items[current].azimuth;
        let delta = desired - angle;
        delta = ((delta + Math.PI) % (Math.PI * 2)) - Math.PI;
        if (Math.abs(delta) > 0.006) {
          angle += delta * 0.09;
        } else {
          angle += dt * 0.12;
        }
      } else {
        angle += dt * 0.28;
      }

      group.rotation.y = angle;
      scene.updateMatrixWorld();

      for (const entry of items) {
        entry.obj.getWorldPosition(worldPos);
        const t = THREE.MathUtils.clamp(
          (RADIUS - worldPos.z) / (RADIUS * 2),
          0,
          1
        );
        entry.depth = t;

        const label = entry.obj.element.firstElementChild as HTMLElement;
        label.style.opacity = String(1 - t * 0.88);
        label.style.filter = `blur(${(t * 7).toFixed(2)}px)`;
        label.style.transform = `scale(${(1 + (1 - t) * 0.24).toFixed(3)})`;
        entry.obj.element.style.pointerEvents = t < 0.45 ? "auto" : "none";
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.domElement.remove();
    };
  }, [navigate]);

  return (
    <div className="sphere-wrap">
      <div ref={containerRef} className="sphere-container" />
      <p className="sphere-hint">HOVER 导航 · CLICK 进入板块</p>
    </div>
  );
}
