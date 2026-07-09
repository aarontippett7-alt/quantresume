// app/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
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
  Activity,
  Upload,
  AlertCircle
} from 'lucide-react';

export default function Home() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }

    setParsing(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to parse PDF');

      setResume(data.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read PDF. Please paste text manually.');
    } finally {
      setParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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
          <div className="mx-auto mb-8 max-w-4xl rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-rose-200 backdrop-blur-sm flex items-center gap-3">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Input Areas */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition-all hover:border-emerald-500/30 hover:bg-white/[0.07] backdrop-blur-xl shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-emerald-500/15 p-3 text-emerald-400">
                  <FileText size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Source Resume</h2>
                  <p className="text-sm text-slate-400">Paste or upload your PDF</p>
                </div>
              </div>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={parsing}
                className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
              >
                {parsing ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {parsing ? 'Reading...' : 'Upload PDF'}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept=".pdf" 
                className="hidden" 
              />
            </div>

            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume text here..."
              className="h-96 w-full rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm text-slate-200 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
            />
            
            {/* Live Tease Badge */}
            <div className="mt-4 flex items-center justify-between">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${resume.length > 50 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-white/5'}`}>
                <Activity size={12} />
                {resume.length > 50 ? 'Schema Ready' : 'Awaiting Data'}
              </div>
              <span className="text-[10px] text-slate-600 font-mono">{resume.length} chars</span>
            </div>
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

            {/* Live Tease Badge */}
            <div className="mt-4 flex items-center justify-between">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${jobDescription.length > 50 ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-slate-800 text-slate-500 border-white/5'}`}>
                <Activity size={12} />
                {jobDescription.length > 50 ? 'Target Locked' : 'Awaiting Parameters'}
              </div>
              <span className="text-[10px] text-slate-600 font-mono">{jobDescription.length} chars</span>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-center gap-8">
          <div className="flex flex-col items-center gap-4">
             <button
              onClick={handleCheckout}
              disabled={loading || parsing}
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
          <h2 className="mb-12 text-center text-3xl font-bold text-white">The Quant Methodology</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-8">
              <h3 className="mb-3 font-bold text-emerald-400">Keyword Density Mapping</h3>
              <p className="text-sm text-slate-400 leading-relaxed">We don't just add words. We analyze the job description's semantic weight and match the frequency the ATS algorithms expect.</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-8">
              <h3 className="mb-3 font-bold text-cyan-400">Schema Alignment</h3>
              <p className="text-sm text-slate-400 leading-relaxed">We structure your experience data so the parser reads it correctly, ensuring your achievements aren't lost in translation.</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-8">
              <h3 className="mb-3 font-bold text-blue-400">Impact Quantifying</h3>
              <p className="text-sm text-slate-400 leading-relaxed">We transform "tasks performed" into "ROI delivered," using the specific metrics and KPIs relevant to the target role.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-32 mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">Director's FAQ</h2>
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
              <h4 className="mb-2 font-bold text-white">Is my data safe?</h4>
              <p className="text-sm text-slate-400">Yes. We use enterprise-grade encryption. We do not store your resume data after the session is complete.</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
              <h4 className="mb-2 font-bold text-white">Why $15?</h4>
              <p className="text-sm text-slate-400">Most resume services charge $300+. We use surgical AI to deliver the same results instantly for the price of a lunch.</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
              <h4 className="mb-2 font-bold text-white">What if I'm not happy?</h4>
              <p className="text-sm text-slate-400">If you don't see a significant increase in your ATS match score, email us at info@tippett-analytics.com for a full refund.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-32 border-t border-white/5 pt-12 text-center pb-12">
          <p className="text-slate-500 text-sm">
            © 2026 QuantResume. A product of <span className="text-slate-300 font-semibold">Tippett Analytics LLC</span>.
          </p>
          <p className="mt-2 text-slate-600 text-xs">Built in Enola, PA | info@tippett-analytics.com</p>
        </footer>
      </div>
    </div>
  );
}
