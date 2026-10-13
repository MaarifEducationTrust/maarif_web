import React, { useState, useEffect } from 'react';
import { LegalDocument } from '../../types';
import { getLegalDocuments, saveLegalDocument, deleteLegalDocument } from '../../lib/db';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Save, 
  Eye, 
  EyeOff, 
  FileText,
  Lock,
  Unlock,
  ExternalLink
} from 'lucide-react';

export const AdminDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDoc, setEditingDoc] = useState<Partial<LegalDocument> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    try {
      const data = await getLegalDocuments(true); // adminMode = true
      setDocuments(data);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load documents' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateNew = () => {
    setIsNew(true);
    setEditingDoc({
      title_en: '',
      title_ur: '',
      description_en: '',
      description_ur: '',
      category_en: 'Registration Certificate',
      category_ur: 'رجسٹریشن سند',
      file_url: '',
      thumbnail_url: '',
      issue_date: '',
      document_number: '',
      is_public: true,
      is_published: true,
      display_order: documents.length + 1,
    });
  };

  const handleEdit = (doc: LegalDocument) => {
    setIsNew(false);
    setEditingDoc({ ...doc });
  };

  const handleTogglePublish = async (doc: LegalDocument) => {
    try {
      await saveLegalDocument({ id: doc.id, is_published: !doc.is_published });
      setDocuments(documents.map(d => d.id === doc.id ? { ...d, is_published: !doc.is_published } : d));
      setMessage({ type: 'success', text: `Document ${!doc.is_published ? 'published' : 'drafted'}` });
      setTimeout(() => setMessage(null), 2500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update' });
    }
  };

  const handleTogglePublic = async (doc: LegalDocument) => {
    try {
      await saveLegalDocument({ id: doc.id, is_public: !doc.is_public });
      setDocuments(documents.map(d => d.id === doc.id ? { ...d, is_public: !doc.is_public } : d));
      setMessage({ type: 'success', text: `Document visibility set to ${!doc.is_public ? 'Public' : 'Private (Admin Only)'}` });
      setTimeout(() => setMessage(null), 2500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update visibility' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;

    setSaving(true);
    try {
      await saveLegalDocument(editingDoc);
      await loadData();
      setEditingDoc(null);
      setMessage({ type: 'success', text: 'Document record saved successfully' });
      setTimeout(() => setMessage(null), 2500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save document' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this document record?')) return;
    try {
      await deleteLegalDocument(id);
      setDocuments(documents.filter(d => d.id !== id));
      setMessage({ type: 'success', text: 'Document record removed' });
      setTimeout(() => setMessage(null), 2500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Institutional Legal Documents & Trust Records
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage society registrations, tax exemptions, and board affiliations.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Document</span>
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[620px]">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Document Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Doc ID / No.</th>
                <th className="py-3.5 px-4">Audience</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">Loading documents...</td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">No documents listed.</td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-bold text-stone-900 flex items-center gap-3">
                      <span className="p-2 bg-stone-100 text-emerald-800 rounded-lg shrink-0">
                        <FileText className="w-4 h-4" />
                      </span>
                      <div>
                        <span>{doc.title_en}</span>
                        <span className="block text-[11px] text-stone-500 font-urdu">{doc.title_ur}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-stone-600">{doc.category_en}</td>
                    <td className="py-4 px-4 font-mono text-[11px]">{doc.document_number || '—'}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleTogglePublic(doc)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          doc.is_public ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                        title="Click to toggle Public / Private"
                      >
                        {doc.is_public ? <Unlock className="w-3 h-3 text-emerald-600" /> : <Lock className="w-3 h-3 text-amber-600" />}
                        <span>{doc.is_public ? 'Public Document' : 'Private (Internal)'}</span>
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleTogglePublish(doc)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          doc.is_published 
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}
                      >
                        {doc.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{doc.is_published ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {doc.file_url && (
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 inline-block"
                            title="Open Link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => handleEdit(doc)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-red-100 text-stone-600 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div 
            className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur-md p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between z-10">
              <h2 className="text-sm sm:text-base font-bold text-stone-900">
                {isNew ? 'Add Legal Document Record' : 'Edit Legal Document'}
              </h2>
              <button onClick={() => setEditingDoc(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Title (English)</label>
                <input
                  type="text"
                  required
                  value={editingDoc.title_en || ''}
                  onChange={(e) => setEditingDoc({ ...editingDoc, title_en: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Title (Urdu / دستاویز کا نام)</label>
                <input
                  type="text"
                  dir="rtl"
                  required
                  value={editingDoc.title_ur || ''}
                  onChange={(e) => setEditingDoc({ ...editingDoc, title_ur: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white font-urdu"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Category (English)</label>
                  <input
                    type="text"
                    required
                    value={editingDoc.category_en || ''}
                    onChange={(e) => setEditingDoc({ ...editingDoc, category_en: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Category (Urdu)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={editingDoc.category_ur || ''}
                    onChange={(e) => setEditingDoc({ ...editingDoc, category_ur: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white font-urdu"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Doc Number / ID</label>
                  <input
                    type="text"
                    placeholder="e.g. REG-TR/2014/8912"
                    value={editingDoc.document_number || ''}
                    onChange={(e) => setEditingDoc({ ...editingDoc, document_number: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs font-mono focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Issue Date</label>
                  <input
                    type="text"
                    placeholder="YYYY-MM-DD"
                    value={editingDoc.issue_date || ''}
                    onChange={(e) => setEditingDoc({ ...editingDoc, issue_date: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Document File URL (Google Drive / PDF link)</label>
                <input
                  type="url"
                  required
                  placeholder="https://... PDF file URL"
                  value={editingDoc.file_url || ''}
                  onChange={(e) => setEditingDoc({ ...editingDoc, file_url: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs font-mono focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Thumbnail Preview URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://... Image preview of certificate"
                  value={editingDoc.thumbnail_url || ''}
                  onChange={(e) => setEditingDoc({ ...editingDoc, thumbnail_url: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs font-mono focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingDoc.description_en || ''}
                  onChange={(e) => setEditingDoc({ ...editingDoc, description_en: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="doc_public"
                    checked={editingDoc.is_public ?? true}
                    onChange={(e) => setEditingDoc({ ...editingDoc, is_public: e.target.checked })}
                    className="rounded text-emerald-800 focus:ring-emerald-700 h-4 w-4"
                  />
                  <label htmlFor="doc_public" className="text-xs font-bold text-stone-800">
                    Public Visibility (checked = anyone can view; unchecked = internal/admin only)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="doc_published"
                    checked={editingDoc.is_published ?? true}
                    onChange={(e) => setEditingDoc({ ...editingDoc, is_published: e.target.checked })}
                    className="rounded text-emerald-800 focus:ring-emerald-700 h-4 w-4"
                  />
                  <label htmlFor="doc_published" className="text-xs font-bold text-stone-800">
                    Publish (active on website)
                  </label>
                </div>
              </div>

              <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end gap-3 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setEditingDoc(null)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Document'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
