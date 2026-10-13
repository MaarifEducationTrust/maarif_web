import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  const { t, isRtl } = useLanguage();

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-md text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto text-2xl font-extrabold font-sans">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            {isRtl ? 'صفحہ دستیاب نہیں ہے' : 'Page Not Found'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            {isRtl 
              ? 'معذرت، آپ کی مطلوبہ دستاویز یا صفحہ منتقل ہو چکا ہے یا موجود نہیں ہے۔' 
              : 'The requested page or resource could not be found. Please return to the homepage.'}
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>{isRtl ? 'صفحۂ اول پر واپس جائیں' : 'Back to Home'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
