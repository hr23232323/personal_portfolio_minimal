import * as THREE from 'three';
import { CABIN, FLOOR_Y } from './terrain.js';

const { x0, x1, z0, z1 } = CABIN;
const RIDGE = { z: -6, y: 5.5 };
const FRONT_SLOPE = 0.38;   // Long saltbox slope running over the porch.
const BACK_SLOPE = 0.62;
const roofY = (z) => RIDGE.y - (z > RIDGE.z ? (z - RIDGE.z) * FRONT_SLOPE : (RIDGE.z - z) * BACK_SLOPE);

// A wall drawn as a flat shape, so holes are just rectangles cut out of it.
function wallShape(outline, holes = []) {
    const shape = new THREE.Shape(outline.map(([x, y]) => new THREE.Vector2(x, y)));
    for (const [hx0, hy0, hx1, hy1] of holes) {
        const hole = new THREE.Path();
        hole.moveTo(hx0, hy0);
        hole.lineTo(hx1, hy0);
        hole.lineTo(hx1, hy1);
        hole.lineTo(hx0, hy1);
        hole.closePath();
        shape.holes.push(hole);
    }
    return shape;
}
function slab(shape, depth, material) {
    const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
    const mesh = new THREE.Mesh(geo, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
}
function beam(w, h, d, material, x, y, z) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
}

