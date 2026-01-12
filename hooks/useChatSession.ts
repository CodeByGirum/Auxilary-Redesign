
import { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Message, ModelOption, Attachment } from '../types/chat';
import { executeSQL } from '../utils/analysisEngine';

interface UseChatProps {
  selectedModel: ModelOption;
  useSearch: boolean;
  isAnalyzeMode: boolean;
}

export const useChatSession = ({ selectedModel, useSearch, isAnalyzeMode }: UseChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);

  const findActiveData = (history: Message[]) => {
    for (let i = history.length - 1; i >= 0; i--) {
      const att = history[i].attachments?.find(a => a.tableData);
      if (att) return att;
    }
    return null;
  };

  const generateSuggestions = async (history: Message[]) => {
    try {
      setIsSuggestionsLoading(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const lastMsgs = history.slice(-4).map(m => `${m.role}: ${m.text}`).join('\n');
      const hasData = !!findActiveData(history);
      
      const prompt = `
        Based on the conversation history below, generate 3 short, proactive, and intelligent follow-up options for the user.
        Context:
        - User has data loaded: ${hasData}
        - Conversation:
        ${lastMsgs}
        Rules:
        1. If data is present, suggest specific analysis (e.g., "Visualize sales trends", "Find top performers").
        2. Keep suggestions under 6 words.
        4. Return ONLY a raw JSON array of strings.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const parsed = JSON.parse(response.text || '[]');
      if (Array.isArray(parsed)) {
        setSuggestions(parsed.slice(0, 3));
      }
    } catch (e) {
      console.warn("Failed to generate suggestions", e);
    } finally {
      setIsSuggestionsLoading(false);
    }
  };

  const generateResponse = async (history: Message[]) => {
    try {
      setIsGenerating(true);
      setSuggestions([]);
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const activeAttachment = findActiveData(history);
      const hasData = !!activeAttachment;

      // Base instruction
      let systemInstruction = "You are a helpful, intelligent AI assistant.";
      
      // Data Analysis Instruction (Active whenever data is present, regardless of mode toggle)
      if (hasData) {
          const cols = activeAttachment?.tableData?.headers.join(', ');
          systemInstruction = `
You are an expert Data Analyst. The user has uploaded a dataset with columns: [${cols}].
The dataset is available in a SQL table named 'data'.

**VISUALIZATION LOGIC (STRICT):**
1. **Prioritize Value:** Only generate a chart if it reveals meaningful trends, distributions, or comparisons.
2. **Skip Trivial Charts:** DO NOT generate charts for single values (scalars), simple text lists, or very small datasets (less than 3 data points) unless explicitly requested.
3. **Format:** If a chart is valuable, output <visual_type>bar|line|pie|area</visual_type> immediately after the SQL block.

**OUTPUT FORMATTING:**
- **Scalars:** If the result is a single number (e.g., "Total Sales"), write the SQL to calculate it. The system will display it as a statistic. Do not generate a chart.
- **Tables:** Only imply a table output (by not adding a visual tag) if the user needs to explore raw rows or a detailed list.
- **Text:** Always provide a brief text analysis explaining the result *before* or *after* the code block.

**SQL RULES:**
- Use markdown blocks: \`\`\`sql ... \`\`\`.
- Use snake_case for aliases.
- Use 'data' as the table name.
`;
      } else if (isAnalyzeMode) {
          systemInstruction = "You are an expert data analyst. Provide deep, structured analysis and reasoning.";
      }

      const tools = (useSearch && !hasData) ? [{ googleSearch: {} }] : undefined;
      const modelId = (useSearch && selectedModel.id.includes('lite')) ? 'gemini-flash-lite-latest' : selectedModel.id;
      
      const aiMsgId = (Date.now() + 1).toString();
      const modelMsg: Message = { id: aiMsgId, role: 'model', text: '', isStreaming: true, timestamp: new Date() };
      setMessages(prev => [...prev, modelMsg]);

      const contents = history.map(m => {
        const parts: any[] = [{ text: m.text }];
        if (m.attachments) {
          m.attachments.forEach(a => {
            if (a.mimeType.startsWith('image/')) {
               const base64Data = a.base64.split(',')[1];
               parts.push({ inlineData: { mimeType: a.mimeType, data: base64Data } });
            } else if (a.tableData) {
               const headerInfo = a.tableData.headers.join(', ');
               const rowPreview = JSON.stringify(a.tableData.rows.slice(0, 3));
               parts.push({ text: `\n<file_context>\nFilename: ${a.name}\nColumns: ${headerInfo}\nPreview: ${rowPreview}\n</file_context>` });
            }
          });
        }
        return { role: m.role, parts };
      });

      const stream = await ai.models.generateContentStream({
        model: modelId,
        contents,
        config: { tools, systemInstruction }
      });

      let fullText = '';
      let groundingMetadata = null;

      for await (const chunk of stream) {
        fullText += chunk.text || '';
        if (chunk.candidates?.[0]?.groundingMetadata) groundingMetadata = chunk.candidates[0].groundingMetadata;
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: fullText, groundingMetadata } : m));
      }

      let executionResults: Record<number, any> = {};

      if (hasData) {
          const codeBlockRegex = /```(\w*)\s*([\s\S]*?)```/g;
          let match;
          let index = 0;
          
          while ((match = codeBlockRegex.exec(fullText)) !== null) {
              const lang = match[1].toLowerCase();
              const code = match[2].trim();
              
              if (lang === 'sql') {
                  const result = await executeSQL(code, activeAttachment?.tableData!);
                  
                  // Look for visual hint immediately after this block
                  const textAfter = fullText.slice(match.index + match[0].length);
                  const visualMatch = textAfter.match(/^\s*<visual_type>(.*?)<\/visual_type>/);
                  
                  if (result.type === 'table' && visualMatch) {
                     (result as any).visualHint = visualMatch[1].trim();
                  }
                  
                  executionResults[index] = result;
              }
              index++;
          }
      }

      let cleanedText = fullText
          .replace(/<visual_type>.*?<\/visual_type>/g, '')
          .trim();

      const finalModelMsg: Message = { 
        ...modelMsg, 
        text: cleanedText, 
        isStreaming: false, 
        groundingMetadata,
        executionResults 
      };

      setMessages(prev => prev.map(m => m.id === aiMsgId ? finalModelMsg : m));
      generateSuggestions([...history, finalModelMsg]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Error generating response.", timestamp: new Date() }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = async (text: string, attachments: Attachment[] = []) => {
    if ((!text.trim() && attachments.length === 0) || isGenerating) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, attachments, timestamp: new Date() };
    const newHistory = messages.concat(userMsg);
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

  return { messages, setMessages, isGenerating, suggestions, isSuggestionsLoading, handleSend, handleRerun, toggleFeedback };
};
