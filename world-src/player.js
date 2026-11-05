import * as THREE from 'three';
import { CABIN, FLOOR_Y, isWater, terrainHeight } from './terrain.js';
import { CABIN_WALLS } from './building.js';

const EYE = 1.68;
const WALK = 3.4;
const RUN = 6.6;
const RADIUS = 0.32;
const LIMIT = 92;

// Furniture and other solid things: [x, z, radius].
const CIRCLES = [
    [11, 9, 1.05], [9.5, -3, 1.55], [12.4, -4.3, 0.42], [13.1, -3.2, 0.42],
    [0.7, -5.3, 0.62], [3.1, -4.3, 0.6], [-3.1, -7.2, 0.55], [-3.85, -8.85, 0.4], [3.85, -8.5, 0.55],
    [0.1, -7.9, 0.24], [7.4, 33.5, 0.2], [-15.5, 7.5, 0.06], [15, -1, 0.1], [15.5, 7.5, 0.1], [6.2, 8, 0.1],
    [11.8, 33, 0.1], [11.5, 25, 0.1], [9.7, 16.5, 0.1], [6.4, 9.2, 0.1],
    [-31, 10, 1.2], [-14, 24, 1], [20, 26, 1.4], [3.6, -1.9, 0.44],
];
const BOXES = [
    ...CABIN_WALLS,
    [-4.5, -3.8, -4.65, -3.2],   // Bookshelf.
    [-1.3, 1.3, -9.4, -8.5],     // Desk.
];

export function floorAt(x, z) {
    if (x > CABIN.x0 - 0.3 && x < CABIN.x1 + 0.3 && z > CABIN.z0 && z < 0.05) return FLOOR_Y;
    if (Math.abs(x) < 1.1 && z >= 0.05 && z < 1.05) return z < 0.6 ? 0.37 : 0.18;
    return terrainHeight(x, z);
}

function resolve(p) {
    for (const [cx, cz, r] of CIRCLES) {
        const dx = p.x - cx, dz = p.z - cz;
        const d = Math.hypot(dx, dz);
        const reach = r + RADIUS;
        if (d < reach && d > 0) {
            p.x = cx + (dx / d) * reach;
            p.z = cz + (dz / d) * reach;
        }
    }
    for (const [x0, x1, z0, z1] of BOXES) {
        const nx = Math.max(x0, Math.min(p.x, x1));
        const nz = Math.max(z0, Math.min(p.z, z1));
        const dx = p.x - nx, dz = p.z - nz;
        const d = Math.hypot(dx, dz);
        if (d >= RADIUS) continue;
        if (d > 0) {
            p.x = nx + (dx / d) * RADIUS;
            p.z = nz + (dz / d) * RADIUS;
        } else {
            const left = p.x - x0, right = x1 - p.x, back = p.z - z0, front = z1 - p.z;
            const min = Math.min(left, right, back, front);
            if (min === left) p.x = x0 - RADIUS;
            else if (min === right) p.x = x1 + RADIUS;
            else if (min === back) p.z = z0 - RADIUS;
            else p.z = z1 + RADIUS;
        }
    }
    const r = Math.hypot(p.x, p.z);
    if (r > LIMIT) {
        p.x *= LIMIT / r;
        p.z *= LIMIT / r;
    }
}

