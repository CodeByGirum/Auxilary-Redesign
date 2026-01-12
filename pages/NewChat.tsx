
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useChatSession } from '../hooks/useChatSession';
import { useVoiceSession } from '../hooks/useVoiceSession';
import { MODELS } from '../constants/chat';
import { EmptyState } from '../components/chat/EmptyState';
import { MessageItem } from '../components/chat/MessageItem';
import { InputArea } from '../components/chat/InputArea';
import { VoiceOverlay } from '../components/chat/VoiceOverlay';
import { TableDrawer } from '../components/table/TableDrawer';
import { ContextSuggestions } from '../components/chat/ContextSuggestions';
import { Attachment, TableData } from '../types/chat';
import { Plus, X, GripVertical, Upload } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { fileToDataUrl } from '../utils/fileHelpers';
import { parseCSV, parseJSON } from '../utils/tableUtils';

// --- Chat Session Component ---
interface ChatSessionProps {
  id: string;
  isActive: boolean;
  onTitleChange: (id: string, newTitle: string) => void;
  onExpandTable: (data: TableData, fileName: string, visualHint?: string, msgId?: string) => void;
  initialData?: { name: string; data: TableData; source?: string };
  lastDrawerUpdate?: { data: TableData; msgId?: string };
}

const ChatSession: React.FC<ChatSessionProps> = ({ id, isActive, onTitleChange, onExpandTable, initialData, lastDrawerUpdate }) => {
  const [query, setQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [useSearch, setUseSearch] = useState(false);
  const [isAnalyzeMode, setIsAnalyzeMode] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [hasRenamed, setHasRenamed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  
  const hasIngestedData = useRef(false);

  const chat = useChatSession({ selectedModel, useSearch, isAnalyzeMode });
  const voice = useVoiceSession();

  // Sync drawer updates back to chat messages without triggering a full remount
  useEffect(() => {
    if (lastDrawerUpdate && lastDrawerUpdate.msgId) {
      chat.setMessages(prev => prev.map(m => {
        if (m.id === lastDrawerUpdate.msgId) {
           // Shallow compare to avoid unnecessary nested updates
           if (m.executionResults?.[0]?.data === lastDrawerUpdate.data) return m;

           if (m.executionResult && m.executionResult.type === 'table') {
               return { ...m, executionResult: { ...m.executionResult, data: lastDrawerUpdate.data } };
           }
           if (m.executionResults) {
              const updatedResults = { ...m.executionResults };
              if (updatedResults[0]) updatedResults[0] = { ...updatedResults[0], data: lastDrawerUpdate.data };
              return { ...m, executionResults: updatedResults };
           }
        }
        return m;
      }));
    }
  }, [lastDrawerUpdate]);

  useEffect(() => {
    if (initialData && !hasIngestedData.current) {
        hasIngestedData.current = true;
        setIsAnalyzeMode(true);
        const attachment: Attachment = {
            file: new File([], initialData.name),
            name: initialData.name,
            previewUrl: '',
            base64: '',
            mimeType: 'application/json',
            size: 0,
            tableData: initialData.data
        };
        chat.handleSend(
            `I have loaded the dataset "${initialData.name}". Please review the columns and act as a consultant. Do not run a full analysis yet. Instead, propose 4-5 specific analysis options based on the data structure and ask me what I would like to focus on.`, 
            [attachment]
        );
        onTitleChange(id, `Analysis: ${initialData.name}`);
        setHasRenamed(true);
    }
  }, [initialData, chat, id, onTitleChange]);

  useEffect(() => {
      if (isActive) {
          endRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
  }, [chat.messages, chat.isGenerating, isActive]);

  // Auto-Summarize Title
  useEffect(() => {
    const generateTitle = async () => {
        if (chat.messages.length >= 2 && !hasRenamed && !initialData) {
           const userMsg = chat.messages[0];
           const modelMsg = chat.messages[1];
           if (userMsg.role === 'user' && modelMsg.role === 'model' && !modelMsg.isStreaming) {
             setHasRenamed(true);
             try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const response = await ai.models.generateContent({
                   model: 'gemini-3-flash-preview',
                   contents: `Summarize this user query into a very short title (max 3 words). No quotes. Text: "${userMsg.text}"`,
                });
                const title = response.text?.trim();
                if (title) onTitleChange(id, title);
             } catch (e) {
                onTitleChange(id, userMsg.text.slice(0, 20) + '...');
             }
           }
        }
    };
    generateTitle();
  }, [chat.messages, hasRenamed, id, onTitleChange, initialData]);

  const handleSuggestion = (prompt: string, modelId: string) => {
    setQuery(prompt);
    const model = MODELS.find(m => m.id === modelId);
    if (model) setSelectedModel(model);
  };

  const handleSend = async () => {
    const currentQuery = query;
    const currentAttachments = attachments;
    setQuery('');
    setAttachments([]);
    await chat.handleSend(currentQuery, currentAttachments);
  };

  return (
    <div 
        className={`flex-col h-full relative bg-white dark:bg-[#212121] w-full ${isActive ? 'flex' : 'hidden'}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false); }}
        onDrop={async (e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files);
            const newAttachments = await Promise.all(files.map(async (f: File) => {
              const base64 = await fileToDataUrl(f);
              let tableData = undefined;
              if (f.type === 'text/csv' || f.name.endsWith('.csv')) tableData = parseCSV(await f.text());
              else if (f.type === 'application/json' || f.name.endsWith('.json')) tableData = parseJSON(await f.text());
              if (tableData) setIsAnalyzeMode(true);
              return { file: f, previewUrl: base64, base64, mimeType: f.type, name: f.name, size: f.size, tableData };
            }));
            setAttachments(prev => [...prev, ...newAttachments]);
          }
        }}
    >
      {isDragging && (
         <div className="absolute inset-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-[2px] flex items-center justify-center transition-all duration-200 pointer-events-none p-10">
            <div className="w-full h-full border-2 border-dashed border-indigo-500 rounded-3xl flex flex-col items-center justify-center bg-indigo-50/10">
                <div className="w-20 h-20 rounded-3xl bg-white dark:bg-[#1e1e1e] shadow-2xl flex items-center justify-center mb-6">
                    <Upload size={32} className="text-indigo-600" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Drop data to analyze</h3>
            </div>
         </div>
      )}

      {voice.isActive && (
        <VoiceOverlay status={voice.status} audioLevel={voice.audioLevel} isMuted={voice.isMuted} onClose={voice.stopSession} onToggleMic={voice.toggleMic} />
      )}
      
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col items-center p-4 pb-24 w-full">
        {chat.messages.length === 0 ? (
          <EmptyState onSuggestionClick={handleSuggestion} />
        ) : (
          <div className="w-full flex flex-col pb-4">
            {chat.messages.map(msg => (
              <MessageItem 
                key={msg.id} 
                msg={msg} 
                onRerun={chat.handleRerun} 
                onFeedback={chat.toggleFeedback} 
                onExpandTable={(data, name, hint) => onExpandTable(data, name, hint, msg.id)}
              />
            ))}
            {chat.isGenerating && chat.messages[chat.messages.length - 1]?.role === 'user' && (
               <div className="max-w-3xl mx-auto px-4 py-6 w-full flex justify-start">
                   <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 px-2">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-100" />
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-200" />
                   </div>
               </div>
            )}
            <div ref={endRef} />
          </div>
        )}
      </div>

      <div className="w-full z-10 bg-white dark:bg-[#212121]">
          <ContextSuggestions suggestions={chat.suggestions} onSelect={(s) => chat.handleSend(s, [])} isLoading={chat.isSuggestionsLoading} />
          <InputArea
            query={query} setQuery={setQuery} onSend={handleSend} isGenerating={chat.isGenerating} onStartVoice={voice.startSession}
            selectedModel={selectedModel} setSelectedModel={setSelectedModel} useSearch={useSearch} setUseSearch={setUseSearch}
            isAnalyzeMode={isAnalyzeMode} setIsAnalyzeMode={setIsAnalyzeMode} attachments={attachments} setAttachments={setAttachments}
          />
      </div>
    </div>
  );
};

// --- Main Tab Manager ---
export const NewChat = ({ onChatUpdate, selectedChatId, incomingDataset, onClearIncomingDataset }: any) => {
  const [tabs, setTabs] = useState<any[]>([{ id: '1', title: 'New Chat' }]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [tabData, setTabData] = useState<Record<string, any>>({});
  const [drawerUpdate, setDrawerUpdate] = useState<Record<string, {data: TableData, msgId?: string}>>({});
  
  const [isTableDrawerOpen, setIsTableDrawerOpen] = useState(false);
  const [activeTableData, setActiveTableData] = useState<TableData | null>(null);
  const [activeTableName, setActiveTableName] = useState('');
  const [activeVisualHint, setActiveVisualHint] = useState<string | undefined>(undefined);
  const [activeMsgId, setActiveMsgId] = useState<string | undefined>(undefined);
  
  const [drawerWidth, setDrawerWidth] = useState(600);
  const resizerRef = useRef<any>(null);

  useEffect(() => {
    if (selectedChatId) setActiveTabId(selectedChatId);
  }, [selectedChatId]);

  useEffect(() => {
      if (incomingDataset) {
          const newId = Date.now().toString();
          setTabs(prev => [...prev, { id: newId, title: incomingDataset.name }]);
          setTabData(prev => ({ ...prev, [newId]: incomingDataset }));
          setActiveTabId(newId);
          onChatUpdate(newId, incomingDataset.name);
          onClearIncomingDataset();
      }
  }, [incomingDataset]);

  const handleExpandTable = (data: TableData, fileName: string, visualHint?: string, msgId?: string) => {
      setActiveTableData(data);
      setActiveTableName(fileName);
      setActiveVisualHint(visualHint);
      setActiveMsgId(msgId);
      setIsTableDrawerOpen(true);
  };

  const handleSaveTable = (newData: TableData) => {
      // Use ref-like comparison logic in ChatSession to avoid unnecessary cycles
      setDrawerUpdate(prev => ({ ...prev, [activeTabId]: { data: newData, msgId: activeMsgId } }));
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-white dark:bg-[#212121] relative">
      <div className="h-10 flex items-center px-4 bg-white dark:bg-[#212121] z-20 flex-shrink-0 border-b border-gray-100 dark:border-[#333]">
        <div className="flex-1 flex items-center h-full overflow-x-auto no-scrollbar gap-1">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTabId(tab.id)}
                    className={`group relative h-8 px-4 flex items-center justify-center min-w-[80px] max-w-[200px] cursor-pointer outline-none transition-all duration-200 rounded-lg ${activeTabId === tab.id ? 'text-black dark:text-white font-bold bg-gray-100 dark:bg-[#2a2a2a]' : 'text-gray-500 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-[#252525]'}`}
                >
                    <span className="truncate text-[11px] uppercase tracking-widest">{tab.title}</span>
                    <div onClick={(e) => { e.stopPropagation(); setTabs(tabs.filter(t => t.id !== tab.id)); }} className="absolute right-1.5 p-0.5 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"><X size={10} strokeWidth={3} /></div>
                </button>
            ))}
            <button onClick={() => { const id = Date.now().toString(); setTabs([...tabs, { id, title: 'New Chat' }]); setActiveTabId(id); }} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors ml-1"><Plus size={14} strokeWidth={3} /></button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
          <div className="flex-1 flex flex-col min-w-0 relative">
             {tabs.map(tab => (
                <ChatSession 
                    key={tab.id} id={tab.id} isActive={activeTabId === tab.id} 
                    onTitleChange={(id, title) => { setTabs(tabs.map(t => t.id === id ? { ...t, title } : t)); onChatUpdate(id, title); }}
                    onExpandTable={handleExpandTable} initialData={tabData[tab.id]}
                    lastDrawerUpdate={drawerUpdate[tab.id]}
                />
             ))}
          </div>

          {isTableDrawerOpen && (
              <>
                <div onMouseDown={(e) => { e.preventDefault(); resizerRef.current = { startX: e.clientX, startWidth: drawerWidth }; const move = (me: MouseEvent) => setDrawerWidth(Math.max(300, Math.min(window.innerWidth * 0.7, resizerRef.current.startWidth + (resizerRef.current.startX - me.clientX)))); const up = () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); }; document.addEventListener('mousemove', move); document.addEventListener('mouseup', up); }} className="w-1.5 h-full cursor-col-resize hover:bg-indigo-500 active:bg-indigo-600 bg-gray-200 dark:bg-[#333] z-30 flex-shrink-0 transition-colors" />
                <div style={{ width: drawerWidth }} className="h-full flex-shrink-0 bg-white dark:bg-[#1e1e1e] shadow-2xl border-l border-gray-200 dark:border-[#333] overflow-hidden">
                   <TableDrawer isOpen={true} data={activeTableData} fileName={activeTableName} visualHint={activeVisualHint} onClose={() => setIsTableDrawerOpen(false)} onSave={handleSaveTable} mode="inline" />
                </div>
              </>
          )}
      </div>
    </div>
  );
};
