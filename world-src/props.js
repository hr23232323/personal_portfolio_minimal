import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { CUP, FLOOR_Y, terrainHeight } from './terrain.js';

const NAMES = `american_football treasure_chest wine_bottles_01 wine_barrel_01 brass_goblets portable_cassette_player
korean_public_payphone_01 wooden_bookshelf_worn classic_laptop desk_lamp_arm_01 potted_plant_01
mid_century_lounge_chair WoodenTable_03 WoodenTable_01 wooden_picnic_table stone_fire_pit painted_wooden_bench
rubber_duck_toy wall_clock dartboard wooden_lantern_01 hanging_industrial_lamp shrub_02 fern_02
rock_moss_set_01 rock_moss_set_02 boulder_01 wooden_crate_01 wicker_basket_01 throw_pillows_01 ArmChair_01
hanging_picture_frame_01 office_notepads tea_set_01 wooden_stool_01`.split(/\s+/);

const models = {};

export async function loadModels(manager, folder) {
    const loader = new GLTFLoader(manager).setMeshoptDecoder(MeshoptDecoder);
    await Promise.all(NAMES.map(async (name) => {
        models[name] = (await loader.loadAsync(`${folder}/${name}.glb`)).scene;
    }));
}

// Places a clone of a model. Models sit on `y` regardless of where their origin is.
function put(parent, name, { x = 0, y = 0, z = 0, ry = 0, rx = 0, rz = 0, height, scale = 1, inside = false, shadow = true }) {
    const obj = models[name].clone(true);
    const holder = new THREE.Group();
    holder.add(obj);
    obj.rotation.set(rx, 0, rz);
    obj.updateMatrixWorld(true);
    let box = new THREE.Box3().setFromObject(obj);
    const s = height ? height / (box.max.y - box.min.y) : scale;
    obj.scale.multiplyScalar(s);
    obj.updateMatrixWorld(true);
    box = new THREE.Box3().setFromObject(obj);
    obj.position.y -= box.min.y;
    holder.position.set(x, y, z);
    holder.rotation.y = ry;
    obj.traverse((o) => {
        if (!o.isMesh) return;
        o.castShadow = shadow;
        o.receiveShadow = true;
        if (inside) o.material.envMapIntensity = 0.18;
    });
    parent.add(holder);
    holder.updateMatrixWorld(true);
    holder.userData.top = new THREE.Box3().setFromObject(holder).max.y;
    return holder;
}

function glowTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.25, 'rgba(255,255,255,.35)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
}
export const GLOW = glowTexture();

function halo(parent, x, y, z, size, color = 0xffb066, opacity = 0.55) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false }));
    s.position.set(x, y, z);
    s.scale.setScalar(size);
    parent.add(s);
    return s;
}

export const POST_SPOTS = [[11.8, 33], [11.5, 25], [9.7, 16.5], [6.4, 9.2]];

function painted(color, roughness = 0.5, metalness = 0) {
    return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}
function shadowed(mesh) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
}

function canvasTexture(w, h, draw) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
}

function makeMailbox(tex) {
    const g = new THREE.Group();
    const post = shadowed(new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.15, 0.1), new THREE.MeshStandardMaterial({ ...tex.timber, color: 0xa8896a })));
    post.position.y = 0.57;
    g.add(post);

    const arch = new THREE.Shape();
    arch.moveTo(-0.12, 0);
    arch.lineTo(0.12, 0);
    arch.lineTo(0.12, 0.12);
    arch.absarc(0, 0.12, 0.12, 0, Math.PI, false);
    arch.closePath();
    const paint = painted(0x1d3a5a, 0.38, 0.55);
    const body = shadowed(new THREE.Mesh(new THREE.ExtrudeGeometry(arch, { depth: 0.46, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 2, curveSegments: 20 }), paint));
    body.position.set(0, 1.15, -0.23);
    g.add(body);

    const mailFlag = new THREE.Group();
    mailFlag.name = 'flag';
    mailFlag.position.set(0.135, 1.24, -0.05);
    const flagArm = shadowed(new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.2, 0.03), painted(0xc8382d, 0.4)));
    flagArm.position.y = 0.1;
    const flagTop = shadowed(new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.07, 0.1), painted(0xc8382d, 0.4)));
    flagTop.position.set(0, 0.19, 0.035);
    mailFlag.add(flagArm, flagTop);
    mailFlag.rotation.order = 'ZYX';
    g.add(mailFlag);

    const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.09), new THREE.MeshStandardMaterial({
        roughness: 0.5,
        map: canvasTexture(256, 112, (ctx, w, h) => {
            ctx.fillStyle = '#e9e2d2';
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = '#1d3a5a';
            ctx.font = '700 44px "Bricolage Grotesque", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('H. Rana', w / 2, h / 2 + 3);
        }),
    }));
    plate.rotation.y = Math.PI / 2;
    plate.position.set(0.126, 1.22, 0.1);
    g.add(plate);
    return g;
}

