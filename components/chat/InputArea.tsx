import React, { useRef, useState, useEffect } from 'react';
import { ArrowUp, ArrowRight, Box, Globe, Paperclip, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { ModelOption, Attachment } from '../../types/chat';
import { MODELS } from '../../constants/chat';
import { fileToDataUrl } from '../../utils/fileHelpers';
import { parseCSV, parseJSON } from '../../utils/tableUtils';
import { AttachmentPreview } from './AttachmentPreview';
import { GoogleGenAI } from '@google/genai';

interface InputAreaProps {
  query: string;
  setQuery: (q: string) => void;
  onSend: () => void;
  isGenerating: boolean;
  onStartVoice: () => void;
  selectedModel: ModelOption;
  setSelectedModel: (m: ModelOption) => void;
  useSearch: boolean;
  setUseSearch: (b: boolean) => void;
  isAnalyzeMode: boolean;
  setIsAnalyzeMode: (b: boolean) => void;
  attachments: Attachment[];
  setAttachments: (atts: Attachment[]) => void;
}

// --- High Fidelity Sub-components ---

const ChatPill = ({ active, onClick, icon: Icon, label, disabled = false }: any) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`
      flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-all border outline-none
      ${active 
        ? 'bg-gray-100 dark:bg-[#3d3d3d] text-gray-900 dark:text-white border-gray-300 dark:border-[#555]' 
        : 'bg-transparent text-gray-500 dark:text-gray-400 border-transparent hover:bg-gray-50 dark:hover:bg-[#333]'
      }
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `}
  >
    <Icon size={14} strokeWidth={2} className={label === "Polishing..." ? "animate-spin" : ""} />
    <span>{label}</span>
  </button>
);

