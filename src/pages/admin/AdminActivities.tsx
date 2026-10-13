import React, { useState, useEffect } from 'react';
import { StudentActivity } from '../../types';
import { getStudentActivities, saveStudentActivity, deleteStudentActivity } from '../../lib/db';
import { SafeImage } from '../../components/common/SafeImage';
import { VideoEmbed } from '../../components/common/VideoEmbed';
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
  Award,
  Calendar,
  Video,
  Search,
  Info,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const AdminActivities: React.FC = () => {
  const [activities, setActivities] = useState<StudentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingActivity, setEditingActivity] = useState<Partial<StudentActivity> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    try {
      const data = await getStudentActivities(true); // adminMode = true to load all
      setActivities(data);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load activities' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateNew = () => {
    setIsNew(true);
    setEditingActivity({
      title_en: '',
      title_ur: '',
      description_en: '',
      description_ur: '',
      content_en: '',
      content_ur: '',
      category_en: 'Academic Event',
      category_ur: 'تعلیمی تقریب',
      activity_date: new Date().toISOString().split('T')[0],
      image_url: '',
      video_url: '',
      display_order: activities.length + 1,
      is_published: true,
    });
  };

  const handleEdit = (act: StudentActivity) => {
    setIsNew(false);
    setEditingActivity({ ...act });
  };

  const handleTogglePublish = async (act: StudentActivity) => {
    try {
      const updatedStatus = !act.is_published;
      await saveStudentActivity({ id: act.id, is_published: updatedStatus });
      setActivities(activities.map(a => a.id === act.id ? { ...a, is_published: updatedStatus } : a));
      setMessage({ type: 'success', text: `Activity ${updatedStatus ? 'published' : 'saved to draft'}` });
      setTimeout(() => setMessage(null), 2500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update status' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActivity) return;

    if (!editingActivity.title_en?.trim() || !editingActivity.title_ur?.trim()) {
      setMessage({ type: 'error', text: 'Please provide both English and Urdu activity titles.' });
      return;
    }

    setSaving(true);
    try {
      await saveStudentActivity(editingActivity);
      await loadData();
      setEditingActivity(null);
      setMessage({ type: 'success', text: isNew ? 'Activity created successfully!' : 'Activity updated successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save activity' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this student activity record? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteStudentActivity(id);
      setActivities(activities.filter(a => a.id !== id));
      setMessage({ type: 'success', text: 'Activity removed successfully' });
      setTimeout(() => setMessage(null), 2500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete activity' });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredActivities = activities.filter((act) => {
    const q = search.toLowerCase();
    const titleMatch = (act.title_en + ' ' + act.title_ur).toLowerCase().includes(q);
    const catMatch = (act.category_en + ' ' + act.category_ur).toLowerCase().includes(q);
    return titleMatch || catMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
            Student Activities & Events Management
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Publish educational ceremonies, Qirat gatherings, moral tarbiyah sessions, and workshops.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Activity</span>
        </button>
      </div>

      {/* Notifications */}
      {message && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search activities by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span className="text-xs text-stone-500">Loading activities...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredActivities.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/80 p-8 max-w-md mx-auto shadow-2xs">
          <Award className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-700 mb-1">
            No Activities Found
          </h3>
          <p className="text-xs text-stone-500 mb-4">
            {search ? 'Try clearing your search keyword.' : 'Click "Add New Activity" above to create your first event record.'}
          </p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((act) => (
          <div
            key={act.id}
            className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              {/* Media Thumbnail */}
              <div className="aspect-[16/10] bg-stone-100 overflow-hidden relative">
                {act.image_url ? (
                  <SafeImage src={act.image_url} alt={act.title_en} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400">
                    <Award className="w-10 h-10 opacity-30" />
                  </div>
                )}

                {/* Status Toggle Button */}
                <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
                  <button
                    onClick={() => handleTogglePublish(act)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs flex items-center gap-1 transition-colors ${
                      act.is_published ? 'bg-emerald-800 text-white hover:bg-emerald-900' : 'bg-stone-800 text-stone-200 hover:bg-stone-900'
                    }`}
                  >
                    {act.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{act.is_published ? 'Published' : 'Draft'}</span>
                  </button>
                </div>

                {/* Video Indicator */}
                {act.video_url && (
                  <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 p-1.5 bg-red-600 text-white rounded-full shadow-md" title="Video Attached">
                    <Video className="w-3 h-3" />
                  </div>
                )}
              </div>

              {/* Information */}
              <div className="p-4 sm:p-5 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {act.category_en}
                  </span>
                  <span className="font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    <span>{act.activity_date}</span>
                  </span>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-stone-900 line-clamp-1">{act.title_en}</h3>
                <h4 className="font-urdu text-xs text-stone-700 line-clamp-1">{act.title_ur}</h4>
                <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed">{act.description_en}</p>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-4 pt-0 flex items-center justify-between border-t border-stone-100 pt-3">
              <span className="text-[11px] text-stone-400 font-mono">Order: {act.display_order}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleEdit(act)}
                  className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                  title="Edit Activity"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(act.id)}
                  disabled={deletingId === act.id}
                  className="p-2 rounded-lg bg-stone-100 hover:bg-red-100 text-stone-600 hover:text-red-700 transition-colors"
                  title="Delete Activity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal Dialog */}
      {editingActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-fade-in">
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between z-10">
              <h2 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-800" />
                <span>{isNew ? 'Create New Student Activity' : 'Edit Student Activity'}</span>
              </h2>
              <button onClick={() => setEditingActivity(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-5">
              {/* Guidance Banner */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3 sm:p-4 text-xs text-stone-600 space-y-1">
                <span className="font-bold text-stone-800 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-emerald-700" />
                  <span>Google Drive & External Media Guidance</span>
                </span>
                <p className="text-[11px] leading-relaxed">
                  You can paste direct web links or Google Drive links for both image and video. For Google Drive, ensure the file sharing is set to <strong>"Anyone with the link can view"</strong>.
                </p>
              </div>

              {/* Title Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Activity Title (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingActivity.title_en || ''}
                    onChange={(e) => setEditingActivity({ ...editingActivity, title_en: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                    placeholder="e.g. Annual Husn-e-Qirat Competition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Activity Title (Urdu / عنوان) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    required
                    value={editingActivity.title_ur || ''}
                    onChange={(e) => setEditingActivity({ ...editingActivity, title_ur: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/30 font-urdu"
                    placeholder="مثال: سالانہ مسابقۂ حسنِ قرآت"
                  />
                </div>
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Category (English)</label>
                  <input
                    type="text"
                    value={editingActivity.category_en || ''}
                    onChange={(e) => setEditingActivity({ ...editingActivity, category_en: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white"
                    placeholder="e.g. Competition, Workshop"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Category (Urdu / زمرہ)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={editingActivity.category_ur || ''}
                    onChange={(e) => setEditingActivity({ ...editingActivity, category_ur: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white font-urdu"
                    placeholder="مثال: مسابقہ، تقریب"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Event Date</label>
                  <input
                    type="date"
                    value={editingActivity.activity_date || ''}
                    onChange={(e) => setEditingActivity({ ...editingActivity, activity_date: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white"
                  />
                </div>
              </div>

              {/* Media URLs: Image and Video */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Image URL (Google Drive / Web link)
                  </label>
                  <input
                    type="url"
                    value={editingActivity.image_url || ''}
                    onChange={(e) => setEditingActivity({ ...editingActivity, image_url: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs font-mono focus:bg-white"
                    placeholder="https://drive.google.com/file/d/... or image URL"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Video URL (Optional: YouTube / Google Drive)
                  </label>
                  <input
                    type="url"
                    value={editingActivity.video_url || ''}
                    onChange={(e) => setEditingActivity({ ...editingActivity, video_url: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs font-mono focus:bg-white"
                    placeholder="https://youtube.com/watch?v=... or Google Drive URL"
                  />
                </div>
              </div>

              {/* Live Media Previews if provided */}
              {(editingActivity.image_url || editingActivity.video_url) && (
                <div className="p-3 bg-stone-100 rounded-2xl border border-stone-200 space-y-3">
                  <span className="text-[11px] font-bold text-stone-600 block uppercase tracking-wider">
                    Live Media Preview
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {editingActivity.image_url && (
                      <div>
                        <span className="text-[10px] text-stone-500 block mb-1">Image Thumbnail Preview:</span>
                        <div className="aspect-[16/10] rounded-xl overflow-hidden bg-white border border-stone-300">
                          <SafeImage src={editingActivity.image_url} alt="Thumbnail preview" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    )}

                    {editingActivity.video_url && (
                      <div>
                        <span className="text-[10px] text-stone-500 block mb-1">Video Embed Preview:</span>
                        <VideoEmbed url={editingActivity.video_url} title="Video Preview" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Short Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Short Description (English)</label>
                  <textarea
                    rows={2}
                    required
                    value={editingActivity.description_en || ''}
                    onChange={(e) => setEditingActivity({ ...editingActivity, description_en: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white"
                    placeholder="Brief 1-2 sentence overview shown on activity cards..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Short Description (Urdu / خلاصہ)</label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    required
                    value={editingActivity.description_ur || ''}
                    onChange={(e) => setEditingActivity({ ...editingActivity, description_ur: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white font-urdu"
                    placeholder="مختصر خلاصہ..."
                  />
                </div>
              </div>

              {/* Full Content (Details View) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Detailed Content (English)</label>
                  <textarea
                    rows={4}
                    value={editingActivity.content_en || ''}
                    onChange={(e) => setEditingActivity({ ...editingActivity, content_en: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white"
                    placeholder="Comprehensive activity report, participating guests, winners, and remarks..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Detailed Content (Urdu / تفصیلی رپورٹ)</label>
                  <textarea
                    rows={4}
                    dir="rtl"
                    value={editingActivity.content_ur || ''}
                    onChange={(e) => setEditingActivity({ ...editingActivity, content_ur: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white font-urdu"
                    placeholder="تقریب کی مفصل کارروائی، معزز مہمانان، نتائج اور دیگر کوائف..."
                  />
                </div>
              </div>

              {/* Display Order and Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-1">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingActivity.display_order ?? 1}
                    onChange={(e) => setEditingActivity({ ...editingActivity, display_order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="act_published"
                    checked={editingActivity.is_published ?? true}
                    onChange={(e) => setEditingActivity({ ...editingActivity, is_published: e.target.checked })}
                    className="rounded text-emerald-800 focus:ring-emerald-700 h-4 w-4 cursor-pointer"
                  />
                  <label htmlFor="act_published" className="text-xs font-bold text-stone-800 cursor-pointer">
                    Publish activity on public website
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end gap-3 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setEditingActivity(null)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-60 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Activity'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
