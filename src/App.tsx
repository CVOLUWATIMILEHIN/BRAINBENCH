/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
} from './data/brochureData';
import {
  SPARK_IT_EVENT_DATA,
  THE_EDGE_EVENT_DATA,
  UPCOMING_SPARK_IT_NOVEMBER_2026,
} from './data/eventsData';
import {
  CourseWebsiteCard,
  DiagonalStripes,
  FourColorBar,
  ResilientImage,
} from './components/WebsiteSections';
import { HeroCarousel } from './components/HeroCarousel';
import {
  CourseDetailModal,
  EnrolModal,
  LightboxModal,
} from './components/Modals';
import {
  EventsOverviewPage,
  SparkItEventPage,
  TheEdgeEventPage,
} from './pages/EventsPages';
import {
  AboutPage,
  ContactPage,
  CoursesPage,
  ProgrammesPage,
  SolutionsPage,
} from './pages/SitePages';
import { AdminDemoRequestsPage } from './pages/AdminDemoRequestsPage';
import { Link, useRouter } from './router';
import { sanitizeDomId, sanitizeSearchQuery } from './utils/security';
import {
  ArrowRight,
  Calculator,
  Calendar,
  ChevronDown,
  ExternalLink,
  Maximize2,
  Menu,
  QrCode,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react';

export default function App() {
  const { location, navigate } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] =
    useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [sortBy, setSortBy] = useState<
    'alphabetical' | 'all-az' | 'price-asc' | 'price-desc'
  >('alphabetical');
  const [galleryTab, setGalleryTab] = useState<
    'all' | 'engineering' | 'design' | 'campus'
  >('all');

  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([
    'web-development-full-stack',
  ]);
  const [inspectedCourse, setInspectedCourse] = useState<CourseItem | null>(
    null
  );
  const [lightboxData, setLightboxData] = useState<{
    imageUrl: string;
    caption: string;
    label: string;
  } | null>(null);
  const [isEnrolModalOpen, setIsEnrolModalOpen] = useState<boolean>(false);

  // Close mobile menu and dropdown when route changes
  React.useEffect(() => {
    setMobileMenuOpen(false);
    setEventsDropdownOpen(false);
  }, [location.pathname, location.search]);

  const handleToggleCourse = (course: CourseItem) => {
    setSelectedCourseIds((prev) =>
      prev.includes(course.id)
        ? prev.filter((id) => id !== course.id)
        : [...prev, course.id]
    );
  };

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const safeId = sanitizeDomId(sectionId);
    if (!safeId) return;
    if (location.pathname !== '/') {
      navigate(`/#${safeId}`);
      return;
    }
    if (safeId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(safeId);
    if (el) {
      const headerOffset = 76;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: Math.max(0, elementPosition - headerOffset),
        behavior: 'smooth',
      });
    }
  };

  const handleSelectCategoryNav = (categoryName: string, catId: string) => {
    if (location.pathname === '/') {
      setActiveCategoryFilter('all');
      setSearchQuery('');
      setSelectedDuration('all');
      scrollToSection(`cat-${catId}`);
    } else {
      navigate(`/courses?category=${encodeURIComponent(categoryName)}`);
    }
  };

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

  const allGalleryPhotos = useMemo(() => {
    const items18 = GALLERY_PAGE_18.rows.flatMap((r) =>
      r.items.map((item) => ({
        ...item,
        flipX: false,
        objectPosition:
          'objectPosition' in item && typeof item.objectPosition === 'string'
            ? item.objectPosition
            : '50% 20%',
        group:
          item.id === 'p1' ||
          item.id === 'p2' ||
          item.id === 'p3' ||
          item.id === 'p11'
            ? ('engineering' as const)
            : item.id === 'p4' || item.id === 'p6' || item.id === 'p12'
            ? ('design' as const)
            : ('campus' as const),
      }))
    );
    const items19 = GALLERY_PAGE_19.rows.flatMap((r) =>
      r.items.map((item) => ({
        ...item,
        flipX: 'flipX' in item ? Boolean(item.flipX) : false,
        objectPosition:
          'objectPosition' in item && typeof item.objectPosition === 'string'
            ? item.objectPosition
            : '50% 20%',
        group:
          item.id === 'p14' ||
          item.id === 'p15' ||
          item.id === 'p16' ||
          item.id === 'p19' ||
          item.id === 'p22'
            ? ('engineering' as const)
            : item.id === 'p13' || item.id === 'p20'
            ? ('design' as const)
            : ('campus' as const),
      }))
    );
    return [...items18, ...items19];
  }, []);

  const visibleGalleryPhotos = useMemo(() => {
    if (galleryTab === 'all') return allGalleryPhotos;
    return allGalleryPhotos.filter((p) => p.group === galleryTab);
  }, [allGalleryPhotos, galleryTab]);

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

  const coreCategories = CATEGORY_INDEX.filter(
    (c) =>
      c.id !== 'professional-courses' && c.id !== 'advanced-technology-courses'
  );
  const advancedCategories = CATEGORY_INDEX.filter(
    (c) =>
      c.id === 'professional-courses' || c.id === 'advanced-technology-courses'
  );

  const initialCategoryFromQuery = useMemo(() => {
    if (!location.search) return 'all';
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat && CATEGORY_INDEX.some((c) => c.name === cat)) {
      return cat;
    }
    return 'all';
  }, [location.search]);

  const currentPath = location.pathname;
  const isEventsActive =
    currentPath === '/events' || currentPath.startsWith('/events/');

  return (
    <div className="app-shell w-full min-h-screen flex flex-col bg-white text-[#121212]">
      {/* =====================================================================
          1. PERSISTENT TOP WEBSITE HEADER (Consistent Across All Pages)
      ===================================================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full h-[var(--header-height)] bg-[#fdf6e7]/95 backdrop-blur-md border-b border-[#eadfc9]">
        <div className="w-full h-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 flex items-center justify-between gap-8">
          {/* Zone 1: Existing Brainbench Technology Logo -> Links to / */}
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0 focus:outline-none"
            aria-label="Brainbench Technology Home"
          >
            <ResilientImage
              src={COVER_DATA.logoUrl}
              alt="Brainbench Technology Logo"
              objectPosition="0% 50%"
              className="h-10 sm:h-12 w-auto max-w-[190px] sm:max-w-[220px] object-contain"
            />
          </Link>

          {/* Zone 2: Clean Multi-Page Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-7 xl:gap-8 text-[15px] font-montserrat font-semibold text-[#0b132b]"
          >
            <Link
              to="/"
              className={`hover:text-[#0a309e] transition-colors whitespace-nowrap shrink-0 ${
                currentPath === '/' ? 'text-[#0a309e] font-bold' : ''
              }`}
            >
              Home
            </Link>

            <Link
              to="/courses"
              className={`inline-flex items-center gap-1 hover:text-[#0a309e] transition-colors whitespace-nowrap shrink-0 ${
                currentPath === '/courses' ? 'text-[#0a309e] font-bold' : ''
              }`}
            >
              <span>Courses</span>
            </Link>

            <Link
              to="/solutions"
              className={`inline-flex items-center gap-1 hover:text-[#0a309e] transition-colors whitespace-nowrap shrink-0 ${
                currentPath === '/solutions' || currentPath === '/programmes'
                  ? 'text-[#0a309e] font-bold'
                  : ''
              }`}
            >
              <span>Solutions</span>
            </Link>

            {/* Events Link + Submenu Dropdown for The Edge & Spark IT */}
            <div
              className="relative"
              onMouseEnter={() => setEventsDropdownOpen(true)}
              onMouseLeave={() => setEventsDropdownOpen(false)}
            >
              <Link
                to="/events"
                className={`inline-flex items-center gap-1.5 py-2 hover:text-[#0a309e] transition-colors whitespace-nowrap shrink-0 ${
                  isEventsActive ? 'text-[#0a309e] font-bold' : ''
                }`}
              >
                <span>Events</span>
                <ChevronDown className="w-4 h-4 stroke-[2.2]" />
              </Link>

              {eventsDropdownOpen && (
                <div className="absolute left-0 top-full pt-1 w-72 z-50">
                  <div className="bg-white rounded-xl border border-[#eadfc9] shadow-xl p-2 space-y-1">
                    <Link
                      to="/events"
                      className="block px-3.5 py-2.5 rounded-lg hover:bg-[#fdf6e7] transition-colors"
                    >
                      <div className="font-montserrat font-extrabold text-xs text-[#0b132b]">
                        All Events Overview
                      </div>
                      <div className="font-merriweather text-[11px] text-[#454545] mt-0.5">
                        View all Brainbench Technology events
                      </div>
                    </Link>

                    <Link
                      to="/events/the-edge"
                      className="block px-3.5 py-2.5 rounded-lg hover:bg-[#fdf6e7] transition-colors"
                    >
                      <div className="font-montserrat font-extrabold text-xs text-[#1c3f9c]">
                        The Edge: Beyond the Classroom
                      </div>
                      <div className="font-merriweather text-[11px] text-[#454545] mt-0.5">
                        Every two weeks · Guest-speaker sessions
                      </div>
                    </Link>

                    <Link
                      to="/events/brainbench-spark-it"
                      className="block px-3.5 py-2.5 rounded-lg hover:bg-[#fdf6e7] transition-colors"
                    >
                      <div className="font-montserrat font-extrabold text-xs text-[#f58220]">
                        Brainbench Spark It
                      </div>
                      <div className="font-merriweather text-[11px] text-[#454545] mt-0.5">
                        Once every quarter · Student &amp; graduate showcase
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/about"
              className={`hover:text-[#0a309e] transition-colors whitespace-nowrap shrink-0 ${
                currentPath === '/about' ? 'text-[#0a309e] font-bold' : ''
              }`}
            >
              About
            </Link>

            <Link
              to="/contact"
              className={`hover:text-[#0a309e] transition-colors whitespace-nowrap shrink-0 ${
                currentPath === '/contact' ? 'text-[#0a309e] font-bold' : ''
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Zone 3: Pill-Shaped Enrol Now Button + Mobile Menu Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsEnrolModalOpen(true)}
              className="px-6 py-2.5 text-xs sm:text-sm font-montserrat font-bold text-white bg-[#092279] hover:bg-[#0d2d9e] rounded-full shadow-xs inline-flex items-center gap-2.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Enrol Now</span>
              <ArrowRight className="w-4 h-4 stroke-[2.2]" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="lg:hidden p-2 text-[#0b132b] hover:bg-[#f3ead6] rounded-lg cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#fdf6e7] border-b border-[#eadfc9] px-6 py-5 space-y-3 shadow-lg">
            <div className="flex flex-col space-y-2.5 text-sm font-montserrat font-semibold text-[#0b132b]">
              <Link to="/" className="py-1.5 hover:text-[#0a309e]">
                Home
              </Link>
              <Link to="/courses" className="py-1.5 hover:text-[#0a309e]">
                Courses
              </Link>
              <Link to="/solutions" className="py-1.5 hover:text-[#0a309e]">
                Solutions
              </Link>
              <Link to="/events" className="py-1.5 hover:text-[#0a309e]">
                Events
              </Link>
              <div className="pl-4 border-l-2 border-[#f58220] space-y-2 py-1">
                <Link
                  to="/events/the-edge"
                  className="block text-xs font-bold text-[#1c3f9c] hover:underline"
                >
                  The Edge: Beyond the Classroom
                </Link>
                <Link
                  to="/events/brainbench-spark-it"
                  className="block text-xs font-bold text-[#1c3f9c] hover:underline"
                >
                  Brainbench Spark It
                </Link>
              </div>
              <Link to="/about" className="py-1.5 hover:text-[#0a309e]">
                About
              </Link>
              <Link to="/contact" className="py-1.5 hover:text-[#0a309e]">
                Contact
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 w-full pt-[var(--header-height)]">
        {/* ===================================================================
            MULTI-PAGE ROUTE SWITCH
        =================================================================== */}
        {currentPath === '/about' ? (
          <AboutPage
            onOpenEnrol={() => setIsEnrolModalOpen(true)}
            onOpenLightbox={(imageUrl, caption, label) =>
              setLightboxData({ imageUrl, caption, label })
            }
          />
        ) : currentPath === '/courses' ? (
          <CoursesPage
            initialCategory={initialCategoryFromQuery}
            selectedCourseIds={selectedCourseIds}
            onToggleCourse={handleToggleCourse}
            onInspectCourse={setInspectedCourse}
            onOpenLightbox={(imageUrl, caption, label) =>
              setLightboxData({ imageUrl, caption, label })
            }
            onOpenEnrol={() => setIsEnrolModalOpen(true)}
            onClearSelectedCourses={() => setSelectedCourseIds([])}
          />
        ) : currentPath === '/solutions' || currentPath === '/programmes' ? (
          <SolutionsPage onOpenEnrol={() => setIsEnrolModalOpen(true)} />
        ) : currentPath === '/events' ? (
          <EventsOverviewPage
            onOpenEnrol={() => setIsEnrolModalOpen(true)}
            onOpenLightbox={(imageUrl, caption, label) =>
              setLightboxData({ imageUrl, caption, label })
            }
          />
        ) : currentPath === '/events/the-edge' ? (
          <TheEdgeEventPage
            onOpenEnrol={() => setIsEnrolModalOpen(true)}
            onOpenLightbox={(imageUrl, caption, label) =>
              setLightboxData({ imageUrl, caption, label })
            }
          />
        ) : currentPath === '/events/brainbench-spark-it' ? (
          <SparkItEventPage
            onOpenEnrol={() => setIsEnrolModalOpen(true)}
            onOpenLightbox={(imageUrl, caption, label) =>
              setLightboxData({ imageUrl, caption, label })
            }
          />
        ) : currentPath === '/contact' ? (
          <ContactPage onOpenEnrol={() => setIsEnrolModalOpen(true)} />
        ) : currentPath === '/admin/demo-requests' ||
          currentPath === '/admin' ? (
          <AdminDemoRequestsPage />
        ) : (
          /* =================================================================
              HOME PAGE (/) — Preserves Full Landing Page + Multi-Page Links
          ================================================================= */
          <>
            {/* 2. FULL-SCREEN MULTI-SLIDE HERO CAROUSEL */}
            <HeroCarousel
              onScrollToSection={scrollToSection}
              onOpenEnrol={() => setIsEnrolModalOpen(true)}
              onInspectCourse={setInspectedCourse}
              onOpenLightbox={(imageUrl, caption, label) =>
                setLightboxData({ imageUrl, caption, label })
              }
            />

            {/* 3. COURSE STATISTICS & VALUE PROPOSITION SECTION */}
            <section
              id="stats"
              className="w-full bg-white border-b border-[#e3e5f0] py-16 lg:py-24"
            >
              <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
                {/* 3 Architectural Stat Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
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

                {/* Value Proposition Split with Cover Feature Photo */}
                <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  <div className="lg:col-span-5 space-y-5">
                    <div className="text-xs font-montserrat font-extrabold uppercase tracking-widest text-[#1c3f9c]">
                      Practical Technology Education
                    </div>
                    <h2
                      className="font-montserrat font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#121212] leading-tight"
                      style={{ textWrap: 'balance' }}
                    >
                      Built for real-world results and career-ready
                      specialisation.
                    </h2>
                    <p className="font-merriweather text-base text-[#454545] leading-relaxed">
                      {COVER_DATA.introText}
                    </p>
                    <div className="pt-2 flex flex-wrap items-center gap-4">
                      <Link
                        to="/courses"
                        className="px-5 py-3 bg-[#1c3f9c] hover:bg-[#174da8] text-white font-montserrat font-bold text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        Explore All 39 Courses
                      </Link>
                      <button
                        type="button"
                        onClick={() => scrollToSection('enrol')}
                        className="px-5 py-3 bg-[#f4f5f8] hover:bg-[#e3e5f0] text-[#121212] font-montserrat font-bold text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        Calculate Tuition ({selectedCourseIds.length} Selected)
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-7">
                    <div
                      onClick={() =>
                        setLightboxData({
                          imageUrl: COVER_DATA.coverPhotoUrl,
                          caption: COVER_DATA.introText,
                          label: 'Brainbench Technology Practical Lab',
                        })
                      }
                      className="group relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-xl border-2 border-[#1c3f9c] bg-[#e8f0fc] overflow-hidden cursor-pointer shadow-sm"
                    >
                      <ResilientImage
                        src={COVER_DATA.coverPhotoUrl}
                        alt="Brainbench Technology classroom training session"
                        objectPosition="50% 22%"
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-end justify-between p-5">
                        <span className="text-white font-montserrat font-semibold text-sm">
                          Hands-On Software &amp; Technical Lab Session
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

            {/* 4. ABOUT BRAINBENCH TECHNOLOGY SECTION */}
            <section
              id="about"
              className="w-full bg-[#F8F9FC] border-b border-[#e3e5f0] py-20 lg:py-28"
            >
              <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
                  {/* Left Column: About Heading + Who We Are Royal Blue Block */}
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

                      {/* Who We Are Box */}
                      <div className="mt-8 bg-[#1c3f9c] rounded-xl p-8 sm:p-10 shadow-sm">
                        <h3 className="font-montserrat font-bold text-lg text-[#fdc12e]">
                          {ABOUT_DATA.whoWeAreTitle}
                        </h3>
                        <p className="font-merriweather font-normal text-base leading-relaxed text-white mt-4">
                          {ABOUT_DATA.whoWeAreBody}
                        </p>
                        <div className="mt-6">
                          <Link
                            to="/about"
                            className="inline-flex items-center gap-2 text-xs sm:text-sm font-montserrat font-extrabold text-[#fdc12e] hover:underline"
                          >
                            <span>Read More About Brainbench Technology</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Key Institutional Pillars */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl border border-[#e3e5f0] p-5">
                        <div className="font-montserrat font-extrabold text-sm text-[#1c3f9c]">
                          Industry Practitioners
                        </div>
                        <p className="font-merriweather text-xs text-[#454545] mt-1.5 leading-relaxed">
                          Every programme is taught through practical projects,
                          real-world workflows, and guided lab sessions.
                        </p>
                      </div>
                      <div className="bg-white rounded-xl border border-[#e3e5f0] p-5">
                        <div className="font-montserrat font-extrabold text-sm text-[#1c3f9c]">
                          Foundational to Advanced
                        </div>
                        <p className="font-merriweather text-xs text-[#454545] mt-1.5 leading-relaxed">
                          Structured tracks spanning Web Development, Design,
                          Data, Professional Management, and AI.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: About Cohort Photograph */}
                  <div className="lg:col-span-6 flex">
                    <div
                      onClick={() =>
                        setLightboxData({
                          imageUrl: ABOUT_DATA.aboutPhotoUrl,
                          caption: ABOUT_DATA.whoWeAreBody,
                          label: ABOUT_DATA.heading,
                        })
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

            {/* 4B. FEATURED EVENTS & ACADEMIC PROGRAMMES SECTION */}
            <section
              id="events-showcase"
              className="w-full bg-white border-b border-[#e3e5f0] py-20 lg:py-24"
            >
              <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                  <div>
                    <div
                      className="inline-flex items-center px-6 py-2.5 rounded-lg mb-4"
                      style={{
                        background:
                          'linear-gradient(90deg, #f58220 0%, #fdc12e 100%)',
                      }}
                    >
                      <span className="font-montserrat font-extrabold text-sm sm:text-base text-[#121212] uppercase tracking-wider">
                        Events &amp; Flagship Programmes
                      </span>
                    </div>
                    <h2 className="font-montserrat font-extrabold text-3xl sm:text-4xl text-[#121212]">
                      The Edge: Beyond the Classroom &amp; Brainbench Spark It
                    </h2>
                  </div>

                  <Link
                    to="/events"
                    className="px-5 py-3 bg-[#1c3f9c] hover:bg-[#174da8] text-white font-montserrat font-bold text-xs rounded-lg inline-flex items-center gap-2 transition-colors self-start md:self-end"
                  >
                    <span>Explore Our Events</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* UPCOMING EVENT SPOTLIGHT: Brainbench Spark It — November Edition */}
                <div className="mb-12 rounded-2xl border-2 border-[#1c3f9c] bg-gradient-to-br from-[#F8F9FC] via-white to-[#eef3fc] overflow-hidden shadow-sm">
                  <div className="h-2 w-full bg-gradient-to-r from-[#1c3f9c] via-[#d91f26] to-[#1c3f9c]" />
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 p-6 sm:p-8 lg:p-10 items-center">
                    {/* Left: Official Flyer (Original Aspect Ratio, Complete Design Visible) */}
                    <div className="lg:col-span-5 flex justify-center">
                      <div
                        onClick={() =>
                          setLightboxData({
                            imageUrl:
                              UPCOMING_SPARK_IT_NOVEMBER_2026.flyerImageUrl,
                            caption: `${UPCOMING_SPARK_IT_NOVEMBER_2026.title} (${UPCOMING_SPARK_IT_NOVEMBER_2026.date}) — ${UPCOMING_SPARK_IT_NOVEMBER_2026.description}`,
                            label: UPCOMING_SPARK_IT_NOVEMBER_2026.title,
                          })
                        }
                        className="group relative w-full max-w-[380px] sm:max-w-[420px] rounded-xl border border-[#d5d9eb] bg-white p-2 shadow-sm cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
                      >
                        <ResilientImage
                          src={UPCOMING_SPARK_IT_NOVEMBER_2026.flyerImageUrl}
                          alt={`${UPCOMING_SPARK_IT_NOVEMBER_2026.title} Official Flyer`}
                          className="w-full h-auto object-contain rounded-lg block"
                        />
                        <div className="mt-2 flex items-center justify-between px-2 py-1 text-[11px] font-montserrat font-bold text-[#1c3f9c]">
                          <span>Official Event Flyer · {UPCOMING_SPARK_IT_NOVEMBER_2026.date}</span>
                          <span className="inline-flex items-center gap-1 text-[#d91f26]">
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>Enlarge</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Upcoming Event Details */}
                    <div className="lg:col-span-7 space-y-5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#d91f26] text-white font-montserrat font-extrabold text-xs uppercase tracking-wider">
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          <span>Status: {UPCOMING_SPARK_IT_NOVEMBER_2026.status}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#1c3f9c] text-white font-montserrat font-extrabold text-xs uppercase tracking-wider">
                          <Calendar className="w-3.5 h-3.5 text-[#fdc12e]" />
                          <span>{UPCOMING_SPARK_IT_NOVEMBER_2026.date}</span>
                        </span>
                        <span className="inline-flex items-center px-3 py-1.5 rounded-md bg-[#e8f0fc] text-[#1c3f9c] font-montserrat font-bold text-xs uppercase tracking-wider">
                          Upcoming Events
                        </span>
                      </div>

                      <div>
                        <h3 className="font-montserrat font-black text-2xl sm:text-3xl lg:text-4xl text-[#061539] leading-tight">
                          {UPCOMING_SPARK_IT_NOVEMBER_2026.title}
                        </h3>
                        <p className="font-montserrat font-extrabold text-base sm:text-lg text-[#d91f26] mt-2">
                          {UPCOMING_SPARK_IT_NOVEMBER_2026.tagline}
                        </p>
                      </div>

                      <p className="font-merriweather text-sm sm:text-base text-[#121212] leading-relaxed max-w-2xl">
                        {UPCOMING_SPARK_IT_NOVEMBER_2026.description}
                      </p>

                      <div className="pt-2 flex flex-wrap items-center gap-3.5">
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Event Card 1: The Edge */}
                  <div className="rounded-xl border-2 border-[#1c3f9c] bg-[#F8F9FC] overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="relative aspect-[16/9] bg-[#061539] overflow-hidden">
                        <ResilientImage
                          src={THE_EDGE_EVENT_DATA.heroImageUrl}
                          alt={THE_EDGE_EVENT_DATA.title}
                          objectPosition={
                            THE_EDGE_EVENT_DATA.heroObjectPosition
                          }
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3.5 py-1.5 rounded bg-[#f58220] text-[#121212] font-montserrat font-extrabold text-xs uppercase">
                            {THE_EDGE_EVENT_DATA.frequencyBadge}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 sm:p-8">
                        <div className="flex items-center gap-2 text-xs font-montserrat font-bold text-[#1c3f9c] mb-2">
                          <Calendar className="w-4 h-4 text-[#f58220]" />
                          <span>{THE_EDGE_EVENT_DATA.frequencyBadge}</span>
                        </div>
                        <h3 className="font-montserrat font-extrabold text-2xl text-[#121212]">
                          {THE_EDGE_EVENT_DATA.title}
                        </h3>
                        <p className="font-merriweather text-sm text-[#454545] leading-relaxed mt-3">
                          {THE_EDGE_EVENT_DATA.shortSummary}
                        </p>
                      </div>
                    </div>
                    <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                      <Link
                        to="/events/the-edge"
                        className="px-5 py-3 bg-[#1c3f9c] hover:bg-[#174da8] text-white font-montserrat font-extrabold text-xs sm:text-sm rounded-lg inline-flex items-center gap-2 transition-colors"
                      >
                        <span>Explore The Edge</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Event Card 2: Brainbench Spark It */}
                  <div className="rounded-xl border-2 border-[#f58220] bg-[#F8F9FC] overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="relative aspect-[16/9] bg-[#061539] overflow-hidden">
                        <ResilientImage
                          src={SPARK_IT_EVENT_DATA.heroImageUrl}
                          alt={SPARK_IT_EVENT_DATA.title}
                          objectPosition={
                            SPARK_IT_EVENT_DATA.heroObjectPosition
                          }
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3.5 py-1.5 rounded bg-[#1c3f9c] text-white font-montserrat font-extrabold text-xs uppercase">
                            {SPARK_IT_EVENT_DATA.frequencyBadge}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 sm:p-8">
                        <div className="flex items-center gap-2 text-xs font-montserrat font-bold text-[#1c3f9c] mb-2">
                          <Calendar className="w-4 h-4 text-[#f58220]" />
                          <span>{SPARK_IT_EVENT_DATA.frequencyBadge}</span>
                        </div>
                        <h3 className="font-montserrat font-extrabold text-2xl text-[#121212]">
                          {SPARK_IT_EVENT_DATA.title}
                        </h3>
                        <p className="font-merriweather text-sm text-[#454545] leading-relaxed mt-3">
                          {SPARK_IT_EVENT_DATA.shortSummary}
                        </p>
                      </div>
                    </div>
                    <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                      <Link
                        to="/events/brainbench-spark-it"
                        className="px-5 py-3 bg-[#f58220] hover:bg-[#e07f00] text-[#121212] font-montserrat font-extrabold text-xs sm:text-sm rounded-lg inline-flex items-center gap-2 transition-colors"
                      >
                        <span>Discover Brainbench Spark It</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. INTERACTIVE COURSE CATEGORY NAVIGATION & SEARCH BAR */}
            <section
              id="categories"
              className="w-full bg-white border-b border-[#e3e5f0] py-20 lg:py-24"
            >
              <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                  <div>
                    <div className="inline-flex items-center bg-[#121212] text-white px-6 py-2.5 rounded-lg mb-4">
                      <span className="font-montserrat font-extrabold text-base leading-none">
                        What&apos;s inside
                      </span>
                    </div>
                    <h2 className="font-montserrat font-extrabold text-3xl sm:text-4xl text-[#121212]">
                      Explore {CATEGORY_INDEX.length} Skill Categories &amp;{' '}
                      {ALL_COURSES.length} Programmes
                    </h2>
                  </div>
                  <p className="font-merriweather text-sm text-[#454545] max-w-[48ch]">
                    Select any category below to jump straight to its curriculum
                    section, or use the interactive search and filter bar to
                    compare courses across the entire 2026 catalogue.
                  </p>
                </div>

                {/* Interactive Category Index Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                  {CATEGORY_INDEX.map((cat) => {
                    const isCatActive = activeCategoryFilter === cat.name;
                    return (
                      <div
                        key={cat.id}
                        className={`rounded-xl border transition-all flex flex-col justify-between p-5 bg-white ${
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

                        <div className="mt-6 pt-3 border-t border-[#e3e5f0] flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleSelectCategoryNav(cat.name, cat.id)
                            }
                            className="text-xs font-montserrat font-bold text-[#121212] hover:text-[#1c3f9c] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                          >
                            <span>Jump to Section</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setActiveCategoryFilter(
                                isCatActive ? 'all' : cat.name
                              )
                            }
                            className="text-[11px] font-montserrat font-semibold text-[#454545] hover:text-[#1c3f9c] underline underline-offset-2 cursor-pointer whitespace-nowrap"
                          >
                            {isCatActive ? 'Show All' : 'Filter'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Interactive Search, Duration & Tuition Filter Bar */}
                <div className="bg-[#F8F9FC] rounded-xl border border-[#e3e5f0] p-6">
                  <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-[#454545] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        maxLength={100}
                        value={searchQuery}
                        onChange={(e) =>
                          setSearchQuery(
                            sanitizeSearchQuery(e.target.value, 100)
                          )
                        }
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
                          onChange={(e) =>
                            setActiveCategoryFilter(e.target.value)
                          }
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
                                filteredCourses.length === 1
                                  ? 'course'
                                  : 'courses'
                              } · A–Z)`
                            : `Filtered Catalogue Results (${filteredCourses.length} ${
                                filteredCourses.length === 1
                                  ? 'course'
                                  : 'courses'
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
                              onToggleCourse={handleToggleCourse}
                              onInspectCourse={setInspectedCourse}
                              onOpenLightbox={(imageUrl, caption, label) =>
                                setLightboxData({ imageUrl, caption, label })
                              }
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 6. CORE COURSE LISTINGS */}
            <div id="courses">
              {coreCategories.map((cat, catIdx) => {
                const courses = coursesByCategory[cat.name] || [];

                return (
                  <section
                    key={cat.id}
                    id={`cat-${cat.id}`}
                    className={`w-full py-20 lg:py-24 border-b border-[#e3e5f0] ${
                      catIdx % 2 === 1 ? 'bg-[#F8F9FC]' : 'bg-white'
                    }`}
                  >
                    <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
                      {/* Category Section Header */}
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

                      {/* Category Courses (2-Column Responsive Website Grid, Sorted A–Z) */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {courses.map((course) => (
                          <CourseWebsiteCard
                            key={course.id}
                            course={course}
                            isSelected={selectedCourseIds.includes(course.id)}
                            isFeaturedSplit={false}
                            onToggleCourse={handleToggleCourse}
                            onInspectCourse={setInspectedCourse}
                            onOpenLightbox={(imageUrl, caption, label) =>
                              setLightboxData({ imageUrl, caption, label })
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>

            {/* 7. PROFESSIONAL DEVELOPMENT & ADVANCED TECHNOLOGY PROGRAMMES */}
            <section
              id="advanced-programmes"
              className="w-full bg-[#F4F6FB] border-b border-[#e3e5f0] py-20 lg:py-28"
            >
              <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
                {/* Section Banner */}
                <div className="bg-[#1c3f9c] text-white rounded-xl p-8 sm:p-12 mb-16 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="max-w-2xl">
                    <div className="text-xs font-montserrat font-extrabold uppercase tracking-widest text-[#fdc12e]">
                      Executive, Leadership &amp; Emerging Tech Specialisations
                    </div>
                    <h2 className="font-montserrat font-extrabold text-3xl sm:text-4xl mt-2 leading-tight">
                      Professional Development &amp; Advanced Technology
                      Programmes
                    </h2>
                    <p className="font-merriweather text-sm sm:text-base text-white/90 mt-3 leading-relaxed">
                      Advance your career with management, business
                      intelligence, cloud engineering, machine learning, DevOps,
                      and generative AI programmes designed for modern
                      organisations.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        scrollToSection('cat-professional-courses')
                      }
                      className="px-5 py-3 bg-white text-[#121212] hover:bg-[#fdc12e] font-montserrat font-extrabold text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Professional Courses (6)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        scrollToSection('cat-advanced-technology-courses')
                      }
                      className="px-5 py-3 bg-[#f7941d] text-[#121212] hover:bg-[#fdc12e] font-montserrat font-extrabold text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Advanced Technology (11)
                    </button>
                  </div>
                </div>

                {/* Render Professional Courses & Advanced Technology Courses */}
                <div className="space-y-20">
                  {advancedCategories.map((cat) => {
                    const courses = coursesByCategory[cat.name] || [];

                    return (
                      <div key={cat.id} id={`cat-${cat.id}`}>
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-[#d5d9eb]">
                          <div>
                            <div
                              className="inline-flex items-center px-7 py-3 rounded-lg"
                              style={{
                                background:
                                  'linear-gradient(90deg, #f58220 0%, #fdc12e 100%)',
                              }}
                            >
                              <h3 className="font-montserrat font-extrabold text-2xl sm:text-3xl text-[#121212] leading-none">
                                {cat.name}
                              </h3>
                            </div>
                          </div>

                          <div className="font-montserrat text-xs sm:text-sm font-semibold text-[#454545] tabular-nums">
                            {cat.courseCount} Programmes · Alphabetical Order
                            (A–Z)
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {courses.map((course) => (
                            <CourseWebsiteCard
                              key={course.id}
                              course={course}
                              isSelected={selectedCourseIds.includes(course.id)}
                              isFeaturedSplit={false}
                              onToggleCourse={handleToggleCourse}
                              onInspectCourse={setInspectedCourse}
                              onOpenLightbox={(imageUrl, caption, label) =>
                                setLightboxData({ imageUrl, caption, label })
                              }
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 8. STUDENT & TRAINING GALLERY SECTION */}
            <section
              id="gallery"
              className="w-full bg-white border-b border-[#e3e5f0] py-20 lg:py-28"
            >
              <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
                  <div>
                    <div
                      className="inline-flex items-center px-7 py-3 rounded-lg mb-4"
                      style={{
                        background:
                          'linear-gradient(90deg, #f58220 0%, #fdc12e 100%)',
                      }}
                    >
                      <h2 className="font-montserrat font-extrabold text-2xl sm:text-3xl text-[#121212] leading-none">
                        {GALLERY_PAGE_18.heading}
                      </h2>
                    </div>
                    <p className="font-merriweather text-sm sm:text-base text-[#454545] max-w-[60ch]">
                      Explore moments from Brainbench Technology&apos;s
                      practical training sessions, software engineering cohorts,
                      design critiques, and project presentations. Click any
                      photograph to view in full resolution.
                    </p>
                  </div>

                  {/* Interactive Gallery Filter Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-[#F4F5F8] p-1.5 rounded-lg border border-[#e3e5f0] self-start lg:self-end">
                    {(
                      [
                        { id: 'all', label: 'All Photos (24)' },
                        { id: 'engineering', label: 'Engineering & Data' },
                        { id: 'design', label: 'Design Studio' },
                        { id: 'campus', label: 'Cohort & Campus' },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setGalleryTab(tab.id)}
                        className={`px-3.5 py-2 rounded-md text-xs font-montserrat font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          galleryTab === tab.id
                            ? 'bg-[#1c3f9c] text-white shadow-2xs'
                            : 'text-[#454545] hover:text-[#121212]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Responsive Multi-Column Photo Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {visibleGalleryPhotos.map((item, idx) => {
                    const isWide =
                      galleryTab === 'all' &&
                      (idx === 0 || idx === 5 || idx === 12 || idx === 15);
                    return (
                      <div
                        key={item.id}
                        onClick={() =>
                          setLightboxData({
                            imageUrl: item.imageUrl,
                            caption: item.caption,
                            label: item.label,
                          })
                        }
                        style={{
                          borderColor: item.border,
                          backgroundColor: item.bg,
                        }}
                        className={`group relative h-[280px] sm:h-[300px] rounded-xl border-2 overflow-hidden cursor-pointer ${
                          isWide ? 'sm:col-span-2' : 'col-span-1'
                        }`}
                      >
                        <ResilientImage
                          src={item.imageUrl}
                          alt={item.caption}
                          flipX={item.flipX}
                          objectPosition={item.objectPosition}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-end justify-between p-4">
                          <div>
                            <span className="text-[10px] font-montserrat font-bold text-[#fdc12e] uppercase tracking-wider block">
                              {item.label}
                            </span>
                            <span className="text-white font-montserrat font-bold text-xs sm:text-sm leading-snug">
                              {item.caption}
                            </span>
                          </div>
                          <span className="bg-white/95 text-[#121212] p-1.5 rounded shrink-0">
                            <Maximize2 className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 9. ENROLMENT CALL-TO-ACTION & TUITION ESTIMATOR SECTION */}
            <section
              id="enrol"
              className="relative w-full bg-[#174da8] text-white py-20 lg:py-28 overflow-hidden"
            >
              {/* Top Orange-Gold Sweeping Accent */}
              <div
                className="w-full py-12 lg:py-16 mb-14 relative overflow-hidden"
                style={{
                  background:
                    'linear-gradient(135deg, #f58220 0%, #fdc12e 100%)',
                }}
              >
                <DiagonalStripes blueColor="#174da8" orangeColor="#f58220" />
                <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 relative z-20 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                  <div>
                    <div className="inline-flex items-center bg-[#121212] text-white px-5 py-2.5 rounded-lg">
                      <span className="font-montserrat font-extrabold text-xs sm:text-sm tracking-wide">
                        {BACK_COVER_DATA.brandPill}
                      </span>
                    </div>
                    <h2 className="font-montserrat font-extrabold text-5xl sm:text-6xl lg:text-7xl text-[#121212] leading-[0.95] tracking-tight mt-5">
                      Start your journey today.
                    </h2>
                    <p className="font-montserrat font-bold text-lg sm:text-xl text-white drop-shadow-xs mt-4">
                      {BACK_COVER_DATA.tagline}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEnrolModalOpen(true)}
                    className="self-start lg:self-end px-7 py-4 bg-[#121212] hover:bg-[#1c3f9c] text-white font-montserrat font-extrabold text-sm rounded-lg inline-flex items-center gap-2.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Open Enrolment Application</span>
                    <ArrowRight className="w-4 h-4 text-[#fdc12e]" />
                  </button>
                </div>
              </div>

              {/* Main Enrolment & Live Tuition Calculator Split */}
              <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                  {/* Left 7 Columns: Ready to Get Started + Contact Info + QR Code */}
                  <div className="lg:col-span-7 space-y-8">
                    <div>
                      <h3 className="font-montserrat font-extrabold text-3xl sm:text-4xl text-[#fdc12e]">
                        {BACK_COVER_DATA.ctaHeading}
                      </h3>
                      <p className="font-merriweather text-base text-white/95 leading-relaxed mt-4 max-w-[58ch]">
                        {BACK_COVER_DATA.ctaBody}
                      </p>
                    </div>

                    {/* Contact Grid + QR Code Trigger */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-center pt-4">
                      <div className="sm:col-span-7 space-y-5">
                        {BACK_COVER_DATA.contacts.map((c, idx) => (
                          <div key={idx} className="flex items-stretch gap-4">
                            <span className="w-1.5 bg-[#f58220] rounded-xs shrink-0" />
                            <div>
                              <div className="font-montserrat font-bold text-[11px] text-[#fdc12e] tracking-wider">
                                {c.label}
                              </div>
                              <div className="font-montserrat font-medium text-sm sm:text-base text-white mt-1">
                                {c.value}
                              </div>
                            </div>
                          </div>
                        ))}

                        <div className="pt-3">
                          <div className="inline-flex items-center bg-[#f58220] px-4 py-1.5 rounded-lg">
                            <span className="font-montserrat font-extrabold text-xs text-[#121212]">
                              {BACK_COVER_DATA.centreLabel}
                            </span>
                          </div>
                          <div className="font-montserrat font-bold text-base text-white mt-2">
                            {BACK_COVER_DATA.centreLocation}
                          </div>
                        </div>
                      </div>

                      {/* Interactive QR Enrolment Card */}
                      <div className="sm:col-span-5 flex flex-col items-start sm:items-center">
                        <button
                          type="button"
                          onClick={() => setIsEnrolModalOpen(true)}
                          className="group w-[190px] h-[190px] bg-white rounded-xl p-4 flex flex-col items-center justify-center shadow-lg hover:scale-[1.02] transition-transform cursor-pointer"
                          title="Click to launch online enrolment form"
                        >
                          <QrCode className="w-32 h-32 text-[#174da8] group-hover:text-[#121212] transition-colors" />
                          <span className="font-montserrat font-bold text-[10px] text-[#174da8] mt-1.5">
                            CLICK TO ENROL
                          </span>
                        </button>
                        <span className="font-montserrat font-bold text-xs text-white tracking-wider mt-3">
                          SCAN TO ENROL
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right 5 Columns: Interactive Tuition Estimator Card */}
                  <div className="lg:col-span-5 bg-white text-[#121212] rounded-xl border border-[#e3e5f0] p-6 sm:p-8 shadow-xl">
                    <div className="flex items-center justify-between pb-4 border-b border-[#e3e5f0]">
                      <div className="flex items-center gap-2.5">
                        <Calculator className="w-5 h-5 text-[#f58220]" />
                        <h4 className="font-montserrat font-extrabold text-lg text-[#121212]">
                          Tuition &amp; Track Estimator
                        </h4>
                      </div>
                      {selectedCourses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedCourseIds([])}
                          className="text-xs font-montserrat font-bold text-[#e4265a] hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Clear</span>
                        </button>
                      )}
                    </div>

                    {selectedCourses.length === 0 ? (
                      <div className="py-10 text-center">
                        <p className="font-montserrat font-bold text-sm text-[#121212]">
                          No courses selected in your estimate yet
                        </p>
                        <p className="font-merriweather text-xs text-[#454545] mt-1.5">
                          Click &ldquo;Add to Estimate&rdquo; on any course card
                          above to calculate your total tuition.
                        </p>
                        <button
                          type="button"
                          onClick={() => scrollToSection('courses')}
                          className="mt-4 px-4 py-2 bg-[#1c3f9c] text-white text-xs font-montserrat font-bold rounded-lg cursor-pointer"
                        >
                          Browse Courses
                        </button>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-4">
                        <div className="max-h-[240px] overflow-y-auto space-y-2 pr-1">
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
                                  onClick={() => handleToggleCourse(c)}
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
                          onClick={() => setIsEnrolModalOpen(true)}
                          className="w-full py-3.5 px-5 bg-[#1c3f9c] hover:bg-[#174da8] text-white font-montserrat font-bold text-xs rounded-lg inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <span>Complete Enrolment Registration</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <p className="font-merriweather text-[11px] text-[#454545] mt-5 pt-4 border-t border-[#e3e5f0]">
                      {BACK_COVER_DATA.disclaimer}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* =====================================================================
          10. SHARED CONTACT INFORMATION & MULTI-PAGE WEBSITE FOOTER
      ===================================================================== */}
      <footer id="contact" className="w-full bg-[#121212] text-white">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            {/* Brand & Mission */}
            <div className="lg:col-span-4 space-y-4">
              <Link
                to="/"
                className="w-[200px] h-[66px] bg-white rounded-lg p-2 flex items-center justify-center"
              >
                <ResilientImage
                  src={COVER_DATA.logoUrl}
                  alt="Brainbench Technology Logo"
                  objectPosition="50% 50%"
                  className="w-full h-full object-contain"
                />
              </Link>
              <p className="font-montserrat font-bold text-sm text-[#fdc12e]">
                Think. Innovate. Build.
              </p>
              <p className="font-merriweather text-xs text-white/75 leading-relaxed max-w-sm">
                {COVER_DATA.description}
              </p>
            </div>

            {/* Quick Pages & Events Navigation */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#fdc12e]">
                Pages &amp; Events
              </h4>
              <ul className="space-y-2 text-xs font-montserrat text-white/80">
                <li>
                  <Link
                    to="/"
                    className="hover:text-[#fdc12e] transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-[#fdc12e] transition-colors"
                  >
                    About Brainbench
                  </Link>
                </li>
                <li>
                  <Link
                    to="/courses"
                    className="hover:text-[#fdc12e] transition-colors"
                  >
                    Courses ({ALL_COURSES.length})
                  </Link>
                </li>
                <li>
                  <Link
                    to="/solutions"
                    className="hover:text-[#fdc12e] transition-colors"
                  >
                    Solutions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/events"
                    className="hover:text-[#fdc12e] transition-colors"
                  >
                    Events Overview
                  </Link>
                </li>
                <li>
                  <Link
                    to="/events/the-edge"
                    className="hover:text-[#fdc12e] transition-colors"
                  >
                    The Edge: Beyond the Classroom
                  </Link>
                </li>
                <li>
                  <Link
                    to="/events/brainbench-spark-it"
                    className="hover:text-[#fdc12e] transition-colors"
                  >
                    Brainbench Spark It
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-[#fdc12e] transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Skill Categories Navigation */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#fdc12e]">
                2026 Skill Categories
              </h4>
              <ul className="space-y-2 text-xs font-montserrat text-white/80">
                {CATEGORY_INDEX.map((cat) => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectCategoryNav(cat.name, cat.id)}
                      className="hover:text-[#fdc12e] transition-colors cursor-pointer text-left"
                    >
                      {cat.name} ({cat.courseCount}{' '}
                      {cat.courseCount === 1 ? 'course' : 'courses'})
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Centres & Contact Details */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#fdc12e]">
                {BACK_COVER_DATA.centreLabel} &amp; Admissions
              </h4>
              <p className="font-montserrat font-bold text-sm text-white">
                {BACK_COVER_DATA.centreLocation}
              </p>
              <div className="space-y-1.5 text-xs font-montserrat text-white/75 pt-1">
                {BACK_COVER_DATA.contacts.map((c, i) => (
                  <div key={i}>
                    <strong className="text-white/95">{c.label}:</strong>{' '}
                    {c.value}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-merriweather text-white/60">
            <div>
              © 2026 Brainbench Technology. {BACK_COVER_DATA.disclaimer}
            </div>
            <div className="flex items-center gap-6 font-montserrat font-semibold">
              <Link
                to="/admin/demo-requests"
                className="text-white/50 hover:text-white transition-colors"
              >
                Admin Portal
              </Link>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-white cursor-pointer"
              >
                Back to Top
              </button>
              <button
                type="button"
                onClick={() => setIsEnrolModalOpen(true)}
                className="text-[#fdc12e] hover:underline cursor-pointer"
              >
                Enrol Online
              </button>
            </div>
          </div>
        </div>

        <FourColorBar lastColor="#f58220" heightClass="h-4" />
      </footer>

      {/* =====================================================================
          INTERACTIVE MODALS (Course Details, Lightbox, Cohort Enrolment)
      ===================================================================== */}
      <CourseDetailModal
        course={inspectedCourse}
        isSelected={
          inspectedCourse
            ? selectedCourseIds.includes(inspectedCourse.id)
            : false
        }
        onClose={() => setInspectedCourse(null)}
        onToggleCourse={handleToggleCourse}
        onEnrolNow={(course) => {
          if (!selectedCourseIds.includes(course.id)) {
            handleToggleCourse(course);
          }
          setInspectedCourse(null);
          setIsEnrolModalOpen(true);
        }}
      />

      <LightboxModal
        data={lightboxData}
        onClose={() => setLightboxData(null)}
      />

      <EnrolModal
        isOpen={isEnrolModalOpen}
        selectedCourseIds={selectedCourseIds}
        onToggleCourse={handleToggleCourse}
        onClose={() => setIsEnrolModalOpen(false)}
      />
    </div>
  );
}
