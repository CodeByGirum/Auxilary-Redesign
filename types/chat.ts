
export interface Attachment {
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
  name: string;
  size: number;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
  groundingMetadata?: any;
  timestamp: Date;
  feedback?: 'like' | 'dislike' | null;
  attachments?: Attachment[];
}

export interface ModelOption {
  id: string;
  name: string;
  desc: string;
}