export function makeCabin(tex) {
    const g = new THREE.Group();
    const siding = new THREE.MeshStandardMaterial({ ...tex.siding, color: 0xdfe6ea, envMapIntensity: 3 });
    const plaster = new THREE.MeshStandardMaterial({ ...tex.plaster, color: 0xd9c8ae, envMapIntensity: 0.12 });
    const floorMat = new THREE.MeshStandardMaterial({ ...tex.floor, envMapIntensity: 0.15 });
    const deckMat = new THREE.MeshStandardMaterial({ ...tex.deck, color: 0xb09a86 });
    const roofMat = new THREE.MeshStandardMaterial({ ...tex.roof, color: 0x77726c });
    const timber = new THREE.MeshStandardMaterial({ ...tex.timber, color: 0x8a6a4e, envMapIntensity: 0.15 });
    const stone = new THREE.MeshStandardMaterial({ ...tex.stone });
    const trim = new THREE.MeshStandardMaterial({ color: 0xe8e2d6, roughness: 0.6 });
    const doorPaint = new THREE.MeshStandardMaterial({ color: 0x1f4a3c, roughness: 0.45 });
    const glass = new THREE.MeshStandardMaterial({ color: 0xffd9a6, roughness: 0.42, metalness: 0.2, transparent: true, opacity: 0.16, envMapIntensity: 1.6 });

    const top = FLOOR_Y;
    const frontH = roofY(z1);
    const backH = roofY(z0);

    // Front and back walls. Coordinates are x along the wall, y up.
    const frontHoles = [[-3.7, 1.55, -2, 2.95], [-0.55, top, 0.55, 2.8], [1.5, 1.55, 3.5, 2.95]];
    const backHoles = [[-2.2, 1.45, 2.2, 3.0]];
    const frontOutline = [[x0, top - 0.5], [x1, top - 0.5], [x1, frontH], [x0, frontH]];
    const backOutline = [[x0, top - 0.5], [x1, top - 0.5], [x1, backH], [x0, backH]];

    const front = slab(wallShape(frontOutline, frontHoles), 0.1, siding);
    front.position.z = z1;
    const frontIn = slab(wallShape(frontOutline, frontHoles), 0.06, plaster);
    frontIn.position.z = z1 - 0.06;
    const back = slab(wallShape(backOutline, backHoles), 0.1, siding);
    back.position.z = z0 - 0.1;
    const backIn = slab(wallShape(backOutline, backHoles), 0.06, plaster);
    backIn.position.z = z0;
    g.add(front, frontIn, back, backIn);

    // Side walls follow the roofline. Local x runs along world z.
    const sideOutline = [[z0, top - 0.5], [z1, top - 0.5], [z1, frontH], [RIDGE.z, RIDGE.y], [z0, backH]];
    const sideHoles = [[-7.2, 1.55, -5.2, 2.95]];
    [[x0, -1], [x1, 1]].forEach(([x, dir]) => {
        const outer = slab(wallShape(sideOutline, sideHoles), 0.1, siding);
        outer.rotation.y = -Math.PI / 2;
        outer.position.x = x + (dir > 0 ? 0.1 : 0);
        const inner = slab(wallShape(sideOutline, sideHoles), 0.06, plaster);
        inner.rotation.y = -Math.PI / 2;
        inner.position.x = x + (dir > 0 ? 0 : 0.06);
        g.add(outer, inner);
    });

    // Windows and the door frame.
    const frame = (x, y, z, w, h, axis) => {
        const t = 0.07;
        const along = (len) => (axis === 'x' ? [len, t, 0.14] : [0.14, t, len]);
        const up = (len) => (axis === 'x' ? [t, len, 0.14] : [0.14, len, t]);
        const offset = (o) => (axis === 'x' ? [x + o, 0, z] : [x, 0, z + o]);
        g.add(beam(...along(w + t), trim, x, y + h / 2, z));
        g.add(beam(...along(w + t), trim, x, y - h / 2, z));
        [-w / 2, 0, w / 2].forEach((o) => {
            const [ox, , oz] = offset(o);
            g.add(beam(...up(h), trim, ox, y, oz));
        });
        g.add(beam(...along(w), trim, x, y, z));
        const pane = new THREE.Mesh(new THREE.BoxGeometry(...(axis === 'x' ? [w, h, 0.01] : [0.01, h, w])), glass);
        pane.position.set(x, y, z);
        g.add(pane);
    };
    frame(-2.85, 2.25, z1 + 0.02, 1.7, 1.4, 'x');
    frame(2.5, 2.25, z1 + 0.02, 2, 1.4, 'x');
    frame(0, 2.225, z0 - 0.02, 4.4, 1.55, 'x');
    frame(x0 - 0.02, 2.25, -6.2, 2, 1.4, 'z');
    frame(x1 + 0.02, 2.25, -6.2, 2, 1.4, 'z');

    g.add(beam(0.1, 2.3, 0.16, trim, -0.6, top + 1.13, z1 + 0.02));
    g.add(beam(0.1, 2.3, 0.16, trim, 0.6, top + 1.13, z1 + 0.02));
    g.add(beam(1.3, 0.1, 0.16, trim, 0, 2.83, z1 + 0.02));

    // The door stands open against the inside wall.
    const door = beam(1.06, 2.2, 0.05, doorPaint, 0, 0, 0);
    door.geometry.translate(0.53, 0, 0);
    door.position.set(-0.53, top + 1.11, z1 - 0.04);
    door.rotation.y = 2.95;
    g.add(door);

    // Floors.
    const inside = beam(x1 - x0, 0.1, z1 - z0, floorMat, 0, top - 0.05, (z0 + z1) / 2);
    const deck = beam(x1 - x0 + 0.5, 0.1, 2.6, deckMat, 0, top - 0.05, -1.25);
    g.add(inside, deck);
    [[x0 - 0.1, 0.05], [x1 + 0.1, 0.05]].forEach(([x]) => g.add(beam(0.16, 0.5, 2.6, timber, x, 0.25, -1.25)));
    g.add(beam(x1 - x0 + 0.5, 0.5, 0.12, timber, 0, 0.25, 0.04));

    // Steps down to the path.
    [[0.37, 0.4], [0.18, 0.8]].forEach(([y, z]) => g.add(beam(2.2, 0.08, 0.42, deckMat, 0, y, z)));
    [[-1.1], [1.1]].forEach(([x]) => g.add(beam(0.08, 0.5, 1.1, timber, x, 0.22, 0.5)));

    // Porch posts and railings, with a gap for the steps.
    const eave = 0.15;
    [-4.55, -1.1, 1.1, 4.55].forEach((x) => g.add(beam(0.16, roofY(eave) - top - 0.05, 0.16, timber, x, (roofY(eave) + top) / 2, eave - 0.2)));
    [[-2.82, 3.45], [2.82, 3.45]].forEach(([x, w]) => {
        g.add(beam(w, 0.07, 0.08, timber, x, top + 0.92, eave - 0.2));
        g.add(beam(w, 0.05, 0.05, timber, x, top + 0.3, eave - 0.2));
        for (let i = 0; i < 12; i++) g.add(beam(0.035, 0.62, 0.035, timber, x - w / 2 + (i + 0.5) * (w / 12), top + 0.61, eave - 0.2));
    });
    g.add(beam(9.4, 0.16, 0.16, timber, 0, roofY(eave) - 0.08, eave - 0.2));

    // Roof: two tilted slabs meeting at the ridge, plus rafters you see from inside.
    const roofSlab = (fromZ, toZ) => {
        const y0 = roofY(fromZ), y1 = roofY(toZ);
        const len = Math.hypot(toZ - fromZ, y1 - y0);
        const mesh = beam(x1 - x0 + 1, 0.14, len, roofMat, 0, (y0 + y1) / 2 + 0.1, (fromZ + toZ) / 2);
        mesh.rotation.x = Math.atan2(y1 - y0, fromZ - toZ);
        return mesh;
    };
    g.add(roofSlab(RIDGE.z, 0.55), roofSlab(z0 - 0.6, RIDGE.z));
    g.add(beam(x1 - x0 + 1.04, 0.1, 0.34, timber, 0, RIDGE.y + 0.2, RIDGE.z));

    const ceilingMat = new THREE.MeshStandardMaterial({ ...tex.timber, color: 0xb08a66, side: THREE.DoubleSide, envMapIntensity: 0.1 });
    [[RIDGE.z, z1 + 2.5], [z0 - 0.3, RIDGE.z]].forEach(([a, b]) => {
        const panel = roofSlab(a, b);
        panel.material = ceilingMat;
        panel.position.y -= 0.14;
        panel.castShadow = false;
        g.add(panel);
    });

    for (let x = x0 + 0.6; x < x1; x += 1.3) {
        [[RIDGE.z, z1], [z0, RIDGE.z]].forEach(([a, b]) => {
            const y0 = roofY(a), y1 = roofY(b);
            const len = Math.hypot(b - a, y1 - y0);
            const rafter = beam(0.12, 0.16, len, timber, x, (y0 + y1) / 2 - 0.1, (a + b) / 2);
            rafter.rotation.x = Math.atan2(y1 - y0, a - b);
            g.add(rafter);
        });
    }
    g.add(beam(x1 - x0, 0.2, 0.2, timber, 0, RIDGE.y - 0.22, RIDGE.z));
    g.add(beam(x1 - x0, 0.16, 0.16, timber, 0, 3.15, -6));

    // Stone chimney on the right.
    const chimney = beam(1, 6.4, 0.9, stone, 3.2, 3.2, -9.9);
    g.add(chimney);
    g.add(beam(1.14, 0.12, 1.04, stone, 3.2, 6.4, -9.9));

    return g;
}

// Solid things the player can't walk through: [minX, maxX, minZ, maxZ].
export const CABIN_WALLS = [
    [x0 - 0.15, x1 + 0.15, z0 - 0.15, z0 + 0.1],
    [x0 - 0.15, x0 + 0.1, z0, z1],
    [x1 - 0.1, x1 + 0.15, z0, z1],
    [x0 - 0.15, -0.55, z1 - 0.1, z1 + 0.15],
    [0.55, x1 + 0.15, z1 - 0.1, z1 + 0.15],
    [x0 - 0.3, -1.1, -0.15, 0.05],
    [1.1, x1 + 0.3, -0.15, 0.05],
    [x0 - 0.3, x0 - 0.1, z1, 0.05],
    [x1 + 0.1, x1 + 0.3, z1, 0.05],
];
