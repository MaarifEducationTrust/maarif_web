import React, { useState, useEffect } from 'react';
import { SiteSettings } from '../../types';
import { getSiteSettings, updateSiteSettings } from '../../lib/db';
import { SafeImage } from '../../components/common/SafeImage';
import { 
  Save, 
  CheckCircle, 
  AlertCircle, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Share2, 
  FileText,
  Image as ImageIcon
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
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
        setErrorMessage(err.message || 'Failed to load settings');
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
      setSuccessMessage('Site settings saved and updated successfully!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="text-center py-20">
        <div className="w-8 h-8 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span className="text-xs text-stone-500">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
          Madrasa Institutional Information
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Configure institutional names, bilingual taglines, contact numbers, and public addresses.
        </p>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Name and Identity */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-stone-200/80 shadow-2xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
            <Building className="w-5 h-5 text-emerald-800" />
            <h2 className="text-base font-bold text-stone-900">
              Institutional Identity & Logo
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Madrasa Name (English)
              </label>
              <input
                type="text"
                required
                value={settings.madrasa_name_en}
                onChange={(e) => handleChange('madrasa_name_en', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Madrasa Name (Urdu / اردو نام)
              </label>
              <input
                type="text"
                dir="rtl"
                required
                value={settings.madrasa_name_ur}
                onChange={(e) => handleChange('madrasa_name_ur', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 font-urdu"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Tagline / Motto (English)
              </label>
              <input
                type="text"
                value={settings.tagline_en}
                onChange={(e) => handleChange('tagline_en', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Tagline / Motto (Urdu / سلوگن)
              </label>
              <input
                type="text"
                dir="rtl"
                value={settings.tagline_ur}
                onChange={(e) => handleChange('tagline_ur', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 font-urdu"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Logo URL (External link or Google Drive link)
              </label>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or Google Drive URL"
                    value={settings.logo_url}
                    onChange={(e) => handleChange('logo_url', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 font-mono text-xs"
                  />
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    Supported: Direct image URLs or Google Drive share links.
                  </span>
                </div>
                <div className="w-16 h-16 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center">
                  {settings.logo_url ? (
                    <SafeImage
                      src={settings.logo_url}
                      alt="Logo preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-stone-400" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Contact Information */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-stone-200/80 shadow-2xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
            <Phone className="w-5 h-5 text-emerald-800" />
            <h2 className="text-base font-bold text-stone-900">
              Contact Channels & Address
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Official Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white"
              />
            </div>

            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Campus Address (English)
                </label>
                <textarea
                  rows={2}
                  value={settings.address_en}
                  onChange={(e) => handleChange('address_en', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Campus Address (Urdu / پتہ)
                </label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={settings.address_ur}
                  onChange={(e) => handleChange('address_ur', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white font-urdu"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Social & Footer */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-stone-200/80 shadow-2xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
            <Share2 className="w-5 h-5 text-emerald-800" />
            <h2 className="text-base font-bold text-stone-900">
              Social Links & Footer Text
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Facebook URL
              </label>
              <input
                type="url"
                value={settings.facebook_url}
                onChange={(e) => handleChange('facebook_url', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                YouTube Channel URL
              </label>
              <input
                type="url"
                value={settings.youtube_url}
                onChange={(e) => handleChange('youtube_url', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Twitter / X URL
              </label>
              <input
                type="url"
                value={settings.twitter_url}
                onChange={(e) => handleChange('twitter_url', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white text-xs font-mono"
              />
            </div>

            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Footer Summary (English)
                </label>
                <textarea
                  rows={2}
                  value={settings.footer_text_en}
                  onChange={(e) => handleChange('footer_text_en', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Footer Summary (Urdu)
                </label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={settings.footer_text_ur}
                  onChange={(e) => handleChange('footer_text_ur', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white font-urdu"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit bar */}
        <div className="flex justify-end gap-3 sticky bottom-4 z-20 bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-stone-200 shadow-md">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
