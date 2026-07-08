// app/success/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Copy, Loader2, FileText, Mail, ArrowLeft, MessageSquare, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

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

  const downloadAsPDF = () => {
    if (!result) return;
    
    const doc = new jsPDF();
    const title = activeTab === 'resume' ? 'Optimized Resume' : activeTab === 'letter' ? 'Cover Letter' : 'Interview Prep';
    const content = activeTab === 'resume' ? result.optimized_resume : activeTab === 'letter' ? result.cover_letter : result.interview_prep.map(q => `Q: ${q.question}\nA: ${q.talking_points}`).join('\n\n');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, 20, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    // Split text to fit page width
    const splitText = doc.splitTextToSize(content, 170);
    doc.text(splitText, 20, 30);
    
    doc.save(`QuantResume_${activeTab}.pdf`);
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
                      className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <Copy size={14} />
                      {copied ? 'Copied!' : 'Copy Text'}
                    </button>
                    <button
                      onClick={downloadAsPDF}
                      className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                    >
                      <Download size={14} />
                      Download PDF
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900/50 p-8 border border-white/5 min-h-[500px]">
                  {activeTab === 'interview' ? (
                    <div className="space-y-8">
                      {result?.interview_prep.map((item, i) => (
                        <div key={i} className="border-b border-white/5 pb-6 last:border-0">
                          <h4 className="text-emerald-400 font-bold mb-2 flex gap-2">
                            <span className="text-slate-500">Q{i+1}:</span>
                            {item.question}
                          </h4>
                          <p className="text-sm text-slate-400 leading-relaxed pl-8 italic">
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
            
            <div className="mt-8 text-center">
              <a href="/" className="text-sm font-bold text-slate-500 hover:text-emerald-400 transition-colors">
                ← Start New Optimization
              </a>
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
