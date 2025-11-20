import React, { useRef, useState, useEffect } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  language: string;
  code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if ((window as any).Prism && codeRef.current) (window as any).Prism.highlightElement(codeRef.current);
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden my-6 border border-gray-200 dark:border-[#333] shadow-sm">
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-[#262626] border-b border-gray-200 dark:border-[#333]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            {[1, 2, 3].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />)}
          </div>
          <span className="ml-2 text-xs font-mono text-gray-500 dark:text-gray-400 lowercase">{language || 'text'}</span>
        </div>
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <div className="bg-white dark:bg-[#1e1e1e] overflow-x-auto p-0 custom-scrollbar">
        <pre className="!m-0 !p-4 !bg-transparent text-sm leading-relaxed">
          <code ref={codeRef} className={`language-${language || 'javascript'}`}>{code}</code>
        </pre>
      </div>
    </div>
  );
};