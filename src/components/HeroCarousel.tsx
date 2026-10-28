import React, { useCallback, useEffect, useRef, useState } from 'react';
import { COVER_DATA, CourseItem } from '../data/brochureData';
import { Link } from '../router';
import { CourseCatalogueHero } from './CourseCatalogueHero';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroCarouselProps {
  onScrollToSection?: (sectionId: string) => void;
  onOpenEnrol?: () => void;
  onInspectCourse?: (course: CourseItem) => void;
  onOpenLightbox?: (imageUrl: string, caption: string, label: string) => void;
}

interface HeroSlideData {
  id: string;
  isFigmaCatalogueSlide?: boolean;
  category: string;
  headline: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaRoute: string;
  secondaryCtaLabel: string;
  secondaryCtaRoute: string;
  imageUrl: string;
  fallbackImageUrl: string;
  imageAlt: string;
  objectPosition: string;
}

const DEFAULT_VERIFIED_HERO_IMAGE = '/images/figma/667d731b.jpg';

const HERO_SLIDES: HeroSlideData[] = [
  {
    id: 'slide-brainbench-solutions',
    category: 'BRAINBENCH SOFTWARE SOLUTIONS',
    headline: 'Brainbench Solutions',
    description:
      'Empowering schools, institutions, and organisations with ULTRA CBT for computer-based testing, PORTAL PRO for campus administration, and LMS E-LIBRARY for digital learning.',
    primaryCtaLabel: 'Explore Our Solutions',
    primaryCtaRoute: '/solutions',
    secondaryCtaLabel: 'Request a Demo',
    secondaryCtaRoute: '/solutions#request-demo',
    imageUrl: '/images/figma/667d731b.jpg',
    fallbackImageUrl: '/images/figma/f064034f.jpg',
    imageAlt:
      'Brainbench Solutions — ULTRA CBT, PORTAL PRO, and LMS E-LIBRARY institutional software suites',
    objectPosition: 'center 35%',
  },
  {
    id: 'slide-technology-courses',
    category: 'COURSES & PROFESSIONAL DEVELOPMENT',
    headline: 'Build Skills for the Future.',
    description:
      'Explore practical learning experiences across AI, automation, product design, data analysis, and web development.',
    primaryCtaLabel: 'Explore Courses',
    primaryCtaRoute: '/courses',
    secondaryCtaLabel: 'View Solutions',
    secondaryCtaRoute: '/solutions',
    imageUrl: '/images/figma/9a992152.jpg',
    fallbackImageUrl: '/images/figma/f064034f.jpg',
    imageAlt:
      'Brainbench Technology students learning practical technology skills on laptops in the training studio',
    objectPosition: 'center 62%',
  },
  {
    id: 'slide-the-edge',
    category: 'THE EDGE | BI-WEEKLY PROGRAMME',
    headline: 'THE EDGE: Beyond the Classroom',
    description:
      'Going beyond traditional learning through engaging conversations, practical insights, and exposure to ideas that prepare learners for the real world.',
    primaryCtaLabel: 'Explore The Edge',
    primaryCtaRoute: '/events/the-edge',
    secondaryCtaLabel: 'All Events',
    secondaryCtaRoute: '/events',
    imageUrl: '/images/figma/1f2b9b58-clean.jpg',
    fallbackImageUrl: '/images/figma/210ae02d-clean.jpg',
    imageAlt:
      'THE EDGE: Beyond the Classroom bi-weekly interactive session at Brainbench Technology',
    objectPosition: 'center 25%',
  },
  {
    id: 'slide-brainbench-spark-it',
    category: 'BRAINBENCH ACADEMIC PROGRAMME',
    headline: 'BRAINBENCH SPARK IT',
    description:
      'A platform for sparking ideas, encouraging creativity, and exploring innovation through engaging academic experiences.',
    primaryCtaLabel: 'Discover Brainbench Spark It',
    primaryCtaRoute: '/events/brainbench-spark-it',
    secondaryCtaLabel: 'Explore Solutions',
    secondaryCtaRoute: '/solutions',
    imageUrl: '/images/figma/72fcae01.jpg',
    fallbackImageUrl: '/images/figma/2a9182e3.jpg',
    imageAlt:
      'BRAINBENCH SPARK IT academic programme project presentation at the interactive smartboard',
    objectPosition: 'center 28%',
  },
  {
    id: 'slide-course-catalogue-figma',
    isFigmaCatalogueSlide: true,
    category: '2026 PRICE LIST',
    headline: 'Course Catalogue',
    description:
      'A complete guide to our tech, design, data, and professional development programmes, built to sharpen skills and open new career paths.',
    primaryCtaLabel: 'Explore Courses',
    primaryCtaRoute: '/courses#course-list',
    secondaryCtaLabel: 'Browse Skill Categories',
    secondaryCtaRoute: '/courses#categories',
    imageUrl: COVER_DATA.heroPersonUrl,
    fallbackImageUrl: '/images/figma/f064034f.jpg',
    imageAlt:
      'Brainbench Technology 2026 Course Catalogue & Price List featured student portrait',
    objectPosition: '50% 10%',
  },
  {
    id: 'slide-brainbench-technology',
    category: 'TECHNOLOGY EDUCATION',
    headline: 'Learn Today. Build Tomorrow.',
    description:
      'Develop practical technology skills and discover opportunities to innovate, create, and thrive in the digital economy.',
    primaryCtaLabel: 'Discover Brainbench',
    primaryCtaRoute: '/about',
    secondaryCtaLabel: 'Explore Courses',
    secondaryCtaRoute: '/courses',
    imageUrl: '/images/figma/f064034f.jpg',
    fallbackImageUrl: '/images/figma/667d731b.jpg',
    imageAlt:
      'Brainbench Technology instructor and students during a practical classroom training session',
    objectPosition: 'center 35%',
  },
  {
    id: 'slide-practical-technology-learning',
    category: 'LEARN. BUILD. INNOVATE.',
    headline: 'Turn Knowledge Into Action.',
    description:
      'Develop practical skills, explore new ideas, and build the confidence to solve real-world problems with technology.',
    primaryCtaLabel: 'Start Learning',
    primaryCtaRoute: '/contact',
    secondaryCtaLabel: 'Explore Courses',
    secondaryCtaRoute: '/courses',
    imageUrl: '/images/figma/8250a39c.jpg',
    fallbackImageUrl: '/images/figma/f064034f.jpg',
    imageAlt:
      'Brainbench Technology students collaborating on practical software projects',
    objectPosition: 'center 52%',
  },
];

