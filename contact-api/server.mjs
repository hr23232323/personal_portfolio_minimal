import http from 'node:http';
import https from 'node:https';

const port = Number(process.env.PORT || 8080);
const resendApiKey = process.env.RESEND_API_KEY || '';
const contactToEmail = process.env.CONTACT_TO_EMAIL || '';
const contactFromEmail = process.env.CONTACT_FROM_EMAIL || '';
const dryRun = process.env.RESEND_DRY_RUN === 'true';
const allowedOrigins = new Set(
    (process.env.ALLOWED_ORIGINS || 'https://harshrana.com|https://www.harshrana.com|http://localhost:8080')
        .split('|')
        .map((origin) => origin.trim())
        .filter(Boolean),
);

const maxBodyBytes = 8_192;
const rateLimitWindowMs = 60 * 60 * 1_000;
const rateLimitMax = 5;
const requestCounts = new Map();

function sendJson(response, status, payload, origin = '') {
    if (allowedOrigins.has(origin)) {
        response.setHeader('Access-Control-Allow-Origin', origin);
        response.setHeader('Vary', 'Origin');
    }
    response.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
    });
    response.end(JSON.stringify(payload));
}

async function readJson(request) {
    let body = '';

    for await (const chunk of request) {
        body += chunk;
        if (Buffer.byteLength(body) > maxBodyBytes) {
            const error = new Error('Payload too large');
            error.statusCode = 413;
            throw error;
        }
    }

    return JSON.parse(body || '{}');
}

function clientIp(request) {
    return (request.headers['x-forwarded-for'] || request.socket.remoteAddress || 'unknown')
        .toString()
        .split(',')[0]
        .trim();
}

function isRateLimited(ip) {
    const now = Date.now();
    const current = requestCounts.get(ip);

    if (!current || now - current.startedAt > rateLimitWindowMs) {
        requestCounts.set(ip, { startedAt: now, count: 1 });
        return false;
    }

    current.count += 1;
    return current.count > rateLimitMax;
}

function cleanSingleLine(value, maxLength) {
    return String(value || '').replace(/[\r\n\t]+/g, ' ').trim().slice(0, maxLength);
}

function validateSubmission(payload) {
    const name = cleanSingleLine(payload.name, 100);
    const email = cleanSingleLine(payload.email, 254).toLowerCase();
    const message = String(payload.message || '').trim().slice(0, 5_000);
    const companyWebsite = cleanSingleLine(payload.company_website, 200);
    const startedAt = Number(payload.started_at);

    if (companyWebsite) return { trapped: true };
    if (name.length < 2) return { error: 'Please enter your name.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Please enter a valid email.' };
    if (message.length < 10) return { error: 'Please add a little more detail.' };
    if (!Number.isFinite(startedAt) || Date.now() - startedAt < 1_000) return { trapped: true };

    return { name, email, message };
}

async function sendContactEmail({ name, email, message }) {
    if (dryRun) return;
    if (!resendApiKey || !contactToEmail || !contactFromEmail) {
        throw new Error('Contact service is not configured');
    }

    const body = JSON.stringify({
        from: contactFromEmail,
        to: [contactToEmail],
        reply_to: email,
        subject: `Portfolio note from ${name}`,
        text: `New portfolio note\n\nName: ${name}\nEmail: ${email}\n\n${message}\n\nSource: harshrana.com`,
        tags: [{ name: 'source', value: 'portfolio-contact' }],
    });

    await new Promise((resolve, reject) => {
        const request = https.request({
            hostname: 'api.resend.com',
            path: '/emails',
            method: 'POST',
            family: 4,
            headers: {
                Authorization: `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
            },
        }, (response) => {
            response.resume();

            if (response.statusCode >= 200 && response.statusCode < 300) {
                resolve();
                return;
            }

            console.error('Resend request failed with status', response.statusCode);
            reject(new Error('Email delivery failed'));
        });

        request.setTimeout(10_000, () => request.destroy(new Error('Resend request timed out')));
        request.on('error', reject);
        request.end(body);
    });
}

const server = http.createServer(async (request, response) => {
    const origin = request.headers.origin || '';
    const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);

    if (request.method === 'GET' && url.pathname === '/health') {
        return sendJson(response, 200, { ok: true });
    }

    if (url.pathname !== '/contact') {
        return sendJson(response, 404, { error: 'Not found.' }, origin);
    }

    if (!allowedOrigins.has(origin)) {
        return sendJson(response, 403, { error: 'Origin not allowed.' });
    }

    if (request.method === 'OPTIONS') {
        response.setHeader('Access-Control-Allow-Origin', origin);
        response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        response.setHeader('Access-Control-Max-Age', '86400');
        response.setHeader('Vary', 'Origin');
        response.writeHead(204);
        return response.end();
    }

    if (request.method !== 'POST') {
        return sendJson(response, 405, { error: 'Method not allowed.' }, origin);
    }

    if (!String(request.headers['content-type'] || '').startsWith('application/json')) {
        return sendJson(response, 415, { error: 'Expected JSON.' }, origin);
    }

    if (isRateLimited(clientIp(request))) {
        return sendJson(response, 429, { error: 'Please wait before trying again.' }, origin);
    }

    try {
        const payload = await readJson(request);
        const submission = validateSubmission(payload);

        if (submission.trapped) return sendJson(response, 200, { ok: true }, origin);
        if (submission.error) return sendJson(response, 400, { error: submission.error }, origin);

        await sendContactEmail(submission);
        return sendJson(response, 200, { ok: true }, origin);
    } catch (error) {
        const status = error.statusCode || 500;
        if (status === 500) console.error('Contact request failed');
        return sendJson(response, status, { error: 'Unable to send your note.' }, origin);
    }
});

server.listen(port, '0.0.0.0', () => {
    console.log(`Contact API listening on port ${port}`);
});
