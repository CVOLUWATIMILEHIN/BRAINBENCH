import React, { useMemo, useState } from 'react';
import {
  ABOUT_DATA,
  ALL_COURSES,
  BACK_COVER_DATA,
  CATEGORY_INDEX,
  COVER_DATA,
  CourseItem,
  GALLERY_PAGE_18,
  GALLERY_PAGE_19,
  sortCoursesAlphabetically,
} from '../data/brochureData';
import {
  SPARK_IT_EVENT_DATA,
  THE_EDGE_EVENT_DATA,
} from '../data/eventsData';
import {
  CourseWebsiteCard,
  DiagonalStripes,
  FourColorBar,
  ResilientImage,
} from '../components/WebsiteSections';
import { CourseCatalogueHero } from '../components/CourseCatalogueHero';
import { Link } from '../router';
import {
  ArrowRight,
  Award,
  BookOpen,
  Calculator,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Mail,
  MapPin,
  Maximize2,
  Phone,
  QrCode,
  Search,
  SlidersHorizontal,
  Trash2,
  Users,
  X,
} from 'lucide-react';

/* ============================================================================
   1. DEDICATED ABOUT PAGE (/about)
============================================================================ */
interface AboutPageProps {
  onOpenEnrol: () => void;
  onOpenLightbox: (imageUrl: string, caption: string, label: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onOpenEnrol,
  onOpenLightbox,
}) => {
  const sampleGallery = useMemo(() => {
    const items = GALLERY_PAGE_18.rows.flatMap((r) => r.items).slice(0, 8);
    return items;
  }, []);

  return (
    <div className="w-full bg-white">
      {/* Page Hero */}
      <section className="relative w-full bg-[#061539] text-white py-20 lg:py-28 overflow-hidden border-b border-[#1c3f9c]/30">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url('/images/figma/f064034f.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(6, 21, 57, 0.94) 0%, rgba(6, 21, 57, 0.84) 55%, rgba(6, 21, 57, 0.70) 100%)',
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
            <span className="text-[#fdc12e]">About</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2.5 mb-4">
              <span className="w-7 h-[2.5px] bg-[#f58d00] rounded-full shrink-0" />
              <span className="font-montserrat font-extrabold text-xs sm:text-[13px] tracking-[0.2em] uppercase text-[#fdc12e]">
                ABOUT BRAINBENCH TECHNOLOGY
              </span>
            </div>

            <h1 className="font-montserrat font-black text-3xl sm:text-5xl lg:text-[54px] leading-[1.08] tracking-tight text-white">
              Think. Innovate. Build.
            </h1>

            <p className="font-merriweather text-base sm:text-lg text-white/90 leading-relaxed mt-5 max-w-2xl">
              {ABOUT_DATA.whoWeAreBody}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/courses"
                className="px-6 py-3.5 bg-[#f58d00] hover:bg-[#e07f00] text-[#061539] font-montserrat font-extrabold text-sm rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <span>Explore {ALL_COURSES.length} Courses</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/events"
                className="px-6 py-3.5 bg-[#0a309e] hover:bg-[#174da8] text-white border border-white/60 font-montserrat font-bold text-sm rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <span>Explore Our Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Institutional Stats & Who We Are */}
      <section className="w-full py-20 lg:py-28 bg-white border-b border-[#e3e5f0]">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          {/* 3 Stat Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {COVER_DATA.stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-[#e3e5f0] flex flex-col justify-between overflow-hidden shadow-2xs"
              >
                <div className="flex items-stretch min-h-[110px]">
                  <div className="w-2 bg-[#1c3f9c] shrink-0" />
                  <div className="px-7 py-6 flex flex-col justify-center">
                    <span className="font-montserrat font-extrabold text-4xl sm:text-5xl leading-none text-[#1c3f9c] tabular-nums">
                      {stat.value}
                    </span>
                    <span className="font-montserrat font-bold text-xs sm:text-sm tracking-wider text-[#454545] mt-3">
                      {stat.label}
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-[#f7941d]" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
              <div>
                <div
                  className="inline-flex items-center px-7 py-3 rounded-lg"
                  style={{
                    background:
                      'linear-gradient(90deg, #f7941d 0%, #fdc12e 100%)',
                  }}
                >
                  <h2 className="font-montserrat font-extrabold text-xl sm:text-2xl text-[#121212]">
                    {ABOUT_DATA.heading}
                  </h2>
                </div>

                <div className="mt-8 bg-[#1c3f9c] rounded-xl p-8 sm:p-10 shadow-sm">
                  <h3 className="font-montserrat font-bold text-lg text-[#fdc12e]">
                    {ABOUT_DATA.whoWeAreTitle}
                  </h3>
                  <p className="font-merriweather font-normal text-base leading-relaxed text-white mt-4">
                    {ABOUT_DATA.whoWeAreBody}
                  </p>
                  <p className="font-merriweather font-normal text-sm leading-relaxed text-white/90 mt-4">
                    Located at {BACK_COVER_DATA.centreLocation}, our training
                    studio combines structured mentorship, collaborative project
                    sprints, and signature educational forums like{' '}
                    <strong>THE EDGE: Beyond the Classroom</strong> and{' '}
                    <strong>BRAINBENCH SPARK IT</strong> to develop well-rounded
                    technology professionals.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#F8F9FC] rounded-xl border border-[#e3e5f0] p-5">
                  <div className="font-montserrat font-extrabold text-sm text-[#1c3f9c]">
                    Industry Practitioners
                  </div>
                  <p className="font-merriweather text-xs text-[#454545] mt-1.5 leading-relaxed">
                    Every programme is taught through practical projects,
                    real-world workflows, and guided lab sessions.
                  </p>
                </div>
                <div className="bg-[#F8F9FC] rounded-xl border border-[#e3e5f0] p-5">
                  <div className="font-montserrat font-extrabold text-sm text-[#1c3f9c]">
                    Foundational to Advanced
                  </div>
                  <p className="font-merriweather text-xs text-[#454545] mt-1.5 leading-relaxed">
                    Structured tracks spanning Web Development, Design, Data,
                    Professional Management, and AI.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 flex">
              <div
                onClick={() =>
                  onOpenLightbox(
                    ABOUT_DATA.aboutPhotoUrl,
                    ABOUT_DATA.whoWeAreBody,
                    ABOUT_DATA.heading
                  )
                }
                className="group relative w-full aspect-[4/3] lg:aspect-auto lg:h-full rounded-xl border-2 border-[#1c3f9c] bg-[#e8f0fc] overflow-hidden cursor-pointer shadow-sm"
              >
                <ResilientImage
                  src={ABOUT_DATA.aboutPhotoUrl}
                  alt="About Brainbench Technology cohort training"
                  objectPosition="50% 20%"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-end justify-between p-5">
                  <span className="text-white font-montserrat font-semibold text-sm">
                    Brainbench Technology Cohort &amp; Mentorship Session
                  </span>
                  <span className="bg-white/95 text-[#121212] p-2 rounded">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our 5 Skill Categories & Signature Initiatives */}
      <section className="w-full py-20 lg:py-24 bg-[#F8F9FC] border-b border-[#e3e5f0]">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-montserrat font-extrabold uppercase tracking-widest text-[#1c3f9c]">
              WHAT WE DO
            </div>
            <h2 className="font-montserrat font-extrabold text-3xl sm:text-4xl text-[#121212] mt-2">
              {CATEGORY_INDEX.length} Core Skill Categories &amp; 2 Flagship Educational Events
            </h2>
            <p className="font-merriweather text-sm sm:text-base text-[#454545] mt-3 leading-relaxed">
              We combine intensive technical training across {ALL_COURSES.length} certified
              courses with continuous community learning and academic innovation
              events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {CATEGORY_INDEX.map((cat) => (
              <Link
                key={cat.id}
                to={`/courses?category=${encodeURIComponent(cat.name)}`}
                className="rounded-xl border border-[#e3e5f0] hover:border-[#1c3f9c] bg-white p-5 flex flex-col justify-between transition-all hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className="w-8 h-2 rounded-xs shrink-0"
                      style={{ backgroundColor: cat.accentColor }}
                    />
                    <span className="bg-[#f7941d] text-[#121212] font-montserrat font-bold text-xs px-2.5 py-1 rounded-xs tabular-nums">
                      {cat.courseCount} courses
                    </span>
                  </div>
                  <h3 className="font-montserrat font-extrabold text-base text-[#1c3f9c] leading-snug">
                    {cat.name}
                  </h3>
                </div>
                <div className="mt-6 pt-3 border-t border-[#e3e5f0] inline-flex items-center gap-1.5 text-xs font-montserrat font-bold text-[#121212]">
                  <span>View Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>

          {/* 2 Event Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-[#e3e5f0] p-7 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 rounded bg-[#f58220] text-[#121212] font-montserrat font-extrabold text-xs uppercase tracking-wider">
                  {THE_EDGE_EVENT_DATA.frequencyBadge}
                </span>
                <h3 className="font-montserrat font-extrabold text-2xl text-[#121212] mt-3">
                  {THE_EDGE_EVENT_DATA.title}
                </h3>
                <p className="font-merriweather text-sm text-[#454545] leading-relaxed mt-2.5">
                  {THE_EDGE_EVENT_DATA.shortSummary}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#e3e5f0]">
                <Link
                  to="/events/the-edge"
                  className="inline-flex items-center gap-2 font-montserrat font-extrabold text-xs sm:text-sm text-[#1c3f9c] hover:underline"
                >
                  <span>Explore The Edge</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e3e5f0] p-7 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 rounded bg-[#1c3f9c] text-white font-montserrat font-extrabold text-xs uppercase tracking-wider">
                  {SPARK_IT_EVENT_DATA.frequencyBadge}
                </span>
                <h3 className="font-montserrat font-extrabold text-2xl text-[#121212] mt-3">
                  {SPARK_IT_EVENT_DATA.title}
                </h3>
                <p className="font-merriweather text-sm text-[#454545] leading-relaxed mt-2.5">
                  {SPARK_IT_EVENT_DATA.shortSummary}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#e3e5f0]">
                <Link
                  to="/events/brainbench-spark-it"
                  className="inline-flex items-center gap-2 font-montserrat font-extrabold text-xs sm:text-sm text-[#1c3f9c] hover:underline"
                >
                  <span>Discover Brainbench Spark It</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Centre Gallery Preview */}
      <section className="w-full py-20 lg:py-24 bg-white border-b border-[#e3e5f0]">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-montserrat font-extrabold uppercase tracking-widest text-[#1c3f9c]">
                INSIDE OUR TRAINING STUDIO
              </div>
              <h2 className="font-montserrat font-extrabold text-2xl sm:text-3xl text-[#121212] mt-1">
                Hands-On Learning in Action
              </h2>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 font-montserrat font-bold text-xs sm:text-sm text-[#1c3f9c] hover:underline"
            >
              <span>Browse All Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {sampleGallery.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  onOpenLightbox(item.imageUrl, item.caption, item.label)
                }
                style={{ borderColor: item.border }}
                className="group relative h-[250px] rounded-xl border-2 overflow-hidden cursor-pointer bg-[#061539]"
              >
                <ResilientImage
                  src={item.imageUrl}
                  alt={item.caption}
                  objectPosition="50% 22%"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end justify-between p-4">
                  <span className="text-white font-montserrat font-bold text-xs">
                    {item.caption}
                  </span>
                  <span className="bg-white/95 text-[#121212] p-1.5 rounded">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit or Enrol CTA */}
      <section className="w-full bg-[#174da8] text-white py-16 lg:py-20">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <span className="font-montserrat font-extrabold text-xs uppercase tracking-widest text-[#fdc12e]">
              VISIT OUR TRAINING CENTRE
            </span>
            <h2 className="font-montserrat font-extrabold text-2xl sm:text-4xl mt-2">
              {BACK_COVER_DATA.centreLocation}
            </h2>
            <p className="font-merriweather text-sm sm:text-base text-white/90 mt-2">
              Call +234 816 099 3158 or email info@bbtechng.com to speak with an
              admissions advisor.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <button
              type="button"
              onClick={onOpenEnrol}
              className="px-6 py-3.5 bg-[#f58220] hover:bg-[#fdc12e] text-[#121212] font-montserrat font-extrabold text-sm rounded-lg cursor-pointer transition-colors"
            >
              Enrol Now
            </button>
            <Link
              to="/contact"
              className="px-6 py-3.5 bg-white text-[#121212] hover:bg-[#f4f5f8] font-montserrat font-bold text-sm rounded-lg transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ============================================================================
   2. DEDICATED PROGRAMMES PAGE (/programmes)
============================================================================ */
interface ProgrammesPageProps {
  onOpenEnrol: () => void;
  onOpenLightbox: (imageUrl: string, caption: string, label: string) => void;
}

export const ProgrammesPage: React.FC<ProgrammesPageProps> = ({
  onOpenEnrol,
  onOpenLightbox,
}) => {
  return (
    <div className="w-full bg-white">
      {/* Page Hero */}
      <section className="relative w-full bg-[#061539] text-white py-20 lg:py-28 overflow-hidden border-b border-[#1c3f9c]/30">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url('/images/figma/8250a39c.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 45%',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(6, 21, 57, 0.94) 0%, rgba(6, 21, 57, 0.85) 55%, rgba(6, 21, 57, 0.72) 100%)',
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
            <span className="text-[#fdc12e]">Programmes</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2.5 mb-4">
              <span className="w-7 h-[2.5px] bg-[#f58d00] rounded-full shrink-0" />
              <span className="font-montserrat font-extrabold text-xs sm:text-[13px] tracking-[0.2em] uppercase text-[#fdc12e]">
                EDUCATIONAL, ACADEMIC &amp; CAREER PROGRAMMES
              </span>
            </div>

            <h1 className="font-montserrat font-black text-3xl sm:text-5xl lg:text-[54px] leading-[1.08] tracking-tight text-white">
              Structured Learning Pathways &amp; Signature Programmes.
            </h1>

            <p className="font-merriweather text-base sm:text-lg text-white/90 leading-relaxed mt-5 max-w-2xl">
              Discover Brainbench Technology’s ecosystem of educational
              programmes—combining our bi-weekly guest-speaker programme (
              <strong>The Edge: Beyond the Classroom</strong>), our quarterly
              showcase (<strong>Brainbench Spark It</strong>), and 5 certified
              career training tracks.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/events/the-edge"
                className="px-6 py-3.5 bg-[#f58d00] hover:bg-[#e07f00] text-[#061539] font-montserrat font-extrabold text-sm rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <span>Explore The Edge</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/events/brainbench-spark-it"
                className="px-6 py-3.5 bg-[#0a309e] hover:bg-[#174da8] text-white border border-white/60 font-montserrat font-bold text-sm rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <span>Discover Brainbench Spark It</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/courses"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-montserrat font-bold text-sm rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <span>Browse All {ALL_COURSES.length} Courses</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Academic & Community Programmes (The Edge & Brainbench Spark It) */}
      <section className="w-full py-20 lg:py-28 bg-[#F8F9FC] border-b border-[#e3e5f0]">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <div className="max-w-3xl mb-12">
            <div
              className="inline-flex items-center px-6 py-2.5 rounded-lg mb-4"
              style={{
                background: 'linear-gradient(90deg, #f58220 0%, #fdc12e 100%)',
              }}
            >
              <span className="font-montserrat font-extrabold text-sm text-[#121212] uppercase tracking-wider">
                Signature Educational Programmes
              </span>
            </div>
            <h2 className="font-montserrat font-extrabold text-3xl sm:text-4xl text-[#121212]">
              Beyond Technical Syntax: Our Flagship Programmes
            </h2>
            <p className="font-merriweather text-sm sm:text-base text-[#454545] mt-3 leading-relaxed">
              Each flagship programme has its own dedicated schedule, purpose,
              and community experience at Brainbench Technology.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* The Edge Programme Card */}
            <div className="bg-white rounded-2xl border-2 border-[#1c3f9c] overflow-hidden flex flex-col justify-between shadow-sm">
              <div>
                <div
                  onClick={() =>
                    onOpenLightbox(
                      THE_EDGE_EVENT_DATA.heroImageUrl,
                      THE_EDGE_EVENT_DATA.shortSummary,
                      THE_EDGE_EVENT_DATA.title
                    )
                  }
                  className="relative aspect-[16/9] bg-[#061539] overflow-hidden cursor-pointer group"
                >
                  <ResilientImage
                    src={THE_EDGE_EVENT_DATA.heroImageUrl}
                    alt={THE_EDGE_EVENT_DATA.title}
                    objectPosition={THE_EDGE_EVENT_DATA.heroObjectPosition}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1.5 rounded bg-[#f58220] text-[#121212] font-montserrat font-extrabold text-xs uppercase">
                      {THE_EDGE_EVENT_DATA.frequencyBadge}
                    </span>
                  </div>
                </div>
                <div className="p-7 sm:p-8">
                  <div className="text-xs font-montserrat font-extrabold text-[#1c3f9c] uppercase tracking-wider">
                    {THE_EDGE_EVENT_DATA.frequencyBadge}
                  </div>
                  <h3 className="font-montserrat font-extrabold text-2xl text-[#121212] mt-1.5">
                    {THE_EDGE_EVENT_DATA.title}
                  </h3>
                  <p className="font-merriweather text-sm text-[#454545] leading-relaxed mt-3">
                    {THE_EDGE_EVENT_DATA.shortSummary}
                  </p>
                </div>
              </div>
              <div className="px-7 sm:px-8 pb-7 sm:pb-8 pt-2">
                <Link
                  to="/events/the-edge"
                  className="px-6 py-3.5 bg-[#1c3f9c] hover:bg-[#174da8] text-white font-montserrat font-extrabold text-xs sm:text-sm rounded-lg inline-flex items-center gap-2 transition-colors"
                >
                  <span>Explore The Edge</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Brainbench Spark It Programme Card */}
            <div className="bg-white rounded-2xl border-2 border-[#f58220] overflow-hidden flex flex-col justify-between shadow-sm">
              <div>
                <div
                  onClick={() =>
                    onOpenLightbox(
                      SPARK_IT_EVENT_DATA.heroImageUrl,
                      SPARK_IT_EVENT_DATA.shortSummary,
                      SPARK_IT_EVENT_DATA.title
                    )
                  }
                  className="relative aspect-[16/9] bg-[#061539] overflow-hidden cursor-pointer group"
                >
                  <ResilientImage
                    src={SPARK_IT_EVENT_DATA.heroImageUrl}
                    alt={SPARK_IT_EVENT_DATA.title}
                    objectPosition={SPARK_IT_EVENT_DATA.heroObjectPosition}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1.5 rounded bg-[#1c3f9c] text-white font-montserrat font-extrabold text-xs uppercase">
                      {SPARK_IT_EVENT_DATA.frequencyBadge}
                    </span>
                  </div>
                </div>
                <div className="p-7 sm:p-8">
                  <div className="text-xs font-montserrat font-extrabold text-[#1c3f9c] uppercase tracking-wider">
                    {SPARK_IT_EVENT_DATA.frequencyBadge}
                  </div>
                  <h3 className="font-montserrat font-extrabold text-2xl text-[#121212] mt-1.5">
                    {SPARK_IT_EVENT_DATA.title}
                  </h3>
                  <p className="font-merriweather text-sm text-[#454545] leading-relaxed mt-3">
                    {SPARK_IT_EVENT_DATA.shortSummary}
                  </p>
                </div>
              </div>
              <div className="px-7 sm:px-8 pb-7 sm:pb-8 pt-2">
                <Link
                  to="/events/brainbench-spark-it"
                  className="px-6 py-3.5 bg-[#f58220] hover:bg-[#e07f00] text-[#121212] font-montserrat font-extrabold text-xs sm:text-sm rounded-lg inline-flex items-center gap-2 transition-colors"
                >
                  <span>Discover Brainbench Spark It</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Certified Technical & Professional Career Tracks */}
      <section className="w-full py-20 lg:py-28 bg-white border-b border-[#e3e5f0]">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="text-xs font-montserrat font-extrabold uppercase tracking-widest text-[#1c3f9c]">
                CERTIFIED TRAINING DEPARTMENTS
              </div>
              <h2 className="font-montserrat font-extrabold text-3xl sm:text-4xl text-[#121212] mt-2">
                {CATEGORY_INDEX.length} Career Specialisation Tracks ({ALL_COURSES.length} Courses)
              </h2>
            </div>
            <Link
              to="/courses"
              className="px-5 py-3 bg-[#1c3f9c] hover:bg-[#174da8] text-white font-montserrat font-bold text-xs rounded-lg inline-flex items-center gap-2 transition-colors self-start md:self-end"
            >
              <span>Open Full Course Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-6">
            {CATEGORY_INDEX.map((cat, idx) => {
              const catCourses = sortCoursesAlphabetically(
                ALL_COURSES.filter((c) => c.category === cat.name)
              );
              return (
                <div
                  key={cat.id}
                  className="rounded-xl border border-[#e3e5f0] bg-[#F8F9FC] p-6 sm:p-8"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#e3e5f0]">
                    <div className="flex items-center gap-4">
                      <span className="font-mono-tabular font-bold text-sm px-3 py-1.5 rounded bg-[#121212] text-[#fdc12e]">
                        0{idx + 1}
                      </span>
                      <div>
                        <h3 className="font-montserrat font-extrabold text-xl sm:text-2xl text-[#121212]">
                          {cat.name}
                        </h3>
                        <p className="font-montserrat text-xs font-semibold text-[#454545] mt-0.5">
                          {cat.courseCount} Certified Programmes · Practical
                          Studio &amp; Capstone Projects
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/courses?category=${encodeURIComponent(cat.name)}`}
                      className="px-5 py-2.5 bg-white hover:bg-[#1c3f9c] text-[#1c3f9c] hover:text-white border border-[#1c3f9c] font-montserrat font-bold text-xs rounded-lg inline-flex items-center gap-2 transition-colors self-start lg:self-center"
                    >
                      <span>View {cat.courseCount} Courses</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {catCourses.map((c) => (
                      <Link
                        key={c.id}
                        to={`/courses?category=${encodeURIComponent(cat.name)}`}
                        className="px-3.5 py-2 rounded-lg bg-white border border-[#e3e5f0] hover:border-[#1c3f9c] text-xs font-montserrat font-bold text-[#121212] hover:text-[#1c3f9c] transition-colors inline-flex items-center gap-2"
                      >
                        <span>{c.title}</span>
                        <span className="text-[11px] font-normal text-[#454545] tabular-nums">
                          ({c.duration ? `${c.duration} · ${c.price}` : c.price})
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cohort Delivery Modes */}
      <section className="w-full bg-[#174da8] text-white py-16 lg:py-20">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="font-montserrat font-extrabold text-xs uppercase tracking-widest text-[#fdc12e]">
              FLEXIBLE COHORT SCHEDULES IN ADO-EKITI
            </span>
            <h2 className="font-montserrat font-extrabold text-2xl sm:text-4xl mt-2">
              Weekday, Weekend &amp; Evening Training Tracks
            </h2>
            <p className="font-merriweather text-sm sm:text-base text-white/90 mt-3 leading-relaxed">
              Every Brainbench Technology course includes hands-on practical lab
              sessions, industry mentorship, and certification upon completion.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <button
              type="button"
              onClick={onOpenEnrol}
              className="px-6 py-3.5 bg-[#f58220] hover:bg-[#fdc12e] text-[#121212] font-montserrat font-extrabold text-sm rounded-lg cursor-pointer transition-colors"
            >
              Enrol in a Programme
            </button>
            <Link
              to="/contact"
              className="px-6 py-3.5 bg-white text-[#121212] hover:bg-[#f4f5f8] font-montserrat font-bold text-sm rounded-lg transition-colors"
            >
              Speak With Admissions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ============================================================================
   3. DEDICATED COURSES PAGE (/courses)
============================================================================ */
interface CoursesPageProps {
  initialCategory?: string;
  selectedCourseIds: string[];
  onToggleCourse: (course: CourseItem) => void;
  onInspectCourse: (course: CourseItem) => void;
  onOpenLightbox: (imageUrl: string, caption: string, label: string) => void;
  onOpenEnrol: () => void;
  onClearSelectedCourses: () => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({
  initialCategory = 'all',
  selectedCourseIds,
  onToggleCourse,
  onInspectCourse,
  onOpenLightbox,
  onOpenEnrol,
  onClearSelectedCourses,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] =
    useState<string>(initialCategory);
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [sortBy, setSortBy] = useState<
    'alphabetical' | 'all-az' | 'price-asc' | 'price-desc'
  >('alphabetical');

  React.useEffect(() => {
    if (initialCategory) {
      setActiveCategoryFilter(initialCategory);
    }
  }, [initialCategory]);

  const durations = useMemo(() => {
    const set = new Set<string>();
    ALL_COURSES.forEach((c) => {
      if (c.duration) set.add(c.duration);
    });
    return Array.from(set);
  }, []);

  const isFiltering =
    searchQuery.trim() !== '' ||
    activeCategoryFilter !== 'all' ||
    selectedDuration !== 'all' ||
    sortBy !== 'alphabetical';

  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = ALL_COURSES.filter((course) => {
      const matchesCat =
        activeCategoryFilter === 'all' ||
        course.category === activeCategoryFilter;
      const matchesDur =
        selectedDuration === 'all' || course.duration === selectedDuration;
      const matchesQuery =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.description.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q) ||
        course.outline.some((o) => o.toLowerCase().includes(q)) ||
        (course.keywords &&
          course.keywords.some((k) => k.toLowerCase().includes(q)));
      return matchesCat && matchesDur && matchesQuery;
    });

    if (sortBy === 'price-asc') {
      return [...list].sort(
        (a, b) =>
          a.priceNumeric - b.priceNumeric ||
          a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
      );
    }
    if (sortBy === 'price-desc') {
      return [...list].sort(
        (a, b) =>
          b.priceNumeric - a.priceNumeric ||
          a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
      );
    }
    return sortCoursesAlphabetically(list);
  }, [searchQuery, activeCategoryFilter, selectedDuration, sortBy]);

  const coursesByCategory = useMemo(() => {
    const map: Record<string, CourseItem[]> = {};
    CATEGORY_INDEX.forEach((cat) => {
      map[cat.name] = sortCoursesAlphabetically(
        ALL_COURSES.filter((c) => c.category === cat.name)
      );
    });
    return map;
  }, []);

  const selectedCourses = useMemo(
    () =>
      sortCoursesAlphabetically(
        ALL_COURSES.filter((c) => selectedCourseIds.includes(c.id))
      ),
    [selectedCourseIds]
  );
  const subtotalTuition = useMemo(
    () => selectedCourses.reduce((sum, c) => sum + c.priceNumeric, 0),
    [selectedCourses]
  );
  const bundleDiscount =
    selectedCourses.length >= 2 ? Math.round(subtotalTuition * 0.1) : 0;
  const estimatedTotal = subtotalTuition - bundleDiscount;

  return (
    <div className="w-full bg-white">
      {/* =====================================================================
          FIGMA COURSE CATALOGUE HERO (Web – Course Catalogue Hero, node-id=2030-2)
      ===================================================================== */}
      <section
        aria-label="Course Catalogue Hero"
        className="relative w-full overflow-hidden border-b border-[#eadfc9]"
      >
        <CourseCatalogueHero
          onOpenEnrol={onOpenEnrol}
          onOpenLightbox={onOpenLightbox}
          isCarouselSlide={false}
        />
      </section>

      {/* =====================================================================
          SKILL CATEGORIES SECTION (#categories)
      ===================================================================== */}
      <section
        id="categories"
        className="w-full bg-white border-b border-[#e3e5f0] pt-14 pb-10 lg:pt-20 lg:pb-12 scroll-mt-20"
      >
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="w-6 h-[2.5px] bg-[#f58220] rounded-full" />
                <span className="font-montserrat font-extrabold text-xs uppercase tracking-[0.2em] text-[#1c3f9c]">
                  {CATEGORY_INDEX.length} SPECIALISED TRACKS
                </span>
              </div>
              <h2 className="font-montserrat font-extrabold text-2xl sm:text-3xl text-[#0b1c48]">
                Browse Skill Categories
              </h2>
            </div>
            <p className="font-merriweather text-xs sm:text-sm text-[#454545] max-w-md">
              Select a skill category below to filter the 2026 price list or
              explore all {ALL_COURSES.length} certified courses across our{' '}
              {CATEGORY_INDEX.length} departments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORY_INDEX.map((cat) => {
              const isCatActive = activeCategoryFilter === cat.name;
              return (
                <div
                  key={cat.id}
                  onClick={() =>
                    setActiveCategoryFilter(isCatActive ? 'all' : cat.name)
                  }
                  className={`rounded-xl border transition-all flex flex-col justify-between p-5 bg-white cursor-pointer ${
                    isCatActive
                      ? 'border-[#1c3f9c] ring-2 ring-[#1c3f9c]/15'
                      : 'border-[#e3e5f0] hover:border-[#1c3f9c]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span
                        className="w-8 h-2 rounded-xs shrink-0"
                        style={{ backgroundColor: cat.accentColor }}
                      />
                      <span className="bg-[#f7941d] text-[#121212] font-montserrat font-bold text-xs px-2.5 py-1 rounded-xs tabular-nums">
                        {cat.courseCount}{' '}
                        {cat.courseCount === 1 ? 'course' : 'courses'}
                      </span>
                    </div>

                    <h3 className="font-montserrat font-extrabold text-base text-[#1c3f9c] leading-snug">
                      {cat.name}
                    </h3>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#e3e5f0] flex items-center justify-between gap-2">
                    <span className="text-xs font-montserrat font-bold text-[#121212]">
                      {isCatActive ? 'Showing Category' : 'Filter Category'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#1c3f9c]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          COURSE CATALOGUE LISTING & SEARCH CONTROLS (#course-list)
      ===================================================================== */}
      <div id="course-list" className="w-full scroll-mt-20">
        <section className="w-full bg-white border-b border-[#e3e5f0] py-10 lg:py-12">
          <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
            {/* Search & Filter Controls */}
            <div className="bg-[#F8F9FC] rounded-xl border border-[#e3e5f0] p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#454545] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search all ${ALL_COURSES.length} courses by title, category, or keyword (e.g., Public Speaking, CapCut, Premiere Pro, Vibe Coding, AI, Python)...`}
                    className="w-full pl-11 pr-10 py-3 bg-white border border-[#e3e5f0] rounded-lg text-sm font-montserrat text-[#121212] placeholder:text-[#454545]/70 focus:outline-none focus:border-[#1c3f9c]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#454545] hover:text-[#121212] cursor-pointer"
                      aria-label="Clear search query"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#1c3f9c] shrink-0" />
                    <select
                      value={activeCategoryFilter}
                      onChange={(e) => setActiveCategoryFilter(e.target.value)}
                      aria-label="Filter by category"
                      className="bg-white border border-[#e3e5f0] rounded-lg px-3.5 py-2.5 text-xs font-montserrat font-bold text-[#121212] focus:outline-none focus:border-[#1c3f9c]"
                    >
                      <option value="all">
                        All {CATEGORY_INDEX.length} Categories (
                        {ALL_COURSES.length})
                      </option>
                      {CATEGORY_INDEX.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name} ({cat.courseCount})
                        </option>
                      ))}
                    </select>
                  </div>

                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    aria-label="Filter by course duration"
                    className="bg-white border border-[#e3e5f0] rounded-lg px-3.5 py-2.5 text-xs font-montserrat font-bold text-[#121212] focus:outline-none focus:border-[#1c3f9c]"
                  >
                    <option value="all">All Durations</option>
                    {durations.map((d) => (
                      <option key={d} value={d}>
                        Duration: {d}
                      </option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value as
                          | 'alphabetical'
                          | 'all-az'
                          | 'price-asc'
                          | 'price-desc'
                      )
                    }
                    aria-label="Sort courses"
                    className="bg-white border border-[#e3e5f0] rounded-lg px-3.5 py-2.5 text-xs font-montserrat font-bold text-[#121212] focus:outline-none focus:border-[#1c3f9c]"
                  >
                    <option value="alphabetical">
                      Sort: Alphabetical (A–Z)
                    </option>
                    <option value="all-az">View: All Courses (A–Z)</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>

                  {isFiltering && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategoryFilter('all');
                        setSelectedDuration('all');
                        setSortBy('alphabetical');
                      }}
                      className="px-3.5 py-2.5 text-xs font-montserrat font-bold text-[#e4265a] hover:bg-white rounded-lg border border-transparent hover:border-[#e3e5f0] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {isFiltering && (
                <div className="mt-8 pt-8 border-t border-[#e3e5f0]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-montserrat font-extrabold text-lg text-[#121212]">
                      {activeCategoryFilter !== 'all'
                        ? `${activeCategoryFilter} (${filteredCourses.length} ${
                            filteredCourses.length === 1 ? 'course' : 'courses'
                          } · A–Z)`
                        : `Course Catalogue Results (${filteredCourses.length} ${
                            filteredCourses.length === 1 ? 'course' : 'courses'
                          } · A–Z)`}
                    </h3>
                  </div>

                  {filteredCourses.length === 0 ? (
                    <div className="bg-white rounded-xl border border-[#e3e5f0] p-12 text-center">
                      <p className="font-montserrat font-bold text-base text-[#121212]">
                        No courses match your current filter criteria
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setActiveCategoryFilter('all');
                          setSelectedDuration('all');
                          setSortBy('alphabetical');
                        }}
                        className="mt-4 px-5 py-2.5 bg-[#1c3f9c] text-white text-xs font-montserrat font-bold rounded-lg cursor-pointer"
                      >
                        Show All {ALL_COURSES.length} Courses
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {filteredCourses.map((course) => (
                        <CourseWebsiteCard
                          key={course.id}
                          course={course}
                          isSelected={selectedCourseIds.includes(course.id)}
                          onToggleCourse={onToggleCourse}
                          onInspectCourse={onInspectCourse}
                          onOpenLightbox={onOpenLightbox}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Full Category Sections (Each Category Sorted Alphabetically A–Z) */}
        {!isFiltering &&
          CATEGORY_INDEX.map((cat, catIdx) => {
            const courses = coursesByCategory[cat.name] || [];

            return (
              <section
                key={cat.id}
                id={`cat-${cat.id}`}
                className={`w-full py-16 lg:py-24 border-b border-[#e3e5f0] ${
                  catIdx % 2 === 1 ? 'bg-[#F8F9FC]' : 'bg-white'
                }`}
              >
                <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-[#e3e5f0]">
                    <div>
                      <div
                        className="inline-flex items-center px-7 py-3 rounded-lg"
                        style={{
                          background:
                            'linear-gradient(90deg, #f58220 0%, #fdc12e 100%)',
                        }}
                      >
                        <h2 className="font-montserrat font-extrabold text-2xl sm:text-3xl text-[#121212] leading-none">
                          {cat.name}
                        </h2>
                      </div>
                    </div>

                    <div className="font-montserrat text-xs sm:text-sm font-semibold text-[#454545] tabular-nums">
                      {cat.courseCount} Certified{' '}
                      {cat.courseCount === 1 ? 'Programme' : 'Programmes'} ·
                      Alphabetical Order (A–Z)
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {courses.map((course) => (
                      <CourseWebsiteCard
                        key={course.id}
                        course={course}
                        isSelected={selectedCourseIds.includes(course.id)}
                        isFeaturedSplit={false}
                        onToggleCourse={onToggleCourse}
                        onInspectCourse={onInspectCourse}
                        onOpenLightbox={onOpenLightbox}
                      />
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
      </div>

      {/* Tuition Estimator & Enrolment Footer Section */}
      <section className="w-full bg-[#174da8] text-white py-20">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-6">
              <span className="font-montserrat font-extrabold text-xs uppercase tracking-widest text-[#fdc12e]">
                2026 COHORT ADMISSIONS
              </span>
              <h2 className="font-montserrat font-extrabold text-3xl sm:text-4xl text-white">
                Calculate Your Tuition &amp; Reserve Your Cohort Seat
              </h2>
              <p className="font-merriweather text-base text-white/90 leading-relaxed max-w-xl">
                {BACK_COVER_DATA.ctaBody} Enrol in two or more courses to
                receive an automatic 10% multi-course tuition discount.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={onOpenEnrol}
                  className="px-6 py-3.5 bg-[#f58220] hover:bg-[#fdc12e] text-[#121212] font-montserrat font-extrabold text-sm rounded-lg cursor-pointer transition-colors"
                >
                  Open Enrolment Application
                </button>
                <Link
                  to="/contact"
                  className="px-6 py-3.5 bg-white/15 hover:bg-white/25 text-white font-montserrat font-bold text-sm rounded-lg transition-colors"
                >
                  Contact Admissions
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white text-[#121212] rounded-xl border border-[#e3e5f0] p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-[#e3e5f0]">
                <div className="flex items-center gap-2.5">
                  <Calculator className="w-5 h-5 text-[#f58220]" />
                  <h3 className="font-montserrat font-extrabold text-lg text-[#121212]">
                    Tuition &amp; Track Estimator
                  </h3>
                </div>
                {selectedCourses.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearSelectedCourses}
                    className="text-xs font-montserrat font-bold text-[#e4265a] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {selectedCourses.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="font-montserrat font-bold text-sm text-[#121212]">
                    No courses selected in your estimate yet
                  </p>
                  <p className="font-merriweather text-xs text-[#454545] mt-1.5">
                    Click &ldquo;Add to Estimate&rdquo; on any course card above
                    to calculate your total tuition.
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1">
                    {selectedCourses.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between gap-3 p-3 bg-[#f8f9fc] rounded-lg border border-[#e3e5f0]"
                      >
                        <div className="min-w-0">
                          <div className="font-montserrat font-bold text-xs text-[#121212] truncate">
                            {c.title}
                          </div>
                          <div className="font-merriweather text-[11px] text-[#454545] mt-0.5 tabular-nums">
                            {c.duration
                              ? `${c.category} · ${c.duration}`
                              : c.category}
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className="font-montserrat font-extrabold text-xs text-[#174da8] tabular-nums">
                            {c.price}
                          </span>
                          <button
                            type="button"
                            onClick={() => onToggleCourse(c)}
                            className="text-[#454545] hover:text-[#e4265a] cursor-pointer"
                            aria-label={`Remove ${c.title}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#e3e5f0] space-y-2 text-xs font-montserrat">
                    <div className="flex justify-between text-[#454545]">
                      <span>Selected Courses:</span>
                      <span className="font-bold text-[#121212] tabular-nums">
                        {selectedCourses.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#454545]">
                      <span>Standard Tuition Subtotal:</span>
                      <span className="font-bold text-[#121212] tabular-nums">
                        ₦{subtotalTuition.toLocaleString()}
                      </span>
                    </div>
                    {bundleDiscount > 0 && (
                      <div className="flex justify-between text-[#10b981] font-bold">
                        <span>Multi-Course Discount (10%):</span>
                        <span className="tabular-nums">
                          -₦{bundleDiscount.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="pt-3 border-t border-[#e3e5f0] flex items-baseline justify-between">
                      <span className="font-extrabold text-sm text-[#121212]">
                        Estimated Total:
                      </span>
                      <span className="font-extrabold text-2xl text-[#1c3f9c] tabular-nums">
                        ₦{estimatedTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenEnrol}
                    className="w-full py-3.5 px-5 bg-[#1c3f9c] hover:bg-[#174da8] text-white font-montserrat font-bold text-xs rounded-lg inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Complete Enrolment Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ============================================================================
   4. DEDICATED CONTACT PAGE (/contact)
============================================================================ */
interface ContactPageProps {
  onOpenEnrol: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenEnrol }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryTopic, setInquiryTopic] = useState(
    'Course Enrolment & Tuition'
  );
  const [message, setMessage] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticket = 'BBT-INQ-' + Math.floor(100000 + Math.random() * 900000);
    setSubmittedTicket(ticket);
  };

  return (
    <div className="w-full bg-white">
      {/* Page Hero */}
      <section className="relative w-full bg-[#061539] text-white py-16 lg:py-24 overflow-hidden border-b border-[#1c3f9c]/30">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url('/images/figma/667d731b.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(6, 21, 57, 0.94) 0%, rgba(6, 21, 57, 0.85) 55%, rgba(6, 21, 57, 0.72) 100%)',
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
            <span className="text-[#fdc12e]">Contact</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2.5 mb-4">
              <span className="w-7 h-[2.5px] bg-[#f58d00] rounded-full shrink-0" />
              <span className="font-montserrat font-extrabold text-xs sm:text-[13px] tracking-[0.2em] uppercase text-[#fdc12e]">
                CONTACT &amp; ADMISSIONS OFFICE
              </span>
            </div>

            <h1 className="font-montserrat font-black text-3xl sm:text-5xl lg:text-[52px] leading-[1.08] tracking-tight text-white">
              Connect With Brainbench Technology.
            </h1>

            <p className="font-merriweather text-base sm:text-lg text-white/90 leading-relaxed mt-4 max-w-2xl">
              Have questions about our 39 certified courses, cohort schedules,{' '}
              <strong>THE EDGE: Beyond the Classroom</strong>, or{' '}
              <strong>BRAINBENCH SPARK IT</strong>? Reach out to our team in
              Ado-Ekiti or send an inquiry below.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information & Inquiry Form Split */}
      <section className="w-full py-20 lg:py-28 bg-[#F8F9FC] border-b border-[#e3e5f0]">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left 5 Columns: Direct Contact Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#1c3f9c] text-white rounded-2xl p-8 space-y-6 shadow-sm">
                <div>
                  <span className="font-montserrat font-extrabold text-xs uppercase tracking-widest text-[#fdc12e]">
                    OUR TRAINING CENTRE
                  </span>
                  <h2 className="font-montserrat font-extrabold text-2xl mt-1">
                    Ado-Ekiti Campus &amp; Admissions
                  </h2>
                </div>

                <div className="space-y-5 pt-2">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#f58220] text-[#121212] flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-montserrat font-bold text-xs text-[#fdc12e] uppercase tracking-wider">
                        PHONE &amp; WHATSAPP
                      </div>
                      <a
                        href="tel:+2348160993158"
                        className="font-montserrat font-bold text-base sm:text-lg text-white hover:underline mt-0.5 block"
                      >
                        +234 816 099 3158
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#f58220] text-[#121212] flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-montserrat font-bold text-xs text-[#fdc12e] uppercase tracking-wider">
                        EMAIL ADDRESS
                      </div>
                      <a
                        href="mailto:info@bbtechng.com"
                        className="font-montserrat font-bold text-base sm:text-lg text-white hover:underline mt-0.5 block"
                      >
                        info@bbtechng.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#f58220] text-[#121212] flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-montserrat font-bold text-xs text-[#fdc12e] uppercase tracking-wider">
                        OFFICE &amp; TRAINING ADDRESS
                      </div>
                      <p className="font-montserrat font-semibold text-sm sm:text-base text-white mt-0.5 leading-snug">
                        Brainbench Building, 47 Damilore Street, Ado-Ekiti,
                        Ekiti State.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/15">
                  <button
                    type="button"
                    onClick={onOpenEnrol}
                    className="w-full py-3.5 px-5 bg-[#f58220] hover:bg-[#fdc12e] text-[#121212] font-montserrat font-extrabold text-xs sm:text-sm rounded-lg inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Launch Online Enrolment Form</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Event Quick Links */}
              <div className="bg-white rounded-2xl border border-[#e3e5f0] p-6 space-y-4">
                <h3 className="font-montserrat font-extrabold text-sm uppercase tracking-wider text-[#121212]">
                  Participating in Brainbench Events?
                </h3>
                <div className="space-y-3">
                  <Link
                    to="/events/the-edge"
                    className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8F9FC] hover:bg-[#e8f0fc] border border-[#e3e5f0] transition-colors"
                  >
                    <div>
                      <div className="font-montserrat font-extrabold text-xs text-[#1c3f9c]">
                        THE EDGE: Beyond the Classroom
                      </div>
                      <div className="font-merriweather text-[11px] text-[#454545] mt-0.5">
                        Bi-weekly interactive mentorship &amp; career forum
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#1c3f9c] shrink-0" />
                  </Link>

                  <Link
                    to="/events/brainbench-spark-it"
                    className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8F9FC] hover:bg-[#e8f0fc] border border-[#e3e5f0] transition-colors"
                  >
                    <div>
                      <div className="font-montserrat font-extrabold text-xs text-[#1c3f9c]">
                        Brainbench Spark It
                      </div>
                      <div className="font-merriweather text-[11px] text-[#454545] mt-0.5">
                        Once every quarter · Student &amp; graduate showcase
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#1c3f9c] shrink-0" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right 7 Columns: Interactive Inquiry & Participation Form */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#e3e5f0] p-7 sm:p-10 shadow-xs">
              <div className="pb-6 border-b border-[#e3e5f0]">
                <span className="font-montserrat font-extrabold text-xs uppercase tracking-widest text-[#1c3f9c]">
                  SEND A DIRECT MESSAGE
                </span>
                <h2 className="font-montserrat font-extrabold text-2xl sm:text-3xl text-[#121212] mt-1">
                  Admissions &amp; Event Participation Inquiry
                </h2>
                <p className="font-merriweather text-xs sm:text-sm text-[#454545] mt-2">
                  Fill out the form below and our team at Brainbench Technology
                  will respond promptly.
                </p>
              </div>

              {submittedTicket ? (
                <div className="py-12 text-center space-y-5">
                  <CheckCircle2 className="w-14 h-14 text-[#10b981] mx-auto" />
                  <div>
                    <h3 className="font-montserrat font-extrabold text-xl text-[#121212]">
                      Inquiry Received by Brainbench Technology
                    </h3>
                    <p className="font-merriweather text-sm text-[#454545] mt-1 max-w-md mx-auto">
                      Thank you, <strong>{fullName}</strong>. Your message
                      regarding <strong>{inquiryTopic}</strong> has been logged
                      (Reference:{' '}
                      <span className="font-mono-tabular font-bold text-[#1c3f9c]">
                        {submittedTicket}
                      </span>
                      ).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedTicket(null);
                      setMessage('');
                    }}
                    className="px-6 py-3 bg-[#1c3f9c] hover:bg-[#174da8] text-white font-montserrat font-bold text-xs rounded-lg cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-montserrat font-bold text-xs text-[#121212] mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Adewale Ogunleye"
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
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +234 803 000 0000"
                        className="w-full px-4 py-3 bg-[#F8F9FC] border border-[#e3e5f0] rounded-lg text-sm font-montserrat text-[#121212] focus:outline-none focus:border-[#1c3f9c]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-montserrat font-bold text-xs text-[#121212] mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 bg-[#F8F9FC] border border-[#e3e5f0] rounded-lg text-sm font-montserrat text-[#121212] focus:outline-none focus:border-[#1c3f9c]"
                      />
                    </div>
                    <div>
                      <label className="block font-montserrat font-bold text-xs text-[#121212] mb-1.5">
                        Inquiry Subject *
                      </label>
                      <select
                        value={inquiryTopic}
                        onChange={(e) => setInquiryTopic(e.target.value)}
                        className="w-full px-4 py-3 bg-[#F8F9FC] border border-[#e3e5f0] rounded-lg text-sm font-montserrat font-semibold text-[#121212] focus:outline-none focus:border-[#1c3f9c]"
                      >
                        <option value="Course Enrolment & Tuition">
                          Course Enrolment &amp; Tuition
                        </option>
                        <option value="THE EDGE: Beyond the Classroom (Bi-Weekly Event)">
                          THE EDGE: Beyond the Classroom (Bi-Weekly Event)
                        </option>
                        <option value="BRAINBENCH SPARK IT (Quarterly Event)">
                          BRAINBENCH SPARK IT (Quarterly Event)
                        </option>
                        <option value="Educational & Corporate Programmes">
                          Educational &amp; Corporate Programmes
                        </option>
                        <option value="General Inquiry">General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-montserrat font-bold text-xs text-[#121212] mb-1.5">
                      Your Message or Question *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us which course, programme, or event you would like to join or learn more about..."
                      className="w-full px-4 py-3 bg-[#F8F9FC] border border-[#e3e5f0] rounded-lg text-sm font-montserrat text-[#121212] focus:outline-none focus:border-[#1c3f9c]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-7 py-4 bg-[#1c3f9c] hover:bg-[#174da8] text-white font-montserrat font-extrabold text-sm rounded-lg inline-flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <span>Submit Inquiry</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
