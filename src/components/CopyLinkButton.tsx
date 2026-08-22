'use client';
import { useState } from 'react';
import { Link as LinkIcon, Check } from 'lucide-react';

export default function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="rounded-lg bg-[#1a1a1a] p-2.5 text-[#888] transition-colors hover:bg-[#222] hover:text-white"
      title="Copy link"
    >
      {copied ? <Check className="h-4 w-4 text-[#B6FF00]" /> : <LinkIcon className="h-4 w-4" />}
    </button>
  );
}
