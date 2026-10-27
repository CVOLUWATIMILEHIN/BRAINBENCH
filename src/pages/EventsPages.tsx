import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Compass,
  ExternalLink,
  FileText,
  Images,
  Lightbulb,
  Maximize2,
  Sparkles,
  Users,
} from 'lucide-react';
import { Link } from '../router';
import {
  SPARK_IT_EVENT_DATA,
  THE_EDGE_EVENT_DATA,
  UPCOMING_SPARK_IT_NOVEMBER_2026,
} from '../data/eventsData';
import {
  DiagonalStripes,
  FourColorBar,
  ResilientImage,
} from '../components/WebsiteSections';

export interface EventPageSharedProps {
  onOpenEnrol: () => void;
  onOpenLightbox: (imageUrl: string, caption: string, label: string) => void;
}

/* ============================================================================
   1. EVENTS DIRECTORY / OVERVIEW PAGE (/events)
============================================================================ */
export const EventsOverviewPage: React.FC<EventPageSharedProps> = ({
  onOpenLightbox,
}) => {
  return (
    <div className="w-full bg-white">
      {/* Page Hero Banner */}
      <section className="relative w-full bg-[#061539] text-white py-20 lg:py-28 overflow-hidden border-b border-[#1c3f9c]/30">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('${THE_EDGE_EVENT_DATA.heroImageUrl}')`,
            backgroundSize: 'cover',
            backgroundPosition: THE_EDGE_EVENT_DATA.heroObjectPosition,
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(6, 21, 57, 0.94) 0%, rgba(6, 21, 57, 0.84) 55%, rgba(6, 21, 57, 0.68) 100%)',
          }}
        />

        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 relative z-10">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-montserrat font-semibold text-white/75 mb-6"
          >
            <Link to="/" className="hover:text-[#fdc12e] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#fdc12e]">Events</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2.5 mb-4">
              <span className="w-7 h-[2.5px] bg-[#f58d00] rounded-full shrink-0" />
              <span className="font-montserrat font-extrabold text-xs sm:text-[13px] tracking-[0.2em] uppercase text-[#fdc12e]">
                BRAINBENCH TECHNOLOGY SIGNATURE EVENTS
              </span>
            </div>

            <h1 className="font-montserrat font-black text-3xl sm:text-5xl lg:text-[54px] leading-[1.08] tracking-tight text-white">
              Signature Events &amp; Programmes
            </h1>

            <p className="font-merriweather text-base sm:text-lg text-white/90 leading-relaxed mt-5 max-w-2xl">
              Alongside classroom training, Brainbench Technology hosts two
              signature events: <strong>The Edge: Beyond the Classroom</strong>,
              our bi-weekly guest-speaker programme, and{' '}
              <strong>Brainbench Spark It</strong>, our quarterly showcase where
              students and graduates present their ideas and innovations.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/events/the-edge"
                className="px-6 py-3.5 bg-[#f58d00] hover:bg-[#e07f00] text-[#061539] font-montserrat font-extrabold text-sm rounded-[10px] inline-flex items-center gap-2.5 transition-all"
              >
                <span>Explore The Edge</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/events/brainbench-spark-it"
                className="px-6 py-3.5 bg-[#0a309e]/85 hover:bg-[#0a309e] text-white border border-white/75 font-montserrat font-bold text-sm rounded-[10px] inline-flex items-center gap-2.5 transition-all"
              >
                <span>Discover Brainbench Spark It</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Event Spotlight: Brainbench Spark It — November Edition */}
      <section
        id="upcoming-events"
        className="w-full py-16 lg:py-24 bg-white border-b border-[#e3e5f0]"
      >
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-[#d91f26] text-white mb-3">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="font-montserrat font-extrabold text-xs uppercase tracking-widest">
                  Upcoming Events
                </span>
              </div>
              <h2 className="font-montserrat font-extrabold text-3xl sm:text-4xl text-[#061539]">
                {UPCOMING_SPARK_IT_NOVEMBER_2026.title}
              </h2>
            </div>
            <p className="font-merriweather text-sm text-[#454545] max-w-[52ch]">
              Our next quarterly student and graduate showcase is coming up in{' '}
              <strong>{UPCOMING_SPARK_IT_NOVEMBER_2026.date}</strong>. Click the
              official flyer to view in full screen.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-[#1c3f9c] bg-gradient-to-br from-[#F8F9FC] via-white to-[#eef3fc] overflow-hidden shadow-sm">
            <div className="h-2 w-full bg-gradient-to-r from-[#1c3f9c] via-[#d91f26] to-[#1c3f9c]" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-8 lg:p-12 items-center">
              {/* Left Column: Official Flyer (Original Aspect Ratio, Complete Design Visible) */}
              <div className="lg:col-span-5 flex justify-center">
                <div
                  onClick={() =>
                    onOpenLightbox(
                      UPCOMING_SPARK_IT_NOVEMBER_2026.flyerImageUrl,
                      `${UPCOMING_SPARK_IT_NOVEMBER_2026.title} (${UPCOMING_SPARK_IT_NOVEMBER_2026.date}) — ${UPCOMING_SPARK_IT_NOVEMBER_2026.description}`,
                      UPCOMING_SPARK_IT_NOVEMBER_2026.title
                    )
                  }
                  className="group relative w-full max-w-[380px] sm:max-w-[420px] rounded-xl border border-[#d5d9eb] bg-white p-2.5 shadow-sm cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
                >
                  <ResilientImage
                    src={UPCOMING_SPARK_IT_NOVEMBER_2026.flyerImageUrl}
                    alt={`${UPCOMING_SPARK_IT_NOVEMBER_2026.title} Official Flyer`}
                    className="w-full h-auto object-contain rounded-lg block"
                  />
                  <div className="mt-2.5 flex items-center justify-between px-2 py-1 text-[11px] font-montserrat font-bold text-[#1c3f9c]">
                    <span>
                      Official Promotional Flyer ·{' '}
                      {UPCOMING_SPARK_IT_NOVEMBER_2026.date}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[#d91f26]">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Full View</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Event Details & Navigation */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#d91f26] text-white font-montserrat font-extrabold text-xs uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span>Status: {UPCOMING_SPARK_IT_NOVEMBER_2026.status}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#1c3f9c] text-white font-montserrat font-extrabold text-xs uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5 text-[#fdc12e]" />
                    <span>Date: {UPCOMING_SPARK_IT_NOVEMBER_2026.date}</span>
                  </span>
                </div>

                <div>
                  <h3 className="font-montserrat font-black text-2xl sm:text-3xl lg:text-4xl text-[#061539] leading-tight">
                    {UPCOMING_SPARK_IT_NOVEMBER_2026.title}
                  </h3>
                  <p className="font-montserrat font-extrabold text-base sm:text-xl text-[#d91f26] mt-2">
                    {UPCOMING_SPARK_IT_NOVEMBER_2026.tagline}
                  </p>
                </div>

                <p className="font-merriweather text-sm sm:text-base text-[#121212] leading-relaxed max-w-2xl">
                  {UPCOMING_SPARK_IT_NOVEMBER_2026.description}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    to={UPCOMING_SPARK_IT_NOVEMBER_2026.eventRoute}
                    className="px-6 py-3.5 bg-[#1c3f9c] hover:bg-[#174da8] text-white font-montserrat font-extrabold text-xs sm:text-sm rounded-lg inline-flex items-center gap-2 transition-colors shadow-xs"
                  >
                    <span>{UPCOMING_SPARK_IT_NOVEMBER_2026.ctaLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href={UPCOMING_SPARK_IT_NOVEMBER_2026.previousEditionGalleryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3.5 bg-white hover:bg-[#F8F9FC] text-[#061539] border-2 border-[#1c3f9c] font-montserrat font-bold text-xs sm:text-sm rounded-lg inline-flex items-center gap-2 transition-colors"
                  >
                    <span>{UPCOMING_SPARK_IT_NOVEMBER_2026.previousEditionGalleryLabel}</span>
                    <ExternalLink className="w-4 h-4 text-[#d91f26] shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Signature Events Directory Cards */}
      <section className="w-full py-20 lg:py-28 bg-[#F8F9FC] border-b border-[#e3e5f0]">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div
                className="inline-flex items-center px-6 py-2.5 rounded-lg mb-4"
                style={{
                  background:
                    'linear-gradient(90deg, #f58220 0%, #fdc12e 100%)',
                }}
              >
                <span className="font-montserrat font-extrabold text-sm sm:text-base text-[#121212] uppercase tracking-wider">
                  Featured Programmes &amp; Events
                </span>
              </div>
              <h2 className="font-montserrat font-extrabold text-3xl sm:text-4xl text-[#121212]">
                Our Two Signature Events
              </h2>
            </div>
            <p className="font-merriweather text-sm text-[#454545] max-w-[52ch]">
              Select either programme below to explore its full description,
              supporting themes, programme details, and event photographs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Card 1: The Edge: Beyond the Classroom */}
            <article className="bg-white rounded-2xl border-2 border-[#1c3f9c] overflow-hidden shadow-xs flex flex-col justify-between">
              <div>
                <div
                  onClick={() =>
                    onOpenLightbox(
                      THE_EDGE_EVENT_DATA.heroImageUrl,
                      THE_EDGE_EVENT_DATA.shortSummary,
                      THE_EDGE_EVENT_DATA.title
                    )
                  }
                  className="group relative aspect-[16/9] bg-[#061539] overflow-hidden cursor-pointer"
                >
                  <ResilientImage
                    src={THE_EDGE_EVENT_DATA.heroImageUrl}
                    alt={THE_EDGE_EVENT_DATA.title}
                    objectPosition={THE_EDGE_EVENT_DATA.heroObjectPosition}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061539]/80 via-[#061539]/20 to-transparent" />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="px-3.5 py-1.5 rounded-md bg-[#f58220] text-[#121212] font-montserrat font-extrabold text-xs uppercase tracking-wider">
                      {THE_EDGE_EVENT_DATA.frequencyBadge}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                    <div>
                      <span className="text-xs font-montserrat font-bold text-[#fdc12e] uppercase tracking-wider block">
                        {THE_EDGE_EVENT_DATA.subtitle}
                      </span>
                      <h3 className="font-montserrat font-extrabold text-2xl sm:text-3xl text-white mt-0.5">
                        {THE_EDGE_EVENT_DATA.title}
                      </h3>
                    </div>
                    <span className="bg-white/95 text-[#121212] p-2 rounded shrink-0">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                <div className="p-7 sm:p-9 space-y-5">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-montserrat font-bold text-[#1c3f9c]">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#e8f0fc]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{THE_EDGE_EVENT_DATA.frequencyBadge}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#f4f5f8] text-[#121212]">
                      <Users className="w-3.5 h-3.5 text-[#1c3f9c]" />
                      <span>Guest-speaker sessions</span>
                    </span>
                  </div>

                  <p className="font-merriweather text-sm sm:text-base text-[#121212] leading-relaxed">
                    {THE_EDGE_EVENT_DATA.shortSummary}
                  </p>

                  <div className="pt-2 border-t border-[#e3e5f0]">
                    <div className="text-xs font-montserrat font-extrabold uppercase tracking-wider text-[#1c3f9c] mb-3">
                      Key Highlights:
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {THE_EDGE_EVENT_DATA.supportingSections.map((item) => (
                        <li
                          key={item.number}
                          className="flex items-start gap-2 text-xs font-montserrat font-semibold text-[#121212]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#f58220] mt-1.5 shrink-0" />
                          <span>{item.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="px-7 sm:px-9 pb-7 sm:pb-9 pt-2 flex flex-wrap items-center justify-between gap-4">
                <Link
                  to="/events/the-edge"
                  className="px-6 py-3.5 bg-[#1c3f9c] hover:bg-[#174da8] text-white font-montserrat font-extrabold text-xs sm:text-sm rounded-lg inline-flex items-center gap-2 transition-colors"
                >
                  <span>Explore The Edge</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>

            {/* Card 2: Brainbench Spark It */}
            <article className="bg-white rounded-2xl border-2 border-[#f58220] overflow-hidden shadow-xs flex flex-col justify-between">
              <div>
                <div
                  onClick={() =>
                    onOpenLightbox(
                      SPARK_IT_EVENT_DATA.heroImageUrl,
                      SPARK_IT_EVENT_DATA.shortSummary,
                      SPARK_IT_EVENT_DATA.title
                    )
                  }
                  className="group relative aspect-[16/9] bg-[#061539] overflow-hidden cursor-pointer"
                >
                  <ResilientImage
                    src={SPARK_IT_EVENT_DATA.heroImageUrl}
                    alt={SPARK_IT_EVENT_DATA.title}
                    objectPosition={SPARK_IT_EVENT_DATA.heroObjectPosition}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061539]/80 via-[#061539]/20 to-transparent" />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="px-3.5 py-1.5 rounded-md bg-[#1c3f9c] text-white font-montserrat font-extrabold text-xs uppercase tracking-wider">
                      {SPARK_IT_EVENT_DATA.frequencyBadge}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                    <div>
                      <span className="text-xs font-montserrat font-bold text-[#fdc12e] uppercase tracking-wider block">
                        {SPARK_IT_EVENT_DATA.subtitle}
                      </span>
                      <h3 className="font-montserrat font-extrabold text-2xl sm:text-3xl text-white mt-0.5">
                        {SPARK_IT_EVENT_DATA.title}
                      </h3>
                    </div>
                    <span className="bg-white/95 text-[#121212] p-2 rounded shrink-0">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                <div className="p-7 sm:p-9 space-y-5">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-montserrat font-bold text-[#1c3f9c]">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#fff4e6] text-[#b35c00]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{SPARK_IT_EVENT_DATA.frequencyBadge}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#f4f5f8] text-[#121212]">
                      <Sparkles className="w-3.5 h-3.5 text-[#f58220]" />
                      <span>Student &amp; graduate showcase</span>
                    </span>
                  </div>

                  <p className="font-merriweather text-sm sm:text-base text-[#121212] leading-relaxed">
                    {SPARK_IT_EVENT_DATA.shortSummary}
                  </p>

                  <div className="pt-2 border-t border-[#e3e5f0]">
                    <div className="text-xs font-montserrat font-extrabold uppercase tracking-wider text-[#1c3f9c] mb-3">
                      Key Highlights:
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {SPARK_IT_EVENT_DATA.supportingSections.map((item) => (
                        <li
                          key={item.number}
                          className="flex items-start gap-2 text-xs font-montserrat font-semibold text-[#121212]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1c3f9c] mt-1.5 shrink-0" />
                          <span>{item.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="px-7 sm:px-9 pb-7 sm:pb-9 pt-2 flex flex-wrap items-center justify-between gap-4">
                <Link
                  to="/events/brainbench-spark-it"
                  className="px-6 py-3.5 bg-[#f58220] hover:bg-[#e07f00] text-[#121212] font-montserrat font-extrabold text-xs sm:text-sm rounded-lg inline-flex items-center gap-2 transition-colors"
                >
                  <span>Discover Brainbench Spark It</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Combined Authentic Event Highlights Gallery */}
      <section className="w-full py-20 lg:py-24 bg-white">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="text-xs font-montserrat font-extrabold uppercase tracking-widest text-[#1c3f9c]">
                AUTHENTIC EVENT MOMENTS
              </div>
              <h2 className="font-montserrat font-extrabold text-3xl sm:text-4xl text-[#121212] mt-2">
                Moments from The Edge &amp; Brainbench Spark It
              </h2>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-montserrat font-bold text-xs sm:text-sm text-[#1c3f9c] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Home Page</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              THE_EDGE_EVENT_DATA.galleryHighlights[0],
              THE_EDGE_EVENT_DATA.galleryHighlights[1],
              SPARK_IT_EVENT_DATA.galleryHighlights[0],
              SPARK_IT_EVENT_DATA.galleryHighlights[1],
            ].map((photo, idx) => (
              <div
                key={photo.id}
                onClick={() =>
                  onOpenLightbox(photo.imageUrl, photo.caption, photo.label)
                }
                className={`group relative h-[280px] rounded-xl border-2 overflow-hidden cursor-pointer bg-[#061539] ${
                  idx < 2 ? 'border-[#1c3f9c]' : 'border-[#f58220]'
                }`}
              >
                <ResilientImage
                  src={photo.imageUrl}
                  alt={photo.caption}
                  objectPosition={photo.objectPosition}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-4">
                  <div>
                    <span className="text-[10px] font-montserrat font-extrabold text-[#fdc12e] uppercase tracking-wider block">
                      {photo.label}
                    </span>
                    <span className="text-white font-montserrat font-bold text-xs line-clamp-2 mt-0.5">
                      {photo.caption}
                    </span>
                  </div>
                  <span className="bg-white/95 text-[#121212] p-1.5 rounded shrink-0 ml-2">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

/* ============================================================================
   2. DEDICATED EVENT PAGE: THE EDGE: BEYOND THE CLASSROOM (/events/the-edge)
============================================================================ */
export const TheEdgeEventPage: React.FC<EventPageSharedProps> = ({
  onOpenLightbox,
}) => {
  return (
    <div className="w-full bg-white">
      {/* 1. DEDICATED EVENT HERO SECTION */}
      <section className="relative w-full min-h-[540px] lg:min-h-[620px] bg-[#061539] text-white flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <ResilientImage
            src={THE_EDGE_EVENT_DATA.heroImageUrl}
            alt={THE_EDGE_EVENT_DATA.title}
            objectPosition={THE_EDGE_EVENT_DATA.heroObjectPosition}
            className="w-full h-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(6, 21, 57, 0.92) 0%, rgba(6, 21, 57, 0.78) 46%, rgba(6, 21, 57, 0.42) 78%, rgba(6, 21, 57, 0.25) 100%)',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(6, 21, 57, 0.35) 0%, rgba(6, 21, 57, 0.1) 50%, rgba(6, 21, 57, 0.65) 100%)',
            }}
          />
        </div>

        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 py-16 lg:py-24 relative z-10">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs font-montserrat font-semibold text-white/80 mb-6"
          >
            <Link to="/" className="hover:text-[#fdc12e] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              to="/events"
              className="hover:text-[#fdc12e] transition-colors"
            >
              Events
            </Link>
            <span>/</span>
            <span className="text-[#fdc12e]">{THE_EDGE_EVENT_DATA.title}</span>
          </nav>

          <div className="max-w-3xl">
            {/* Frequency & Category Label */}
            <div className="inline-flex items-center gap-2.5 mb-4">
              <span className="w-7 h-[2.5px] bg-[#f58d00] rounded-full shrink-0" />
              <span className="font-montserrat font-extrabold text-xs sm:text-[13px] tracking-[0.2em] uppercase text-[#fdc12e]">
                {THE_EDGE_EVENT_DATA.frequencyBadge} ·{' '}
                {THE_EDGE_EVENT_DATA.categoryLabel}
              </span>
            </div>

            {/* Event Title */}
            <h1 className="font-montserrat font-black text-3xl sm:text-5xl lg:text-[54px] leading-[1.08] tracking-tight text-white">
              {THE_EDGE_EVENT_DATA.title}
            </h1>

            {/* Subtitle */}
            <p className="font-montserrat font-bold text-lg sm:text-2xl text-[#fdc12e] mt-3">
              {THE_EDGE_EVENT_DATA.subtitle}
            </p>

            {/* Official Introduction Paragraphs */}
            <div className="mt-5 space-y-4 font-merriweather text-sm sm:text-base text-white/95 leading-relaxed max-w-2xl">
              {THE_EDGE_EVENT_DATA.mainIntroduction.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Hero Primary Action */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/events"
                className="px-6 py-3.5 bg-[#f58d00] hover:bg-[#e07f00] text-[#061539] font-montserrat font-extrabold text-sm rounded-[10px] inline-flex items-center gap-2.5 transition-all"
              >
                <span>Explore Our Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROGRAMME INTRODUCTION & OFFICIAL PROGRAMME DETAILS */}
      <section className="w-full py-20 lg:py-28 bg-white border-b border-[#e3e5f0]">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Main Introduction & Official Programme Details */}
            <div className="lg:col-span-6 space-y-8">
              <div>
                <div
                  className="inline-flex items-center px-6 py-2.5 rounded-lg mb-5"
                  style={{
                    background:
                      'linear-gradient(90deg, #f7941d 0%, #fdc12e 100%)',
                  }}
                >
                  <h2 className="font-montserrat font-extrabold text-lg sm:text-xl text-[#121212]">
                    {THE_EDGE_EVENT_DATA.title}
                  </h2>
                </div>

                <div className="bg-[#1c3f9c] text-white rounded-xl p-7 sm:p-9 shadow-sm">
                  <div className="text-xs font-montserrat font-extrabold uppercase tracking-widest text-[#fdc12e]">
                    {THE_EDGE_EVENT_DATA.subtitle}
                  </div>
                  <div className="space-y-4 mt-4 font-merriweather text-sm sm:text-base text-white/95 leading-relaxed">
                    {THE_EDGE_EVENT_DATA.mainIntroduction.map(
                      (paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Official Programme Details Block */}
              <div className="bg-[#F8F9FC] rounded-xl border-2 border-[#1c3f9c] p-6 sm:p-8">
                <div className="text-xs font-montserrat font-extrabold uppercase tracking-widest text-[#1c3f9c] mb-4">
                  Programme Details
                </div>
                <dl className="divide-y divide-[#e3e5f0]">
                  {THE_EDGE_EVENT_DATA.programmeDetails.map((detail) => (
                    <div
                      key={detail.label}
                      className="py-3.5 first:pt-0 last:pb-0 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4"
                    >
                      <dt className="sm:col-span-4 font-montserrat font-extrabold text-xs sm:text-sm text-[#121212] uppercase tracking-wider">
                        {detail.label}
                      </dt>
                      <dd className="sm:col-span-8 font-merriweather text-sm text-[#454545] leading-relaxed">
                        {detail.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Right Column: Secondary Genuine Event Photograph */}
            <div className="lg:col-span-6 space-y-6">
              <div
                onClick={() =>
                  onOpenLightbox(
                    THE_EDGE_EVENT_DATA.secondaryImageUrl,
                    THE_EDGE_EVENT_DATA.subtitle,
                    THE_EDGE_EVENT_DATA.title
                  )
                }
                className="group relative w-full aspect-[16/10] rounded-xl border-2 border-[#1c3f9c] bg-[#061539] overflow-hidden cursor-pointer shadow-sm"
              >
                <ResilientImage
                  src={THE_EDGE_EVENT_DATA.secondaryImageUrl}
                  alt={THE_EDGE_EVENT_DATA.title}
                  objectPosition={THE_EDGE_EVENT_DATA.secondaryObjectPosition}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-5">
                  <div>
                    <span className="text-[11px] font-montserrat font-extrabold uppercase tracking-wider text-[#fdc12e] block">
                      {THE_EDGE_EVENT_DATA.frequencyBadge}
                    </span>
                    <span className="text-white font-montserrat font-bold text-sm">
                      {THE_EDGE_EVENT_DATA.title} —{' '}
                      {THE_EDGE_EVENT_DATA.subtitle}
                    </span>
                  </div>
                  <span className="bg-white/95 text-[#121212] p-2 rounded">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
              </div>

              <div
                onClick={() =>
                  onOpenLightbox(
                    THE_EDGE_EVENT_DATA.heroImageUrl,
                    THE_EDGE_EVENT_DATA.mainIntroduction[0],
                    THE_EDGE_EVENT_DATA.title
                  )
                }
                className="group relative w-full aspect-[16/9] rounded-xl border-2 border-[#f58220] bg-[#061539] overflow-hidden cursor-pointer shadow-sm"
              >
                <ResilientImage
                  src={THE_EDGE_EVENT_DATA.heroImageUrl}
                  alt={THE_EDGE_EVENT_DATA.title}
                  objectPosition={THE_EDGE_EVENT_DATA.heroObjectPosition}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-5">
                  <div>
                    <span className="text-[11px] font-montserrat font-extrabold uppercase tracking-wider text-[#fdc12e] block">
                      GUEST-SPEAKER SESSIONS
                    </span>
                    <span className="text-white font-montserrat font-bold text-sm">
                      Practitioners and professionals sharing real career
                      experience
                    </span>
                  </div>
                  <span className="bg-white/95 text-[#121212] p-2 rounded">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SUPPORTING CONTENT SECTIONS (4 OFFICIAL SECTIONS) */}
      <section className="w-full py-20 lg:py-28 bg-[#F8F9FC] border-b border-[#e3e5f0]">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-montserrat font-extrabold uppercase tracking-widest text-[#1c3f9c]">
              THE EDGE: BEYOND THE CLASSROOM
            </div>
            <h2 className="font-montserrat font-extrabold text-3xl sm:text-4xl text-[#121212] mt-2">
              {THE_EDGE_EVENT_DATA.subtitle}
            </h2>
            <p className="font-merriweather text-sm sm:text-base text-[#454545] mt-3 leading-relaxed">
              {THE_EDGE_EVENT_DATA.shortSummary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {THE_EDGE_EVENT_DATA.supportingSections.map((item, idx) => {
              const isHighlighted = idx === 0;
              return (
                <div
                  key={item.number}
                  className={`rounded-xl border p-7 sm:p-8 flex flex-col justify-between ${
                    isHighlighted
                      ? 'bg-[#1c3f9c] text-white border-[#1c3f9c]'
                      : 'bg-white text-[#121212] border-[#e3e5f0]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`font-mono-tabular font-bold text-sm px-3 py-1 rounded ${
                          isHighlighted
                            ? 'bg-[#fdc12e] text-[#121212]'
                            : 'bg-[#f7941d] text-[#121212]'
                        }`}
                      >
                        {item.number}
                      </span>
                      <Compass
                        className={`w-5 h-5 ${
                          isHighlighted ? 'text-[#fdc12e]' : 'text-[#1c3f9c]'
                        }`}
                      />
                    </div>

                    <h3
                      className={`font-montserrat font-extrabold text-xl leading-snug ${
                        isHighlighted ? 'text-white' : 'text-[#121212]'
                      }`}
                    >
                      {item.title}
                    </h3>

                    <p
                      className={`font-merriweather text-sm leading-relaxed mt-3 ${
                        isHighlighted ? 'text-white/90' : 'text-[#454545]'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. EVENT PHOTO GALLERY */}
      <section className="w-full py-20 lg:py-28 bg-white border-b border-[#e3e5f0]">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="text-xs font-montserrat font-extrabold uppercase tracking-widest text-[#1c3f9c]">
                AUTHENTIC EVENT PHOTOGRAPHS
              </div>
              <h2 className="font-montserrat font-extrabold text-3xl sm:text-4xl text-[#121212] mt-2">
                The Edge: Beyond the Classroom Gallery
              </h2>
            </div>
            <p className="font-merriweather text-sm text-[#454545] max-w-[52ch]">
              Select any photograph from our sessions at Brainbench Technology
              to view in full screen.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {THE_EDGE_EVENT_DATA.galleryHighlights.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() =>
                  onOpenLightbox(photo.imageUrl, photo.caption, photo.label)
                }
                className={`group relative h-[290px] sm:h-[320px] rounded-xl border-2 overflow-hidden cursor-pointer bg-[#061539] ${
                  index % 2 === 0 ? 'border-[#1c3f9c]' : 'border-[#f58220]'
                }`}
              >
                <ResilientImage
                  src={photo.imageUrl}
                  alt={photo.caption}
                  objectPosition={photo.objectPosition}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-5">
                  <div>
                    <span className="text-[10px] font-montserrat font-extrabold text-[#fdc12e] uppercase tracking-wider block">
                      {photo.label}
                    </span>
                    <span className="text-white font-montserrat font-semibold text-xs sm:text-sm leading-snug mt-1 block">
                      {photo.caption}
                    </span>
                  </div>
                  <span className="bg-white/95 text-[#121212] p-1.5 rounded shrink-0 ml-3">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION */}
      <section className="relative w-full bg-[#174da8] text-white py-20 overflow-hidden">
        <DiagonalStripes blueColor="#1c3f9c" orangeColor="#f58220" />
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 relative z-10">
          <div className="bg-[#061539] rounded-2xl border border-white/15 p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="text-xs font-montserrat font-extrabold uppercase tracking-widest text-[#fdc12e]">
                {THE_EDGE_EVENT_DATA.frequencyBadge}
              </div>
              <h2 className="font-montserrat font-extrabold text-2xl sm:text-4xl text-white mt-2">
                {THE_EDGE_EVENT_DATA.title}
              </h2>
              <p className="font-merriweather text-sm sm:text-base text-white/90 mt-3 leading-relaxed">
                {THE_EDGE_EVENT_DATA.shortSummary}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <Link
                to="/events"
                className="px-6 py-4 bg-[#f58220] hover:bg-[#fdc12e] text-[#121212] font-montserrat font-extrabold text-sm rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <span>Explore Our Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Bottom Navigation Links */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/15 text-xs sm:text-sm font-montserrat font-bold">
            <div className="flex flex-wrap items-center gap-6">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 text-white hover:text-[#fdc12e] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Explore Our Events</span>
              </Link>
              <Link
                to="/"
                className="text-white/80 hover:text-white transition-colors"
              >
                Return to Home
              </Link>
            </div>

            <Link
              to="/events/brainbench-spark-it"
              className="inline-flex items-center gap-2 text-[#fdc12e] hover:underline"
            >
              <span>Discover Brainbench Spark It</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ============================================================================
   3. DEDICATED EVENT PAGE: BRAINBENCH SPARK IT (/events/brainbench-spark-it)
============================================================================ */
export const SparkItEventPage: React.FC<EventPageSharedProps> = ({
  onOpenLightbox,
}) => {
  return (
    <div className="w-full bg-white">
      <FourColorBar lastColor="#f58220" heightClass="h-4" />

      {/* 1. DEDICATED EVENT HERO SECTION */}
      <section className="relative w-full min-h-[540px] lg:min-h-[620px] bg-[#061539] text-white flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <ResilientImage
            src={SPARK_IT_EVENT_DATA.heroImageUrl}
            alt={SPARK_IT_EVENT_DATA.title}
            objectPosition={SPARK_IT_EVENT_DATA.heroObjectPosition}
            className="w-full h-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(6, 21, 57, 0.92) 0%, rgba(6, 21, 57, 0.78) 46%, rgba(6, 21, 57, 0.42) 78%, rgba(6, 21, 57, 0.25) 100%)',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(6, 21, 57, 0.35) 0%, rgba(6, 21, 57, 0.1) 50%, rgba(6, 21, 57, 0.65) 100%)',
            }}
          />
        </div>

        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 py-16 lg:py-24 relative z-10">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs font-montserrat font-semibold text-white/80 mb-6"
          >
            <Link to="/" className="hover:text-[#fdc12e] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              to="/events"
              className="hover:text-[#fdc12e] transition-colors"
            >
              Events
            </Link>
            <span>/</span>
            <span className="text-[#fdc12e]">{SPARK_IT_EVENT_DATA.title}</span>
          </nav>

          <div className="max-w-3xl">
            {/* Frequency & Category Label */}
            <div className="inline-flex items-center gap-2.5 mb-4">
              <span className="w-7 h-[2.5px] bg-[#f58d00] rounded-full shrink-0" />
              <span className="font-montserrat font-extrabold text-xs sm:text-[13px] tracking-[0.2em] uppercase text-[#fdc12e]">
                {SPARK_IT_EVENT_DATA.frequencyBadge} ·{' '}
                {SPARK_IT_EVENT_DATA.categoryLabel}
              </span>
            </div>

            {/* Event Title */}
            <h1 className="font-montserrat font-black text-3xl sm:text-5xl lg:text-[54px] leading-[1.08] tracking-tight text-white">
              {SPARK_IT_EVENT_DATA.title}
            </h1>

            {/* Subtitle */}
            <p className="font-montserrat font-bold text-lg sm:text-2xl text-[#fdc12e] mt-3">
              {SPARK_IT_EVENT_DATA.subtitle}
            </p>

            {/* Official Introduction Paragraphs */}
            <div className="mt-5 space-y-4 font-merriweather text-sm sm:text-base text-white/95 leading-relaxed max-w-2xl">
              {SPARK_IT_EVENT_DATA.mainIntroduction.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Hero Primary Action */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#register-spark-it-november-2026"
                className="px-6 py-3.5 bg-[#f58d00] hover:bg-[#e07f00] text-[#061539] font-montserrat font-extrabold text-sm rounded-[10px] inline-flex items-center gap-2.5 transition-all"
              >
                <span>Register for Spark It — November 2026</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                to="/events"
                className="px-6 py-3.5 bg-[#0a309e]/85 hover:bg-[#0a309e] text-white border border-white/75 font-montserrat font-bold text-sm rounded-[10px] inline-flex items-center gap-2.5 transition-all"
              >
                <span>Explore Our Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 1B. UPCOMING EDITION SPOTLIGHT: BRAINBENCH SPARK IT — NOVEMBER EDITION (NOVEMBER 2026) */}
      <section
        id="upcoming-november-2026"
        className="w-full py-16 lg:py-24 bg-[#F8F9FC] border-b border-[#e3e5f0]"
      >
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <div className="rounded-2xl border-2 border-[#1c3f9c] bg-white overflow-hidden shadow-sm">
            <div className="h-2.5 w-full bg-gradient-to-r from-[#1c3f9c] via-[#d91f26] to-[#1c3f9c]" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-8 lg:p-12 items-center">
              {/* Left Column: Official November 2026 Flyer (Original Aspect Ratio, Complete Design Visible) */}
              <div className="lg:col-span-5 flex justify-center">
                <div
                  onClick={() =>
                    onOpenLightbox(
                      UPCOMING_SPARK_IT_NOVEMBER_2026.flyerImageUrl,
                      `${UPCOMING_SPARK_IT_NOVEMBER_2026.title} (${UPCOMING_SPARK_IT_NOVEMBER_2026.date}) — ${UPCOMING_SPARK_IT_NOVEMBER_2026.description}`,
                      UPCOMING_SPARK_IT_NOVEMBER_2026.title
                    )
                  }
                  className="group relative w-full max-w-[380px] sm:max-w-[420px] rounded-xl border border-[#d5d9eb] bg-[#F8F9FC] p-2.5 shadow-sm cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
                >
                  <ResilientImage
                    src={UPCOMING_SPARK_IT_NOVEMBER_2026.flyerImageUrl}
                    alt={`${UPCOMING_SPARK_IT_NOVEMBER_2026.title} Official Flyer`}
                    className="w-full h-auto object-contain rounded-lg block"
                  />
                  <div className="mt-2.5 flex items-center justify-between px-2 py-1 text-[11px] font-montserrat font-bold text-[#1c3f9c]">
                    <span>
                      Official Promotional Flyer ·{' '}
                      {UPCOMING_SPARK_IT_NOVEMBER_2026.date}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[#d91f26]">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Click to Enlarge</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Upcoming November 2026 Event Information */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#d91f26] text-white font-montserrat font-extrabold text-xs uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span>Status: {UPCOMING_SPARK_IT_NOVEMBER_2026.status}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#1c3f9c] text-white font-montserrat font-extrabold text-xs uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5 text-[#fdc12e]" />
                    <span>Date: {UPCOMING_SPARK_IT_NOVEMBER_2026.date}</span>
                  </span>
                </div>

                <div>
                  <h2 className="font-montserrat font-black text-2xl sm:text-3xl lg:text-4xl text-[#061539] leading-tight">
                    {UPCOMING_SPARK_IT_NOVEMBER_2026.title}
                  </h2>
                  <p className="font-montserrat font-extrabold text-base sm:text-xl text-[#d91f26] mt-2">
                    {UPCOMING_SPARK_IT_NOVEMBER_2026.tagline}
                  </p>
                </div>

                <p className="font-merriweather text-sm sm:text-base text-[#121212] leading-relaxed max-w-2xl">
                  {UPCOMING_SPARK_IT_NOVEMBER_2026.description}
                </p>

                <div className="pt-2 border-t border-[#e3e5f0] flex flex-wrap items-center gap-4">
                  <a
                    href="#register-spark-it-november-2026"
                    className="px-6 py-3.5 bg-[#d91f26] hover:bg-[#b81920] text-white font-montserrat font-extrabold text-xs sm:text-sm rounded-lg inline-flex items-center gap-2.5 transition-colors shadow-xs"
                  >
                    <FileText className="w-4 h-4 shrink-0" />
                    <span>Register for Spark It — November 2026</span>
                  </a>

                  <a
                    href={UPCOMING_SPARK_IT_NOVEMBER_2026.previousEditionGalleryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 bg-[#061539] hover:bg-[#1c3f9c] text-white font-montserrat font-extrabold text-xs sm:text-sm rounded-lg inline-flex items-center gap-2.5 transition-colors"
                  >
                    <Images className="w-4 h-4 text-[#fdc12e] shrink-0" />
                    <span>
                      {UPCOMING_SPARK_IT_NOVEMBER_2026.previousEditionGalleryLabel}
                    </span>
                    <ExternalLink className="w-4 h-4 text-[#fdc12e] shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1C. EMBEDDED REGISTRATION SECTION: REGISTER FOR SPARK IT — NOVEMBER 2026 */}
      <section
        id="register-spark-it-november-2026"
        aria-labelledby="spark-it-registration-heading"
        className="w-full py-16 lg:py-24 bg-white border-b border-[#e3e5f0] scroll-mt-20"
      >
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#1c3f9c] text-white mb-3">
                <FileText className="w-3.5 h-3.5 text-[#fdc12e] shrink-0" />
                <span className="font-montserrat font-extrabold text-xs uppercase tracking-widest text-[#fdc12e]">
                  Official Event Registration · {UPCOMING_SPARK_IT_NOVEMBER_2026.date}
                </span>
              </div>
              <h2
                id="spark-it-registration-heading"
                className="font-montserrat font-extrabold text-2xl sm:text-4xl text-[#061539]"
              >
                Register for Spark It — November 2026
              </h2>
              <p className="font-merriweather text-sm sm:text-base text-[#454545] mt-2.5 max-w-3xl leading-relaxed">
                Complete your official registration below to secure your place for{' '}
                <strong>{UPCOMING_SPARK_IT_NOVEMBER_2026.title}</strong> (
                <em>{UPCOMING_SPARK_IT_NOVEMBER_2026.tagline}</em>). You can fill in
                all fields and submit your registration directly inside this page
                without navigating away from the website.
              </p>
            </div>

            {/* Embedded Google Form Container — Integrated Seamlessly as Part of Website */}
            <div className="rounded-2xl border-2 border-[#1c3f9c] bg-white overflow-hidden shadow-md">
              {/* Brainbench Signature Multi-Color Accent Bar */}
              <div className="h-2.5 w-full bg-gradient-to-r from-[#1c3f9c] via-[#d91f26] via-[#f7941d] to-[#1c3f9c]" />

              {/* Form Portal Header Bar */}
              <div className="px-5 sm:px-8 py-3.5 bg-[#061539] text-white flex flex-wrap items-center justify-between gap-3 border-b border-[#1c3f9c]/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1c3f9c] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-[#fdc12e]" />
                  </div>
                  <div>
                    <div className="font-montserrat font-bold text-xs sm:text-sm text-white">
                      Brainbench Spark It — Registration Portal
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#00ba51] animate-pulse shrink-0" />
                      <span className="font-montserrat font-semibold text-[11px] text-[#fdc12e]">
                        Official Registration Active · November 2026 Edition
                      </span>
                    </div>
                  </div>
                </div>

                <a
                  href={UPCOMING_SPARK_IT_NOVEMBER_2026.registrationFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white font-montserrat font-semibold text-xs rounded-md inline-flex items-center gap-1.5 transition-colors border border-white/20"
                  title="Open the registration form in a new tab if required"
                >
                  <span>Open in New Tab</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#fdc12e]" />
                </a>
              </div>

              {/* Embedded Google Form Frame */}
              <div className="relative w-full bg-white">
                <iframe
                  src={UPCOMING_SPARK_IT_NOVEMBER_2026.registrationFormEmbedUrl}
                  title="Brainbench Spark It — November 2026 Registration Form"
                  width="100%"
                  height="1500"
                  frameBorder="0"
                  marginHeight={0}
                  marginWidth={0}
                  className="w-full h-[1350px] sm:h-[1550px] lg:h-[1750px] border-0 block bg-white"
                  loading="eager"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                >
                  Loading Brainbench Spark It registration form…
                </iframe>
              </div>

              {/* Persistent Helper & Privacy Bar Below Form */}
              <div className="px-6 py-4 bg-[#F8F9FC] text-[#121212] flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#e3e5f0]">
                <p className="font-merriweather text-xs text-[#555] leading-relaxed">
                  Submissions are received securely by Brainbench Technology. Need assistance or have questions? Contact us at{' '}
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
                <a
                  href={UPCOMING_SPARK_IT_NOVEMBER_2026.registrationFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#1c3f9c] hover:underline font-montserrat font-bold inline-flex items-center gap-1 shrink-0"
                >
                  <span>Google Forms External Fallback</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROGRAMME INTRODUCTION & OFFICIAL PROGRAMME DETAILS */}
      <section className="w-full py-20 lg:py-28 bg-white border-b border-[#e3e5f0]">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Main Introduction & Official Programme Details */}
            <div className="lg:col-span-6 space-y-8">
              <div>
                <div
                  className="inline-flex items-center px-6 py-2.5 rounded-lg mb-5"
                  style={{
                    background:
                      'linear-gradient(90deg, #f7941d 0%, #fdc12e 100%)',
                  }}
                >
                  <h2 className="font-montserrat font-extrabold text-lg sm:text-xl text-[#121212]">
                    {SPARK_IT_EVENT_DATA.title}
                  </h2>
                </div>

                <div className="bg-[#1c3f9c] text-white rounded-xl p-7 sm:p-9 shadow-sm">
                  <div className="text-xs font-montserrat font-extrabold uppercase tracking-widest text-[#fdc12e]">
                    {SPARK_IT_EVENT_DATA.subtitle}
                  </div>
                  <div className="space-y-4 mt-4 font-merriweather text-sm sm:text-base text-white/95 leading-relaxed">
                    {SPARK_IT_EVENT_DATA.mainIntroduction.map(
                      (paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Official Programme Details Block */}
              <div className="bg-[#F8F9FC] rounded-xl border-2 border-[#f58220] p-6 sm:p-8">
                <div className="text-xs font-montserrat font-extrabold uppercase tracking-widest text-[#1c3f9c] mb-4">
                  Programme Details
                </div>
                <dl className="divide-y divide-[#e3e5f0]">
                  {SPARK_IT_EVENT_DATA.programmeDetails.map((detail) => (
                    <div
                      key={detail.label}
                      className="py-3.5 first:pt-0 last:pb-0 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4"
                    >
                      <dt className="sm:col-span-4 font-montserrat font-extrabold text-xs sm:text-sm text-[#121212] uppercase tracking-wider">
                        {detail.label}
                      </dt>
                      <dd className="sm:col-span-8 font-merriweather text-sm text-[#454545] leading-relaxed">
                        {detail.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Right Column: Secondary Genuine Brainbench Spark It Photographs */}
            <div className="lg:col-span-6 space-y-6">
              <div
                onClick={() =>
                  onOpenLightbox(
                    SPARK_IT_EVENT_DATA.secondaryImageUrl,
                    SPARK_IT_EVENT_DATA.subtitle,
                    SPARK_IT_EVENT_DATA.title
                  )
                }
                className="group relative w-full aspect-[16/10] rounded-xl border-2 border-[#f58220] bg-[#061539] overflow-hidden cursor-pointer shadow-sm"
              >
                <ResilientImage
                  src={SPARK_IT_EVENT_DATA.secondaryImageUrl}
                  alt={SPARK_IT_EVENT_DATA.title}
                  objectPosition={SPARK_IT_EVENT_DATA.secondaryObjectPosition}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-5">
                  <div>
                    <span className="text-[11px] font-montserrat font-extrabold uppercase tracking-wider text-[#fdc12e] block">
                      {SPARK_IT_EVENT_DATA.frequencyBadge}
                    </span>
                    <span className="text-white font-montserrat font-bold text-sm">
                      {SPARK_IT_EVENT_DATA.title} —{' '}
                      {SPARK_IT_EVENT_DATA.subtitle}
                    </span>
                  </div>
                  <span className="bg-white/95 text-[#121212] p-2 rounded">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
              </div>

              <div
                onClick={() =>
                  onOpenLightbox(
                    SPARK_IT_EVENT_DATA.heroImageUrl,
                    SPARK_IT_EVENT_DATA.mainIntroduction[0],
                    SPARK_IT_EVENT_DATA.title
                  )
                }
                className="group relative w-full aspect-[16/9] rounded-xl border-2 border-[#1c3f9c] bg-[#061539] overflow-hidden cursor-pointer shadow-sm"
              >
                <ResilientImage
                  src={SPARK_IT_EVENT_DATA.heroImageUrl}
                  alt={SPARK_IT_EVENT_DATA.title}
                  objectPosition={SPARK_IT_EVENT_DATA.heroObjectPosition}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-5">
                  <div>
                    <span className="text-[11px] font-montserrat font-extrabold uppercase tracking-wider text-[#fdc12e] block">
                      QUARTERLY SHOWCASE
                    </span>
                    <span className="text-white font-montserrat font-bold text-sm">
                      Students and graduates presenting ideas before an expert
                      panel
                    </span>
                  </div>
                  <span className="bg-white/95 text-[#121212] p-2 rounded">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SUPPORTING CONTENT SECTIONS (4 OFFICIAL SECTIONS) */}
      <section className="w-full py-20 lg:py-28 bg-[#F8F9FC] border-b border-[#e3e5f0]">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-montserrat font-extrabold uppercase tracking-widest text-[#1c3f9c]">
              BRAINBENCH SPARK IT SHOWCASE
            </div>
            <h2 className="font-montserrat font-extrabold text-3xl sm:text-4xl text-[#121212] mt-2">
              {SPARK_IT_EVENT_DATA.subtitle}
            </h2>
            <p className="font-merriweather text-sm sm:text-base text-[#454545] mt-3 leading-relaxed">
              {SPARK_IT_EVENT_DATA.shortSummary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SPARK_IT_EVENT_DATA.supportingSections.map((item, idx) => {
              const isOrangeCard = idx === 0;
              return (
                <div
                  key={item.number}
                  className={`rounded-xl border p-7 sm:p-8 flex flex-col justify-between ${
                    isOrangeCard
                      ? 'bg-[#f58220] border-[#f58220]'
                      : 'bg-white border-[#e3e5f0]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`font-mono-tabular font-bold text-sm px-3 py-1 rounded ${
                          isOrangeCard
                            ? 'bg-[#121212] text-[#fdc12e]'
                            : 'bg-[#1c3f9c] text-white'
                        }`}
                      >
                        {item.number}
                      </span>
                      <Lightbulb
                        className={`w-5 h-5 ${
                          isOrangeCard ? 'text-[#121212]' : 'text-[#f58220]'
                        }`}
                      />
                    </div>

                    <h3 className="font-montserrat font-extrabold text-xl text-[#121212] leading-snug">
                      {item.title}
                    </h3>

                    <p
                      className={`font-merriweather text-sm leading-relaxed mt-3 ${
                        isOrangeCard ? 'text-white' : 'text-[#454545]'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. EVENT PHOTO GALLERY */}
      <section className="w-full py-20 lg:py-28 bg-white border-b border-[#e3e5f0]">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="text-xs font-montserrat font-extrabold uppercase tracking-widest text-[#1c3f9c]">
                PREVIOUS EDITION GALLERY · AUTHENTIC EVENT PHOTOGRAPHS
              </div>
              <h2 className="font-montserrat font-extrabold text-3xl sm:text-4xl text-[#121212] mt-2">
                Previous Edition Gallery: Brainbench Spark It Showcase
              </h2>
            </div>
            <p className="font-merriweather text-sm text-[#454545] max-w-[52ch]">
              Select any photograph from our previous Brainbench Spark It
              presentations and showcases at Brainbench Technology to view in
              full resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SPARK_IT_EVENT_DATA.galleryHighlights.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() =>
                  onOpenLightbox(photo.imageUrl, photo.caption, photo.label)
                }
                className={`group relative h-[290px] sm:h-[320px] rounded-xl border-2 overflow-hidden cursor-pointer bg-[#061539] ${
                  index % 2 === 0 ? 'border-[#f58220]' : 'border-[#1c3f9c]'
                }`}
              >
                <ResilientImage
                  src={photo.imageUrl}
                  alt={photo.caption}
                  objectPosition={photo.objectPosition}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-5">
                  <div>
                    <span className="text-[10px] font-montserrat font-extrabold text-[#fdc12e] uppercase tracking-wider block">
                      {photo.label}
                    </span>
                    <span className="text-white font-montserrat font-semibold text-xs sm:text-sm leading-snug mt-1 block">
                      {photo.caption}
                    </span>
                  </div>
                  <span className="bg-white/95 text-[#121212] p-1.5 rounded shrink-0 ml-3">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4B. PREVIOUS EDITION GALLERY SECTION */}
      {SPARK_IT_EVENT_DATA.previousEditionGalleryUrl && (
        <section
          aria-labelledby="previous-spark-it-gallery-heading"
          className="w-full py-16 lg:py-24 bg-[#F8F9FC] border-b border-[#e3e5f0]"
        >
          <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
            <div className="bg-[#061539] rounded-2xl border-2 border-[#f58220] overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 p-7 sm:p-10 lg:p-12 items-center">
                {/* Left Content Column */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-md bg-[#1c3f9c] border border-white/15">
                    <Images className="w-4 h-4 text-[#fdc12e] shrink-0" />
                    <span className="font-montserrat font-extrabold text-xs tracking-[0.16em] uppercase text-[#fdc12e]">
                      Previous Edition Gallery
                    </span>
                  </div>

                  <h2
                    id="previous-spark-it-gallery-heading"
                    className="font-montserrat font-extrabold text-2xl sm:text-4xl text-white leading-tight"
                  >
                    Relive the Previous Spark It
                  </h2>

                  <p className="font-merriweather text-sm sm:text-base text-white/90 leading-relaxed max-w-2xl">
                    Explore the complete photo album from our previous edition of{' '}
                    <strong className="text-white">Brainbench Spark It</strong>.
                    See our student and graduate presenters on stage, live Q&amp;A
                    moments with the expert review panel, and the tech community
                    coming together at Brainbench Technology.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <a
                      href={SPARK_IT_EVENT_DATA.previousEditionGalleryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto justify-center px-7 py-4 bg-[#f58220] hover:bg-[#fdc12e] text-[#121212] font-montserrat font-extrabold text-sm sm:text-base rounded-lg inline-flex items-center gap-2.5 transition-colors shadow-xs"
                    >
                      <span>View Previous Edition Photos</span>
                      <ExternalLink className="w-4 h-4 shrink-0" />
                    </a>
                  </div>
                </div>

                {/* Right Reliable Preview Strip (Using Verified Local Spark It Photos) */}
                <div className="lg:col-span-5">
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {SPARK_IT_EVENT_DATA.galleryHighlights
                      .slice(0, 3)
                      .map((photo, idx) => (
                        <a
                          key={`prev-preview-${photo.id}`}
                          href={SPARK_IT_EVENT_DATA.previousEditionGalleryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View Previous Edition Photos — ${photo.caption}`}
                          className={`group relative aspect-[3/4] rounded-xl overflow-hidden border-2 bg-[#121212] block ${
                            idx === 1 ? 'border-[#fdc12e]' : 'border-[#1c3f9c]'
                          }`}
                        >
                          <ResilientImage
                            src={photo.imageUrl}
                            alt={photo.caption}
                            objectPosition={photo.objectPosition}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#061539]/80 via-transparent to-transparent flex items-end p-2.5">
                            <span className="text-[10px] font-montserrat font-bold text-[#fdc12e] uppercase tracking-wider flex items-center gap-1">
                              <span>Album</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </span>
                          </div>
                        </a>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. CALL TO ACTION SECTION */}
      <section className="relative w-full bg-[#174da8] text-white py-20 overflow-hidden">
        <DiagonalStripes blueColor="#1c3f9c" orangeColor="#f58220" />
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 relative z-10">
          <div className="bg-[#061539] rounded-2xl border border-white/15 p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="text-xs font-montserrat font-extrabold uppercase tracking-widest text-[#fdc12e]">
                {SPARK_IT_EVENT_DATA.frequencyBadge}
              </div>
              <h2 className="font-montserrat font-extrabold text-2xl sm:text-4xl text-white mt-2">
                {SPARK_IT_EVENT_DATA.title}
              </h2>
              <p className="font-merriweather text-sm sm:text-base text-white/90 mt-3 leading-relaxed">
                {SPARK_IT_EVENT_DATA.shortSummary}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <Link
                to="/events"
                className="px-6 py-4 bg-[#f58220] hover:bg-[#fdc12e] text-[#121212] font-montserrat font-extrabold text-sm rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <span>Explore Our Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Bottom Navigation Links */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/15 text-xs sm:text-sm font-montserrat font-bold">
            <div className="flex flex-wrap items-center gap-6">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 text-white hover:text-[#fdc12e] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Explore Our Events</span>
              </Link>
              <Link
                to="/"
                className="text-white/80 hover:text-white transition-colors"
              >
                Return to Home
              </Link>
            </div>

            <Link
              to="/events/the-edge"
              className="inline-flex items-center gap-2 text-[#fdc12e] hover:underline"
            >
              <span>Explore The Edge: Beyond the Classroom</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
