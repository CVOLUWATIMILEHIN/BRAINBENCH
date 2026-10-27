import React, { useState } from 'react';
import {
  ABOUT_DATA,
  ALL_COURSES,
  BACK_COVER_DATA,
  CATEGORY_INDEX,
  COVER_DATA,
  CourseItem,
  GALLERY_PAGE_18,
  GALLERY_PAGE_19,
} from '../data/brochureData';
import { isSafeImageUrl } from '../utils/security';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Maximize2,
  Plus,
  QrCode,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react';

export const ResilientImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  flipX?: boolean;
  objectPosition?: string;
}> = ({
  src,
  alt,
  className = '',
  flipX = false,
  objectPosition = '50% 20%',
}) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src || !isSafeImageUrl(src)) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#1c3f9c] to-[#121212] text-white p-6 text-center ${className}`}
      >
        <span className="font-montserrat font-bold text-xs tracking-wider opacity-80">
          BRAINBENCH TECHNOLOGY
        </span>
        <span className="font-merriweather text-xs text-white/75 mt-1.5 line-clamp-2">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      style={{ objectPosition }}
      className={`${className} ${flipX ? '-scale-x-100' : ''}`}
    />
  );
};

export const FourColorBar: React.FC<{
  lastColor?: string;
  heightClass?: string;
}> = ({ lastColor = '#1c3f9c', heightClass = 'h-3.5' }) => (
  <div className={`w-full grid grid-cols-4 ${heightClass} shrink-0`}>
    <div className="bg-[#121212]" />
    <div className="bg-[#fdc12e]" />
    <div className="bg-[#e4265a]" />
    <div style={{ backgroundColor: lastColor }} />
  </div>
);

