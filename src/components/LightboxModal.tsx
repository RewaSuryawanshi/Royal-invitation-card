import React from 'react';
import { X, Play, Image as ImageIcon, Film } from 'lucide-react';
import { MediaItem } from '../types';

interface LightboxModalProps {
  item: MediaItem | null;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const isVideo = item.type === 'video';
  const isYouTube = item.url.includes('youtube.com') || item.url.includes('youtu.be');

  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1]?.split('&')[0] || '';
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0] || '';
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
        aria-label="Close modal"
      >
        <X className="w-6 h-6" />
      </button>

      <div 
        className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo ? (
          <div className="w-full bg-black rounded-lg overflow-hidden shadow-2xl flex flex-col items-center">
            {isYouTube ? (
              <div className="w-full aspect-video">
                <iframe
                  src={getYouTubeEmbedUrl(item.url)}
                  title={item.title || 'Video player'}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <video
                src={item.url}
                controls
                autoPlay
                className="max-h-[75vh] w-full rounded-lg object-contain bg-black"
              >
                Your browser does not support the video tag.
              </video>
            )}
            {(item.title || item.caption) && (
              <div className="w-full p-4 bg-zinc-900/90 text-white text-center">
                {item.title && <h4 className="text-lg font-medium text-amber-300">{item.title}</h4>}
                {item.caption && <p className="text-sm text-zinc-300 mt-1">{item.caption}</p>}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <img
              src={item.url}
              alt={item.title || item.caption || 'Gallery photo'}
              className="max-h-[80vh] max-w-full rounded-md object-contain shadow-2xl"
            />
            {(item.title || item.caption) && (
              <div className="mt-3 px-6 py-2 bg-black/60 backdrop-blur-md rounded-full text-center text-white max-w-lg">
                {item.title && <span className="font-medium text-amber-200 mr-2">{item.title}</span>}
                {item.caption && <span className="text-xs text-zinc-300">{item.caption}</span>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
