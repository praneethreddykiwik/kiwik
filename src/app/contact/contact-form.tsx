"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { validateEmail, validateRequired, validateLength } from "@/lib/validation";
import {
  SERVICE_OPTIONS,
  COUNTRY_CODES,
  DEFAULT_COUNTRY_CODE,
  isCountryCode,
  isServiceOption,
  validateNationalNumber,
} from "@/lib/contact-options";

/**
 * Contact form.
 *
 * Every rule enforced here is enforced again in /api/contact and a third time by
 * Postgres CHECK constraints. This layer exists purely so the visitor finds out
 * before pressing Send, not because the browser can be trusted — the dropdown
 * values in particular are re-checked server-side against the shared list, so a
 * hand-rolled POST cannot slip arbitrary text past the select element.
 */

type Values = {
  name: string;
  company: string;
  email: string;
  phoneCountryCode: string;
  phone: string;
  service: string;
  projectRequirements: string;
  message: string;
};
type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = {
  name: "",
  company: "",
  email: "",
  phoneCountryCode: DEFAULT_COUNTRY_CODE,
  phone: "",
  service: "",
  projectRequirements: "",
  message: "",
};

const MESSAGE_MAX = 5000;
const REQUIREMENTS_MAX = 3000;

function validateAll(v: Values): Errors {
  const e: Errors = {};

  const name = validateRequired(v.name, "Full name") ?? validateLength(v.name, { min: 2, max: 100, label: "Full name" });
  if (name) e.name = name;

  const email = validateEmail(v.email, { label: "Email address" });
  if (email) e.email = email;

  // Optional fields are only judged once the visitor has typed something.
  if (v.company.trim()) {
    const company = validateLength(v.company, { max: 120, label: "Company name" });
    if (company) e.company = company;
  }
  if (v.phone.trim()) {
    const phone = validateNationalNumber(v.phone);
    if (phone) e.phone = phone;
    if (!isCountryCode(v.phoneCountryCode)) e.phoneCountryCode = "Choose a valid country code.";
  }
  if (v.service && !isServiceOption(v.service)) e.service = "Choose one of the listed services.";
  if (v.projectRequirements.trim()) {
    const reqs = validateLength(v.projectRequirements, { max: REQUIREMENTS_MAX, label: "Project requirements" });
    if (reqs) e.projectRequirements = reqs;
  }

  const message = validateRequired(v.message, "Message") ?? validateLength(v.message, { min: 10, max: MESSAGE_MAX, label: "Message" });
  if (message) e.message = message;

  return e;
}

