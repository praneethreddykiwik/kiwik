"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { validateEmail, validatePhone, validateRequired, validateLength } from "@/lib/validation";

/**
 * Contact form.
 *
 * Every rule enforced here is enforced again in /api/contact and a third time by
 * Postgres CHECK constraints. This layer exists purely so the visitor finds out
 * before pressing Send, not because the browser can be trusted.
 */

type Values = { name: string; email: string; phone: string; company: string; subject: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = { name: "", email: "", phone: "", company: "", subject: "", message: "" };

const MESSAGE_MAX = 5000;

function validateAll(v: Values): Errors {
  const e: Errors = {};
  const name = validateRequired(v.name, "Name") ?? validateLength(v.name, { min: 2, max: 100, label: "Name" });
  if (name) e.name = name;
  const email = validateEmail(v.email);
  if (email) e.email = email;
  // Optional: only validated once the visitor types something.
  if (v.phone.trim()) {
    const phone = validatePhone(v.phone);
    if (phone) e.phone = phone;
  }
  if (v.company.trim()) {
    const company = validateLength(v.company, { max: 120, label: "Company" });
    if (company) e.company = company;
  }
  const subject = validateRequired(v.subject, "Subject") ?? validateLength(v.subject, { min: 3, max: 150, label: "Subject" });
  if (subject) e.subject = subject;
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

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    setTouched({ name: true, email: true, phone: true, company: true, subject: true, message: true });
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
        // The server may reject a field the browser accepted; show its verdict.
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
      <div
        role="status"
        className="rounded-3xl border border-emerald-500/25 bg-emerald-500/5 p-10 text-center"
      >
        <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-emerald-400" />
        <h2 className="text-xl font-serif font-bold text-text-primary">Message received</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Thanks for getting in touch — we&apos;ll reply to the address you gave us.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-full border border-glass-border px-5 py-2 text-xs font-bold text-text-primary hover:border-accent-blue/40 transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  const field = (
    key: keyof Values,
    label: string,
    opts: { type?: string; required?: boolean; placeholder?: string; maxLength?: number; inputMode?: "text" | "tel" | "email" } = {}
  ) => {
    const invalid = Boolean(errors[key]);
    return (
      <div className="space-y-1.5">
        <label htmlFor={`contact-${key}`} className="block text-[11px] font-mono font-bold uppercase tracking-wider text-text-muted">
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
          aria-invalid={invalid}
          aria-describedby={invalid ? `contact-${key}-error` : undefined}
          className={`w-full rounded-xl border bg-bg-secondary px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors ${
            invalid ? "border-rose-500/60 focus:border-rose-500" : "border-glass-border focus:border-accent-blue"
          }`}
        />
        {invalid && (
          <p id={`contact-${key}-error`} role="alert" className="text-[11px] font-semibold text-rose-400">
            {errors[key]}
          </p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Honeypot. Hidden from sight and from screen readers, so only a bot
          filling every field it finds will populate it. */}
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
        {field("name", "Your name", { required: true, maxLength: 100, placeholder: "Ada Lovelace" })}
        {field("email", "Email", { required: true, type: "email", inputMode: "email", maxLength: 254, placeholder: "you@company.com" })}
        {field("phone", "Phone (optional)", { type: "tel", inputMode: "tel", maxLength: 32, placeholder: "+91 98765 43210" })}
        {field("company", "Company (optional)", { maxLength: 120, placeholder: "Acme Inc." })}
      </div>

      {field("subject", "Subject", { required: true, maxLength: 150, placeholder: "What's this about?" })}

      <div className="space-y-1.5">
        <label htmlFor="contact-message" className="block text-[11px] font-mono font-bold uppercase tracking-wider text-text-muted">
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
          placeholder="Tell us what you're building, and what you need."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : "contact-message-count"}
          className={`w-full resize-y rounded-xl border bg-bg-secondary px-4 py-3 text-sm leading-relaxed text-text-primary placeholder:text-text-muted outline-none transition-colors ${
            errors.message ? "border-rose-500/60 focus:border-rose-500" : "border-glass-border focus:border-accent-blue"
          }`}
        />
        <div className="flex items-start justify-between gap-4">
          {errors.message ? (
            <p id="contact-message-error" role="alert" className="text-[11px] font-semibold text-rose-400">
              {errors.message}
            </p>
          ) : (
            <span />
          )}
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

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-blue px-6 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        <Send className="h-4 w-4" />
        {status === "sending" ? "Sending…" : "Send message"}
      </button>

      <p className="text-[11px] text-text-muted">
        We use what you send only to reply to you. Required fields are marked
        <span className="text-rose-400"> *</span>.
      </p>
    </form>
  );
}
