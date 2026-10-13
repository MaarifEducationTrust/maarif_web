import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { SiteSettings } from '../../types';
import { SafeImage } from '../common/SafeImage';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Shield, 
  Lock, 
  Heart,
  ExternalLink
} from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
  onOpenDonate: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenDonate }) => {
  const { t, getField } = useLanguage();

  const madrasaName = getField(settings, 'madrasa_name');
  const footerText = getField(settings, 'footer_text');
  const address = getField(settings, 'address');
  const copyrightText = getField(settings, 'copyright_text');

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Madrasa Identity */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900 p-1 flex items-center justify-center border border-amber-500/30">
                {settings.logo_url ? (
                  <SafeImage
                    src={settings.logo_url}
                    alt={madrasaName}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <span className="text-amber-400 font-bold text-xl">م</span>
                )}
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {madrasaName}
              </span>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              {footerText}
            </p>

            {/* Social Links if available */}
            <div className="flex items-center gap-3 pt-2">
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-emerald-900 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
              )}
              {settings.youtube_url && (
                <a
                  href={settings.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-emerald-900 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
              {settings.twitter_url && (
                <a
                  href={settings.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-emerald-900 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-stone-800 pb-2">
              {t('quick_links')}
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="text-stone-300 hover:text-amber-300 transition-colors">
                  {t('nav_home')}
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-stone-300 hover:text-amber-300 transition-colors">
                  {t('nav_programs')}
                </Link>
              </li>
              <li>
                <Link to="/activities" className="text-stone-300 hover:text-amber-300 transition-colors">
                  {t('nav_activities')}
                </Link>
              </li>
              <li>
                <Link to="/needs" className="text-stone-300 hover:text-amber-300 transition-colors">
                  {t('nav_needs')}
                </Link>
              </li>
              <li>
                <Link to="/students" className="text-stone-300 hover:text-amber-300 transition-colors">
                  {t('nav_students')}
                </Link>
              </li>
              <li>
                <Link to="/documents" className="text-stone-300 hover:text-amber-300 transition-colors">
                  {t('nav_documents')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Address */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-stone-800 pb-2">
              {t('contact_us')}
            </h3>
            <div className="space-y-3 text-xs text-stone-400">
              {address && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{address}</span>
                </div>
              )}
              {settings.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                  <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                    {settings.phone}
                  </a>
                </div>
              )}
              {settings.email && (
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                    {settings.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Col 4: Transparency & Contribution */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-stone-800 pb-2">
              {t('legal_transparency')}
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Official registration and tax exemption documents are available for public verification.
            </p>
            <div className="space-y-2">
              <Link
                to="/documents"
                className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 font-semibold"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{t('view_document')}</span>
              </Link>
            </div>

            {settings.donation_enabled && (
              <button
                onClick={onOpenDonate}
                className="w-full mt-2 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors border border-amber-500/20 shadow-sm"
              >
                <Heart className="w-3.5 h-3.5 text-amber-300" />
                <span>{t('nav_donate')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-800/80 bg-stone-950 py-5 px-4 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} {copyrightText}
          </p>
          <div className="flex items-center gap-6">
            <Link 
              to="/admin" 
              className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5 font-medium opacity-80 hover:opacity-100"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t('admin_login_link')}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
