/**
 * Web Notification Service for GradeMate
 * Handles browser Web Notifications API, permission requests,
 * and audio chime feedback within honest browser constraints.
 */

// Synthesize a gentle two-tone notification chime using Web Audio API (no external audio files needed)
export function playNotificationChime() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Tone 1 (High bell)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
    gain1.gain.setValueAtTime(0.18, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.35);

    // Tone 2 (Higher sparkle)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, ctx.currentTime + 0.12); // B5
    gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.55);
  } catch (e) {
    // Audio autoplay might be restrained before user interaction
    console.debug('Notification audio playback skipped:', e);
  }
}

export const notificationService = {
  /**
   * Check if the browser supports Web Notifications
   */
  isSupported: () => {
    return typeof window !== 'undefined' && 'Notification' in window;
  },

  /**
   * Current permission status: 'default' | 'granted' | 'denied' | 'unsupported'
   */
  getPermission: () => {
    if (!notificationService.isSupported()) return 'unsupported';
    return Notification.permission;
  },

  /**
   * Request permission from the student explicitly.
   * NEVER called automatically on startup.
   */
  requestPermission: async () => {
    if (!notificationService.isSupported()) {
      return {
        status: 'unsupported',
        message: 'Your current browser does not support the Web Notifications API.',
      };
    }

    try {
      const permission = await Notification.requestPermission();
      return {
        status: permission,
        granted: permission === 'granted',
        message:
          permission === 'granted'
            ? 'Browser notifications enabled successfully!'
            : permission === 'denied'
            ? 'Notifications were blocked in your browser settings. To enable them, click the lock/settings icon in your browser address bar.'
            : 'Notification permission prompt was dismissed.',
      };
    } catch (err) {
      console.error('Failed to request notification permission:', err);
      return {
        status: 'error',
        granted: false,
        message: 'Could not request notification permission.',
      };
    }
  },

  /**
   * Send a browser notification if permission is granted, and play chime.
   */
  sendNotification: (title, options = {}) => {
    playNotificationChime();

    if (!notificationService.isSupported()) {
      return null;
    }

    if (Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          body: options.body || '',
          tag: options.tag || 'grademate-reminder',
          renotify: true,
          requireInteraction: false,
          ...options,
        });

        notif.onclick = () => {
          window.focus();
          if (options.onClick) options.onClick();
          notif.close();
        };

        return notif;
      } catch (err) {
        console.warn('Browser failed to construct Notification:', err);
        return null;
      }
    }

    return null;
  },

  /**
   * Honest explanation statement on frontend browser limitations
   */
  getLimitationDisclaimer: () => ({
    title: 'How Reminders Work in GradeMate',
    body: 'GradeMate currently operates entirely in your browser using local storage. Scheduled reminders trigger when your browser or this tab remains open. Reliable notifications when your browser or device is shut down require native push services (e.g. Android/iOS app or cloud push worker).',
  }),
};