export const DiagonalStripes: React.FC<{
  blueColor?: string;
  orangeColor?: string;
  className?: string;
}> = ({
  blueColor = '#1c3f9c',
  orangeColor = '#f7941d',
  className = '-top-28 right-8 lg:right-20',
}) => {
  const colors = [
    blueColor,
    '#ffffff',
    orangeColor,
    blueColor,
    '#ffffff',
    orangeColor,
    blueColor,
    '#ffffff',
    orangeColor,
  ];
  return (
    <div
      className={`absolute ${className} flex gap-5 pointer-events-none select-none z-10 opacity-90`}
      style={{ transform: 'rotate(28deg)' }}
      aria-hidden="true"
    >
      {colors.map((c, idx) => (
        <div
          key={idx}
          className="w-2.5 h-[360px] rounded-xs"
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
  );
};

interface CourseCardProps {
  course: CourseItem;
  isSelected: boolean;
  isFeaturedSplit?: boolean;
  onToggleCourse: (course: CourseItem) => void;
  onInspectCourse: (course: CourseItem) => void;
  onOpenLightbox: (imageUrl: string, caption: string, label: string) => void;
}

export const CourseWebsiteCard: React.FC<CourseCardProps> = ({
  course,
  isSelected,
  isFeaturedSplit = false,
  onToggleCourse,
  onInspectCourse,
  onOpenLightbox,
}) => {
  const midPoint = Math.ceil(course.outline.length / 2);
  const leftCol = course.outline.slice(0, midPoint);
  const rightCol = course.outline.slice(midPoint);

  const hasDescription = Boolean(course.description && course.description.trim());
  const hasOutline = Boolean(course.outline && course.outline.length > 0);
  const hasDuration = Boolean(course.duration && course.duration.trim());
  const isCompactCard = !hasOutline;

  const isWhiteBg = course.bg.toLowerCase() === '#ffffff';
  const isOrangeBg =
    course.bg.toLowerCase() === '#f58220' ||
    course.bg.toLowerCase() === '#f7941d';

  const imageBlock = (
    <div
      onClick={() =>
        onOpenLightbox(
          course.imageUrl,
          course.description
            ? `${course.title} — ${course.description}`
            : `${course.title} (${course.category} · ${course.price})`,
          course.category
        )
      }
      className={`group relative bg-[#dbe5fa] overflow-hidden cursor-pointer shrink-0 ${
        isFeaturedSplit
          ? 'w-full sm:w-[300px] md:w-[360px] lg:w-[44%] xl:w-[45%] aspect-[4/3] sm:aspect-auto sm:min-h-[380px] lg:min-h-[420px]'
          : isCompactCard
          ? 'w-full sm:w-[230px] xl:w-[260px] aspect-[4/3] sm:aspect-auto sm:min-h-[240px]'
          : 'w-full sm:w-[230px] xl:w-[260px] aspect-[4/3] sm:aspect-auto sm:min-h-[330px]'
      }`}
    >
      <ResilientImage
        src={course.imageUrl}
        alt={`${course.title} training programme`}
        objectPosition={course.objectPosition || '50% 20%'}
        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-end justify-between p-4">
        <span className="text-white font-montserrat font-semibold text-xs">
          Preview Training Photo
        </span>
        <span className="bg-white/95 text-[#121212] p-1.5 rounded">
          <Maximize2 className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );

  const contentBlock = (
    <div
      style={{ backgroundColor: course.bg }}
      className={`flex-1 flex flex-col justify-between min-w-0 ${
        isFeaturedSplit ? 'p-6 sm:p-8 lg:p-10' : 'p-6 sm:p-7'
      } ${isWhiteBg ? 'border-t sm:border-t-0 border-[#e3e5f0]' : ''}`}
    >
      <div>
        {/* Top Row: Course Title Button + Select Action */}
        <div className="flex flex-wrap items-center justify-between gap-3.5">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onInspectCourse(course)}
              style={{
                backgroundColor: course.titlePillBg,
                color: course.titleTextColor,
              }}
              className={`inline-flex items-center gap-2 rounded-lg font-montserrat font-extrabold leading-snug shadow-xs hover:opacity-95 transition-opacity text-left cursor-pointer ${
                isFeaturedSplit
                  ? 'px-5 py-2.5 text-xl sm:text-2xl lg:text-[26px]'
                  : 'px-4 py-2 text-base sm:text-lg'
              }`}
            >
              <span>{course.title}</span>
            </button>

            {isFeaturedSplit && (
              <span
                className={`hidden xl:inline-flex items-center px-3 py-1 rounded-md font-montserrat font-bold text-xs uppercase tracking-wider ${
                  isOrangeBg
                    ? 'bg-[#121212]/10 text-[#121212]'
                    : isWhiteBg
                    ? 'bg-[#174da8]/10 text-[#174da8]'
                    : 'bg-white/15 text-white'
                }`}
              >
                Featured Track · {course.category}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => onToggleCourse(course)}
            className={`inline-flex items-center gap-1.5 rounded-lg font-montserrat font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              isFeaturedSplit
                ? 'px-4 py-2.5 text-xs sm:text-sm'
                : 'px-3.5 py-2 text-xs'
            } ${
              isSelected
                ? 'bg-[#10b981] text-white shadow-xs'
                : isWhiteBg
                ? 'bg-[#f4f5f8] text-[#174da8] hover:bg-[#e3e5f0]'
                : isOrangeBg
                ? 'bg-[#121212] text-white hover:bg-[#1c3f9c]'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            {isSelected ? (
              <>
                <Check className="w-4 h-4" />
                <span>Selected</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add to Estimate</span>
              </>
            )}
          </button>
        </div>

        {/* Category Badge */}
        <div className="mt-3">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded font-montserrat font-bold text-[11px] uppercase tracking-wider ${
              isOrangeBg
                ? 'bg-[#121212]/15 text-[#121212]'
                : isWhiteBg
                ? 'bg-[#174da8]/10 text-[#174da8]'
                : 'bg-white/15 text-white'
            }`}
          >
            {course.category}
          </span>
        </div>

        {/* Course Description */}
        {hasDescription && (
          <div className={isFeaturedSplit ? 'mt-5' : 'mt-4'}>
            <h4
              className={`font-montserrat font-extrabold tracking-wider uppercase ${
                isFeaturedSplit ? 'text-xs sm:text-sm' : 'text-xs'
              }`}
              style={{ color: course.descLabelColor }}
            >
              COURSE DESCRIPTION
            </h4>
            <p
              className={`font-merriweather leading-relaxed mt-2 ${
                isFeaturedSplit
                  ? 'text-base sm:text-[17px] lg:text-[18px] font-normal'
                  : 'text-xs sm:text-sm'
              }`}
              style={{ color: course.textColor }}
            >
              {course.description}
            </p>
          </div>
        )}

        {/* Course Outline */}
        {hasOutline && (
          <div className={isFeaturedSplit ? 'mt-6' : 'mt-4'}>
            <h4
              className={`font-montserrat font-extrabold tracking-wider uppercase ${
                isFeaturedSplit ? 'text-xs sm:text-sm' : 'text-xs'
              }`}
              style={{ color: course.descLabelColor }}
            >
              COURSE OUTLINE
            </h4>

            {isFeaturedSplit ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {course.outline.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border ${
                      isOrangeBg
                        ? 'bg-[#121212]/15 border-white/20'
                        : isWhiteBg
                        ? 'bg-[#f8f9fc] border-[#e3e5f0]'
                        : 'bg-white/10 border-white/15'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isOrangeBg
                          ? 'bg-[#121212]'
                          : isWhiteBg
                          ? 'bg-[#174da8]'
                          : 'bg-[#fdc12e]'
                      }`}
                    />
                    <span
                      className="font-montserrat font-semibold text-sm sm:text-[15px] leading-snug"
                      style={{ color: course.textColor }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
                <ul className="space-y-1.5">
                  {leftCol.map((item, idx) => (
                    <li
                      key={idx}
                      className="font-merriweather text-xs sm:text-[13.5px] leading-snug"
                      style={{ color: course.textColor }}
                    >
                      • {item}
                    </li>
                  ))}
                </ul>
                <ul className="space-y-1.5">
                  {rightCol.map((item, idx) => (
                    <li
                      key={idx}
                      className="font-merriweather text-xs sm:text-[13.5px] leading-snug"
                      style={{ color: course.textColor }}
                    >
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Row: Duration and Price Box + Full Details Link */}
      <div
        className={`${
          isFeaturedSplit ? 'mt-7 pt-5' : 'mt-6 pt-3'
        } flex flex-wrap items-center justify-between gap-4`}
      >
        <div
          className={`inline-flex items-center bg-white border border-[#174da8] rounded-lg shadow-2xs ${
            isFeaturedSplit ? 'px-5 py-3 gap-7' : 'px-3.5 py-2 gap-5'
          }`}
        >
          {hasDuration && (
            <div className="flex items-center gap-3">
              <span
                className={`w-1.5 bg-[#174da8] rounded-xs shrink-0 ${
                  isFeaturedSplit ? 'h-9' : 'h-7'
                }`}
              />
              <div>
                <div
                  className={`font-montserrat font-semibold leading-none text-[#454545] uppercase ${
                    isFeaturedSplit ? 'text-[10px]' : 'text-[9px]'
                  }`}
                >
                  COURSE DURATION:
                </div>
                <div
                  className={`font-montserrat font-extrabold leading-none text-[#121212] mt-1 tabular-nums whitespace-nowrap ${
                    isFeaturedSplit
                      ? 'text-sm sm:text-base lg:text-lg'
                      : 'text-xs sm:text-sm'
                  }`}
                >
                  {course.duration}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <span
              className={`w-1.5 bg-[#f58220] rounded-xs shrink-0 ${
                isFeaturedSplit ? 'h-9' : 'h-7'
              }`}
            />
            <div>
              <div
                className={`font-montserrat font-semibold leading-none text-[#454545] uppercase ${
                  isFeaturedSplit ? 'text-[10px]' : 'text-[9px]'
                }`}
              >
                COURSE PRICE:
              </div>
              <div
                className={`font-montserrat font-extrabold leading-none text-[#174da8] mt-1 tabular-nums whitespace-nowrap ${
                  isFeaturedSplit
                    ? 'text-sm sm:text-base lg:text-lg'
                    : 'text-xs sm:text-sm'
                }`}
              >
                {course.price}
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onInspectCourse(course)}
          className={`inline-flex items-center gap-1.5 font-montserrat font-bold cursor-pointer whitespace-nowrap shrink-0 transition-colors ${
            isFeaturedSplit
              ? isOrangeBg
                ? 'px-4 py-2.5 rounded-lg bg-[#121212] text-white hover:bg-[#1c3f9c] text-xs sm:text-sm shadow-2xs'
                : 'px-4 py-2.5 rounded-lg bg-white/15 text-white hover:bg-white/25 text-xs sm:text-sm'
              : isWhiteBg
              ? 'text-xs text-[#174da8] hover:text-[#121212] underline underline-offset-4'
              : 'text-xs text-white/90 hover:text-white underline underline-offset-4'
          }`}
        >
          <span>Course Details</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <article className="w-full rounded-xl border border-[#e3e5f0] overflow-hidden flex flex-col sm:flex-row items-stretch transition-shadow hover:shadow-md bg-white">
      {isFeaturedSplit && course.photoPos === 'right' ? (
        <>
          {contentBlock}
          {imageBlock}
        </>
      ) : (
        <>
          {imageBlock}
          {contentBlock}
        </>
      )}
    </article>
  );
};
