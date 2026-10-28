import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from '../router';
import {
  ALLOWED_DEMO_PRODUCTS,
  ALLOWED_DEMO_STATUSES,
  type AllowedDemoProduct,
  type AllowedDemoStatus,
  sanitizeSearchQuery,
  sanitizeTextInput,
} from '../utils/security';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Trash2,
  UserCheck,
  X,
} from 'lucide-react';

const DEFAULT_ADMIN_EMAIL = 'olosundelouis@gmail.com';
const SESSION_TOKEN_STORAGE_KEY = 'bbt_admin_session_token';
const SESSION_USER_STORAGE_KEY = 'bbt_admin_session_user';

export interface AdminUser {
  email: string;
  displayName: string;
}

export interface DemoRequestRecord {
  id: string;
  referenceCode: string;
  fullName: string;
  organisation: string;
  email: string;
  phone: string;
  product: AllowedDemoProduct;
  preferredDate: string;
  message: string;
  status: AllowedDemoStatus;
  notes: string;
  notificationStatus: 'pending' | 'sent' | 'failed' | 'unconfigured';
  notificationDetail: string;
  createdAt: string | null;
  updatedAt: string | null;
}

interface EmailConfigStatus {
  hasNotificationEmailConfigured: boolean;
  hasMailTransportConfigured: boolean;
  transportType: string;
  configuredRecipient: string | null;
  authorizedAdminEmail?: string;
  requiresAccessCode?: boolean;
}

function formatServerTimestamp(isoString: string | null | undefined): string {
  if (!isoString) return 'Just now';
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return 'Recent';
    return date.toLocaleString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Recent';
  }
}

function getStatusBadgeClasses(status: AllowedDemoStatus): string {
  switch (status) {
    case 'New':
      return 'bg-[#1c3f9c]/10 text-[#1c3f9c] border-[#1c3f9c]/25';
    case 'Contacted':
      return 'bg-[#f58220]/15 text-[#b45309] border-[#f58220]/30';
    case 'Demo Scheduled':
      return 'bg-[#7c3aed]/10 text-[#6d28d9] border-[#7c3aed]/25';
    case 'Completed':
      return 'bg-[#10b981]/15 text-[#047857] border-[#10b981]/30';
    case 'Closed':
      return 'bg-[#64748b]/15 text-[#334155] border-[#64748b]/30';
    default:
      return 'bg-[#F8F9FC] text-[#454545] border-[#e3e5f0]';
  }
}

function getProductBadgeClasses(product: AllowedDemoProduct): string {
  switch (product) {
    case 'ULTRA CBT':
      return 'bg-[#061539] text-[#fdc12e]';
    case 'PORTAL PRO':
      return 'bg-[#092279] text-white';
    case 'LMS E-LIBRARY':
      return 'bg-[#059669] text-white';
    default:
      return 'bg-[#1c3f9c] text-white';
  }
}