export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [formError, setFormError] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const set =
    (key: keyof Values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const next = { ...values, [key]: e.target.value };
      setValues(next);
      if (touched[key]) setErrors(validateAll(next));
      if (formError) setFormError("");
    };

  const blur = (key: keyof Values) => () => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validateAll(values));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    const found = validateAll(values);
    setErrors(found);
    setTouched(Object.fromEntries(Object.keys(EMPTY).map((k) => [k, true])) as Record<keyof Values, boolean>);
    if (Object.keys(found).length > 0) {
      setFormError("Please correct the highlighted fields.");
      return;
    }

    setFormError("");
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        setFormError(data.error || "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      setStatus("sent");
      setValues(EMPTY);
      setTouched({});
    } catch {
      setFormError("Network error. Please check your connection and try again.");
      setStatus("idle");
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="rounded-3xl border border-emerald-500/25 bg-emerald-500/5 p-10 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-emerald-400" />
        <h2 className="text-xl font-serif font-bold text-text-primary">Inquiry received</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Thanks for getting in touch — our team will get back to you at the address you gave us.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-full border border-glass-border px-5 py-2 text-xs font-bold text-text-primary transition-colors hover:border-accent-blue/40"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  const labelCls = "block text-[11px] font-mono font-bold uppercase tracking-wider text-text-muted";
  const boxCls = (invalid: boolean) =>
    `w-full rounded-xl border bg-bg-secondary px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors ${
      invalid ? "border-rose-500/60 focus:border-rose-500" : "border-glass-border focus:border-accent-blue"
    }`;

  const errorFor = (key: keyof Values) =>
    errors[key] ? (
      <p id={`contact-${key}-error`} role="alert" className="text-[11px] font-semibold text-rose-400">
        {errors[key]}
      </p>
    ) : null;

  const textField = (
    key: keyof Values,
    label: string,
    opts: { type?: string; required?: boolean; placeholder?: string; maxLength?: number; inputMode?: "text" | "tel" | "email" } = {}
  ) => (
    <div className="space-y-1.5">
      <label htmlFor={`contact-${key}`} className={labelCls}>
        {label} {opts.required && <span className="text-rose-400">*</span>}
      </label>
      <input
        id={`contact-${key}`}
        name={key}
        type={opts.type || "text"}
        inputMode={opts.inputMode}
        value={values[key]}
        onChange={set(key)}
        onBlur={blur(key)}
        required={opts.required}
        maxLength={opts.maxLength}
        placeholder={opts.placeholder}
        aria-invalid={Boolean(errors[key])}
        aria-describedby={errors[key] ? `contact-${key}-error` : undefined}
        className={boxCls(Boolean(errors[key]))}
      />
      {errorFor(key)}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Honeypot — hidden from sight and from assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {textField("name", "Full name", { required: true, maxLength: 100, placeholder: "Ada Lovelace" })}
        {textField("company", "Company name", { maxLength: 120, placeholder: "Acme Inc." })}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {textField("email", "Email address", {
          required: true,
          type: "email",
          inputMode: "email",
          maxLength: 254,
          placeholder: "you@company.com",
        })}

        {/* Phone: dialling code and national number are separate values, so the
            code is never typed twice and the stored number is unambiguous. */}
        <div className="space-y-1.5">
          <label htmlFor="contact-phone" className={labelCls}>
            Phone number
          </label>
          <div className="flex gap-2">
            <select
              id="contact-phoneCountryCode"
              name="phoneCountryCode"
              aria-label="Country dialling code"
              value={values.phoneCountryCode}
              onChange={set("phoneCountryCode")}
              className={`shrink-0 rounded-xl border bg-bg-secondary px-3 py-3 text-sm text-text-primary outline-none transition-colors ${
                errors.phoneCountryCode ? "border-rose-500/60" : "border-glass-border focus:border-accent-blue"
              }`}
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              value={values.phone}
              onChange={set("phone")}
              onBlur={blur("phone")}
              maxLength={20}
              placeholder="98765 43210"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "contact-phone-error" : undefined}
              className={boxCls(Boolean(errors.phone))}
            />
          </div>
          {errorFor("phone")}
          {errorFor("phoneCountryCode")}
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-service" className={labelCls}>
          Service interested in
        </label>
        <select
          id="contact-service"
          name="service"
          value={values.service}
          onChange={set("service")}
          onBlur={blur("service")}
          aria-invalid={Boolean(errors.service)}
          className={boxCls(Boolean(errors.service))}
        >
          <option value="">Select a service…</option>
          {SERVICE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errorFor("service")}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-projectRequirements" className={labelCls}>
          Project requirements
        </label>
        <textarea
          id="contact-projectRequirements"
          name="projectRequirements"
          rows={4}
          value={values.projectRequirements}
          onChange={set("projectRequirements")}
          onBlur={blur("projectRequirements")}
          maxLength={REQUIREMENTS_MAX}
          placeholder="Tell us about scope, timeline, and goals…"
          aria-invalid={Boolean(errors.projectRequirements)}
          className={`${boxCls(Boolean(errors.projectRequirements))} resize-y leading-relaxed`}
        />
        <div className="flex items-start justify-between gap-4">
          {errorFor("projectRequirements") ?? <span />}
          <span className="shrink-0 text-[11px] font-mono text-text-muted">
            {values.projectRequirements.trim().length}/{REQUIREMENTS_MAX}
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-message" className={labelCls}>
          Message <span className="text-rose-400">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          value={values.message}
          onChange={set("message")}
          onBlur={blur("message")}
          required
          maxLength={MESSAGE_MAX}
          placeholder="Anything else we should know?"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : "contact-message-count"}
          className={`${boxCls(Boolean(errors.message))} resize-y leading-relaxed`}
        />
        <div className="flex items-start justify-between gap-4">
          {errorFor("message") ?? <span />}
          <span id="contact-message-count" className="shrink-0 text-[11px] font-mono text-text-muted">
            {values.message.trim().length}/{MESSAGE_MAX}
          </span>
        </div>
      </div>

      {formError && (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-500/25 bg-rose-500/5 p-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
          <p className="text-xs font-semibold text-rose-300">{formError}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-blue px-6 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          {status === "sending" ? "Sending…" : "Send inquiry"}
        </button>
        <p className="text-[11px] text-text-muted">
          We use what you send only to reply to you. Required fields are marked
          <span className="text-rose-400"> *</span>.
        </p>
      </div>
    </form>
  );
}
