/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Application Security Utilities for Brainbench Technology
 * - Strict input validation and sanitization schemas
 * - Cryptographically secure reference ID generation (Web Crypto API)
 * - Sliding-window submission rate limiting (HTTP 429 semantics) & bot honeypot checks
 * - Same-origin URL, route, DOM ID, and image asset source validation
 * - Privacy-preserving security event logging (no PII or secrets logged)
 */

export type SecurityEventType =
  | 'VALIDATION_REJECTED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'BOT_HONEYPOT_TRIGGERED'
  | 'UNSAFE_URL_BLOCKED'
  | 'UNSAFE_ASSET_BLOCKED';

export interface SecurityLogEntry {
  timestamp: string;
  event: SecurityEventType;
  context: string;
  reason: string;
}

const MAX_SECURITY_LOG_ENTRIES = 50;
const inMemorySecurityLogs: SecurityLogEntry[] = [];
const inMemoryRateLimitStore: Record<string, number[]> = {};

/**
 * Logs security-relevant events without recording PII, passwords, emails, or tokens.
 */
export function logSecurityEvent(
  event: SecurityEventType,
  context: string,
  reason: string
): void {
  const entry: SecurityLogEntry = {
    timestamp: new Date().toISOString(),
    event,
    context: sanitizeTextInput(context, 64),
    reason: sanitizeTextInput(reason, 120),
  };

  inMemorySecurityLogs.push(entry);
  if (inMemorySecurityLogs.length > MAX_SECURITY_LOG_ENTRIES) {
    inMemorySecurityLogs.shift();
  }

  if (typeof window !== 'undefined' && import.meta.env?.DEV) {
    console.warn(`[SecurityAudit:${entry.event}] (${entry.context}) ${entry.reason}`);
  }
}

/**
 * Strips ASCII control characters, directional overrides, and HTML angle brackets.
 */
export function stripDangerousChars(raw: string): string {
  if (typeof raw !== 'string') return '';
  return raw
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, '')
    .replace(/[<>]/g, '');
}

/**
 * Sanitizes and truncates trimmed text input for form submission.
 */
export function sanitizeTextInput(raw: string, maxLength = 200): string {
  return stripDangerousChars(raw).trim().slice(0, maxLength);
}

/**
 * Sanitizes live search input while preserving spaces during typing.
 */
export function sanitizeSearchQuery(raw: string, maxLength = 100): string {
  return stripDangerousChars(raw).slice(0, maxLength);
}

