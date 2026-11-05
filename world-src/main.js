import * as THREE from 'three';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { N8AOPass } from 'n8ao';

import { bakeMaps, CUP, FLOOR_Y, makeTerrain, makeWater, onPath, terrainHeight } from './terrain.js';
import { makeGrass } from './grass.js';
import { makeCabin } from './building.js';
import { buildProps, GLOW, loadModels, makeTrees, POST_SPOTS } from './props.js';
import { makeBalls, makeBeacons, makeFire, makeFireflies } from './fx.js';
import { createPlayer } from './player.js';
import { createAudio } from './audio.js';
import { closeCard, EXHIBITS, openCard, setupExhibits } from './exhibits.js';

const params = new URLSearchParams(location.search);
const coarse = matchMedia('(pointer: coarse)').matches;
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const quality = params.get('q') || (coarse ? 'low' : 'high');
const high = quality === 'high';
const assets = (folder) => `/world/assets/${folder}${high ? '' : '-lite'}`;

const $ = (id) => document.getElementById(id);
let player;
let wantWorld;
const setLofi = (on) => {
    document.body.classList.toggle('lofi', on);
    $('text-toggle').querySelector('span').textContent = on ? '3D version' : 'Text version';
    if (on) player?.unlock();
    else wantWorld?.();
};

// Remember the choice for this tab, so coming back from an essay stays in the text version.
const TEXT_KEY = 'prefers-text';
$('text-toggle').onclick = () => {
    const on = !document.body.classList.contains('lofi');
    setLofi(on);
    try {
        if (on) sessionStorage.setItem(TEXT_KEY, '1');
        else sessionStorage.removeItem(TEXT_KEY);
    } catch { /* Private browsing can block storage. The choice just won't stick. */ }
};

// iOS kills a tab that runs out of memory and reloads it, which would crash again
// forever. A mark left behind means the last visit never got to leave the page.
const OPEN_KEY = 'world-open';
const markOpen = (open) => {
    try {
        if (open) localStorage.setItem(OPEN_KEY, Date.now());
        else localStorage.removeItem(OPEN_KEY);
    } catch { /* Private browsing can block storage. The guard just won't apply. */ }
};
let lastOpen = 0;
try { lastOpen = Number(localStorage.getItem(OPEN_KEY)); } catch { /* Same as above. */ }
if (Date.now() - lastOpen < 10 * 60 * 1000) {
    document.body.classList.add('no-webgl');
    setLofi(true);
    throw new Error('The last visit crashed, showing text version');
}

// Someone reading the text version shouldn't pay for a 3D world they aren't looking at.
if (document.body.classList.contains('lofi')) {
    setLofi(true);
    await new Promise((resolve) => { wantWorld = resolve; });
}

markOpen(true);
addEventListener('pagehide', () => markOpen(false));
addEventListener('pageshow', () => markOpen(true));
document.addEventListener('visibilitychange', () => markOpen(!document.hidden));

let renderer;
try {
    renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
} catch {
    document.body.classList.add('no-webgl');
    setLofi(true);
    throw new Error('WebGL unavailable, showing text version');
}

let pixelRatio = Math.min(devicePixelRatio, 1.5);
renderer.setPixelRatio(pixelRatio);
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = true;
$('stage').append(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.05, 900);

// Everything loads behind the title screen.
const STATUS = [
    ['hdri', 'Setting the sun'],
    ['/tex/', 'Mowing the fairway'],
    ['wine', 'Uncorking the wine'],
    ['treasure', 'Hiding the treasure'],
    ['bookshelf', 'Shelving the essays'],
    ['fire_pit', 'Stacking the firewood'],
    ['football', 'Finding the football'],
];
let shown = 0;
let target = 0;
const setProgress = (value, status) => {
    target = Math.max(target, value);
    if (status) $('load-status').textContent = status;
};
(function ease() {
    shown += (target - shown) * (calm ? 1 : 0.09);
    document.documentElement.style.setProperty('--p', shown.toFixed(4));
    if (shown < 0.999) requestAnimationFrame(ease);
    else document.documentElement.style.setProperty('--p', '1');
}());
const nextFrame = () => new Promise(requestAnimationFrame);

