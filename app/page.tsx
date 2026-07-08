// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { FileText, Loader2, ShieldCheck, Sparkles, Target, BarChart3, Lock, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedResume = localStorage.getItem('quantresume_resume_draft');
    const savedJobDescription = localStorage.getItem('quantresume_job_draft');
    if (savedResume) setResume(savedResume);
    if (savedJobDescription) setJobDescription(savedJobDescription);
  }, []);

  useEffect(() => {
    localStorage.setItem('quantresume_resume_draft', resume);
  }, [resume]);

  useEffect(() => {
    localStorage.setItem('quantresume_job_draft', jobDescription);
  }, [jobDescription]);

  const handleCheckout = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setError('Please paste both your resume and the job description.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      localStorage.setItem('quantresume_pending_resume', resume);
      localStorage.setItem('quantresume_pending_job', jobDescription);

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
    <div className="min-h-screen overflow-hidden bg-slate-950 text-slate-50 font-sans">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-sm font-medium text-emerald-400 backdrop-blur">
            <BarChart3 size={16} />
            Surgical ATS optimization based on hiring data
          </div>

          <h1 className="text-6xl font-extrabold tracking-tight sm:text-7xl">
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              QuantResume
            </span>
          </h1>

          <p className="mt-6 text-xl text-slate-400 leading-relaxed">
            Data-driven resume engineering. We analyze the job requirements and surgically inject the precise keywords and formatting needed to pass the algorithm.
          </p>
        </div>

        {error && (
          <div className="mx-auto mb-8 max-w-4xl rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-rose-200 backdrop-blur-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Resume Input */}
          <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition-all hover:border-emerald-500/30 hover:bg-white/[0.07] backdrop-blur-xl shadow-2xl">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-xl bg-emerald-500/15 p-3 text-emerald-400">
                <FileText size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Source Resume</h2>
                <p className="text-sm text-slate-400">Paste your current experience data</p>
              </div>
            </div>

            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume text here..."
              className="h-96 w-full rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm text-slate-200 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
            />
          </div>

          {/* Job Description Input */}
          <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition-all hover:border-cyan-500/30 hover:bg-white/[0.07] backdrop-blur-xl shadow-2xl">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-xl bg-cyan-500/15 p-3 text-cyan-400">
                <Target size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Target Parameters</h2>
                <p className="text-sm text-slate-400">Paste the full job description</p>
              </div>
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job requirements here..."
              className="h-96 w-full rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm text-slate-200 placeholder:text-slate-600 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all font-mono"
            />
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-center gap-8">
          <div className="flex flex-col items-center gap-4">
             <button
              onClick={handleCheckout}
              disabled={loading}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-emerald-500 px-10 py-5 text-lg font-bold text-slate-950 transition-all hover:scale-[1.02] hover:bg-emerald-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Initializing Quant Engine...
                </>
              ) : (
                <>
                  <ShieldCheck size={24} />
                  Optimize Everything — $15
                </>
              )}
            </button>
            <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-slate-500">
              <span className="flex items-center gap-1.5"><Lock size={12} /> Secure Stripe Payment</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={12} /> Quant Guarantee</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mt-8 border-t border-white/5 pt-12">
            <div className="text-center">
              <h3 className="text-emerald-400 font-bold mb-2">1. Optimized Resume</h3>
              <p className="text-sm text-slate-500">Surgical keyword injection to pass the ATS algorithm.</p>
            </div>
            <div className="text-center">
              <h3 className="text-emerald-400 font-bold mb-2">2. Cover Letter</h3>
              <p className="text-sm text-slate-500">Achievement-mapped letter targeting job pain points.</p>
            </div>
            <div className="text-center">
              <h3 className="text-emerald-400 font-bold mb-2">3. Interview Prep</h3>
              <p className="text-sm text-slate-500">Top 5 questions & talking points for this specific role.</p>
            </div>
          </div>

          {/* Professional Footer */}
          <footer className="mt-24 w-full border-t border-white/5 pt-8 pb-12 text-center">
            <p className="text-sm text-slate-500">
              © 2026 QuantResume. A product of <span className="text-slate-400 font-semibold">Tippett Analytics LLC</span>.
            </p>
            <p className="mt-2 text-[10px] text-slate-600 uppercase tracking-[0.2em]">
              Data-Driven Career Engineering • Built in Enola, PA
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
