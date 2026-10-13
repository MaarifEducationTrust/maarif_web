/**
 * Media Management & URL Utilities
 * Handles Google Drive sharing links, YouTube videos, and external media with robust fallbacks.
 */

export function isValidUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:') || trimmed.startsWith('vbscript:')) {
    return false;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Extracts Google Drive File ID from various link formats:
 * - drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - drive.google.com/file/u/0/d/FILE_ID/...
 * - drive.google.com/open?id=FILE_ID
 * - drive.google.com/uc?id=FILE_ID
 * - docs.google.com/file/d/FILE_ID
 */
export function extractGoogleDriveId(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  
  // Format 1: drive.google.com/file/(u/\d+/)?d/FILE_ID/...
  const fileDMatch = trimmed.match(/\/file(?:\/u\/\d+)?\/d\/([a-zA-Z0-9_-]{20,})/);
  if (fileDMatch && fileDMatch[1]) return fileDMatch[1];
  
  // Format 2: drive.google.com/open?id=FILE_ID or drive.google.com/uc?id=FILE_ID
  const openIdMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{20,})/);
  if (openIdMatch && openIdMatch[1]) return openIdMatch[1];

  // Format 3: General ID pattern in drive/docs URLs
  const genericMatch = trimmed.match(/(?:drive|docs)\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/);
  if (genericMatch && genericMatch[1]) return genericMatch[1];

  return null;
}

/**
 * Gets array of candidate image URLs for Google Drive files for tiered fallbacks
 */
export function getGoogleDriveImageCandidates(driveId: string): string[] {
  return [
    `https://lh3.googleusercontent.com/d/${driveId}`,
    `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`,
    `https://docs.google.com/uc?export=view&id=${driveId}`,
  ];
}

/**
 * Converts Google Drive image links into high-reliability direct render URLs
 */
export function getOptimizedImageUrl(url: string | null | undefined, fallback: string = ''): string {
  if (!url || !isValidUrl(url)) return fallback;
  const trimmed = url.trim();

  const driveId = extractGoogleDriveId(trimmed);
  if (driveId) {
    return `https://lh3.googleusercontent.com/d/${driveId}`;
  }

  return trimmed;
}

/**
 * Generates direct download link for Google Drive file if applicable
 */
export function getDirectDownloadUrl(url: string | null | undefined): string | null {
  if (!url || !isValidUrl(url)) return null;
  const driveId = extractGoogleDriveId(url);
  if (driveId) {
    return `https://drive.google.com/uc?export=download&id=${driveId}`;
  }
  return url;
}

/**
 * Parses video URLs (YouTube, Google Drive, direct mp4) into embeddable URLs
 */
export interface VideoEmbedInfo {
  embedUrl: string | null;
  type: 'youtube' | 'drive' | 'direct' | 'unsupported';
  originalUrl: string;
}

export function getVideoEmbedInfo(url: string | null | undefined): VideoEmbedInfo {
  if (!url || !isValidUrl(url)) {
    return { embedUrl: null, type: 'unsupported', originalUrl: url || '' };
  }
  const trimmed = url.trim();

  // YouTube match
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`,
      type: 'youtube',
      originalUrl: trimmed,
    };
  }

  // Google Drive video match
  const driveId = extractGoogleDriveId(trimmed);
  if (driveId) {
    return {
      embedUrl: `https://drive.google.com/file/d/${driveId}/preview`,
      type: 'drive',
      originalUrl: trimmed,
    };
  }

  // Direct MP4 or WebM
  if (/\.(mp4|webm|ogg)($|\?)/i.test(trimmed)) {
    return {
      embedUrl: trimmed,
      type: 'direct',
      originalUrl: trimmed,
    };
  }

  return {
    embedUrl: null,
    type: 'unsupported',
    originalUrl: trimmed,
  };
}
