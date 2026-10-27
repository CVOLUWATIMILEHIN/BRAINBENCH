import React, { useState } from 'react';
import { ALL_COURSES, CourseItem } from '../data/brochureData';
import { ResilientImage } from './WebsiteSections';
import { X, Check, Plus, Award, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

interface CourseDetailModalProps {
  course: CourseItem | null;
  isSelected: boolean;
  onClose: () => void;
  onToggleCourse: (course: CourseItem) => void;
  onEnrolNow: (course: CourseItem) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  isSelected,
  onClose,
  onToggleCourse,
  onEnrolNow,
}) => {
  if (!course) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#e3e5f0] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="relative h-56 sm:h-64 bg-[#1c3f9c] overflow-hidden">
          <ResilientImage
            src={course.imageUrl}
            alt={course.title}
            objectPosition={course.objectPosition || '50% 20%'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2 rounded transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="text-xs font-montserrat font-semibold text-[#fdc12e]">
              {course.category} · Page {course.pageNumber || 'Catalogue'}
            </div>
            <h2 className="font-montserrat font-extrabold text-2xl sm:text-3xl mt-1">
              {course.title}
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Key Metrics Strip */}
          <div
            className={`grid ${
              course.duration ? 'grid-cols-3' : 'grid-cols-2'
            } gap-3 bg-[#f8f9fc] border border-[#e3e5f0] p-4`}
          >
            {course.duration && (
              <div>
                <div className="text-[10px] font-montserrat font-bold text-[#454545] uppercase">
                  Course Duration
                </div>
                <div className="font-montserrat font-extrabold text-sm sm:text-base text-[#121212] mt-0.5 tabular-nums">
                  {course.duration}
                </div>
              </div>
            )}
            <div>
              <div className="text-[10px] font-montserrat font-bold text-[#454545] uppercase">
                2026 Tuition Fee
              </div>
              <div className="font-montserrat font-extrabold text-sm sm:text-base text-[#174da8] mt-0.5 tabular-nums">
                {course.price}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-montserrat font-bold text-[#454545] uppercase">
                Category
              </div>
              <div className="font-montserrat font-extrabold text-sm sm:text-base text-[#121212] mt-0.5">
                {course.category}
              </div>
            </div>
          </div>

          {/* Description */}
          {course.description && (
            <div>
              <h3 className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#174da8]">
                Programme Overview
              </h3>
              <p className="font-merriweather text-sm text-[#121212] leading-relaxed mt-2">
                {course.description}
              </p>
            </div>
          )}

          {/* Course Outline Modules */}
          {course.outline && course.outline.length > 0 && (
            <div>
              <h3 className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#174da8]">
                Curriculum &amp; Practical Modules
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
                {course.outline.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2.5 bg-[#f8f9fc] border border-[#e3e5f0]"
                  >
                    <span className="font-mono-tabular text-xs font-bold text-[#1c3f9c]">
                      0{idx + 1}.
                    </span>
                    <span className="font-merriweather text-xs text-[#121212]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery Info */}
          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-merriweather text-[#454545]">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#f58220]" />
              Ado-Ekiti Training Centre &amp; Guided Lab
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#1c3f9c]" />
              Industry Portfolio + Diploma Certificate
            </span>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#e3e5f0] flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onToggleCourse(course)}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded text-xs font-montserrat font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'bg-[#10b981] text-white'
                  : 'bg-[#f4f5f8] hover:bg-[#e3e5f0] text-[#121212]'
              }`}
            >
              {isSelected ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Tuition Estimator</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add to Tuition Estimator</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onEnrolNow(course)}
              className="px-5 py-2.5 bg-[#1c3f9c] hover:bg-[#174da8] text-white rounded text-xs font-montserrat font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Enrol in This Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LightboxModalProps {
  data: { imageUrl: string; caption: string; label: string } | null;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  data,
  onClose,
}) => {
  if (!data) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full bg-[#121212] border border-white/15 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="text-xs font-montserrat font-bold text-[#fdc12e]">
            Brainbench Technology · {data.label}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 cursor-pointer"
            aria-label="Close image preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[75vh] flex items-center justify-center bg-black overflow-hidden">
          <ResilientImage
            src={data.imageUrl}
            alt={data.caption}
            className="max-h-[75vh] w-auto object-contain"
          />
        </div>

        <div className="px-5 py-3.5 bg-[#121212] text-white font-merriweather text-xs">
          {data.caption}
        </div>
      </div>
    </div>
  );
};

interface EnrolModalProps {
  isOpen: boolean;
  selectedCourseIds: string[];
  onToggleCourse: (course: CourseItem) => void;
  onClose: () => void;
}

export const EnrolModal: React.FC<EnrolModalProps> = ({
  isOpen,
  selectedCourseIds,
  onToggleCourse,
  onClose,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [schedule, setSchedule] = useState<'weekday' | 'weekend' | 'evening'>(
    'weekday'
  );
  const [quickCourseId, setQuickCourseId] = useState<string>(
    ALL_COURSES[0]?.id || ''
  );
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedCourses = ALL_COURSES.filter((c) =>
    selectedCourseIds.includes(c.id)
  );
  const subtotal = selectedCourses.reduce((sum, c) => sum + c.priceNumeric, 0);
  const discount =
    selectedCourses.length >= 2 ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourses.length === 0 && quickCourseId) {
      const found = ALL_COURSES.find((c) => c.id === quickCourseId);
      if (found) onToggleCourse(found);
    }
    const randomRef =
      'BBT-2026-' + Math.floor(100000 + Math.random() * 900000);
    setSubmittedRef(randomRef);
  };

  const handleResetAndClose = () => {
    setSubmittedRef(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={handleResetAndClose}
    >
      <div
        className="bg-white border border-[#e3e5f0] max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-6 py-5 flex items-center justify-between"
          style={{
            background: 'linear-gradient(90deg, #f7941d 0%, #fdc12e 100%)',
          }}
        >
          <div>
            <div className="text-[11px] font-montserrat font-bold text-[#1c3f9c]">
              BRAINBENCH TECHNOLOGY · 2026 ADMISSIONS
            </div>
            <h2 className="font-montserrat font-extrabold text-xl text-[#121212]">
              Cohort Registration &amp; Tuition Slip
            </h2>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-1.5 bg-black/10 hover:bg-black/20 rounded text-[#121212] cursor-pointer"
            aria-label="Close registration modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submittedRef ? (
          <div className="p-6 space-y-5 text-center">
            <CheckCircle2 className="w-12 h-12 text-[#10b981] mx-auto" />
            <div>
              <h3 className="font-montserrat font-extrabold text-lg text-[#121212]">
                Enrolment Application Received
              </h3>
              <p className="font-merriweather text-xs text-[#454545] mt-1">
                Your 2026 cohort reservation slip has been generated for the
                Ado-Ekiti Training Centre.
              </p>
            </div>

            <div className="bg-[#f8f9fc] border border-[#e3e5f0] p-4 text-left space-y-2 text-xs font-montserrat">
              <div className="flex justify-between">
                <span className="text-[#454545]">Admission Reference:</span>
                <span className="font-mono-tabular font-bold text-[#1c3f9c]">
                  {submittedRef}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#454545]">Applicant Name:</span>
                <span className="font-bold text-[#121212]">{fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#454545]">Preferred Schedule:</span>
                <span className="font-bold text-[#121212] capitalize">
                  {schedule} Cohort
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#e3e5f0]">
                <span className="font-bold text-[#121212]">
                  Total Estimated Tuition:
                </span>
                <span className="font-extrabold text-[#174da8] tabular-nums">
                  ₦{total.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full py-2.5 bg-[#1c3f9c] hover:bg-[#174da8] text-white font-montserrat font-bold text-xs rounded cursor-pointer"
            >
              Done &amp; Return to Catalogue
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Selected Courses or Course Picker */}
            <div>
              <label className="block font-montserrat font-bold text-xs text-[#121212] mb-1.5">
                Selected Programme(s)
              </label>
              {selectedCourses.length > 0 ? (
                <div className="space-y-2 bg-[#f8f9fc] border border-[#e3e5f0] p-3">
                  {selectedCourses.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between text-xs font-montserrat"
                    >
                      <span className="font-semibold text-[#121212]">
                        {c.title}{' '}
                        {c.duration && (
                          <span className="text-[#454545] font-normal">
                            ({c.duration})
                          </span>
                        )}
                      </span>
                      <span className="font-bold text-[#174da8] tabular-nums">
                        {c.price}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-[#e3e5f0] flex items-center justify-between text-xs font-montserrat font-extrabold">
                    <span>Estimated Total</span>
                    <span className="text-[#1c3f9c] tabular-nums">
                      ₦{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <select
                  value={quickCourseId}
                  onChange={(e) => setQuickCourseId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#f8f9fc] border border-[#e3e5f0] rounded text-xs font-montserrat font-semibold text-[#121212]"
                >
                  {ALL_COURSES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} — {c.category} ({c.duration ? `${c.duration} · ` : ''}
                      {c.price})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-montserrat font-bold text-xs text-[#121212] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Adewale Ogunleye"
                  className="w-full px-3 py-2 bg-[#f8f9fc] border border-[#e3e5f0] rounded text-xs font-montserrat text-[#121212] focus:outline-none focus:border-[#1c3f9c]"
                />
              </div>
              <div>
                <label className="block font-montserrat font-bold text-xs text-[#121212] mb-1">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +234 803 000 0000"
                  className="w-full px-3 py-2 bg-[#f8f9fc] border border-[#e3e5f0] rounded text-xs font-montserrat text-[#121212] focus:outline-none focus:border-[#1c3f9c]"
                />
              </div>
            </div>

            <div>
              <label className="block font-montserrat font-bold text-xs text-[#121212] mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 bg-[#f8f9fc] border border-[#e3e5f0] rounded text-xs font-montserrat text-[#121212] focus:outline-none focus:border-[#1c3f9c]"
              />
            </div>

            <div>
              <label className="block font-montserrat font-bold text-xs text-[#121212] mb-1.5">
                Preferred Training Schedule (Ado-Ekiti Centre)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['weekday', 'weekend', 'evening'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSchedule(opt)}
                    className={`py-2 px-3 rounded text-xs font-montserrat font-bold capitalize border transition-colors cursor-pointer ${
                      schedule === opt
                        ? 'bg-[#1c3f9c] text-white border-[#1c3f9c]'
                        : 'bg-[#f8f9fc] text-[#454545] border-[#e3e5f0] hover:text-[#121212]'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2.5 text-xs font-montserrat font-semibold text-[#454545] hover:text-[#121212] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#1c3f9c] hover:bg-[#174da8] text-white font-montserrat font-bold text-xs rounded transition-colors cursor-pointer whitespace-nowrap"
              >
                Reserve Cohort Seat
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
