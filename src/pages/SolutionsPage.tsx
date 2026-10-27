import React, { useState } from 'react';
import { Link } from '../router';
import {
  checkAndRecordRateLimit,
  generateSecureReference,
  validateContactInquiryForm,
} from '../utils/security';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Building2,
  Check,
  CheckCircle2,
  Cpu,
  Database,
  ExternalLink,
  FileCheck,
  GraduationCap,
  HardDrive,
  Headphones,
  Laptop,
  Layers,
  Lock,
  Mail,
  MapPin,
  Phone,
  Server,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';

interface SolutionsPageProps {
  onOpenEnrol?: () => void;
}

export interface SolutionProduct {
  id: 'ultra-cbt' | 'portal-pro' | 'lms-elibrary';
  code: string;
  name: string;
  tagline: string;
  badge: string;
  accentColor: string;
  secondaryColor: string;
  description: string;
  summary: string;
  targetAudience: string[];
  keyCapabilities: {
    title: string;
    description: string;
  }[];
  specifications: {
    deployment: string;
    capacity: string;
    security: string;
    compatibility: string;
  };
  ctaLabel: string;
}

export const SOLUTIONS_DATA: SolutionProduct[] = [
  {
    id: 'ultra-cbt',
    code: 'CBT-01',
    name: 'ULTRA CBT',
    tagline: 'Computer-Based Testing & High-Stakes Examination Management',
    badge: 'Examination & Assessment Suite',
    accentColor: '#1c3f9c',
    secondaryColor: '#fdc12e',
    summary:
      'A resilient, tamper-proof computer-based testing engine built for schools, tertiary institutions, recruitment agencies, and mass certification centers.',
    description:
      'ULTRA CBT delivers a secure, end-to-end examination ecosystem. From intelligent multi-subject question banking and automated paper shuffling to synchronized anti-cheat timers, offline LAN redundancy, and instant result processing, ULTRA CBT guarantees zero examination disruption and transparent candidate evaluation.',
    targetAudience: [
      'Secondary Schools & Junior Colleges',
      'Universities, Polytechnics & Colleges of Education',
      'Professional Certification & Licensure Bodies',
      'Corporate Recruitment & Staff Aptitude Testing',
    ],
    keyCapabilities: [
      {
        title: 'Offline LAN & Cloud Hybrid Resilience',
        description:
          'Runs effortlessly on local area networks without active internet access during examinations, with automatic cloud sync when connectivity resumes.',
      },
      {
        title: 'Anti-Malpractice & Strict Session Control',
        description:
          'Automated question and option randomization, randomized question numbering, fullscreen lockdown, and strict candidate session timeouts.',
      },
      {
        title: 'Rich Question Banking & Multimedia Support',
        description:
          'Supports multiple question formats including multiple-choice, true/false, fill-in-the-gap, and questions with equations, diagrams, and audio prompts.',
      },
      {
        title: 'Automated Scoring & Immediate Transcripts',
        description:
          'Instant, error-free automated grading with real-time score compilation, performance breakdowns, item difficulty analytics, and printable candidate slips.',
      },
      {
        title: 'Proctor & Center Administration Console',
        description:
          'Real-time proctor dashboard showing active candidate progress, network status, instant re-activation for accidental restarts, and audit trails.',
      },
    ],
    specifications: {
      deployment: 'On-premise Local Area Network (LAN), Private Server, or Cloud',
      capacity: 'Scales from 50 to 5,000+ concurrent test-takers per center',
      security: 'End-to-end session encryption, time-lock seals, and access controls',
      compatibility: 'Windows, macOS, Linux, ChromeOS, and standard web browsers',
    },
    ctaLabel: 'Explore ULTRA CBT',
  },
  {
    id: 'portal-pro',
    code: 'SMS-02',
    name: 'PORTAL PRO',
    tagline: 'Comprehensive School Portal & Digital School Management Solution',
    badge: 'Institutional Management Platform',
    accentColor: '#092279',
    secondaryColor: '#f58220',
    summary:
      'An all-in-one digital campus ecosystem that unites student records, academic grade computation, fee tracking, and parent communications into one intuitive platform.',
    description:
      'PORTAL PRO replaces fragmented paperwork and manual spreadsheets with an integrated institutional operating system. Administrators, teachers, parents, and students access role-based dashboards to manage admissions, publish authentic terminal report sheets, verify fee clearances, and communicate seamlessly.',
    targetAudience: [
      'Nursery, Primary & Secondary Schools',
      'Private High Schools & Academy Networks',
      'Tertiary Institutions & Specialist Colleges',
      'School Boards & Multi-Branch Educational Groups',
    ],
    keyCapabilities: [
      {
        title: 'Student Information & Lifetime Records',
        description:
          'Complete student profiles, biographical records, class assignments, attendance tracking, and medical/emergency contacts with secure archival.',
      },
      {
        title: 'Automated Result Computation & Report Cards',
        description:
          'Calculates continuous assessments (CA) and exam marks automatically, generates broadsheets, and prints official branded report cards with grading rubrics.',
      },
      {
        title: 'Fee Collection, Invoicing & Receipts',
        description:
          'Automated invoice generation, payment tracking, bank receipt reconciliation, debtor alerts, and financial summary reporting for management.',
      },
      {
        title: 'Parent & Guardian Self-Service Portal',
        description:
          'Dedicated web and mobile access for parents to review children’s academic progress, attendance records, school announcements, and payment history.',
      },
      {
        title: 'Staff Administration & Duty Scheduling',
        description:
          'Staff profile management, subject allocation, lesson notes submission workflow, class teacher assignments, and administrative announcements.',
      },
    ],
    specifications: {
      deployment: 'Managed Cloud Hosted or Dedicated Institutional Domain',
      capacity: 'Unlimited students, teachers, classes, and administrative staff',
      security: 'Role-Based Access Control (RBAC), daily backups, SSL/TLS encryption',
      compatibility: 'Responsive web application accessible on phones, tablets, and PCs',
    },
    ctaLabel: 'Explore Portal Pro',
  },
  {
    id: 'lms-elibrary',
    code: 'LIB-03',
    name: 'LMS E-LIBRARY',
    tagline: 'Digital Learning Repository & Electronic Library Solution',
    badge: 'Digital Learning & Academic Content',
    accentColor: '#1c3f9c',
    secondaryColor: '#059669',
    summary:
      'A modern academic digital library and learning management solution providing instant, searchable access to textbooks, past questions, and digital coursework.',
    description:
      'LMS E-LIBRARY bridges the resource gap for schools and tertiary institutions. It combines an organized digital catalogue of e-books, research documents, and past examination papers with modular learning management capabilities, empowering students to study anywhere, anytime, with or without full-time internet.',
    targetAudience: [
      'School Libraries & Academic Resource Centers',
      'Colleges, Polytechnics & Universities',
      'Study Centers & Professional Training Institutes',
      'Students, Researchers & Teaching Faculties',
    ],
    keyCapabilities: [
      {
        title: 'Centralized Digital Knowledge Repository',
        description:
          'Houses thousands of curated e-books, journals, curriculum guides, past examination questions, and multimedia video/audio instructional resources.',
      },
      {
        title: 'Smart Categorization & Multi-Filter Search',
        description:
          'Full-text search, subject taxonomy, author indexing, Dewey/ISBN metadata classification, and instant book previews for quick discovery.',
      },
      {
        title: 'Integrated Coursework & Digital Assignments',
        description:
          'Teachers can publish lecture materials, reading lists, quizzes, and self-paced study units linked directly to library resources.',
      },
      {
        title: 'Local Campus Cache & Offline Reading',
        description:
          'Optimized for Nigerian institutional infrastructure with local caching options, reducing external bandwidth costs while keeping access instant.',
      },
      {
        title: 'Reader Analytics & Resource Usage Audits',
        description:
          'Detailed insights into most-borrowed digital titles, student reading engagement, department study trends, and resource gap identification.',
      },
    ],
    specifications: {
      deployment: 'Campus Intranet Server, Hybrid Local Storage, or Cloud Portal',
      capacity: 'Supports tens of thousands of digital volumes and concurrent readers',
      security: 'Digital rights controls, watermarking, student login authentication',
      compatibility: 'Web-based e-reader compatible with PDF, ePub, MP4, and standard formats',
    },
    ctaLabel: 'Explore LMS E-Library',
  },
];

