import React, { useEffect, useState } from 'react';
import { User, Appointment, AppointmentStatus, Patient } from '../../types';
import { MockDB } from '../../services/mockDb';
import { Link } from 'react-router-dom';

const PatientDashboard = ({ user }: { user: User | null }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patientProfile, setPatientProfile] = useState<Patient | null>(null);
  const [newHistoryItem, setNewHistoryItem] = useState('');

  useEffect(() => {
    if (user) {
      const all = MockDB.getAppointments();
      setAppointments(all.filter(a => a.patientId === user.id));
      
      const p = MockDB.getPatientById(user.id);
      if (p) setPatientProfile(p);
    }
  }, [user]);

  const handleAddHistory = () => {
    if (!patientProfile || !newHistoryItem.trim()) return;
    
    const updatedHistory = [...(patientProfile.medicalHistory || []), newHistoryItem.trim()];
    const updatedProfile = { ...patientProfile, medicalHistory: updatedHistory };
    
    MockDB.updatePatient(updatedProfile);
    setPatientProfile(updatedProfile);
    setNewHistoryItem('');
  };

  const handleRemoveHistory = (index: number) => {
      if (!patientProfile) return;
      const updatedHistory = [...(patientProfile.medicalHistory || [])];
      updatedHistory.splice(index, 1);
      const updatedProfile = { ...patientProfile, medicalHistory: updatedHistory };
      MockDB.updatePatient(updatedProfile);
      setPatientProfile(updatedProfile);
  };

  const upcoming = appointments.filter(a => new Date(a.date) >= new Date() && a.status !== AppointmentStatus.CANCELLED);
  const past = appointments.filter(a => new Date(a.date) < new Date() || a.status === AppointmentStatus.CANCELLED);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name}</h1>
          <p className="text-slate-500">Here's an overview of your health schedule.</p>
        </div>
        <Link to="/patient/book" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition shadow-sm">
          <i className="fas fa-plus mr-2"></i>Book New
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Upcoming Appointments</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{upcoming.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-xl">
              <i className="fas fa-calendar-alt"></i>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Visits</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{past.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-xl">
              <i className="fas fa-history"></i>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Active Prescriptions</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">2</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center text-xl">
              <i className="fas fa-pills"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 font-bold text-slate-800">
            Upcoming Appointments
          </div>
          {upcoming.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No upcoming appointments.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase font-medium text-slate-500">
                  <tr>
                    <th className="px-6 py-3">Doctor</th>
                    <th className="px-6 py-3">Date & Time</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {upcoming.map(appt => (
                    <tr key={appt.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-medium text-slate-900">{appt.doctorName}</td>
                      <td className="px-6 py-4">
                        {new Date(appt.date).toLocaleDateString()} <span className="text-slate-400">|</span> {appt.timeSlot}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 ${appt.type === 'Video' ? 'text-purple-600' : 'text-blue-600'}`}>
                          <i className={`fas ${appt.type === 'Video' ? 'fa-video' : 'fa-hospital-user'}`}></i>
                          {appt.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Medical History Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-slate-800">Medical History</h3>
             <i className="fas fa-notes-medical text-primary/40 text-2xl"></i>
          </div>
          
          <div className="flex-1 overflow-y-auto max-h-[300px] space-y-2 mb-4">
             {patientProfile?.medicalHistory?.length === 0 ? (
               <p className="text-slate-400 text-sm italic">No medical history recorded.</p>
             ) : (
               patientProfile?.medicalHistory?.map((item, index) => (
                 <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg group hover:bg-slate-100 transition">
                   <span className="text-slate-700 text-sm">{item}</span>
                   <button 
                     onClick={() => handleRemoveHistory(index)}
                     className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                   >
                     <i className="fas fa-trash-alt"></i>
                   </button>
                 </div>
               ))
             )}
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100">
             <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Add New Condition</label>
             <div className="flex gap-2">
               <input 
                 type="text" 
                 value={newHistoryItem}
                 onChange={(e) => setNewHistoryItem(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleAddHistory()}
                 placeholder="e.g. Type 2 Diabetes"
                 className="flex-1 text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
               />
               <button 
                 onClick={handleAddHistory}
                 disabled={!newHistoryItem.trim()}
                 className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-sky-600 disabled:opacity-50 transition"
               >
                 <i className="fas fa-plus"></i>
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;