const manager = new THREE.LoadingManager();
manager.onProgress = (url, done, total) => {
    setProgress((done / total) * 0.86, STATUS.find(([key]) => url.includes(key))?.[1]);
};
const texLoader = new THREE.TextureLoader(manager);

function loadTex(name, repeat = 1, parts = ['diff', 'nor', 'rough']) {
    const out = {};
    const get = (part, srgb) => {
        const t = texLoader.load(`${assets('tex')}/${name}_${part}.webp`);
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(repeat, repeat);
        t.anisotropy = 8;
        if (srgb) t.colorSpace = THREE.SRGBColorSpace;
        return t;
    };
    if (parts.includes('diff')) out.map = get('diff', true);
    if (parts.includes('nor')) out.normalMap = get('nor');
    if (parts.includes('rough')) out.roughnessMap = get('rough');
    return out;
}
const tex = {
    siding: loadTex('weathered_plank_siding', 0.45),
    plaster: loadTex('painted_plaster_wall', 0.4),
    floor: loadTex('wood_floor_worn', 3),
    deck: loadTex('wood_floor_deck', 2),
    roof: loadTex('grey_roof_01', 2),
    timber: loadTex('dark_wooden_planks', 0.8),
    stone: loadTex('rock_wall_08', 1),
};
const grassTex = loadTex('leafy_grass', 1, ['diff', 'nor']);
const sandTex = loadTex('coast_sand_01', 1, ['diff']);
const gravelTex = loadTex('gravel_floor', 1, ['diff']);
const treeTextures = ['tree_small_02', 'island_tree_02', 'island_tree_01', 'jacaranda_tree'].map((n) => {
    const t = texLoader.load(`${assets('trees')}/${n}.webp`);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
});

const sky = new HDRLoader(manager).loadAsync(`/world/assets/hdri/sunset_fairway_${high ? '2k' : '1k'}.hdr`);
const fontsReady = document.fonts.load('700 100px "Bricolage Grotesque"');
await Promise.all([loadModels(manager, assets('models')), sky.then((hdr) => {
    hdr.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = hdr;
    scene.environment = hdr;
}), fontsReady, new Promise((resolve) => { manager.onLoad = resolve; })]);

const SKY_TURN = Number(params.get('turn') ?? 2.356);
scene.backgroundRotation.y = SKY_TURN;
scene.environmentRotation.y = SKY_TURN;
scene.backgroundIntensity = 0.17;
scene.environmentIntensity = 0.36;
scene.fog = new THREE.FogExp2(0x4a4468, 0.0024);

// The world.
setProgress(0.88, 'Rolling the green');
await nextFrame();
const { heightTex, maskTex } = bakeMaps();
scene.add(makeTerrain({ maskTex, grass: { map: grassTex.map, normal: grassTex.normalMap }, sand: { map: sandTex.map }, gravel: { map: gravelTex.map }, pools: POST_SPOTS }));
const water = makeWater();
scene.add(water);
const grass = makeGrass({ heightTex, maskTex, count: high ? 340000 : 50000 });
scene.add(grass);
scene.add(makeCabin(tex));
const { flag, pit, reactions } = buildProps(scene, tex, texLoader);
const trees = makeTrees(treeTextures);
scene.add(trees);
const fire = makeFire(pit.x, terrainHeight(pit.x, pit.z), pit.z);
scene.add(fire);
const fireflies = makeFireflies(high ? 90 : 40);
scene.add(fireflies);

const toast = (text) => {
    const el = $('toast');
    el.textContent = text;
    el.classList.add('on');
    setTimeout(() => el.classList.remove('on'), 2600);
};
const audio = createAudio();
const balls = makeBalls([[-14.2, 8.6], [-17.4, 6.3], [-13.4, 5.9], [-18.5, 10.8]], CUP, () => {
    audio.sink();
    toast('In the hole.');
});
scene.add(balls);

setProgress(0.94, 'Stringing the lights');
await nextFrame();