function makeFlag() {
    const g = new THREE.Group();
    const cup = new THREE.Mesh(new THREE.CircleGeometry(0.075, 28), new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 1 }));
    cup.rotation.x = -Math.PI / 2;
    cup.position.y = 0.012;
    const rim = new THREE.Mesh(new THREE.RingGeometry(0.072, 0.082, 28), painted(0xe8e8e8, 0.5));
    rim.rotation.x = -Math.PI / 2;
    rim.position.y = 0.013;
    const pole = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.011, 2.2, 10), painted(0xf1efe9, 0.35)));
    pole.position.y = 1.1;

    const cloth = new THREE.PlaneGeometry(0.62, 0.42, 18, 8);
    cloth.translate(0.31, 0, 0);
    const clothMat = new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        roughness: 0.75,
        map: canvasTexture(512, 340, (ctx, w, h) => {
            ctx.fillStyle = '#c8322b';
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = '#fff6e8';
            ctx.font = '700 230px "Bricolage Grotesque", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('19', w / 2, h / 2 + 14);
        }),
    });
    const flag = shadowed(new THREE.Mesh(cloth, clothMat));
    flag.position.y = 1.98;
    g.add(cup, rim, pole, flag);

    const rest = cloth.attributes.position.array.slice();
    g.userData.update = (t) => {
        const p = cloth.attributes.position;
        for (let i = 0; i < p.count; i++) {
            const x = rest[i * 3];
            const y = rest[i * 3 + 1];
            const amp = x * 0.32;
            p.setZ(i, Math.sin(x * 9 - t * 5 + y * 2) * amp * 0.45 + Math.sin(x * 17 - t * 8) * amp * 0.12);
            p.setY(i, y - x * x * 0.22 + Math.sin(x * 7 - t * 4) * amp * 0.08);
        }
        p.needsUpdate = true;
        cloth.computeVertexNormals();
    };
    return g;
}

function makeSign(tex) {
    const g = new THREE.Group();
    let signFace;
    const board = shadowed(new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.42, 0.05), [
        ...Array(4).fill(new THREE.MeshStandardMaterial({ ...tex.timber })),
        new THREE.MeshStandardMaterial({
            roughness: 0.6,
            map: signFace = canvasTexture(1024, 256, (ctx, w, h) => {
                ctx.fillStyle = '#2a4a3c';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = '#d9c9a0';
                ctx.lineWidth = 6;
                ctx.strokeRect(14, 14, w - 28, h - 28);
                ctx.fillStyle = '#efe3c4';
                ctx.font = '700 118px "Bricolage Grotesque", sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Harsh’s corner', w / 2, h / 2 + 6);
            }),
        }),
        new THREE.MeshStandardMaterial({ ...tex.timber }),
    ]));
    board.material[4].emissive.set(0xffffff);
    board.material[4].emissiveMap = signFace;
    board.material[4].emissiveIntensity = 0.32;
    g.add(board);
    [-0.6, 0.6].forEach((x) => {
        const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.28), painted(0x333333, 0.5, 0.8));
        chain.position.set(x, 0.34, 0);
        g.add(chain);
    });
    return g;
}

