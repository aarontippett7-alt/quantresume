// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { FileText, Loader2, ShieldCheck, Sparkles, Target } from 'lucide-react';

export default function Home() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedResume = localStorage.getItem('jobmatch_resume_draft');
    const savedJobDescription = localStorage.getItem('jobmatch_job_draft');

    if (savedResume) setResume(savedResume);
    if (savedJobDescription) setJobDescription(savedJobDescription);
  }, []);

  useEffect(() => {
    localStorage.setItem('jobmatch_resume_draft', resume);
  }, [resume]);

  useEffect(() => {
    localStorage.setItem('jobmatch_job_draft', jobDescription);
  }, [jobDescription]);

  const handleCheckout = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setError('Please paste both your resume and the job description.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      localStorage.setItem('jobmatch_pending_resume', resume);
      localStorage.setItem('jobmatch_pending_job', jobDescription);

      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute top-1/3 -right-16 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-white/5 px-4 py-2 text-sm text-cyan-300 backdrop-blur">
            <Sparkles size={16} />
            ATS optimization for real job applications
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
            <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
              JobMatch AI
            </span>
          </h1>

          <p className="mt-4 text-lg text-slate-300">
            Turn your resume into a role-specific, ATS-friendly version that matches the job you want.
          </p>
        </div>

        {error && (
          <div className="mx-auto mb-8 max-w-4xl rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-rose-200 backdrop-blur-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-cyan-500/15 p-2 text-cyan-300">
                <FileText size={18} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Your Resume</h2>
                <p className="text-sm text-slate-400">Paste your current resume text</p>
              </div>
            </div>

            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume here..."
              className="h-80 w-full rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            />

            <p className="mt-3 text-xs text-slate-400">{resume.length} characters</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-blue-950/20 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-indigo-500/15 p-2 text-indigo-300">
                <Target size={18} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Job Description</h2>
                <p className="text-sm text-slate-400">Paste the full posting for the role</p>
              </div>
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="h-80 w-full rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
            />

            <p className="mt-3 text-xs text-slate-400">{jobDescription.length} characters</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4">
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-950/40 transition hover:scale-[1.02] hover:from-cyan-400 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Redirecting to secure checkout...
              </>
            ) : (
              <>
                <ShieldCheck size={20} />
                Secure Checkout — $15
              </>
            )}
          </button>

          <p className="text-sm text-slate-400">
            Pay once, then get your optimized resume, ATS keywords, and formatting tips.
          </p>
        </div>
      </div>
    </div>
  );
}
