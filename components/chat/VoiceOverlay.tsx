
import React from 'react';
import { X, Mic, MicOff } from 'lucide-react';

interface VoiceOverlayProps {
  status: string;
  audioLevel: number;
  isMuted: boolean;
  onClose: () => void;
  onToggleMic: () => void;
}

export const VoiceOverlay: React.FC<VoiceOverlayProps> = ({ status, audioLevel, isMuted, onClose, onToggleMic }) => {
  return (
    <div className="absolute inset-0 z-50 bg-white dark:bg-[#212121] flex flex-col items-center justify-center animate-in fade-in">
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-[#2f2f2f] rounded-full border border-gray-100 dark:border-[#333]">
          <div className={`w-2 h-2 rounded-full ${['listening', 'speaking'].includes(status) ? 'bg-black dark:bg-white animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
            {status === 'connecting' ? 'Connecting...' : 'Live Session'}
          </span>
        </div>
        <button onClick={onClose} className="p-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors hover:bg-gray-50 dark:hover:bg-[#2f2f2f] rounded-full">
          <X size={24} strokeWidth={1.5} />
        </button>
      </div>
      <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-gray-200 dark:border-[#333] transition-all duration-300" style={{ transform: `scale(${1 + audioLevel * 2.5})`, opacity: Math.min(audioLevel * 1.5, 0.4) }} />
        <div className="absolute inset-20 rounded-full border border-gray-300 dark:border-[#444] transition-all duration-200" style={{ transform: `scale(${1 + audioLevel * 1.5})`, opacity: Math.min(audioLevel * 2, 0.6) }} />
        <div className="w-32 h-32 rounded-full bg-black dark:bg-white shadow-2xl dark:shadow-white/5 flex items-center justify-center z-10" style={{ transform: `scale(${Math.max(1, 1 + audioLevel)})` }}>
          {status === 'connecting' ? <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <div className="w-full h-full rounded-full bg-gradient-to-b from-white/10 to-transparent" />}
        </div>
      </div>
      <p className="mt-8 text-xl font-medium text-gray-900 dark:text-white">{status === 'listening' ? 'Listening...' : status === 'speaking' ? 'Speaking...' : 'Connecting...'}</p>
      <div className="absolute bottom-12 flex items-center gap-6">
        <button onClick={onToggleMic} className={`p-5 rounded-full border transition-all ${isMuted ? 'bg-gray-100 border-gray-200 text-gray-400 dark:bg-[#2a2a2a]' : 'bg-white border-gray-200 text-gray-900 dark:bg-[#212121] dark:text-white'}`}>
          {isMuted ? <MicOff size={24} strokeWidth={1.5} /> : <Mic size={24} strokeWidth={1.5} />}
        </button>
        <button onClick={onClose} className="px-8 py-5 rounded-full bg-black dark:bg-white text-white dark:text-black font-medium text-sm hover:scale-105 transition-all">End Session</button>
      </div>
    </div>
  );
};
