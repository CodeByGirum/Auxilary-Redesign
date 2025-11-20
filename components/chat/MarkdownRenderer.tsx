
import React from 'react';
import { CodeBlock } from './CodeBlock';
import { MediaRenderer } from './MediaRenderer';

export const MarkdownRenderer = ({ content }: { content: string }) => {
  if (!content) return null;
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 text-[15px] leading-7 text-gray-800 dark:text-gray-200 font-normal">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          return <CodeBlock key={index} language={match?.[1] || ''} code={match?.[2] || part.slice(3, -3)} />;
        }

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