const AUTOPLAY_DURATION_MS = 3000;

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  onOpenEnrol,
  onOpenLightbox,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [timerResetKey, setTimerResetKey] = useState(0);

  // Track resolved image URLs and load states per slide to prevent blank slides
  const [resolvedUrls, setResolvedUrls] = useState<Record<string, string>>(() =>
    Object.fromEntries(HERO_SLIDES.map((s) => [s.id, s.imageUrl]))
  );
  const [loadedSlides, setLoadedSlides] = useState<Record<string, boolean>>({});
  const [failedSlides, setFailedSlides] = useState<Record<string, boolean>>({});
  const [lastValidImage, setLastValidImage] = useState<{
    src: string;
    objectPosition: string;
  }>({
    src: DEFAULT_VERIFIED_HERO_IMAGE,
    objectPosition: 'center 35%',
  });

  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const failedSlidesRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    failedSlidesRef.current = failedSlides;
  }, [failedSlides]);

  const slideCount = HERO_SLIDES.length;
  const activeSlide = HERO_SLIDES[activeIndex];
  const isFigmaSlideActive = Boolean(activeSlide.isFigmaCatalogueSlide);

  // Preload all slide photographs and track load/error status
  useEffect(() => {
    HERO_SLIDES.forEach((slide) => {
      const preloadImg = new Image();
      preloadImg.src = slide.imageUrl;
      preloadImg.onload = () => {
        setLoadedSlides((prev) => ({ ...prev, [slide.id]: true }));
      };
      preloadImg.onerror = () => {
        console.error(
          `[HeroCarousel] Failed to preload primary image "${slide.imageUrl}" for slide "${slide.id}". Switching to verified fallback "${slide.fallbackImageUrl}".`
        );
        setResolvedUrls((prev) => ({
          ...prev,
          [slide.id]: slide.fallbackImageUrl,
        }));
      };
    });
  }, []);

  // Preload the upcoming slide's resolved image before transition
  useEffect(() => {
    const nextSlide = HERO_SLIDES[(activeIndex + 1) % slideCount];
    const nextSrc = resolvedUrls[nextSlide.id] || nextSlide.imageUrl;
    const img = new Image();
    img.src = nextSrc;
  }, [activeIndex, resolvedUrls, slideCount]);

  const handleImageLoad = useCallback((slide: HeroSlideData, src: string) => {
    setLoadedSlides((prev) => ({ ...prev, [slide.id]: true }));
    setFailedSlides((prev) => ({ ...prev, [slide.id]: false }));
    if (!slide.isFigmaCatalogueSlide) {
      setLastValidImage({
        src,
        objectPosition: slide.objectPosition,
      });
    }
  }, []);

  const handleImageError = useCallback(
    (slide: HeroSlideData) => {
      const currentSrc = resolvedUrls[slide.id] || slide.imageUrl;
      if (currentSrc !== slide.fallbackImageUrl) {
        console.error(
          `[HeroCarousel] Image load error for "${currentSrc}" on slide "${slide.id}". Switching to verified Brainbench fallback "${slide.fallbackImageUrl}".`
        );
        setResolvedUrls((prev) => ({
          ...prev,
          [slide.id]: slide.fallbackImageUrl,
        }));
      } else if (currentSrc !== lastValidImage.src) {
        console.error(
          `[HeroCarousel] Fallback image "${currentSrc}" also failed on slide "${slide.id}". Retaining last verified displayed image "${lastValidImage.src}".`
        );
        setResolvedUrls((prev) => ({
          ...prev,
          [slide.id]: lastValidImage.src,
        }));
        setFailedSlides((prev) => ({ ...prev, [slide.id]: true }));
      }
    },
    [resolvedUrls, lastValidImage.src]
  );

  const advanceNextIndex = useCallback(
    (prev: number) => {
      const currentFailed = failedSlidesRef.current;
      for (let offset = 1; offset <= slideCount; offset++) {
        const candidateIdx = (prev + offset) % slideCount;
        const candidateSlide = HERO_SLIDES[candidateIdx];
        if (!currentFailed[candidateSlide.id]) {
          return candidateIdx;
        }
      }
      return (prev + 1) % slideCount;
    },
    [slideCount]
  );

  const advancePrevIndex = useCallback(
    (prev: number) => {
      const currentFailed = failedSlidesRef.current;
      for (let offset = 1; offset <= slideCount; offset++) {
        const candidateIdx = (prev - offset + slideCount) % slideCount;
        const candidateSlide = HERO_SLIDES[candidateIdx];
        if (!currentFailed[candidateSlide.id]) {
          return candidateIdx;
        }
      }
      return (prev - 1 + slideCount) % slideCount;
    },
    [slideCount]
  );

  // Manual navigation helpers: update slide and reset the 3-second continuous timer
  const goToSlide = useCallback(
    (index: number) => {
      const normalized = ((index % slideCount) + slideCount) % slideCount;
      setActiveIndex(normalized);
      setTimerResetKey((prev) => prev + 1);
    },
    [slideCount]
  );

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => advanceNextIndex(prev));
    setTimerResetKey((prev) => prev + 1);
  }, [advanceNextIndex]);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => advancePrevIndex(prev));
    setTimerResetKey((prev) => prev + 1);
  }, [advancePrevIndex]);

  // Continuous, unstoppable 3-second infinite-loop autoplay timer
  // Does not pause on hover or focus; resets cleanly on manual navigation and continues cycling
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => advanceNextIndex(prev));
    }, AUTOPLAY_DURATION_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [advanceNextIndex, timerResetKey]);

  // Mobile Touch Gesture Support
  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    touchEndXRef.current = null;
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) {
      return;
    }
    const distance = touchStartXRef.current - touchEndXRef.current;
    const minSwipeThreshold = 45;

    if (distance > minSwipeThreshold) {
      goToNext();
    } else if (distance < -minSwipeThreshold) {
      goToPrev();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToNext();
    }
  };

  return (
    <section
      id="hero"
      aria-roledescription="carousel"
      aria-label="Brainbench Technology Featured Courses and Academic Programmes"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="hero-fullscreen-stage flex items-center bg-[#061539] select-none focus:outline-none"
    >
      {/* ===================================================================
          BASE VERIFIED FALLBACK LAYER (z-index: 0)
          Ensures the stage is never blank even for a millisecond
      =================================================================== */}
      <img
        src={lastValidImage.src}
        alt=""
        aria-hidden="true"
        loading="eager"
        decoding="async"
        style={{ objectPosition: lastValidImage.objectPosition }}
        className={`hero-slide-image transition-opacity duration-600 ease-in-out ${
          isFigmaSlideActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />

      {/* ===================================================================
          SYNCHRONISED SLIDE LAYERS (SLIDES 1–6)
          Each slide transitions its background, overlay, headline, description,
          and CTA buttons together in a smooth 600ms crossfade.
      =================================================================== */}
      {HERO_SLIDES.map((slide, idx) => {
        const isActive = idx === activeIndex;

        // SLIDE 1: FIGMA COURSE CATALOGUE HERO (node-id=2030-2)
        if (slide.isFigmaCatalogueSlide) {
          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${idx + 1} of ${slideCount}: Course Catalogue — 2026 Price List`}
              aria-hidden={!isActive}
              className={`absolute inset-0 w-full h-full transition-opacity duration-600 ease-in-out ${
                isActive
                  ? 'z-20 opacity-100 pointer-events-auto'
                  : 'z-10 opacity-0 pointer-events-none'
              }`}
            >
              <CourseCatalogueHero
                onOpenEnrol={onOpenEnrol}
                onOpenLightbox={onOpenLightbox}
                isCarouselSlide={true}
              />
            </div>
          );
        }

        // SLIDES 2–6: FULL-SCREEN PHOTOGRAPHIC SLIDES
        const slideSrc =
          resolvedUrls[slide.id] || slide.imageUrl || lastValidImage.src;
        const isLoaded = loadedSlides[slide.id] !== false;

        return (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${idx + 1} of ${slideCount}: ${slide.headline}`}
            aria-hidden={!isActive}
            data-active-image={slideSrc}
            className={`absolute inset-0 w-full h-full flex items-center transition-opacity duration-600 ease-in-out ${
              isActive
                ? 'z-20 opacity-100 pointer-events-auto'
                : 'z-10 opacity-0 pointer-events-none'
            }`}
          >
            {/* 1. Full-Bleed Background Photograph (16:9 landscape cover) */}
            <img
              src={slideSrc}
              alt={slide.imageAlt}
              loading="eager"
              decoding="async"
              fetchPriority={isActive ? 'high' : 'auto'}
              onLoad={() => handleImageLoad(slide, slideSrc)}
              onError={() => handleImageError(slide)}
              style={{
                objectPosition: slide.objectPosition,
              }}
              className={`hero-slide-image transition-opacity duration-600 ease-in-out ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* 2. Balanced Gradient Overlay for Readability */}
            <div
              aria-hidden="true"
              className="hero-slide-overlay"
              style={{
                background:
                  'linear-gradient(90deg, rgba(6, 21, 57, 0.84) 0%, rgba(6, 21, 57, 0.66) 38%, rgba(6, 21, 57, 0.30) 68%, rgba(6, 21, 57, 0.12) 100%), linear-gradient(180deg, rgba(6, 21, 57, 0.25) 0%, rgba(6, 21, 57, 0.05) 50%, rgba(6, 21, 57, 0.55) 100%)',
              }}
            />

            {/* 3. Synchronised Left-Aligned Slide Content & CTA Buttons */}
            <div className="hero-slide-content w-full pl-14 pr-14 sm:pl-20 sm:pr-20 md:pl-24 lg:pl-[10%] lg:pr-24 py-12 sm:py-16">
              <div className="w-full max-w-[580px] xl:max-w-[620px]">
                {/* Small Uppercase Programme Category Label Above Headline */}
                <div className="inline-flex items-center gap-2.5 mb-4">
                  <span
                    aria-hidden="true"
                    className="w-7 h-[2.5px] bg-[#f58d00] rounded-full shrink-0"
                  />
                  <span className="font-montserrat font-extrabold text-xs sm:text-[13px] tracking-[0.2em] uppercase text-[#fdc12e] drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]">
                    {slide.category}
                  </span>
                </div>

                {/* Large Bold Headline */}
                <h1 className="font-montserrat font-black text-white text-[34px] sm:text-[46px] md:text-[54px] lg:text-[60px] xl:text-[64px] leading-[1.08] tracking-[-0.025em] drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)]">
                  {slide.headline}
                </h1>

                {/* Supporting Description Beneath Headline */}
                <p className="font-montserrat font-normal text-white/95 text-[15px] sm:text-[17px] lg:text-[18px] leading-[1.65] mt-5 max-w-[540px] drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)]">
                  {slide.description}
                </p>

                {/* Two CTA Buttons Styled Using Brainbench's Button Design & Brand Colours */}
                <div className="mt-8 sm:mt-9 flex flex-wrap items-center gap-3.5 sm:gap-4">
                  <Link
                    to={slide.primaryCtaRoute}
                    className="px-6 sm:px-7 py-3.5 sm:py-4 bg-[#f58d00] hover:bg-[#e07f00] text-[#061539] font-montserrat font-extrabold text-sm sm:text-[15px] rounded-[10px] shadow-[0_10px_24px_rgba(245,141,0,0.28)] inline-flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span>{slide.primaryCtaLabel}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.4]" />
                  </Link>

                  <Link
                    to={slide.secondaryCtaRoute}
                    className="px-6 sm:px-7 py-3.5 sm:py-4 bg-[#0a309e]/85 hover:bg-[#0a309e] text-white border-[1.75px] border-white/80 hover:border-white font-montserrat font-bold text-sm sm:text-[15px] rounded-[10px] backdrop-blur-xs inline-flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span>{slide.secondaryCtaLabel}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* ===================================================================
          4. SIDE CIRCULAR ARROW CONTROLS (Vertically Centred Near Left/Right)
      =================================================================== */}
      <button
        type="button"
        onClick={goToPrev}
        aria-label="Previous slide"
        className="absolute left-2.5 sm:left-5 lg:left-7 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#061539]/75 hover:bg-[#f58d00] text-white hover:text-[#061539] border border-white/35 hover:border-[#f58d00] backdrop-blur-xs shadow-lg flex items-center justify-center transition-all cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.3]" />
      </button>

      <button
        type="button"
        onClick={goToNext}
        aria-label="Next slide"
        className="absolute right-2.5 sm:right-5 lg:right-7 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#061539]/75 hover:bg-[#f58d00] text-white hover:text-[#061539] border border-white/35 hover:border-[#f58d00] backdrop-blur-xs shadow-lg flex items-center justify-center transition-all cursor-pointer"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.3]" />
      </button>

      {/* ===================================================================
          5. BOTTOM SLIDE INDICATORS / PAGINATION DOTS & SYNCHRONISED PROGRESS
      =================================================================== */}
      <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-30 flex flex-col items-center justify-center gap-3 px-6">
        <div
          role="tablist"
          aria-label="Hero slide indicators"
          className="flex items-center gap-2.5 bg-[#061539]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/25 shadow-md"
        >
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${index + 1}: ${slide.headline}`}
                onClick={() => goToSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'w-9 bg-[#f58d00]'
                    : 'w-2.5 bg-white/45 hover:bg-white/85'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Synchronised 3-Second Bottom Progress Bar */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-1 bg-[#061539]/25 z-30 overflow-hidden"
      >
        <div
          key={`${activeSlide.id}-${timerResetKey}`}
          className="h-full w-full bg-[#f58d00] origin-left animate-[heroProgress_3000ms_linear]"
        />
      </div>
    </section>
  );
};

