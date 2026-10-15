import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login, isMockAuth, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If already logged in
  if (user && isAdmin) {
    navigate('/admin', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/admin');
      } else {
        setError(res.error || 'Invalid administrator credentials');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail('admin@madrasa.org');
    setPassword('demo-admin-pass');
    setSubmitting(true);
    const res = await login('admin@madrasa.org', 'demo-admin-pass');
    if (res.success) {
      navigate('/admin');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-emerald-800 font-semibold mb-6 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </Link>

          <div className="w-16 h-16 rounded-3xl bg-emerald-950 text-amber-400 font-bold text-2xl flex items-center justify-center mx-auto shadow-lg border border-amber-500/30">
            م
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-stone-900 tracking-tight">
            Administrator Portal
          </h1>
          <p className="mt-1 text-xs text-stone-500">
            Authorized Madrasa personnel and trustees only.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-stone-200/80 sm:px-10">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {isMockAuth && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 text-xs space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Local Demonstration Mode Active</span>
              </div>
              <p className="opacity-90 leading-relaxed text-[11px]">
                Supabase credentials are not yet configured in <code className="bg-amber-100 px-1 rounded">.env</code>. You can log in with any sample email & password to test the administration features.
              </p>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full mt-2 py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-bold transition-colors"
              >
                1-Click Demo Login as Administrator
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@maarif.org"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 text-sm"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 text-sm font-mono"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-100 text-center">
            <span className="text-[11px] text-stone-400">
              Database security enforced via PostgreSQL Row Level Security (RLS).
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
