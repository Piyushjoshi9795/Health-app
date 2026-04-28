import { Patient } from '../types';

export function formatTimeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function getStatusColor(status: Patient['status']): string {
  const map: Record<Patient['status'], string> = {
    Critical: 'text-red-400 bg-red-400/10 border-red-400/20',
    Stable: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    Recovering: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    Discharged: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
  };
  return map[status];
}

export function getStatusDot(status: Patient['status']): string {
  const map: Record<Patient['status'], string> = {
    Critical: 'bg-red-400',
    Stable: 'bg-emerald-400',
    Recovering: 'bg-amber-400',
    Discharged: 'bg-slate-400',
  };
  return map[status];
}

export function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

export function getAvatarColor(id: string): string {
  const colors = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-indigo-500 to-blue-600',
    'from-teal-500 to-emerald-600',
    'from-orange-500 to-red-600',
  ];
  const idx = id.charCodeAt(id.length - 1) % colors.length;
  return colors[idx];
}

export function filterPatients(
  patients: Patient[],
  query: string,
  statusFilter: string
): Patient[] {
  return patients.filter((p) => {
    const matchesSearch =
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.condition.toLowerCase().includes(query.toLowerCase()) ||
      p.doctor.toLowerCase().includes(query.toLowerCase()) ||
      p.ward.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
}

export function generateNotificationId(): string {
  return `n${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
