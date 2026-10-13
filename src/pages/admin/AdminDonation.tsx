import React, { useState, useEffect } from 'react';
import { SiteSettings } from '../../types';
import { getSiteSettings, updateSiteSettings } from '../../lib/db';
import { extractGoogleDriveId } from '../../lib/media';
import { QRCodeDisplay } from '../../components/common/QRCodeDisplay';
import { 
  QrCode, 
  Building2, 
  Save, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  Power,
  Info,
  ExternalLink,
  Trash2
} from 'lucide-react';

export const AdminDonation: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSiteSettings();
        setSettings(data);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to load donation settings');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (field: keyof SiteSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const updated = await updateSiteSettings(settings);
      setSettings(updated);
      setSuccessMessage('Donation configuration and QR details saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save donation settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="text-center py-20">
        <div className="w-8 h-8 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span className="text-xs text-stone-500">Loading donation settings...</span>
      </div>
    );
  }

  const detectedDriveId = extractGoogleDriveId(settings.donation_qr_url);

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-1 sm:px-0">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
          Donation QR Code & Bank Accounts
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Configure verified UPI payment QR code via Google Drive, institutional bank account numbers, and donor guidance.
        </p>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 sm:space-y-8">
        {/* Master Toggle */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200/80 shadow-2xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className={`p-2.5 sm:p-3 rounded-2xl shrink-0 ${settings.donation_enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-400'}`}>
              <Power className="w-5 h-5 sm:w-6 sm:h-6" />
            </span>
            <div className="min-w-0">
              <span className="font-bold text-xs sm:text-sm text-stone-900 block truncate">
                Enable Donation Module on Website
              </span>
              <span className="text-[11px] text-stone-500 hidden xs:block">
                When enabled, the Donate buttons, QR code modal, and contribution guides are shown to visitors.
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={settings.donation_enabled}
              onChange={(e) => handleChange('donation_enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
          </label>
        </div>

        {/* QR Code and UPI ID */}
        <div className="bg-white p-4 sm:p-8 rounded-3xl border border-stone-200/80 shadow-2xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
            <QrCode className="w-5 h-5 text-emerald-800" />
            <h2 className="text-sm sm:text-base font-bold text-stone-900">
              UPI QR Code (Google Drive Hosted) & UPI Identifier
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Donation QR Image URL (Google Drive)
                  </label>
                  {settings.donation_qr_url && (
                    <button
                      type="button"
                      onClick={() => handleChange('donation_qr_url', '')}
                      className="text-[11px] text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear URL</span>
                    </button>
                  )}
                </div>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing"
                  value={settings.donation_qr_url}
                  onChange={(e) => handleChange('donation_qr_url', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                />

                {/* Google Drive Status pill */}
                {detectedDriveId ? (
                  <div className="mt-2 text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>✓ Google Drive File ID Detected: <strong className="font-mono">{detectedDriveId}</strong></span>
                  </div>
                ) : settings.donation_qr_url ? (
                  <div className="mt-2 text-xs text-stone-600 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">
                    Standard Web Image URL Detected
                  </div>
                ) : (
                  <div className="mt-2 text-[11px] text-stone-400">
                    No QR URL currently configured. The website will display a neutral pending notice.
                  </div>
                )}

                {/* Google Drive Instructions Box */}
                <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3.5 mt-3 text-xs text-emerald-950 space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                    <Info className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>How to use your Google Drive QR Image:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-emerald-900/90 pl-1">
                    <li>Upload your official Madrasa QR image file to Google Drive.</li>
                    <li>Right-click the image in Google Drive &gt; <strong>Share</strong> &gt; <strong>Copy link</strong>.</li>
                    <li>Ensure permissions are set to <strong>"Anyone with the link can view"</strong>.</li>
                    <li>Paste the copied sharing link above and click <strong>Save</strong>.</li>
                  </ol>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Verified UPI ID (e.g. for GPay, PhonePe, Paytm)
                </label>
                <input
                  type="text"
                  placeholder="madrasa@sbi"
                  value={settings.upi_id}
                  onChange={(e) => handleChange('upi_id', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-xs sm:text-sm font-mono focus:bg-white"
                />
              </div>
            </div>

            {/* Live QR Preview Box using QRCodeDisplay */}
            <div className="lg:col-span-5 flex flex-col items-center p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center w-full">
              <span className="text-[11px] font-bold text-stone-500 mb-3 uppercase tracking-wider">
                Live Public QR Preview
              </span>
              <QRCodeDisplay
                qrUrl={settings.donation_qr_url}
                upiId={settings.upi_id}
                size="md"
                showDownload={true}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white p-4 sm:p-8 rounded-3xl border border-stone-200/80 shadow-2xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
            <Building2 className="w-5 h-5 text-emerald-800" />
            <h2 className="text-sm sm:text-base font-bold text-stone-900">
              Institutional Bank Account Details (NEFT / RTGS)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Official Account Holder Name
              </label>
              <input
                type="text"
                value={settings.account_holder}
                onChange={(e) => handleChange('account_holder', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-xs sm:text-sm focus:bg-white font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Bank Name
              </label>
              <input
                type="text"
                value={settings.bank_name}
                onChange={(e) => handleChange('bank_name', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-xs sm:text-sm focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Branch Name
              </label>
              <input
                type="text"
                value={settings.branch}
                onChange={(e) => handleChange('branch', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-xs sm:text-sm focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Account Number
              </label>
              <input
                type="text"
                value={settings.account_number}
                onChange={(e) => handleChange('account_number', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-xs sm:text-sm font-mono focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                IFSC Code
              </label>
              <input
                type="text"
                value={settings.ifsc_code}
                onChange={(e) => handleChange('ifsc_code', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-xs sm:text-sm font-mono focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Donation Instructions */}
        <div className="bg-white p-4 sm:p-8 rounded-3xl border border-stone-200/80 shadow-2xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
            <ShieldCheck className="w-5 h-5 text-emerald-800" />
            <h2 className="text-sm sm:text-base font-bold text-stone-900">
              Contribution & Scanning Instructions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Instructions (English)
              </label>
              <textarea
                rows={3}
                value={settings.donation_instructions_en}
                onChange={(e) => handleChange('donation_instructions_en', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-xs sm:text-sm focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Instructions (Urdu / ہدایات)
              </label>
              <textarea
                rows={3}
                dir="rtl"
                value={settings.donation_instructions_ur}
                onChange={(e) => handleChange('donation_instructions_ur', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-xs sm:text-sm focus:bg-white font-urdu"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end gap-3 sticky bottom-3 z-20 bg-white/95 backdrop-blur-sm p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-md">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Donation & QR Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
