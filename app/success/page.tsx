// app/success/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Copy, Loader2, FileText, Mail, ArrowLeft, MessageSquare, Download } from 'lucide-react';

interface InterviewQuestion {
  question: string;
  talking_points: string;
}

interface OptimizationResult {
  optimized_resume: string;
  cover_letter: string;
  interview_prep: InterviewQuestion[];
  keywords_added: string[];
  formatting_tips: string[];
  match_score: number;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'resume' | 'letter' | 'interview'>('resume');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const resume = localStorage.getItem('quantresume_pending_resume');
    const jobDescription = localStorage.getItem('quantresume_pending_job');

    if (!sessionId) {
      setError('Session verification pending. Please refresh.');
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
        if (!response.ok) throw new Error(data.error || 'Optimization failed.');

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
      let text = '';
      if (activeTab === 'resume') text = result.optimized_resume;
      else if (activeTab === 'letter') text = result.cover_letter;
      else text = result.interview_prep.map(q => `Q: ${q.question}\nA: ${q.talking_points}`).join('\n\n');
      
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white">
        <Loader2 className="mb-6 animate-spin text-emerald-400" size={48} />
        <h2 className="text-2xl font-bold tracking-tight">Quant Analysis in Progress...</h2>
        <p className="mt-2 text-slate-400">Surgically engineering your career documents.</p>
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
    <div className="min-h-screen bg-slate-950 py-12 px-4 text-slate-50">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 border border-emerald-500/20">
            <CheckCircle size={16} />
            Optimization Complete
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Your Quant Results</h1>
          <div className="mt-6 flex items-center justify-center gap-8">
            <div className="text-center">
              <span className="block text-4xl font-black text-emerald-400">{result?.match_score}%</span>
              <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">ATS Match Score</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Keywords Injected</h3>
              <div className="flex flex-wrap gap-2">
                {result?.keywords_added.map((kw, i) => (
                  <span key={i} className="rounded-md bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Formatting Tips</h3>
              <ul className="space-y-3">
                {result?.formatting_tips.map((tip, i) => (
                  <li key={i} className="text-[11px] text-slate-400 leading-relaxed flex gap-2">
                    <span className="text-emerald-500">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur-xl shadow-2xl">
              <div className="flex border-b border-white/10 bg-white/5">
                <button
                  onClick={() => setActiveTab('resume')}
                  className={`flex flex-1 items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${
                    activeTab === 'resume' ? 'bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-400 hover:bg-white/5'
                  }`}
                >
                  <FileText size={18} />
                  Resume
                </button>
                <button
                  onClick={() => setActiveTab('letter')}
                  className={`flex flex-1 items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${
                    activeTab === 'letter' ? 'bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-400 hover:bg-white/5'
                  }`}
                >
                  <Mail size={18} />
                  Cover Letter
                </button>
                <button
                  onClick={() => setActiveTab('interview')}
                  className={`flex flex-1 items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${
                    activeTab === 'interview' ? 'bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-400 hover:bg-white/5'
                  }`}
                >
                  <MessageSquare size={18} />
                  Interview Prep
                </button>
              </div>

              <div className="p-8">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                    {activeTab === 'resume' ? 'Engineered Resume' : activeTab === 'letter' ? 'Surgical Cover Letter' : 'Interview Prep Kit'}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 transition-all hover:bg-emerald-400 active:scale-95"
                    >
                      <Copy size={16} />
                      {copied ? 'Copied!' : 'Copy Text'}
                    </button>
                  </div>
                </div>
                
                <div className="rounded-2xl bg-slate-900/80 p-6 border border-white/5 min-h-[400px]">
                  {activeTab === 'interview' ? (
                    <div className="space-y-8">
                      {result?.interview_prep.map((item, i) => (
                        <div key={i} className="space-y-2">
                          <h4 className="text-emerald-400 font-bold text-sm">Question {i + 1}: {item.question}</h4>
                          <p className="text-slate-300 text-sm leading-relaxed pl-4 border-l border-emerald-500/30">
                            {item.talking_points}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-300">
                      {activeTab === 'resume' ? result?.optimized_resume : result?.cover_letter}
                    </pre>
                  )}
                </div>
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
