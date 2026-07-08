// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { 
  FileText, 
  Loader2, 
  ShieldCheck, 
  Sparkles, 
  Target, 
  BarChart3, 
  Lock, 
  CheckCircle2, 
  Mail, 
  FileCheck, 
  MessageSquare,
  Cpu,
  Zap,
  Search,
  HelpCircle
} from 'lucide-react';

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
      setError('Please provide both your resume and the job description.');
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
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
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

        {/* Value Prop Section */}
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4 text-emerald-400"><FileCheck size={32} /></div>
            <h3 className="mb-2 text-lg font-bold text-white">Optimized Resume</h3>
            <p className="text-sm text-slate-400 leading-relaxed">A surgical rewrite of your experience, specifically mapped to the job's target keywords and ATS schema.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4 text-cyan-400"><Mail size={32} /></div>
            <h3 className="mb-2 text-lg font-bold text-white">Surgical Cover Letter</h3>
            <p className="text-sm text-slate-400 leading-relaxed">A high-conversion letter that connects your achievements directly to the company's pain points.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4 text-blue-400"><MessageSquare size={32} /></div>
            <h3 className="mb-2 text-lg font-bold text-white">Interview Prep Kit</h3>
            <p className="text-sm text-slate-400 leading-relaxed">The 5 most likely questions for this role and the "Quant" talking points you need to answer them.</p>
          </div>
        </div>

        {error && (
          <div className="mx-auto mb-8 max-w-4xl rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-rose-200 backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Input Areas */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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

        {/* CTA Section */}
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
                  Preparing Checkout...
                </>
              ) : (
                <>
                  <ShieldCheck size={24} />
                  Secure Checkout — $15
                </>
              )}
            </button>
            <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><Lock size={14} /> Encrypted</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} /> One-time payment</span>
            </div>
          </div>
        </div>

        {/* Methodology Section */}
        <div className="mt-32">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white">The Quant Methodology</h2>
            <p className="mt-4 text-slate-400">How we engineer your career data for maximum impact.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="p-4">
              <div className="mb-4 text-emerald-400"><Cpu size={24} /></div>
              <h4 className="mb-2 font-bold text-white">Surgical Keyword Injection</h4>
              <p className="text-sm text-slate-400 leading-relaxed">We don't just "add words." We identify the high-frequency semantic keys the ATS is programmed to find and weave them naturally into your experience.</p>
            </div>
            <div className="p-4">
              <div className="mb-4 text-cyan-400"><Search size={24} /></div>
              <h4 className="mb-2 font-bold text-white">ATS Schema Alignment</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Modern hiring software uses specific data parsers. We structure your resume data to ensure it is read correctly, preventing "parsing errors" that hide your talent.</p>
            </div>
            <div className="p-4">
              <div className="mb-4 text-blue-400"><Zap size={24} /></div>
              <h4 className="mb-2 font-bold text-white">Impact Quantification</h4>
              <p className="text-sm text-slate-400 leading-relaxed">We transform passive task descriptions into ROI-focused achievements, using data-driven language that resonates with executive decision-makers.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-32 rounded-3xl border border-white/5 bg-white/[0.02] p-12 backdrop-blur-sm">
          <div className="mb-12 flex items-center gap-3">
            <HelpCircle className="text-emerald-400" size={28} />
            <h2 className="text-3xl font-bold text-white">Common Questions</h2>
          </div>
          <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-bold text-white">Is my data stored?</h4>
              <p className="text-sm text-slate-400 leading-relaxed">No. We prioritize your privacy. Your resume and job description are processed in real-time and are not stored in our databases after your session ends.</p>
            </div>
            <div>
              <h4 className="mb-2 font-bold text-white">What if I'm not satisfied?</h4>
              <p className="text-sm text-slate-400 leading-relaxed">We offer a 100% Quant Guarantee. If you don't see a significant improvement in your ATS match score, email us for a full refund.</p>
            </div>
            <div>
              <h4 className="mb-2 font-bold text-white">How long does it take?</h4>
              <p className="text-sm text-slate-400 leading-relaxed">The entire optimization process takes less than 60 seconds after payment. You get instant access to your full career kit.</p>
            </div>
            <div>
              <h4 className="mb-2 font-bold text-white">What format are the files in?</h4>
              <p className="text-sm text-slate-400 leading-relaxed">You can download your optimized resume, cover letter, and interview prep kit as professional PDFs or copy the text directly.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-32 border-t border-white/5 pt-16 text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-2 text-slate-400">
              <Mail size={16} />
              <a href="mailto:info@tippett-analytics.com" className="hover:text-emerald-400 transition-colors">info@tippett-analytics.com</a>
            </div>
            <p className="text-slate-500 text-sm">
              © 2026 QuantResume. A product of <span className="text-slate-300 font-semibold">Tippett Analytics LLC</span>.
            </p>
            <p className="text-slate-600 text-xs">Built in Enola, PA</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
