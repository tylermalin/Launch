"use client";

import { useEffect, useState } from "react";

const COUNTRIES = [
  "United States","Canada","United Kingdom","Australia","New Zealand","Ireland","Germany","France","Netherlands","Belgium","Luxembourg","Switzerland","Austria","Denmark","Sweden","Norway","Finland","Iceland","Spain","Portugal","Italy","Greece","Poland","Czechia","Slovakia","Hungary","Romania","Bulgaria","Croatia","Slovenia","Estonia","Latvia","Lithuania","Ukraine","Turkey","Israel","United Arab Emirates","Saudi Arabia","Qatar","Kuwait","Bahrain","Oman","Egypt","Morocco","South Africa","Nigeria","Kenya","Ghana","Japan","South Korea","China","Hong Kong","Taiwan","Singapore","Malaysia","Indonesia","Thailand","Vietnam","Philippines","India","Pakistan","Bangladesh","Sri Lanka","Mexico","Brazil","Argentina","Chile","Colombia","Peru","Uruguay","Costa Rica","Panama","Other",
];

const PARTICIPATION = [
  "operate hardware myself",
  "delegate to a local operator",
  "undecided",
];

export default function RegisterInterestForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    org: "",
    country: "",
    cell: "",
    participation: "",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  // Prefill the cell/region from the hex map deep-link (/presale?hex=<h3index>).
  useEffect(() => {
    const hex = new URLSearchParams(window.location.search).get("hex");
    if (hex) setForm((f) => ({ ...f, cell: hex }));
  }, []);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.country || !form.cell || !form.participation) {
      setError("Name, email, country, cell or region, and participation are required.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/15 text-2xl text-emerald-300">
          ✓
        </div>
        <p className="text-base leading-relaxed text-neutral-200">
          Recorded. This registration is non-binding and creates no obligation on either side. We will
          contact you before any sale reopens.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-4 text-3xl font-semibold tracking-tight text-white">
        Register interest in a Genesis hex.
      </h1>
      <p className="mb-8 text-[15px] leading-relaxed text-neutral-300">
        Genesis hex node sales are not open. We are working with industry partners to establish demand
        metrics for each cell, so that when sales reopen, allocation and pricing reflect measured demand
        rather than a first-come queue. If you would like to be notified, tell us which cell or region
        interests you and how you would participate. Registering interest is free, non-binding, and does
        not reserve a cell or create any right to purchase. We will notify registered parties in advance
        of any sale.
      </p>

      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <Field label="Name" required>
          <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Email" required>
          <input
            type="email"
            className={inputCls}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </Field>
        <Field label="Organization">
          <input className={inputCls} value={form.org} onChange={(e) => set("org", e.target.value)} placeholder="Optional" />
        </Field>
        <Field label="Country" required>
          <select className={inputCls} value={form.country} onChange={(e) => set("country", e.target.value)}>
            <option value="">Select…</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Cell or region of interest" required>
          <input
            className={inputCls}
            value={form.cell}
            onChange={(e) => set("cell", e.target.value)}
            placeholder="e.g. Austin, TX — or a hex ID"
          />
          <p className="mt-1 text-xs text-neutral-400">
            Prefer to point at a cell?{" "}
            <a className="text-emerald-300 underline" href="/explorer">
              Choose one on the hex map
            </a>{" "}
            and it will fill in here.
          </p>
        </Field>
        <Field label="How would you participate?" required>
          <select
            className={inputCls}
            value={form.participation}
            onChange={(e) => set("participation", e.target.value)}
          >
            <option value="">Select…</option>
            {PARTICIPATION.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Anything we should know?">
          <textarea
            className={inputCls}
            rows={3}
            maxLength={500}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Optional, 500 characters max"
          />
        </Field>

        {error && <p className="text-sm text-amber-400">{error}</p>}

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-lg bg-emerald-400 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-neutral-950 transition hover:bg-emerald-300 disabled:opacity-50"
        >
          {status === "sending" ? "Registering…" : "Register interest"}
        </button>
        <p className="text-xs text-neutral-500">
          Registering interest is free and non-binding. It does not reserve a cell or create any right to
          purchase.
        </p>
      </form>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-white/10 bg-neutral-900/60 px-3 py-2.5 text-sm text-white outline-none transition focus:border-emerald-400/60";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-400">
        {label}
        {required && <span className="text-emerald-400"> *</span>}
      </span>
      {children}
    </label>
  );
}
