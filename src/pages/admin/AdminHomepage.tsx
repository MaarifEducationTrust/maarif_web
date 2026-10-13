import React, { useState, useEffect } from 'react';
import { SiteSettings, HomepageSection } from '../../types';
import { 
  getSiteSettings, 
  updateSiteSettings, 
  getHomepageSections, 
  updateHomepageSection 
} from '../../lib/db';
import { SafeImage } from '../../components/common/SafeImage';
import { VideoEmbed } from '../../components/common/VideoEmbed';
import { 
  Save, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Video, 
  Sparkles, 
  HelpCircle,
  LayoutTemplate
} from 'lucide-react';

export const AdminHomepage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [sSettings, sSections] = await Promise.all([
          getSiteSettings(),
          getHomepageSections(),
        ]);
        setSettings(sSettings);
        setSections(sSections);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to load homepage configuration');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSettingsChange = (field: keyof SiteSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const handleToggleSection = async (sectionId: string, currentVisible: boolean) => {
    try {
      const updatedVisible = !currentVisible;
      await updateHomepageSection({ id: sectionId, is_visible: updatedVisible });
      setSections(sections.map(s => s.id === sectionId ? { ...s, is_visible: updatedVisible } : s));
      setSuccessMessage('Section visibility updated');
      setTimeout(() => setSuccessMessage(null), 2500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to toggle section');
    }
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const updated = await updateSiteSettings(settings);
      setSettings(updated);
      setSuccessMessage('Homepage content successfully updated!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="text-center py-20">
        <div className="w-8 h-8 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span className="text-xs text-stone-500">Loading homepage settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
          Homepage Configuration & Sections
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Customize hero messages, section visibility toggles, introductory video, and institutional narrative.
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

      {/* Section Visibility Toggles */}
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
          <LayoutTemplate className="w-5 h-5 text-emerald-800" />
          <h2 className="text-base font-bold text-stone-900">
            Homepage Section Visibility Toggles
          </h2>
        </div>
        <p className="text-xs text-stone-500">
          Toggle which sections appear on the live homepage. Changes take effect immediately.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {sections.map((sec) => (
            <div
              key={sec.id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between transition-colors ${
                sec.is_visible
                  ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950'
                  : 'bg-stone-50 border-stone-200 text-stone-400'
              }`}
            >
              <div>
                <span className="text-xs font-bold block">{sec.title_en}</span>
                <span className="text-[11px] opacity-70 font-urdu">{sec.title_ur}</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleSection(sec.id, sec.is_visible)}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                  sec.is_visible
                    ? 'bg-emerald-800 text-white hover:bg-emerald-900'
                    : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                }`}
                title={sec.is_visible ? 'Visible on Homepage' : 'Hidden from Homepage'}
              >
                {sec.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-8">
        {/* Hero Section Content */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-stone-200/80 shadow-2xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
            <Sparkles className="w-5 h-5 text-emerald-800" />
            <h2 className="text-base font-bold text-stone-900">
              Hero Banner Text & Main Photograph
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Hero Badge / Ribbon (English)
              </label>
              <input
                type="text"
                value={settings.hero_badge_en}
                onChange={(e) => handleSettingsChange('hero_badge_en', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Hero Badge (Urdu)
              </label>
              <input
                type="text"
                dir="rtl"
                value={settings.hero_badge_ur}
                onChange={(e) => handleSettingsChange('hero_badge_ur', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white font-urdu"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Hero Main Headline (English)
              </label>
              <input
                type="text"
                value={settings.hero_title_en}
                onChange={(e) => handleSettingsChange('hero_title_en', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Hero Main Headline (Urdu / مرکزی عنوان)
              </label>
              <input
                type="text"
                dir="rtl"
                value={settings.hero_title_ur}
                onChange={(e) => handleSettingsChange('hero_title_ur', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white font-urdu"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Hero Subtitle (English)
              </label>
              <textarea
                rows={3}
                value={settings.hero_subtitle_en}
                onChange={(e) => handleSettingsChange('hero_subtitle_en', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Hero Subtitle (Urdu / ذیلی تعارف)
              </label>
              <textarea
                rows={3}
                dir="rtl"
                value={settings.hero_subtitle_ur}
                onChange={(e) => handleSettingsChange('hero_subtitle_ur', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white font-urdu"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Hero Photograph URL (External link or Google Drive link)
              </label>
              <div className="flex gap-4 items-start">
                <input
                  type="url"
                  value={settings.hero_image_url}
                  onChange={(e) => handleSettingsChange('hero_image_url', e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-xs font-mono focus:bg-white"
                />
                <div className="w-24 h-16 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                  <SafeImage src={settings.hero_image_url} alt="Hero preview" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Intro Video Configuration */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-stone-200/80 shadow-2xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
            <Video className="w-5 h-5 text-emerald-800" />
            <h2 className="text-base font-bold text-stone-900">
              Introductory Video Configuration
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Video Title (English)
              </label>
              <input
                type="text"
                value={settings.intro_video_title_en}
                onChange={(e) => handleSettingsChange('intro_video_title_en', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Video Title (Urdu)
              </label>
              <input
                type="text"
                dir="rtl"
                value={settings.intro_video_title_ur}
                onChange={(e) => handleSettingsChange('intro_video_title_ur', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white font-urdu"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Video URL (YouTube URL or Google Drive preview link)
              </label>
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=... or Google Drive URL"
                value={settings.intro_video_url}
                onChange={(e) => handleSettingsChange('intro_video_url', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-xs font-mono focus:bg-white"
              />
            </div>

            {settings.intro_video_url && (
              <div className="md:col-span-2">
                <span className="block text-xs font-bold text-stone-500 mb-2">Live Video Embed Preview</span>
                <div className="max-w-md">
                  <VideoEmbed url={settings.intro_video_url} title={settings.intro_video_title_en} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* About Section Narrative */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-stone-200/80 shadow-2xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
            <LayoutTemplate className="w-5 h-5 text-emerald-800" />
            <h2 className="text-base font-bold text-stone-900">
              About Section & Objectives Narrative
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Brief History (English)
              </label>
              <textarea
                rows={4}
                value={settings.about_history_en}
                onChange={(e) => handleSettingsChange('about_history_en', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Brief History (Urdu / تاریخ و پس منظر)
              </label>
              <textarea
                rows={4}
                dir="rtl"
                value={settings.about_history_ur}
                onChange={(e) => handleSettingsChange('about_history_ur', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white font-urdu"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Mission Statement (English)
              </label>
              <textarea
                rows={3}
                value={settings.about_mission_en}
                onChange={(e) => handleSettingsChange('about_mission_en', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Mission Statement (Urdu / مشن)
              </label>
              <textarea
                rows={3}
                dir="rtl"
                value={settings.about_mission_ur}
                onChange={(e) => handleSettingsChange('about_mission_ur', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white font-urdu"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Educational Objectives (English)
              </label>
              <textarea
                rows={4}
                value={settings.about_objectives_en}
                onChange={(e) => handleSettingsChange('about_objectives_en', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Educational Objectives (Urdu / بنیادی مقاصد)
              </label>
              <textarea
                rows={4}
                dir="rtl"
                value={settings.about_objectives_ur}
                onChange={(e) => handleSettingsChange('about_objectives_ur', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:bg-white font-urdu"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end gap-3 sticky bottom-4 z-20 bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-stone-200 shadow-md">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Homepage Updates'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
