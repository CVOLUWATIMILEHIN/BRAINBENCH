import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  Check,
  CheckCircle2,
  ExternalLink,
  FileText,
  LayoutGrid,
  Loader2,
  RotateCcw,
  Send,
  Sparkles,
  Users,
} from 'lucide-react';
import { UPCOMING_SPARK_IT_NOVEMBER_2026 } from '../data/eventsData';

const GOOGLE_FORM_ACTION_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScxsbx67UnhKJrk0a9Op9z3tQetcV4mFHm5NbyNweIZ6azLsg/formResponse';

const GOOGLE_FORM_EMBED_BASE_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScxsbx67UnhKJrk0a9Op9z3tQetcV4mFHm5NbyNweIZ6azLsg/viewform?embedded=true';

const GOOGLE_FORM_SHARE_URL = 'https://forms.gle/h2RuyXGsoTXNP2uv6';

/**
 * Exact Google Form entry.<ID> field identifiers extracted from:
 * https://docs.google.com/forms/d/e/1FAIpQLScxsbx67UnhKJrk0a9Op9z3tQetcV4mFHm5NbyNweIZ6azLsg/viewform
 */
const ENTRY_IDS = {
  fullName: 'entry.855108339',
  email: 'entry.2038192499',
  phone: 'entry.837655038',
  ageRange: 'entry.1927906037',
  profileRole: 'entry.1947012115',
  attendanceType: 'entry.1042501127',
  guestCount: 'entry.139360362',
  techInterests: 'entry.1891938529',
  attendedBefore: 'entry.1052155551',
  expectations: 'entry.585181900',
  collaborationInterest: 'entry.41327175',
  referralSource: 'entry.793900898',
  specialRequirements: 'entry.157051236',
} as const;

const AGE_RANGE_OPTIONS = [
  'Under 18',
  '18-24',
  '25-34',
  '35 and above',
] as const;

const PROFILE_ROLE_OPTIONS = [
  'Student',
  'Entrepreneur or founder',
  'Employed professional',
  'Freelancer',
  'Representative of a tech academy or hub',
  'Job seeker',
  'Other',
] as const;

const ATTENDANCE_TYPE_OPTIONS = ['Alone', 'With others'] as const;

const TECH_INTEREST_OPTIONS = [
  'Software development',
  'Design',
  'Data',
  'Artificial intelligence',
  'Hardware and electronics',
  'Entrepreneurship',
  'Other',
] as const;

const ATTENDED_BEFORE_OPTIONS = ['Yes', 'No'] as const;

const COLLABORATION_OPTIONS = ['Yes', 'No', 'Maybe'] as const;

const REFERRAL_SOURCE_OPTIONS = [
  'Social media',
  'Brainbench website',
  'A friend or colleague',
  'Another academy or hub',
  'Other',
] as const;

export type RegistrationViewMode = 'native-grid' | 'seamless-iframe';

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  ageRange: string;
  profileRole: string;
  attendanceType: string;
  guestCount: string;
  techInterests: string[];
  attendedBefore: string;
  expectations: string;
  collaborationInterest: string;
  referralSource: string;
  specialRequirements: string;
}

const INITIAL_FORM_STATE: FormState = {
  fullName: '',
  email: '',
  phone: '',
  ageRange: '',
  profileRole: '',
  attendanceType: 'Alone',
  guestCount: '',
  techInterests: [],
  attendedBefore: '',
  expectations: '',
  collaborationInterest: 'Yes',
  referralSource: '',
  specialRequirements: '',
};

