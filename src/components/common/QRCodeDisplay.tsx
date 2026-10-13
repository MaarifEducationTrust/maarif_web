import React, { useState, useEffect } from 'react';
import { extractGoogleDriveId, getGoogleDriveImageCandidates, getDirectDownloadUrl, isValidUrl } from '../../lib/media';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  QrCode, 
  ExternalLink, 
  Download, 
  AlertCircle, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';

interface QRCodeDisplayProps {
  qrUrl?: string | null;
  upiId?: string | null;
  showDownload?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  qrUrl,
  upiId,
  showDownload = true,
  className = '',
  size = 'md',
}) => {
  const { isRtl } = useLanguage();
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [hasFailedAll, setHasFailedAll] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCandidateIndex(0);
    setHasFailedAll(false);
    setIsLoaded(false);

    if (qrUrl && isValidUrl(qrUrl)) {
      const driveId = extractGoogleDriveId(qrUrl);
      if (driveId) {
        setCandidates(getGoogleDriveImageCandidates(driveId));
      } else {
        setCandidates([qrUrl.trim()]);
      }
    } else {
      setCandidates([]);
    }
  }, [qrUrl]);

  const handleImageError = () => {
    if (candidateIndex + 1 < candidates.length) {
      setCandidateIndex(candidateIndex + 1);
    } else {
      setHasFailedAll(true);
    }
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  // Dimensions based on size prop
  const sizeClasses = {
    sm: 'w-36 h-36 sm:w-44 sm:h-44',
    md: 'w-48 h-48 sm:w-56 sm:h-56',
    lg: 'w-52 h-52 sm:w-64 sm:h-64',
  }[size];

  // 1. If NO QR URL is configured
  if (!qrUrl || !qrUrl.trim()) {
    return (
      <div className={`flex flex-col items-center justify-center p-5 text-center bg-stone-50 rounded-2xl border border-stone-200/90 shadow-2xs w-full max-w-sm mx-auto ${className}`}>
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 border border-amber-200/60 shadow-2xs">
          <Clock className="w-7 h-7" />
        </div>
        <span className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
          {isRtl ? 'کیو آر کوڈ جلد شائع ہوگا' : 'Official QR Code Pending'}
        </span>
        <p className="text-[11px] text-stone-500 leading-relaxed max-w-xs mb-3">
          {isRtl
            ? 'ادارے کا باضابطہ کیو آر کوڈ جلد شائع کر دیا جائے گا۔ براہِ کرم براہِ راست تعاون کے لیے بینک اکاؤنٹ یا یو پی آئی کا استعمال فرمائیں۔'
            : 'The official donation QR code will be published soon. Please use the verified Bank Account details or UPI ID below for direct contribution.'}
        </p>
        {upiId && (
          <div className="px-3 py-1 bg-white rounded-lg border border-stone-200 text-xs font-mono font-semibold text-emerald-900 shadow-2xs">
            UPI: {upiId}
          </div>
        )}
      </div>
    );
  }

  const currentSrc = candidates[candidateIndex] || '';
  const downloadUrl = getDirectDownloadUrl(qrUrl);
  const isDriveLink = Boolean(extractGoogleDriveId(qrUrl));

  // 2. If Image candidates failed to render
  if (hasFailedAll) {
    return (
      <div className={`flex flex-col items-center justify-center p-5 text-center bg-stone-50 rounded-2xl border border-stone-200/90 shadow-2xs w-full max-w-sm mx-auto ${className}`}>
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2.5 border border-amber-200/60">
          <AlertCircle className="w-6 h-6" />
        </div>
        <span className="text-xs font-bold text-stone-800 mb-1">
          {isRtl ? 'کیو آر تصویر لوڈ نہ ہو سکی' : 'QR Image Restricted / Unavailable'}
        </span>
        <p className="text-[11px] text-stone-500 max-w-xs mb-3 leading-relaxed">
          {isRtl
            ? 'گوگل ڈرائیو کی یہ فائل براہِ راست ظاہر نہیں ہو سکی۔ براہِ کرم نیچے دیے گئے بٹن پر کلک کرکے اصل کیو آر کوڈ ملاحظہ فرمائیں۔'
            : 'Unable to preview the Google Drive image directly. You can open and view the verified original file below.'}
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full justify-center">
          <a
            href={qrUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            <span>{isRtl ? 'اصل فائل گوگل ڈرائیو میں کھولیں' : 'Open in Google Drive'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  // 3. Normal Render with Progressive Fallback
  return (
    <div className={`flex flex-col items-center justify-center text-center w-full ${className}`}>
      {/* QR Code Container */}
      <div className={`relative ${sizeClasses} p-2.5 sm:p-3 bg-white rounded-2xl shadow-md border-2 border-emerald-900/10 flex items-center justify-center overflow-hidden mx-auto`}>
        {!isLoaded && (
          <div className="absolute inset-0 bg-stone-100 flex flex-col items-center justify-center animate-pulse">
            <QrCode className="w-8 h-8 text-stone-300 mb-1" />
            <span className="text-[10px] text-stone-400 font-medium">Loading QR...</span>
          </div>
        )}
        <img
          src={currentSrc}
          alt="Verified Madrasa Donation QR Code"
          onError={handleImageError}
          onLoad={handleImageLoad}
          className={`w-full h-full object-contain transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
        />
      </div>

      {/* Action buttons (Download & Open Drive) */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
        {showDownload && downloadUrl && (
          <a
            href={downloadUrl}
            download="madrasa-donation-qr.png"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-stone-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1.5 bg-stone-100/80 hover:bg-stone-200/80 px-3 py-1.5 rounded-xl transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isRtl ? 'کیو آر ڈاؤنلوڈ کریں' : 'Download QR'}</span>
          </a>
        )}

        {isDriveLink && (
          <a
            href={qrUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-stone-500 hover:text-stone-800 font-medium inline-flex items-center gap-1 transition-colors"
            title="Open original file on Google Drive"
          >
            <ExternalLink className="w-3 h-3" />
            <span className="text-[11px]">{isRtl ? 'گوگل ڈرائیو میں کھولیں' : 'Open in Drive'}</span>
          </a>
        )}
      </div>
    </div>
  );
};
