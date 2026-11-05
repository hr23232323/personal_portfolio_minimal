import * as THREE from 'three';
import { SIZE } from './terrain.js';

const RADIUS = 24;

// Blades live in a fixed tile that wraps around the player, so the ground
// always looks covered without storing a blade for every square meter.
export function makeGrass({ heightTex, maskTex, count }) {
    const rows = 3;
    const positions = [];
    const index = [];
    for (let i = 0; i <= rows; i++) {
        const t = i / rows;
        const w = 0.5 * (1 - t * t);
        positions.push(-w, t, 0, w, t, 0);
        if (i < rows) {
            const a = i * 2;
            index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
        }
    }
    const geo = new THREE.InstancedBufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(index);
    geo.instanceCount = count;

    const seed = new Float32Array(count * 4);
    for (let i = 0; i < count * 4; i++) seed[i] = Math.random();
    geo.setAttribute('seed', new THREE.InstancedBufferAttribute(seed, 4));

    const uniforms = {
        uTime: { value: 0 },
        uPlayer: { value: new THREE.Vector3() },
        uHeight: { value: heightTex },
        uMask: { value: maskTex },
    };
    const mat = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.75, envMapIntensity: 0.7 });
    mat.onBeforeCompile = (shader) => {
        Object.assign(shader.uniforms, uniforms);
        shader.vertexShader = shader.vertexShader
            .replace('#include <common>', `#include <common>
                attribute vec4 seed;
                uniform float uTime;
                uniform vec3 uPlayer;
                uniform sampler2D uHeight, uMask;
                varying float vTip;
                varying float vShort;
                varying vec3 vTint;`)
            .replace('#include <beginnormal_vertex>', 'vec3 objectNormal = normalize(vec3(0.15, 1.0, 0.25));')
            .replace('#include <begin_vertex>', `
                float R = ${RADIUS.toFixed(1)};
                vec2 base = mod(seed.xy * 2.0 * R - uPlayer.xz, 2.0 * R) - R + uPlayer.xz;
                vec2 tuv = base / ${SIZE.toFixed(1)} + 0.5;
                vec4 m = texture2D(uMask, tuv);
                float ground = texture2D(uHeight, tuv).r;
                float dist = length(base - uPlayer.xz);

                float tall = (1.0 - m.g) * (1.0 - m.b) * (1.0 - m.a);
                tall = step(0.45, tall) * (1.0 - smoothstep(0.1, 0.5, m.r));
                tall *= 1.0 - smoothstep(R * 0.72, R, dist);
                float height = (0.2 + seed.z * 0.26) * tall;
                float width = (0.011 + seed.w * 0.012) * step(0.02, tall) * (1.0 + dist * 0.11) * mix(1.0, 0.72, m.r);

                float angle = seed.w * 6.2832;
                vec3 across = vec3(cos(angle), 0.0, sin(angle));
                vec3 lean = vec3(-across.z, 0.0, across.x);
                float t = position.y;

                float gust = sin(base.x * 0.21 + uTime * 1.2) + sin(base.y * 0.17 - uTime * 0.8);
                float flutter = sin(uTime * 3.2 + seed.x * 20.0) * 0.12;
                vec3 bend = (lean * (seed.z - 0.5) * 0.5 + vec3(0.7, 0.0, 0.35) * (gust * 0.32 + flutter)) * t * t * height;

                vec2 away = base - uPlayer.xz;
                float push = 1.0 - smoothstep(0.0, 0.8, length(away));
                bend.xz += normalize(away + 0.001) * push * t * height * 0.9;

                vec3 transformed = vec3(base.x, ground, base.y)
                    + across * position.x * width
                    + vec3(0.0, t * height, 0.0)
                    + bend;
                vTip = t;
                vShort = smoothstep(0.1, 0.5, m.r);
                vTint = mix(vec3(0.16, 0.3, 0.07), vec3(0.36, 0.44, 0.13), seed.z);`);
        shader.fragmentShader = shader.fragmentShader
            .replace('#include <common>', '#include <common>\nvarying float vTip;\nvarying float vShort;\nvarying vec3 vTint;')
            .replace('#include <color_fragment>', `
                diffuseColor.rgb = mix(mix(vTint * 0.42, vTint * 1.5, vTip), vTint * vec3(0.62, 0.86, 0.5), vShort);`);
    };

    const mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false;
    mesh.receiveShadow = true;
    mesh.userData.update = (t, player) => {
        uniforms.uTime.value = t;
        uniforms.uPlayer.value.copy(player);
    };
    return mesh;
}
