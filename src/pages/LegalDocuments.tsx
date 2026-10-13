import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { LegalDocument } from '../types';
import { getLegalDocuments } from '../lib/db';
import { SafeImage } from '../components/common/SafeImage';
import { 
  Scale, 
  FileText, 
  ExternalLink, 
  ShieldCheck, 
  Calendar, 
  Eye, 
  X,
  Search
} from 'lucide-react';

export const LegalDocuments: React.FC = () => {
  const { t, getField, isRtl } = useLanguage();
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<LegalDocument | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocs() {
      try {
        const data = await getLegalDocuments(false);
        setDocuments(data);
      } catch (err) {
        console.error('Failed to load legal documents:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDocs();
  }, []);

  const categories = ['all', ...Array.from(new Set(documents.map((d) => d.category_en)))];

  const filteredDocs = documents.filter((d) => {
    if (categoryFilter === 'all') return true;
    return d.category_en === categoryFilter;
  });

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-4 py-1.5 rounded-full border border-emerald-200/60 inline-flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" />
            <span>{t('sec_documents_title')}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
            {isRtl ? 'قانونی اسناد، رجسٹریشن و شفافیت' : 'Legal Documents & Transparency'}
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {t('sec_documents_subtitle')}
          </p>

          {/* Category Filter Pills */}
          {categories.length > 2 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all ${
                    categoryFilter === cat
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {cat === 'all' ? t('all_categories') : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span className="text-sm text-stone-500">Loading documents...</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredDocs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/80 p-8 max-w-md mx-auto">
            <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-700 mb-1">
              {t('no_documents')}
            </h3>
            <p className="text-xs text-stone-500">
              Only documents authorized for public distribution are visible.
            </p>
          </div>
        )}

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDocs.map((doc) => {
            const title = getField(doc, 'title');
            const desc = getField(doc, 'description');
            const category = getField(doc, 'category');

            return (
              <div
                key={doc.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-200/80 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {doc.thumbnail_url ? (
                    <div className="aspect-[16/10] overflow-hidden bg-stone-100 relative">
                      <SafeImage
                        src={doc.thumbnail_url}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 rtl:left-auto rtl:right-3 text-[11px] font-bold bg-emerald-950/80 text-amber-300 px-3 py-0.5 rounded-full backdrop-blur-xs border border-amber-400/20">
                        {t('verified_badge')}
                      </span>
                    </div>
                  ) : (
                    <div className="aspect-[16/8] bg-stone-50 p-6 flex items-center justify-between border-b border-stone-100">
                      <div className="flex items-center gap-3">
                        <span className="p-3 bg-emerald-100/70 text-emerald-800 rounded-2xl">
                          <FileText className="w-6 h-6" />
                        </span>
                        <div>
                          <span className="text-[11px] font-bold text-stone-500 uppercase block">
                            {category}
                          </span>
                          <span className="text-xs text-emerald-900 font-semibold">
                            {t('public_doc')}
                          </span>
                        </div>
                      </div>
                      <ShieldCheck className="w-6 h-6 text-emerald-700 opacity-60" />
                    </div>
                  )}

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        {category}
                      </span>
                      {doc.issue_date && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>{doc.issue_date}</span>
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                      {title}
                    </h2>

                    {doc.document_number && (
                      <p className="text-xs font-mono text-stone-500 bg-stone-50 px-2.5 py-1 rounded-md inline-block">
                        Doc ID: {doc.document_number}
                      </p>
                    )}

                    {desc && (
                      <p className="text-stone-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                        {desc}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDoc(doc)}
                    className="flex-1 py-2.5 px-3 bg-stone-50 hover:bg-stone-100 text-stone-800 font-bold text-xs rounded-xl border border-stone-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-stone-500" />
                    <span>{t('view_document')}</span>
                  </button>

                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl transition-colors shadow-2xs"
                    title={t('open_document')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Document Preview Modal */}
        {selectedDoc && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in"
            role="dialog"
            aria-modal="true"
          >
            <div 
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white/95 backdrop-blur-md p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                    {getField(selectedDoc, 'category')}
                  </span>
                  {selectedDoc.document_number && (
                    <span className="text-xs font-mono text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full">
                      {selectedDoc.document_number}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-stone-900 mb-2">
                    {getField(selectedDoc, 'title')}
                  </h3>
                  {selectedDoc.issue_date && (
                    <span className="text-xs text-stone-500 block mb-2">
                      Issued: {selectedDoc.issue_date}
                    </span>
                  )}
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {getField(selectedDoc, 'description')}
                  </p>
                </div>

                {/* Document Viewer Frame or link */}
                <div className="bg-stone-100 rounded-2xl p-6 text-center border border-stone-200 space-y-4">
                  <FileText className="w-16 h-16 text-emerald-800 mx-auto opacity-70" />
                  <div>
                    <h4 className="font-bold text-stone-800 text-sm mb-1">
                      Verified Institutional PDF / Document
                    </h4>
                    <p className="text-xs text-stone-500 max-w-md mx-auto">
                      This official certificate is stored on our verified institutional repository. Click below to view the original file.
                    </p>
                  </div>
                  <a
                    href={selectedDoc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                  >
                    <span>{t('open_document')}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-semibold"
                >
                  {t('back')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
