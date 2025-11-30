import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MockDB } from '../../services/mockDb';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    revenue: 0
  });

  // Mock Data for Chart
  const data = [
    { name: 'Jan', appts: 40, revenue: 2400 },
    { name: 'Feb', appts: 30, revenue: 1398 },
    { name: 'Mar', appts: 20, revenue: 9800 },
    { name: 'Apr', appts: 27, revenue: 3908 },
    { name: 'May', appts: 18, revenue: 4800 },
    { name: 'Jun', appts: 23, revenue: 3800 },
  ];

  useEffect(() => {
    const doctors = MockDB.getDoctors().length;
    const patients = MockDB.getPatients().length;
    const appts = MockDB.getAppointments();
    const revenue = appts.reduce((sum, a) => sum + (a.paymentStatus === 'PAID' ? a.amount : 0), 0);
    
    setStats({ doctors, patients, appointments: appts.length, revenue });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium uppercase">Total Revenue</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">${stats.revenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium uppercase">Total Appointments</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{stats.appointments}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium uppercase">Active Doctors</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{stats.doctors}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium uppercase">Registered Patients</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{stats.patients}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96">
          <h3 className="font-bold text-slate-800 mb-6">Revenue & Appointments Overview</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="revenue" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="appts" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions / Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
           <div className="space-y-3">
             <button className="w-full text-left p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition flex items-center justify-between group">
               <span className="font-medium text-slate-700 group-hover:text-primary">Add New Doctor</span>
               <i className="fas fa-plus text-slate-400 group-hover:text-primary"></i>
             </button>
             <button className="w-full text-left p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition flex items-center justify-between group">
               <span className="font-medium text-slate-700 group-hover:text-primary">Generate Financial Report</span>
               <i className="fas fa-download text-slate-400 group-hover:text-primary"></i>
             </button>
             <button className="w-full text-left p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition flex items-center justify-between group">
               <span className="font-medium text-slate-700 group-hover:text-primary">Manage System Settings</span>
               <i className="fas fa-cog text-slate-400 group-hover:text-primary"></i>
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
