/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { BookOpen, Code2, Copy, CheckCircle2, ChevronRight, Terminal, Cloud } from 'lucide-react';

// @ts-ignore
import readmeRaw from '../README.md?raw';
// @ts-ignore
import tfMainRaw from '../terraform/main.tf?raw';
// @ts-ignore
import tfVarsRaw from '../terraform/variables.tf?raw';
// @ts-ignore
import tfOutRaw from '../terraform/outputs.tf?raw';
// @ts-ignore
import pyTrainRaw from '../ml-pipeline/train.py?raw';
// @ts-ignore
import pyReqsRaw from '../ml-pipeline/requirements.txt?raw';

type ActiveViewType = 'readme' | 'repo';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveViewType>('readme');
  const [activeFile, setActiveFile] = useState<string>('terraform/main.tf');
  const [copyState, setCopyState] = useState<Record<string, boolean>>({});

  const files = {
    'terraform/main.tf': tfMainRaw,
    'terraform/variables.tf': tfVarsRaw,
    'terraform/outputs.tf': tfOutRaw,
    'ml-pipeline/train.py': pyTrainRaw,
    'ml-pipeline/requirements.txt': pyReqsRaw,
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyState({ ...copyState, [id]: true });
    setTimeout(() => {
      setCopyState({ ...copyState, [id]: false });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex overflow-hidden flex-col h-screen">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Cloud size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">MLOps Showcase</h1>
            <p className="text-xs text-slate-500 font-medium">AWS S3 â DVC â MLFlow â Terraform</p>
          </div>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveView('readme')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'readme' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen size={16} />
            <span>Instructions</span>
          </button>
          <button
            onClick={() => setActiveView('repo')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'repo' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 size={16} />
            <span>Code Browser</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex">
        {activeView === 'readme' ? (
          <div className="flex-1 overflow-y-auto bg-slate-50">
            <div className="max-w-4xl mx-auto py-10 px-8">
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-10 prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-blue-600 prose-pre:bg-slate-900 prose-pre:text-slate-50">
                <ReactMarkdown>{readmeRaw}</ReactMarkdown>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-slate-100 border-r border-slate-200 flex flex-col shrink-0">
              <div className="p-4 uppercase tracking-wider text-xs font-semibold text-slate-500 mb-2">
                Project Files
              </div>
              <div className="flex-1 overflow-y-auto px-2 space-y-1">
                {Object.keys(files).map((filename) => (
                  <button
                    key={filename}
                    onClick={() => setActiveFile(filename)}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors text-left ${
                      activeFile === filename
                        ? 'bg-blue-100 text-blue-800 font-medium'
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Terminal size={14} className={activeFile === filename ? 'text-blue-600' : 'text-slate-400'} />
                    <span className="truncate">{filename}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Code Viewer */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
              <div className="border-b border-slate-100 bg-slate-50 py-3 px-6 flex justify-between items-center group">
                <div className="flex items-center text-sm font-mono text-slate-600">
                  <span className="text-slate-400">repo/</span>
                  <span className="font-semibold">{activeFile}</span>
                </div>
                
                <button 
                  onClick={() => copyToClipboard(files[activeFile as keyof typeof files], activeFile)}
                  className="flex items-center space-x-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-md shadow-sm"
                >
                  {copyState[activeFile] ? (
                    <><CheckCircle2 size={14} className="text-green-500"/><span>Copied!</span></>
                  ) : (
                    <><Copy size={14} /><span>Copy Code</span></>
                  )}
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4 bg-slate-900">
                <pre className="text-slate-50 font-mono text-sm leading-relaxed p-4">
                  <code>{files[activeFile as keyof typeof files]}</code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
