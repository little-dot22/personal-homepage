import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import {
  CSS3DObject,
  CSS3DRenderer
} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { NAV_ITEMS, useNav } from "../context/NavContext";

const RADIUS = 380;

const LONGITUDES = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];
const LATITUDES = [0.55, -0.3, 0.18];

interface SphereEntry {
  obj: CSS3DObject;
  label: HTMLElement;
  dir: THREE.Vector3;
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

    const entries: SphereEntry[] = [];

    NAV_ITEMS.forEach((item, i) => {
      const host = document.createElement("div");
      host.className = "sphere-host";

      const label = document.createElement("span");
      label.className = "sphere-title";
      label.textContent = item.label;
      label.style.color = item.color;

      host.appendChild(label);
      const obj = new CSS3DObject(host);

      const lon = LONGITUDES[i];
      const lat = LATITUDES[i];
      const dir = new THREE.Vector3(
        Math.cos(lat) * Math.sin(lon),
        Math.sin(lat),
        Math.cos(lat) * Math.cos(lon)
      );
      scene.add(obj);

      const entry: SphereEntry = { obj, label, dir, depth: 0 };
      entries.push(entry);

      label.addEventListener("click", () => {
        if (entry.depth < 0.45) navigate(item.path);
      });
    });

    const Y_AXIS = new THREE.Vector3(0, 1, 0);
    const X_AXIS = new THREE.Vector3(1, 0, 0);
    const quat = new THREE.Quaternion();
    const qYaw = new THREE.Quaternion();
    const qPitch = new THREE.Quaternion();
    const pos = new THREE.Vector3();

    const place = (theta: number, phi: number) => {
      qYaw.setFromAxisAngle(Y_AXIS, theta);
      qPitch.setFromAxisAngle(X_AXIS, phi);
      quat.copy(qYaw).multiply(qPitch);
      for (const entry of entries) {
        pos.copy(entry.dir).applyQuaternion(quat).multiplyScalar(RADIUS);
        entry.obj.position.copy(pos);
        entry.obj.quaternion.identity();
      }
    };

    const applyStyles = (snap: boolean) => {
      for (const entry of entries) {
        const z = entry.obj.position.z;
        const t = THREE.MathUtils.clamp((RADIUS - z) / (RADIUS * 2), 0, 1);
        entry.depth = snap ? t : entry.depth + (t - entry.depth) * 0.25;
        const s = entry.depth;

        const opacity = (1 - s * 0.88).toFixed(2);
        if (entry.label.style.opacity !== opacity) {
          entry.label.style.opacity = opacity;
        }
        const blur = (Math.round(s * 16) / 2).toFixed(1);
        if (entry.label.style.filter !== `blur(${blur}px)`) {
          entry.label.style.filter = `blur(${blur}px)`;
        }
        const scale = (1 + (1 - s) * 0.24).toFixed(3);
        if (entry.label.style.transform !== `scale(${scale})`) {
          entry.label.style.transform = `scale(${scale})`;
        }
        const pe = s < 0.45 ? "auto" : "none";
        if (entry.obj.element.style.pointerEvents !== pe) {
          entry.obj.element.style.pointerEvents = pe;
        }
      }
    };

    let theta = 0;
    let phi = 0;
    let raf = 0;
    const clock = new THREE.Clock();

    place(0, 0);
    applyStyles(true);

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const current = hoveredRef.current;

      if (current !== null) {
        let delta = -LONGITUDES[current] - theta;
        delta = ((delta + Math.PI) % (Math.PI * 2)) - Math.PI;
        theta += delta * 0.09;
        phi += (LATITUDES[current] - phi) * 0.08;
      } else {
        theta += dt * 0.28;
        phi += (0 - phi) * 0.03;
      }

      place(theta, phi);
      applyStyles(false);
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
