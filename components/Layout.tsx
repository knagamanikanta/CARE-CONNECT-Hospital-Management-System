import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { UserRole, User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

const SidebarItem = ({ to, icon, label, active }: { to: string; icon: string; label: string; active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
      active
        ? 'bg-primary/10 text-primary border-r-4 border-primary'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <i className={`fas ${icon} w-6`}></i>
    <span>{label}</span>
  </Link>
);

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) {
    return <>{children}</>;
  }

  const isActive = (path: string) => location.pathname === path;

  const renderNavItems = () => {
    switch (user.role) {
      case UserRole.ADMIN:
        return (
          <>
            <SidebarItem to="/admin/dashboard" icon="fa-chart-line" label="Dashboard" active={isActive('/admin/dashboard')} />
            <SidebarItem to="/admin/doctors" icon="fa-user-md" label="Manage Doctors" active={isActive('/admin/doctors')} />
            <SidebarItem to="/admin/appointments" icon="fa-calendar-check" label="All Appointments" active={isActive('/admin/appointments')} />
            <SidebarItem to="/admin/reports" icon="fa-file-invoice-dollar" label="Reports" active={isActive('/admin/reports')} />
          </>
        );
      case UserRole.DOCTOR:
        return (
          <>
            <SidebarItem to="/doctor/dashboard" icon="fa-stethoscope" label="Dashboard" active={isActive('/doctor/dashboard')} />
            <SidebarItem to="/doctor/schedule" icon="fa-calendar-alt" label="My Schedule" active={isActive('/doctor/schedule')} />
            <SidebarItem to="/doctor/patients" icon="fa-users" label="My Patients" active={isActive('/doctor/patients')} />
          </>
        );
      case UserRole.PATIENT:
        return (
          <>
            <SidebarItem to="/patient/dashboard" icon="fa-home" label="Dashboard" active={isActive('/patient/dashboard')} />
            <SidebarItem to="/patient/book" icon="fa-plus-circle" label="Book Appointment" active={isActive('/patient/book')} />
            <SidebarItem to="/patient/history" icon="fa-history" label="Medical History" active={isActive('/patient/history')} />
            <SidebarItem to="/patient/ai-chat" icon="fa-robot" label="AI Assistant" active={isActive('/patient/ai-chat')} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="flex items-center justify-center h-16 border-b border-slate-200">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <i className="fas fa-heartbeat"></i>
            <span>CARE CONNECT</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1">{renderNavItems()}</nav>
        </div>
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-danger hover:bg-red-50 rounded-md transition-colors"
          >
            <i className="fas fa-sign-out-alt w-6"></i>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between md:justify-end h-16 px-6 bg-white border-b border-slate-200">
          <div className="md:hidden flex items-center">
             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-500 hover:text-primary">
               <i className="fas fa-bars text-xl"></i>
             </button>
             <span className="ml-3 font-bold text-primary">CARE CONNECT</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700 hidden sm:block">{user.name}</span>
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                   {user.name.charAt(0)}
                </div>
             </div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-slate-800/50" onClick={() => setMobileMenuOpen(false)}>
            <div className="absolute left-0 top-0 w-64 h-full bg-white shadow-xl" onClick={e => e.stopPropagation()}>
               <div className="flex items-center justify-between p-4 border-b">
                 <span className="font-bold text-primary">Menu</span>
                 <button onClick={() => setMobileMenuOpen(false)}><i className="fas fa-times"></i></button>
               </div>
               <nav className="py-4">{renderNavItems()}</nav>
               <div className="absolute bottom-0 w-full p-4 border-t">
                  <button onClick={onLogout} className="flex items-center w-full text-danger">
                    <i className="fas fa-sign-out-alt mr-2"></i> Logout
                  </button>
               </div>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