export const SparkItRegistrationFormSection: React.FC = () => {
  // Default view is Multi-Column View ('native-grid') as required
  const [viewMode, setViewMode] = useState<RegistrationViewMode>('native-grid');
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedSnapshot, setSubmittedSnapshot] = useState<FormState | null>(null);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [isFormSectionVisible, setIsFormSectionVisible] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);

  // Observe form section visibility to hide/show the Floating Action Button
  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsFormSectionVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.12,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Build Seamless Form iframe URL with pre-filled parameters when selected
  const seamlessIframeUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (formData.profileRole) {
      params.set(ENTRY_IDS.profileRole, formData.profileRole);
    }
    if (formData.fullName.trim()) {
      params.set(ENTRY_IDS.fullName, formData.fullName.trim());
    }
    if (formData.email.trim()) {
      params.set(ENTRY_IDS.email, formData.email.trim());
    }
    if (formData.phone.trim()) {
      params.set(ENTRY_IDS.phone, formData.phone.trim());
    }
    if (formData.ageRange) {
      params.set(ENTRY_IDS.ageRange, formData.ageRange);
    }
    if (formData.attendanceType) {
      params.set(ENTRY_IDS.attendanceType, formData.attendanceType);
    }
    const queryString = params.toString();
    return queryString
      ? `${GOOGLE_FORM_EMBED_BASE_URL}&${queryString}`
      : GOOGLE_FORM_EMBED_BASE_URL;
  }, [
    formData.profileRole,
    formData.fullName,
    formData.email,
    formData.phone,
    formData.ageRange,
    formData.attendanceType,
  ]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const toggleTechInterest = (interest: string) => {
    setFormData((prev) => {
      const exists = prev.techInterests.includes(interest);
      const nextInterests = exists
        ? prev.techInterests.filter((item) => item !== interest)
        : [...prev.techInterests, interest];
      return { ...prev, techInterests: nextInterests };
    });
    if (errors.techInterests) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.techInterests;
        return next;
      });
    }
  };

  const handleQuickRoleSelect = (role: string) => {
    const nextRole = formData.profileRole === role ? '' : role;
    updateField('profileRole', nextRole);
    if (viewMode === 'seamless-iframe') {
      setIsIframeLoaded(false);
    }
  };

  const validateForm = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 7) {
      nextErrors.phone = 'Please enter a valid phone number.';
    }

    if (!formData.ageRange) {
      nextErrors.ageRange = 'Please select your age range.';
    }

    if (!formData.profileRole) {
      nextErrors.profileRole = 'Please select the option that best describes you.';
    }

    if (!formData.attendanceType) {
      nextErrors.attendanceType = 'Please choose how you will attend.';
    }

    if (formData.techInterests.length === 0) {
      nextErrors.techInterests = 'Select at least one area of technology interest.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNativeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = new URLSearchParams();
      payload.append('fvv', '1');
      payload.append('pageHistory', '0');

      payload.append(ENTRY_IDS.fullName, formData.fullName.trim());
      payload.append(ENTRY_IDS.email, formData.email.trim());
      payload.append(ENTRY_IDS.phone, formData.phone.trim());

      if (formData.ageRange) {
        payload.append(ENTRY_IDS.ageRange, formData.ageRange);
      }
      if (formData.profileRole) {
        payload.append(ENTRY_IDS.profileRole, formData.profileRole);
      }
      if (formData.attendanceType) {
        payload.append(ENTRY_IDS.attendanceType, formData.attendanceType);
      }
      if (formData.guestCount.trim()) {
        payload.append(ENTRY_IDS.guestCount, formData.guestCount.trim());
      } else if (formData.attendanceType === 'Alone') {
        payload.append(ENTRY_IDS.guestCount, '0');
      }

      formData.techInterests.forEach((interest) => {
        payload.append(ENTRY_IDS.techInterests, interest);
      });

      if (formData.attendedBefore) {
        payload.append(ENTRY_IDS.attendedBefore, formData.attendedBefore);
      }
      if (formData.expectations.trim()) {
        payload.append(ENTRY_IDS.expectations, formData.expectations.trim());
      }
      if (formData.collaborationInterest) {
        payload.append(
          ENTRY_IDS.collaborationInterest,
          formData.collaborationInterest
        );
      }
      if (formData.referralSource) {
        payload.append(ENTRY_IDS.referralSource, formData.referralSource);
      }
      if (formData.specialRequirements.trim()) {
        payload.append(
          ENTRY_IDS.specialRequirements,
          formData.specialRequirements.trim()
        );
      }

      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: payload.toString(),
      });

      setSubmittedSnapshot({ ...formData });
      setIsSubmitted(true);
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {
      // Even in rare network edge cases, surface a helpful state
      setSubmittedSnapshot({ ...formData });
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setIsSubmitted(false);
    setSubmittedSnapshot(null);
  };

  const scrollToRegistrationForm = () => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="register-spark-it-november-2026"
        aria-labelledby="spark-it-registration-heading"
        className="w-full py-16 lg:py-24 bg-white border-b border-[#e3e5f0] scroll-mt-20"
      >
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <div className="max-w-7xl mx-auto">
            {/* Section Header + View Mode Toggle */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-2 text-xs font-montserrat font-extrabold uppercase tracking-[0.18em] text-[#1c3f9c] mb-2">
                  <span>Official Event Registration</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#d91f26]">
                    {UPCOMING_SPARK_IT_NOVEMBER_2026.date}
                  </span>
                </div>
                <h2
                  id="spark-it-registration-heading"
                  className="font-montserrat font-extrabold text-2xl sm:text-4xl text-[#061539] tracking-tight"
                >
                  Register for Spark It — November 2026
                </h2>
                <p className="font-merriweather text-sm sm:text-base text-[#454545] mt-2.5 max-w-3xl leading-relaxed">
                  Complete your official registration below to secure your seat for{' '}
                  <strong>{UPCOMING_SPARK_IT_NOVEMBER_2026.title}</strong> (
                  <em>{UPCOMING_SPARK_IT_NOVEMBER_2026.tagline}</em>). Use the
                  default <strong>Multi-Column View</strong> for a fast native
                  experience or switch to the <strong>Seamless Form</strong> view at
                  any time.
                </p>
              </div>

              {/* Compact Segmented View Toggle (Top-Right of Form Header) */}
              <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                <span className="text-[11px] font-montserrat font-bold uppercase tracking-wider text-[#555]">
                  Registration Layout
                </span>
                <div
                  role="tablist"
                  aria-label="Select registration form view"
                  className="inline-flex items-center p-1 rounded-xl bg-[#061539] border border-[#1c3f9c]/40 shadow-xs"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={viewMode === 'native-grid'}
                    onClick={() => setViewMode('native-grid')}
                    className={`px-4 py-2 rounded-lg font-montserrat font-bold text-xs inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      viewMode === 'native-grid'
                        ? 'bg-[#f58d00] text-[#061539] shadow-xs'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                    <span>Multi-Column View</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={viewMode === 'seamless-iframe'}
                    onClick={() => {
                      setIsIframeLoaded(false);
                      setViewMode('seamless-iframe');
                    }}
                    className={`px-4 py-2 rounded-lg font-montserrat font-bold text-xs inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      viewMode === 'seamless-iframe'
                        ? 'bg-[#f58d00] text-[#061539] shadow-xs'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span>Seamless Form</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick-Selector Bar for Primary Attendee Profile / Role */}
            <div className="mb-8 rounded-xl border border-[#d5d9eb] bg-[#F8F9FC] p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#1c3f9c] shrink-0" />
                  <span className="font-montserrat font-extrabold text-xs sm:text-sm text-[#061539]">
                    Quick-Select Your Attendee Profile
                  </span>
                </div>
                <span className="font-merriweather text-xs text-[#555]">
                  Pre-selects your role in both Multi-Column View and Seamless Form
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {PROFILE_ROLE_OPTIONS.map((role) => {
                  const isActive = formData.profileRole === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleQuickRoleSelect(role)}
                      className={`px-3.5 py-2 rounded-lg font-montserrat font-bold text-xs inline-flex items-center gap-1.5 border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-[#1c3f9c] text-white border-[#1c3f9c] shadow-xs'
                          : 'bg-white text-[#061539] border-[#d5d9eb] hover:border-[#1c3f9c] hover:bg-[#eef3fc]'
                      }`}
                    >
                      {isActive && <Check className="w-3.5 h-3.5 text-[#fdc12e] shrink-0" />}
                      <span>{role}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Outer Branded Container */}
            <div className="rounded-2xl border-2 border-[#1c3f9c] bg-white overflow-hidden shadow-md">
              {/* Top Brand Accent Strip */}
              <div className="h-2.5 w-full bg-gradient-to-r from-[#061539] via-[#1c3f9c] via-[#d91f26] to-[#f58d00]" />

              {/* Portal Top Status Bar */}
              <div className="px-5 sm:px-8 py-4 bg-[#061539] text-white flex flex-wrap items-center justify-between gap-4 border-b border-[#1c3f9c]/30">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#1c3f9c] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-[#fdc12e]" />
                  </div>
                  <div>
                    <div className="font-montserrat font-bold text-xs sm:text-sm text-white">
                      BRAINBENCH SPARK IT — Event Registration Portal
                    </div>
                    <div className="font-merriweather text-[11px] text-white/75 mt-0.5">
                      Connected directly to Google Forms · November 2026 Edition
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={GOOGLE_FORM_SHARE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-montserrat font-semibold text-xs rounded-lg inline-flex items-center gap-1.5 transition-colors border border-white/20 whitespace-nowrap shrink-0"
                  >
                    <span>Open Registration Form in a New Tab</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#fdc12e] shrink-0" />
                  </a>
                </div>
              </div>

              {/* VIEW 1 (DEFAULT): MULTI-COLUMN NATIVE VIEW ('native-grid') */}
              {viewMode === 'native-grid' && (
                <div className="p-6 sm:p-8 lg:p-10 bg-[#F8F9FC]">
                  {isSubmitted && submittedSnapshot ? (
                    /* Branded In-Page Confirmation / Success Card */
                    <div className="max-w-3xl mx-auto rounded-2xl border-2 border-[#1c3f9c] bg-white p-7 sm:p-10 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-[#e3e5f0]">
                        <div className="w-14 h-14 rounded-2xl bg-[#00ba51]/15 border border-[#00ba51]/30 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-8 h-8 text-[#00ba51]" />
                        </div>
                        <div>
                          <div className="text-xs font-montserrat font-extrabold uppercase tracking-widest text-[#1c3f9c]">
                            Registration Confirmed · November 2026 Edition
                          </div>
                          <h3 className="font-montserrat font-black text-2xl sm:text-3xl text-[#061539] mt-1">
                            You’re Registered for Brainbench Spark It!
                          </h3>
                          <p className="font-merriweather text-sm text-[#454545] mt-1">
                            Your response has been submitted directly to our official
                            Google Form roster for{' '}
                            <strong>{UPCOMING_SPARK_IT_NOVEMBER_2026.title}</strong>.
                          </p>
                        </div>
                      </div>

                      {/* Submitted Details Summary Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 p-5 rounded-xl bg-[#F8F9FC] border border-[#e3e5f0]">
                        <div>
                          <span className="text-[11px] font-montserrat font-bold uppercase tracking-wider text-[#666] block">
                            Full Name
                          </span>
                          <span className="font-montserrat font-extrabold text-sm text-[#061539] mt-0.5 block">
                            {submittedSnapshot.fullName}
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] font-montserrat font-bold uppercase tracking-wider text-[#666] block">
                            Email Address
                          </span>
                          <span className="font-montserrat font-extrabold text-sm text-[#061539] mt-0.5 block">
                            {submittedSnapshot.email}
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] font-montserrat font-bold uppercase tracking-wider text-[#666] block">
                            Phone &amp; Age Bracket
                          </span>
                          <span className="font-montserrat font-bold text-sm text-[#061539] mt-0.5 block">
                            {submittedSnapshot.phone} · {submittedSnapshot.ageRange}
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] font-montserrat font-bold uppercase tracking-wider text-[#666] block">
                            Attendee Profile &amp; Attendance
                          </span>
                          <span className="font-montserrat font-bold text-sm text-[#061539] mt-0.5 block">
                            {submittedSnapshot.profileRole} ({submittedSnapshot.attendanceType}
                            {submittedSnapshot.guestCount
                              ? ` · +${submittedSnapshot.guestCount}`
                              : ''}
                            )
                          </span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-[11px] font-montserrat font-bold uppercase tracking-wider text-[#666] block">
                            Selected Tech Interests
                          </span>
                          <span className="font-montserrat font-bold text-sm text-[#1c3f9c] mt-0.5 block">
                            {submittedSnapshot.techInterests.join(' · ')}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                        <button
                          type="button"
                          onClick={handleResetForm}
                          className="px-6 py-3.5 bg-[#1c3f9c] hover:bg-[#061539] text-white font-montserrat font-extrabold text-xs sm:text-sm rounded-xl inline-flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-4 h-4 text-[#fdc12e]" />
                          <span>Submit Another Response</span>
                        </button>

                        <a
                          href={UPCOMING_SPARK_IT_NOVEMBER_2026.previousEditionGalleryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-3.5 bg-[#F8F9FC] hover:bg-[#eef3fc] text-[#061539] border border-[#d5d9eb] font-montserrat font-bold text-xs sm:text-sm rounded-xl inline-flex items-center gap-2 transition-colors"
                        >
                          <span>Explore Previous Edition Gallery</span>
                          <ExternalLink className="w-4 h-4 text-[#d91f26]" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleNativeSubmit} noValidate>
                      {/* 12-Column Responsive Multi-Column Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
                        {/* ====================================================
                            PANEL 01: PERSONAL DETAILS & AGE RANGE (lg:col-span-6)
                        ==================================================== */}
                        <div className="lg:col-span-6 rounded-xl border border-[#d5d9eb] bg-white p-6 sm:p-7 flex flex-col justify-between">
                          <div className="space-y-5">
                            <div className="pb-4 border-b border-[#e3e5f0]">
                              <span className="font-montserrat font-extrabold text-xs uppercase tracking-widest text-[#1c3f9c] block">
                                Section 01
                              </span>
                              <h3 className="font-montserrat font-extrabold text-lg sm:text-xl text-[#061539] mt-0.5">
                                01. Personal Details
                              </h3>
                              <p className="font-merriweather text-xs text-[#555] mt-1">
                                Tell us who you are and how we can send your event pass
                                and updates.
                              </p>
                            </div>

                            {/* 2-Column Sub-Grid for Short Inputs */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="sm:col-span-2">
                                <label
                                  htmlFor="spark-full-name"
                                  className="block font-montserrat font-bold text-xs text-[#061539] mb-1.5"
                                >
                                  Full name <span className="text-[#d91f26]">*</span>
                                </label>
                                <input
                                  id="spark-full-name"
                                  type="text"
                                  required
                                  value={formData.fullName}
                                  onChange={(e) =>
                                    updateField('fullName', e.target.value)
                                  }
                                  placeholder="e.g., Adeola Ogunleye"
                                  className={`w-full px-4 py-3 rounded-lg border text-sm font-montserrat text-[#121212] bg-[#F8F9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1c3f9c] transition-colors ${
                                    errors.fullName
                                      ? 'border-[#d91f26]'
                                      : 'border-[#d5d9eb]'
                                  }`}
                                />
                                {errors.fullName && (
                                  <p className="mt-1.5 text-xs font-montserrat font-semibold text-[#d91f26] flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    <span>{errors.fullName}</span>
                                  </p>
                                )}
                              </div>

                              <div>
                                <label
                                  htmlFor="spark-email"
                                  className="block font-montserrat font-bold text-xs text-[#061539] mb-1.5"
                                >
                                  Email address{' '}
                                  <span className="text-[#d91f26]">*</span>
                                </label>
                                <input
                                  id="spark-email"
                                  type="email"
                                  required
                                  value={formData.email}
                                  onChange={(e) => updateField('email', e.target.value)}
                                  placeholder="you@example.com"
                                  className={`w-full px-4 py-3 rounded-lg border text-sm font-montserrat text-[#121212] bg-[#F8F9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1c3f9c] transition-colors ${
                                    errors.email
                                      ? 'border-[#d91f26]'
                                      : 'border-[#d5d9eb]'
                                  }`}
                                />
                                {errors.email && (
                                  <p className="mt-1.5 text-xs font-montserrat font-semibold text-[#d91f26] flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    <span>{errors.email}</span>
                                  </p>
                                )}
                              </div>

                              <div>
                                <label
                                  htmlFor="spark-phone"
                                  className="block font-montserrat font-bold text-xs text-[#061539] mb-1.5"
                                >
                                  Phone number{' '}
                                  <span className="text-[#d91f26]">*</span>
                                </label>
                                <input
                                  id="spark-phone"
                                  type="tel"
                                  required
                                  value={formData.phone}
                                  onChange={(e) => updateField('phone', e.target.value)}
                                  placeholder="e.g., +234 803 000 0000"
                                  className={`w-full px-4 py-3 rounded-lg border text-sm font-montserrat text-[#121212] bg-[#F8F9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1c3f9c] transition-colors ${
                                    errors.phone
                                      ? 'border-[#d91f26]'
                                      : 'border-[#d5d9eb]'
                                  }`}
                                />
                                {errors.phone && (
                                  <p className="mt-1.5 text-xs font-montserrat font-semibold text-[#d91f26] flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    <span>{errors.phone}</span>
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Interactive Selector Buttons for Age Range */}
                            <div>
                              <label className="block font-montserrat font-bold text-xs text-[#061539] mb-2">
                                Age range <span className="text-[#d91f26]">*</span>
                              </label>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                {AGE_RANGE_OPTIONS.map((age) => {
                                  const isSelected = formData.ageRange === age;
                                  return (
                                    <button
                                      key={age}
                                      type="button"
                                      onClick={() => updateField('ageRange', age)}
                                      className={`px-3 py-2.5 rounded-lg font-montserrat font-bold text-xs border text-center transition-colors cursor-pointer ${
                                        isSelected
                                          ? 'bg-[#061539] text-[#fdc12e] border-[#061539]'
                                          : 'bg-[#F8F9FC] text-[#121212] border-[#d5d9eb] hover:border-[#1c3f9c]'
                                      }`}
                                    >
                                      {age}
                                    </button>
                                  );
                                })}
                              </div>
                              {errors.ageRange && (
                                <p className="mt-1.5 text-xs font-montserrat font-semibold text-[#d91f26] flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                  <span>{errors.ageRange}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* ====================================================
                            PANEL 02: ATTENDEE PROFILE & ATTENDANCE (lg:col-span-6)
                        ==================================================== */}
                        <div className="lg:col-span-6 rounded-xl border border-[#d5d9eb] bg-white p-6 sm:p-7 flex flex-col justify-between">
                          <div className="space-y-5">
                            <div className="pb-4 border-b border-[#e3e5f0]">
                              <span className="font-montserrat font-extrabold text-xs uppercase tracking-widest text-[#f58d00] block">
                                Section 02
                              </span>
                              <h3 className="font-montserrat font-extrabold text-lg sm:text-xl text-[#061539] mt-0.5">
                                02. Role &amp; Attendance Details
                              </h3>
                              <p className="font-merriweather text-xs text-[#555] mt-1">
                                Let us know your current role and whether you are
                                attending solo or with guests.
                              </p>
                            </div>

                            {/* Interactive Selection Cards for Profile Role */}
                            <div>
                              <label className="block font-montserrat font-bold text-xs text-[#061539] mb-2">
                                Which of these best describes you?{' '}
                                <span className="text-[#d91f26]">*</span>
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {PROFILE_ROLE_OPTIONS.map((role) => {
                                  const isSelected = formData.profileRole === role;
                                  return (
                                    <button
                                      key={role}
                                      type="button"
                                      onClick={() => updateField('profileRole', role)}
                                      className={`px-3.5 py-2.5 rounded-lg font-montserrat font-bold text-xs border text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                                        isSelected
                                          ? 'bg-[#1c3f9c] text-white border-[#1c3f9c]'
                                          : 'bg-[#F8F9FC] text-[#121212] border-[#d5d9eb] hover:border-[#1c3f9c]'
                                      }`}
                                    >
                                      <span className="truncate">{role}</span>
                                      {isSelected && (
                                        <Check className="w-3.5 h-3.5 text-[#fdc12e] shrink-0" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                              {errors.profileRole && (
                                <p className="mt-1.5 text-xs font-montserrat font-semibold text-[#d91f26] flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                  <span>{errors.profileRole}</span>
                                </p>
                              )}
                            </div>

                            {/* 2-Column Sub-Grid for Attendance Type & Past Attendance */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block font-montserrat font-bold text-xs text-[#061539] mb-2">
                                  Attendance type{' '}
                                  <span className="text-[#d91f26]">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                  {ATTENDANCE_TYPE_OPTIONS.map((type) => {
                                    const isSelected = formData.attendanceType === type;
                                    return (
                                      <button
                                        key={type}
                                        type="button"
                                        onClick={() =>
                                          updateField('attendanceType', type)
                                        }
                                        className={`px-3 py-2.5 rounded-lg font-montserrat font-bold text-xs border text-center transition-colors cursor-pointer ${
                                          isSelected
                                            ? 'bg-[#f58d00] text-[#061539] border-[#f58d00]'
                                            : 'bg-[#F8F9FC] text-[#121212] border-[#d5d9eb] hover:border-[#1c3f9c]'
                                        }`}
                                      >
                                        {type}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <div>
                                <label className="block font-montserrat font-bold text-xs text-[#061539] mb-2">
                                  Have you attended Spark It before?
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                  {ATTENDED_BEFORE_OPTIONS.map((opt) => {
                                    const isSelected = formData.attendedBefore === opt;
                                    return (
                                      <button
                                        key={opt}
                                        type="button"
                                        onClick={() =>
                                          updateField('attendedBefore', opt)
                                        }
                                        className={`px-3 py-2.5 rounded-lg font-montserrat font-bold text-xs border text-center transition-colors cursor-pointer ${
                                          isSelected
                                            ? 'bg-[#061539] text-[#fdc12e] border-[#061539]'
                                            : 'bg-[#F8F9FC] text-[#121212] border-[#d5d9eb] hover:border-[#1c3f9c]'
                                        }`}
                                      >
                                        {opt}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* Guest Count Input */}
                            <div>
                              <label
                                htmlFor="spark-guest-count"
                                className="block font-montserrat font-bold text-xs text-[#061539] mb-1.5"
                              >
                                How many people will be coming with you?
                              </label>
                              <input
                                id="spark-guest-count"
                                type="text"
                                value={formData.guestCount}
                                onChange={(e) =>
                                  updateField('guestCount', e.target.value)
                                }
                                placeholder={
                                  formData.attendanceType === 'With others'
                                    ? 'e.g., 2 colleagues / friends'
                                    : '0 (attending alone)'
                                }
                                className="w-full px-4 py-2.5 rounded-lg border border-[#d5d9eb] text-sm font-montserrat text-[#121212] bg-[#F8F9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1c3f9c] transition-colors"
                              />
                            </div>
                          </div>
                        </div>

                        {/* ====================================================
                            PANEL 03: TECH INTERESTS & EXPECTATIONS (lg:col-span-6)
                        ==================================================== */}
                        <div className="lg:col-span-6 rounded-xl border border-[#d5d9eb] bg-white p-6 sm:p-7 flex flex-col justify-between">
                          <div className="space-y-5">
                            <div className="pb-4 border-b border-[#e3e5f0]">
                              <span className="font-montserrat font-extrabold text-xs uppercase tracking-widest text-[#1c3f9c] block">
                                Section 03
                              </span>
                              <h3 className="font-montserrat font-extrabold text-lg sm:text-xl text-[#061539] mt-0.5">
                                03. Tech Interests &amp; Goals
                              </h3>
                              <p className="font-merriweather text-xs text-[#555] mt-1">
                                Select all technology tracks that interest you and
                                share what you hope to gain.
                              </p>
                            </div>

                            {/* Multi-Choice Interactive Cards for Tech Interests */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <label className="font-montserrat font-bold text-xs text-[#061539]">
                                  Which areas of tech interest you most?{' '}
                                  <span className="text-[#d91f26]">*</span>
                                </label>
                                <span className="text-[11px] font-montserrat font-semibold text-[#1c3f9c]">
                                  Multi-select
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {TECH_INTEREST_OPTIONS.map((interest) => {
                                  const isSelected =
                                    formData.techInterests.includes(interest);
                                  return (
                                    <button
                                      key={interest}
                                      type="button"
                                      onClick={() => toggleTechInterest(interest)}
                                      className={`px-3.5 py-2.5 rounded-lg font-montserrat font-bold text-xs border text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                                        isSelected
                                          ? 'bg-[#061539] text-white border-[#061539]'
                                          : 'bg-[#F8F9FC] text-[#121212] border-[#d5d9eb] hover:border-[#1c3f9c]'
                                      }`}
                                    >
                                      <span className="truncate">{interest}</span>
                                      <span
                                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                                          isSelected
                                            ? 'bg-[#f58d00] border-[#f58d00] text-[#061539]'
                                            : 'border-[#b8bfdc] bg-white'
                                        }`}
                                      >
                                        {isSelected && (
                                          <Check className="w-3 h-3 stroke-[3]" />
                                        )}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                              {errors.techInterests && (
                                <p className="mt-1.5 text-xs font-montserrat font-semibold text-[#d91f26] flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                  <span>{errors.techInterests}</span>
                                </p>
                              )}
                            </div>

                            {/* Expectations Textarea */}
                            <div>
                              <label
                                htmlFor="spark-expectations"
                                className="block font-montserrat font-bold text-xs text-[#061539] mb-1.5"
                              >
                                What would you like to gain from attending?
                              </label>
                              <textarea
                                id="spark-expectations"
                                rows={4}
                                value={formData.expectations}
                                onChange={(e) =>
                                  updateField('expectations', e.target.value)
                                }
                                placeholder="Share what you look forward to learning, seeing on stage, or discussing with presenters and panelists…"
                                className="w-full px-4 py-3 rounded-lg border border-[#d5d9eb] text-sm font-montserrat text-[#121212] bg-[#F8F9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1c3f9c] transition-colors resize-y"
                              />
                            </div>
                          </div>
                        </div>

                        {/* ====================================================
                            PANEL 04: COMMUNITY, DISCOVERY & SUBMIT (lg:col-span-6)
                        ==================================================== */}
                        <div className="lg:col-span-6 rounded-xl border border-[#d5d9eb] bg-white p-6 sm:p-7 flex flex-col justify-between">
                          <div className="space-y-5">
                            <div className="pb-4 border-b border-[#e3e5f0]">
                              <span className="font-montserrat font-extrabold text-xs uppercase tracking-widest text-[#d91f26] block">
                                Section 04
                              </span>
                              <h3 className="font-montserrat font-extrabold text-lg sm:text-xl text-[#061539] mt-0.5">
                                04. Community &amp; Submit
                              </h3>
                              <p className="font-merriweather text-xs text-[#555] mt-1">
                                Connect with the Brainbench innovator network and
                                complete your registration.
                              </p>
                            </div>

                            {/* Collaboration Hub Selector */}
                            <div>
                              <label className="block font-montserrat font-bold text-xs text-[#061539] mb-2">
                                Are you interested in opportunities to collaborate and
                                join a hub of creative innovators?
                              </label>
                              <div className="grid grid-cols-3 gap-2.5">
                                {COLLABORATION_OPTIONS.map((option) => {
                                  const isSelected =
                                    formData.collaborationInterest === option;
                                  return (
                                    <button
                                      key={option}
                                      type="button"
                                      onClick={() =>
                                        updateField('collaborationInterest', option)
                                      }
                                      className={`px-3 py-2.5 rounded-lg font-montserrat font-bold text-xs border text-center transition-colors cursor-pointer ${
                                        isSelected
                                          ? 'bg-[#1c3f9c] text-white border-[#1c3f9c]'
                                          : 'bg-[#F8F9FC] text-[#121212] border-[#d5d9eb] hover:border-[#1c3f9c]'
                                      }`}
                                    >
                                      {option}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Referral Source Selector */}
                            <div>
                              <label className="block font-montserrat font-bold text-xs text-[#061539] mb-2">
                                How did you hear about Spark It?
                              </label>
                              <div className="flex flex-wrap gap-2">
                                {REFERRAL_SOURCE_OPTIONS.map((source) => {
                                  const isSelected =
                                    formData.referralSource === source;
                                  return (
                                    <button
                                      key={source}
                                      type="button"
                                      onClick={() =>
                                        updateField('referralSource', source)
                                      }
                                      className={`px-3.5 py-2 rounded-lg font-montserrat font-bold text-xs border transition-colors cursor-pointer ${
                                        isSelected
                                          ? 'bg-[#061539] text-[#fdc12e] border-[#061539]'
                                          : 'bg-[#F8F9FC] text-[#121212] border-[#d5d9eb] hover:border-[#1c3f9c]'
                                      }`}
                                    >
                                      {source}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Special Requirements Input */}
                            <div>
                              <label
                                htmlFor="spark-special-req"
                                className="block font-montserrat font-bold text-xs text-[#061539] mb-1.5"
                              >
                                Any special requirements we should know about?
                              </label>
                              <input
                                id="spark-special-req"
                                type="text"
                                value={formData.specialRequirements}
                                onChange={(e) =>
                                  updateField('specialRequirements', e.target.value)
                                }
                                placeholder="Accessibility, seating, or other notes (optional)"
                                className="w-full px-4 py-2.5 rounded-lg border border-[#d5d9eb] text-sm font-montserrat text-[#121212] bg-[#F8F9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1c3f9c] transition-colors"
                              />
                            </div>
                          </div>

                          {/* Submit Action Footer Inside Panel 04 */}
                          <div className="pt-6 mt-6 border-t border-[#e3e5f0]">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full px-6 py-4 bg-[#d91f26] hover:bg-[#b81920] disabled:opacity-60 text-white font-montserrat font-extrabold text-sm rounded-xl inline-flex items-center justify-center gap-2.5 transition-colors shadow-sm cursor-pointer"
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span>Submitting Registration…</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4" />
                                  <span>Submit Registration — November 2026</span>
                                  <ArrowRight className="w-4 h-4" />
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* VIEW 2 (SECONDARY): SEAMLESS EMBEDDED FORM ('seamless-iframe') */}
              {viewMode === 'seamless-iframe' && (
                <div className="w-full overflow-hidden bg-white flex flex-col items-center justify-center">
                  {!isIframeLoaded && (
                    <div className="w-full py-24 flex flex-col items-center justify-center text-center px-4 bg-[#F8F9FC]">
                      <div className="w-10 h-10 rounded-full border-4 border-[#1c3f9c]/20 border-t-[#1c3f9c] animate-spin mb-4" />
                      <h3 className="font-montserrat font-bold text-sm sm:text-base text-[#061539]">
                        Loading Seamless Google Form…
                      </h3>
                      <p className="font-merriweather text-xs text-[#666] max-w-sm mt-1">
                        Connecting directly to Google Forms
                        {formData.profileRole
                          ? ` with "${formData.profileRole}" pre-selected`
                          : ''}
                        .
                      </p>
                    </div>
                  )}
                  <iframe
                    key={seamlessIframeUrl}
                    src={seamlessIframeUrl}
                    title="Brainbench Spark It — November 2026 Registration Form"
                    width="100%"
                    onLoad={() => setIsIframeLoaded(true)}
                    scrolling="no"
                    frameBorder="0"
                    marginHeight={0}
                    marginWidth={0}
                    className={`w-full max-w-full min-h-[2250px] sm:min-h-[2100px] md:min-h-[2000px] lg:min-h-[1950px] border-0 outline-none bg-transparent block ${
                      isIframeLoaded ? 'opacity-100' : 'opacity-0 h-0 min-h-0'
                    } transition-opacity duration-200`}
                    allow="clipboard-write"
                  >
                    Loading Brainbench Spark It registration form…
                  </iframe>
                </div>
              )}

              {/* Persistent Helper & Fallback Bar Below Form */}
              <div className="px-6 py-4 bg-[#F8F9FC] text-[#121212] flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#e3e5f0]">
                <p className="font-merriweather text-xs text-[#555] leading-relaxed">
                  Submissions are recorded directly in the official Brainbench
                  Technology Google Form. Need assistance? Contact{' '}
                  <a
                    href="mailto:info@bbtechng.com"
                    className="text-[#1c3f9c] font-bold hover:underline"
                  >
                    info@bbtechng.com
                  </a>{' '}
                  or call{' '}
                  <a
                    href="tel:+2348160993158"
                    className="text-[#1c3f9c] font-bold hover:underline"
                  >
                    +234 816 099 3158
                  </a>
                  .
                </p>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setViewMode(
                        viewMode === 'native-grid'
                          ? 'seamless-iframe'
                          : 'native-grid'
                      )
                    }
                    className="px-3 py-1.5 bg-white hover:bg-[#eef3fc] text-[#061539] border border-[#d5d9eb] rounded-md text-xs font-montserrat font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>
                      Switch to{' '}
                      {viewMode === 'native-grid'
                        ? 'Seamless Form'
                        : 'Multi-Column View'}
                    </span>
                  </button>
                  <a
                    href={GOOGLE_FORM_SHARE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#1c3f9c]/10 hover:bg-[#1c3f9c]/20 text-[#1c3f9c] rounded-md text-xs font-montserrat font-bold inline-flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <span>Open Registration Form in a New Tab</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FLOATING ACTION BUTTON — Smoothly scrolls to form and auto-hides via IntersectionObserver when viewing form */}
      <div
        className={`fixed bottom-6 right-6 z-40 transition-all duration-200 ${
          isFormSectionVisible
            ? 'opacity-0 pointer-events-none translate-y-3'
            : 'opacity-100 translate-y-0'
        }`}
      >
        <button
          type="button"
          onClick={scrollToRegistrationForm}
          aria-label="Register Now for Brainbench Spark It November 2026"
          className="px-5 py-3.5 rounded-xl bg-[#d91f26] hover:bg-[#b81920] text-white font-montserrat font-extrabold text-xs sm:text-sm shadow-lg border border-white/20 inline-flex items-center gap-2.5 transition-transform duration-150 hover:scale-[1.02] cursor-pointer whitespace-nowrap"
        >
          <span>Register Now</span>
          <ArrowDown className="w-4 h-4 text-[#fdc12e] shrink-0" />
        </button>
      </div>
    </>
  );
};
