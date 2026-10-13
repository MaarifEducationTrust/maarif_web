import React, { useState, useEffect } from 'react';
import { Program } from '../../types';
import { getPrograms, saveProgram, deleteProgram } from '../../lib/db';
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
  BookOpen,
  Image as ImageIcon
} from 'lucide-react';

export const AdminPrograms: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingProgram, setEditingProgram] = useState<Partial<Program> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    try {
      const data = await getPrograms(true); // adminMode = true to fetch drafts as well
      setPrograms(data);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load programs' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateNew = () => {
    setIsNew(true);
    setEditingProgram({
      title_en: '',
      title_ur: '',
      slug: `prog-${Date.now()}`,
      short_desc_en: '',
      short_desc_ur: '',
      detailed_desc_en: '',
      detailed_desc_ur: '',
      age_group_en: '',
      age_group_ur: '',
      timing_en: '',
      timing_ur: '',
      curriculum_highlights_en: '',
      curriculum_highlights_ur: '',
      image_url: '',
      video_url: '',
      display_order: programs.length + 1,
      is_published: true,
    });
  };

  const handleEdit = (prog: Program) => {
    setIsNew(false);
    setEditingProgram({ ...prog });
  };

  const handleTogglePublish = async (prog: Program) => {
    try {
      const updated = await saveProgram({ id: prog.id, is_published: !prog.is_published });
      setPrograms(programs.map(p => p.id === prog.id ? { ...p, is_published: !prog.is_published } : p));
      setMessage({ type: 'success', text: `Program ${!prog.is_published ? 'published' : 'saved to draft'}` });
      setTimeout(() => setMessage(null), 2500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to toggle status' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProgram) return;

    setSaving(true);
    try {
      await saveProgram(editingProgram);
      await loadData();
      setEditingProgram(null);
      setMessage({ type: 'success', text: 'Program saved successfully' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save program' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this educational program? This action cannot be undone.')) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteProgram(id);
      setPrograms(programs.filter(p => p.id !== id));
      setMessage({ type: 'success', text: 'Program removed' });
      setTimeout(() => setMessage(null), 2500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete' });
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = programs.filter(p => 
    (p.title_en + ' ' + p.title_ur).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Educational Programs Management
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Create, edit, reorder, or draft academic offerings.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Program</span>
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
            placeholder="Search programs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
        </div>
      </div>

      {/* Program Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[620px]">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Program Name</th>
                <th className="py-3.5 px-4">Urdu Title</th>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-400">Loading programs...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-400">No programs found.</td>
                </tr>
              ) : (
                filtered.map((prog) => (
                  <tr key={prog.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-bold text-stone-900 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                        {prog.image_url ? (
                          <SafeImage src={prog.image_url} alt={prog.title_en} className="w-full h-full object-cover" />
                        ) : (
                          <BookOpen className="w-5 h-5 text-stone-400 m-auto mt-2.5" />
                        )}
                      </div>
                      <div>
                        <span>{prog.title_en}</span>
                        <span className="block text-[11px] text-stone-400 font-mono font-normal">slug: {prog.slug}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-urdu text-sm font-semibold">{prog.title_ur}</td>
                    <td className="py-4 px-4 font-mono font-semibold">{prog.display_order}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleTogglePublish(prog)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          prog.is_published 
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}
                      >
                        {prog.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{prog.is_published ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(prog)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(prog.id)}
                          disabled={deletingId === prog.id}
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
      {editingProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur-md p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between z-10">
              <h2 className="text-sm sm:text-base font-bold text-stone-900">
                {isNew ? 'Create New Educational Program' : 'Edit Educational Program'}
              </h2>
              <button onClick={() => setEditingProgram(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Title (English)</label>
                  <input
                    type="text"
                    required
                    value={editingProgram.title_en || ''}
                    onChange={(e) => setEditingProgram({ ...editingProgram, title_en: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Title (Urdu / اردو نام)</label>
                  <input
                    type="text"
                    dir="rtl"
                    required
                    value={editingProgram.title_ur || ''}
                    onChange={(e) => setEditingProgram({ ...editingProgram, title_ur: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white font-urdu"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={editingProgram.slug || ''}
                    onChange={(e) => setEditingProgram({ ...editingProgram, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs font-mono focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingProgram.display_order || 1}
                    onChange={(e) => setEditingProgram({ ...editingProgram, display_order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Age Group (English)</label>
                  <input
                    type="text"
                    placeholder="e.g. Ages 8 to 16 years"
                    value={editingProgram.age_group_en || ''}
                    onChange={(e) => setEditingProgram({ ...editingProgram, age_group_en: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Age Group (Urdu)</label>
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="عمر ۸ تا ۱۶ سال"
                    value={editingProgram.age_group_ur || ''}
                    onChange={(e) => setEditingProgram({ ...editingProgram, age_group_ur: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white font-urdu"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Schedule & Timing (English)</label>
                  <input
                    type="text"
                    placeholder="e.g. Full-Time / Boarding"
                    value={editingProgram.timing_en || ''}
                    onChange={(e) => setEditingProgram({ ...editingProgram, timing_en: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Schedule (Urdu)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={editingProgram.timing_ur || ''}
                    onChange={(e) => setEditingProgram({ ...editingProgram, timing_ur: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white font-urdu"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Image URL (Google Drive / Web link)</label>
                  <input
                    type="url"
                    value={editingProgram.image_url || ''}
                    onChange={(e) => setEditingProgram({ ...editingProgram, image_url: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs font-mono focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Short Description (English)</label>
                  <textarea
                    rows={2}
                    required
                    value={editingProgram.short_desc_en || ''}
                    onChange={(e) => setEditingProgram({ ...editingProgram, short_desc_en: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Short Description (Urdu)</label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    required
                    value={editingProgram.short_desc_ur || ''}
                    onChange={(e) => setEditingProgram({ ...editingProgram, short_desc_ur: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white font-urdu"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Detailed Description (English)</label>
                  <textarea
                    rows={4}
                    value={editingProgram.detailed_desc_en || ''}
                    onChange={(e) => setEditingProgram({ ...editingProgram, detailed_desc_en: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Detailed Description (Urdu)</label>
                  <textarea
                    rows={4}
                    dir="rtl"
                    value={editingProgram.detailed_desc_ur || ''}
                    onChange={(e) => setEditingProgram({ ...editingProgram, detailed_desc_ur: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white font-urdu"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Curriculum Highlights (English)</label>
                  <textarea
                    rows={3}
                    value={editingProgram.curriculum_highlights_en || ''}
                    onChange={(e) => setEditingProgram({ ...editingProgram, curriculum_highlights_en: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Curriculum Highlights (Urdu)</label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    value={editingProgram.curriculum_highlights_ur || ''}
                    onChange={(e) => setEditingProgram({ ...editingProgram, curriculum_highlights_ur: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white font-urdu"
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="prog_published"
                    checked={editingProgram.is_published ?? true}
                    onChange={(e) => setEditingProgram({ ...editingProgram, is_published: e.target.checked })}
                    className="rounded text-emerald-800 focus:ring-emerald-700 h-4 w-4"
                  />
                  <label htmlFor="prog_published" className="text-xs font-bold text-stone-800">
                    Publish this program immediately (visible on public website)
                  </label>
                </div>
              </div>

              <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end gap-3 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setEditingProgram(null)}
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
                  <span>{saving ? 'Saving...' : 'Save Program'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
