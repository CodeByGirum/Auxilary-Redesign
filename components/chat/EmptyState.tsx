
import React from 'react';
import { Terminal, BarChart3, FileText, Sparkles } from 'lucide-react';
import { AuxLogo } from '../Sidebar';

interface EmptyStateProps {
  onSuggestionClick: (prompt: string, modelId: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSuggestionClick }) => {
  const suggestions = [
    { icon: Terminal, label: 'Code Assistant', text: 'Debug, refactor, and optimize.', prompt: "Analyze this codebase and suggest performance improvements. Focus on memory leaks and time complexity.", color: "bg-blue-50", model: "gemini-3-pro-preview" },
    { icon: BarChart3, label: 'Data Visualization', text: 'Create charts and insights.', prompt: "Generate a React component for a sales dashboard chart using Recharts.", color: "bg-purple-50", model: "gemini-3-pro-preview" },
    { icon: FileText, label: 'Content Writer', text: 'Blogs, emails, and docs.', prompt: "Write a technical blog post about the future of Generative AI in enterprise software.", color: "bg-orange-50", model: "gemini-3-pro-preview" },
    { icon: Sparkles, label: 'Brainstorming', text: 'Generate ideas and strategies.', prompt: "Brainstorm 5 creative names for a new fitness app focused on calisthenics.", color: "bg-green-50", model: "gemini-3-pro-preview" },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-3xl animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-8"><div className="w-16 h-16 text-black dark:text-white flex items-center justify-center"><AuxLogo className="w-full h-full" /></div></div>
      <p className="text-gray-500 dark:text-gray-400 mb-12 text-center max-w-md text-lg">Supercharge your workflow. What would you like to achieve today?</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full px-4">
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => onSuggestionClick(s.prompt, s.model)} className="group relative p-6 h-40 rounded-3xl bg-white dark:bg-[#1f1f1f] border border-gray-100 dark:border-[#333] hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 shadow-sm hover:shadow-md text-left flex flex-col justify-between overflow-hidden">
            <div className={`absolute right-0 top-0 p-24 ${s.color} dark:bg-opacity-10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-10 -translate-y-10`} />
            <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-[#2a2a2a] flex items-center justify-center text-gray-900 dark:text-white mb-4 z-10"><s.icon size={20} strokeWidth={1.5} /></div>
            <div className="z-10"><h3 className="font-medium text-gray-900 dark:text-white mb-1">{s.label}</h3><p className="text-sm text-gray-500 dark:text-gray-400">{s.text}</p></div>
          </button>
        ))}
      </div>
    </div>
  );
};
