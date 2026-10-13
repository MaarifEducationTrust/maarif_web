import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../../lib/db';
import { 
  BookOpen, 
  HelpCircle, 
  BarChart3, 
  FileText, 
  Settings, 
  QrCode, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Database,
  ArrowRight,
  Award
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<{
    totalPrograms: number;
    publishedPrograms: number;
    totalProblems: number;
    activeProblems: number;
    totalStats: number;
    totalActivities: number;
    publishedActivities: number;
    totalDocuments: number;
    publishedDocuments: number;
    isSupabaseLive: boolean;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Institutional Dashboard
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Overview of published curricula, active appeals, metrics, and institutional settings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-stone-200 shadow-2xs flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${stats?.isSupabaseLive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span className="text-stone-700">
              {stats?.isSupabaseLive ? 'Supabase Live DB Connected' : 'Local Mock Data Mode'}
            </span>
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {/* Card 1: Programs */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Programs
            </span>
            <span className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-stone-900 font-sans">
              {loading ? '...' : stats?.publishedPrograms}
            </span>
            <span className="text-xs text-stone-500 block mt-1">
              {stats?.totalPrograms} total recorded ({stats?.publishedPrograms} published)
            </span>
          </div>
          <Link
            to="/admin/programs"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 pt-2 border-t border-stone-100"
          >
            <span>Manage Programs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 2: Activities */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Activities
            </span>
            <span className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl">
              <Award className="w-5 h-5" />
            </span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-stone-900 font-sans">
              {loading ? '...' : stats?.publishedActivities}
            </span>
            <span className="text-xs text-stone-500 block mt-1">
              Events published ({stats?.totalActivities} total)
            </span>
          </div>
          <Link
            to="/admin/activities"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 pt-2 border-t border-stone-100"
          >
            <span>Manage Activities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 3: Needs */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Current Needs
            </span>
            <span className="p-2.5 bg-amber-50 text-amber-800 rounded-xl">
              <HelpCircle className="w-5 h-5" />
            </span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-stone-900 font-sans">
              {loading ? '...' : stats?.activeProblems}
            </span>
            <span className="text-xs text-stone-500 block mt-1">
              Active support appeals ({stats?.totalProblems} recorded)
            </span>
          </div>
          <Link
            to="/admin/problems"
            className="text-xs font-bold text-amber-800 hover:text-amber-950 inline-flex items-center gap-1 pt-2 border-t border-stone-100"
          >
            <span>Manage Needs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 4: Metrics */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Impact Metrics
            </span>
            <span className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-stone-900 font-sans">
              {loading ? '...' : stats?.totalStats}
            </span>
            <span className="text-xs text-stone-500 block mt-1">
              Verified statistics recorded
            </span>
          </div>
          <Link
            to="/admin/statistics"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 pt-2 border-t border-stone-100"
          >
            <span>Update Metrics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 5: Documents */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Legal Documents
            </span>
            <span className="p-2.5 bg-stone-100 text-stone-700 rounded-xl">
              <FileText className="w-5 h-5" />
            </span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-stone-900 font-sans">
              {loading ? '...' : stats?.publishedDocuments}
            </span>
            <span className="text-xs text-stone-500 block mt-1">
              Public certificates ({stats?.totalDocuments} total)
            </span>
          </div>
          <Link
            to="/admin/documents"
            className="text-xs font-bold text-stone-700 hover:text-stone-900 inline-flex items-center gap-1 pt-2 border-t border-stone-100"
          >
            <span>Manage Documents</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-stone-800">
          Management Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/admin/activities"
            className="p-6 bg-white rounded-3xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-4 group"
          >
            <span className="p-3 bg-stone-100 group-hover:bg-emerald-800 group-hover:text-amber-400 rounded-2xl text-stone-700 transition-colors">
              <Award className="w-6 h-6" />
            </span>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-stone-900 group-hover:text-emerald-800 transition-colors">
                Student Activities & Events
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Add, edit, or publish educational gatherings, Qirat competitions, workshops, and ceremony reports.
              </p>
            </div>
          </Link>

          <Link
            to="/admin/settings"
            className="p-6 bg-white rounded-3xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-4 group"
          >
            <span className="p-3 bg-stone-100 group-hover:bg-emerald-800 group-hover:text-amber-400 rounded-2xl text-stone-700 transition-colors">
              <Settings className="w-6 h-6" />
            </span>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-stone-900 group-hover:text-emerald-800 transition-colors">
                Institution Information & Contacts
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Update Madrasa name in English & Urdu, contact numbers, email, physical addresses, and social links.
              </p>
            </div>
          </Link>

          <Link
            to="/admin/donation"
            className="p-6 bg-white rounded-3xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-4 group"
          >
            <span className="p-3 bg-stone-100 group-hover:bg-emerald-800 group-hover:text-amber-400 rounded-2xl text-stone-700 transition-colors">
              <QrCode className="w-6 h-6" />
            </span>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-stone-900 group-hover:text-emerald-800 transition-colors">
                Donation QR & Bank Details
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Upload verified QR code image URL, set UPI ID, bank account details, and scanning instructions.
              </p>
            </div>
          </Link>

          <Link
            to="/admin/homepage"
            className="p-6 bg-white rounded-3xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-4 group"
          >
            <span className="p-3 bg-stone-100 group-hover:bg-emerald-800 group-hover:text-amber-400 rounded-2xl text-stone-700 transition-colors">
              <FileText className="w-6 h-6" />
            </span>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-stone-900 group-hover:text-emerald-800 transition-colors">
                Homepage Sections & Visibility
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Reorder homepage sections, toggle visibility, and update introductory video and hero headlines.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
