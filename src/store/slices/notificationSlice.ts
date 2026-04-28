import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationState, Notification } from '../../types';
import { mockNotifications } from '../../services/mockData';

const initialState: NotificationState = {
  notifications: mockNotifications,
  unreadCount: mockNotifications.filter((n) => !n.read).length,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) state.unreadCount++;
    },
    markRead(state, action: PayloadAction<string>) {
      const n = state.notifications.find((n) => n.id === action.payload);
      if (n && !n.read) {
        n.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllRead(state) {
      state.notifications.forEach((n) => (n.read = true));
      state.unreadCount = 0;
    },
    removeNotification(state, action: PayloadAction<string>) {
      const idx = state.notifications.findIndex((n) => n.id === action.payload);
      if (idx !== -1) {
        if (!state.notifications[idx].read) state.unreadCount = Math.max(0, state.unreadCount - 1);
        state.notifications.splice(idx, 1);
      }
    },
  },
});

export const { addNotification, markRead, markAllRead, removeNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