function makeRug() {
    const mat = new THREE.MeshStandardMaterial({
        roughness: 1,
        envMapIntensity: 0.1,
        map: canvasTexture(1024, 700, (ctx, w, h) => {
            ctx.fillStyle = '#6b2a2a';
            ctx.fillRect(0, 0, w, h);
            const bands = ['#c9a86a', '#20383a', '#c9a86a', '#8c4a35'];
            bands.forEach((color, i) => {
                ctx.strokeStyle = color;
                ctx.lineWidth = 16;
                const o = 34 + i * 40;
                ctx.strokeRect(o, o, w - o * 2, h - o * 2);
            });
            ctx.fillStyle = '#20383a';
            for (let i = 0; i < 7; i++) {
                ctx.save();
                ctx.translate(232 + i * 93, h / 2);
                ctx.rotate(Math.PI / 4);
                ctx.fillRect(-34, -34, 68, 68);
                ctx.fillStyle = '#c9a86a';
                ctx.fillRect(-14, -14, 28, 28);
                ctx.restore();
                ctx.fillStyle = '#20383a';
            }
            for (let i = 0; i < 9000; i++) {
                ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '255,235,200' : '0,0,0'},.05)`;
                ctx.fillRect(Math.random() * w, Math.random() * h, 3, 2);
            }
        }),
    });
    const rug = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.012, 2.9), mat);
    rug.receiveShadow = true;
    return rug;
}

// Trees are camera-facing cards of real renders. Fine at a distance, and at dusk they read as silhouettes.
export function makeTrees(textures) {
    const g = new THREE.Group();
    const spots = [
        [-14, -22, 15, 0], [-30, -20, 19, 1], [-48, -8, 17, 2], [-58, 18, 20, 0], [-40, 40, 16, 3],
        [-70, 44, 19, 1], [14, -30, 13, 3], [-4, -40, 18, 2], [38, 22, 16, 0], [52, 6, 19, 2],
        [60, 34, 17, 1], [46, 56, 20, 3], [-24, 62, 18, 2], [30, 74, 19, 0], [-58, 76, 21, 1],
        [76, 62, 20, 2], [64, -34, 19, 3], [-76, -24, 22, 0], [8, -66, 24, 1], [-34, -62, 21, 3], [42, -60, 22, 2],
    ];
    const cards = [];
    for (const [x, z, height, kind] of spots) {
        const t = textures[kind];
        const aspect = t.image.width / t.image.height;
        const geo = new THREE.PlaneGeometry(height * aspect, height);
        geo.translate(0, height * 0.43, 0);
        const mat = new THREE.MeshStandardMaterial({ map: t, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 1, envMapIntensity: 1.1, color: 0xc4cab0 });
        const card = new THREE.Mesh(geo, mat);
        card.position.set(x, terrainHeight(x, z), z);
        card.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: t, alphaTest: 0.45 });
        card.castShadow = true;
        g.add(card);
        cards.push(card);
    }
    g.userData.update = (t, player) => {
        for (const card of cards) {
            card.rotation.y = Math.atan2(player.x - card.position.x, player.z - card.position.z);
            card.rotation.z = Math.sin(t * 0.7 + card.position.x) * 0.006;
        }
    };
    return g;
}

function makeStringLights(parent, anchors) {
    const bulbs = [];
    const wire = [];
    for (let i = 0; i < anchors.length - 1; i++) {
        const a = new THREE.Vector3(...anchors[i]);
        const b = new THREE.Vector3(...anchors[i + 1]);
        const steps = Math.round(a.distanceTo(b) / 0.7);
        for (let s = 0; s <= steps; s++) {
            const t = s / steps;
            const p = a.clone().lerp(b, t);
            p.y -= Math.sin(t * Math.PI) * 0.55;
            wire.push(p);
            if (s < steps) bulbs.push(p.clone().add(new THREE.Vector3(0, -0.07, 0)));
        }
    }
    const curve = new THREE.CatmullRomCurve3(wire);
    parent.add(new THREE.Mesh(new THREE.TubeGeometry(curve, wire.length * 3, 0.006, 5), painted(0x151515, 0.8)));
    const bulbMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffb36b, emissiveIntensity: 9 });
    const inst = new THREE.InstancedMesh(new THREE.SphereGeometry(0.038, 10, 8), bulbMat, bulbs.length);
    const m = new THREE.Matrix4();
    bulbs.forEach((p, i) => {
        inst.setMatrixAt(i, m.setPosition(p));
        halo(parent, p.x, p.y, p.z, 0.5, 0xffb36b, 0.28);
    });
    parent.add(inst);
}

// The essays sit on the shelf at eye level as real spines. Everything else is filler.
const ESSAYS = [
    ['Software Is Multiplying. Users Aren’t.', '#d96a51', '#171815'],
    ['AI Made Everyone Look High-Agency', '#d9b34b', '#171815'],
    ['AI Gave Me More Capacity', '#315b4a', '#f7f0df'],
    ['Be More Strategic', '#4969aa', '#f7f0df'],
    ['Never the Same Mistake Twice', '#e8dfc9', '#171815'],
    ['Try Harder', '#8c2f39', '#f7f0df'],
    ['The Age of Agents', '#2a2a30', '#e8dfc9'],
];

function spineTexture(title, cloth, ink) {
    return canvasTexture(512, 76, (ctx, w, h) => {
        ctx.fillStyle = cloth;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = ink;
        ctx.fillRect(14, 0, 3, h);
        ctx.fillRect(w - 17, 0, 3, h);
        ctx.font = '600 30px "Libre Caslon Text", serif';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, 30, h / 2 + 2, w - 66);
    });
}

function shelfLevels(shelf) {
    const ray = new THREE.Raycaster(new THREE.Vector3(-4.12, 4, -3.92), new THREE.Vector3(0, -1, 0));
    const levels = [];
    for (const hit of ray.intersectObject(shelf, true)) {
        if (!levels.some((y) => Math.abs(y - hit.point.y) < 0.08)) levels.push(hit.point.y);
    }
    return levels.sort((a, b) => a - b);
}

function fillShelf(world, levels) {
    const essayBooks = [];
    const eye = levels.reduce((best, y) => (Math.abs(y - 1.7) < Math.abs(best - 1.7) ? y : best));
    const cloth = [0x6b2a2a, 0x2c4a3e, 0x8a6a3a, 0x33415c, 0x7a7466, 0x4a3524, 0xa58a5c];
    const castBook = (mesh) => {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        world.add(mesh);
    };
    levels.forEach((y, row) => {
        if (y > 2.6) return;
        const essays = y === eye;
        let z = essays ? -4.14 : -4.5;
        const count = essays ? ESSAYS.length : 12 + (row % 3) * 3;
        for (let i = 0; i < count; i++) {
            const h = essays ? 0.3 : 0.2 + ((i * 7 + row * 3) % 5) * 0.022;
            const t = essays ? 0.06 : 0.028 + ((i * 3 + row) % 4) * 0.009;
            if (z + t > -3.33) break;
            if (!essays && (i + row) % 7 === 6) {
                z += 0.14;
                continue;
            }
            let side = new THREE.MeshStandardMaterial({ color: cloth[(i + row * 2) % cloth.length], roughness: 0.75, envMapIntensity: 0.18 });
            const materials = Array(6).fill(side);
            if (essays) {
                const [title, color, ink] = ESSAYS[i];
                side = new THREE.MeshStandardMaterial({ color, roughness: 0.7, envMapIntensity: 0.18 });
                materials.fill(side);
                const spine = spineTexture(title, color, ink);
                spine.center.set(0.5, 0.5);
                spine.rotation = -Math.PI / 2;
                materials[0] = new THREE.MeshStandardMaterial({ map: spine, roughness: 0.65, envMapIntensity: 0.18 });
            }
            const book = new THREE.Mesh(new THREE.BoxGeometry(0.2, h, t), materials);
            book.position.set(-4.04, y + h / 2 + 0.004, z + t / 2);
            castBook(book);
            if (essays) essayBooks.push(book);
            z += t + 0.003;
        }
    });
    return essayBooks;
}

function hangCover(world, loader, file, x, y, z, ry, w, h) {
    const map = loader.load(`/img/musings/covers/${file}.webp`);
    map.colorSpace = THREE.SRGBColorSpace;
    const art = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map, roughness: 0.55, envMapIntensity: 0.15 }));
    art.position.set(x, y, z);
    art.rotation.y = ry;
    world.add(art);
}

function makeScreen() {
    const map = canvasTexture(512, 400, (ctx, w, h) => {
        ctx.fillStyle = '#10201a';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#8ff0b0';
        ctx.font = '500 30px "Barlow Condensed", sans-serif';
        ['harsh@corner ~ % now', '', 'Leading AI at Clasp.', 'Turning repetitive workflows', 'into tools the team uses', 'every day.', '', '_'].forEach((line, i) => ctx.fillText(line, 28, 52 + i * 42));
    });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.335, 0.262), new THREE.MeshBasicMaterial({ map }));
    screen.position.set(0, 0.292, -0.142);
    screen.rotation.x = -0.1;
    return screen;
}

export function buildProps(scene, tex, loader) {
    const world = new THREE.Group();
    scene.add(world);
    const F = FLOOR_Y;
    const ground = (x, z) => terrainHeight(x, z);
    const place = (name, o) => put(world, name, o);

    // Inside the shack.
    const bookshelf = place('wooden_bookshelf_worn', { x: -4.1, y: F, z: -3.92, ry: Math.PI / 2, inside: true });
    bookshelf.updateMatrixWorld(true);
    const essayBooks = fillShelf(world, shelfLevels(bookshelf));
    place('WoodenTable_03', { x: -0.8, y: F, z: -8.95, height: 0.73, inside: true });
    const deskMat = new THREE.MeshStandardMaterial({ ...tex.timber, color: 0xb98a5e, envMapIntensity: 0.18 });
    const deskSlab = shadowed(new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.05, 0.86), deskMat));
    deskSlab.position.set(0, F + 0.755, -8.95);
    world.add(deskSlab);
    [[1.2, -9.3], [1.2, -8.6]].forEach(([x, z]) => {
        const leg = shadowed(new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.73, 0.07), deskMat));
        leg.position.set(x, F + 0.365, z);
        world.add(leg);
    });
    const deskTop = F + 0.78;
    const computer = place('classic_laptop', { x: 0.1, y: deskTop, z: -9.0, ry: 0, inside: true });
    computer.add(makeScreen());
    place('desk_lamp_arm_01', { x: -1.0, y: deskTop, z: -9.1, ry: 0.5, inside: true });
    place('office_notepads', { x: 0.75, y: deskTop + 0.006, z: -8.85, ry: -0.25, inside: true });
    place('rubber_duck_toy', { x: -0.55, y: deskTop, z: -8.72, ry: 0.5, height: 0.09, inside: true });
    place('wooden_stool_01', { x: 0.1, y: F, z: -7.9, inside: true });

    const chest = place('treasure_chest', { x: 3.85, y: F, z: -8.5, ry: -Math.PI / 2, inside: true });
    let chestLid;
    chest.traverse((o) => { if (o.name === 'treasure_chest_lid') chestLid = o; });
    const lidRest = chestLid.rotation.x;
    const gold = new THREE.PointLight(0xffc35a, 0, 2.6, 2);
    gold.position.set(3.6, F + 0.6, -8.5);
    world.add(gold);
    place('potted_plant_01', { x: -3.85, y: F, z: -8.85, inside: true });
    place('ArmChair_01', { x: -3.1, y: F, z: -7.2, ry: 0.9, inside: true });
    place('throw_pillows_01', { x: -3.05, y: F + 0.42, z: -7.1, ry: 0.9, scale: 0.8, inside: true, shadow: false });

    const rug = makeRug();
    rug.position.set(0.6, F + 0.008, -5.3);
    world.add(rug);
    const table = place('WoodenTable_01', { x: 0.7, y: F, z: -5.3, height: 0.42, inside: true });
    place('portable_cassette_player', { x: 0.3, y: table.userData.top, z: -5.28, ry: 0.35, height: 0.16, inside: true });
    place('tea_set_01', { x: 1.15, y: table.userData.top, z: -5.3, scale: 0.9, inside: true });
    place('mid_century_lounge_chair', { x: 3.1, y: F, z: -4.3, ry: -2.2, inside: true });
    place('wicker_basket_01', { x: 3.9, y: F, z: -3.1, inside: true, scale: 1.4 });

    const fixed = (name, x, y, z, ry, o = {}) => {
        const h = put(world, name, { x, y, z, ry, inside: true, ...o });
        h.children[0].position.y = 0;
        return h;
    };
    fixed('dartboard', 4.37, 2.1, -3.8, -Math.PI / 2);
    fixed('wall_clock', -3.3, 2.5, -9.42, 0);
    fixed('hanging_picture_frame_01', 3.35, 2.15, -9.42, 0);
    hangCover(world, loader, 'capacity-cover', 3.35, 2.15, -9.395, 0, 0.5, 0.72);
    fixed('hanging_picture_frame_01', -4.42, 2.1, -8.35, Math.PI / 2, { scale: 0.7 });
    hangCover(world, loader, 'strategy-cover', -4.395, 2.1, -8.35, Math.PI / 2, 0.35, 0.505);

    [[-2.2, -5.5], [2.2, -5.5]].forEach(([x, z]) => {
        const lamp = place('hanging_industrial_lamp', { x, y: 3.55, z, height: 1.1, inside: true, shadow: false });
        lamp.traverse((o) => { if (o.isMesh) o.castShadow = false; });
    });

    // Porch.
    const phone = place('korean_public_payphone_01', { x: -1.3, y: F + 0.95, z: -2.34, height: 0.66 });
    const sign = makeSign(tex);
    sign.position.set(0, 3.0, 0.02);
    world.add(sign);
    place('wooden_crate_01', { x: 3.6, y: F, z: -1.9, ry: 0.3 });
    place('fern_02', { x: 3.6, y: F + 0.34, z: -1.9, scale: 0.7, shadow: false });

    // Fire pit and benches.
    const pit = { x: 11, z: 9 };
    place('stone_fire_pit', { x: pit.x, y: ground(pit.x, pit.z) - 0.03, z: pit.z, scale: 1.05 });
    [[0.9, 2.5], [2.5, 2.5], [4.1, 2.5]].forEach(([a, d]) => {
        const x = pit.x + Math.cos(a) * d;
        const z = pit.z + Math.sin(a) * d;
        place('painted_wooden_bench', { x, y: ground(x, z), z, ry: Math.PI / 2 - a + Math.PI });
    });
    const benchX = pit.x + Math.cos(2.5) * 2.5;
    const benchZ = pit.z + Math.sin(2.5) * 2.5;
    const football = place('american_football', { x: benchX + 0.2, y: ground(benchX, benchZ) + 0.47, z: benchZ - 0.15, ry: 0.6, rz: 0.15 });
    const footballY = football.position.y;

    // Picnic table with wine.
    const pic = { x: 9.5, z: -3 };
    const picnic = place('wooden_picnic_table', { x: pic.x, y: ground(pic.x, pic.z), z: pic.z, ry: 1.2 });
    const tableTop = picnic.userData.top;
    place('wine_bottles_01', { x: pic.x - 0.1, y: tableTop, z: pic.z - 0.1 });
    place('brass_goblets', { x: pic.x + 0.28, y: tableTop, z: pic.z + 0.12, scale: 0.8 });
    place('wicker_basket_01', { x: pic.x - 0.55, y: tableTop, z: pic.z + 0.42, ry: 0.5 });
    place('wine_barrel_01', { x: 12.4, y: ground(12.4, -4.3), z: -4.3 });
    place('wine_barrel_01', { x: 13.1, y: ground(13.1, -3.2), z: -3.2, ry: 1.7 });

    // Planting and rocks.
    [[-10, -3.2, 1.1, 0.2], [-10, -8, 1.3, 2], [10, -8.5, 1.2, 4], [8.5, 3, 0.75, 1], [-3, -12.6, 1.3, 3], [1.6, -12.8, 1, 5.2]].forEach(([x, z, s, ry]) => {
        place('shrub_02', { x, y: ground(x, z), z, ry, scale: s });
    });
    [[-5.3, 0.6], [-3.1, 0.9], [2.4, 0.9], [4.9, 0.7], [-9, 2], [15.5, 13]].forEach(([x, z], i) => {
        place('fern_02', { x, y: ground(x, z), z, ry: i * 1.7, scale: 1.1 });
    });
    [[13.7, -15, 0.8], [33, -9, 1.1], [41, -22, 1.3], [7.3, -21, 0.9]].forEach(([x, z, s], i) => {
        place(i % 2 ? 'rock_moss_set_01' : 'rock_moss_set_02', { x, y: ground(x, z) - 0.3 * s, z, ry: i * 2, scale: s });
    });
    [[-31, 10, 1.3], [-14, 24, 1.1], [20, 26, 1.5]].forEach(([x, z, s], i) => {
        place('boulder_01', { x, y: ground(x, z) - 0.1, z, ry: i * 1.3, scale: s });
    });

    // Lantern posts along the cart path.
    const postMat = new THREE.MeshStandardMaterial({ ...tex.timber, color: 0x8a6a4e });
    POST_SPOTS.forEach(([x, z]) => {
        const y = ground(x, z);
        const post = shadowed(new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 0.1), postMat));
        post.position.set(x, y + 0.6, z);
        world.add(post);
        place('wooden_lantern_01', { x, y: y + 1.2, z, height: 0.42, ry: x });
        halo(world, x, y + 1.42, z, 2.2);
    });

    const flag = makeFlag();
    flag.position.set(CUP.x, ground(CUP.x, CUP.z), CUP.z);
    world.add(flag);

    const mailbox = makeMailbox(tex);
    const mailFlag = mailbox.getObjectByName('flag');
    const mail = { x: 7.4, z: 33.5 };
    mailbox.position.set(mail.x, ground(mail.x, mail.z), mail.z);
    mailbox.rotation.y = -0.2;
    world.add(mailbox);

    // Light poles carry the string lights from the porch out over the wine and the fire.
    const poleMat = new THREE.MeshStandardMaterial({ ...tex.timber, color: 0x7a5c44 });
    [[15, -1], [15.5, 7.5], [6.2, 8]].forEach(([x, z]) => {
        const pole = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 3.6, 8), poleMat));
        pole.position.set(x, ground(x, z) + 1.8, z);
        world.add(pole);
    });
    const poleTop = (x, z) => ground(x, z) + 3.55;
    makeStringLights(world, [[4.55, 3.2, 0], [15, poleTop(15, -1), -1], [15.5, poleTop(15.5, 7.5), 7.5], [6.2, poleTop(6.2, 8), 8], [4.55, 3.2, 0]]);

    const reactions = {
        trove: { value: 0, apply: (k) => {
            chestLid.rotation.x = lidRest - k * 1.05;
            gold.intensity = k * 4;
        } },
        fantasy: { value: 0, apply: (k, t) => {
            football.position.y = footballY + k * 0.34 + Math.sin(t * 1.6) * 0.02 * k;
            football.rotation.y = 0.6 + k * t * 0.9;
        } },
        hello: { value: 0, apply: (k) => {
            mailFlag.rotation.z = (1 - k) * -1.45;
        } },
        writing: { value: 0, apply: (k) => {
            essayBooks.forEach((book, i) => { book.position.x = -4.04 + k * (0.05 + (i % 2) * 0.05); });
        } },
    };
    reactions.hello.apply(0);
    return { world, flag, phone, pit, reactions };
}

