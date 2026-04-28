import { useNavigate } from 'react-router-dom';
import { Search, LayoutGrid, List, Filter, User } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useStore';
import { setViewMode, setSearchQuery, setStatusFilter } from '../store/slices/patientSlice';
import { filterPatients, getStatusColor, getStatusDot, getInitials, getAvatarColor } from '../utils';
import { Patient } from '../types';

const STATUS_FILTERS = ['all', 'Critical', 'Stable', 'Recovering', 'Discharged'];

export default function PatientsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { patients, viewMode, searchQuery, statusFilter } = useAppSelector((s) => s.patients);

  const filtered = filterPatients(patients, searchQuery, statusFilter);

  return (
    <div className="page-enter space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl text-white">Patient Registry</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {filtered.length} of {patients.length} patients
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search by name, condition, doctor, ward..."
            className="input-field pl-10 text-sm py-2.5"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => dispatch(setStatusFilter(s))}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium capitalize transition-all ${
                statusFilter === s
                  ? 'border-sky-400/40 bg-sky-400/15 text-sky-400'
                  : 'border-transparent text-slate-400 hover:border-white/10 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl border flex-shrink-0" style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.03)' }}>
          <button
            onClick={() => dispatch(setViewMode('grid'))}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-sky-500/20 text-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
            title="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => dispatch(setViewMode('list'))}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-sky-500/20 text-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <User className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No patients match your search criteria.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <GridView patients={filtered} onSelect={(id) => navigate(`/patients/${id}`)} />
      ) : (
        <ListView patients={filtered} onSelect={(id) => navigate(`/patients/${id}`)} />
      )}
    </div>
  );
}

function GridView({ patients, onSelect }: { patients: Patient[]; onSelect: (id: string) => void }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {patients.map((p, i) => (
        <div
          key={p.id}
          className="glass-card p-5 cursor-pointer hover:-translate-y-0.5 transition-all duration-200"
          style={{ animationDelay: `${i * 30}ms` }}
          onClick={() => onSelect(p.id)}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getAvatarColor(p.id)} flex items-center justify-center text-white font-bold`}>
              {getInitials(p.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{p.name}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.age}y · {p.gender}</p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-xs">
              <span style={{ color: 'var(--text-muted)' }}>Condition</span>
              <span className="text-white font-medium truncate ml-2 text-right">{p.condition}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: 'var(--text-muted)' }}>Ward</span>
              <span style={{ color: 'var(--text-secondary)' }}>{p.ward.split(' ')[0]}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: 'var(--text-muted)' }}>Doctor</span>
              <span style={{ color: 'var(--text-secondary)' }} className="truncate ml-2">{p.doctor.split(' ').slice(-1)[0]}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(p.status)} ${p.status === 'Critical' ? 'animate-pulse' : ''}`} />
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getStatusColor(p.status)}`}>
                {p.status}
              </span>
            </div>
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              {p.vitals.oxygenSaturation}% SpO₂
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ListView({ patients, onSelect }: { patients: Patient[]; onSelect: (id: string) => void }) {
  return (
    <div className="glass-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
            {['Patient', 'Condition', 'Ward', 'Doctor', 'Vitals', 'Status'].map((h) => (
              <th key={h} className="text-left p-4 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {patients.map((p, i) => (
            <tr
              key={p.id}
              className="border-b cursor-pointer transition-colors hover:bg-white/3"
              style={{ borderColor: i === patients.length - 1 ? 'transparent' : 'var(--border)' }}
              onClick={() => onSelect(p.id)}
            >
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${getAvatarColor(p.id)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {getInitials(p.name)}
                  </div>
                  <div>
                    <p className="font-medium text-white">{p.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.age}y · {p.gender} · {p.bloodType}</p>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <p className="text-white">{p.condition}</p>
              </td>
              <td className="p-4">
                <p style={{ color: 'var(--text-secondary)' }}>{p.ward}</p>
              </td>
              <td className="p-4">
                <p style={{ color: 'var(--text-secondary)' }}>{p.doctor}</p>
              </td>
              <td className="p-4">
                <div className="flex gap-3 text-xs font-mono">
                  <span className="text-white">{p.vitals.heartRate}<span style={{ color: 'var(--text-muted)' }}>bpm</span></span>
                  <span className={p.vitals.oxygenSaturation < 95 ? 'text-red-400' : 'text-emerald-400'}>
                    {p.vitals.oxygenSaturation}%
                  </span>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(p.status)} ${p.status === 'Critical' ? 'animate-pulse' : ''}`} />
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(p.status)}`}>
                    {p.status}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
