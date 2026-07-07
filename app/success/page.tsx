// app/success/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Copy, Download, Loader2 } from 'lucide-react';

interface OptimizationResult {
  optimized_resume: string;
  keywords_added: string[];
  formatting_tips: string[];
  match_score: number;
}

// We move the logic into a sub-component
function SuccessContent() {
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
      setError('We could not find your saved resume or job description.');
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
        if (!response.ok) throw new Error(data.error || 'Failed to optimize');

        setResult(data);
        localStorage.removeItem('jobmatch_pending_resume');
        localStorage.removeItem('jobmatch_pending_job');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    optimizeResume();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 animate-spin text-cyan-400" size={40} />
          <p className="text-lg text-white">Payment complete. Optimizing your resume now...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-xl rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8 text-center">
          <p className="mb-4 text-lg text-rose-200">{error}</p>
          <a href="/" className="text-cyan-300">← Back to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Your Optimized Resume</h1>
          <div className="mt-4 text-5xl font-bold text-cyan-400">{result?.match_score}% Match</div>
        </div>
        
        <div className="rounded-2xl bg-white/5 p-6 border border-white/10 shadow-2xl">
          <pre className="whitespace-pre-wrap text-slate-200 font-mono text-sm leading-relaxed">
            {result?.optimized_resume}
          </pre>
        </div>
      </div>
    </div>
  );
}

// The main page component wraps the content in Suspense
export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-cyan-400" size={40} />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}