// Light. The sun has just gone down behind the shack, so everything warm comes from the shack.
const sun = new THREE.DirectionalLight(0xff9d63, 1.15);
sun.position.set(-34, 15, -72);
sun.castShadow = true;
sun.shadow.mapSize.setScalar(high ? 4096 : 1024);
Object.assign(sun.shadow.camera, { left: -62, right: 62, top: 42, bottom: -42, near: 1, far: 190 });
sun.shadow.bias = -0.0003;
sun.shadow.normalBias = 0.05;
sun.shadow.radius = 3;
scene.add(sun);

const addLight = (color, intensity, distance, x, y, z, shadow = false) => {
    const l = new THREE.PointLight(color, intensity, distance, 2);
    l.position.set(x, y, z);
    if (shadow) {
        l.castShadow = true;
        l.shadow.mapSize.set(1024, 1024);
        l.shadow.bias = -0.002;
        l.shadow.normalBias = 0.04;
        l.shadow.camera.near = 0.2;
        l.shadow.radius = 4;
    }
    scene.add(l);
    return l;
};
const room = addLight(0xffb169, 30, 15, 0, 2.75, -5.2, high);
addLight(0xffc08a, 5, 4.5, -0.75, FLOOR_Y + 1.5, -8.6);
addLight(0xffb978, 13, 10, 0, 2.85, -1.2);
addLight(0xffb36b, 26, 17, 10, 2.9, 0.5);

const lampGlow = (x, y, z, size, opacity) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: 0xffb46e, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false }));
    s.position.set(x, y, z);
    s.scale.setScalar(size);
    scene.add(s);
};
lampGlow(-2.2, 3.5, -5.5, 1.2, 0.55);
lampGlow(2.2, 3.5, -5.5, 1.2, 0.55);
lampGlow(0, 2.86, -2.3, 0.9, 0.5);

// Post-processing: ambient occlusion, bloom, then a grade pass that also does the inspect blur.
const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(innerWidth, innerHeight, { type: THREE.HalfFloatType }));
composer.setPixelRatio(pixelRatio);
composer.setSize(innerWidth, innerHeight);
if (high) {
    const ao = new N8AOPass(scene, camera, innerWidth, innerHeight);
    ao.configuration.gammaCorrection = false;
    ao.configuration.aoRadius = 1.4;
    ao.configuration.distanceFalloff = 0.8;
    ao.configuration.intensity = 2.6;
    ao.configuration.halfRes = false;
    ao.setQualityMode('Medium');
    composer.addPass(ao);
} else {
    composer.addPass(new RenderPass(scene, camera));
}
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.3, 0.6, 1.6);
composer.addPass(bloom);

