import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/patient/Dashboard';
import BookAppointment from './pages/patient/BookAppointment';
import AIChat from './pages/patient/AIChat';
import DoctorDashboard from './pages/doctor/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import { User, UserRole } from './types';
import { MockDB } from './services/mockDb';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for persisted session
    const storedUser = localStorage.getItem('care_connect_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('care_connect_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('care_connect_user');
    window.location.hash = '#/';
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-primary"><i className="fas fa-circle-notch fa-spin text-4xl"></i></div>;

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={user ? <Navigate to={`/${user.role.toLowerCase()}/dashboard`} /> : <Landing />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />

          {/* Patient Routes */}
          <Route path="/patient/dashboard" element={
            <ProtectedRoute user={user} role={UserRole.PATIENT}><PatientDashboard user={user} /></ProtectedRoute>
          } />
          <Route path="/patient/book" element={
            <ProtectedRoute user={user} role={UserRole.PATIENT}><BookAppointment user={user} /></ProtectedRoute>
          } />
          <Route path="/patient/ai-chat" element={
            <ProtectedRoute user={user} role={UserRole.PATIENT}><AIChat /></ProtectedRoute>
          } />
          <Route path="/patient/history" element={
            <ProtectedRoute user={user} role={UserRole.PATIENT}><div className="p-8 text-center text-slate-500">Medical History Feature Coming Soon</div></ProtectedRoute>
          } />

          {/* Doctor Routes */}
          <Route path="/doctor/dashboard" element={
            <ProtectedRoute user={user} role={UserRole.DOCTOR}><DoctorDashboard user={user} /></ProtectedRoute>
          } />
           <Route path="/doctor/patients" element={
            <ProtectedRoute user={user} role={UserRole.DOCTOR}><div className="p-8 text-center text-slate-500">Patient List Feature Coming Soon</div></ProtectedRoute>
          } />
           <Route path="/doctor/schedule" element={
            <ProtectedRoute user={user} role={UserRole.DOCTOR}><div className="p-8 text-center text-slate-500">Schedule Management Feature Coming Soon</div></ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute user={user} role={UserRole.ADMIN}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/doctors" element={
            <ProtectedRoute user={user} role={UserRole.ADMIN}><div className="p-8 text-center text-slate-500">Doctor Management Feature Coming Soon</div></ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute user={user} role={UserRole.ADMIN}><div className="p-8 text-center text-slate-500">Advanced Reports Feature Coming Soon</div></ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

const ProtectedRoute = ({ user, role, children }: { user: User | null, role: UserRole, children: React.ReactNode }) => {
  if (!user) return <Navigate to="/login" />;
  if (user.role !== role) return <Navigate to="/" />;
  return <>{children}</>;
};

export default App;