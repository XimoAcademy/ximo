"use client";

import { useState } from "react";
import Link from "next/link";
import type { AthleteRow } from "@/lib/data/profile";
import type { Dict } from "@/lib/i18n/dictionaries";
import { COUNTRIES } from "@/lib/intl/countries";
import { TERMS, GRAD_STATUSES, GAP_STATUSES, PRIOR_ENROLLMENT_TYPES, RECRUITING_STATUSES } from "@/lib/education/fields";
import { estimateEligibilityWindow, delayedEnrollmentReducesTime } from "@/lib/ncaa/eligibility";

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>{children}</span>
);

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/**
 * Education & college timeline (requirement #8) with progressive disclosure:
 * follow-up fields appear only when relevant, so the form never feels like an
 * intimidating questionnaire. All inputs are plain form controls that submit
 * with the parent ProfileForm's <form> (saveProfileAction persists them).
 */
export default function EducationTimeline({
  athlete,
  t,
}: {
  athlete: AthleteRow | null;
  t: Dict["education"];
}) {
  const [gapStatus, setGapStatus] = useState<string>(athlete?.gap_year_status ?? "");
  const [firstFullTime, setFirstFullTime] = useState<string>(
    athlete?.first_full_time_enrollment === false ? "no" : athlete?.first_full_time_enrollment === true ? "yes" : ""
  );
  const [dob, setDob] = useState<string>(athlete?.date_of_birth ?? "");
  const [intendedYear, setIntendedYear] = useState<string>(athlete?.intended_college_year ? String(athlete.intended_college_year) : "");
  const [intendedTerm, setIntendedTerm] = useState<string>(athlete?.intended_college_term ?? "fall");

  const gapRevealed = ["planned", "unsure", "current", "completed"].includes(gapStatus);
  const hasPrior = firstFullTime === "no";

  // Optional private timeline estimate (requirement #11).
  const est = estimateEligibilityWindow({
    dob: dob || null,
    firstEnrollmentTerm: (intendedTerm || "fall") as (typeof TERMS)[number],
    firstEnrollmentYear: intendedYear ? Number(intendedYear) : null,
  });
  const showDelayWarning = delayedEnrollmentReducesTime({
    dob: dob || null,
    firstEnrollmentTerm: (intendedTerm || "fall") as (typeof TERMS)[number],
    firstEnrollmentYear: intendedYear ? Number(intendedYear) : null,
  });

  const todayISO = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  })();

  return (
    <div>
      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>
        {t.timelineHeading}
      </p>
      <p className="mb-3 text-[11px]" style={{ color: "var(--text-3)" }}>{t.timelineSubtitle}</p>

      {/* Date of birth (private) + intl identity */}
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block">
          <Label>{t.dobLabel}</Label>
          <input
            name="date_of_birth"
            type="date"
            max={todayISO}
            autoComplete="bday"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="ximo-input ph-no-capture"
            data-sentry-mask="true"
          />
        </label>
        <label className="block">
          <Label>{t.nationalityLabel}</Label>
          <select name="nationality_code" defaultValue={athlete?.nationality_code ?? ""} className="ximo-input">
            <option value="">{t.optionUnset}</option>
            {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </label>
        <label className="block">
          <Label>{t.educationCountryLabel}</Label>
          <select name="education_country_code" defaultValue={athlete?.education_country_code ?? ""} className="ximo-input">
            <option value="">{t.optionUnset}</option>
            {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </label>
      </div>
      <p className="mt-1 text-[10px]" style={{ color: "var(--text-3)" }}>{t.dobHelp}</p>

      {/* High school */}
      <p className="mt-5 mb-2 text-[11px] font-bold" style={{ color: "var(--text-2)" }}>{t.hsHeading}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block">
          <Label>{t.gradTermLabel}</Label>
          <select name="hs_graduation_term" defaultValue={athlete?.hs_graduation_term ?? ""} className="ximo-input">
            <option value="">{t.optionUnset}</option>
            {TERMS.map((k) => <option key={k} value={k}>{t.terms[k]}</option>)}
          </select>
        </label>
        <label className="block">
          <Label>{t.gradMonthLabel}</Label>
          <select name="hs_graduation_month" defaultValue={athlete?.hs_graduation_month ?? ""} className="ximo-input">
            <option value="">{t.optionUnset}</option>
            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
        <label className="block">
          <Label>{t.gradStatusLabel}</Label>
          <select name="hs_graduation_status" defaultValue={athlete?.hs_graduation_status ?? ""} className="ximo-input">
            <option value="">{t.optionUnset}</option>
            {GRAD_STATUSES.map((k) => <option key={k} value={k}>{t.gradStatuses[k]}</option>)}
          </select>
        </label>
      </div>

      {/* Gap year */}
      <p className="mt-5 mb-2 text-[11px] font-bold" style={{ color: "var(--text-2)" }}>{t.gapHeading}</p>
      <label className="block">
        <Label>{t.gapQuestion}</Label>
        <select name="gap_year_status" value={gapStatus} onChange={(e) => setGapStatus(e.target.value)} className="ximo-input">
          <option value="">{t.optionUnset}</option>
          {GAP_STATUSES.map((k) => <option key={k} value={k}>{t.gapStatuses[k]}</option>)}
        </select>
      </label>
      {gapRevealed && (
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <label className="block">
            <Label>{t.gapCountLabel}</Label>
            <input name="gap_year_count" type="text" inputMode="numeric" maxLength={2}
              defaultValue={athlete?.gap_year_count ?? ""} className="ximo-input" placeholder="1" />
          </label>
          <label className="block">
            <Label>{t.gapEnrollLabel}</Label>
            <select name="gap_full_time_enroll" defaultValue={boolToStr(athlete?.gap_full_time_enroll)} className="ximo-input">
              <option value="">{t.optionUnset}</option>
              <option value="yes">{t.yes}</option>
              <option value="no">{t.no}</option>
            </select>
          </label>
          <label className="block">
            <Label>{t.gapCompetitionLabel}</Label>
            <select name="gap_competition" defaultValue={boolToStr(athlete?.gap_competition)} className="ximo-input">
              <option value="">{t.optionUnset}</option>
              <option value="yes">{t.yes}</option>
              <option value="no">{t.no}</option>
            </select>
          </label>
          <p className="sm:col-span-3 text-[10px] leading-relaxed" style={{ color: "var(--text-3)" }}>{t.gapWhy}</p>
        </div>
      )}

      {/* Intended college enrollment */}
      <p className="mt-5 mb-2 text-[11px] font-bold" style={{ color: "var(--text-2)" }}>{t.collegeHeading}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block">
          <Label>{t.intendedYearLabel}</Label>
          <input name="intended_college_year" type="text" inputMode="numeric" maxLength={4}
            value={intendedYear} onChange={(e) => setIntendedYear(e.target.value.replace(/[^\d]/g, "").slice(0, 4))}
            className="ximo-input" placeholder="2027" />
        </label>
        <label className="block">
          <Label>{t.intendedTermLabel}</Label>
          <select name="intended_college_term" value={intendedTerm} onChange={(e) => setIntendedTerm(e.target.value)} className="ximo-input">
            {TERMS.map((k) => <option key={k} value={k}>{t.terms[k]}</option>)}
          </select>
        </label>
        <label className="block">
          <Label>{t.recruitingStatusLabel}</Label>
          <select name="recruiting_status" defaultValue={athlete?.recruiting_status ?? ""} className="ximo-input">
            <option value="">{t.optionUnset}</option>
            {RECRUITING_STATUSES.map((k) => <option key={k} value={k}>{t.recruitingStatuses[k]}</option>)}
          </select>
        </label>
      </div>

      {/* Discreet NCAA notice — directly below college-entry (requirement #9) */}
      <div className="mt-2.5 rounded-xl px-3 py-2.5" style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)" }}>
        <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-2)" }}>{t.noticeText}</p>
        <Link href="/resources/ncaa-division-i-eligibility"
          className="mt-1 inline-block text-[11px] font-semibold underline underline-offset-2"
          style={{ color: "var(--teal)" }}>
          {t.noticeLink} →
        </Link>
      </div>

      {/* First full-time enrollment + prior enrollment (progressive) */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <Label>{t.firstFullTimeLabel}</Label>
          <select name="first_full_time_enrollment" value={firstFullTime} onChange={(e) => setFirstFullTime(e.target.value)} className="ximo-input">
            <option value="">{t.optionUnset}</option>
            <option value="yes">{t.yes}</option>
            <option value="no">{t.no}</option>
          </select>
        </label>
      </div>
      <p className="mt-1 text-[10px] leading-relaxed" style={{ color: "var(--text-3)" }}>{t.firstFullTimeHelp}</p>
      {hasPrior && (
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <label className="block">
            <Label>{t.priorTypeLabel}</Label>
            <select name="prior_enrollment_type" defaultValue={athlete?.prior_enrollment_type ?? ""} className="ximo-input">
              <option value="">{t.optionUnset}</option>
              {PRIOR_ENROLLMENT_TYPES.map((k) => <option key={k} value={k}>{t.priorTypes[k]}</option>)}
            </select>
          </label>
          <label className="block">
            <Label>{t.firstEnrollYearLabel}</Label>
            <input name="first_enrollment_year" type="text" inputMode="numeric" maxLength={4}
              defaultValue={athlete?.first_enrollment_year ?? ""} className="ximo-input" placeholder="2026" />
          </label>
          <label className="block">
            <Label>{t.firstEnrollTermLabel}</Label>
            <select name="first_enrollment_term" defaultValue={athlete?.first_enrollment_term ?? ""} className="ximo-input">
              <option value="">{t.optionUnset}</option>
              {TERMS.map((k) => <option key={k} value={k}>{t.terms[k]}</option>)}
            </select>
          </label>
        </div>
      )}

      {/* Optional private timeline summary (estimate) — requirement #11 */}
      {est && (
        <div className="mt-5 rounded-2xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-black" style={{ color: "var(--text)" }}>{t.summaryHeading}</p>
            <span className="text-[10px]" style={{ color: "var(--text-3)" }}>🔒 {t.summaryPrivate}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl px-3 py-2" style={{ background: "var(--surface-hover)" }}>
              <p className="text-[10px]" style={{ color: "var(--text-label)" }}>{t.summaryStart}</p>
              <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{est.startFallYear}</p>
            </div>
            <div className="rounded-xl px-3 py-2" style={{ background: "var(--surface-hover)" }}>
              <p className="text-[10px]" style={{ color: "var(--text-label)" }}>{t.summaryEnd}</p>
              <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{est.endFallYear}</p>
            </div>
          </div>
          <p className="mt-2 text-[10px]" style={{ color: "var(--text-3)" }}>
            {est.driver === "age" ? t.summaryDriverAge : est.driver === "enrollment" ? t.summaryDriverEnrollment : ""}
          </p>
          {showDelayWarning && (
            <p className="mt-2 rounded-lg px-2.5 py-1.5 text-[11px] leading-relaxed"
              style={{ background: "var(--gold-bg)", border: "1px solid var(--gold-border)", color: "var(--text-2)" }}>
              ⚠ {t.summaryDelayWarning}
            </p>
          )}
          <p className="mt-2 text-[10px] italic" style={{ color: "var(--text-3)" }}>{t.summaryEstimate}</p>
        </div>
      )}
    </div>
  );
}

function boolToStr(v: boolean | null | undefined): string {
  if (v === true) return "yes";
  if (v === false) return "no";
  return "";
}
