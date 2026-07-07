// app/success/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Copy, Download, Loader2 } from 'lucide-react';

interface OptimizationResult {
  optimized_resume: string;
  keywords_added: string[];
  formatting_tips: string[];
  match_score: number;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const resume = localStorage.getItem('jobmatch_pending_resume');
    const jobDescription = localStorage.getItem('jobmatch_pending_job');

    if (!sessionId) {
      setError('Missing Stripe session information.');
      setLoading(false);
      return;
    }

    if (!resume || !jobDescription) {
      setError('We could not find your saved resume or job description. Please return home and try again.');
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

        if (!response.ok) {
          throw new Error(data.error || 'Failed to optimize resume');
        }

        setResult(data);
        localStorage.removeItem('jobmatch_pending_resume');
        localStorage.removeItem('jobmatch_pending_job');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    optimizeResume();
  }, [searchParams]);

  const copyToClipboard = async () => {
    if (!result) return;

    await navigator.clipboard.writeText(result.optimized_resume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadResume = () => {
    if (!result) return;

    const file = new Blob([result.optimized_resume], { type: 'text/plain' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'optimized_resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getScoreClass = (score: number) => {
    if (score >= 80) return 'from-emerald-400 to-green-500';
    if (score >= 60) return 'from-amber-400 to-orange-500';
    return 'from-rose-400 to-red-500';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 animate-spin text-cyan-400" size={40} />
          <p className="text-lg text-white">Payment complete. Optimizing your resume now...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4">
        <div className="w-full max-w-xl rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8 text-center backdrop-blur-xl">
          <p className="mb-4 text-lg text-rose-200">{error}</p>
          <a href="/" className="text-cyan-300 transition hover:text-cyan-200">
            ← Back to JobMatch AI
          </a>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
        <p className="text-white">No results found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-28 right-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 backdrop-blur">
            <CheckCircle size={16} />
            Payment successful
          </div>
          <h1 className="text-4xl font-bold text-white">Your optimized resume is ready</h1>
          <p className="mt-3 text-slate-300">Review the ATS score, keywords, and improved resume below.</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
          <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">ATS Match Score</h2>
              <p className="text-sm text-slate-400">How well your optimized resume aligns with the role</p>
            </div>
            <div className={`bg-gradient-to-r ${getScoreClass(result.match_score)} bg-clip-text text-5xl font-bold text-transparent`}>
              {result.match_score}%
            </div>
          </div>

          <div className="mb-8">
            <h3 className="mb-3 text-lg font-semibold text-white">Keywords Added</h3>
            <div className="flex flex-wrap gap-2">
              {result.keywords_added.map((keyword, index) => (
                <span
                  key={index}
                  className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="mb-3 text-lg font-semibold text-white">Formatting Tips</h3>
            <ul className="space-y-2 text-slate-300">
              {result.formatting_tips.map((tip, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-semibold text-white">Optimized Resume</h3>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
                >
                  <Copy size={16} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={downloadResume}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:from-cyan-400 hover:to-indigo-400"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>

            <div className="max-h-[32rem] overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <pre className="whitespace-pre-wrap text-sm leading-6 text-slate-200">
                {result.optimized_resume}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
