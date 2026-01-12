
import { ModelOption } from '../types/chat';

export const MODELS: ModelOption[] = [
  { id: 'gemini-3-flash-preview', name: 'Gemini 3.0 Flash', desc: 'Fast & versatile (Default)' },
  { id: 'gemini-3-pro-preview', name: 'Gemini 3.0 Pro', desc: 'Complex reasoning & coding' },
  { id: 'gemini-flash-lite-latest', name: 'Gemini Flash Lite', desc: 'Lowest latency' },
];

export const VOICE_CONFIG = {
  model: 'gemini-2.5-flash-native-audio-preview-09-2025',
  voiceName: 'Kore',
};
