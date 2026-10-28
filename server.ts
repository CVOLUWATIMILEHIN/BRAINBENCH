import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { type Request, type Response } from 'express';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALLOWED_PRODUCTS = ['ULTRA CBT', 'PORTAL PRO', 'LMS E-LIBRARY'] as const;
type AllowedProduct = (typeof ALLOWED_PRODUCTS)[number];

const ALLOWED_STATUSES = [
  'New',
  'Contacted',
  'Demo Scheduled',
  'Completed',
  'Closed',
] as const;
type AllowedStatus = (typeof ALLOWED_STATUSES)[number];

const NAME_PATTERN = /^[\p{L}\p{M}\s.'’-]{2,100}$/u;
const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const PHONE_PATTERN = /^\+?[0-9\s()-]{7,20}$/;
const DATE_ISO_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const DEFAULT_ADMIN_EMAIL = 'olosundelouis@gmail.com';
const DATA_DIR = path.join(__dirname, 'data');
const DEMO_REQUESTS_FILE = path.join(DATA_DIR, 'demo-requests.json');

const ipRateLimitMap = new Map<string, number[]>();
const duplicateSubmissionMap = new Map<string, number>();
const adminSessions = new Map<string, { email: string; expiresAt: number }>();

export interface StoredDemoRequest {
  id: string;
  referenceCode: string;
  fullName: string;
  organisation: string;
  email: string;
  phone: string;
  product: AllowedProduct;
  preferredDate: string;
  message: string;
  status: AllowedStatus;
  notes: string;
  notificationStatus: 'pending' | 'sent' | 'failed' | 'unconfigured';
  notificationDetail: string;
  createdAt: string;
  updatedAt: string;
}

async function readStoredDemoRequests(): Promise<StoredDemoRequest[]> {
  try {
    const raw = await fs.readFile(DEMO_REQUESTS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeStoredDemoRequests(
  records: StoredDemoRequest[]
): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tempFile = `${DEMO_REQUESTS_FILE}.tmp`;
  await fs.writeFile(tempFile, JSON.stringify(records, null, 2), 'utf-8');
  await fs.rename(tempFile, DEMO_REQUESTS_FILE);
}

function stripControlAndHtml(raw: unknown, maxLength = 200): string {
  if (typeof raw !== 'string') return '';
  return raw
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength);
}

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

function checkServerRateLimit(
  ip: string,
  maxRequests = 5,
  windowMs = 10 * 60 * 1000
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const prev = ipRateLimitMap.get(ip) || [];
  const active = prev.filter((t) => now - t < windowMs);

  if (active.length >= maxRequests) {
    const oldest = active[0];
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((windowMs - (now - oldest)) / 1000)
    );
    return { allowed: false, retryAfterSeconds };
  }

  active.push(now);
  ipRateLimitMap.set(ip, active);
  return { allowed: true, retryAfterSeconds: 0 };
}

function generateServerReferenceCode(): string {
  const num = crypto.randomInt(100000, 999999);
  const alpha = crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 4);
  return `BBT-SOL-${num}-${alpha}`;
}

