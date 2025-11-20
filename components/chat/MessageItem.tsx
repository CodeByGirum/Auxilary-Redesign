
import React, { useState } from 'react';
import { Check, Copy, RefreshCw, ThumbsUp, ThumbsDown, Globe, FileText } from 'lucide-react';
import { Message } from '../../types/chat';
import { formatTime } from '../../utils/formatHelpers';
import { formatFileSize } from '../../utils/fileHelpers';
import { MarkdownRenderer } from './MarkdownRenderer';

interface MessageItemProps {
  msg: Message;
  onRerun: (id: string) => void;
  onFeedback: (id: string, type: 'like' | 'dislike') => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({ msg, onRerun, onFeedback }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isRerunSuccess, setIsRerunSuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRerun = () => {
    onRerun(msg.id);
    setIsRerunSuccess(true);
    setTimeout(() => setIsRerunSuccess(false), 2000);
  };

  return (
    <div className="w-full group">
      <div className={`max-w-3xl mx-auto px-4 py-6 flex gap-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div className={`${msg.role === 'user' ? 'bg-[#f4f4f4] dark:bg-[#2f2f2f] px-5 py-3.5 rounded-3xl text-gray-900 dark:text-white max-w-[85%]' : 'w-full text-gray-900 dark:text-gray-100'} leading-7`}>
          {msg.role === 'user' && msg.attachments && msg.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {msg.attachments.map((att, i) => (
                att.mimeType.startsWith('image/') ? (
                  <img key={i} src={att.previewUrl} alt="attachment" className="max-w-full h-auto max-h-64 rounded-xl border border-gray-200 dark:border-[#444]" />
                ) : (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-[#383838] border border-gray-200 dark:border-[#444] max-w-xs w-full shadow-sm">
                    <div className="p-2.5 bg-gray-100 dark:bg-[#2a2a2a] rounded-lg text-blue-600 dark:text-blue-400">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">{att.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(att.size)}</div>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
          
          {msg.role === 'model' ? (
            <>
              <MarkdownRenderer content={msg.text} />
              {msg.groundingMetadata?.groundingChunks && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#333] flex flex-wrap gap-2">
                  {msg.groundingMetadata.groundingChunks.map((chunk: any, i: number) => chunk.web?.uri && (
                    <a key={i} href={chunk.web.uri} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-2 py-1 rounded bg-gray-50 dark:bg-[#1a1a1a] text-[10px] text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-[#333] transition-colors">
                      <Globe size={10} /><span className="truncate max-w-[150px]">{chunk.web.title || 'Source'}</span>
                    </a>
                  ))}
                </div>
              )}
              {!msg.isStreaming && (
                <div className="flex items-center gap-3 mt-4 select-none">
                  <button onClick={handleCopy} className="p-1 text-gray-300 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                  <button onClick={handleRerun} className="p-1 text-gray-300 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                    {isRerunSuccess ? <Check size={14} /> : <RefreshCw size={14} />}
                  </button>
                  <button onClick={() => onFeedback(msg.id, 'like')} className={`p-1 transition-colors ${msg.feedback === 'like' ? 'text-black dark:text-white' : 'text-gray-300 dark:text-gray-600 hover:text-gray-700'}`}>
                    <ThumbsUp size={14} fill={msg.feedback === 'like' ? "currentColor" : "none"} />
                  </button>
                  <button onClick={() => onFeedback(msg.id, 'dislike')} className={`p-1 transition-colors ${msg.feedback === 'dislike' ? 'text-black dark:text-white' : 'text-gray-300 dark:text-gray-600 hover:text-gray-700'}`}>
                    <ThumbsDown size={14} fill={msg.feedback === 'dislike' ? "currentColor" : "none"} />
                  </button>
                  <span className="ml-2 text-[9px] text-gray-300 dark:text-gray-700 font-mono pt-0.5">{formatTime(msg.timestamp)}</span>
                </div>
              )}
            </>
          ) : (
            <div className="whitespace-pre-wrap">{msg.text}</div>
          )}
        </div>
      </div>
    </div>
  );
};
