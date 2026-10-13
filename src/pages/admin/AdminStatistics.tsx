import React, { useState, useEffect } from 'react';
import { StudentStatistic } from '../../types';
import { getStudentStatistics, saveStudentStatistic, deleteStudentStatistic } from '../../lib/db';
import { IconRenderer, availableIconNames } from '../../components/common/IconRenderer';
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
  BarChart3
} from 'lucide-react';

export const AdminStatistics: React.FC = () => {
  const [stats, setStats] = useState<StudentStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStat, setEditingStat] = useState<Partial<StudentStatistic> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    try {
      const data = await getStudentStatistics(true);
      setStats(data);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load statistics' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateNew = () => {
    setIsNew(true);
    setEditingStat({
      label_en: '',
      label_ur: '',
      value: '100+',
      subtext_en: '',
      subtext_ur: '',
      icon_name: 'GraduationCap',
      year_or_period: 'Current Session',
      display_order: stats.length + 1,
      is_published: true,
    });
  };

  const handleEdit = (item: StudentStatistic) => {
    setIsNew(false);
    setEditingStat({ ...item });
  };

  const handleTogglePublish = async (item: StudentStatistic) => {
    try {
      await saveStudentStatistic({ id: item.id, is_published: !item.is_published });
      setStats(stats.map(s => s.id === item.id ? { ...s, is_published: !item.is_published } : s));
      setMessage({ type: 'success', text: `Statistic ${!item.is_published ? 'published' : 'hidden'}` });
      setTimeout(() => setMessage(null), 2500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update status' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStat) return;

    setSaving(true);
    try {
      await saveStudentStatistic(editingStat);
      await loadData();
      setEditingStat(null);
      setMessage({ type: 'success', text: 'Metric saved successfully' });
      setTimeout(() => setMessage(null), 2500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save metric' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this metric?')) return;
    try {
      await deleteStudentStatistic(id);
      setStats(stats.filter(s => s.id !== id));
      setMessage({ type: 'success', text: 'Metric removed' });
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
            Verified Student & Staff Statistics
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Maintain aggregate numbers (total students, certified faculty, free boarding rates).
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Metric</span>
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

      {/* Stats Cards / Table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl">
                <IconRenderer name={item.icon_name} className="w-5 h-5" />
              </span>
              <button
                onClick={() => handleTogglePublish(item)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                  item.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'
                }`}
              >
                {item.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>{item.is_published ? 'Public' : 'Hidden'}</span>
              </button>
            </div>

            <div>
              <span className="text-3xl font-extrabold text-stone-900 font-sans block">{item.value}</span>
              <span className="text-sm font-bold text-stone-800 block mt-1">{item.label_en}</span>
              <span className="text-xs text-stone-500 font-urdu block">{item.label_ur}</span>
              {item.year_or_period && (
                <span className="text-[10px] font-mono text-stone-400 mt-2 block">{item.year_or_period}</span>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-100">
              <span className="text-xs text-stone-400 font-mono">Order: {item.display_order}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                  title="Edit"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg bg-stone-100 hover:bg-red-100 text-stone-600 hover:text-red-700"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {editingStat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div 
            className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur-md p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between z-10">
              <h2 className="text-sm sm:text-base font-bold text-stone-900">
                {isNew ? 'Add New Metric' : 'Edit Metric'}
              </h2>
              <button onClick={() => setEditingStat(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Value (Display Number)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 420+, 18, 100%"
                  value={editingStat.value || ''}
                  onChange={(e) => setEditingStat({ ...editingStat, value: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-sm font-bold font-sans focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Label (English)</label>
                  <input
                    type="text"
                    required
                    placeholder="Enrolled Students"
                    value={editingStat.label_en || ''}
                    onChange={(e) => setEditingStat({ ...editingStat, label_en: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Label (Urdu)</label>
                  <input
                    type="text"
                    dir="rtl"
                    required
                    placeholder="کل زیرِ تعلیم طلبہ"
                    value={editingStat.label_ur || ''}
                    onChange={(e) => setEditingStat({ ...editingStat, label_ur: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white font-urdu"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Subtext (English)</label>
                  <input
                    type="text"
                    value={editingStat.subtext_en || ''}
                    onChange={(e) => setEditingStat({ ...editingStat, subtext_en: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Subtext (Urdu)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={editingStat.subtext_ur || ''}
                    onChange={(e) => setEditingStat({ ...editingStat, subtext_ur: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white font-urdu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Icon Representation</label>
                <div className="flex items-center gap-3">
                  <select
                    value={editingStat.icon_name || 'GraduationCap'}
                    onChange={(e) => setEditingStat({ ...editingStat, icon_name: e.target.value })}
                    className="flex-1 px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white"
                  >
                    {availableIconNames.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
                    <IconRenderer name={editingStat.icon_name || 'GraduationCap'} className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Period / Year</label>
                  <input
                    type="text"
                    placeholder="Current Academic Session"
                    value={editingStat.year_or_period || ''}
                    onChange={(e) => setEditingStat({ ...editingStat, year_or_period: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingStat.display_order || 1}
                    onChange={(e) => setEditingStat({ ...editingStat, display_order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="stat_published"
                  checked={editingStat.is_published ?? true}
                  onChange={(e) => setEditingStat({ ...editingStat, is_published: e.target.checked })}
                  className="rounded text-emerald-800 focus:ring-emerald-700 h-4 w-4"
                />
                <label htmlFor="stat_published" className="text-xs font-bold text-stone-800">
                  Publish on public website
                </label>
              </div>

              <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end gap-3 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setEditingStat(null)}
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
                  <span>{saving ? 'Saving...' : 'Save Metric'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
