// app/page.tsx
'use client';

import { useState } from 'react';
import { Copy, Download, Loader, Sparkles, CheckCircle } from 'lucide-react';

interface OptimizationResult {
  optimized_resume: string;
  keywords_added: string[];
  formatting_tips: string[];
  match_score: number;
}

export default function Home() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleOptimize = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setError('Please fill in both fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/optimize-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription }),
      });

      if (!response.ok) {
        throw new Error('Failed to optimize resume');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.optimized_resume);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadResume = () => {
    if (result) {
      const element = document.createElement('a');
      const file = new Blob([result.optimized_resume], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'optimized_resume.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-green-600';
    if (score >= 60) return 'from-amber-500 to-orange-600';
    return 'from-rose-500 to-red-600';
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Sparkles className="text-cyan-400 animate-pulse" size={36} />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              JobMatch AI
            </h1>
            <div className="relative">
              <Sparkles className="text-blue-400 animate-pulse" size={36} />
            </div>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light">
            AI-powered resume optimization to pass ATS systems and land your next role
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 backdrop-blur-sm animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-1 h-1 rounded-full bg-rose-400"></div>
              {error}
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Resume Input */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
            <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300">
              <label className="block text-white font-semibold mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                Your Resume
              </label>
              <textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Paste your resume here..."
                className="w-full h-72 p-4 bg-slate-900/50 text-white placeholder-slate-500 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 resize-none transition-all duration-300 backdrop-blur"
              />
              <p className="text-xs text-slate-400 mt-3 font-medium">
                {resume.length} characters
              </p>
            </div>
          </div>

          {/* Job Description Input */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
            <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
              <label className="block text-white font-semibold mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-72 p-4 bg-slate-900/50 text-white placeholder-slate-500 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none transition-all duration-300 backdrop-blur"
              />
              <p className="text-xs text-slate-400 mt-3 font-medium">
                {jobDescription.length} characters
              </p>
            </div>
          </div>
        </div>

        {/* Optimize Button */}
        <div className="flex justify-center mb-12">
          <button
            onClick={handleOptimize}
            disabled={loading}
            className="group relative px-8 py-4 font-semibold text-white rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 group-hover:from-cyan-500 group-hover:to-blue-500 transition-all duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="relative flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Optimizing...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Optimize Resume
                </>
              )}
            </div>
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Match Score Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">ATS Match Score</h3>
                    <p className="text-slate-400">How well your resume matches the job</p>
                  </div>
                  <div className={`text-6xl font-bold bg-gradient-to-r ${getScoreColor(result.match_score)} bg-clip-text text-transparent`}>
                    {result.match_score}%
                  </div>
                </div>
              </div>
            </div>

            {/* Keywords Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
                <h3 className="text-lg font-semibold text-white mb-4">Keywords Added</h3>
                <div className="flex flex-wrap gap-2">
                  {result.keywords_added.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 text-sm rounded-full border border-cyan-500/30 backdrop-blur-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Formatting Tips Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300">
                <h3 className="text-lg font-semibold text-white mb-4">Formatting Tips</h3>
                <ul className="space-y-2">
                  {result.formatting_tips.map((tip, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-300">
                      <CheckCircle className="text-cyan-400 flex-shrink-0 mt-0.5" size={18} />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Optimized Resume Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Optimized Resume</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-200 rounded-lg transition-all duration-300 flex items-center gap-2 border border-slate-600/50 hover:border-cyan-500/50"
                    >
                      <Copy size={18} />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={downloadResume}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg transition-all duration-300 flex items-center gap-2"
                    >
                      <Download size={18} />
                      Download
                    </button>
                  </div>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 max-h-96 overflow-y-auto backdrop-blur">
                  <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">
                    {result.optimized_resume}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}