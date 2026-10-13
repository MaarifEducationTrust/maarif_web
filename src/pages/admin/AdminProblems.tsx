import React, { useState, useEffect } from 'react';
import { Problem } from '../../types';
import { getProblems, saveProblem, deleteProblem } from '../../lib/db';
import { SafeImage } from '../../components/common/SafeImage';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  X, 
  Save, 
  Eye, 
  EyeOff, 
  HelpCircle,
  FileText
} from 'lucide-react';

export const AdminProblems: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingProblem, setEditingProblem] = useState<Partial<Problem> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    try {
      const data = await getProblems(true); // adminMode = true
      setProblems(data);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load needs' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateNew = () => {
    setIsNew(true);
    setEditingProblem({
      title_en: '',
      title_ur: '',
      slug: `need-${Date.now()}`,
      summary_en: '',
      summary_ur: '',
      description_en: '',
      description_ur: '',
      why_needed_en: '',
      why_needed_ur: '',
      requested_amount: '',
      status: 'active',
      image_url: '',
      video_url: '',
      supporting_doc_url: '',
      donation_note_en: '',
      donation_note_ur: '',
      display_order: problems.length + 1,
      is_published: true,
    });
  };

  const handleEdit = (prob: Problem) => {
    setIsNew(false);
    setEditingProblem({ ...prob });
  };

  const handleTogglePublish = async (prob: Problem) => {
    try {
      await saveProblem({ id: prob.id, is_published: !prob.is_published });
      setProblems(problems.map(p => p.id === prob.id ? { ...p, is_published: !prob.is_published } : p));
      setMessage({ type: 'success', text: `Item ${!prob.is_published ? 'published' : 'saved to draft'}` });
      setTimeout(() => setMessage(null), 2500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to toggle status' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProblem) return;

    setSaving(true);
    try {
      await saveProblem(editingProblem);
      await loadData();
      setEditingProblem(null);
      setMessage({ type: 'success', text: 'Institutional need saved successfully' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save need' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this appeal? This cannot be undone.')) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteProblem(id);
      setProblems(problems.filter(p => p.id !== id));
      setMessage({ type: 'success', text: 'Item deleted' });
      setTimeout(() => setMessage(null), 2500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete' });
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = problems.filter(p => 
    (p.title_en + ' ' + p.title_ur).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Current Institutional Needs & Appeals
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage infrastructure requests, student sponsorships, and active project appeals.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Need</span>
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

      {/* Search Bar */}
      <div className="max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search appeals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
        </div>
      </div>

      {/* Problems Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[620px]">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Need Title</th>
                <th className="py-3.5 px-4">Urdu Title</th>
                <th className="py-3.5 px-4">Estimate</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Published</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">Loading appeals...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">No current needs recorded.</td>
                </tr>
              ) : (
                filtered.map((prob) => (
                  <tr key={prob.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-bold text-stone-900 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                        {prob.image_url ? (
                          <SafeImage src={prob.image_url} alt={prob.title_en} className="w-full h-full object-cover" />
                        ) : (
                          <HelpCircle className="w-5 h-5 text-stone-400 m-auto mt-2.5" />
                        )}
                      </div>
                      <div>
                        <span>{prob.title_en}</span>
                        <span className="block text-[11px] text-stone-400 font-mono font-normal">slug: {prob.slug}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-urdu text-sm font-semibold">{prob.title_ur}</td>
                    <td className="py-4 px-4 font-semibold text-stone-900">{prob.requested_amount || '—'}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        prob.status === 'active' 
                          ? 'bg-amber-100 text-amber-800' 
                          : prob.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-100 text-stone-600'
                      }`}>
                        {prob.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleTogglePublish(prob)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          prob.is_published 
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}
                      >
                        {prob.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{prob.is_published ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(prob)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(prob.id)}
                          disabled={deletingId === prob.id}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-red-100 text-stone-600 hover:text-red-700 transition-colors"
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

      {/* Create / Edit Modal */}
      {editingProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur-md p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between z-10">
              <h2 className="text-base font-bold text-stone-900">
                {isNew ? 'Create New Institutional Appeal' : 'Edit Institutional Appeal'}
              </h2>
              <button onClick={() => setEditingProblem(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Title (English)</label>
                  <input
                    type="text"
                    required
                    value={editingProblem.title_en || ''}
                    onChange={(e) => setEditingProblem({ ...editingProblem, title_en: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Title (Urdu / عنوان)</label>
                  <input
                    type="text"
                    dir="rtl"
                    required
                    value={editingProblem.title_ur || ''}
                    onChange={(e) => setEditingProblem({ ...editingProblem, title_ur: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white font-urdu"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Status</label>
                  <select
                    value={editingProblem.status || 'active'}
                    onChange={(e) => setEditingProblem({ ...editingProblem, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white"
                  >
                    <option value="active">Active Appeal</option>
                    <option value="resolved">Resolved / Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Requested Amount / Estimate</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹ 1,75,000 or ₹ 2,400 / month"
                    value={editingProblem.requested_amount || ''}
                    onChange={(e) => setEditingProblem({ ...editingProblem, requested_amount: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Image URL (Google Drive / Web link)</label>
                  <input
                    type="url"
                    value={editingProblem.image_url || ''}
                    onChange={(e) => setEditingProblem({ ...editingProblem, image_url: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs font-mono focus:bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Supporting Document URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://... quotation or PDF"
                    value={editingProblem.supporting_doc_url || ''}
                    onChange={(e) => setEditingProblem({ ...editingProblem, supporting_doc_url: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs font-mono focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Summary (English)</label>
                  <textarea
                    rows={2}
                    required
                    value={editingProblem.summary_en || ''}
                    onChange={(e) => setEditingProblem({ ...editingProblem, summary_en: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Summary (Urdu / خلاصہ)</label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    required
                    value={editingProblem.summary_ur || ''}
                    onChange={(e) => setEditingProblem({ ...editingProblem, summary_ur: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white font-urdu"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Why Needed / Crucial Context (English)</label>
                  <textarea
                    rows={3}
                    required
                    value={editingProblem.why_needed_en || ''}
                    onChange={(e) => setEditingProblem({ ...editingProblem, why_needed_en: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Why Needed (Urdu / ضرورت و اہمیت)</label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    required
                    value={editingProblem.why_needed_ur || ''}
                    onChange={(e) => setEditingProblem({ ...editingProblem, why_needed_ur: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white font-urdu"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Donation Instructions / Note (English)</label>
                  <textarea
                    rows={2}
                    value={editingProblem.donation_note_en || ''}
                    onChange={(e) => setEditingProblem({ ...editingProblem, donation_note_en: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Donation Instructions (Urdu)</label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    value={editingProblem.donation_note_ur || ''}
                    onChange={(e) => setEditingProblem({ ...editingProblem, donation_note_ur: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white font-urdu"
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="prob_published"
                    checked={editingProblem.is_published ?? true}
                    onChange={(e) => setEditingProblem({ ...editingProblem, is_published: e.target.checked })}
                    className="rounded text-emerald-800 focus:ring-emerald-700 h-4 w-4"
                  />
                  <label htmlFor="prob_published" className="text-xs font-bold text-stone-800">
                    Publish this need publicly (visible on public website)
                  </label>
                </div>
              </div>

              <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end gap-3 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setEditingProblem(null)}
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
                  <span>{saving ? 'Saving...' : 'Save Need'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
