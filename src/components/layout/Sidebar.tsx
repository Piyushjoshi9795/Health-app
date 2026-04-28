import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Activity, LayoutDashboard, Users, BarChart3, Bell, LogOut,
  ChevronLeft, ChevronRight, Settings, Menu, X
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useStore';
import { logoutUser } from '../../store/slices/authSlice';
import { getInitials, getAvatarColor } from '../../utils';
import NotificationPanel from '../notifications/NotificationPanel';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/patients', icon: Users, label: 'Patients' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const { unreadCount } = useAppSelector((s) => s.notifications);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  const avatarGradient = user ? getAvatarColor(user.uid) : 'from-blue-500 to-cyan-600';
  const initials = user ? getInitials(user.displayName) : 'U';

  return (
    <>
      {/* Mobile topbar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 border-b lg:hidden"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)' }}>
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-white text-lg">PulseOS</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setNotifOpen(true)} className="relative p-2 btn-ghost">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-mono">
                {unreadCount}
              </span>
            )}
          </button>
          <button onClick={() => setMobileOpen(true)} className="p-2 btn-ghost">
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 flex flex-col"
            style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}>
            <SidebarContent
              collapsed={false}
              unreadCount={unreadCount}
              avatarGradient={avatarGradient}
              initials={initials}
              user={user}
              onNotif={() => { setNotifOpen(true); setMobileOpen(false); }}
              onLogout={handleLogout}
              onClose={() => setMobileOpen(false)}
              showClose
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col h-screen sticky top-0 flex-shrink-0 transition-all duration-300 border-r`}
        style={{
          width: collapsed ? '72px' : '240px',
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border)',
        }}
      >
        <SidebarContent
          collapsed={collapsed}
          unreadCount={unreadCount}
          avatarGradient={avatarGradient}
          initials={initials}
          user={user}
          onNotif={() => setNotifOpen(true)}
          onLogout={handleLogout}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </aside>

      {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
    </>
  );
}

interface SidebarContentProps {
  collapsed: boolean;
  unreadCount: number;
  avatarGradient: string;
  initials: string;
  user: { displayName: string; role: string } | null;
  onNotif: () => void;
  onLogout: () => void;
  onToggleCollapse?: () => void;
  onClose?: () => void;
  showClose?: boolean;
}

function SidebarContent({
  collapsed, unreadCount, avatarGradient, initials, user,
  onNotif, onLogout, onToggleCollapse, onClose, showClose
}: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`flex items-center p-4 border-b ${collapsed ? 'justify-center' : 'justify-between'}`}
        style={{ borderColor: 'var(--border)' }}>
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)' }}>
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-white text-lg">PulseOS</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)' }}>
            <Activity className="w-4 h-4 text-white" />
          </div>
        )}
        <div className="flex items-center gap-1">
          {showClose && (
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/5">
              <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </button>
          )}
          {onToggleCollapse && (
            <button onClick={onToggleCollapse}
              className="p-1 rounded-lg hover:bg-white/5 transition-colors">
              {collapsed
                ? <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                : <ChevronLeft className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}

        <button
          onClick={onNotif}
          className={`sidebar-link w-full relative ${collapsed ? 'justify-center px-0' : ''}`}
          title={collapsed ? 'Notifications' : undefined}
        >
          <Bell className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Notifications</span>}
          {unreadCount > 0 && (
            <span className={`${collapsed ? 'absolute top-1 right-1' : 'ml-auto'} min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-mono px-1`}>
              {unreadCount}
            </span>
          )}
        </button>
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t space-y-1" style={{ borderColor: 'var(--border)' }}>
        <button
          className={`sidebar-link w-full ${collapsed ? 'justify-center px-0' : ''}`}
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>

        {/* User */}
        <div className={`flex items-center gap-3 p-2 rounded-xl mt-2 ${collapsed ? 'justify-center' : ''}`}>
          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
            {initials}
          </div>
          {!collapsed && user && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user.displayName}</p>
              <p className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>{user.role}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg hover:bg-white/5 transition-colors flex-shrink-0"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </button>
          )}
        </div>
        {collapsed && (
          <button
            onClick={onLogout}
            className="sidebar-link w-full justify-center px-0"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
