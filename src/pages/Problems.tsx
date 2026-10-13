import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Problem } from '../types';
import { getProblems } from '../lib/db';
import { SafeImage } from '../components/common/SafeImage';
import { VideoEmbed } from '../components/common/VideoEmbed';
import { 
  HelpCircle, 
  Heart, 
  CheckCircle, 
  Archive, 
  FileText, 
  X, 
  ExternalLink, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface ProblemsProps {
  onOpenDonate: () => void;
}

export const Problems: React.FC<ProblemsProps> = ({ onOpenDonate }) => {
  const { t, getField, isRtl } = useLanguage();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved' | 'archived'>('active');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProblems() {
      try {
        const data = await getProblems(false);
        setProblems(data);
      } catch (err) {
        console.error('Failed to load problems:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProblems();
  }, []);

  const filteredProblems = problems.filter((p) => {
    if (statusFilter === 'all') return true;
    return p.status === statusFilter;
  });

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-4 py-1.5 rounded-full border border-amber-200/60 inline-flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t('sec_needs_title')}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
            {isRtl ? 'ادارے کی موجودہ ضروریات و اپیلیں' : 'Current Institutional Needs & Appeals'}
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {t('sec_needs_subtitle')}
          </p>

          {/* Status Filter Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-4">
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'active'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {t('status_active')}
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'resolved'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {t('status_resolved')}
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'all'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {t('all_status')}
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span className="text-sm text-stone-500">Loading current needs...</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredProblems.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/80 p-8 max-w-md mx-auto">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-700 mb-1">
              {t('no_needs')}
            </h3>
            <p className="text-xs text-stone-500">
              There are currently no items under this status.
            </p>
          </div>
        )}

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProblems.map((prob) => {
            const title = getField(prob, 'title');
            const summary = getField(prob, 'summary');
            const isResolved = prob.status === 'resolved';
            const isArchived = prob.status === 'archived';

            return (
              <div
                key={prob.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-200/80 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-stone-100 relative">
                    <SafeImage
                      src={prob.image_url}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex items-center gap-1.5">
                      {prob.status === 'active' && (
                        <span className="text-[11px] font-bold bg-amber-500 text-stone-950 px-2.5 py-0.5 rounded-full shadow-xs">
                          {t('status_active')}
                        </span>
                      )}
                      {isResolved && (
                        <span className="text-[11px] font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                          {t('status_resolved')}
                        </span>
                      )}
                      {isArchived && (
                        <span className="text-[11px] font-bold bg-stone-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                          {t('status_archived')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    {prob.requested_amount && (
                      <div className="text-xs font-semibold text-stone-500">
                        <span>{t('requested_target')} </span>
                        <span className="font-bold text-stone-900 text-sm">{prob.requested_amount}</span>
                      </div>
                    )}

                    <h2 className="text-xl font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                      {title}
                    </h2>

                    <p className="text-stone-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                      {summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 space-y-2">
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                    <button
                      onClick={() => setSelectedProblem(prob)}
                      className="flex-1 min-w-[120px] py-2.5 px-3 bg-stone-50 hover:bg-stone-100 text-stone-800 font-bold text-xs rounded-xl border border-stone-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>{t('view_details')}</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                    </button>

                    {prob.status === 'active' && (
                      <button
                        onClick={onOpenDonate}
                        className="py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <Heart className="w-3.5 h-3.5 text-amber-300" />
                        <span>{t('hero_btn_support')}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Need Modal */}
        {selectedProblem && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in"
            role="dialog"
            aria-modal="true"
          >
            <div 
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white/95 backdrop-blur-md p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full">
                    {t('need_details')}
                  </span>
                  {selectedProblem.requested_amount && (
                    <span className="text-xs font-bold text-stone-900 bg-stone-100 px-3 py-1 rounded-full">
                      {selectedProblem.requested_amount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedProblem(null)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
                {selectedProblem.video_url ? (
                  <VideoEmbed url={selectedProblem.video_url} title={getField(selectedProblem, 'title')} />
                ) : selectedProblem.image_url ? (
                  <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-stone-100">
                    <SafeImage
                      src={selectedProblem.image_url}
                      alt={getField(selectedProblem, 'title')}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}

                <div>
                  <h3 className="text-2xl font-bold text-stone-900 mb-2">
                    {getField(selectedProblem, 'title')}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {getField(selectedProblem, 'description') || getField(selectedProblem, 'summary')}
                  </p>
                </div>

                {/* Why Crucial */}
                {getField(selectedProblem, 'why_needed') && (
                  <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-100 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-amber-700" />
                      <span>{t('why_needed')}</span>
                    </h4>
                    <p className="text-amber-950 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                      {getField(selectedProblem, 'why_needed')}
                    </p>
                  </div>
                )}

                {/* Donation Note */}
                {getField(selectedProblem, 'donation_note') && (
                  <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-100 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-emerald-700" />
                      <span>{t('support_instructions')}</span>
                    </h4>
                    <p className="text-emerald-950 text-xs sm:text-sm leading-relaxed">
                      {getField(selectedProblem, 'donation_note')}
                    </p>
                  </div>
                )}

                {/* Supporting Document Link */}
                {selectedProblem.supporting_doc_url && (
                  <div className="pt-2">
                    <a
                      href={selectedProblem.supporting_doc_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{isRtl ? 'تصدیقی دستاویز ملاحظہ کریں' : 'View Supporting Documentation / Quotation'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>

              <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
                <button
                  onClick={() => setSelectedProblem(null)}
                  className="px-5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-semibold"
                >
                  {t('back')}
                </button>

                {selectedProblem.status === 'active' && (
                  <button
                    onClick={() => {
                      setSelectedProblem(null);
                      onOpenDonate();
                    }}
                    className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <Heart className="w-3.5 h-3.5 text-amber-300" />
                    <span>{t('hero_btn_support')}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
