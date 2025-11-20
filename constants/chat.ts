
import { ModelOption } from '../types/chat';

export const MODELS: ModelOption[] = [
  { id: 'gemini-3-pro-preview', name: 'Gemini 3.0 Pro', desc: 'Complex reasoning & coding' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Fast & versatile' },
  { id: 'gemini-2.5-flash-lite-latest', name: 'Gemini 2.5 Lite', desc: 'Lowest latency' },
];

export const VOICE_CONFIG = {
  model: 'gemini-2.5-flash-native-audio-preview-09-2025',
  voiceName: 'Kore',
};