export const AdminDemoRequestsPage: React.FC = () => {
  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    try {
      return window.sessionStorage.getItem(SESSION_TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    try {
      const raw = window.sessionStorage.getItem(SESSION_USER_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AdminUser) : null;
    } catch {
      return null;
    }
  });
  const [loginEmail, setLoginEmail] = useState<string>(DEFAULT_ADMIN_EMAIL);
  const [accessCode, setAccessCode] = useState<string>('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [requests, setRequests] = useState<DemoRequestRecord[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Filters & Search
  const [productFilter, setProductFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Request Detail Modal / Drawer State
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [draftStatus, setDraftStatus] = useState<AllowedDemoStatus>('New');
  const [draftNotes, setDraftNotes] = useState<string>('');
  const [isSavingUpdate, setIsSavingUpdate] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isRetryingEmail, setIsRetryingEmail] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Server Email Configuration Status
  const [emailConfig, setEmailConfig] = useState<EmailConfigStatus | null>(
    null
  );

  useEffect(() => {
    fetch('/api/admin/config-status')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setEmailConfig(data);
      })
      .catch(() => {
        // Ignore if static preview
      });
  }, []);

  const clearSession = useCallback(() => {
    setSessionToken(null);
    setCurrentUser(null);
    setRequests([]);
    try {
      window.sessionStorage.removeItem(SESSION_TOKEN_STORAGE_KEY);
      window.sessionStorage.removeItem(SESSION_USER_STORAGE_KEY);
    } catch {
      // Ignore storage error
    }
  }, []);

  const fetchDemoRequests = useCallback(
    async (token: string) => {
      setDataLoading(true);
      try {
        const res = await fetch('/api/demo-requests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 401 || res.status === 403) {
          clearSession();
          setDataLoading(false);
          return;
        }
        if (res.ok) {
          const payload = await res.json();
          const rawList = Array.isArray(payload.requests)
            ? payload.requests
            : [];
          const normalized: DemoRequestRecord[] = rawList.map(
            (data: Record<string, unknown>) => ({
              id: String(data.id || ''),
              referenceCode: String(data.referenceCode || data.id || ''),
              fullName: String(data.fullName || ''),
              organisation: String(data.organisation || ''),
              email: String(data.email || ''),
              phone: String(data.phone || ''),
              product: (ALLOWED_DEMO_PRODUCTS.includes(
                data.product as AllowedDemoProduct
              )
                ? data.product
                : 'ULTRA CBT') as AllowedDemoProduct,
              preferredDate: String(data.preferredDate || ''),
              message: String(data.message || ''),
              status: (ALLOWED_DEMO_STATUSES.includes(
                data.status as AllowedDemoStatus
              )
                ? data.status
                : 'New') as AllowedDemoStatus,
              notes: String(data.notes || ''),
              notificationStatus:
                data.notificationStatus === 'sent' ||
                data.notificationStatus === 'failed' ||
                data.notificationStatus === 'unconfigured'
                  ? data.notificationStatus
                  : 'pending',
              notificationDetail: String(data.notificationDetail || ''),
              createdAt: data.createdAt ? String(data.createdAt) : null,
              updatedAt: data.updatedAt ? String(data.updatedAt) : null,
            })
          );
          setRequests(normalized);
        }
      } catch {
        // Network error
      } finally {
        setDataLoading(false);
      }
    },
    [clearSession]
  );

  useEffect(() => {
    if (!sessionToken || !currentUser) {
      setRequests([]);
      return;
    }
    fetchDemoRequests(sessionToken);
  }, [sessionToken, currentUser, fetchDemoRequests]);

  const selectedRequest = useMemo(
    () => requests.find((r) => r.id === selectedRequestId) || null,
    [requests, selectedRequestId]
  );

  // Sync draft status and notes when selecting a request
  useEffect(() => {
    if (selectedRequest) {
      setDraftStatus(selectedRequest.status);
      setDraftNotes(selectedRequest.notes);
      setSaveFeedback(null);
      setUpdateError(null);
      setConfirmDeleteId(null);
    }
  }, [selectedRequest?.id]);

  const filteredRequests = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return requests.filter((req) => {
      const matchesProduct =
        productFilter === 'ALL' || req.product === productFilter;
      const matchesStatus =
        statusFilter === 'ALL' || req.status === statusFilter;
      const matchesSearch =
        !q ||
        req.fullName.toLowerCase().includes(q) ||
        req.email.toLowerCase().includes(q) ||
        req.organisation.toLowerCase().includes(q) ||
        req.referenceCode.toLowerCase().includes(q) ||
        req.phone.toLowerCase().includes(q);
      return matchesProduct && matchesStatus && matchesSearch;
    });
  }, [requests, productFilter, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: requests.length,
      newCount: requests.filter((r) => r.status === 'New').length,
      contactedCount: requests.filter((r) => r.status === 'Contacted').length,
      scheduledCount: requests.filter((r) => r.status === 'Demo Scheduled')
        .length,
      completedCount: requests.filter((r) => r.status === 'Completed').length,
      closedCount: requests.filter((r) => r.status === 'Closed').length,
    };
  }, [requests]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail.trim(),
          accessCode: accessCode.trim(),
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload.ok) {
        setAuthError(
          payload.error || 'Unable to sign in. Verify your administrator email.'
        );
        return;
      }

      setSessionToken(payload.token);
      setCurrentUser(payload.user);
      try {
        window.sessionStorage.setItem(SESSION_TOKEN_STORAGE_KEY, payload.token);
        window.sessionStorage.setItem(
          SESSION_USER_STORAGE_KEY,
          JSON.stringify(payload.user)
        );
      } catch {
        // Ignore storage error
      }
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : 'Unable to reach server.'
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (sessionToken) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${sessionToken}` },
      }).catch(() => {});
    }
    clearSession();
  };

  const handleSaveRequestChanges = async (
    targetRequest: DemoRequestRecord,
    overrideStatus?: AllowedDemoStatus
  ) => {
    if (isSavingUpdate || !sessionToken) return;
    setIsSavingUpdate(true);
    setSaveFeedback(null);
    setUpdateError(null);

    const nextStatus = overrideStatus || draftStatus;
    const cleanNotes = sanitizeTextInput(draftNotes, 3000);

    try {
      const res = await fetch(`/api/demo-requests/${targetRequest.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          status: nextStatus,
          notes: cleanNotes,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save changes.');
      }

      const payload = await res.json();
      if (payload.request) {
        setRequests((prev) =>
          prev.map((r) => (r.id === targetRequest.id ? payload.request : r))
        );
      }
      setDraftStatus(nextStatus);
      setSaveFeedback('Changes saved to server.');
      window.setTimeout(() => setSaveFeedback(null), 3500);
    } catch {
      setUpdateError(
        'Failed to save changes. Verify that your administrator session is active.'
      );
    } finally {
      setIsSavingUpdate(false);
    }
  };

  const handleRetryEmailNotification = async (
    targetRequest: DemoRequestRecord
  ) => {
    if (isRetryingEmail || !sessionToken) return;
    setIsRetryingEmail(true);
    setSaveFeedback(null);
    setUpdateError(null);

    try {
      const response = await fetch('/api/demo-requests/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: targetRequest.id,
          referenceCode: targetRequest.referenceCode,
          fullName: targetRequest.fullName,
          organisation: targetRequest.organisation,
          email: targetRequest.email,
          phone: targetRequest.phone,
          product: targetRequest.product,
          preferredDate: targetRequest.preferredDate,
          message: targetRequest.message,
          submittedAt: formatServerTimestamp(targetRequest.createdAt),
        }),
      });

      const result = await response.json().catch(() => ({
        ok: false,
        status: 'failed',
        detail: 'Invalid response from notification endpoint.',
      }));

      await fetchDemoRequests(sessionToken);

      if (result.ok) {
        setSaveFeedback(result.detail || 'Notification email sent.');
      } else {
        setUpdateError(
          result.detail ||
            'Email notification could not be sent. Check server environment variables.'
        );
      }
    } catch (err) {
      setUpdateError(
        err instanceof Error
          ? err.message
          : 'Could not reach email notification endpoint.'
      );
    } finally {
      setIsRetryingEmail(false);
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    if (!sessionToken) return;
    try {
      const res = await fetch(`/api/demo-requests/${requestId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      if (!res.ok) {
        throw new Error('Delete failed');
      }
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      setSelectedRequestId(null);
      setConfirmDeleteId(null);
    } catch {
      setUpdateError('Unable to delete request.');
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-var(--header-height))] bg-[#F8F9FC] text-[#121212]">
      {/* Top Admin Header Banner */}
      <section className="w-full bg-[#061539] text-white py-10 border-b border-[#1c3f9c]/30">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-montserrat font-bold text-[#fdc12e] uppercase tracking-widest mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>BRAINBENCH TECHNOLOGY &bull; PROTECTED ADMIN PORTAL</span>
            </div>
            <h1 className="font-montserrat font-black text-2xl sm:text-4xl text-white">
              Demo Request Management System
            </h1>
            <p className="font-merriweather text-xs sm:text-sm text-white/80 mt-1.5 max-w-2xl">
              Review, filter, schedule, and record follow-up notes for{' '}
              <strong>ULTRA CBT</strong>, <strong>PORTAL PRO</strong>, and{' '}
              <strong>LMS E-LIBRARY</strong> institutional demo submissions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/solutions"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/25 rounded-lg font-montserrat font-bold text-xs inline-flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Solutions Page</span>
            </Link>

            {currentUser && (
              <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-lg px-3.5 py-2">
                <div className="text-right">
                  <div className="font-montserrat font-bold text-xs text-white">
                    {currentUser.displayName || 'Administrator'}
                  </div>
                  <div className="font-mono-tabular text-[11px] text-[#fdc12e]">
                    {currentUser.email}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="p-2 rounded bg-white/10 hover:bg-[#dc2626] text-white transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 py-10">
        {/* 1. AUTHENTICATION GATE */}
        {!currentUser ? (
          <form
            onSubmit={handleSignIn}
            className="max-w-lg mx-auto bg-white rounded-2xl border border-[#e3e5f0] p-8 sm:p-10 shadow-sm space-y-6"
          >
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#1c3f9c]/10 text-[#1c3f9c] flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <span className="font-montserrat font-extrabold text-xs uppercase tracking-widest text-[#1c3f9c]">
                  AUTHENTICATION REQUIRED
                </span>
                <h2 className="font-montserrat font-extrabold text-2xl text-[#121212] mt-1">
                  Administrator Sign-In
                </h2>
                <p className="font-merriweather text-xs sm:text-sm text-[#454545] mt-2 leading-relaxed">
                  Demo request records are protected on the Brainbench server.
                  Please sign in with your authorized administrator credentials
                  to view and manage submissions.
                </p>
              </div>
            </div>

            {authError && (
              <div className="p-3.5 rounded-lg bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] text-xs font-montserrat font-semibold flex items-start gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#dc2626]" />
                <span>{authError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="admin-email"
                  className="block font-montserrat font-bold text-xs text-[#121212] mb-1.5"
                >
                  Administrator Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8F9FC] border border-[#e3e5f0] rounded-lg text-xs sm:text-sm font-montserrat text-[#121212] focus:outline-none focus:border-[#1c3f9c]"
                  placeholder="Enter authorized admin email"
                />
              </div>

              {emailConfig?.requiresAccessCode && (
                <div>
                  <label
                    htmlFor="admin-access-code"
                    className="block font-montserrat font-bold text-xs text-[#121212] mb-1.5"
                  >
                    Administrator Access Code
                  </label>
                  <input
                    id="admin-access-code"
                    type="password"
                    required
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8F9FC] border border-[#e3e5f0] rounded-lg text-xs sm:text-sm font-montserrat text-[#121212] focus:outline-none focus:border-[#1c3f9c]"
                    placeholder="Enter administrator access code"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 px-6 bg-[#1c3f9c] hover:bg-[#174da8] disabled:opacity-60 text-white font-montserrat font-extrabold text-sm rounded-lg inline-flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-xs"
            >
              {authLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Sign In to Admin Portal</span>
                </>
              )}
            </button>

            <div className="pt-4 border-t border-[#e3e5f0] text-center text-[11px] font-montserrat text-[#454545]">
              Authorized primary administrator:{' '}
              <span className="font-mono-tabular font-bold text-[#121212]">
                {emailConfig?.authorizedAdminEmail || DEFAULT_ADMIN_EMAIL}
              </span>
            </div>
          </form>
        ) : (
          /* 2. AUTHORIZED ADMIN DASHBOARD CONTENT */
          <div className="space-y-8">
            {/* Email Notification Configuration Status Banner */}
            {emailConfig && (
              <div
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  emailConfig.hasNotificationEmailConfigured &&
                  emailConfig.hasMailTransportConfigured
                    ? 'bg-[#ecfdf5] border-[#a7f3d0] text-[#065f46]'
                    : 'bg-[#fffbeb] border-[#fde68a] text-[#92400e]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-xs font-montserrat">
                    <span className="font-extrabold uppercase tracking-wider block">
                      Email Notification Status:{' '}
                      {emailConfig.hasNotificationEmailConfigured &&
                      emailConfig.hasMailTransportConfigured
                        ? `Active (${emailConfig.transportType} → ${emailConfig.configuredRecipient})`
                        : 'Pending Environment Configuration'}
                    </span>
                    <span className="font-merriweather text-[11px] mt-0.5 block">
                      {emailConfig.hasNotificationEmailConfigured &&
                      emailConfig.hasMailTransportConfigured
                        ? 'Every new demo request automatically dispatches an email alert to your configured business address.'
                        : 'All demo requests are saved persistently on the server. To enable automatic email alerts, set DEMO_NOTIFICATION_EMAIL and either RESEND_API_KEY or SMTP_HOST/SMTP_USER/SMTP_PASS in your environment variables.'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer bg-white ${
                  statusFilter === 'ALL'
                    ? 'border-[#1c3f9c] ring-2 ring-[#1c3f9c]/15'
                    : 'border-[#e3e5f0] hover:border-[#1c3f9c]/50'
                }`}
              >
                <div className="font-montserrat font-bold text-[11px] uppercase tracking-wider text-[#454545]">
                  Total Requests
                </div>
                <div className="font-montserrat font-black text-2xl sm:text-3xl text-[#121212] mt-1 tabular-nums">
                  {stats.total}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('New')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer bg-white ${
                  statusFilter === 'New'
                    ? 'border-[#1c3f9c] ring-2 ring-[#1c3f9c]/15'
                    : 'border-[#e3e5f0] hover:border-[#1c3f9c]/50'
                }`}
              >
                <div className="font-montserrat font-bold text-[11px] uppercase tracking-wider text-[#1c3f9c]">
                  New
                </div>
                <div className="font-montserrat font-black text-2xl sm:text-3xl text-[#1c3f9c] mt-1 tabular-nums">
                  {stats.newCount}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('Contacted')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer bg-white ${
                  statusFilter === 'Contacted'
                    ? 'border-[#f58220] ring-2 ring-[#f58220]/20'
                    : 'border-[#e3e5f0] hover:border-[#f58220]/50'
                }`}
              >
                <div className="font-montserrat font-bold text-[11px] uppercase tracking-wider text-[#b45309]">
                  Contacted
                </div>
                <div className="font-montserrat font-black text-2xl sm:text-3xl text-[#b45309] mt-1 tabular-nums">
                  {stats.contactedCount}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('Demo Scheduled')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer bg-white ${
                  statusFilter === 'Demo Scheduled'
                    ? 'border-[#7c3aed] ring-2 ring-[#7c3aed]/15'
                    : 'border-[#e3e5f0] hover:border-[#7c3aed]/50'
                }`}
              >
                <div className="font-montserrat font-bold text-[11px] uppercase tracking-wider text-[#6d28d9]">
                  Demo Scheduled
                </div>
                <div className="font-montserrat font-black text-2xl sm:text-3xl text-[#6d28d9] mt-1 tabular-nums">
                  {stats.scheduledCount}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('Completed')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer bg-white ${
                  statusFilter === 'Completed'
                    ? 'border-[#10b981] ring-2 ring-[#10b981]/15'
                    : 'border-[#e3e5f0] hover:border-[#10b981]/50'
                }`}
              >
                <div className="font-montserrat font-bold text-[11px] uppercase tracking-wider text-[#047857]">
                  Completed
                </div>
                <div className="font-montserrat font-black text-2xl sm:text-3xl text-[#047857] mt-1 tabular-nums">
                  {stats.completedCount}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('Closed')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer bg-white ${
                  statusFilter === 'Closed'
                    ? 'border-[#64748b] ring-2 ring-[#64748b]/15'
                    : 'border-[#e3e5f0] hover:border-[#64748b]/50'
                }`}
              >
                <div className="font-montserrat font-bold text-[11px] uppercase tracking-wider text-[#334155]">
                  Closed
                </div>
                <div className="font-montserrat font-black text-2xl sm:text-3xl text-[#334155] mt-1 tabular-nums">
                  {stats.closedCount}
                </div>
              </button>
            </div>

            {/* Search & Filters Bar */}
            <div className="bg-white rounded-2xl border border-[#e3e5f0] p-5 shadow-2xs">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Search Input */}
                <div className="md:col-span-5 relative">
                  <Search className="w-4 h-4 text-[#454545] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(sanitizeSearchQuery(e.target.value, 100))
                    }
                    placeholder="Search by name, email, organisation, or reference..."
                    className="w-full pl-10 pr-9 py-2.5 bg-[#F8F9FC] border border-[#e3e5f0] rounded-lg text-xs sm:text-sm font-montserrat text-[#121212] focus:outline-none focus:border-[#1c3f9c]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#454545] hover:text-[#121212] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Product Filter */}
                <div className="md:col-span-3 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#1c3f9c] shrink-0" />
                  <select
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                    aria-label="Filter by product"
                    className="w-full px-3 py-2.5 bg-[#F8F9FC] border border-[#e3e5f0] rounded-lg text-xs font-montserrat font-bold text-[#121212] focus:outline-none focus:border-[#1c3f9c]"
                  >
                    <option value="ALL">All Products (3)</option>
                    {ALLOWED_DEMO_PRODUCTS.map((prod) => (
                      <option key={prod} value={prod}>
                        Product: {prod}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div className="md:col-span-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    aria-label="Filter by status"
                    className="w-full px-3 py-2.5 bg-[#F8F9FC] border border-[#e3e5f0] rounded-lg text-xs font-montserrat font-bold text-[#121212] focus:outline-none focus:border-[#1c3f9c]"
                  >
                    <option value="ALL">All Statuses</option>
                    {ALLOWED_DEMO_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        Status: {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reset Button */}
                <div className="md:col-span-1 flex justify-end">
                  {(productFilter !== 'ALL' ||
                    statusFilter !== 'ALL' ||
                    searchQuery.trim() !== '') && (
                    <button
                      type="button"
                      onClick={() => {
                        setProductFilter('ALL');
                        setStatusFilter('ALL');
                        setSearchQuery('');
                      }}
                      className="px-3 py-2.5 text-xs font-montserrat font-bold text-[#dc2626] hover:bg-[#fef2f2] rounded-lg transition-colors cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Main Master-Detail Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left 7 Columns: Demo Requests Table / List */}
              <div
                className={`${
                  selectedRequest ? 'lg:col-span-7' : 'lg:col-span-12'
                } bg-white rounded-2xl border border-[#e3e5f0] overflow-hidden shadow-2xs`}
              >
                <div className="px-6 py-4 border-b border-[#e3e5f0] flex items-center justify-between bg-[#F8F9FC]">
                  <span className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#121212]">
                    Showing {filteredRequests.length} of {requests.length} Demo{' '}
                    {requests.length === 1 ? 'Request' : 'Requests'}
                  </span>
                  <button
                    type="button"
                    onClick={() => sessionToken && fetchDemoRequests(sessionToken)}
                    className="inline-flex items-center gap-1.5 text-xs font-montserrat font-bold text-[#1c3f9c] hover:underline cursor-pointer"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${dataLoading ? 'animate-spin' : ''}`}
                    />
                    <span>{dataLoading ? 'Syncing...' : 'Refresh'}</span>
                  </button>
                </div>

                {filteredRequests.length === 0 ? (
                  <div className="p-14 text-center space-y-3">
                    <FileText className="w-10 h-10 text-[#94a3b8] mx-auto" />
                    <div className="font-montserrat font-bold text-base text-[#121212]">
                      No demo requests match your current filters
                    </div>
                    <p className="font-merriweather text-xs text-[#454545] max-w-md mx-auto">
                      When prospective institutions submit a demo request on the
                      Solutions page, it will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#e3e5f0] bg-white text-[11px] font-montserrat font-extrabold uppercase tracking-wider text-[#454545]">
                          <th className="py-3.5 px-5">Requester &amp; Org</th>
                          <th className="py-3.5 px-4">Product</th>
                          <th className="py-3.5 px-4">Preferred Date</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4">Submitted</th>
                          <th className="py-3.5 px-5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e3e5f0] text-xs font-montserrat">
                        {filteredRequests.map((req) => {
                          const isSelected = req.id === selectedRequestId;
                          return (
                            <tr
                              key={req.id}
                              onClick={() => setSelectedRequestId(req.id)}
                              className={`transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-[#eef3fc]'
                                  : 'hover:bg-[#F8F9FC]'
                              }`}
                            >
                              <td className="py-4 px-5">
                                <div className="font-bold text-[#121212] text-sm">
                                  {req.fullName}
                                </div>
                                <div className="font-semibold text-xs text-[#1c3f9c] mt-0.5">
                                  {req.organisation}
                                </div>
                                <div className="text-[11px] text-[#454545] mt-0.5">
                                  {req.email} &bull; {req.phone}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span
                                  className={`inline-block px-2.5 py-1 rounded text-[11px] font-extrabold ${getProductBadgeClasses(
                                    req.product
                                  )}`}
                                >
                                  {req.product}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-[#121212] font-mono-tabular">
                                {req.preferredDate || (
                                  <span className="text-[#94a3b8]">Flexible</span>
                                )}
                              </td>
                              <td className="py-4 px-4">
                                <span
                                  className={`inline-block px-2.5 py-1 rounded-full border text-[11px] font-bold ${getStatusBadgeClasses(
                                    req.status
                                  )}`}
                                >
                                  {req.status}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-[#454545] whitespace-nowrap">
                                <div>
                                  {formatServerTimestamp(req.createdAt)}
                                </div>
                                <div className="font-mono-tabular text-[10px] text-[#64748b]">
                                  {req.referenceCode}
                                </div>
                              </td>
                              <td className="py-4 px-5 text-right">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedRequestId(req.id);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-[#1c3f9c] hover:bg-[#174da8] text-white font-bold text-xs cursor-pointer"
                                >
                                  Inspect
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Right 5 Columns: Selected Request Inspector & Follow-Up Panel */}
              {selectedRequest && (
                <div className="lg:col-span-5 bg-white rounded-2xl border-2 border-[#1c3f9c] shadow-lg overflow-hidden sticky top-24">
                  <div className="bg-[#061539] text-white px-6 py-5 flex items-start justify-between gap-4">
                    <div>
                      <span className="font-mono-tabular font-bold text-xs text-[#fdc12e]">
                        {selectedRequest.referenceCode}
                      </span>
                      <h3 className="font-montserrat font-extrabold text-xl text-white mt-0.5">
                        {selectedRequest.organisation}
                      </h3>
                      <p className="font-montserrat text-xs text-white/80 mt-0.5">
                        Submitted{' '}
                        {formatServerTimestamp(selectedRequest.createdAt)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedRequestId(null)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                      aria-label="Close details"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-6 space-y-6 max-h-[calc(100vh-220px)] overflow-y-auto">
                    {saveFeedback && (
                      <div className="p-3 rounded-lg bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-xs font-montserrat font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{saveFeedback}</span>
                      </div>
                    )}

                    {updateError && (
                      <div className="p-3 rounded-lg bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] text-xs font-montserrat font-semibold flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{updateError}</span>
                      </div>
                    )}

                    {/* Contact & Request Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#F8F9FC] border border-[#e3e5f0] text-xs font-montserrat">
                      <div>
                        <span className="text-[#64748b] uppercase text-[10px] font-bold block">
                          Requester Full Name
                        </span>
                        <span className="font-bold text-[#121212] text-sm mt-0.5 block">
                          {selectedRequest.fullName}
                        </span>
                      </div>

                      <div>
                        <span className="text-[#64748b] uppercase text-[10px] font-bold block">
                          Product of Interest
                        </span>
                        <span
                          className={`inline-block mt-1 px-2.5 py-0.5 rounded text-[11px] font-extrabold ${getProductBadgeClasses(
                            selectedRequest.product
                          )}`}
                        >
                          {selectedRequest.product}
                        </span>
                      </div>

                      <div>
                        <span className="text-[#64748b] uppercase text-[10px] font-bold block">
                          Work Email
                        </span>
                        <a
                          href={`mailto:${selectedRequest.email}`}
                          className="font-bold text-[#1c3f9c] hover:underline mt-0.5 inline-flex items-center gap-1 break-all"
                        >
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          <span>{selectedRequest.email}</span>
                        </a>
                      </div>

                      <div>
                        <span className="text-[#64748b] uppercase text-[10px] font-bold block">
                          Phone Number
                        </span>
                        <a
                          href={`tel:${selectedRequest.phone}`}
                          className="font-mono-tabular font-bold text-[#121212] hover:text-[#1c3f9c] mt-0.5 inline-flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5 shrink-0 text-[#1c3f9c]" />
                          <span>{selectedRequest.phone}</span>
                        </a>
                      </div>

                      <div>
                        <span className="text-[#64748b] uppercase text-[10px] font-bold block">
                          Organisation / Institution
                        </span>
                        <span className="font-semibold text-[#121212] mt-0.5 inline-flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 shrink-0 text-[#1c3f9c]" />
                          <span>{selectedRequest.organisation}</span>
                        </span>
                      </div>

                      <div>
                        <span className="text-[#64748b] uppercase text-[10px] font-bold block">
                          Preferred Demo Date
                        </span>
                        <span className="font-mono-tabular font-bold text-[#121212] mt-0.5 inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 shrink-0 text-[#f58220]" />
                          <span>
                            {selectedRequest.preferredDate || 'Not specified'}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Additional Message from Visitor */}
                    <div>
                      <h4 className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#121212] mb-2 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#1c3f9c]" />
                        <span>Requester Message</span>
                      </h4>
                      <div className="p-4 rounded-xl bg-[#F8F9FC] border border-[#e3e5f0] font-merriweather text-xs text-[#121212] leading-relaxed whitespace-pre-wrap">
                        {selectedRequest.message ||
                          'No additional message provided by requester.'}
                      </div>
                    </div>

                    {/* Update Workflow Status */}
                    <div className="pt-2 border-t border-[#e3e5f0]">
                      <label className="block font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#121212] mb-2">
                        Update Workflow Status
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {ALLOWED_DEMO_STATUSES.map((st) => {
                          const active = draftStatus === st;
                          return (
                            <button
                              key={st}
                              type="button"
                              disabled={isSavingUpdate}
                              onClick={() => {
                                setDraftStatus(st);
                                handleSaveRequestChanges(selectedRequest, st);
                              }}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-montserrat font-bold transition-all cursor-pointer ${
                                active
                                  ? 'bg-[#1c3f9c] border-[#1c3f9c] text-white shadow-2xs'
                                  : 'bg-[#F8F9FC] border-[#e3e5f0] text-[#454545] hover:border-[#1c3f9c]'
                              }`}
                            >
                              {st}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Internal Follow-Up Notes */}
                    <div className="pt-2 border-t border-[#e3e5f0]">
                      <label
                        htmlFor="admin-followup-notes"
                        className="block font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#121212] mb-1.5"
                      >
                        Internal Follow-Up Notes
                      </label>
                      <textarea
                        id="admin-followup-notes"
                        rows={4}
                        maxLength={3000}
                        value={draftNotes}
                        onChange={(e) =>
                          setDraftNotes(e.target.value.slice(0, 3000))
                        }
                        placeholder="Record call outcomes, scheduled demo link, decision makers, or technical requirements..."
                        className="w-full px-3.5 py-2.5 bg-[#F8F9FC] border border-[#e3e5f0] rounded-xl text-xs font-montserrat text-[#121212] focus:outline-none focus:border-[#1c3f9c]"
                      />
                      <div className="mt-2.5 flex items-center justify-between gap-3">
                        <span className="text-[11px] font-montserrat text-[#64748b] inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            Last updated:{' '}
                            {formatServerTimestamp(selectedRequest.updatedAt)}
                          </span>
                        </span>
                        <button
                          type="button"
                          disabled={isSavingUpdate}
                          onClick={() =>
                            handleSaveRequestChanges(selectedRequest)
                          }
                          className="px-4 py-2 bg-[#1c3f9c] hover:bg-[#174da8] disabled:opacity-60 text-white font-montserrat font-bold text-xs rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          {isSavingUpdate ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <span>Save Notes &amp; Status</span>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Email Notification Delivery & Retry */}
                    <div className="pt-3 border-t border-[#e3e5f0] flex items-center justify-between gap-3">
                      <div className="text-xs font-montserrat">
                        <span className="text-[#64748b] font-semibold">
                          Email Alert:{' '}
                        </span>
                        <span
                          className={`font-bold uppercase ${
                            selectedRequest.notificationStatus === 'sent'
                              ? 'text-[#047857]'
                              : selectedRequest.notificationStatus === 'failed'
                              ? 'text-[#dc2626]'
                              : 'text-[#b45309]'
                          }`}
                        >
                          {selectedRequest.notificationStatus}
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={isRetryingEmail}
                        onClick={() =>
                          handleRetryEmailNotification(selectedRequest)
                        }
                        className="px-3.5 py-1.5 bg-[#F8F9FC] hover:bg-[#eef3fc] text-[#1c3f9c] border border-[#1c3f9c]/30 rounded-lg font-montserrat font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        {isRetryingEmail ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Send / Retry Email Alert</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Delete Request (Two-Step Confirmation) */}
                    <div className="pt-3 border-t border-[#e3e5f0] flex items-center justify-between">
                      {confirmDeleteId === selectedRequest.id ? (
                        <div className="flex items-center gap-2 w-full justify-between">
                          <span className="text-xs font-montserrat font-bold text-[#dc2626]">
                            Permanently delete this record?
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteRequest(selectedRequest.id)
                              }
                              className="px-3 py-1 bg-[#dc2626] text-white text-xs font-montserrat font-bold rounded cursor-pointer"
                            >
                              Confirm Delete
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-3 py-1 bg-[#e3e5f0] text-[#121212] text-xs font-montserrat font-bold rounded cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(selectedRequest.id)}
                          className="text-xs font-montserrat font-semibold text-[#64748b] hover:text-[#dc2626] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Request</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