const NAME_PATTERN = /^[\p{L}\p{M}\s.'’-]{2,100}$/u;
const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const PHONE_PATTERN = /^\+?[0-9\s()-]{7,20}$/;

export const ALLOWED_SCHEDULES = ['weekday', 'weekend', 'evening'] as const;
export type AllowedSchedule = (typeof ALLOWED_SCHEDULES)[number];

export const ALLOWED_INQUIRY_TOPICS = [
  'Course Enrolment & Tuition',
  'THE EDGE: Beyond the Classroom (Bi-Weekly Event)',
  'BRAINBENCH SPARK IT (Quarterly Event)',
  'Educational & Corporate Programmes',
  'Software Solutions Demo (ULTRA CBT, PORTAL PRO, LMS)',
  'General Inquiry',
] as const;
export type AllowedInquiryTopic = (typeof ALLOWED_INQUIRY_TOPICS)[number];

export interface ValidationResult<T> {
  valid: boolean;
  error?: string;
  data?: T;
}

export interface EnrolmentFormInput {
  fullName: string;
  email: string;
  phone: string;
  schedule: string;
  selectedCourseIds: string[];
  quickCourseId: string;
  allowedCourseIds: ReadonlySet<string>;
  honeypot?: string;
}

export interface ValidatedEnrolmentData {
  fullName: string;
  email: string;
  phone: string;
  schedule: AllowedSchedule;
  courseIds: string[];
}

export function validateEnrolmentForm(
  input: EnrolmentFormInput
): ValidationResult<ValidatedEnrolmentData> {
  // 1. Check anti-automation honeypot field
  if (input.honeypot && input.honeypot.trim().length > 0) {
    logSecurityEvent(
      'BOT_HONEYPOT_TRIGGERED',
      'enrolment_form',
      'Hidden honeypot field was populated'
    );
    return {
      valid: false,
      error: 'Unable to process request. Please refresh the page and try again.',
    };
  }

  // 2. Validate full name
  const fullName = sanitizeTextInput(input.fullName, 100);
  if (!fullName || !NAME_PATTERN.test(fullName)) {
    logSecurityEvent(
      'VALIDATION_REJECTED',
      'enrolment_form',
      'Invalid fullName format or length'
    );
    return {
      valid: false,
      error:
        'Please enter a valid full name (2–100 characters, letters and standard punctuation only).',
    };
  }

  // 3. Validate phone number
  const phone = sanitizeTextInput(input.phone, 20);
  const digitCount = phone.replace(/\D/g, '').length;
  if (!phone || !PHONE_PATTERN.test(phone) || digitCount < 7 || digitCount > 15) {
    logSecurityEvent(
      'VALIDATION_REJECTED',
      'enrolment_form',
      'Invalid phone format or digit count'
    );
    return {
      valid: false,
      error:
        'Please enter a valid phone or WhatsApp number (7–15 digits, e.g. +234 803 000 0000).',
    };
  }

  // 4. Validate email address
  const email = sanitizeTextInput(input.email, 120).toLowerCase();
  if (!email || email.length < 5 || !EMAIL_PATTERN.test(email)) {
    logSecurityEvent(
      'VALIDATION_REJECTED',
      'enrolment_form',
      'Invalid email format'
    );
    return {
      valid: false,
      error: 'Please enter a valid email address (e.g. you@example.com).',
    };
  }

  // 5. Validate schedule against strict enum allowlist
  if (!ALLOWED_SCHEDULES.includes(input.schedule as AllowedSchedule)) {
    logSecurityEvent(
      'VALIDATION_REJECTED',
      'enrolment_form',
      'Invalid schedule option'
    );
    return {
      valid: false,
      error: 'Please select a valid training schedule (Weekday, Weekend, or Evening).',
    };
  }

  // 6. Validate selected course IDs against catalogue allowlist
  const rawCourseIds =
    input.selectedCourseIds.length > 0
      ? input.selectedCourseIds
      : input.quickCourseId
      ? [input.quickCourseId]
      : [];

  const validCourseIds = rawCourseIds.filter((id) =>
    input.allowedCourseIds.has(id)
  );

  if (validCourseIds.length === 0) {
    logSecurityEvent(
      'VALIDATION_REJECTED',
      'enrolment_form',
      'No valid course ID selected'
    );
    return {
      valid: false,
      error: 'Please select at least one valid course from the 2026 catalogue.',
    };
  }

  return {
    valid: true,
    data: {
      fullName,
      email,
      phone,
      schedule: input.schedule as AllowedSchedule,
      courseIds: validCourseIds,
    },
  };
}

export interface ContactInquiryInput {
  fullName: string;
  email: string;
  phone: string;
  inquiryTopic: string;
  message: string;
  honeypot?: string;
}

export interface ValidatedContactInquiryData {
  fullName: string;
  email: string;
  phone: string;
  inquiryTopic: AllowedInquiryTopic;
  message: string;
}

export function validateContactInquiryForm(
  input: ContactInquiryInput
): ValidationResult<ValidatedContactInquiryData> {
  // 1. Check anti-automation honeypot field
  if (input.honeypot && input.honeypot.trim().length > 0) {
    logSecurityEvent(
      'BOT_HONEYPOT_TRIGGERED',
      'contact_inquiry_form',
      'Hidden honeypot field was populated'
    );
    return {
      valid: false,
      error: 'Unable to process request. Please refresh the page and try again.',
    };
  }

  // 2. Validate full name
  const fullName = sanitizeTextInput(input.fullName, 100);
  if (!fullName || !NAME_PATTERN.test(fullName)) {
    logSecurityEvent(
      'VALIDATION_REJECTED',
      'contact_inquiry_form',
      'Invalid fullName format or length'
    );
    return {
      valid: false,
      error:
        'Please enter a valid full name (2–100 characters, letters and standard punctuation only).',
    };
  }

  // 3. Validate phone number
  const phone = sanitizeTextInput(input.phone, 20);
  const digitCount = phone.replace(/\D/g, '').length;
  if (!phone || !PHONE_PATTERN.test(phone) || digitCount < 7 || digitCount > 15) {
    logSecurityEvent(
      'VALIDATION_REJECTED',
      'contact_inquiry_form',
      'Invalid phone format or digit count'
    );
    return {
      valid: false,
      error:
        'Please enter a valid phone or WhatsApp number (7–15 digits, e.g. +234 803 000 0000).',
    };
  }

  // 4. Validate email address
  const email = sanitizeTextInput(input.email, 120).toLowerCase();
  if (!email || email.length < 5 || !EMAIL_PATTERN.test(email)) {
    logSecurityEvent(
      'VALIDATION_REJECTED',
      'contact_inquiry_form',
      'Invalid email format'
    );
    return {
      valid: false,
      error: 'Please enter a valid email address (e.g. you@example.com).',
    };
  }

  // 5. Validate inquiry topic against allowlist
  if (!ALLOWED_INQUIRY_TOPICS.includes(input.inquiryTopic as AllowedInquiryTopic)) {
    logSecurityEvent(
      'VALIDATION_REJECTED',
      'contact_inquiry_form',
      'Unrecognized inquiry topic'
    );
    return {
      valid: false,
      error: 'Please choose a valid inquiry subject from the list.',
    };
  }

  // 6. Validate message length and content
  const message = sanitizeTextInput(input.message, 1500);
  if (!message || message.length < 10) {
    logSecurityEvent(
      'VALIDATION_REJECTED',
      'contact_inquiry_form',
      'Message too short or empty'
    );
    return {
      valid: false,
      error: 'Please enter a message of at least 10 characters (maximum 1,500 characters).',
    };
  }

  return {
    valid: true,
    data: {
      fullName,
      email,
      phone,
      inquiryTopic: input.inquiryTopic as AllowedInquiryTopic,
      message,
    },
  };
}

/**
 * Generates a cryptographically strong reference code using the Web Crypto API
 * instead of predictable Math.random().
 */
export function generateSecureReference(
  prefix: 'BBT-2026' | 'BBT-INQ' | 'BBT-SOL' | string
): string {
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    const randomBuffer = new Uint32Array(2);
    window.crypto.getRandomValues(randomBuffer);
    const numericPart = String(100000 + (randomBuffer[0] % 900000));
    const alphaPart = (randomBuffer[1] % 1679616)
      .toString(36)
      .toUpperCase()
      .padStart(4, '0')
      .slice(0, 4);
    return `${prefix}-${numericPart}-${alphaPart}`;
  }
  // Fallback only for non-browser test environments
  const timestampSuffix = String(Date.now()).slice(-6);
  return `${prefix}-${timestampSuffix}`;
}

