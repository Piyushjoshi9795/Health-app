import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PatientState, Patient, ViewMode } from '../../types';
import { mockPatients } from '../../services/mockData';

const initialState: PatientState = {
  patients: mockPatients,
  selectedPatient: null,
  viewMode: 'grid',
  searchQuery: '',
  statusFilter: 'all',
  loading: false,
};

const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setViewMode(state, action: PayloadAction<ViewMode>) {
      state.viewMode = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setStatusFilter(state, action: PayloadAction<string>) {
      state.statusFilter = action.payload;
    },
    selectPatient(state, action: PayloadAction<Patient | null>) {
      state.selectedPatient = action.payload;
    },
    updatePatient(state, action: PayloadAction<Patient>) {
      const idx = state.patients.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.patients[idx] = action.payload;
      if (state.selectedPatient?.id === action.payload.id) {
        state.selectedPatient = action.payload;
      }
    },
  },
});

export const { setViewMode, setSearchQuery, setStatusFilter, selectPatient, updatePatient } =
  patientSlice.actions;
export default patientSlice.reducer;
