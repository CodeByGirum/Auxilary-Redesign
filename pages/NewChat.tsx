
import React, { useState, useRef, useEffect } from 'react';
import { useChatSession } from '../hooks/useChatSession';
import { useVoiceSession } from '../hooks/useVoiceSession';
import { MODELS } from '../constants/chat';
import { EmptyState } from '../components/chat/EmptyState';
import { MessageItem } from '../components/chat/MessageItem';
import { InputArea } from '../components/chat/InputArea';
import { VoiceOverlay } from '../components/chat/VoiceOverlay';
import { Attachment } from '../types/chat';
import { Plus, X, MessageSquare } from 'lucide-react';

// --- Chat Session Component ---
interface ChatSessionProps {
  id: string;
  isActive: boolean;
  onTitleChange: (id: string, newTitle: string) => void;
}

const ChatSession = ({ id, isActive, onTitleChange }: ChatSessionProps) => {
  const [query, setQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [useSearch, setUseSearch] = useState(false);
  const [isAnalyzeMode, setIsAnalyzeMode] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [hasRenamed, setHasRenamed] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const chat = useChatSession({ selectedModel, useSearch, isAnalyzeMode });
  const voice = useVoiceSession();

  // Auto-scroll to bottom when messages change or when tab becomes active
  useEffect(() => {
      if (isActive) {
          endRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
  }, [chat.messages, chat.isGenerating, isActive]);

  // Update tab title based on the first user message
  useEffect(() => {
    if (!hasRenamed && chat.messages.length > 0) {
      const firstUserMsg = chat.messages.find(m => m.role === 'user');
      if (firstUserMsg) {
        const newTitle = firstUserMsg.text.slice(0, 20) + (firstUserMsg.text.length > 20 ? '...' : '');
        if (newTitle.trim()) {
            onTitleChange(id, newTitle);
            setHasRenamed(true);
        }
      }
    }
  }, [chat.messages, hasRenamed, id, onTitleChange]);

  const handleSuggestion = (prompt: string, modelId: string) => {
    setQuery(prompt);
    const model = MODELS.find(m => m.id === modelId);
    if (model) setSelectedModel(model);
  };

  const handleSend = async () => {
    await chat.handleSend(query, attachments);
    setQuery('');
    setAttachments([]);
  };

  // We use CSS display toggling to preserve the state of the component (hooks, DOM, etc.)
  return (
    <div className={`flex flex-col h-full relative bg-white dark:bg-[#212121] ${isActive ? 'flex' : 'hidden'}`}>
      {voice.isActive && (
        <VoiceOverlay 
            status={voice.status} 
            audioLevel={voice.audioLevel} 
            isMuted={voice.isMuted} 
            onClose={voice.stopSession} 
            onToggleMic={voice.toggleMic} 
        />
      )}
      
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col items-center p-4 pb-24">
        {chat.messages.length === 0 ? (
          <EmptyState onSuggestionClick={handleSuggestion} />
        ) : (
          <div className="w-full flex flex-col pb-4">
            {chat.messages.map(msg => (
              <MessageItem key={msg.id} msg={msg} onRerun={chat.handleRerun} onFeedback={chat.toggleFeedback} />
            ))}
            {chat.isGenerating && chat.messages[chat.messages.length - 1]?.role === 'user' && (
              <div className="max-w-3xl mx-auto px-4 py-6 w-full">
                  <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                  </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}
      </div>

      <InputArea
        query={query}
        setQuery={setQuery}
        onSend={handleSend}
        isGenerating={chat.isGenerating}
        onStartVoice={voice.startSession}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        useSearch={useSearch}
        setUseSearch={setUseSearch}
        isAnalyzeMode={isAnalyzeMode}
        setIsAnalyzeMode={setIsAnalyzeMode}
        attachments={attachments}
        setAttachments={setAttachments}
      />
    </div>
  );
};

// --- Main Tab Manager Page ---
interface Tab {
    id: string;
    title: string;
}

export const NewChat = () => {
  const [tabs, setTabs] = useState<Tab[]>([{ id: '1', title: 'New Chat' }]);
  const [activeTabId, setActiveTabId] = useState('1');

  const createTab = () => {
    const newId = Date.now().toString();
    setTabs(prev => [...prev, { id: newId, title: 'New Chat' }]);
    setActiveTabId(newId);
  };

  const closeTab = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (tabs.length === 1) {
          // If closing the last tab, effectively just reset it
          setTabs([{ id: Date.now().toString(), title: 'New Chat' }]);
          // Reset active tab to the new one if needed, but simple re-render handles it
          return;
      }
      
      const newTabs = tabs.filter(t => t.id !== id);
      setTabs(newTabs);
      if (activeTabId === id) {
          // Switch to the last tab available
          setActiveTabId(newTabs[newTabs.length - 1].id);
      }
  };

  const updateTabTitle = (id: string, newTitle: string) => {
      setTabs(prev => prev.map(t => t.id === id ? { ...t, title: newTitle } : t));
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-white dark:bg-[#212121]">
      {/* Tab Bar */}
      <div className="h-12 flex items-center px-4 gap-2 border-b border-gray-200 dark:border-[#333] bg-white dark:bg-[#212121] flex-shrink-0 z-20">
        <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar h-full">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTabId(tab.id)}
                    className={`
                        group relative flex items-center gap-2 px-4 h-8 rounded-lg text-xs font-medium transition-all min-w-[120px] max-w-[200px] border select-none
                        ${activeTabId === tab.id 
                            ? 'bg-gray-100 dark:bg-[#2f2f2f] text-gray-900 dark:text-white border-gray-200 dark:border-[#444] shadow-sm' 
                            : 'bg-transparent text-gray-500 dark:text-gray-400 border-transparent hover:bg-gray-50 dark:hover:bg-[#2a2a2a] hover:text-gray-700 dark:hover:text-gray-300'
                        }
                    `}
                >
                    <MessageSquare size={14} className={`flex-shrink-0 ${activeTabId === tab.id ? 'opacity-100' : 'opacity-70'}`} />
                    <span className="truncate">{tab.title}</span>
                    
                    {/* Close Button (visible on hover or if active) */}
                    {tabs.length > 1 && (
                        <div 
                            onClick={(e) => closeTab(e, tab.id)}
                            className={`
                                ml-auto p-0.5 rounded-md hover:bg-gray-300 dark:hover:bg-[#444] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 
                                ${activeTabId === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} 
                                transition-opacity
                            `}
                        >
                            <X size={12} />
                        </div>
                    )}
                </button>
            ))}
        </div>
        
        <button 
            onClick={createTab}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2f2f2f] text-gray-500 hover:text-black dark:hover:text-white transition