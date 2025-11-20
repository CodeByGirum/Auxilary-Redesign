
import React, { useRef, useState, useEffect } from 'react';
import { ArrowUp, Mic, Plus, Bot, Brain, MessageSquare, Globe, ChevronRight, ChevronLeft, Paperclip, FileText, Folder, X } from 'lucide-react';
import { ModelOption, Attachment } from '../../types/chat';
import { MODELS } from '../../constants/chat';
import { MOCK_PROJECTS } from '../../constants';
import { fileToDataUrl } from '../../utils/fileHelpers';
import { AttachmentPreview } from './AttachmentPreview';

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

const ToolbarButton = ({ active, onClick, icon: Icon, label, className = '' }: any) => (
  <button 
    onClick={onClick} 
    className={`
      flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-medium transition-all shadow-sm flex-shrink-0
      ${active 
        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' 
        : 'bg-white dark:bg-[#383838] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-[#444] hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#404040]'
      }
      ${className}
    `}
  >
    <Icon size={18} strokeWidth={active ? 2 : 1.5} />
    {label && <span className="hidden sm:inline truncate max-w-[100px]">{label}</span>}
  </button>
);

const MenuOption = ({ icon: Icon, label, subLabel, onClick, hasSubmenu, active, selected }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors group
      ${active || selected ? 'bg-gray-100 dark:bg-[#2a2a2a]' : 'hover:bg-gray-50 dark:hover:bg-[#2a2a2a]'}
    `}
  >
    <div className="flex items-center gap-3 overflow-hidden">
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${selected ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-gray-100 dark:bg-[#2f2f2f] text-gray-500 dark:text-gray-400'}`}>
        <Icon size={16} strokeWidth={1.5} />
      </div>
      <div className="flex flex-col truncate min-w-0">
        <span className={`text-sm font-medium truncate ${selected ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{label}</span>
        {subLabel && <span className="text-xs text-gray-400 truncate">{subLabel}</span>}
      </div>
    </div>
    {hasSubmenu && <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />}
    {selected && !hasSubmenu && <div className="w-2 h-2 rounded-full bg-black dark:bg-white mr-2"></div>}
  </button>
);

export const InputArea: React.FC<InputAreaProps> = (props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuView, setMenuView] = useState<'main' | 'models' | 'projects'>('main');
  
  const menuRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => { 
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
        setTimeout(() => setMenuView('main'), 200); // Reset view after close
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
      const files = Array.from(e.target.files);
      const newAttachments = await Promise.all(files.map(async file => ({
        file, 
        previewUrl: await fileToDataUrl(file), 
        base64: await fileToDataUrl(file), 
        mimeType: file.type,
        name: file.name,
        size: file.size
      })));
      props.setAttachments([...props.attachments, ...newAttachments]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setIsMenuOpen(false);
    }
  };

  const renderMenuContent = () => {
    if (menuView === 'main') {
      return (
        <div className="p-2 space-y-1">
          <MenuOption 
            icon={Paperclip} 
            label="Attach File" 
            subLabel="Upload documents or images"
            onClick={() => fileInputRef.current?.click()}
          />
          <div className="h-px bg-gray-100 dark:bg-[#333] my-1 mx-2" />
          <MenuOption 
            icon={Bot} 
            label="Model" 
            subLabel={props.selectedModel.name}
            hasSubmenu
            onClick={() => setMenuView('models')}
          />
          <MenuOption 
            icon={Folder} 
            label="Projects" 
            subLabel="Add context from projects"
            hasSubmenu
            onClick={() => setMenuView('projects')}
          />
        </div>
      );
    }

    if (menuView === 'models') {
      return (
        <div className="p-2">
          <div className="flex items-center gap-2 px-2 py-2 mb-2 text-gray-900 dark:text-white">
            <button onClick={() => setMenuView('main')} className="p-1 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-md">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold">Select Model</span>
          </div>
          <div className="space-y-1">
            {MODELS.map(m => (
              <MenuOption 
                key={m.id}
                icon={Bot} 
                label={m.name} 
                subLabel={m.desc}
                selected={props.selectedModel.id === m.id}
                onClick={() => { props.setSelectedModel(m); setIsMenuOpen(false); setTimeout(() => setMenuView('main'), 200); }}
              />
            ))}
          </div>
        </div>
      );
    }

    if (menuView === 'projects') {
      return (
        <div className="p-2">
           <div className="flex items-center gap-2 px-2 py-2 mb-2 text-gray-900 dark:text-white">
            <button onClick={() => setMenuView('main')} className="p-1 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-md">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold">Add Project</span>
          </div>
          <div className="max-h-64 overflow-y-auto space-y-1 custom-scrollbar">
            {MOCK_PROJECTS.map(p => (
              <MenuOption 
                key={p.id}
                icon={p.icon || Folder}
                label={p.name}
                subLabel={p.status}
                onClick={() => { props.setQuery(props.query + ` @[Project: ${p.name}] `); setIsMenuOpen(false); setTimeout(() => setMenuView('main'), 200); }}
              />
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="w-full px-4 pb-6 pt-2 z-10 bg-white dark:bg-[#212121]">
      <div className="max-w-3xl mx-auto relative">
        <input type="file" multiple ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
        
        {/* Unified Menu Popup */}
        {isMenuOpen && (
          <div ref={menuRef} className="absolute bottom-[100%] left-0 mb-3 w-72 bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#333] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-bottom-left">
            {renderMenuContent()}
          </div>
        )}

        {/* Main Input Container */}
        <div className="bg-[#f4f4f4] dark:bg-[#2f2f2f] rounded-[32px] p-4 shadow-sm transition-all duration-200">
          
          <AttachmentPreview attachments={props.attachments} onRemove={(i) => props.setAttachments(props.attachments.filter((_, idx) => idx !== i))} />
          
          <textarea 
            ref={taRef} 
            value={props.query} 
            onChange={e => props.setQuery(e.target.value)} 
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); props.onSend(); } }} 
            placeholder="Ask anything..." 
            className="w-full bg-transparent border-none focus:ring-0 resize-none text-gray-900 dark:text-white placeholder-gray-500 text-base min-h-[44px] py-3 px-2 no-scrollbar focus:outline-none" 
            rows={1} 
          />
          
          {/* Toolbar */}
          <div className="flex items-center justify-between mt-2 px-1">
            
            {/* Left Controls - Scrollable on extremely small screens if needed, but mostly hidden labels handle space */}
            <div className="flex items-center gap-1 sm:gap-2 flex-nowrap overflow-x-auto no-scrollbar">
              <ToolbarButton 
                active={isMenuOpen} 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                icon={Plus} 
              />
              
              <div className="w-px h-6 bg-gray-300 dark:bg-[#444] mx-1 hidden sm:block"></div>
              
              <ToolbarButton 
                active={props.isAnalyzeMode} 
                onClick={() => props.setIsAnalyzeMode(!props.isAnalyzeMode)} 
                icon={props.isAnalyzeMode ? Brain : MessageSquare} 
                label={props.isAnalyzeMode ? "Analyze" : "Ask"} 
              />
              
              <ToolbarButton 
                active={props.useSearch} 
                onClick={() => props.setUseSearch(!props.useSearch)} 
                icon={Globe} 
                label="Search" 
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <button 
                onClick={props.onStartVoice} 
                className="p-3 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#383838] rounded-full transition-colors"
              >
                <Mic size={20} />
              </button>
              
              <button 
                onClick={props.onSend} 
                disabled={(!props.query.trim() && props.attachments.length === 0) || props.isGenerating} 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0
                  ${(props.query.trim() || props.attachments.length > 0) && !props.isGenerating 
                    ? 'bg-black dark:bg-white text-white dark:text-black hover:scale-105 active:scale-95' 
                    : 'bg-gray-200 dark:bg-[#444] text-gray-400 cursor-not-allowed'
                  }`}
              >
                {props.isGenerating ? <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" /> : <ArrowUp size={22} />}
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-3 hidden sm:block">
          <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">Auxiliary can make mistakes. Check important info.</p>
        </div>
      </div>
    </div>
  );
};
