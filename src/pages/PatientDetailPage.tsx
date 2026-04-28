import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Pill, FileText, Heart, Droplets, Thermometer, Wind, Activity, User } from 'lucide-react';
import { useAppSelector } from '../hooks/useStore';
import { getStatusColor, getStatusDot, getInitials, getAvatarColor } from '../utils';

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { patients } = useAppSelector((s) => s.patients);
  const patient = patients.find((p) => p.id === id);

  if (!patient) {
    return (
      <div className="page-enter flex flex-col items-center justify-center h-64 text-center">
        <User className="w-10 h-10 mb-3" style={{ color: 'var(--text-muted)' }} />
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Patient not found.</p>
        <button className="btn-ghost mt-4 text-sm" onClick={() => navigate('/patients')}>
          Back to patients
        </button>
      </div>
    );
  }

  const vitals = [
    { icon: Heart, label: 'Heart Rate', value: `${patient.vitals.heartRate}`, unit: 'bpm', alert: patient.vitals.heartRate > 100 || patient.vitals.heartRate < 60 },
    { icon: Activity, label: 'Blood Pressure', value: patient.vitals.bloodPressure, unit: 'mmHg', alert: parseInt(patient.vitals.bloodPressure) > 140 },
    { icon: Thermometer, label: 'Temperature', value: `${patient.vitals.temperature}`, unit: '°C', alert: patient.vitals.temperature > 37.5 },
    { icon: Wind, label: 'SpO₂', value: `${patient.vitals.oxygenSaturation}`, unit: '%', alert: patient.vitals.oxygenSaturation < 95 },
    { icon: Droplets, label: 'Weight', value: `${patient.vitals.weight}`, unit: 'kg', alert: false },
    { icon: User, label: 'Height', value: `${patient.vitals.height}`, unit: 'cm', alert: false },
  ];

  return (
    <div className="page-enter space-y-5">
      {/* Back */}
      <button
        onClick={() => navigate('/patients')}
        className="flex items-center gap-2 text-sm btn-ghost py-2"
      >
        <ArrowLeft className="w-4 h-4" /> Patients
      </button>

      {/* Hero card */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${getAvatarColor(patient.id)} flex items-center justify-center text-white text-2xl font-bold flex-shrink-0`}>
            {getInitials(patient.name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="font-display text-2xl text-white">{patient.name}</h1>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(patient.status)} ${patient.status === 'Critical' ? 'animate-pulse' : ''}`} />
                <span className={`text-sm px-3 py-1 rounded-full border font-medium ${getStatusColor(patient.status)}`}>
                  {patient.status}
                </span>
              </div>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              {patient.age} years · {patient.gender} · Blood type: <span className="font-mono text-white">{patient.bloodType}</span>
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {[
                { label: 'Condition', value: patient.condition },
                { label: 'Ward', value: patient.ward },
                { label: 'Attending', value: patient.doctor },
                { label: 'Insurance', value: patient.insurance },
              ].map((item) => (
                <div key={item.label}>
                  <p style={{ color: 'var(--text-muted)' }}>{item.label}</p>
                  <p className="text-white font-medium mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Vitals */}
      <div>
        <h2 className="font-display text-lg text-white mb-3">Current Vitals</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {vitals.map((v) => (
            <div
              key={v.label}
              className={`glass-card p-4 ${v.alert ? 'border-red-500/30' : ''}`}
            >
              <v.icon className={`w-4 h-4 mb-2 ${v.alert ? 'text-red-400' : 'text-sky-400'}`} />
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{v.label}</p>
              <p className={`font-mono font-bold text-lg ${v.alert ? 'text-red-400' : 'text-white'}`}>
                {v.value}
                <span className="text-xs font-normal ml-0.5" style={{ color: 'var(--text-muted)' }}>{v.unit}</span>
              </p>
              {v.alert && <p className="text-xs text-red-400 mt-1">⚠ Abnormal</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Contact */}
        <div className="glass-card p-5">
          <h2 className="font-display text-lg text-white mb-4">Contact Info</h2>
          <div className="space-y-3">
            {[
              { icon: Phone, label: patient.phone },
              { icon: Mail, label: patient.email },
              { icon: MapPin, label: patient.address },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <item.icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p style={{ color: 'var(--text-muted)' }}>Admitted</p>
                <p className="text-white font-medium mt-0.5">{patient.admittedDate}</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)' }}>Last Visit</p>
                <p className="text-white font-medium mt-0.5">{patient.lastVisit}</p>
              </div>
              <div className="col-span-2">
                <p style={{ color: 'var(--text-muted)' }}>Next Appointment</p>
                <p className="text-sky-400 font-medium mt-0.5">{patient.nextAppointment}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Medications */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Pill className="w-4 h-4 text-violet-400" />
            <h2 className="font-display text-lg text-white">Medications</h2>
          </div>
          <div className="space-y-3">
            {patient.medications.map((med, i) => (
              <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                <p className="text-sm font-medium text-white mb-1">{med.name}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    {med.dosage}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {med.frequency}
                  </span>
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Since {med.startDate}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-amber-400" />
            <h2 className="font-display text-lg text-white">Clinical Notes</h2>
          </div>
          <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {patient.notes}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            Attending physician: <span className="text-white">{patient.doctor}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
