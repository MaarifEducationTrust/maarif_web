import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { SiteSettings } from '../../types';
import { SafeImage } from '../common/SafeImage';
import { 
  Menu, 
  X, 
  Heart, 
  Languages, 
  BookOpen, 
  Scale, 
  Users, 
  HelpCircle,
  Home,
  Award
} from 'lucide-react';

interface HeaderProps {
  settings: SiteSettings;
  onOpenDonate: () => void;
}

export const Header: React.FC<HeaderProps> = ({ settings, onOpenDonate }) => {
  const { t, getField, toggleLang, isRtl } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: t('nav_home'), path: '/', icon: Home },
    { name: t('nav_programs'), path: '/programs', icon: BookOpen },
    { name: t('nav_activities'), path: '/activities', icon: Award },
    { name: t('nav_needs'), path: '/needs', icon: HelpCircle },
    { name: t('nav_students'), path: '/students', icon: Users },
    { name: t('nav_documents'), path: '/documents', icon: Scale },
  ];

  const madrasaName = getField(settings, 'madrasa_name');
  const tagline = getField(settings, 'tagline');

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-2xs transition-all w-full">
      {/* Top subtle notification bar */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-1.5 px-3 sm:px-6 lg:px-8 border-b border-emerald-900/40 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-[11px] truncate min-w-0">
            {settings.phone && (
              <span className="hidden sm:inline-flex items-center gap-1 opacity-90 shrink-0">
                <span className="text-amber-400 font-semibold">📞</span> {settings.phone}
              </span>
            )}
            {settings.email && (
              <span className="hidden md:inline-flex items-center gap-1 opacity-90 shrink-0">
                <span className="text-amber-400 font-semibold">✉️</span> {settings.email}
              </span>
            )}
            <span className="truncate text-emerald-200/80 font-medium">
              {tagline}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-900/90 hover:bg-emerald-800 text-amber-300 font-semibold text-[11px] sm:text-xs border border-emerald-700/60 transition-colors shadow-2xs shrink-0"
              title="Switch language / زبان تبدیل کریں"
              aria-label="Switch language"
            >
              <Languages className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{t('nav_switch_lang')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Logo and Institution Title */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3.5 group min-w-0 mr-1 rtl:mr-0 rtl:ml-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 p-1 flex items-center justify-center shadow-md border border-amber-500/30 group-hover:border-amber-400 transition-all shrink-0">
              {settings.logo_url ? (
                <SafeImage
                  src={settings.logo_url}
                  alt={madrasaName}
                  className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                />
              ) : (
                <span className="text-amber-400 font-bold text-lg sm:text-xl">م</span>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm xs:text-base sm:text-lg md:text-xl font-extrabold text-emerald-950 group-hover:text-emerald-800 transition-colors tracking-tight truncate">
                {madrasaName}
              </span>
              <span className="text-[10px] sm:text-[11px] text-stone-500 font-medium truncate hidden xs:block">
                {tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 shrink-0">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all ${
                    active
                      ? 'bg-emerald-50 text-emerald-900 font-bold shadow-2xs border border-emerald-200/60'
                      : 'text-stone-600 hover:text-emerald-900 hover:bg-stone-50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Donate Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {settings.donation_enabled && (
              <button
                onClick={onOpenDonate}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 hover:from-emerald-900 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all border border-amber-500/30 transform active:scale-95 shrink-0"
              >
                <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 fill-amber-300/30 shrink-0" />
                <span className="hidden xs:inline">{t('nav_donate')}</span>
                <span className="xs:hidden">{isRtl ? 'تعاون' : 'Donate'}</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:text-emerald-950 hover:bg-stone-100 transition-colors shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-3.5 sm:px-4 pt-2 pb-6 space-y-2 shadow-xl animate-fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/80'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${active ? 'text-emerald-700' : 'text-stone-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-stone-200 flex flex-col xs:flex-row items-center justify-between gap-2.5">
            <button
              onClick={() => {
                toggleLang();
                setMobileMenuOpen(false);
              }}
              className="w-full xs:flex-1 py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Languages className="w-4 h-4 text-emerald-800" />
              <span>{t('nav_switch_lang')}</span>
            </button>

            {settings.donation_enabled && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDonate();
                }}
                className="w-full xs:flex-1 py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <Heart className="w-4 h-4 text-amber-300" />
                <span>{t('nav_donate')}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
