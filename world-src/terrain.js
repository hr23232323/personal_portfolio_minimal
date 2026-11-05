import * as THREE from 'three';

export const SIZE = 256;          // Mask and height textures cover this many meters.
export const WATER_Y = -0.75;
export const FLOOR_Y = 0.55;      // Cabin floor and porch deck.
export const CABIN = { x0: -4.5, x1: 4.5, z0: -9.5, z1: -2.5, deck: 0 };
export const GREEN = { x: -17, z: 9, rx: 10.5, rz: 8.5 };
export const CUP = { x: -15.5, z: 7.5 };
const POND = { x: 25, z: -20, rx: 17, rz: 11 };
const BUNKERS = [{ x: -27, z: 13, r: 3.8 }, { x: -9, z: 19, r: 3 }];
const FAIRWAY = [[14, 120], [12, 80], [4, 48], [-7, 28], [-14, 16]];
export const PATH = [[10, 42], [10.5, 30], [8, 18], [4, 8], [0, 2.4]];

const smooth = (a, b, x) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
};
const mix = (a, b, t) => a + (b - a) * t;

function distToLine(x, z, points) {
    let best = Infinity;
    for (let i = 0; i < points.length - 1; i++) {
        const [ax, az] = points[i];
        const [bx, bz] = points[i + 1];
        const dx = bx - ax, dz = bz - az;
        const t = Math.min(1, Math.max(0, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)));
        best = Math.min(best, Math.hypot(x - ax - dx * t, z - az - dz * t));
    }
    return best;
}
function distToCabin(x, z) {
    const dx = Math.max(CABIN.x0 - x, 0, x - CABIN.x1);
    const dz = Math.max(CABIN.z0 - z, 0, z - CABIN.deck);
    return Math.hypot(dx, dz);
}
const ellipse = (x, z, e) => Math.hypot((x - e.x) / e.rx, (z - e.z) / e.rz);
function pondDist(x, z) {
    const wobble = 1 + 0.16 * Math.sin(Math.atan2(z - POND.z, x - POND.x) * 3 + 1);
    return ellipse(x, z, POND) / wobble;
}

export function terrainHeight(x, z) {
    const r = Math.hypot(x, z);
    let h = 0.9 * Math.sin(x * 0.045 + 1.3) * Math.cos(z * 0.037)
        + 0.5 * Math.sin(x * 0.11 + z * 0.07)
        + 0.2 * Math.sin(x * 0.23 - z * 0.19);
    h -= smooth(90, 175, r) * 1.6;
    h = mix(h, 0, 1 - smooth(5, 14, distToCabin(x, z)));

    const green = ellipse(x, z, GREEN);
    const crown = 0.75 + 0.14 * Math.sin(x * 0.3 + 1) * Math.cos(z * 0.26);
    h = mix(h, crown, 1 - smooth(0.85, 1.7, green));

    for (const b of BUNKERS) {
        const d = Math.hypot(x - b.x, z - b.z) / b.r;
        h -= 0.8 * (1 - smooth(0.45, 1.05, d));
    }
    return mix(h, -2.4, 1 - smooth(0.55, 1.08, pondDist(x, z)));
}

export const onPath = (x, z) => distToLine(x, z, PATH) < 1;

export function isWater(x, z) {
    return terrainHeight(x, z) < WATER_Y + 0.12;
}

// One float height map and one RGBA mask: fairway, green, path, sand.
export function bakeMaps() {
    const n = 1024;
    const heights = new Float32Array(n * n * 4);
    const masks = new Uint8Array(n * n * 4);
    for (let j = 0; j < n; j++) {
        for (let i = 0; i < n; i++) {
            const x = ((i + 0.5) / n - 0.5) * SIZE;
            const z = ((j + 0.5) / n - 0.5) * SIZE;
            const k = (j * n + i) * 4;
            const h = terrainHeight(x, z);
            heights[k] = h;

            const width = 13 + 2 * Math.sin(z * 0.08);
            let fairway = 1 - smooth(width - 0.8, width + 0.8, distToLine(x, z, FAIRWAY));
            fairway = Math.max(fairway, 1 - smooth(5, 7, distToCabin(x, z)));
            fairway = Math.max(fairway, 1 - smooth(6.5, 8.5, Math.hypot(x - 11, z - 9)));
            fairway = Math.max(fairway, 1 - smooth(6, 8, Math.hypot(x - 11, z + 3)));
            fairway = Math.max(fairway, 1 - smooth(1.6, 3, distToLine(x, z, PATH)));
            const green = 1 - smooth(0.88, 0.93, ellipse(x, z, GREEN));
            const collar = 1 - smooth(0.93, 1.05, ellipse(x, z, GREEN));
            let path = 1 - smooth(0.65, 1.05, distToLine(x, z, PATH));
            path = Math.max(path, 1 - smooth(0.2, 1.4, distToCabin(x, z)));
            let sand = 0;
            for (const b of BUNKERS) sand = Math.max(sand, 1 - smooth(0.74, 0.84, Math.hypot(x - b.x, z - b.z) / b.r));
            sand = Math.max(sand, 1 - smooth(WATER_Y + 0.02, WATER_Y + 0.42, h));

            masks[k] = Math.max(fairway, collar * 0.75) * 255;
            masks[k + 1] = green * 255;
            masks[k + 2] = path * 255;
            masks[k + 3] = sand * 255;
        }
    }
    const heightTex = new THREE.DataTexture(heights, n, n, THREE.RGBAFormat, THREE.FloatType);
    const maskTex = new THREE.DataTexture(masks, n, n, THREE.RGBAFormat);
    maskTex.magFilter = THREE.LinearFilter;
    maskTex.minFilter = THREE.LinearFilter;
    heightTex.needsUpdate = true;
    maskTex.needsUpdate = true;
    return { heightTex, maskTex };
}

