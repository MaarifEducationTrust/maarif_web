import React, { useState, useEffect } from 'react';
import { StaffMember } from '../../types';
import { getStaffMembers, saveStaffMember, deleteStaffMember } from '../../lib/db';
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
  Users,
  GraduationCap
} from 'lucide-react';

export const AdminStaff: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'leadership' | 'teaching' | 'support'>('all');
  const [editingStaff, setEditingStaff] = useState<Partial<StaffMember> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    try {
      const data = await getStaffMembers(true);
      setStaff(data);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load staff records' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateNew = () => {
    setIsNew(true);
    setEditingStaff({
      name_en: '',
      name_ur: '',
      role_en: '',
      role_ur: '',
      category: 'teaching',
      display_order: staff.length + 1,
      is_published: true,
    });
  };

  const handleEdit = (item: StaffMember) => {
    setIsNew(false);
    setEditingStaff({ ...item });
  };

  const handleTogglePublish = async (item: StaffMember) => {
    try {
      await saveStaffMember({ id: item.id, is_published: !item.is_published });
      setStaff(staff.map(s => s.id === item.id ? { ...s, is_published: !item.is_published } : s));
      setMessage({ type: 'success', text: `Staff record ${!item.is_published ? 'published' : 'hidden'}` });
      setTimeout(() => setMessage(null), 2500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update status' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the staff list?`)) return;
    try {
      await deleteStaffMember(id);
      setStaff(staff.filter(s => s.id !== id));
      setMessage({ type: 'success', text: 'Staff member removed successfully.' });
      setTimeout(() => setMessage(null), 2500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff?.name_en || !editingStaff?.role_en) {
      setMessage({ type: 'error', text: 'Name and Role in English are required.' });
      return;
    }

    setSaving(true);
    try {
      const saved = await saveStaffMember(editingStaff);
      if (isNew) {
        setStaff([...staff, saved]);
        setMessage({ type: 'success', text: 'New staff member added successfully!' });
      } else {
        setStaff(staff.map(s => s.id === saved.id ? saved : s));
        setMessage({ type: 'success', text: 'Staff member details updated!' });
      }
      setEditingStaff(null);
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save staff record' });
    } finally {
      setSaving(false);
    }
  };

  const filteredStaff = staff.filter(s => {
    if (categoryFilter === 'all') return true;
    return s.category === categoryFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Madrasa Leadership & Staff
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage institutional leadership, teaching faculty, and support personnel.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Message Banner */}
      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-2.5 text-xs font-semibold ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
            : 'bg-rose-50 text-rose-900 border border-rose-200'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0 text-emerald-700" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-700" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'leadership', 'teaching', 'support'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              categoryFilter === cat
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {cat === 'all' ? 'All Staff' : cat}
          </button>
        ))}
      </div>

      {/* Staff Table / Cards */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span className="text-xs text-stone-500">Loading staff records...</span>
        </div>
      ) : filteredStaff.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/80 p-8 max-w-md mx-auto">
          <Users className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-stone-700">No staff records in this category</h3>
          <p className="text-xs text-stone-400 mt-1">Click "Add Staff Member" above to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.map((member) => (
            <div
              key={member.id}
              className={`bg-white rounded-2xl border p-5 shadow-2xs flex flex-col justify-between space-y-4 ${
                member.is_published ? 'border-stone-200/90' : 'border-amber-300 bg-amber-50/20 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    member.category === 'leadership' 
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' 
                      : member.category === 'teaching' 
                      ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                      : 'bg-stone-100 text-stone-700 border border-stone-200'
                  }`}>
                    {member.category}
                  </span>
                  <span className="text-[11px] font-mono text-stone-400">Order: {member.display_order}</span>
                </div>

                <h3 className="font-bold text-base text-stone-900">{member.name_en}</h3>
                {member.name_ur && (
                  <p className="font-serif text-sm text-stone-600 mt-0.5">{member.name_ur}</p>
                )}
                <p className="text-xs text-emerald-800 font-medium mt-2">{member.role_en}</p>
                {member.role_ur && (
                  <p className="font-serif text-xs text-stone-500 mt-0.5">{member.role_ur}</p>
                )}
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => handleTogglePublish(member)}
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
                    member.is_published 
                      ? 'text-emerald-700 hover:bg-emerald-50' 
                      : 'text-amber-700 hover:bg-amber-50'
                  }`}
                  title={member.is_published ? 'Published (Click to hide)' : 'Hidden (Click to publish)'}
                >
                  {member.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{member.is_published ? 'Public' : 'Draft'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-1.5 text-stone-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Edit record"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id, member.name_en)}
                    className="p-1.5 text-stone-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="text-lg font-bold text-stone-900">
                {isNew ? 'Add Staff Member' : 'Edit Staff Member'}
              </h2>
              <button onClick={() => setEditingStaff(null)} className="p-1 rounded-full text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Category *</label>
                <select
                  value={editingStaff.category || 'teaching'}
                  onChange={e => setEditingStaff({ ...editingStaff, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700/30"
                >
                  <option value="leadership">Leadership (Founder, Nazim, Sarparast)</option>
                  <option value="teaching">Teaching Staff</option>
                  <option value="support">Support Staff</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingStaff.name_en || ''}
                    onChange={e => setEditingStaff({ ...editingStaff, name_en: e.target.value })}
                    placeholder="e.g. Qari Suleman Saheb"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Name (Urdu)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={editingStaff.name_ur || ''}
                    onChange={e => setEditingStaff({ ...editingStaff, name_ur: e.target.value })}
                    placeholder="قاری سلیمان صاحب"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-serif"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Role / Designation (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingStaff.role_en || ''}
                    onChange={e => setEditingStaff({ ...editingStaff, role_en: e.target.value })}
                    placeholder="e.g. Teacher, Darja-e-Hifz"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Role / Designation (Urdu)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={editingStaff.role_ur || ''}
                    onChange={e => setEditingStaff({ ...editingStaff, role_ur: e.target.value })}
                    placeholder="استاد درجہ حفظ"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-serif"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingStaff.display_order ?? 0}
                    onChange={e => setEditingStaff({ ...editingStaff, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-700">
                    <input
                      type="checkbox"
                      checked={editingStaff.is_published ?? true}
                      onChange={e => setEditingStaff({ ...editingStaff, is_published: e.target.checked })}
                      className="w-4 h-4 text-emerald-800 rounded focus:ring-emerald-700"
                    />
                    <span>Publish on Website</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl shadow-xs inline-flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Record'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