const PrimaryAction = ({ onClick, icon: Icon, label, variant = 'primary', disabled = false, className = '' }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95
      ${variant === 'primary' 
        ? 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90' 
        : 'bg-gray-100 dark:bg-[#333] text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-[#444]'
      }
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `}
  >
    {label && <span>{label}</span>}
    <Icon size={16} strokeWidth={2.5} className={className} />
  </button>
);

export const InputArea: React.FC<InputAreaProps> = (props) => {
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => { 
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsModelMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => { 
    if (taRef.current) { 
      taRef.current.style.height = 'auto'; 
      taRef.current.style.height = `${Math.min(taRef.current.scrollHeight, 200)}px`; 
    } 
  }, [props.query]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      const newAttachments = await Promise.all(files.map(async file => {
        const base64 = await fileToDataUrl(file);
        let tableData = undefined;
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          tableData = parseCSV(await file.text());
        } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
          tableData = parseJSON(await file.text());
        }
        return { file, previewUrl: base64, base64, mimeType: file.type, name: file.name, size: file.size, tableData };
      }));
      props.setAttachments([...props.attachments, ...newAttachments]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRewrite = async () => {
    if (!props.query.trim() || isRewriting) return;
    setIsRewriting(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-flash-lite-latest',
            contents: `Improve the clarity and tone of this message for an AI assistant. Output only the improved text. Text: "${props.query}"`,
        });
        if (response.text) props.setQuery(response.text.trim());
    } catch (e) { console.error(e); } 
    finally { setIsRewriting(false); }
  };

  const hasContent = props.query.trim().length > 0 || props.attachments.length > 0;

  return (
    <div className="w-full px-4 pb-8 pt-2 z-10 bg-white/95 dark:bg-[#212121]/95 backdrop-blur-xl">
      <div className="max-w-3xl mx-auto relative flex flex-col gap-4">
        <input type="file" multiple ref={fileInputRef} onChange={handleFileSelect} className="hidden" />

        {/* Mode Switcher - Lighter fonts, no shadow */}
        <div className="flex justify-center">
            <div className="flex items-center p-1 bg-gray-100 dark:bg-[#2f2f2f] rounded-full">
                <button
                    onClick={() => props.setIsAnalyzeMode(false)}
                    className={`px-6 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest transition-all ${!props.isAnalyzeMode ? 'bg-white dark:bg-[#1e1e1e] text-black dark:text-white border border-gray-200 dark:border-[#444]' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    Chat
                </button>
                <button
                    onClick={() => props.setIsAnalyzeMode(true)}
                    className={`px-6 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest transition-all ${props.isAnalyzeMode ? 'bg-white dark:bg-[#1e1e1e] text-black dark:text-white border border-gray-200 dark:border-[#444]' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    Analyst
                </button>
            </div>
        </div>
        
        {/* Unified Stadium Input Container - No shadows, clean borders */}
        <div className="bg-[#f4f4f4] dark:bg-[#2f2f2f] rounded-[32px] border border-gray-200 dark:border-[#444] p-4 pb-3 transition-all duration-300 relative group">
            
            <AttachmentPreview attachments={props.attachments} onRemove={(i) => props.setAttachments(props.attachments.filter((_, idx) => idx !== i))} />
            
            <textarea 
              ref={taRef} 
              value={props.query} 
              onChange={e => props.setQuery(e.target.value)} 
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); props.onSend(); } }} 
              placeholder={props.isAnalyzeMode ? "Describe the analysis you need..." : "Ask Auxiliary"}
              className="w-full bg-transparent border-none focus:ring-0 outline-none resize-none text-[16px] text-gray-900 dark:text-white placeholder-gray-400 placeholder:text-opacity-50 dark:placeholder:text-opacity-50 leading-relaxed p-0 mb-4 max-h-[200px] overflow-y-auto no-scrollbar font-normal appearance-none" 
              rows={1}
              style={{ backgroundColor: 'transparent' }}
            />

            <div className="flex items-center justify-between gap-2 mt-auto">
                <div className="flex items-center gap-1.5 flex-wrap relative">
                    <ChatPill 
                      onClick={() => fileInputRef.current?.click()} 
                      icon={Paperclip} 
                      label="Attach" 
                    />
                    <ChatPill 
                      active={props.useSearch} 
                      onClick={() => props.setUseSearch(!props.useSearch)} 
                      icon={Globe} 
                      label="Search" 
                    />
                    
                    {/* Model Dropdown Trigger */}
                    <div className="relative">
                        <ChatPill 
                            active={isModelMenuOpen}
                            onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                            icon={Box} 
                            label="Model" 
                        />
                        {isModelMenuOpen && (
                            <div ref={menuRef} className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-[#444] overflow-hidden z-50 p-2 animate-in fade-in zoom-in-95 duration-200">
                                {MODELS.map(m => (
                                    <button 
                                        key={m.id}
                                        onClick={() => { props.setSelectedModel(m); setIsModelMenuOpen(false); }}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors ${props.selectedModel.id === m.id ? 'bg-gray-100 dark:bg-[#333]' : 'hover:bg-gray-50 dark:hover:bg-[#2a2a2a]'}`}
                                    >
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{m.name}</div>
                                            <div className="text-[10px] text-gray-500">{m.desc}</div>
                                        </div>
                                        {props.selectedModel.id === m.id && <div className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Polish Button - Only appears when text exists */}
                    {hasContent && (
                      <ChatPill 
                        active={false} 
                        onClick={handleRewrite} 
                        icon={isRewriting ? Loader2 : Wand2} 
                        label={isRewriting ? "Polishing..." : "Polish"}
                        disabled={isRewriting}
                      />
                    )}
                </div>

                <div className="flex items-center gap-2">
                   <PrimaryAction 
                    onClick={props.onSend} 
                    icon={props.isGenerating ? Loader2 : (hasContent ? ArrowUp : ArrowRight)} 
                    label={props.isAnalyzeMode ? "Analyze" : "Ask"}
                    disabled={props.isGenerating}
                    className={props.isGenerating ? "animate-spin" : ""}
                   />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