export function makeTerrain({ maskTex, grass, sand, gravel, pools }) {
    const span = 400;
    const seg = 400;
    const geo = new THREE.PlaneGeometry(span, span, seg, seg);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) pos.setY(i, terrainHeight(pos.getX(i), pos.getZ(i)));
    geo.computeVertexNormals();

    grass.normal.repeat.set(70, 70);
    const mat = new THREE.MeshStandardMaterial({
        map: grass.map,
        normalMap: grass.normal,
        normalScale: new THREE.Vector2(0.4, 0.4),
        transparent: true,
    });
    mat.onBeforeCompile = (shader) => {
        Object.assign(shader.uniforms, {
            uMask: { value: maskTex },
            uSand: { value: sand.map },
            uGravel: { value: gravel.map },
            uPools: { value: pools.map(([x, z]) => new THREE.Vector2(x, z)) },
        });
        shader.vertexShader = shader.vertexShader
            .replace('#include <common>', '#include <common>\nvarying vec3 vWPos;')
            .replace('#include <begin_vertex>', '#include <begin_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
        shader.fragmentShader = shader.fragmentShader
            .replace('#include <common>', `#include <common>
                varying vec3 vWPos;
                uniform sampler2D uMask, uSand, uGravel;
                uniform vec2 uPools[4];
                float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
                float noise(vec2 p) {
                    vec2 i = floor(p), f = fract(p);
                    f = f * f * (3.0 - 2.0 * f);
                    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
                }`)
            .replace('#include <map_fragment>', `
                vec2 w = vWPos.xz;
                vec4 m = texture2D(uMask, w / ${SIZE.toFixed(1)} + 0.5);
                float macro = noise(w * 0.05) * 0.6 + noise(w * 0.21) * 0.4;
                vec3 near = texture2D(map, w * 0.19).rgb;
                vec3 far = texture2D(map, w * 0.041 + 0.37).rgb;
                vec3 fine = texture2D(map, w * 0.83).rgb;
                vec3 grassCol = mix(mix(near, far, 0.55), fine, 0.3);

                vec3 roughCol = grassCol * mix(vec3(0.34, 0.6, 0.2), vec3(0.55, 0.72, 0.24), macro);
                float stripe = step(0.5, fract(dot(w, vec2(0.8, 0.6)) / 8.0));
                vec3 fairCol = grassCol * vec3(0.34, 0.74, 0.22) * (0.8 + 0.34 * stripe) * (0.9 + 0.2 * macro);
                float check = abs(step(0.5, fract(w.x / 3.0)) - step(0.5, fract(w.y / 3.0)));
                vec3 greenCol = vec3(0.075, 0.25, 0.05) * (0.9 + 0.18 * check) * (0.94 + 0.12 * noise(w * 6.0));

                vec3 col = mix(roughCol, fairCol, m.r);
                col = mix(col, greenCol, m.g);
                col = mix(col, texture2D(uGravel, w * 0.45).rgb * 0.6, m.b);
                col = mix(col, texture2D(uSand, w * 0.3).rgb * vec3(1.0, 0.96, 0.86), m.a);
                diffuseColor.rgb = col;
                diffuseColor.a = 1.0 - smoothstep(125.0, 190.0, length(w));`)
            .replace('#include <emissivemap_fragment>', `
                float pool = 0.0;
                for (int i = 0; i < 4; i++) {
                    float d = distance(w, uPools[i]);
                    pool += exp(-d * d * 0.16);
                }
                totalEmissiveRadiance += col * vec3(1.0, 0.56, 0.24) * pool * 0.9;`)
            .replace('#include <roughnessmap_fragment>', `
                float roughnessFactor = mix(0.95, 0.8, m.g);`);
    };
    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    return mesh;
}

export function makeWater() {
    const geo = new THREE.PlaneGeometry(70, 50);
    geo.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshStandardMaterial({ color: 0x0c1a22, roughness: 0.05, metalness: 0, envMapIntensity: 0.3 });
    const uniforms = { uTime: { value: 0 } };
    mat.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = uniforms.uTime;
        shader.vertexShader = shader.vertexShader
            .replace('#include <common>', '#include <common>\nvarying vec3 vWPos;')
            .replace('#include <begin_vertex>', '#include <begin_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
        shader.fragmentShader = shader.fragmentShader
            .replace('#include <common>', '#include <common>\nvarying vec3 vWPos;\nuniform float uTime;')
            .replace('#include <normal_fragment_maps>', `
                vec2 p = vWPos.xz;
                float t = uTime;
                vec2 ripple = vec2(
                    sin(p.x * 4.1 + t * 1.1) + sin(p.x * 9.3 + p.y * 7.1 - t * 1.7) * 0.5 + sin(p.y * 19.7 + t * 2.3) * 0.3,
                    cos(p.y * 5.7 - t * 0.9) + cos(p.y * 12.1 - p.x * 6.3 + t * 1.5) * 0.5 + cos(p.x * 23.3 - t * 2.1) * 0.3
                ) * 0.011;
                normal = normalize(normal + (viewMatrix * vec4(ripple.x, 0.0, ripple.y, 0.0)).xyz);`);
    };
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(POND.x, WATER_Y, POND.z);
    mesh.renderOrder = 1;
    mesh.userData.update = (t) => { uniforms.uTime.value = t; };
    return mesh;
}
