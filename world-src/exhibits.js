import * as THREE from 'three';
import { CUP, FLOOR_Y } from './terrain.js';

const F = FLOOR_Y;
const v = (x, y, z) => new THREE.Vector3(x, y, z);

// Tour order follows the walk from the mailbox up to the shack.
export const EXHIBITS = [];

export function setupExhibits(ground) {
    EXHIBITS.push(
        { id: 'hello', verb: 'Check the mailbox', focus: v(7.4, ground(7.4, 33.5) + 1.25, 33.5), view: v(8.9, ground(9, 35) + 1.55, 35.0), reach: 3.4, inside: false },
        { id: 'carl', verb: 'Look at Carl', focus: v(CUP.x, ground(CUP.x, CUP.z) + 1.3, CUP.z), view: v(-12.2, ground(-12, 10) + 1.65, 10.4), reach: 6, inside: false },
        { id: 'fantasy', verb: 'Pick up the football', focus: v(9.2, ground(9, 10.5) + 0.86, 10.35), view: v(10.55, ground(10.5, 9.4) + 1.18, 9.0), reach: 3.2, inside: false },
        { id: 'wine', verb: 'Pour a glass', focus: v(9.45, ground(9.5, -3) + 0.92, -2.95), view: v(8.5, ground(8.4, -0.9) + 1.45, -0.7), reach: 3.6, inside: false },
        { id: 'phone', verb: 'Pick up the phone', focus: v(-1.3, F + 1.3, -2.3), view: v(-1.05, F + 1.5, -0.95), reach: 2.5, inside: false },
        { id: 'writing', verb: 'Browse the shelf', focus: v(-4, F + 1.25, -3.92), view: v(-2.2, F + 1.45, -3.9), reach: 3, inside: true },
        { id: 'now', verb: 'See what I’m working on', focus: v(0.1, F + 1.0, -8.9), view: v(0.5, F + 1.42, -7.3), reach: 2.8, inside: true },
        { id: 'logfast', verb: 'Press play', focus: v(0.3, F + 0.5, -5.28), view: v(0.05, F + 1.0, -4.3), reach: 2.6, inside: true },
        { id: 'trove', verb: 'Open the chest', focus: v(3.85, F + 0.35, -8.5), view: v(2.35, F + 1.3, -7.3), reach: 2.8, inside: true },
    );
    EXHIBITS.forEach((e) => { e.stand = { x: e.view.x, z: e.view.z }; });
}

const layer = document.getElementById('cards');
const controls = document.getElementById('card-controls');
let live = null;

function enter(card, from) {
    const r = card.getBoundingClientRect();
    const dx = from.x - (r.left + r.width / 2);
    const dy = from.y - (r.top + r.height / 2);
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    card.animate([
        { transform: `translate(${dx}px, ${dy}px) perspective(1400px) rotateY(-68deg) rotateZ(-7deg) scale(.16)`, opacity: 0 },
        { opacity: 1, offset: 0.28 },
        { transform: 'translate(0, 0) perspective(1400px) rotateY(0) rotateZ(0) scale(1)', opacity: 1 },
    ], { duration: calm ? 1 : 760, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'backwards' });
    card.querySelectorAll('[data-in]').forEach((el, i) => {
        el.animate([
            { opacity: 0, transform: 'translateY(10px)' },
            { opacity: 1, transform: 'none' },
        ], { duration: calm ? 1 : 420, delay: calm ? 0 : 300 + i * 70, easing: 'ease-out', fill: 'backwards' });
    });
}

function tilt(card) {
    card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--rx', `${(0.5 - y) * 14}deg`);
        card.style.setProperty('--ry', `${(x - 0.5) * 18}deg`);
        card.style.setProperty('--px', `${x * 100}%`);
        card.style.setProperty('--py', `${y * 100}%`);
    });
    card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
    });
}

function shelf(card) {
    const cover = card.querySelector('#book-cover');
    card.querySelectorAll('[data-cover]').forEach((a) => {
        const show = () => { cover.src = `/img/musings/covers/${a.dataset.cover}.webp`; };
        a.addEventListener('pointerenter', show);
        a.addEventListener('focus', show);
    });
}

export function openCard(exhibit, from, { onClose, onStep }) {
    const card = document.getElementById(`card-${exhibit.id}`).content.firstElementChild.cloneNode(true);
    layer.replaceChildren(card);
    layer.classList.add('on');
    controls.classList.add('on');
    live = { card, onClose };
    if (card.matches('.holo')) tilt(card);
    if (card.matches('.book')) shelf(card);
    document.getElementById('card-close').onclick = () => closeCard(true, true);
    document.getElementById('card-prev').onclick = () => onStep(-1);
    document.getElementById('card-next').onclick = () => onStep(1);
    enter(card, from);
    document.getElementById('card-close').focus({ preventScroll: true });
}

export function closeCard(notify = true, fromGesture = true) {
    if (!live) return;
    const { card, onClose } = live;
    live = null;
    controls.classList.remove('on');
    card.animate([
        { transform: 'none', opacity: 1 },
        { transform: 'translateY(26px) scale(.96) rotateZ(1.5deg)', opacity: 0 },
    ], { duration: 240, easing: 'ease-in', fill: 'forwards' }).finished.then(() => {
        card.remove();
        if (!layer.children.length) layer.classList.remove('on');
    });
    if (notify) onClose(fromGesture);
}
