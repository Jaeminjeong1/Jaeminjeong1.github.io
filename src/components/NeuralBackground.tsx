'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// 빨간색 테마의 신경망 코어 + 궤도 + 불티 파티클을 렌더링하는 fixed 배경 캔버스.
// 마우스 이벤트는 통과시키고, 페이지가 가려지면(visibilitychange) 루프를 정지시킨다.
export function NeuralBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0202, 0.015);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 5, 30);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 1) 중앙 루비 코어 (이십면체)
    const coreGeo = new THREE.IcosahedronGeometry(4, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x990000,
      emissive: 0x440000,
      roughness: 0.2,
      metalness: 0.8,
      flatShading: true,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // 1-2) 와이어프레임 외피
    const wireGeo = new THREE.IcosahedronGeometry(4.8, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xff3333,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const wireframeCore = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireframeCore);

    // 2) 궤도 링 3개
    const ringColors = [0xffaa00, 0xff4444, 0xff8800];
    const ringRadii = [8, 11, 15];
    const rings: { mesh: THREE.Mesh; sx: number; sy: number }[] = [];
    ringRadii.forEach((radius, i) => {
      const ringGeo = new THREE.TorusGeometry(radius, 0.05, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: ringColors[i],
        transparent: true,
        opacity: 0.4 + i * 0.1,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(ringGeo, ringMat);
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      rings.push({ mesh, sx: (Math.random() - 0.5) * 0.01, sy: (Math.random() - 0.5) * 0.01 });
      scene.add(mesh);
    });

    // 3) 불티 파티클
    const particleGeo = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];
    for (let i = 0; i < 800; i++) {
      const r = 5 + Math.random() * 25;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      );
      const c = new THREE.Color();
      c.setHSL(0.0 + Math.random() * 0.15, 1.0, 0.5);
      colors.push(c.r, c.g, c.b);
    }
    particleGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // 빛나는 점 텍스처 — 인라인 캔버스 데이터로 외부 의존 제거
    const sprite = makeDiscTexture();
    const particleMat = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      map: sprite,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 4) 조명
    scene.add(new THREE.AmbientLight(0x220000));
    const point = new THREE.PointLight(0xff0044, 2, 50);
    point.position.set(0, 0, 0);
    scene.add(point);

    let raf = 0;
    let running = true;
    const start = performance.now();

    const tick = () => {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      const t = (performance.now() - start) / 1000;

      scene.rotation.y = Math.sin(t * 0.1) * 0.3;
      scene.rotation.x = Math.cos(t * 0.1) * 0.1;

      core.rotation.y += 0.005;
      core.rotation.x += 0.003;
      wireframeCore.rotation.y -= 0.004;
      wireframeCore.rotation.x -= 0.002;

      const s = 1 + Math.sin(t * 2) * 0.05;
      core.scale.setScalar(s);
      wireframeCore.scale.setScalar(s);

      for (const r of rings) {
        r.mesh.rotation.x += r.sx;
        r.mesh.rotation.y += r.sy;
      }
      particles.rotation.y -= 0.002;
      particles.rotation.x += 0.001;

      renderer.render(scene, camera);
    };
    tick();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        tick();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      sprite.dispose();
      for (const r of rings) {
        (r.mesh.geometry as THREE.BufferGeometry).dispose();
        (r.mesh.material as THREE.Material).dispose();
      }
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        background: 'radial-gradient(ellipse at center, #150404 0%, #050000 70%)',
      }}
    />
  );
}

function makeDiscTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.4, 'rgba(255,200,200,0.7)');
  grad.addColorStop(1, 'rgba(255,80,80,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}
