// app/success/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Copy, Download, Loader2, BarChart3, ArrowLeft } from 'lucide-react';

interface OptimizationResult {
  optimized_resume: string;
  keywords_added: string[];
  formatting_tips: string[];
  match_score: number;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const resume = localStorage.getItem('quantresume_pending_resume');
    const jobDescription = localStorage.getItem('quantresume_pending_job');

    if (!sessionId) {
      setError('Session verification pending. Please check your email or refresh.');
      setLoading(false);
      return;
    }

    if (!resume || !jobDescription) {
      setError('Data retrieval failed. Please return home and try again.');
      setLoading(false);
      return;
    }

    const optimizeResume = async () => {
      try {
        const response = await fetch('/api/optimize-resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resume, jobDescription }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Optimization engine failed.');

        setResult(data);
        localStorage.removeItem('quantresume_pending_resume');
        localStorage.removeItem('quantresume_pending_job');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    optimizeResume();
  }, [searchParams]);

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.optimized_resume);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white">
        <Loader2 className="mb-6 animate-spin text-emerald-400" size={48} />
        <h2 className="text-2xl font-bold">Processing Analysis...</h2>
        <p className="mt-2 text-slate-400">QuantResume is surgically optimizing your data.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-xl rounded-3xl border border-rose-500/30 bg-rose-500/10 p-10 text-center backdrop-blur-xl">
          <p className="mb-6 text-xl text-rose-200">{error}</p>
          <a href="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors">
            <ArrowLeft size={20} />
            Return to QuantResume
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-16 px-4 text-slate-50">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
            <CheckCircle size={16} />
            Optimization Complete
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Your Quant Analysis</h1>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Score Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <h3 className="text-sm font-medium uppercase tracking-wider text-slate-500">ATS Match Score</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-6xl font-black text-emerald-400">{result?.match_score}</span>
                <span className="text-2xl font-bold text-slate-600">%</span>
              </div>
              <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                Your resume is now statistically aligned with the target job description.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <h3 className="text-sm font-medium uppercase tracking-wider text-slate-500">Keywords Injected</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {result?.keywords_added.map((kw, i) => (
                  <span key={i} className="rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Resume Card */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl h-full">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold">Optimized Output</h3>
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 transition-all hover:bg-emerald-400"
                >
                  <Copy size={16} />
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>
              </div>
              <div className="rounded-2xl bg-slate-900/80 p-6 border border-white/5">
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-300">
                  {result?.optimized_resume}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-emerald-400" size={48} />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