export function createPlayer(camera, dom, { onStep }) {
    const pos = new THREE.Vector3(9.2, 0, 31);
    const vel = new THREE.Vector2();
    const keys = new Set();
    const stick = { x: 0, y: 0 };
    let yaw = 0.25, pitch = -0.02;
    let eyeY = floorAt(pos.x, pos.z) + EYE;
    let bob = 0, stride = 0;
    let active = false;
    let dragging = false;
    let lastX = 0, lastY = 0;

    const look = (dx, dy, scale = 0.0021) => {
        yaw -= dx * scale;
        pitch = THREE.MathUtils.clamp(pitch - dy * scale, -1.35, 1.35);
    };

    addEventListener('keydown', (e) => {
        if (e.repeat) return;
        keys.add(e.code);
    });
    addEventListener('keyup', (e) => keys.delete(e.code));
    addEventListener('blur', () => keys.clear());

    document.addEventListener('mousemove', (e) => {
        if (active && document.pointerLockElement === dom) look(e.movementX, e.movementY);
    });

    // Drag to look works everywhere, so walking never depends on pointer lock.
    dom.addEventListener('pointerdown', (e) => {
        if (!active) return;
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
    });
    addEventListener('pointermove', (e) => {
        if (!active || !dragging || document.pointerLockElement === dom) return;
        look(e.clientX - lastX, e.clientY - lastY, 0.0042);
        lastX = e.clientX;
        lastY = e.clientY;
    });
    addEventListener('pointerup', () => { dragging = false; });

    function update(dt) {
        if (!active) return 0;
        let mx = stick.x, mz = stick.y;
        if (keys.has('KeyW') || keys.has('ArrowUp')) mz -= 1;
        if (keys.has('KeyS') || keys.has('ArrowDown')) mz += 1;
        if (keys.has('KeyA') || keys.has('ArrowLeft')) mx -= 1;
        if (keys.has('KeyD') || keys.has('ArrowRight')) mx += 1;
        const len = Math.hypot(mx, mz);
        if (len > 1) { mx /= len; mz /= len; }

        const running = keys.has('ShiftLeft') || keys.has('ShiftRight');
        const speed = running ? RUN : WALK;
        const sin = Math.sin(yaw), cos = Math.cos(yaw);
        const tx = (mx * cos + mz * sin) * speed;
        const tz = (-mx * sin + mz * cos) * speed;
        const ease = 1 - Math.exp(-dt * 9);
        vel.x += (tx - vel.x) * ease;
        vel.y += (tz - vel.y) * ease;

        const nx = pos.x + vel.x * dt;
        const nz = pos.z + vel.y * dt;
        const next = { x: nx, z: nz };
        resolve(next);
        if (!isWater(next.x, next.z)) {
            pos.x = next.x;
            pos.z = next.z;
        }

        const moved = vel.length();
        stride += moved * dt;
        if (stride > 1.75) {
            stride = 0;
            onStep(pos.x, pos.z, running);
        }
        bob += moved * dt * 3.6;
        const target = floorAt(pos.x, pos.z) + EYE + Math.sin(bob) * 0.022 * Math.min(1, moved / WALK);
        eyeY += (target - eyeY) * (1 - Math.exp(-dt * 14));
        pos.y = eyeY;

        camera.position.copy(pos);
        camera.rotation.set(pitch, yaw, 0, 'YXZ');
        return moved;
    }

    return {
        pos,
        vel,
        update,
        stick,
        get active() { return active; },
        set active(v) {
            active = v;
            if (!v) {
                vel.set(0, 0);
                keys.clear();
            }
        },
        lock() {
            if (matchMedia('(pointer: coarse)').matches) return;
            const request = dom.requestPointerLock?.();
            request?.catch?.(() => {});
        },
        unlock() {
            if (document.pointerLockElement) document.exitPointerLock();
        },
        place(x, z, faceX, faceZ) {
            pos.x = x;
            pos.z = z;
            eyeY = floorAt(x, z) + EYE;
            pos.y = eyeY;
            yaw = Math.atan2(x - faceX, z - faceZ);
            pitch = -0.1;
        },
        pose() {
            camera.position.copy(pos);
            camera.position.y = floorAt(pos.x, pos.z) + EYE;
            camera.rotation.set(pitch, yaw, 0, 'YXZ');
        },
        restPose() {
            const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ'));
            return { position: new THREE.Vector3(pos.x, floorAt(pos.x, pos.z) + EYE, pos.z), quaternion: q };
        },
    };
}
