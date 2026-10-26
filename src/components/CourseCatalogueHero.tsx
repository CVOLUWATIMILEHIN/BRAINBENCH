import React from 'react';
import { COVER_DATA } from '../data/brochureData';
import { Link, useRouter } from '../router';
import { ArrowRight } from 'lucide-react';

interface CourseCatalogueHeroProps {
  onOpenEnrol?: () => void;
  onOpenLightbox?: (imageUrl: string, caption: string, label: string) => void;
  isCarouselSlide?: boolean;
}

export const CourseCatalogueHero: React.FC<CourseCatalogueHeroProps> = ({
  onOpenEnrol,
  onOpenLightbox,
  isCarouselSlide = false,
}) => {
  const { navigate } = useRouter();

  const handleEnrolClick = () => {
    if (onOpenEnrol) {
      onOpenEnrol();
    } else {
      navigate('/contact');
    }
  };

  return (
    <div
      className={`relative w-full ${
        isCarouselSlide
          ? 'h-full min-h-full'
          : 'hero-fullscreen-stage'
      } flex items-center overflow-hidden select-none`}
      style={{
        background:
          'linear-gradient(105deg, #FFFDF8 0%, #FFF8E2 44%, #FDE6A7 78%, #FCD77D 100%)',
      }}
    >
      {/* =====================================================================
          1. EXACT 520x420 OVAL CONTAINER FROM FIGMA (node-id=2030-2)
          Container(
            width: 520,
            height: 420,
            decoration: ShapeDecoration(
              color: const Color(0xE5FFF9EA),
              shape: OvalBorder(),
            ),
          )
      ===================================================================== */}
      <div
        aria-hidden="true"
        style={{
          width: '520px',
          height: '420px',
          backgroundColor: 'rgba(255, 249, 234, 0.90)',
          borderRadius: '50%',
        }}
        className="pointer-events-none absolute top-[10%] left-[4%] lg:left-[7%] z-[1]"
      />

      {/* =====================================================================
          2. BOTTOM-LEFT DECORATIVE BLUE & ORANGE GEOMETRIC WEDGES
      ===================================================================== */}
      <svg
        aria-hidden="true"
        viewBox="0 0 520 96"
        preserveAspectRatio="none"
        className="pointer-events-none absolute bottom-0 left-0 w-[55%] sm:w-[42%] lg:w-[35%] max-w-[520px] h-[56px] sm:h-[76px] lg:h-[92px] z-[2]"
      >
        <defs>
          <linearGradient
            id="figmaHeroBottomLeftOrange"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#F58D00" />
            <stop offset="100%" stopColor="#FBA919" />
          </linearGradient>
        </defs>
        {/* Deep Royal Blue Bottom-Left Corner Wedge */}
        <polygon points="0,0 122,23 76,96 0,96" fill="#0A309E" />
        {/* Warm Orange Adjacent Sloping Wedge */}
        <polygon
          points="122,23 520,96 76,96"
          fill="url(#figmaHeroBottomLeftOrange)"
        />
      </svg>

      {/* =====================================================================
          3. LARGE DIAGONAL ROUNDED ORANGE SHAPE BEHIND PORTRAIT (Right Side)
      ===================================================================== */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 760"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 w-full h-full z-[2]"
      >
        <defs>
          <linearGradient
            id="figmaHeroMainOrangeShape"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#F7941D" />
            <stop offset="100%" stopColor="#F28500" />
          </linearGradient>
        </defs>
        <path
          d="M 656 760 L 656 648 L 856 382 Q 912 310 1002 345 L 1440 520 L 1440 760 Z"
          fill="url(#figmaHeroMainOrangeShape)"
        />
      </svg>

      {/* =====================================================================
          4. TOP-RIGHT DIAGONAL BLUE & ORANGE ROUNDED STRIPES
      ===================================================================== */}
      <div
        aria-hidden="true"
        className="pointer-events-none hidden sm:block absolute top-[2%] right-[-18px] lg:right-[-10px] w-[150px] h-[340px] z-[5]"
      >
        {/* Upper Royal Blue Diagonal Stripe */}
        <div
          className="absolute top-[10px] right-[26px] w-[18px] lg:w-[20px] h-[165px] rounded-full bg-[#0A309E]"
          style={{ transform: 'rotate(32deg)' }}
        />
        {/* Middle Orange Diagonal Stripe */}
        <div
          className="absolute top-[82px] right-[18px] w-[18px] lg:w-[20px] h-[175px] rounded-full bg-[#F58220]"
          style={{ transform: 'rotate(32deg)' }}
        />
        {/* Lower Royal Blue Diagonal Stripe */}
        <div
          className="absolute top-[168px] right-[12px] w-[18px] lg:w-[20px] h-[150px] rounded-full bg-[#0A309E]"
          style={{ transform: 'rotate(32deg)' }}
        />
      </div>

      {/* =====================================================================
          5. RIGHT-SIDE CUTOUT PORTRAIT (dddb419b.png)
      ===================================================================== */}
      <div
        onClick={() =>
          onOpenLightbox?.(
            COVER_DATA.heroPersonUrl,
            'Brainbench Technology — 2026 Course Catalogue & Price List',
            '2026 Course Catalogue'
          )
        }
        className="hidden md:flex absolute bottom-0 right-0 w-[52%] lg:w-[49%] xl:w-[47%] h-[95%] lg:h-[97%] z-[3] items-end justify-end pointer-events-auto cursor-pointer"
      >
        <img
          src={COVER_DATA.heroPersonUrl}
          alt="Brainbench Technology Course Catalogue featured student portrait"
          loading="eager"
          decoding="async"
          className="w-full h-full object-contain object-right-bottom select-none"
        />
      </div>

      {/* =====================================================================
          6. LEFT-ALIGNED MAIN CONTENT & FLOATING BOTTOM-RIGHT INFO CARD
      ===================================================================== */}
      <div className="relative z-[4] w-full h-full px-8 sm:px-16 md:px-20 lg:px-[9.5%] pt-10 pb-20 lg:py-14 flex flex-col justify-center">
        <div className="w-full max-w-[560px] xl:max-w-[600px] text-left">
          {/* Giant Two-Line Heading: "Course" (Navy) + "Catalogue" (Orange-to-Yellow Gradient) */}
          <h1 className="font-montserrat font-black text-[50px] sm:text-[68px] md:text-[76px] lg:text-[84px] xl:text-[92px] leading-[0.97] tracking-[-0.03em]">
            <span className="block text-[#061539]">Course</span>
            <span
              className="block bg-clip-text text-transparent pb-1"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #F58220 0%, #F7941D 48%, #FDC12E 100%)',
              }}
            >
              Catalogue
            </span>
          </h1>

          {/* "2026 PRICE LIST" + Horizontal Accent Line */}
          <div className="mt-4 sm:mt-5 flex items-center gap-4">
            <span className="font-montserrat font-extrabold text-sm sm:text-base lg:text-[18px] tracking-[0.28em] uppercase text-[#0A309E]">
              2026 PRICE LIST
            </span>
            <span
              aria-hidden="true"
              className="w-12 sm:w-14 h-[2px] bg-[#F59300] rounded-full shrink-0"
            />
          </div>

          {/* Introductory Description */}
          <p className="mt-4 sm:mt-5 font-montserrat font-normal text-[#1E293B] text-sm sm:text-[15.5px] lg:text-[16.5px] leading-[1.65] max-w-[480px]">
            A complete guide to our tech, design, data, and professional
            development programmes, built to sharpen skills and open new career
            paths.
          </p>

          {/* Two CTA Buttons */}
          <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
            <Link
              to="/courses#course-list"
              className="px-6 sm:px-7 py-3.5 sm:py-4 bg-[#0A309E] hover:bg-[#072378] text-white font-montserrat font-bold text-xs sm:text-[14px] rounded-[10px] shadow-[0_8px_20px_rgba(10,48,158,0.22)] inline-flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Explore 39 Courses</span>
              <ArrowRight className="w-4 h-4 stroke-[2.4]" />
            </Link>

            <Link
              to="/courses#categories"
              className="px-5 sm:px-6 py-3.5 sm:py-4 bg-transparent hover:bg-[#0A309E]/8 text-[#0A309E] border-[1.75px] border-[#0A309E] font-montserrat font-bold text-xs sm:text-[14px] rounded-[10px] inline-flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap"
            >
              {/* 2x2 Category Grid Icon with Circle Bottom-Right (matches Figma icon) */}
              <svg
                aria-hidden="true"
                viewBox="0 0 18 18"
                className="w-4 h-4 text-[#0A309E] shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="2" y="2" width="5.5" height="5.5" rx="1" />
                <rect x="10.5" y="2" width="5.5" height="5.5" rx="1" />
                <rect x="2" y="10.5" width="5.5" height="5.5" rx="1" />
                <circle cx="13.25" cy="13.25" r="2.75" />
              </svg>
              <span>Browse 5 Skill Categories</span>
            </Link>
          </div>
        </div>

        {/* Mobile Portrait Preview (shown below text on small screens) */}
        <div className="md:hidden mt-6 relative w-full max-w-[340px] mx-auto flex justify-center">
          <img
            src={COVER_DATA.heroPersonUrl}
            alt="Brainbench Technology Course Catalogue featured student portrait"
            className="w-full h-auto max-h-[280px] object-contain object-bottom"
          />
        </div>

        {/* Floating White Information Card Near the Bottom-Right of the Hero */}
        <div
          className={`mt-6 md:mt-0 md:absolute ${
            isCarouselSlide
              ? 'md:bottom-14 lg:bottom-14'
              : 'md:bottom-8 lg:bottom-10'
          } md:right-6 lg:right-[6%] z-[6] w-full max-w-[590px] bg-white rounded-[16px] shadow-[0_14px_36px_rgba(6,21,57,0.14)] px-4 sm:px-5 py-3 sm:py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 sm:gap-5`}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Royal Blue Community / Practical Training Icon (matches Figma card) */}
            <div className="w-9 h-9 rounded-lg bg-[#0A309E]/8 flex items-center justify-center shrink-0 text-[#0A309E]">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="currentColor"
              >
                <circle cx="12" cy="9" r="3.2" />
                <circle cx="6.5" cy="6.5" r="1.8" />
                <circle cx="17.5" cy="6.5" r="1.8" />
                <path d="M6.5 18.5c0-2.6 2.5-4.5 5.5-4.5s5.5 1.9 5.5 4.5v1.5H6.5v-1.5z" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="font-montserrat font-extrabold text-[11px] sm:text-[12.5px] tracking-[0.05em] uppercase text-[#0A309E]">
                HANDS-ON PRACTICAL TRAINING
              </div>
              <div className="font-montserrat font-medium text-[11px] sm:text-[12px] text-[#334155] mt-0.5 leading-snug">
                Ado-Ekiti Training Centre · 100% Certified Programmes
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleEnrolClick}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-[#F59300] hover:bg-[#e08400] text-[#061539] font-montserrat font-extrabold text-xs sm:text-[13px] rounded-[10px] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Enrol Today</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
