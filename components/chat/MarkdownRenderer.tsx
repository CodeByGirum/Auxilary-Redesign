
import React from 'react';
import { CodeBlock } from './CodeBlock';
import { MediaRenderer } from './MediaRenderer';
import { AnalysisBlock } from './AnalysisBlock';
import { TableData } from '../../types/chat';

interface MarkdownRendererProps {
  content: string;
  executionResult?: {
    type: 'table' | 'text' | 'error';
    data: TableData | string;
  };
  executionResults?: Record<number, {
    type: 'table' | 'text' | 'error';
    data: TableData | string;
    visualHint?: 'bar' | 'line' | 'pie' | 'scatter';
  }>;
  // Updated to include optional visualHint parameter
  onExpandTable?: (data: TableData, title: string, visualHint?: string) => void;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, executionResult, executionResults, onExpandTable }) => {
  if (!content) return null;
  
  // Split by code blocks. Regex captures the delimiter to include it in the parts array.
  const parts = content.split(/(```[\s\S]*?```)/g);
  let codeBlockIndex = 0;

  return (
    <div className="space-y-2 text-[15px] leading-7 text-gray-800 dark:text-gray-200 font-normal">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          const currentCodeIndex = codeBlockIndex++;
          
          // Check if it's a SQL or Python block
          // Robust matching for language identifier (optional) and content
          const match = part.match(/```(\w*)\s*([\s\S]*?)```/);
          const lang = match?.[1]?.toLowerCase() || '';
          const code = match?.[2] || part.slice(3, -3);

          // Resolve result: try executionResults (map) first, then fallback to legacy executionResult (single) for first block
          let result = executionResults?.[currentCodeIndex];
          if (!result && currentCodeIndex === 0 && executionResult) {
            result = executionResult as any;
          }

          if ((lang === 'sql' || lang === 'python') && result) {
             return (
                <AnalysisBlock 
                  key={index} 
                  code={code} 
                  result={result} 
                  onExpandTable={onExpandTable}
                />
             );
          }

          return <CodeBlock key={index} language={lang} code={code} />;
        }

        // Normal text processing (Markdown, Media, etc.)
        const mediaRegex = /((?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)[a-zA-Z0-9_-]{11}|https?:\/\/[^\s]+?\.(?:png|jpg|jpeg|gif|webp|svg)(?:\?[^\s]*)?)/gi;
        const textParts = part.split(mediaRegex);

        return (
          <span key={index}>
            {textParts.map((subPart, i) => {
              if (!subPart) return null;
              const isYoutube = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)/i.test(subPart);
              const isImage = /\.(?:png|jpg|jpeg|gif|webp|svg)(?:\?.*)?$/i.test(subPart);

              if (isYoutube) return <MediaRenderer key={i} url={subPart} type="video" />;
              if (isImage) return <MediaRenderer key={i} url={subPart} type="image" />;

              return subPart.split('\n').map((line, lineIdx) => {
                if (line === '') return <div key={`${i}-${lineIdx}`} className="h-4" />;
                const segments = line.split(/(\*\*.*?\*\*)/g);
                return (
                  <p key={`${i}-${lineIdx}`} className="mb-2">
                    {segments.map((seg, k) => seg.startsWith('**') && seg.endsWith('**') ? <strong key={k} className="font-semibold text-gray-900 dark:text-white">{seg.slice(2, -2)}</strong> : seg)}
                  </p>
                );
              });
            })}
          </span>
        );
      })}
    </div>
  );
};
