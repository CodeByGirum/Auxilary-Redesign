
import React from 'react';

interface MediaRendererProps {
  url: string;
  type: 'video' | 'image';
}

export const MediaRenderer: React.FC<MediaRendererProps> = ({ url, type }) => {
  if (type === 'video') {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (!match?.[1]) return null;

    return (
      <div className="my-4 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 w-full max-w-2xl bg-black">
        <iframe
          className="w-full aspect-video"
          src={`https://www.youtube.com/embed/${match[1]}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          frameBorder="0"
        />
      </div>
    );
  }

  return (
    <div className="my-4 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 w-full max-w-md bg-gray-50 dark:bg-[#1a1a1a]">
      <img 
        src={url} 
        alt="Embedded content" 
        className="w-full h-auto object-cover transition-opacity duration-500 ease-out"
        loading="lazy"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
    </div>
  );
};
