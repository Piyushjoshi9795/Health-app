import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Users, Activity, Award } from 'lucide-react';
import { mockAnalytics, mockPatients } from '../services/mockData';

const COLORS = ['#ef4444', '#8b5cf6', '#3b82f6', '#06b6d4', '#f59e0b', '#6b7280'];

export default function AnalyticsPage() {
  const { patientAdmissions, departmentLoad, vitalTrends, conditionBreakdown } = mockAnalytics;

  const avgAdmissions = Math.round(patientAdmissions.reduce((a, b) => a + b.count, 0) / patientAdmissions.length);
  const totalThisMonth = patientAdmissions[patientAdmissions.length - 1].count;
  const avgOccupancy = Math.round(
    departmentLoad.reduce((a, d) => a + (d.patients / d.capacity) * 100, 0) / departmentLoad.length
  );
  const criticalCount = mockPatients.filter((p) => p.status === 'Critical').length;

  const KPI = [
    { label: 'Admissions This Month', value: totalThisMonth, icon: Users, color: 'text-blue-400', sub: `Avg ${avgAdmissions}/mo` },
    { label: 'Avg Bed Occupancy', value: `${avgOccupancy}%`, icon: Activity, color: 'text-amber-400', sub: 'Across all wards' },
    { label: 'Critical Patients', value: criticalCount, icon: TrendingUp, color: 'text-red-400', sub: 'Require monitoring' },
    { label: 'Discharged This Month', value: patientAdmissions[patientAdmissions.length - 1].discharged, icon: Award, color: 'text-emerald-400', sub: 'Successful discharges' },
  ];

  const customTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-xl border p-3 text-xs"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <p className="font-medium text-white mb-2">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <span className="font-mono">{p.value}</span>
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl text-white">Analytics</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Facility performance metrics · Last 7 months
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI.map((k, i) => (
          <div key={k.label} className="stat-card" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{k.label}</span>
              <k.icon className={`w-4 h-4 ${k.color}`} />
            </div>
            <p className={`font-display text-3xl ${k.color}`}>{k.value}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Admissions trend */}
      <div className="glass-card p-6">
        <h2 className="font-display text-lg text-white mb-5">Patient Admissions & Discharges</h2>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={patientAdmissions} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="admGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="disGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis stroke="#475569" tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip content={customTooltip} />
            <Legend
              wrapperStyle={{ fontSize: 11, color: '#64748b' }}
            />
            <Area type="monotone" dataKey="count" name="Admissions" stroke="#38bdf8" fill="url(#admGrad)" strokeWidth={2} dot={{ fill: '#38bdf8', r: 3 }} />
            <Area type="monotone" dataKey="discharged" name="Discharged" stroke="#34d399" fill="url(#disGrad)" strokeWidth={2} dot={{ fill: '#34d399', r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Department load */}
        <div className="glass-card p-6">
          <h2 className="font-display text-lg text-white mb-5">Department Occupancy</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={departmentLoad} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#475569" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis stroke="#475569" tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip content={customTooltip} />
              <Bar dataKey="patients" name="Patients" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="capacity" name="Capacity" fill="rgba(56,189,248,0.15)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Condition breakdown */}
        <div className="glass-card p-6">
          <h2 className="font-display text-lg text-white mb-5">Condition Distribution</h2>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={conditionBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {conditionBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="rounded-xl border p-3 text-xs"
                        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                        <p className="font-medium text-white">{d.name}</p>
                        <p style={{ color: d.color }}>{d.value} patients</p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 min-w-[120px]">
              {conditionBreakdown.map((c) => (
                <div key={c.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{c.name}</span>
                  <span className="ml-auto font-mono text-white">{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Vital trends */}
      <div className="glass-card p-6">
        <h2 className="font-display text-lg text-white mb-5">24-Hour Vital Trends (Population Avg)</h2>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={vitalTrends} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" stroke="#475569" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis stroke="#475569" tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip content={customTooltip} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
            <Area type="monotone" dataKey="heartRate" name="Heart Rate (bpm)" stroke="#ef4444" fill="url(#hrGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="bp" name="Systolic BP (mmHg)" stroke="#8b5cf6" fill="rgba(139,92,246,0.1)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
