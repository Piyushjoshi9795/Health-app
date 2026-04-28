export const notificationService = {
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) return 'denied';
    if (Notification.permission === 'granted') return 'granted';
    return Notification.requestPermission();
  },

  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) return null;
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log('[SW] Registered:', reg.scope);
      return reg;
    } catch (err) {
      console.error('[SW] Registration failed:', err);
      return null;
    }
  },

  async showLocalNotification(title: string, body: string, tag?: string): Promise<void> {
    const perm = await this.requestPermission();
    if (perm !== 'granted') return;

    try {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(title, {
        body,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: tag || 'pulseos',
        vibrate: [200, 100, 200],
      } as NotificationOptions & { vibrate: number[] });
    } catch {
      // Fallback: in-browser notification
      new Notification(title, { body, icon: '/favicon.svg' });
    }
  },

  async triggerCriticalAlert(patientName: string): Promise<void> {
    await this.showLocalNotification(
      '🚨 Critical Patient Alert',
      `${patientName} requires immediate attention — vitals deteriorating.`,
      'critical-alert'
    );
  },

  async triggerMedicationReminder(patientName: string, medication: string): Promise<void> {
    await this.showLocalNotification(
      '💊 Medication Due',
      `${patientName} — ${medication} is due now.`,
      'medication'
    );
  },

  async triggerLabReady(patientName: string): Promise<void> {
    await this.showLocalNotification(
      '🔬 Lab Results Ready',
      `Results for ${patientName} are available for review.`,
      'lab'
    );
  },
};
