import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Activity, AlertTriangle, TrendingUp, ArrowRight, Clock, Zap } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks/useStore';
import { addNotification } from '../store/slices/notificationSlice';
import { notificationService } from '../services/notificationService';
import { mockPatients } from '../services/mockData';
import { getStatusColor, getStatusDot, getInitials, getAvatarColor, generateNotificationId } from '../utils';

export default function DashboardPage() {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const totalPatients = mockPatients.length;
  const critical = mockPatients.filter((p) => p.status === 'Critical').length;
  const stable = mockPatients.filter((p) => p.status === 'Stable').length;
  const recovering = mockPatients.filter((p) => p.status === 'Recovering').length;

  useEffect(() => {
    notificationService.registerServiceWorker();
  }, []);

  const triggerTestNotification = async () => {
    await notificationService.triggerCriticalAlert('Eleanor Harrington');
    dispatch(addNotification({
      id: generateNotificationId(),
      title: 'Test Alert Triggered',
      message: 'Critical alert notification was sent successfully.',
      type: 'alert',
      timestamp: new Date().toISOString(),
      read: false,
    }));
  };

  const triggerMedReminder = async () => {
    await notificationService.triggerMedicationReminder('James Whitmore', 'Metformin 1000mg');
    dispatch(addNotification({
      id: generateNotificationId(),
      title: 'Medication Reminder Sent',
      message: 'James Whitmore — Metformin 1000mg is due now.',
      type: 'warning',
      timestamp: new Date().toISOString(),
      read: false,
    }));
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.displayName.split(' ')[0] || 'Doctor';

  const STATS = [
    { label: 'Total Patients', value: totalPatients, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Critical', value: critical, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10' },
    { label: 'Stable', value: stable, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Recovering', value: recovering, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  ];

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{greeting}</p>
          <h1 className="font-display text-3xl text-white">{firstName} <span className="text-gradient">👋</span></h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Here's what's happening at your facility today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          <Clock className="w-3 h-3" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <div key={s.label} className="stat-card" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
              <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
            </div>
            <p className={`font-display text-3xl ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent patients */}
        <div className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg text-white">Recent Admissions</h2>
            <button
              onClick={() => navigate('/patients')}
              className="flex items-center gap-1 text-xs btn-ghost py-1.5 px-3"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {mockPatients.slice(0, 5).map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-white/5"
                onClick={() => navigate(`/patients/${p.id}`)}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getAvatarColor(p.id)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {getInitials(p.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{p.name}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                    {p.condition} · {p.ward}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(p.status)}`} />
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(p.status)}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notification demo */}
        <div className="glass-card p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <h2 className="font-display text-lg text-white">Notification Demo</h2>
          </div>
          <p className="text-xs mb-5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Test the Service Worker push notification system. Click a button to trigger a browser notification.
          </p>
          <div className="space-y-3 flex-1">
            <button
              onClick={triggerTestNotification}
              className="w-full p-3 rounded-xl border text-sm font-medium transition-all text-left flex items-center gap-3"
              style={{ borderColor: 'rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.08)', color: '#f87171' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(248,113,113,0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(248,113,113,0.08)'}
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <div>
                <p className="font-medium">Critical Alert</p>
                <p className="text-xs opacity-70">Eleanor Harrington</p>
              </div>
            </button>
            <button
              onClick={triggerMedReminder}
              className="w-full p-3 rounded-xl border text-sm font-medium transition-all text-left flex items-center gap-3"
              style={{ borderColor: 'rgba(251,191,36,0.3)', background: 'rgba(251,191,36,0.08)', color: '#fbbf24' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(251,191,36,0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(251,191,36,0.08)'}
            >
              <Activity className="w-4 h-4 flex-shrink-0" />
              <div>
                <p className="font-medium">Medication Reminder</p>
                <p className="text-xs opacity-70">James Whitmore — Metformin</p>
              </div>
            </button>
          </div>
          <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
            💡 Allow browser notifications when prompted to see push alerts.
          </p>
        </div>
      </div>

      {/* Vitals at a glance */}
      <div className="glass-card p-5">
        <h2 className="font-display text-lg text-white mb-5">Critical Patients — Quick Vitals</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockPatients.filter((p) => p.status === 'Critical' || p.status === 'Recovering').slice(0, 4).map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-xl border cursor-pointer transition-all hover:border-white/15"
              style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.02)' }}
              onClick={() => navigate(`/patients/${p.id}`)}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(p.status)} animate-pulse`} />
                <p className="text-xs font-medium text-white truncate">{p.name.split(' ')[0]}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p style={{ color: 'var(--text-muted)' }}>HR</p>
                  <p className="font-mono font-medium text-white">{p.vitals.heartRate} <span style={{ color: 'var(--text-muted)' }}>bpm</span></p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)' }}>BP</p>
                  <p className="font-mono font-medium text-white">{p.vitals.bloodPressure}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)' }}>SpO₂</p>
                  <p className={`font-mono font-medium ${p.vitals.oxygenSaturation < 95 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {p.vitals.oxygenSaturation}%
                  </p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)' }}>Temp</p>
                  <p className={`font-mono font-medium ${p.vitals.temperature > 37.5 ? 'text-amber-400' : 'text-white'}`}>
                    {p.vitals.temperature}°C
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
