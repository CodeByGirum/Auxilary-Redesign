
import { useState, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { createBlob, decodeAudioData } from '../utils/audioHelpers';
import { VOICE_CONFIG } from '../constants/chat';

export const useVoiceSession = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'connecting' | 'listening' | 'speaking' | 'error'>('connecting');
  const [audioLevel, setAudioLevel] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const refs = useRef({
    audioCtx: null as AudioContext | null,
    inputCtx: null as AudioContext | null,
    stream: null as MediaStream | null,
    processor: null as ScriptProcessorNode | null,
    session: null as Promise<any> | null,
    nextTime: 0,
    sources: new Set<AudioBufferSourceNode>(),
  });

  const startSession = async () => {
    try {
      setIsActive(true);
      setStatus('connecting');
      setAudioLevel(0);
      setIsMuted(false);
      refs.current.nextTime = 0;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      refs.current.inputCtx = new AC({ sampleRate: 16000 });
      refs.current.audioCtx = new AC({ sampleRate: 24000 });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      refs.current.stream = stream;

      const sessionPromise = ai.live.connect({
        model: VOICE_CONFIG.model,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE_CONFIG.voiceName } } },
          systemInstruction: "You are a helpful, concise AI assistant.",
        },
        callbacks: {
          onopen: () => {
            setStatus('listening');
            setupAudioProcessing(stream, sessionPromise);
          },
          onmessage: (msg: LiveServerMessage) => handleMessage(msg),
          onclose: () => setStatus('connecting'),
          onerror: (e) => { console.error(e); setStatus('error'); }
        }
      });
      refs.current.session = sessionPromise;
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  };

  const setupAudioProcessing = (stream: MediaStream, sessionPromise: Promise<any>) => {
    const ctx = refs.current.inputCtx!;
    const source = ctx.createMediaStreamSource(stream);
    const processor = ctx.createScriptProcessor(4096, 1, 1);
    refs.current.processor = processor;

    processor.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);
      const rms = Math.sqrt(input.reduce((s, v) => s + v * v, 0) / input.length);
      setAudioLevel(prev => prev * 0.8 + rms * 0.4); // Smoothed level

      if (!isMuted) {
        const blob = createBlob(input);
        sessionPromise.then(s => s.sendRealtimeInput({ media: blob }));
      }
    };
    source.connect(processor);
    processor.connect(ctx.destination);
  };

  const handleMessage = async (msg: LiveServerMessage) => {
    const data = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
    if (data && refs.current.audioCtx) {
      setStatus('speaking');
      const buffer = await decodeAudioData(data, refs.current.audioCtx);
      const ctx = refs.current.audioCtx;
      if (refs.current.nextTime < ctx.currentTime) refs.current.nextTime = ctx.currentTime;
      
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(refs.current.nextTime);
      refs.current.nextTime += buffer.duration;
      refs.current.sources.add(source);
      source.onended = () => {
        refs.current.sources.delete(source);
        if (refs.current.sources.size === 0) setStatus('listening');
      };
    }
    if (msg.serverContent?.interrupted) {
      refs.current.sources.forEach(s => s.stop());
      refs.current.sources.clear();
      refs.current.nextTime = 0;
      setStatus('listening');
    }
  };

  const stopSession = () => {
    setIsActive(false);
    setStatus('connecting');
    refs.current.stream?.getTracks().forEach(t => t.stop());
    refs.current.processor?.disconnect();
    refs.current.inputCtx?.close();
    refs.current.audioCtx?.close();
    refs.current.sources.forEach(s => s.stop());
    refs.current.session?.then((s: any) => s.close?.());
  };

  return { isActive, status, audioLevel, isMuted, startSession, stopSession, toggleMic: () => setIsMuted(!isMuted) };
};
