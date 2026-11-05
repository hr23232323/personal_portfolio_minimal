// Everything here is synthesized, so the page ships no sound files.
export function createAudio() {
    let ctx, master, fireGain, noise;
    let muted = false;

    function makeNoise() {
        const buffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
        const d = buffer.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        return buffer;
    }
    function loop(filterType, freq, q, gainValue) {
        const src = ctx.createBufferSource();
        src.buffer = noise;
        src.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = filterType;
        filter.frequency.value = freq;
        filter.Q.value = q;
        const gain = ctx.createGain();
        gain.gain.value = gainValue;
        src.connect(filter).connect(gain).connect(master);
        src.start();
        return { filter, gain };
    }
    function burst({ type = 'lowpass', freq = 900, q = 1, gain = 0.2, attack = 0.005, decay = 0.09, when = 0 }) {
        if (!ctx) return;
        const t = ctx.currentTime + when;
        const src = ctx.createBufferSource();
        src.buffer = noise;
        src.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = type;
        filter.frequency.value = freq;
        filter.Q.value = q;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(gain, t + attack);
        g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
        src.connect(filter).connect(g).connect(master);
        src.start(t, Math.random() * 2);
        src.stop(t + attack + decay + 0.05);
    }
    function chirp() {
        if (!ctx || muted) return;
        const t = ctx.currentTime;
        const freq = 4100 + Math.random() * 500;
        for (let i = 0; i < 3; i++) {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.frequency.value = freq;
            const at = t + i * 0.075;
            g.gain.setValueAtTime(0, at);
            g.gain.linearRampToValueAtTime(0.012, at + 0.012);
            g.gain.linearRampToValueAtTime(0, at + 0.05);
            o.connect(g).connect(master);
            o.start(at);
            o.stop(at + 0.06);
        }
    }

    return {
        start() {
            if (ctx) return;
            ctx = new AudioContext();
            master = ctx.createGain();
            master.gain.value = 0;
            master.connect(ctx.destination);
            master.gain.linearRampToValueAtTime(muted ? 0 : 1, ctx.currentTime + 2.5);
            noise = makeNoise();

            const wind = loop('lowpass', 420, 0.4, 0.05);
            const lfo = ctx.createOscillator();
            const depth = ctx.createGain();
            lfo.frequency.value = 0.09;
            depth.gain.value = 180;
            lfo.connect(depth).connect(wind.filter.frequency);
            lfo.start();

            fireGain = loop('bandpass', 700, 0.7, 0).gain;
            setInterval(() => { if (Math.random() < 0.7) chirp(); }, 1400);
            setInterval(() => {
                const near = fireGain.gain.value;
                if (near > 0.005) burst({ type: 'highpass', freq: 2400, gain: near * 7 * Math.random(), decay: 0.03 });
            }, 170);
        },
        step(surface, running) {
            const gain = running ? 0.2 : 0.13;
            if (surface === 'wood') burst({ freq: 340, q: 2, gain: gain * 1.5, decay: 0.08 });
            else if (surface === 'gravel') burst({ type: 'bandpass', freq: 2300, q: 0.6, gain: gain * 0.7, decay: 0.12 });
            else burst({ type: 'bandpass', freq: 1200, q: 0.5, gain: gain * 0.34, attack: 0.02, decay: 0.12 });
        },
        fire(distance) {
            if (fireGain) fireGain.gain.value = Math.max(0, 0.055 * (1 - distance / 16));
        },
        open() {
            burst({ type: 'bandpass', freq: 2600, q: 0.8, gain: 0.08, attack: 0.03, decay: 0.2 });
        },
        close() {
            burst({ type: 'bandpass', freq: 1500, q: 0.8, gain: 0.06, attack: 0.02, decay: 0.14 });
        },
        sink() {
            burst({ freq: 900, q: 6, gain: 0.3, decay: 0.08 });
            burst({ freq: 620, q: 8, gain: 0.3, decay: 0.12, when: 0.1 });
        },
        toggle() {
            muted = !muted;
            if (ctx) master.gain.linearRampToValueAtTime(muted ? 0 : 1, ctx.currentTime + 0.3);
            return muted;
        },
    };
}
