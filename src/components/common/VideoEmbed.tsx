import React from 'react';
import { getVideoEmbedInfo } from '../../lib/media';
import { Video, ExternalLink } from 'lucide-react';

interface VideoEmbedProps {
  url?: string | null;
  title?: string;
  className?: string;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({
  url,
  title = 'Institutional Video',
  className = '',
}) => {
  const videoInfo = getVideoEmbedInfo(url);

  if (!url || !videoInfo.embedUrl) {
    return (
      <div className={`aspect-video w-full bg-stone-900/90 rounded-2xl flex flex-col items-center justify-center p-6 text-stone-300 border border-stone-800 ${className}`}>
        <Video className="w-12 h-12 text-emerald-400 mb-3 opacity-60" />
        <p className="text-sm font-medium text-center">{title}</p>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 px-4 py-2 bg-emerald-800/80 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Watch External Video</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    );
  }

  if (videoInfo.type === 'direct') {
    return (
      <div className={`aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg ${className}`}>
        <video
          src={videoInfo.embedUrl}
          controls
          className="w-full h-full object-cover"
          title={title}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div className={`relative aspect-video w-full rounded-2xl overflow-hidden bg-stone-950 shadow-lg border border-stone-800/40 ${className}`}>
      <iframe
        src={videoInfo.embedUrl}
        title={title}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
};
