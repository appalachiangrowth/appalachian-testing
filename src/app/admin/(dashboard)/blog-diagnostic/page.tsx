"use client";

import { useState, useEffect, useCallback } from "react";
import { Activity, CheckCircle2, XCircle, RefreshCw, AlertTriangle } from "lucide-react";

interface QueryResult {
  name: string;
  status: "ok" | "error";
  errorCode: string | null;
  errorMessage: string | null;
  errorMeta: Record<string, unknown> | null;
  dataSummary: string | null;
}

interface DiagnosticResponse {
  timestamp: string;
  queries: QueryResult[];
}

export default function BlogDiagnosticPage() {
  const [data, setData] = useState<DiagnosticResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const runDiagnostic = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/blog-diagnostic");
      if (!res.ok) {
        if (res.status === 401) {
          setError("Unauthorized. Please log in to the Admin Panel first.");
          return;
        }
        setError(`API returned ${res.status}: ${res.statusText}`);
        return;
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    runDiagnostic();
  }, [runDiagnostic]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Blog Query Diagnostic</h2>
          <p className="text-sm text-neutral-400 mt-1">
            Tests the 3 Prisma queries used by the public /blog page individually.
            This reveals the exact MySQL/Prisma error on production.
          </p>
        </div>
        <button
          onClick={runDiagnostic}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-[#B6FF00] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#B6FF00]/80 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Run Diagnostic
        </button>
      </div>

      {/* Warning banner */}
      <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
        <div className="text-sm text-amber-200/80">
          <strong className="text-amber-300">Temporary diagnostic tool.</strong>{" "}
          This page tests your production MySQL database directly. Remove it after debugging is complete.
        </div>
      </div>

      {/* Loading */}
      {loading && !data && (
        <div className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-[#0A0A0A] px-4 py-8 text-neutral-400">
          <Activity className="h-5 w-5 animate-pulse" />
          Running 3 blog queries against production database...
        </div>
      )}

      {/* Error fetching diagnostic */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Results */}
      {data && (
        <>
          <p className="text-xs text-neutral-500">
            Ran at: {new Date(data.timestamp).toLocaleString()}
          </p>

          <div className="space-y-4">
            {data.queries.map((q, i) => (
              <div
                key={i}
                className={`rounded-lg border p-5 ${
                  q.status === "ok"
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-red-500/20 bg-red-500/5"
                }`}
              >
                {/* Status row */}
                <div className="flex items-start gap-3">
                  {q.status === "ok" ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm font-semibold text-white">{q.name}</p>

                    {q.status === "ok" && q.dataSummary && (
                      <p className="mt-2 text-sm text-emerald-300/80">{q.dataSummary}</p>
                    )}

                    {q.status === "error" && (
                      <div className="mt-3 space-y-2">
                        {/* Error Code */}
                        {q.errorCode && (
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-bold uppercase text-red-300">Error Code:</span>
                            <code className="rounded bg-red-500/10 px-2 py-0.5 font-mono text-sm text-red-200">
                              {q.errorCode}
                            </code>
                          </div>
                        )}
                        {/* Error Message */}
                        <div>
                          <span className="text-xs font-bold uppercase text-red-300">Message:</span>
                          <pre className="mt-1 whitespace-pre-wrap rounded bg-red-500/10 p-3 font-mono text-sm text-red-200 break-words">
                            {q.errorMessage}
                          </pre>
                        </div>
                        {/* Error Meta */}
                        {q.errorMeta && Object.keys(q.errorMeta).length > 0 && (
                          <div>
                            <span className="text-xs font-bold uppercase text-red-300">Meta:</span>
                            <pre className="mt-1 whitespace-pre-wrap rounded bg-red-500/10 p-3 font-mono text-xs text-red-200 break-words">
                              {JSON.stringify(q.errorMeta, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="rounded-lg border border-white/[0.06] bg-[#0A0A0A] p-4">
            <h3 className="text-sm font-bold text-white mb-2">Summary</h3>
            <p className="text-sm text-neutral-400">
              {data.queries.every((q) => q.status === "ok")
                ? "All 3 queries passed. The /blog page should work. If it still crashes, the issue may be in the rendering layer, not the database queries."
                : `${data.queries.filter((q) => q.status === "error").length} of ${data.queries.length} queries failed. The /blog page crashes because of the failing query above. Copy the error details and share them.`}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