export interface RateLimitCheckResult {
  allowed: boolean;
  status: 200 | 429;
  retryAfterSeconds: number;
  message?: string;
}

/**
 * Sliding-window rate limiter to protect forms from automated submission floods.
 * Returns HTTP 429 semantics when the threshold is exceeded.
 */
export function checkAndRecordRateLimit(
  actionKey:
    | 'enrolment_submit'
    | 'contact_inquiry_submit'
    | 'solution_demo_request'
    | string,
  maxAttempts = 3,
  windowMs = 10 * 60 * 1000
): RateLimitCheckResult {
  const storageKey = `bbt_rl_${actionKey}`;
  const now = Date.now();
  let timestamps: number[] = [];

  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const raw = window.sessionStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          timestamps = parsed.filter(
            (t): t is number => typeof t === 'number' && Number.isFinite(t)
          );
        }
      }
    } else {
      timestamps = inMemoryRateLimitStore[storageKey] || [];
    }
  } catch {
    timestamps = inMemoryRateLimitStore[storageKey] || [];
  }

  // Keep only attempts within the active sliding window
  const recentAttempts = timestamps.filter((t) => now - t < windowMs);

  if (recentAttempts.length >= maxAttempts) {
    const oldestAttempt = recentAttempts[0];
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((windowMs - (now - oldestAttempt)) / 1000)
    );
    logSecurityEvent(
      'RATE_LIMIT_EXCEEDED',
      actionKey,
      `429 Too Many Requests: ${recentAttempts.length}/${maxAttempts} attempts in window`
    );
    return {
      allowed: false,
      status: 429,
      retryAfterSeconds,
      message: `Too many requests (HTTP 429). Please wait ${retryAfterSeconds} seconds before submitting another request.`,
    };
  }

  recentAttempts.push(now);
  inMemoryRateLimitStore[storageKey] = recentAttempts;

  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem(storageKey, JSON.stringify(recentAttempts));
    }
  } catch {
    // Ignore storage quota errors; in-memory store remains active
  }

  return {
    allowed: true,
    status: 200,
    retryAfterSeconds: 0,
  };
}

