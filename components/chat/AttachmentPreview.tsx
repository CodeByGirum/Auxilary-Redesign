
import React from 'react';
import { X, FileText } from 'lucide-react';
import { Attachment } from '../../types/chat';

interface AttachmentPreviewProps {
  attachments: Attachment[];
  onRemove: (index: number) => void;
}

export const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({ attachments, onRemove }) => {
  if (attachments.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-4 px-2 pb-2 mb-2">
      {attachments.map((att, i) => (
        <div key={i} className="relative group animate-in fade-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-200 dark:border-[#444] bg-white dark:bg-[#2a2a2a] flex flex-col items-center justify-center relative shadow-sm">
            {att.mimeType.startsWith('image/') ? (
               <img src={att.previewUrl} alt={att.name} className="w-full h-full object-cover" />
            ) : (
               <div className="flex flex-col items-center justify-center h-full w-full p-2 text-center">
                  <FileText size={24} className="text-gray-400 dark:text-gray-500 mb-1.5" />
                  <span className="text-[9px] leading-tight text-gray-500 dark:text-gray-400 w-full truncate px-1 font-medium">{att.name}</span>
               </div>
            )}
          </div>
          <button
            onClick={() => onRemove(i)}
            className="absolute -top-2 -right-2 bg-gray-900 dark:bg-gray-700 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:scale-110"
          >
            <X size={12} strokeWidth={3} />
          </button>
        </div>
      ))}
    </div>
  );
};