function getAuthorizedAdminEmail(): string {
  return (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();
}

function verifyAdminToken(req: Request): { valid: boolean; email?: string } {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : '';
  if (!token) return { valid: false };

  const session = adminSessions.get(token);
  if (!session) return { valid: false };
  if (Date.now() > session.expiresAt) {
    adminSessions.delete(token);
    return { valid: false };
  }
  return { valid: true, email: session.email };
}

interface ValidatedPayload {
  fullName: string;
  organisation: string;
  email: string;
  phone: string;
  product: AllowedProduct;
  preferredDate: string;
  message: string;
}

function validateServerDemoPayload(body: Record<string, unknown>): {
  valid: boolean;
  error?: string;
  data?: ValidatedPayload;
} {
  if (typeof body.honeypot === 'string' && body.honeypot.trim().length > 0) {
    return {
      valid: false,
      error: 'Unable to process request. Please refresh and try again.',
    };
  }

  const fullName = stripControlAndHtml(body.fullName, 100);
  if (!fullName || !NAME_PATTERN.test(fullName)) {
    return {
      valid: false,
      error:
        'Please enter a valid full name (2–100 characters, letters and standard punctuation only).',
    };
  }

  const organisation = stripControlAndHtml(body.organisation, 140);
  if (!organisation || organisation.length < 2) {
    return {
      valid: false,
      error:
        'Please enter the name of your organisation, school, or institution (2–140 characters).',
    };
  }

  const email = stripControlAndHtml(body.email, 120).toLowerCase();
  if (!email || email.length < 5 || !EMAIL_PATTERN.test(email)) {
    return {
      valid: false,
      error: 'Please enter a valid work or institutional email address.',
    };
  }

  const phone = stripControlAndHtml(body.phone, 20);
  const digitCount = phone.replace(/\D/g, '').length;
  if (!phone || !PHONE_PATTERN.test(phone) || digitCount < 7 || digitCount > 15) {
    return {
      valid: false,
      error:
        'Please enter a valid phone or WhatsApp number (7–15 digits, e.g. +234 803 000 0000).',
    };
  }

  const productRaw = stripControlAndHtml(body.product, 40).toUpperCase();
  if (!ALLOWED_PRODUCTS.includes(productRaw as AllowedProduct)) {
    return {
      valid: false,
      error:
        'Please select a valid Brainbench product of interest (ULTRA CBT, PORTAL PRO, or LMS E-LIBRARY).',
    };
  }

  const preferredDate = stripControlAndHtml(body.preferredDate, 30);
  if (preferredDate) {
    if (
      !DATE_ISO_PATTERN.test(preferredDate) ||
      Number.isNaN(Date.parse(`${preferredDate}T00:00:00`))
    ) {
      return {
        valid: false,
        error: 'Please enter a valid preferred demo date (YYYY-MM-DD).',
      };
    }
  }

  const message = stripControlAndHtml(body.message, 1500);

  return {
    valid: true,
    data: {
      fullName,
      organisation,
      email,
      phone,
      product: productRaw as AllowedProduct,
      preferredDate,
      message,
    },
  };
}

async function sendDemoNotificationEmail(params: {
  referenceCode: string;
  fullName: string;
  organisation: string;
  email: string;
  phone: string;
  product: string;
  preferredDate: string;
  message: string;
  submittedAt: string;
}): Promise<{
  ok: boolean;
  status: 'sent' | 'failed' | 'unconfigured';
  detail: string;
}> {
  const recipientEmail = (process.env.DEMO_NOTIFICATION_EMAIL || '').trim();
  if (!recipientEmail) {
    console.warn(
      '[DemoNotification] DEMO_NOTIFICATION_EMAIL is not configured in environment variables. Request retained on server.'
    );
    return {
      ok: false,
      status: 'unconfigured',
      detail:
        'DEMO_NOTIFICATION_EMAIL is not configured in environment variables yet. Submission is safely stored on the server.',
    };
  }

  const subject = `[Brainbench Demo Request] ${params.product} — ${params.organisation} (${params.referenceCode})`;
  const textBody = [
    'NEW PRODUCT DEMO REQUEST — BRAINBENCH TECHNOLOGY',
    '====================================================',
    `Tracking Reference: ${params.referenceCode}`,
    `Requested Product:  ${params.product}`,
    `Full Name:          ${params.fullName}`,
    `Organisation:       ${params.organisation}`,
    `Work Email:         ${params.email}`,
    `Phone Number:       ${params.phone}`,
    `Preferred Date:     ${params.preferredDate || 'Not specified'}`,
    `Submitted At:       ${params.submittedAt}`,
    '',
    'Additional Message:',
    params.message || 'No additional message provided.',
    '====================================================',
  ].join('\n');

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; border: 1px solid #e3e5f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #061539; color: #ffffff; padding: 20px 24px;">
        <div style="color: #fdc12e; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">
          BRAINBENCH TECHNOLOGY · DEMO REQUEST NOTIFICATION
        </div>
        <h2 style="margin: 6px 0 0; font-size: 20px; color: #ffffff;">
          New ${escapeHtml(params.product)} Demo Request
        </h2>
      </div>
      <div style="padding: 24px; background: #ffffff; color: #121212;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #454545; width: 170px; font-weight: 600;">Tracking Reference:</td>
            <td style="padding: 8px 0; color: #1c3f9c; font-weight: 700; font-family: monospace;">${escapeHtml(params.referenceCode)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #454545; font-weight: 600;">Product of Interest:</td>
            <td style="padding: 8px 0; font-weight: 700; color: #061539;">${escapeHtml(params.product)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #454545; font-weight: 600;">Requester Name:</td>
            <td style="padding: 8px 0;">${escapeHtml(params.fullName)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #454545; font-weight: 600;">Organisation / Institution:</td>
            <td style="padding: 8px 0; font-weight: 600;">${escapeHtml(params.organisation)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #454545; font-weight: 600;">Work Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(params.email)}" style="color: #1c3f9c;">${escapeHtml(params.email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #454545; font-weight: 600;">Phone Number:</td>
            <td style="padding: 8px 0;">${escapeHtml(params.phone)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #454545; font-weight: 600;">Preferred Demo Date:</td>
            <td style="padding: 8px 0;">${escapeHtml(params.preferredDate || 'Not specified')}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #454545; font-weight: 600;">Submission Timestamp:</td>
            <td style="padding: 8px 0;">${escapeHtml(params.submittedAt)}</td>
          </tr>
        </table>
        <div style="margin-top: 18px; padding: 14px; background: #F8F9FC; border: 1px solid #e3e5f0; border-radius: 8px;">
          <div style="font-size: 12px; font-weight: 700; color: #1c3f9c; text-transform: uppercase; margin-bottom: 6px;">
            Additional Message
          </div>
          <div style="font-size: 14px; color: #121212; white-space: pre-wrap;">${escapeHtml(
            params.message || 'No additional message provided.'
          )}</div>
        </div>
      </div>
    </div>
  `;

  const resendApiKey = (process.env.RESEND_API_KEY || '').trim();
  const smtpHost = (process.env.SMTP_HOST || '').trim();
  const smtpUser = (process.env.SMTP_USER || '').trim();
  const smtpPass = (process.env.SMTP_PASS || '').trim();
  const fromAddress = (
    process.env.SMTP_FROM ||
    process.env.RESEND_FROM_EMAIL ||
    smtpUser ||
    'notifications@bbtechng.com'
  ).trim();

  // 1. Try Resend API if configured
  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [recipientEmail],
          reply_to: params.email,
          subject,
          text: textBody,
          html: htmlBody,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('[DemoNotification] Resend API error:', errText);
        return {
          ok: false,
          status: 'failed',
          detail: `Email provider returned HTTP ${response.status}. Request remains stored on the server.`,
        };
      }

      return {
        ok: true,
        status: 'sent',
        detail: `Notification email sent via Resend to ${recipientEmail}.`,
      };
    } catch (err) {
      console.error('[DemoNotification] Resend delivery exception:', err);
      return {
        ok: false,
        status: 'failed',
        detail:
          err instanceof Error
            ? `Email delivery failed: ${err.message}`
            : 'Email delivery failed.',
      };
    }
  }

  // 2. Try SMTP via Nodemailer if configured
  if (smtpHost && smtpUser && smtpPass) {
    try {
      const port = Number(process.env.SMTP_PORT || 587);
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port,
        secure: port === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: fromAddress,
        to: recipientEmail,
        replyTo: params.email,
        subject,
        text: textBody,
        html: htmlBody,
      });

      return {
        ok: true,
        status: 'sent',
        detail: `Notification email sent via SMTP to ${recipientEmail}.`,
      };
    } catch (err) {
      console.error('[DemoNotification] SMTP delivery exception:', err);
      return {
        ok: false,
        status: 'failed',
        detail:
          err instanceof Error
            ? `SMTP delivery failed: ${err.message}`
            : 'SMTP delivery failed.',
      };
    }
  }

  // 3. Neither Resend nor SMTP credentials configured yet
  console.warn(
    '[DemoNotification] Mail transport (SMTP_HOST/SMTP_USER/SMTP_PASS or RESEND_API_KEY) is not configured yet. Request retained on server.'
  );
  return {
    ok: false,
    status: 'unconfigured',
    detail:
      'Email transport credentials (SMTP_HOST or RESEND_API_KEY) are not configured in environment variables yet. Submission is safely stored on the server.',
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '32kb' }));

  // Health & Admin Email Configuration Status Endpoint (never exposes secrets)
  app.get('/api/admin/config-status', (_req: Request, res: Response) => {
    const recipient = (process.env.DEMO_NOTIFICATION_EMAIL || '').trim();
    const hasResend = Boolean((process.env.RESEND_API_KEY || '').trim());
    const hasSmtp = Boolean(
      (process.env.SMTP_HOST || '').trim() &&
        (process.env.SMTP_USER || '').trim() &&
        (process.env.SMTP_PASS || '').trim()
    );

    res.json({
      hasNotificationEmailConfigured: Boolean(recipient),
      hasMailTransportConfigured: hasResend || hasSmtp,
      transportType: hasResend
        ? 'Resend API'
        : hasSmtp
          ? 'SMTP'
          : 'Not Configured',
      configuredRecipient: recipient || null,
      authorizedAdminEmail: getAuthorizedAdminEmail(),
      requiresAccessCode: Boolean((process.env.ADMIN_ACCESS_CODE || '').trim()),
    });
  });

  // Admin Portal Sign-In Endpoint
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const body = (req.body || {}) as Record<string, unknown>;
    const email = stripControlAndHtml(body.email, 120).toLowerCase();
    const accessCode = stripControlAndHtml(body.accessCode, 120);

    const authorizedEmail = getAuthorizedAdminEmail();
    const configuredCode = (process.env.ADMIN_ACCESS_CODE || '').trim();

    if (!email || email !== authorizedEmail) {
      res.status(403).json({
        ok: false,
        error: `Access denied. Only the authorized administrator (${authorizedEmail}) may sign in.`,
      });
      return;
    }

    if (configuredCode && accessCode !== configuredCode) {
      res.status(403).json({
        ok: false,
        error: 'Invalid administrator access code.',
      });
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    adminSessions.set(token, {
      email: authorizedEmail,
      expiresAt: Date.now() + 12 * 60 * 60 * 1000,
    });

    res.json({
      ok: true,
      token,
      user: {
        email: authorizedEmail,
        displayName: 'Brainbench Administrator',
      },
    });
  });

  app.post('/api/admin/logout', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : '';
    if (token) {
      adminSessions.delete(token);
    }
    res.json({ ok: true });
  });

  // Server-side validation, spam protection, rate-limiting & reference generation
  app.post('/api/demo-requests/validate', (req: Request, res: Response) => {
    const ip = getClientIp(req);
    const rl = checkServerRateLimit(ip, 5, 10 * 60 * 1000);
    if (!rl.allowed) {
      res.status(429).json({
        ok: false,
        error: `Too many demo requests from this network. Please wait ${rl.retryAfterSeconds} seconds before trying again.`,
      });
      return;
    }

    const validation = validateServerDemoPayload(
      (req.body || {}) as Record<string, unknown>
    );
    if (!validation.valid || !validation.data) {
      res.status(400).json({
        ok: false,
        error: validation.error || 'Invalid form submission data.',
      });
      return;
    }

    const { data } = validation;
    const dupSignature = `${data.email}|${data.organisation.toLowerCase()}|${data.product}`;
    const now = Date.now();
    const lastSeen = duplicateSubmissionMap.get(dupSignature);
    if (lastSeen && now - lastSeen < 3 * 60 * 1000) {
      res.status(409).json({
        ok: false,
        error:
          'A demo request for this product and organisation was already submitted moments ago. Our team has received your request.',
      });
      return;
    }
    duplicateSubmissionMap.set(dupSignature, now);

    const requestId = `req_${crypto.randomUUID().replace(/-/g, '')}`;
    const referenceCode = generateServerReferenceCode();

    res.status(200).json({
      ok: true,
      requestId,
      referenceCode,
      validatedData: data,
    });
  });

  // Create and persist a new demo request on the server
  app.post('/api/demo-requests', async (req: Request, res: Response) => {
    const body = (req.body || {}) as Record<string, unknown>;
    const validation = validateServerDemoPayload(body);
    if (!validation.valid || !validation.data) {
      res.status(400).json({
        ok: false,
        error: validation.error || 'Invalid form submission data.',
      });
      return;
    }

    const { data } = validation;
    const requestId =
      stripControlAndHtml(body.requestId, 64) ||
      `req_${crypto.randomUUID().replace(/-/g, '')}`;
    const referenceCode =
      stripControlAndHtml(body.referenceCode, 40) ||
      generateServerReferenceCode();
    const nowIso = new Date().toISOString();

    const newRecord: StoredDemoRequest = {
      id: requestId,
      referenceCode,
      fullName: data.fullName,
      organisation: data.organisation,
      email: data.email,
      phone: data.phone,
      product: data.product,
      preferredDate: data.preferredDate,
      message: data.message,
      status: 'New',
      notes: '',
      notificationStatus: 'pending',
      notificationDetail: '',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    try {
      const existing = await readStoredDemoRequests();
      const filtered = existing.filter((r) => r.id !== requestId);
      filtered.unshift(newRecord);
      await writeStoredDemoRequests(filtered);
    } catch (err) {
      console.error('[DemoRequests] Failed to persist request:', err);
      res.status(500).json({
        ok: false,
        error: 'Unable to save your demo request on the server.',
      });
      return;
    }

    res.status(201).json({
      ok: true,
      request: newRecord,
    });
  });

  // List all demo requests (Admin protected)
  app.get('/api/demo-requests', async (req: Request, res: Response) => {
    const authCheck = verifyAdminToken(req);
    if (!authCheck.valid) {
      res.status(401).json({
        ok: false,
        error: 'Unauthorized. Please sign in to the administrator portal.',
      });
      return;
    }

    const records = await readStoredDemoRequests();
    res.json({
      ok: true,
      requests: records,
    });
  });

  // Update a demo request status or notes (Admin protected)
  app.patch('/api/demo-requests/:id', async (req: Request, res: Response) => {
    const authCheck = verifyAdminToken(req);
    if (!authCheck.valid) {
      res.status(401).json({
        ok: false,
        error: 'Unauthorized. Please sign in to the administrator portal.',
      });
      return;
    }

    const targetId = stripControlAndHtml(req.params.id, 64);
    const body = (req.body || {}) as Record<string, unknown>;
    const records = await readStoredDemoRequests();
    const idx = records.findIndex((r) => r.id === targetId);

    if (idx === -1) {
      res.status(404).json({
        ok: false,
        error: 'Demo request record not found.',
      });
      return;
    }

    const current = records[idx];
    const nextStatusRaw = stripControlAndHtml(body.status, 40);
    const nextStatus: AllowedStatus = ALLOWED_STATUSES.includes(
      nextStatusRaw as AllowedStatus
    )
      ? (nextStatusRaw as AllowedStatus)
      : current.status;

    const nextNotes =
      typeof body.notes === 'string'
        ? stripControlAndHtml(body.notes, 3000)
        : current.notes;

    const nextNotificationStatus =
      body.notificationStatus === 'sent' ||
      body.notificationStatus === 'failed' ||
      body.notificationStatus === 'unconfigured' ||
      body.notificationStatus === 'pending'
        ? body.notificationStatus
        : current.notificationStatus;

    const nextNotificationDetail =
      typeof body.notificationDetail === 'string'
        ? stripControlAndHtml(body.notificationDetail, 500)
        : current.notificationDetail;

    const updated: StoredDemoRequest = {
      ...current,
      status: nextStatus,
      notes: nextNotes,
      notificationStatus: nextNotificationStatus,
      notificationDetail: nextNotificationDetail,
      updatedAt: new Date().toISOString(),
    };

    records[idx] = updated;
    await writeStoredDemoRequests(records);

    res.json({
      ok: true,
      request: updated,
    });
  });

  // Delete a demo request (Admin protected)
  app.delete('/api/demo-requests/:id', async (req: Request, res: Response) => {
    const authCheck = verifyAdminToken(req);
    if (!authCheck.valid) {
      res.status(401).json({
        ok: false,
        error: 'Unauthorized. Please sign in to the administrator portal.',
      });
      return;
    }

    const targetId = stripControlAndHtml(req.params.id, 64);
    const records = await readStoredDemoRequests();
    const nextRecords = records.filter((r) => r.id !== targetId);

    await writeStoredDemoRequests(nextRecords);
    res.json({ ok: true });
  });

  // Server-side email notification dispatch (called after persistence or admin retry)
  app.post('/api/demo-requests/notify', async (req: Request, res: Response) => {
    const body = (req.body || {}) as Record<string, unknown>;
    const validation = validateServerDemoPayload(body);
    if (!validation.valid || !validation.data) {
      res.status(400).json({
        ok: false,
        status: 'failed',
        detail:
          validation.error || 'Invalid request payload for email notification.',
      });
      return;
    }

    const requestId = stripControlAndHtml(body.requestId, 64);
    const referenceCode =
      stripControlAndHtml(body.referenceCode, 40) ||
      generateServerReferenceCode();
    const submittedAt =
      stripControlAndHtml(body.submittedAt, 64) || new Date().toISOString();

    const result = await sendDemoNotificationEmail({
      referenceCode,
      ...validation.data,
      submittedAt,
    });

    // Update stored record's notification status if requestId exists
    if (requestId) {
      try {
        const records = await readStoredDemoRequests();
        const idx = records.findIndex((r) => r.id === requestId);
        if (idx !== -1) {
          records[idx] = {
            ...records[idx],
            notificationStatus: result.status,
            notificationDetail: result.detail,
            updatedAt: new Date().toISOString(),
          };
          await writeStoredDemoRequests(records);
        }
      } catch {
        // Non-fatal if record update fails during notification
      }
    }

    res.status(200).json(result);
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Brainbench server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