/**
 * Validates and normalizes internal navigation targets to prevent Open Redirects,
 * protocol-relative redirects (//evil.com), and dangerous URI schemes (javascript:, data:).
 */
export function sanitizeInternalPath(rawTarget: string): string {
  if (typeof rawTarget !== 'string' || !rawTarget.trim()) {
    return '/';
  }

  const trimmed = rawTarget.trim();

  // Reject dangerous schemes or protocol-relative external URLs
  if (
    /^(?:javascript|data|vbscript|file|blob):/i.test(trimmed) ||
    trimmed.startsWith('//') ||
    trimmed.startsWith('\\\\')
  ) {
    logSecurityEvent(
      'UNSAFE_URL_BLOCKED',
      'router_navigation',
      'Blocked unsafe scheme or protocol-relative navigation target'
    );
    return '/';
  }

  try {
    const baseOrigin =
      typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : 'https://brainbenchtech.vercel.app';
    const parsed = new URL(trimmed, baseOrigin);

    if (parsed.origin !== baseOrigin) {
      logSecurityEvent(
        'UNSAFE_URL_BLOCKED',
        'router_navigation',
        'Blocked cross-origin navigation target'
      );
      return '/';
    }

    const cleanPathname =
      !parsed.pathname || parsed.pathname === '/'
        ? '/'
        : parsed.pathname.replace(/\/+$/, '');
    const normalizedPath = cleanPathname.startsWith('/')
      ? cleanPathname
      : `/${cleanPathname}`;

    return `${normalizedPath}${parsed.search || ''}${parsed.hash || ''}`;
  } catch {
    return '/';
  }
}

/**
 * Validates a hash/DOM element ID before querying the DOM.
 */
export function sanitizeDomId(rawHash: string): string | null {
  if (typeof rawHash !== 'string' || !rawHash) return null;
  const cleaned = rawHash.replace(/^#/, '').trim();
  if (/^[a-zA-Z0-9_-]{1,64}$/.test(cleaned)) {
    return cleaned;
  }
  return null;
}

/**
 * Ensures image URLs only load from trusted local asset paths or HTTPS image sources,
 * blocking javascript:, data:text/html, or SVG script injection vectors.
 */
export function isSafeImageUrl(src: string): boolean {
  if (typeof src !== 'string') return false;
  const trimmed = src.trim();
  if (!trimmed) return false;

  // Reject dangerous URI schemes
  if (/^(?:javascript|vbscript|data|file):/i.test(trimmed)) {
    logSecurityEvent(
      'UNSAFE_ASSET_BLOCKED',
      'image_loader',
      'Blocked non-HTTP/local URI scheme in image src'
    );
    return false;
  }

  // Allow local relative asset paths (/images/..., /assets/...)
  if (
    trimmed.startsWith('/images/') ||
    trimmed.startsWith('/assets/') ||
    trimmed.startsWith('/public/')
  ) {
    return !trimmed.includes('..');
  }

  return false;
}
