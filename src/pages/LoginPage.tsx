import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Activity, AlertCircle, ArrowRight, Lock, Mail } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useStore';
import { loginUser, clearError } from '../store/slices/authSlice';

const DEMO_CREDENTIALS = [
  { label: 'Admin', email: 'admin@pulseos.health', password: 'admin123', color: 'from-violet-500 to-purple-600' },
  { label: 'Doctor', email: 'doctor@pulseos.health', password: 'doctor123', color: 'from-blue-500 to-cyan-600' },
  { label: 'Nurse', email: 'nurse@pulseos.health', password: 'nurse123', color: 'from-emerald-500 to-teal-600' },
];

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email: email.trim(), password }));
  };

  const fillDemo = (cred: typeof DEMO_CREDENTIALS[0]) => {
    setEmail(cred.email);
    setPassword(cred.password);
    dispatch(clearError());
  };

  return (
    <div className="min-h-screen bg-noise flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, #0ea5e9, transparent)' }} />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-5"
          style={{ background: 'radial-gradient(circle, #38bdf8, transparent)' }} />
      </div>

      {/* Grid overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }} />

      <div className="w-full max-w-[420px] relative z-10 page-enter">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 glow-blue"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)' }}>
            <Activity className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl text-white mb-1">PulseOS</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Healthcare Management Platform</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <h2 className="font-display text-xl text-white mb-1">Welcome back</h2>
          <p className="text-sm mb-7" style={{ color: 'var(--text-muted)' }}>Sign in to your workspace</p>

          {error && (
            <div className="flex items-start gap-3 p-3 rounded-xl mb-5 border border-red-500/20 bg-red-500/10">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-red-400">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@organization.com"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <>Sign in <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-7 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs mb-3 text-center" style={{ color: 'var(--text-muted)' }}>
              Quick access — demo accounts
            </p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_CREDENTIALS.map((cred) => (
                <button
                  key={cred.label}
                  onClick={() => fillDemo(cred)}
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-xs font-medium transition-all"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <span className={`w-6 h-6 rounded-lg bg-gradient-to-br ${cred.color} flex items-center justify-center text-white text-xs font-bold`}>
                    {cred.label[0]}
                  </span>
                  {cred.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
          HIPAA compliant · SOC 2 Type II · ISO 27001
        </p>
      </div>
    </div>
  );
}