export const SolutionsPage: React.FC<SolutionsPageProps> = () => {
  const [activeSolutionId, setActiveSolutionId] = useState<
    'ultra-cbt' | 'portal-pro' | 'lms-elibrary'
  >('ultra-cbt');

  // Interactive Demo / Inquiry Form State
  const [institutionName, setInstitutionName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedProductInterest, setSelectedProductInterest] = useState<string[]>(
    ['ULTRA CBT']
  );
  const [institutionSize, setInstitutionSize] = useState('500 - 2,000 students');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [validatedContact, setValidatedContact] = useState<string>('');

  const activeProduct =
    SOLUTIONS_DATA.find((p) => p.id === activeSolutionId) || SOLUTIONS_DATA[0];

  const handleToggleProductInterest = (productName: string) => {
    setSelectedProductInterest((prev) =>
      prev.includes(productName)
        ? prev.length > 1
          ? prev.filter((p) => p !== productName)
          : prev
        : [...prev, productName]
    );
  };

  const handleProductSelectAndScroll = (
    solutionId: 'ultra-cbt' | 'portal-pro' | 'lms-elibrary'
  ) => {
    setActiveSolutionId(solutionId);
    const prod = SOLUTIONS_DATA.find((s) => s.id === solutionId);
    if (prod && !selectedProductInterest.includes(prod.name)) {
      setSelectedProductInterest((prev) => [...prev, prod.name]);
    }
    const el = document.getElementById(`solution-${solutionId}`);
    if (el) {
      const headerOffset = 84;
      const pos = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: Math.max(0, pos - headerOffset), behavior: 'smooth' });
    }
  };

  const handleScrollToDemo = (productToPreselect?: string) => {
    if (productToPreselect && !selectedProductInterest.includes(productToPreselect)) {
      setSelectedProductInterest((prev) => [...prev, productToPreselect]);
    }
    const el = document.getElementById('request-demo');
    if (el) {
      const headerOffset = 84;
      const pos = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: Math.max(0, pos - headerOffset), behavior: 'smooth' });
    }
  };

  const handleSubmitDemoRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const fullMessage = `Institution: ${institutionName.trim()} | Size: ${institutionSize} | Products of Interest: ${selectedProductInterest.join(
      ', '
    )} | Details: ${message.trim()}`;

    const validation = validateContactInquiryForm({
      fullName: contactName,
      email,
      phone,
      inquiryTopic: 'Software Solutions Demo (ULTRA CBT, PORTAL PRO, LMS)',
      message: fullMessage,
      honeypot,
    });

    if (!validation.valid || !validation.data) {
      setFormError(
        validation.error ||
          'Please ensure all required fields are correctly completed.'
      );
      return;
    }

    if (institutionName.trim().length < 2) {
      setFormError('Please provide the official name of your institution.');
      return;
    }

    const rateLimit = checkAndRecordRateLimit(
      'solution_demo_request',
      3,
      10 * 60 * 1000
    );
    if (!rateLimit.allowed) {
      setFormError(
        rateLimit.message ||
          'Too many demo requests submitted recently. Please wait a few minutes before trying again.'
      );
      return;
    }

    setValidatedContact(validation.data.fullName);
    setSubmittedTicket(generateSecureReference('BBT-SOL'));
  };

  return (
    <div className="w-full bg-white text-[#121212]">
      {/* =====================================================================
          1. HERO SECTION: Institutional Software Solutions
      ===================================================================== */}
      <section className="relative w-full bg-[#061539] text-white py-20 lg:py-28 overflow-hidden border-b border-[#1c3f9c]/30">
        {/* Abstract subtle background grid and glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, #1c3f9c 0%, transparent 45%), radial-gradient(circle at 80% 70%, #d91f26 0%, transparent 40%)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 relative z-10">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-montserrat font-semibold text-white/75 mb-6"
          >
            <Link to="/" className="hover:text-[#fdc12e] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#fdc12e]">Solutions</span>
          </nav>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-[#fdc12e] animate-pulse" />
              <span className="font-montserrat font-extrabold text-xs sm:text-[13px] tracking-[0.2em] uppercase text-[#fdc12e]">
                BRAINBENCH TECHNOLOGY SOFTWARE PRODUCTS
              </span>
            </div>

            <h1 className="font-montserrat font-black text-3xl sm:text-5xl lg:text-[56px] leading-[1.08] tracking-tight text-white">
              Institutional Software Solutions Built for Real-World Impact.
            </h1>

            <p className="font-merriweather text-base sm:text-lg text-white/90 leading-relaxed mt-6 max-w-3xl">
              Modernise your school, college, or examination center with
              Brainbench Technology’s battle-tested software suites. From
              high-stakes computer-based testing with <strong>ULTRA CBT</strong>,
              to digital campus administration with <strong>PORTAL PRO</strong>,
              and comprehensive academic research with <strong>LMS E-LIBRARY</strong>,
              we deliver reliable, secure, and locally supported digital tools.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => handleScrollToDemo()}
                className="px-7 py-4 bg-[#f58220] hover:bg-[#fdc12e] text-[#121212] font-montserrat font-extrabold text-sm rounded-lg inline-flex items-center gap-2.5 shadow-md transition-all cursor-pointer"
              >
                <span>Request a Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#products-overview"
                className="px-7 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-montserrat font-bold text-sm rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Explore Products</span>
                <Layers className="w-4 h-4" />
              </a>

              <Link
                to="/courses"
                className="px-6 py-4 text-white/80 hover:text-white font-montserrat font-semibold text-xs sm:text-sm inline-flex items-center gap-2 hover:underline transition-colors"
              >
                <span>Looking for student courses? View Course Catalogue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. INSTITUTIONAL TRUST & KEY PILLARS
      ===================================================================== */}
      <section className="w-full bg-white border-b border-[#e3e5f0] py-14 lg:py-18">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border border-[#e3e5f0] bg-[#F8F9FC] flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-lg bg-[#1c3f9c]/10 text-[#1c3f9c] flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-montserrat font-extrabold text-base text-[#121212]">
                  Exam Integrity &amp; Security
                </h3>
                <p className="font-merriweather text-xs sm:text-[13px] text-[#454545] leading-relaxed mt-2">
                  Tamper-resistant question delivery, anti-cheating browser locks,
                  and encrypted score compilation prevent unauthorized access and leaks.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e3e5f0] text-[11px] font-montserrat font-bold text-[#1c3f9c]">
                ZERO LEAKS &bull; PROCTOR VERIFIED
              </div>
            </div>

            <div className="p-6 rounded-xl border border-[#e3e5f0] bg-[#F8F9FC] flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-lg bg-[#f58220]/15 text-[#d97706] flex items-center justify-center mb-4">
                  <Server className="w-6 h-6" />
                </div>
                <h3 className="font-montserrat font-extrabold text-base text-[#121212]">
                  Offline LAN Redundancy
                </h3>
                <p className="font-merriweather text-xs sm:text-[13px] text-[#454545] leading-relaxed mt-2">
                  Designed specifically for real-world African infrastructure. Exams
                  continue seamlessly even during sudden internet outages.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e3e5f0] text-[11px] font-montserrat font-bold text-[#f58220]">
                ZERO NETWORK DOWNTIME
              </div>
            </div>

            <div className="p-6 rounded-xl border border-[#e3e5f0] bg-[#F8F9FC] flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-lg bg-[#059669]/15 text-[#059669] flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-montserrat font-extrabold text-base text-[#121212]">
                  Instant Results &amp; Analytics
                </h3>
                <p className="font-merriweather text-xs sm:text-[13px] text-[#454545] leading-relaxed mt-2">
                  Automated result processing eliminates weeks of manual scoring,
                  human compilation error, and delayed academic report distributions.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e3e5f0] text-[11px] font-montserrat font-bold text-[#059669]">
                SAME-DAY SCORE TRANSCRIPTS
              </div>
            </div>

            <div className="p-6 rounded-xl border border-[#e3e5f0] bg-[#F8F9FC] flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-lg bg-[#dc2626]/10 text-[#dc2626] flex items-center justify-center mb-4">
                  <Headphones className="w-6 h-6" />
                </div>
                <h3 className="font-montserrat font-extrabold text-base text-[#121212]">
                  Dedicated Local Support
                </h3>
                <p className="font-merriweather text-xs sm:text-[13px] text-[#454545] leading-relaxed mt-2">
                  On-the-ground technical engineers based right here in Ekiti State
                  and across Nigeria, ready for onsite setup, training, and exam proctoring.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e3e5f0] text-[11px] font-montserrat font-bold text-[#dc2626]">
                ONSITE &amp; RAPID RESPONSE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. FEATURED PRODUCTS OVERVIEW & QUICK SWITCHER
      ===================================================================== */}
      <section
        id="products-overview"
        className="w-full bg-[#F8F9FC] border-b border-[#e3e5f0] py-16 lg:py-24 scroll-mt-20"
      >
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="w-6 h-[2.5px] bg-[#f58220] rounded-full" />
                <span className="font-montserrat font-extrabold text-xs uppercase tracking-[0.2em] text-[#1c3f9c]">
                  PORTFOLIO OF 3 CORE SOLUTIONS
                </span>
              </div>
              <h2 className="font-montserrat font-extrabold text-3xl sm:text-4xl text-[#121212]">
                Purpose-Built Software for Education
              </h2>
            </div>
            <p className="font-merriweather text-xs sm:text-sm text-[#454545] max-w-md">
              Each solution operates independently or integrates into a unified
              institutional digital campus platform.
            </p>
          </div>

          {/* Product Quick Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {SOLUTIONS_DATA.map((product) => {
              const isActive = activeSolutionId === product.id;
              return (
                <div
                  key={product.id}
                  onClick={() => handleProductSelectAndScroll(product.id)}
                  className={`rounded-2xl border-2 transition-all p-7 bg-white cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'border-[#1c3f9c] shadow-lg ring-2 ring-[#1c3f9c]/15 -translate-y-1'
                      : 'border-[#e3e5f0] hover:border-[#1c3f9c]/60 hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="font-mono-tabular font-bold text-xs px-2.5 py-1 rounded bg-[#061539] text-[#fdc12e]">
                        {product.code}
                      </span>
                      <span className="font-montserrat font-bold text-[11px] px-3 py-1 rounded-full bg-[#fdf6e7] text-[#092279] border border-[#eadfc9]">
                        {product.badge}
                      </span>
                    </div>

                    <h3 className="font-montserrat font-black text-2xl text-[#121212]">
                      {product.name}
                    </h3>

                    <p className="font-montserrat font-semibold text-xs text-[#1c3f9c] mt-1">
                      {product.tagline}
                    </p>

                    <p className="font-merriweather text-xs sm:text-sm text-[#454545] mt-3 leading-relaxed">
                      {product.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-[#e3e5f0] flex items-center justify-between">
                    <span className="font-montserrat font-bold text-xs text-[#1c3f9c] group-hover:underline">
                      {isActive ? 'Currently Viewing' : product.ctaLabel}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#1c3f9c]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. DEEP-DIVE: PRODUCT 1 — ULTRA CBT
      ===================================================================== */}
      <section
        id="solution-ultra-cbt"
        className="w-full bg-white border-b border-[#e3e5f0] py-20 lg:py-28 scroll-mt-20"
      >
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left 7 Columns: Product Details & Key Capabilities */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5">
                <span className="px-3 py-1 rounded bg-[#1c3f9c] text-white font-mono-tabular font-bold text-xs">
                  CBT-01
                </span>
                <span className="font-montserrat font-extrabold text-xs uppercase tracking-widest text-[#1c3f9c]">
                  EXAMINATION MANAGEMENT SYSTEM
                </span>
              </div>

              <h2 className="font-montserrat font-black text-3xl sm:text-5xl text-[#121212] tracking-tight">
                ULTRA CBT
              </h2>

              <p className="font-montserrat font-bold text-base sm:text-lg text-[#1c3f9c]">
                Computer-Based Testing, Automated Assessment &amp; Result Processing
              </p>

              <p className="font-merriweather text-sm sm:text-base text-[#454545] leading-relaxed">
                ULTRA CBT is Brainbench Technology’s flagship examination system,
                engineered to eliminate paper consumption, eradicate exam leakage,
                and shorten the grading cycle from weeks to seconds. Whether
                deployed in a single secondary school hall or a 1,000-seat
                tertiary center, ULTRA CBT provides unrivaled testing resilience.
              </p>

              {/* Key Capabilities Bullet Grid */}
              <div className="pt-4 space-y-4">
                <h4 className="font-montserrat font-extrabold text-sm uppercase tracking-wider text-[#121212]">
                  Key Capabilities &amp; Engine Features:
                </h4>
                <div className="space-y-3">
                  {SOLUTIONS_DATA[0].keyCapabilities.map((cap, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-[#e3e5f0] bg-[#F8F9FC] flex items-start gap-3.5"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#1c3f9c] text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <div>
                        <h5 className="font-montserrat font-bold text-sm text-[#121212]">
                          {cap.title}
                        </h5>
                        <p className="font-merriweather text-xs sm:text-[13px] text-[#454545] leading-relaxed mt-1">
                          {cap.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleScrollToDemo('ULTRA CBT')}
                  className="px-6 py-3.5 bg-[#1c3f9c] hover:bg-[#174da8] text-white font-montserrat font-extrabold text-xs sm:text-sm rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Request ULTRA CBT Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScrollToDemo('ULTRA CBT')}
                  className="px-6 py-3.5 bg-[#fdf6e7] hover:bg-[#f3ead6] text-[#092279] border border-[#eadfc9] font-montserrat font-bold text-xs sm:text-sm rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Get Centre Setup Quote</span>
                </button>
              </div>
            </div>

            {/* Right 5 Columns: Specification & Architecture Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#061539] text-white rounded-2xl p-7 sm:p-8 shadow-xl border border-[#1c3f9c]/40">
                <div className="flex items-center justify-between pb-5 border-b border-white/15">
                  <div className="flex items-center gap-2">
                    <Laptop className="w-5 h-5 text-[#fdc12e]" />
                    <span className="font-montserrat font-extrabold text-sm text-white">
                      System Architecture
                    </span>
                  </div>
                  <span className="text-[11px] font-mono-tabular px-2.5 py-0.5 rounded bg-white/10 text-[#fdc12e]">
                    v4.2 Production
                  </span>
                </div>

                <div className="mt-6 space-y-4 text-xs font-montserrat">
                  <div>
                    <span className="text-white/60 uppercase tracking-wider block text-[10px]">
                      Deployment Models
                    </span>
                    <span className="font-bold text-sm text-white mt-1 block">
                      {SOLUTIONS_DATA[0].specifications.deployment}
                    </span>
                  </div>

                  <div>
                    <span className="text-white/60 uppercase tracking-wider block text-[10px]">
                      Throughput Capacity
                    </span>
                    <span className="font-bold text-sm text-[#fdc12e] mt-1 block">
                      {SOLUTIONS_DATA[0].specifications.capacity}
                    </span>
                  </div>

                  <div>
                    <span className="text-white/60 uppercase tracking-wider block text-[10px]">
                      Security &amp; Integrity
                    </span>
                    <span className="font-bold text-sm text-white mt-1 block">
                      {SOLUTIONS_DATA[0].specifications.security}
                    </span>
                  </div>

                  <div>
                    <span className="text-white/60 uppercase tracking-wider block text-[10px]">
                      Client Device Compatibility
                    </span>
                    <span className="font-bold text-sm text-white mt-1 block">
                      {SOLUTIONS_DATA[0].specifications.compatibility}
                    </span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/15">
                  <h5 className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#fdc12e] mb-3">
                    Ideal For:
                  </h5>
                  <ul className="space-y-2 text-xs font-merriweather text-white/85">
                    {SOLUTIONS_DATA[0].targetAudience.map((target, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                        <span>{target}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Highlight callout */}
              <div className="p-6 rounded-2xl bg-[#fdf6e7] border border-[#eadfc9]">
                <div className="flex items-start gap-3">
                  <Cpu className="w-5 h-5 text-[#f58220] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-montserrat font-extrabold text-xs text-[#0b132b] uppercase tracking-wider">
                      Turnkey CBT Center Installation
                    </h5>
                    <p className="font-merriweather text-xs text-[#454545] mt-1.5 leading-relaxed">
                      Need a complete physical CBT facility? Brainbench Technology also
                      supplies server racks, local network cabling, client terminals,
                      uninterruptible power supply (UPS) planning, and staff invigilator training.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. DEEP-DIVE: PRODUCT 2 — PORTAL PRO
      ===================================================================== */}
      <section
        id="solution-portal-pro"
        className="w-full bg-[#F8F9FC] border-b border-[#e3e5f0] py-20 lg:py-28 scroll-mt-20"
      >
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left 5 Columns: System Architecture & Modules */}
            <div className="lg:col-span-5 order-2 lg:order-1 space-y-6">
              <div className="bg-[#092279] text-white rounded-2xl p-7 sm:p-8 shadow-xl border border-[#092279]/40">
                <div className="flex items-center justify-between pb-5 border-b border-white/15">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-[#f58220]" />
                    <span className="font-montserrat font-extrabold text-sm text-white">
                      Campus Portals &amp; Modules
                    </span>
                  </div>
                  <span className="text-[11px] font-mono-tabular px-2.5 py-0.5 rounded bg-white/10 text-[#fdc12e]">
                    Integrated Suite
                  </span>
                </div>

                <div className="mt-6 space-y-4 text-xs font-montserrat">
                  <div>
                    <span className="text-white/60 uppercase tracking-wider block text-[10px]">
                      Hosting Model
                    </span>
                    <span className="font-bold text-sm text-white mt-1 block">
                      {SOLUTIONS_DATA[1].specifications.deployment}
                    </span>
                  </div>

                  <div>
                    <span className="text-white/60 uppercase tracking-wider block text-[10px]">
                      Student &amp; Staff Capacity
                    </span>
                    <span className="font-bold text-sm text-[#fdc12e] mt-1 block">
                      {SOLUTIONS_DATA[1].specifications.capacity}
                    </span>
                  </div>

                  <div>
                    <span className="text-white/60 uppercase tracking-wider block text-[10px]">
                      Data Privacy &amp; Encryption
                    </span>
                    <span className="font-bold text-sm text-white mt-1 block">
                      {SOLUTIONS_DATA[1].specifications.security}
                    </span>
                  </div>

                  <div>
                    <span className="text-white/60 uppercase tracking-wider block text-[10px]">
                      Platform Access
                    </span>
                    <span className="font-bold text-sm text-white mt-1 block">
                      {SOLUTIONS_DATA[1].specifications.compatibility}
                    </span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/15">
                  <h5 className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#fdc12e] mb-3">
                    Recommended For:
                  </h5>
                  <ul className="space-y-2 text-xs font-merriweather text-white/85">
                    {SOLUTIONS_DATA[1].targetAudience.map((target, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                        <span>{target}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Administrative Efficiency Highlight */}
              <div className="p-6 rounded-2xl bg-white border border-[#e3e5f0] shadow-2xs">
                <div className="flex items-start gap-3">
                  <FileCheck className="w-5 h-5 text-[#1c3f9c] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-montserrat font-extrabold text-xs text-[#0b132b] uppercase tracking-wider">
                      Zero Compilation Bottlenecks
                    </h5>
                    <p className="font-merriweather text-xs text-[#454545] mt-1.5 leading-relaxed">
                      Teachers enter continuous assessments once; PORTAL PRO instantly
                      computes termly averages, class positions, cumulative grades,
                      and generates printable student report sheets with QR code authenticity seals.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 7 Columns: Product Details & Key Capabilities */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2.5">
                <span className="px-3 py-1 rounded bg-[#092279] text-white font-mono-tabular font-bold text-xs">
                  SMS-02
                </span>
                <span className="font-montserrat font-extrabold text-xs uppercase tracking-widest text-[#092279]">
                  SCHOOL PORTAL &amp; MANAGEMENT SOLUTION
                </span>
              </div>

              <h2 className="font-montserrat font-black text-3xl sm:text-5xl text-[#121212] tracking-tight">
                PORTAL PRO
              </h2>

              <p className="font-montserrat font-bold text-base sm:text-lg text-[#092279]">
                Student Records, Staff Administration, Academic Results &amp; Communication
              </p>

              <p className="font-merriweather text-sm sm:text-base text-[#454545] leading-relaxed">
                PORTAL PRO is designed specifically for Nigerian school administrators,
                principals, and bursars who need a reliable, headache-free digital
                management system. It replaces slow ledger books, lost report cards,
                and uncoordinated fee reconciliation with a clean, branded web portal.
              </p>

              {/* Key Capabilities Bullet Grid */}
              <div className="pt-4 space-y-4">
                <h4 className="font-montserrat font-extrabold text-sm uppercase tracking-wider text-[#121212]">
                  Core Administrative Modules:
                </h4>
                <div className="space-y-3">
                  {SOLUTIONS_DATA[1].keyCapabilities.map((cap, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-[#e3e5f0] bg-white flex items-start gap-3.5"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#092279] text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <div>
                        <h5 className="font-montserrat font-bold text-sm text-[#121212]">
                          {cap.title}
                        </h5>
                        <p className="font-merriweather text-xs sm:text-[13px] text-[#454545] leading-relaxed mt-1">
                          {cap.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleScrollToDemo('PORTAL PRO')}
                  className="px-6 py-3.5 bg-[#092279] hover:bg-[#0d2d9e] text-white font-montserrat font-extrabold text-xs sm:text-sm rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Request Portal Pro Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScrollToDemo('PORTAL PRO')}
                  className="px-6 py-3.5 bg-white hover:bg-[#f4f5f8] text-[#121212] border border-[#e3e5f0] font-montserrat font-bold text-xs sm:text-sm rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Schedule Consultation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. DEEP-DIVE: PRODUCT 3 — LMS E-LIBRARY
      ===================================================================== */}
      <section
        id="solution-lms-elibrary"
        className="w-full bg-white border-b border-[#e3e5f0] py-20 lg:py-28 scroll-mt-20"
      >
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left 7 Columns: Product Details & Key Capabilities */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5">
                <span className="px-3 py-1 rounded bg-[#059669] text-white font-mono-tabular font-bold text-xs">
                  LIB-03
                </span>
                <span className="font-montserrat font-extrabold text-xs uppercase tracking-widest text-[#059669]">
                  DIGITAL LIBRARY &amp; LEARNING MANAGEMENT
                </span>
              </div>

              <h2 className="font-montserrat font-black text-3xl sm:text-5xl text-[#121212] tracking-tight">
                LMS E-LIBRARY
              </h2>

              <p className="font-montserrat font-bold text-base sm:text-lg text-[#059669]">
                Digital Learning Resources, Intelligent Cataloguing &amp; Content Access
              </p>

              <p className="font-merriweather text-sm sm:text-base text-[#454545] leading-relaxed">
                LMS E-LIBRARY equips educational institutions with a searchable,
                high-speed electronic library and e-learning portal. Students and
                lecturers gain 24/7 access to curriculum textbooks, past WAEC/NECO/JAMB
                and degree questions, research publications, and modular online lectures.
              </p>

              {/* Key Capabilities Bullet Grid */}
              <div className="pt-4 space-y-4">
                <h4 className="font-montserrat font-extrabold text-sm uppercase tracking-wider text-[#121212]">
                  Library &amp; LMS Capabilities:
                </h4>
                <div className="space-y-3">
                  {SOLUTIONS_DATA[2].keyCapabilities.map((cap, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-[#e3e5f0] bg-[#F8F9FC] flex items-start gap-3.5"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#059669] text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <div>
                        <h5 className="font-montserrat font-bold text-sm text-[#121212]">
                          {cap.title}
                        </h5>
                        <p className="font-merriweather text-xs sm:text-[13px] text-[#454545] leading-relaxed mt-1">
                          {cap.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleScrollToDemo('LMS E-LIBRARY')}
                  className="px-6 py-3.5 bg-[#059669] hover:bg-[#047857] text-white font-montserrat font-extrabold text-xs sm:text-sm rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Request LMS E-Library Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScrollToDemo('LMS E-LIBRARY')}
                  className="px-6 py-3.5 bg-[#fdf6e7] hover:bg-[#f3ead6] text-[#092279] border border-[#eadfc9] font-montserrat font-bold text-xs sm:text-sm rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Inquire for School Library</span>
                </button>
              </div>
            </div>

            {/* Right 5 Columns: Specification & Architecture Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#042f2e] text-white rounded-2xl p-7 sm:p-8 shadow-xl border border-[#059669]/40">
                <div className="flex items-center justify-between pb-5 border-b border-white/15">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#34d399]" />
                    <span className="font-montserrat font-extrabold text-sm text-white">
                      Digital Library Infrastructure
                    </span>
                  </div>
                  <span className="text-[11px] font-mono-tabular px-2.5 py-0.5 rounded bg-white/10 text-[#34d399]">
                    Catalog Engine
                  </span>
                </div>

                <div className="mt-6 space-y-4 text-xs font-montserrat">
                  <div>
                    <span className="text-white/60 uppercase tracking-wider block text-[10px]">
                      Deployment Configuration
                    </span>
                    <span className="font-bold text-sm text-white mt-1 block">
                      {SOLUTIONS_DATA[2].specifications.deployment}
                    </span>
                  </div>

                  <div>
                    <span className="text-white/60 uppercase tracking-wider block text-[10px]">
                      Digital Holdings Capacity
                    </span>
                    <span className="font-bold text-sm text-[#34d399] mt-1 block">
                      {SOLUTIONS_DATA[2].specifications.capacity}
                    </span>
                  </div>

                  <div>
                    <span className="text-white/60 uppercase tracking-wider block text-[10px]">
                      Access Security &amp; Copyright Protection
                    </span>
                    <span className="font-bold text-sm text-white mt-1 block">
                      {SOLUTIONS_DATA[2].specifications.security}
                    </span>
                  </div>

                  <div>
                    <span className="text-white/60 uppercase tracking-wider block text-[10px]">
                      Supported Document &amp; Media Formats
                    </span>
                    <span className="font-bold text-sm text-white mt-1 block">
                      {SOLUTIONS_DATA[2].specifications.compatibility}
                    </span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/15">
                  <h5 className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#34d399] mb-3">
                    Target Organizations:
                  </h5>
                  <ul className="space-y-2 text-xs font-merriweather text-white/85">
                    {SOLUTIONS_DATA[2].targetAudience.map((target, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399] shrink-0" />
                        <span>{target}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Offline Bandwidth Savings Highlight */}
              <div className="p-6 rounded-2xl bg-white border border-[#e3e5f0] shadow-2xs">
                <div className="flex items-start gap-3">
                  <HardDrive className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-montserrat font-extrabold text-xs text-[#0b132b] uppercase tracking-wider">
                      Zero-Internet Local Campus Cache
                    </h5>
                    <p className="font-merriweather text-xs text-[#454545] mt-1.5 leading-relaxed">
                      Heavy educational materials (textbooks, lecture videos, simulation files)
                      are stored on your local campus server. Students browse at high local speeds
                      without consuming expensive cellular or satellite data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. INSTITUTIONAL FIT & SOLUTION COMPARISON MATRIX
      ===================================================================== */}
      <section className="w-full bg-[#F8F9FC] border-b border-[#e3e5f0] py-20 lg:py-24">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-6 h-[2.5px] bg-[#f58220] rounded-full" />
              <span className="font-montserrat font-extrabold text-xs uppercase tracking-[0.2em] text-[#1c3f9c]">
                WHICH SOLUTION IS RIGHT FOR YOU?
              </span>
            </div>
            <h2 className="font-montserrat font-extrabold text-3xl sm:text-4xl text-[#121212]">
              Institutional Deployment Matrix
            </h2>
            <p className="font-merriweather text-sm sm:text-base text-[#454545] mt-3 leading-relaxed">
              Find the ideal configuration for your organization’s operational needs.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#e3e5f0] bg-white shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#061539] text-white font-montserrat text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 border-b border-white/10">Institution Type</th>
                  <th className="py-4 px-6 border-b border-white/10">Primary Challenges</th>
                  <th className="py-4 px-6 border-b border-white/10">Recommended Brainbench Solution</th>
                  <th className="py-4 px-6 border-b border-white/10">Deployment Timeframe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e5f0] text-xs font-montserrat">
                <tr className="hover:bg-[#F8F9FC] transition-colors">
                  <td className="py-4 px-6 font-bold text-[#121212]">
                    Primary &amp; Secondary Schools
                  </td>
                  <td className="py-4 px-6 text-[#454545] font-merriweather">
                    Manual report sheets, lost test scripts, fee reconciliation delays.
                  </td>
                  <td className="py-4 px-6 font-bold text-[#092279]">
                    PORTAL PRO + Optional Ultra CBT Lite
                  </td>
                  <td className="py-4 px-6 text-[#1c3f9c] font-bold">
                    3 – 5 Days Setup
                  </td>
                </tr>

                <tr className="hover:bg-[#F8F9FC] transition-colors">
                  <td className="py-4 px-6 font-bold text-[#121212]">
                    Colleges &amp; Universities
                  </td>
                  <td className="py-4 px-6 text-[#454545] font-merriweather">
                    Large lecture cohorts, textbook scarcity, slow grading timelines.
                  </td>
                  <td className="py-4 px-6 font-bold text-[#1c3f9c]">
                    ULTRA CBT Enterprise + LMS E-LIBRARY
                  </td>
                  <td className="py-4 px-6 text-[#1c3f9c] font-bold">
                    1 – 2 Weeks Turnkey
                  </td>
                </tr>

                <tr className="hover:bg-[#F8F9FC] transition-colors">
                  <td className="py-4 px-6 font-bold text-[#121212]">
                    Professional Exam Centers &amp; Agencies
                  </td>
                  <td className="py-4 px-6 text-[#454545] font-merriweather">
                    Strict malpractice risks, mass candidate scheduling, instant transcripts.
                  </td>
                  <td className="py-4 px-6 font-bold text-[#1c3f9c]">
                    ULTRA CBT Offline LAN High-Throughput
                  </td>
                  <td className="py-4 px-6 text-[#1c3f9c] font-bold">
                    Custom Onsite Audit
                  </td>
                </tr>

                <tr className="hover:bg-[#F8F9FC] transition-colors">
                  <td className="py-4 px-6 font-bold text-[#121212]">
                    Educational Groups &amp; Academy Networks
                  </td>
                  <td className="py-4 px-6 text-[#454545] font-merriweather">
                    Multi-branch oversight, centralized curriculum, unified student database.
                  </td>
                  <td className="py-4 px-6 font-bold text-[#f58220]">
                    Complete Enterprise Bundle (All 3)
                  </td>
                  <td className="py-4 px-6 text-[#1c3f9c] font-bold">
                    Full Integration Plan
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =====================================================================
          8. INTERACTIVE DEMO & DEPLOYMENT INQUIRY FORM (#request-demo)
      ===================================================================== */}
      <section
        id="request-demo"
        className="w-full bg-white border-b border-[#e3e5f0] py-20 lg:py-28 scroll-mt-20"
      >
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left 5 Columns: Trust & Direct Office Contact */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2.5">
                <span className="w-7 h-[2.5px] bg-[#f58d00] rounded-full shrink-0" />
                <span className="font-montserrat font-extrabold text-xs sm:text-[13px] tracking-[0.2em] uppercase text-[#1c3f9c]">
                  SCHEDULE AN INSTITUTIONAL DEMO
                </span>
              </div>

              <h2 className="font-montserrat font-black text-3xl sm:text-4xl text-[#121212]">
                See Our Products in Action on Your Terms
              </h2>

              <p className="font-merriweather text-sm sm:text-base text-[#454545] leading-relaxed">
                Whether you prefer an online live walkthrough with your academic
                board or an onsite visit to your school campus in Ekiti State or
                neighbouring states, our technical team is ready to demonstrate
                system capabilities and answer technical questions.
              </p>

              {/* Direct Office Details */}
              <div className="p-6 rounded-2xl bg-[#F8F9FC] border border-[#e3e5f0] space-y-4">
                <h4 className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#1c3f9c]">
                  Direct Technology Office Contact:
                </h4>

                <div className="space-y-3 text-xs font-montserrat">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#1c3f9c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#121212] block">
                        Headquarters &amp; Tech Centre:
                      </strong>
                      <span className="text-[#454545]">
                        Brainbench Building, 47 Damilore Street, Ado-Ekiti, Ekiti State, Nigeria.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-[#1c3f9c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#121212] block">
                        Direct Lines / WhatsApp:
                      </strong>
                      <span className="text-[#454545] font-mono-tabular">
                        +234 816 099 3158 &bull; +234 813 543 8984
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-[#1c3f9c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#121212] block">
                        Official Inquiries:
                      </strong>
                      <span className="text-[#454545]">
                        info@bbtechng.com
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* What Happens Next */}
              <div className="pt-2">
                <h5 className="font-montserrat font-bold text-xs uppercase tracking-wider text-[#121212] mb-2">
                  What Happens After You Submit?
                </h5>
                <ol className="list-decimal list-inside space-y-1.5 text-xs font-merriweather text-[#454545]">
                  <li>Our software engineers review your school’s student size and infrastructure.</li>
                  <li>We prepare a custom demo account configured with your sample subjects.</li>
                  <li>We schedule a 30-minute interactive session (virtual or onsite).</li>
                </ol>
              </div>
            </div>

            {/* Right 7 Columns: Interactive Demo Request Form */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#e3e5f0] p-7 sm:p-10 shadow-xs">
              <div className="pb-6 border-b border-[#e3e5f0]">
                <span className="font-montserrat font-extrabold text-xs uppercase tracking-widest text-[#1c3f9c]">
                  TAILORED INSTITUTIONAL QUOTE &bull; DEMO REQUEST
                </span>
                <h3 className="font-montserrat font-extrabold text-2xl sm:text-3xl text-[#121212] mt-1">
                  Request a Demo or Proposal
                </h3>
                <p className="font-merriweather text-xs sm:text-sm text-[#454545] mt-2">
                  Provide your institution details below. Our team responds within 24 business hours.
                </p>
              </div>

              {submittedTicket ? (
                <div className="py-12 text-center space-y-5">
                  <CheckCircle2 className="w-14 h-14 text-[#10b981] mx-auto" />
                  <div>
                    <h3 className="font-montserrat font-extrabold text-xl text-[#121212]">
                      Demo Request Logged Successfully
                    </h3>
                    <p className="font-merriweather text-sm text-[#454545] mt-1 max-w-md mx-auto">
                      Thank you, <strong>{validatedContact || contactName}</strong>. Your request for{' '}
                      <strong>{institutionName}</strong> regarding{' '}
                      <strong>{selectedProductInterest.join(', ')}</strong> has been registered.
                    </p>
                    <div className="mt-4 inline-block px-4 py-2 bg-[#F8F9FC] border border-[#e3e5f0] rounded-lg">
                      <span className="text-xs font-montserrat text-[#454545]">Tracking Reference: </span>
                      <span className="font-mono-tabular font-bold text-sm text-[#1c3f9c]">
                        {submittedTicket}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedTicket(null);
                      setFormError(null);
                      setMessage('');
                    }}
                    className="px-6 py-3 bg-[#1c3f9c] hover:bg-[#174da8] text-white font-montserrat font-bold text-xs rounded-lg cursor-pointer transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitDemoRequest} className="mt-6 space-y-5" noValidate>
                  {/* Anti-bot Honeypot Field */}
                  <div aria-hidden="true" className="hidden" style={{ display: 'none' }}>
                    <label htmlFor="bbt-sol-website">Website</label>
                    <input
                      id="bbt-sol-website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  {formError && (
                    <div
                      role="alert"
                      className="flex items-start gap-2.5 p-3.5 rounded-lg bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] text-xs font-montserrat font-semibold"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#dc2626]" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Institution Name & Contact Person */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-montserrat font-bold text-xs text-[#121212] mb-1.5">
                        Institution / Organization Name *
                      </label>
                      <input
                        type="text"
                        required
                        minLength={2}
                        maxLength={120}
                        value={institutionName}
                        onChange={(e) => setInstitutionName(e.target.value.slice(0, 120))}
                        placeholder="e.g. Ekiti Apex Academy / Standard CBT Centre"
                        className="w-full px-4 py-3 bg-[#F8F9FC] border border-[#e3e5f0] rounded-lg text-sm font-montserrat text-[#121212] focus:outline-none focus:border-[#1c3f9c]"
                      />
                    </div>

                    <div>
                      <label className="block font-montserrat font-bold text-xs text-[#121212] mb-1.5">
                        Contact Person &amp; Role *
                      </label>
                      <input
                        type="text"
                        required
                        minLength={2}
                        maxLength={100}
                        autoComplete="name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value.slice(0, 100))}
                        placeholder="e.g. Dr. Olumide Adeleke (Principal / ICT Director)"
                        className="w-full px-4 py-3 bg-[#F8F9FC] border border-[#e3e5f0] rounded-lg text-sm font-montserrat text-[#121212] focus:outline-none focus:border-[#1c3f9c]"
                      />
                    </div>
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-montserrat font-bold text-xs text-[#121212] mb-1.5">
                        Official Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        minLength={5}
                        maxLength={120}
                        inputMode="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.slice(0, 120))}
                        placeholder="admin@yourschool.edu.ng"
                        className="w-full px-4 py-3 bg-[#F8F9FC] border border-[#e3e5f0] rounded-lg text-sm font-montserrat text-[#121212] focus:outline-none focus:border-[#1c3f9c]"
                      />
                    </div>

                    <div>
                      <label className="block font-montserrat font-bold text-xs text-[#121212] mb-1.5">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        minLength={7}
                        maxLength={20}
                        inputMode="tel"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.slice(0, 20))}
                        placeholder="+234 803 000 0000"
                        className="w-full px-4 py-3 bg-[#F8F9FC] border border-[#e3e5f0] rounded-lg text-sm font-montserrat text-[#121212] focus:outline-none focus:border-[#1c3f9c]"
                      />
                    </div>
                  </div>

                  {/* Solution(s) of Interest Checkboxes */}
                  <div>
                    <label className="block font-montserrat font-bold text-xs text-[#121212] mb-2">
                      Products of Interest (Select all that apply) *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {['ULTRA CBT', 'PORTAL PRO', 'LMS E-LIBRARY'].map((prod) => {
                        const isChecked = selectedProductInterest.includes(prod);
                        return (
                          <button
                            key={prod}
                            type="button"
                            onClick={() => handleToggleProductInterest(prod)}
                            className={`p-3 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                              isChecked
                                ? 'border-[#1c3f9c] bg-[#1c3f9c]/5 text-[#1c3f9c] font-bold'
                                : 'border-[#e3e5f0] bg-[#F8F9FC] text-[#454545]'
                            }`}
                          >
                            <span className="text-xs font-montserrat">{prod}</span>
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                isChecked
                                  ? 'bg-[#1c3f9c] border-[#1c3f9c] text-white'
                                  : 'border-[#cbd5e1] bg-white'
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Institution Student Size */}
                  <div>
                    <label className="block font-montserrat font-bold text-xs text-[#121212] mb-1.5">
                      Estimated Student or Candidate Population
                    </label>
                    <select
                      value={institutionSize}
                      onChange={(e) => setInstitutionSize(e.target.value)}
                      className="w-full px-4 py-3 bg-[#F8F9FC] border border-[#e3e5f0] rounded-lg text-sm font-montserrat font-semibold text-[#121212] focus:outline-none focus:border-[#1c3f9c]"
                    >
                      <option value="Under 300 students">Under 300 students</option>
                      <option value="300 - 1,000 students">300 - 1,000 students</option>
                      <option value="1,000 - 3,000 students">1,000 - 3,000 students</option>
                      <option value="3,000 - 10,000 students">3,000 - 10,000 students</option>
                      <option value="10,000+ students (Enterprise / Center)">
                        10,000+ students (Enterprise / Center)
                      </option>
                    </select>
                  </div>

                  {/* Detailed Requirements or Questions */}
                  <div>
                    <label className="block font-montserrat font-bold text-xs text-[#121212] mb-1.5">
                      Project Requirements or Specific Inquiries *
                    </label>
                    <textarea
                      rows={4}
                      required
                      minLength={10}
                      maxLength={1500}
                      value={message}
                      onChange={(e) => setMessage(e.target.value.slice(0, 1500))}
                      placeholder="Tell us about your upcoming examination term, current portal setup, or specific features you require..."
                      className="w-full px-4 py-3 bg-[#F8F9FC] border border-[#e3e5f0] rounded-lg text-sm font-montserrat text-[#121212] focus:outline-none focus:border-[#1c3f9c]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-4 bg-[#1c3f9c] hover:bg-[#174da8] text-white font-montserrat font-extrabold text-sm rounded-lg inline-flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <span>Submit Demo Request</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          9. BOTTOM CALL TO ACTION: Training vs Solutions
      ===================================================================== */}
      <section className="w-full bg-[#061539] text-white py-16 lg:py-20 border-t border-[#1c3f9c]/30">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <span className="font-montserrat font-extrabold text-xs uppercase tracking-widest text-[#fdc12e]">
              EXPLORE OUR TECH ACADEMY
            </span>
            <h2 className="font-montserrat font-black text-2xl sm:text-3xl text-white mt-1">
              Looking for Individual Technology Courses &amp; Certifications?
            </h2>
            <p className="font-merriweather text-xs sm:text-sm text-white/80 mt-2 max-w-2xl leading-relaxed">
              In addition to institutional software solutions, Brainbench Technology
              offers 39 certified courses across Web Development, Graphic &amp; Product
              Design, Data Analysis, and Emerging Tech at our Ado-Ekiti training studio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              to="/courses"
              className="px-6 py-3.5 bg-[#f58220] hover:bg-[#fdc12e] text-[#121212] font-montserrat font-extrabold text-xs sm:text-sm rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <span>Explore Course Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/contact"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-montserrat font-bold text-xs sm:text-sm rounded-lg transition-colors"
            >
              Contact Admissions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
