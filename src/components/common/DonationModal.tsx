import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { SiteSettings } from '../../types';
import { QRCodeDisplay } from './QRCodeDisplay';
import { 
  X, 
  QrCode, 
  Copy, 
  Check, 
  Building2, 
  ShieldCheck, 
  HelpCircle
} from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettings;
}

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose, settings }) => {
  const { t, getField } = useLanguage();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2500);
  };

  const instructions = getField(settings, 'donation_instructions');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="donation-modal-title"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-900/10 max-h-[94vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white p-4 sm:p-6 relative">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-emerald-200 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="p-1.5 sm:p-2 bg-emerald-700/60 rounded-xl text-amber-400 border border-emerald-600/40">
              <QrCode className="w-5 h-5" />
            </span>
            <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 sm:py-1 rounded-full border border-amber-400/20">
              {t('verified_badge')}
            </span>
          </div>
          <h2 id="donation-modal-title" className="text-xl sm:text-2xl font-bold text-white leading-tight">
            {t('sec_donation_title')}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 line-clamp-1">
            {getField(settings, 'madrasa_name')}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
            {/* QR Code Container */}
            <div className="flex flex-col items-center bg-stone-50 p-3.5 sm:p-5 rounded-2xl border border-stone-200/80 shadow-2xs text-center w-full">
              <span className="text-xs font-semibold text-emerald-800 mb-2 uppercase tracking-wider">
                {t('donation_scan_title')}
              </span>

              {/* Dedicated QR Code Display Component */}
              <QRCodeDisplay
                qrUrl={settings.donation_qr_url}
                upiId={settings.upi_id}
                size="md"
                className="w-full my-1"
              />

              {settings.upi_id && (
                <div className="w-full mt-3">
                  <div className="text-[11px] text-stone-500 mb-1 font-medium">UPI ID</div>
                  <div className="flex items-center justify-between bg-white border border-stone-300 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-mono text-emerald-900 shadow-2xs">
                    <span className="truncate mr-2 font-semibold text-[11px] sm:text-xs">{settings.upi_id}</span>
                    <button
                      onClick={() => copyToClipboard(settings.upi_id, 'upi')}
                      className="text-emerald-700 hover:text-emerald-800 p-1 flex items-center gap-1 text-[11px] sm:text-xs font-sans font-bold shrink-0"
                      title={t('copy_upi')}
                    >
                      {copiedItem === 'upi' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">{t('copied')}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{t('copy_upi')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bank Transfer Details */}
            <div className="bg-emerald-50/60 p-3.5 sm:p-5 rounded-2xl border border-emerald-100 flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm mb-3">
                  <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{t('donation_bank_title')}</span>
                </div>

                {settings.account_number ? (
                  <div className="space-y-2.5 text-xs">
                    <div>
                      <span className="text-stone-500 block mb-0.5 text-[11px]">{t('acc_holder')}</span>
                      <span className="font-semibold text-stone-800 text-xs sm:text-sm block break-words">
                        {settings.account_holder}
                      </span>
                    </div>

                    {settings.bank_name && (
                      <div>
                        <span className="text-stone-500 block mb-0.5 text-[11px]">{t('bank_name')}</span>
                        <span className="font-medium text-stone-800 text-xs break-words">
                          {settings.bank_name} {settings.branch ? `(${settings.branch})` : ''}
                        </span>
                      </div>
                    )}

                    <div>
                      <span className="text-stone-500 block mb-0.5 text-[11px]">{t('acc_num')}</span>
                      <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-emerald-200/80 shadow-2xs">
                        <span className="font-mono font-bold text-emerald-950 text-xs sm:text-sm truncate mr-2">
                          {settings.account_number}
                        </span>
                        <button
                          onClick={() => copyToClipboard(settings.account_number, 'acc')}
                          className="text-emerald-700 hover:text-emerald-900 p-1 shrink-0"
                          title="Copy Account Number"
                        >
                          {copiedItem === 'acc' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {settings.ifsc_code && (
                      <div>
                        <span className="text-stone-500 block mb-0.5 text-[11px]">{t('ifsc')}</span>
                        <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-emerald-200/80 shadow-2xs">
                          <span className="font-mono font-semibold text-emerald-950 text-xs sm:text-sm truncate mr-2">
                            {settings.ifsc_code}
                          </span>
                          <button
                            onClick={() => copyToClipboard(settings.ifsc_code, 'ifsc')}
                            className="text-emerald-700 hover:text-emerald-900 p-1 shrink-0"
                            title="Copy IFSC"
                          >
                            {copiedItem === 'ifsc' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 py-2 text-stone-600 text-xs leading-relaxed">
                    <p className="bg-white p-3 rounded-xl border border-emerald-100 text-[11px] text-stone-600">
                      Official bank account information is being configured. For direct donations and receipt assistance, please contact the Madrasa directly:
                    </p>
                    <div className="space-y-1.5 font-medium text-[11px] text-emerald-950">
                      <div>📞 Qari Suleman Saheb: <a href="tel:9892607755" className="font-bold underline">9892607755</a> / <a href="tel:9322171099" className="font-bold underline">9322171099</a></div>
                      <div>💬 WhatsApp: <a href="https://wa.me/919930797935" target="_blank" rel="noopener noreferrer" className="font-bold underline">9930797935</a></div>
                      <div>📞 Nazim-e-Taleemat: <a href="tel:9076441202" className="font-bold underline">9076441202</a></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-emerald-200/60 flex items-start gap-2 text-[11px] text-emerald-900/80">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{t('donation_disclaimer')}</span>
              </div>
            </div>
          </div>

          {/* Instructions Notice */}
          {instructions && (
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 sm:p-4 text-amber-950 text-xs">
              <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-900">
                <HelpCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{t('donation_instructions_title')}</span>
              </div>
              <p className="leading-relaxed opacity-90 text-[11px] sm:text-xs">{instructions}</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-50 p-3.5 sm:p-4 border-t border-stone-200 flex items-center justify-between gap-2">
          <span className="text-[11px] text-stone-500 truncate max-w-[200px] sm:max-w-xs">
            {getField(settings, 'tagline')}
          </span>
          <button
            onClick={onClose}
            className="px-4 sm:px-5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-semibold transition-colors shrink-0"
          >
            {t('back')}
          </button>
        </div>
      </div>
    </div>
  );
};
