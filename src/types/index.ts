export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'doctor' | 'nurse' | 'viewer';
  avatar?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodType: string;
  condition: string;
  status: 'Critical' | 'Stable' | 'Recovering' | 'Discharged';
  admittedDate: string;
  doctor: string;
  ward: string;
  phone: string;
  email: string;
  address: string;
  insurance: string;
  lastVisit: string;
  nextAppointment: string;
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygenSaturation: number;
    weight: number;
    height: number;
  };
  medications: Medication[];
  notes: string;
  avatar?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  timestamp: string;
  read: boolean;
  patientId?: string;
}

export interface AnalyticsData {
  patientAdmissions: { month: string; count: number; discharged: number }[];
  departmentLoad: { name: string; patients: number; capacity: number }[];
  vitalTrends: { time: string; heartRate: number; bp: number }[];
  conditionBreakdown: { name: string; value: number; color: string }[];
}

export type ViewMode = 'grid' | 'list';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  viewMode: ViewMode;
  searchQuery: string;
  statusFilter: string;
  loading: boolean;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}
