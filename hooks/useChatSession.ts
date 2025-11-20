
import { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Message, ModelOption, Attachment } from '../types/chat';

interface UseChatProps {
  selectedModel: ModelOption;
  useSearch: boolean;
  isAnalyzeMode: boolean;
}

export const useChatSession = ({ selectedModel, useSearch, isAnalyzeMode }: UseChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateResponse = async (history: Message[]) => {
    try {
      setIsGenerating(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const tools = useSearch ? [{ googleSearch: {} }] : undefined;
      const modelId = (useSearch && selectedModel.id.includes('lite')) ? 'gemini-2.5-flash' : selectedModel.id;
      
      const aiMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: aiMsgId, role: 'model', text: '', isStreaming: true, timestamp: new Date() }]);

      const contents = history.map(m => {
        const parts: any[] = [{ text: m.text }];
        if (m.attachments) {
          m.attachments.forEach(a => {
            // Extract raw base64 data (remove data:image/xyz;base64, prefix)
            const base64Data = a.base64.split(',')[1];
            parts.push({ inlineData: { mimeType: a.mimeType, data: base64Data } });
          });
        }
        return { role: m.role, parts };
      });

      const stream = await ai.models.generateContentStream({
        model: modelId,
        contents,
        config: {
          tools,
          systemInstruction: isAnalyzeMode ? "You are an analytical engine. Provide deep, structured analysis." : undefined
        }
      });

      let fullText = '';
      let groundingMetadata = null;

      for await (const chunk of stream) {
        fullText += chunk.text || '';
        if (chunk.candidates?.[0]?.groundingMetadata) groundingMetadata = chunk.candidates[0].groundingMetadata;
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: fullText, groundingMetadata } : m));
      }
      setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, isStreaming: false } : m));

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Error generating response.", timestamp: new Date() }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = async (text: string, attachments: Attachment[] = []) => {
    if ((!text.trim() && attachments.length === 0) || isGenerating) return;
    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      text, 
      attachments,
      timestamp: new Date() 
    };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    await generateResponse(newHistory);
  };

  const handleRerun = async (aiMsgId: string) => {
    if (isGenerating) return;
    const idx = messages.findIndex(m => m.id === aiMsgId);
    if (idx === -1) return;
    const newHistory = messages.slice(0, idx);
    setMessages(newHistory);
    await generateResponse(newHistory);
  };

  const toggleFeedback = (id: string, type: 'like' | 'dislike') => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, feedback: m.feedback === type ? undefined : type } : m));
  };

  return { messages, isGenerating, handleSend, handleRerun, toggleFeedback };
};
