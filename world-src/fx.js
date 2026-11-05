import * as THREE from 'three';
import { GLOW } from './props.js';
import { terrainHeight } from './terrain.js';

export function makeFire(x, y, z) {
    const g = new THREE.Group();
    g.position.set(x, y, z);

    const logMat = new THREE.MeshStandardMaterial({ color: 0x1a0f09, roughness: 0.9, emissive: 0xff3a08, emissiveIntensity: 0.1 });
    for (let i = 0; i < 5; i++) {
        const log = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.075, 0.85, 7), logMat);
        log.rotation.set(Math.PI / 2 - 0.35, 0, 0);
        log.rotation.order = 'YXZ';
        log.rotation.y = (i / 5) * Math.PI * 2;
        log.position.set(Math.sin(log.rotation.y) * 0.2, 0.28, Math.cos(log.rotation.y) * 0.2);
        log.castShadow = true;
        g.add(log);
    }

    const uniforms = { uTime: { value: 0 } };
    const mat = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        vertexShader: `
            varying vec2 vUv;
            void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `
            varying vec2 vUv;
            uniform float uTime;
            float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
            float noise(vec2 p) {
                vec2 i = floor(p), f = fract(p);
                f = f * f * (3.0 - 2.0 * f);
                return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
            }
            void main() {
                vec2 p = vUv;
                float n = noise(vec2(p.x * 4.0, p.y * 3.0 - uTime * 2.2)) * 0.6 + noise(vec2(p.x * 9.0, p.y * 7.0 - uTime * 3.6)) * 0.4;
                float width = pow(1.0 - p.y, 0.7) * 0.42 + 0.02;
                float body = 1.0 - smoothstep(width * 0.3, width, abs(p.x - 0.5 + (n - 0.5) * 0.3 * p.y));
                float heat = body * smoothstep(0.0, 0.08, p.y) * (1.0 - p.y * 0.75);
                heat = smoothstep(0.2, 0.95, heat * (0.5 + n * 0.9));
                vec3 color = mix(vec3(1.0, 0.12, 0.01), vec3(1.0, 0.62, 0.16), heat);
                color = mix(color, vec3(1.0, 0.86, 0.5), heat * heat * 0.55);
                gl_FragColor = vec4(color * heat * 0.95, heat);
            }`,
    });
    const flames = [];
    for (let i = 0; i < 3; i++) {
        const flame = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 1.35), mat);
        flame.position.y = 0.78;
        flame.rotation.y = (i / 3) * Math.PI;
        g.add(flame);
        flames.push(flame);
    }

    const light = new THREE.PointLight(0xff8a3c, 26, 16, 2);
    light.position.y = 1;
    g.add(light);

    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: 0xff7a2a, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false }));
    glow.position.y = 0.9;
    glow.scale.setScalar(4.5);
    g.add(glow);

    // Sparks drift up and recycle at the base.
    const count = 40;
    const spark = new Float32Array(count * 3);
    const life = new Float32Array(count).map(() => Math.random());
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(spark, 3));
    const sparks = new THREE.Points(sparkGeo, new THREE.PointsMaterial({ color: 0xff9a3a, size: 0.035, map: GLOW, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    sparks.frustumCulled = false;
    g.add(sparks);

    g.userData.update = (t, dt) => {
        uniforms.uTime.value = t;
        light.intensity = 24 + Math.sin(t * 11) * 3 + Math.sin(t * 23.7) * 2.5 + Math.sin(t * 5.3) * 3;
        for (let i = 0; i < count; i++) {
            life[i] += dt * (0.25 + (i % 5) * 0.06);
            if (life[i] > 1) life[i] = 0;
            const a = i * 12.9898;
            const rise = life[i];
            spark[i * 3] = Math.sin(a) * 0.3 + Math.sin(t * 2 + a) * 0.25 * rise;
            spark[i * 3 + 1] = 0.5 + rise * 3.6;
            spark[i * 3 + 2] = Math.cos(a) * 0.3 + Math.cos(t * 1.7 + a) * 0.25 * rise;
        }
        sparkGeo.attributes.position.needsUpdate = true;
    };
    return g;
}

export function makeFireflies(count) {
    const data = Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 60,
        z: (Math.random() - 0.3) * 60,
        h: 0.5 + Math.random() * 1.8,
        s: Math.random() * 10,
    }));
    const positions = new Float32Array(count * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color: 0xe6ff7a, size: 0.09, map: GLOW, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.9 });
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    points.userData.update = (t) => {
        data.forEach((f, i) => {
            const x = f.x + Math.sin(t * 0.3 + f.s) * 2.5;
            const z = f.z + Math.cos(t * 0.25 + f.s * 2) * 2.5;
            const pulse = Math.max(0, Math.sin(t * 1.3 + f.s * 3));
            positions[i * 3] = x;
            positions[i * 3 + 1] = terrainHeight(x, z) + f.h + Math.sin(t * 0.8 + f.s) * 0.3 - (pulse < 0.02 ? 50 : 0);
            positions[i * 3 + 2] = z;
        });
        geo.attributes.position.needsUpdate = true;
    };
    return points;
}

// A few golf balls on the green. Walk into one and it rolls.
export function makeBalls(spots, cup, onSink) {
    const g = new THREE.Group();
    const geo = new THREE.SphereGeometry(0.03, 20, 14);
    const mat = new THREE.MeshStandardMaterial({ color: 0xf6f4ee, roughness: 0.32 });
    const balls = spots.map(([x, z]) => {
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        g.add(mesh);
        return { mesh, x, z, vx: 0, vz: 0, sunk: false };
    });
    g.userData.update = (dt, player, speed) => {
        for (const b of balls) {
            if (b.sunk) continue;
            const dx = b.x - player.x;
            const dz = b.z - player.z;
            const d = Math.hypot(dx, dz);
            if (d < 0.42 && speed > 0.2) {
                b.vx = (dx / d) * (speed * 1.5 + 1);
                b.vz = (dz / d) * (speed * 1.5 + 1);
            }
            b.x += b.vx * dt;
            b.z += b.vz * dt;
            const drag = Math.exp(-1.15 * dt);
            b.vx *= drag;
            b.vz *= drag;
            const toCup = Math.hypot(b.x - cup.x, b.z - cup.z);
            if (toCup < 0.09 && Math.hypot(b.vx, b.vz) < 3.2) {
                b.sunk = true;
                b.mesh.visible = false;
                onSink();
            }
            b.mesh.position.set(b.x, terrainHeight(b.x, b.z) + 0.03, b.z);
        }
    };
    g.userData.update(0, { x: 999, z: 999 }, 0);
    return g;
}