const grade = new ShaderPass({
    uniforms: {
        tDiffuse: { value: null },
        uFocus: { value: new THREE.Vector2(0.5, 0.5) },
        uBlur: { value: 0 },
        uAspect: { value: innerWidth / innerHeight },
        uTime: { value: 0 },
    },
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D tDiffuse;
        uniform vec2 uFocus;
        uniform float uBlur, uAspect, uTime;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
        void main() {
            vec2 off = (vUv - uFocus) * vec2(uAspect, 1.0);
            float m = smoothstep(0.1, 0.46, length(off)) * uBlur;
            vec3 col = texture2D(tDiffuse, vUv).rgb;
            if (m > 0.002) {
                vec3 sum = col;
                for (int i = 1; i <= 40; i++) {
                    float f = float(i) / 40.0;
                    float a = float(i) * 2.399963 + hash(vUv) * 6.2832;
                    sum += texture2D(tDiffuse, vUv + vec2(cos(a) / uAspect, sin(a)) * sqrt(f) * 0.02 * m).rgb;
                }
                col = sum / 41.0;
                col *= 1.0 - 0.42 * m;
            }
            vec2 v = (vUv - 0.5) * vec2(1.05, 1.0);
            col *= 1.0 - dot(v, v) * 0.62;
            col = mix(col, col * vec3(1.03, 0.99, 1.04), 0.6);
            col += (hash(vUv + uTime) - 0.5) * 0.012;
            gl_FragColor = vec4(col, 1.0);
        }`,
});
composer.addPass(grade);
composer.addPass(new OutputPass());
if (high) composer.addPass(new SMAAPass());

addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    composer.setSize(innerWidth, innerHeight);
    grade.uniforms.uAspect.value = camera.aspect;
});

// Walking.
const dom = renderer.domElement;
const surfaceAt = (x, z) => {
    if (x > -4.8 && x < 4.8 && z > -9.5 && z < 1.1) return 'wood';
    return onPath(x, z) ? 'gravel' : 'grass';
};
player = createPlayer(camera, dom, {
    onStep: (x, z, running) => audio.step(surfaceAt(x, z), running),
});

// Screen state: title, flying, walking or inspecting.
let state = 'title';
let current = null;
let returnTo = null;
let flight = null;
let viewShift = 0;
let shiftTarget = 0;
let liftShift = 0;
let liftTarget = 0;
let blurTarget = 0;

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
function fly(position, quaternion, seconds, done) {
    if (calm || seconds === 0) {
        camera.position.copy(position);
        camera.quaternion.copy(quaternion);
        done?.();
        return;
    }
    flight = { p0: camera.position.clone(), q0: camera.quaternion.clone(), p1: position, q1: quaternion, t: 0, seconds, done };
}
function lookQuat(from, target) {
    return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(from, target, camera.up));
}

const prompt = $('prompt');
function nearestExhibit() {
    const forward = camera.getWorldDirection(new THREE.Vector3());
    let best = null;
    let bestScore = 0.82;
    for (const e of EXHIBITS) {
        const to = e.focus.clone().sub(player.pos);
        const dist = Math.hypot(to.x, to.z);
        if (dist > e.reach) continue;
        const inside = player.pos.z < -2.5 && player.pos.z > -9.5 && Math.abs(player.pos.x) < 4.5;
        if (inside !== e.inside) continue;
        const score = forward.dot(to.normalize());
        if (score > bestScore) {
            best = e;
            bestScore = score;
        }
    }
    return best;
}

const screenPoint = (v) => {
    const p = v.clone().project(camera);
    return { x: (p.x + 1) / 2 * innerWidth, y: (1 - p.y) / 2 * innerHeight };
};

function showCard(exhibit) {
    const from = screenPoint(exhibit.focus);
    audio.open();
    openCard(exhibit, from, {
        onClose: endInspect,
        onStep: (dir) => stepTour(dir),
    });
}

function inspect(exhibit) {
    current = exhibit;
    state = 'flying';
    player.active = false;
    player.unlock();
    returnTo = returnTo || player.restPose();
    document.body.classList.add('inspecting');
    prompt.classList.remove('on');
    shiftTarget = innerWidth > 820 ? 0.17 : 0;
    liftTarget = innerWidth > 820 ? 0 : 0.27;
    blurTarget = 1;
    fly(exhibit.view.clone(), lookQuat(exhibit.view, exhibit.focus), 1.5, () => {
        state = 'inspect';
        showCard(exhibit);
    });
}

function jumpTo(exhibit) {
    const fade = $('fade');
    closeCard(false);
    current = exhibit;
    state = 'flying';
    fade.classList.add('on');
    setTimeout(() => {
        camera.position.copy(exhibit.view);
        camera.quaternion.copy(lookQuat(exhibit.view, exhibit.focus));
        fade.classList.remove('on');
        setTimeout(() => {
            state = 'inspect';
            showCard(exhibit);
        }, 260);
    }, 340);
}

function stepTour(dir) {
    const i = EXHIBITS.indexOf(current);
    const next = EXHIBITS[(i + dir + EXHIBITS.length) % EXHIBITS.length];
    audio.close();
    returnTo = null;
    player.place(next.stand.x, next.stand.z, next.focus.x, next.focus.z);
    jumpTo(next);
}

function endInspect(fromGesture = true) {
    audio.close();
    document.body.classList.remove('inspecting');
    shiftTarget = 0;
    liftTarget = 0;
    blurTarget = 0;
    state = 'flying';
    const rest = returnTo || player.restPose();
    returnTo = null;
    fly(rest.position, rest.quaternion, 1.1, () => {
        state = 'walk';
        player.active = true;
        if (fromGesture) player.lock();
    });
}

function interact() {
    if (state !== 'walk') return;
    const e = nearestExhibit();
    if (e) inspect(e);
}
addEventListener('keydown', (e) => {
    if (e.code === 'KeyE' || e.code === 'Enter') interact();
    if (state === 'inspect') {
        if (e.key === 'Escape') closeCard(true, false);
        if (e.key === 'ArrowRight') stepTour(1);
        if (e.key === 'ArrowLeft') stepTour(-1);
    }
});
dom.addEventListener('click', () => {
    if (state !== 'walk') return;
    if (nearestExhibit()) return interact();
    player.lock();
});
prompt.addEventListener('click', interact);

// Touch: left thumb walks, dragging anywhere else looks.
const stickEl = $('stick');
const knob = $('knob');
stickEl.addEventListener('pointerdown', (e) => {
    stickEl.setPointerCapture(e.pointerId);
    e.stopPropagation();
});
stickEl.addEventListener('pointermove', (e) => {
    if (!stickEl.hasPointerCapture(e.pointerId)) return;
    const r = stickEl.getBoundingClientRect();
    let x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
    let y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
    const len = Math.hypot(x, y);
    if (len > 1) { x /= len; y /= len; }
    player.stick.x = x;
    player.stick.y = y;
    knob.style.transform = `translate(${x * 34}px, ${y * 34}px)`;
});
const stickEnd = () => {
    player.stick.x = 0;
    player.stick.y = 0;
    knob.style.transform = '';
};
stickEl.addEventListener('pointerup', stickEnd);
stickEl.addEventListener('pointercancel', stickEnd);

const toggleSound = () => {
    $('sound').querySelector('span').textContent = audio.toggle() ? 'Sound off' : 'Sound on';
};
$('sound').onclick = toggleSound;

// The mouse is captured while walking, so these need to work from the keyboard too.
addEventListener('keydown', (e) => {
    if (!document.body.classList.contains('started') || e.repeat) return;
    if (e.code === 'KeyM') toggleSound();
    if (e.code === 'KeyT') $('text-toggle').click();
});
const syncFreeMouse = () => document.body.classList.toggle('free', document.pointerLockElement !== dom);
document.addEventListener('pointerlockchange', syncFreeMouse);
syncFreeMouse();
$('tour').onclick = () => {
    if (state === 'walk') inspect(EXHIBITS[0]);
    else if (state === 'title') begin(() => inspect(EXHIBITS[0]));
};

function begin(then) {
    audio.start();
    document.body.classList.add('started');
    state = 'flying';
    player.pose();
    const rest = player.restPose();
    fly(rest.position, rest.quaternion, 5.2, () => {
        state = 'walk';
        player.active = true;
        if (coarse) {
            setTimeout(() => $('help').classList.add('on'), 400);
            setTimeout(() => $('help').classList.remove('on'), 7400);
        }
        then?.();
    });
    // Fly starts from the title shot, not from where the player stands.
    flight && (flight.p0.copy(titleShot.position), flight.q0.copy(titleShot.quaternion));
    if (!calm) player.lock();
}
$('enter').onclick = () => begin();

const titleShot = { position: new THREE.Vector3(), quaternion: new THREE.Quaternion() };
function updateTitle(t) {
    const a = 0.72 + Math.sin(t * 0.05) * 0.1;
    titleShot.position.set(Math.sin(a) * 34, 7.5, Math.cos(a) * 34 + 2);
    titleShot.quaternion.copy(lookQuat(titleShot.position, new THREE.Vector3(1, 3, -5)));
    camera.position.copy(titleShot.position);
    camera.quaternion.copy(titleShot.quaternion);
}

setupExhibits(terrainHeight);
const beacons = makeBeacons(EXHIBITS, calm);
scene.add(beacons);

// Static world, so the big shadow maps only need to render once.
renderer.compile(scene, camera);
updateTitle(0);
sun.shadow.autoUpdate = false;
sun.shadow.needsUpdate = true;
if (high) {
    room.shadow.autoUpdate = false;
    room.shadow.needsUpdate = true;
}

// Hold the reveal until the world has drawn a frame and the ball has reached the cup.
async function finishLoading() {
    setProgress(1, 'Lighting the fire');
    while (shown < 0.995) await nextFrame();
    await nextFrame();
    document.body.classList.add('sunk');
    await new Promise((resolve) => setTimeout(resolve, calm ? 0 : 760));
    document.body.classList.add('ready');
    setTimeout(() => $('poster').remove(), 1500);
}

let last = performance.now();
let t = 0;
let slow = 0, frames = 0;

function adapt(dt) {
    frames++;
    if (dt > 0.03) slow++;
    if (frames < 120) return;
    if (slow > 80 && pixelRatio > 0.75) {
        pixelRatio = Math.max(0.75, pixelRatio - 0.25);
        renderer.setPixelRatio(pixelRatio);
        composer.setPixelRatio(pixelRatio);
    }
    frames = 0;
    slow = 0;
}

renderer.setAnimationLoop(() => {
    if (document.body.classList.contains('lofi')) return;
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    t += dt;

    if (state === 'title') updateTitle(t);
    if (flight) {
        flight.t = Math.min(1, flight.t + dt / flight.seconds);
        const k = ease(flight.t);
        camera.position.lerpVectors(flight.p0, flight.p1, k);
        camera.quaternion.slerpQuaternions(flight.q0, flight.q1, k);
        if (flight.t === 1) {
            const done = flight.done;
            flight = null;
            done?.();
        }
    }

    const speed = player.update(dt);
    let target = null;
    if (state === 'walk') {
        target = nearestExhibit();
        prompt.classList.toggle('on', !!target);
        if (target) prompt.querySelector('span').textContent = target.verb;
    }
    beacons.userData.update(t, dt, camera.position, target, document.body.classList.contains('inspecting') ? current : null);

    // Look at the object, shifted left so the card has room.
    viewShift += (shiftTarget - viewShift) * (1 - Math.exp(-dt * 4));
    liftShift += (liftTarget - liftShift) * (1 - Math.exp(-dt * 4));
    if (Math.abs(viewShift) + Math.abs(liftShift) > 0.001) camera.setViewOffset(innerWidth, innerHeight, viewShift * innerWidth, liftShift * innerHeight, innerWidth, innerHeight);
    else if (camera.view?.enabled) camera.clearViewOffset();
    const blur = grade.uniforms.uBlur;
    blur.value += (blurTarget - blur.value) * (1 - Math.exp(-dt * 3.4));
    if (current) {
        const p = current.focus.clone().project(camera);
        grade.uniforms.uFocus.value.set((p.x + 1) / 2, (p.y + 1) / 2);
    }
    grade.uniforms.uTime.value = t % 10;

    for (const [id, react] of Object.entries(reactions)) {
        const on = state === 'inspect' || (state === 'flying' && blurTarget === 1);
        const target = on && current?.id === id ? 1 : 0;
        react.value += (target - react.value) * (1 - Math.exp(-dt * 3.2));
        react.apply(react.value, t);
    }

    const eye = state === 'walk' ? player.pos : camera.position;
    grass.userData.update(t, eye);
    water.userData.update(t);
    trees.userData.update(t, camera.position);
    flag.userData.update(t);
    fire.userData.update(t, dt);
    fireflies.userData.update(t);
    balls.userData.update(dt, player.pos, speed);
    audio.fire(Math.hypot(player.pos.x - pit.x, player.pos.z - pit.z));

    composer.render(dt);
    adapt(dt);
});
finishLoading();

// Light up the on-screen keycaps as they're pressed.
const keycaps = Object.fromEntries([...document.querySelectorAll('#keys kbd')].map((k) => [k.dataset.key, k]));
const ALIASES = { ArrowUp: 'KeyW', ArrowLeft: 'KeyA', ArrowDown: 'KeyS', ArrowRight: 'KeyD', ShiftRight: 'ShiftLeft' };
const pressKey = (code, down) => keycaps[ALIASES[code] || code]?.classList.toggle('down', down);
addEventListener('keydown', (e) => pressKey(e.code, true));
addEventListener('keyup', (e) => pressKey(e.code, false));

