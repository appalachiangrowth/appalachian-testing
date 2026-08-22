"use client";

import { useState, useRef } from "react";
import { uploadFile } from "@/lib/admin-hooks";

// ─── Reusable Table Wrapper ───
export function AdminTable({
  title,
  children,
  actions,
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0A0A0A]">
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-6 py-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

// ─── Empty State ───
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="px-6 py-16 text-center text-sm text-neutral-500">{message}</div>
  );
}

// ─── Form Input ───
export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-medium text-neutral-400">
        {label}
      </label>
      {children}
    </div>
  );
}

export const inputCls =
  "w-full rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#111] px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-[#B6FF00] focus:outline-none focus:ring-1 focus:ring-[#B6FF00]/30";

export const textareaCls =
  "w-full rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#111] px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-[#B6FF00] focus:outline-none focus:ring-1 focus:ring-[#B6FF00]/30 min-h-[100px] resize-y";

// ─── Buttons ───
export function BtnPrimary({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="inline-flex items-center justify-center rounded-lg bg-[#B6FF00] px-4 py-2.5 text-sm font-semibold text-[#050505] transition-all hover:bg-[#a3e600] hover:shadow-[0_0_15px_rgba(182,255,0,0.2)] active:scale-[0.98] disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export function BtnSecondary({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="inline-flex items-center justify-center rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#111] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1A1A1A]"
    >
      {children}
    </button>
  );
}

export function BtnDanger({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="inline-flex items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
    >
      {children}
    </button>
  );
}

// ─── Modal / Dialog ───
export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div
        className={`relative z-10 max-h-[90vh] overflow-y-auto rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0A0A0A] p-6 ${
          wide ? "w-full max-w-3xl" : "w-full max-w-lg"
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-[#1A1A1A] hover:text-white"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Image Upload ───
export function ImageUpload({
  value,
  onChange,
  label,
  category = "general",
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
  category?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadFile(file, category);
      onChange(res.url);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Field label={label}>
      {value && (
        <div className="mb-2 relative h-32 w-full overflow-hidden rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#111]">
          <img src={value} alt="Preview" className="h-full w-full object-contain" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded bg-black/60 p-1 text-white/70 hover:text-red-400"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={inputCls + " cursor-pointer text-center !py-3"}
      >
        {uploading ? "Uploading..." : value ? "Change Image" : "Upload Image"}
      </button>
    </Field>
  );
}

// ─── Toggle Switch ───
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? "bg-[#B6FF00]" : "bg-[#333]"
        }`}
      >
        <div
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5.5" : "translate-x-0.5"
          }`}
        />
      </div>
      <span className="text-sm text-neutral-300">{label}</span>
    </label>
  );
}

// ─── Confirm Dialog ───
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  message,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Confirm">
      <p className="mb-6 text-sm text-neutral-300">{message}</p>
      <div className="flex justify-end gap-2">
        <BtnSecondary onClick={onClose}>Cancel</BtnSecondary>
        <BtnDanger onClick={onConfirm}>Delete</BtnDanger>
      </div>
    </Modal>
  );
}

// ─── Status Badge ───
export function StatusBadge({
  published,
}: {
  published: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        published
          ? "bg-green-500/10 text-green-400"
          : "bg-yellow-500/10 text-yellow-400"
      }`}
    >
      {published ? "Published" : "Draft"}
    </span>
  );
}

// ─── Sortable Number Input ───
export function SortInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value) || 0)}
      className={inputCls + " !w-24"}
      min={0}
    />
  );
}
