import { Bell, X, Check, CheckCheck, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useStore';
import { markRead, markAllRead, removeNotification } from '../../store/slices/notificationSlice';
import { formatTimeAgo } from '../../utils';
import { Notification } from '../../types';

const TYPE_STYLES: Record<Notification['type'], { dot: string; bg: string }> = {
  alert: { dot: 'bg-red-400', bg: 'bg-red-400/10 border-red-400/20' },
  warning: { dot: 'bg-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  info: { dot: 'bg-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
  success: { dot: 'bg-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
};

export default function NotificationPanel({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount } = useAppSelector((s) => s.notifications);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative flex flex-col w-full max-w-sm h-full border-l shadow-2xl animate-slide-in"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <h2 className="font-display text-lg text-white">Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-red-500/20 text-red-400 border border-red-500/20">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button onClick={() => dispatch(markAllRead())} className="btn-ghost text-xs flex items-center gap-1 py-1.5">
                <CheckCheck className="w-3 h-3" /> All read
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5">
              <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Bell className="w-8 h-8 mb-3" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No notifications</p>
            </div>
          ) : (
            notifications.map((n) => {
              const style = TYPE_STYLES[n.type];
              return (
                <div
                  key={n.id}
                  className={`relative p-4 rounded-xl border transition-all ${n.read ? '' : style.bg}`}
                  style={{ borderColor: n.read ? 'var(--border)' : undefined }}
                >
                  {!n.read && (
                    <span className={`absolute top-4 right-4 w-2 h-2 rounded-full ${style.dot}`} />
                  )}
                  <div className="flex items-start gap-3 pr-4">
                    <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${style.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white mb-0.5">{n.title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{n.message}</p>
                      <p className="text-xs mt-1.5 font-mono" style={{ color: 'var(--text-muted)' }}>
                        {formatTimeAgo(n.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3">
                    {!n.read && (
                      <button
                        onClick={() => dispatch(markRead(n.id))}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        <Check className="w-3 h-3" /> Mark read
                      </button>
                    )}
                    <button
                      onClick={() => dispatch(removeNotification(n.id))}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors ml-auto"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
