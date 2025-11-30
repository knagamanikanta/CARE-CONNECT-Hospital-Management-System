import React, { useState, useEffect } from 'react';
import { User, Appointment, AppointmentStatus } from '../../types';
import { MockDB } from '../../services/mockDb';

const DoctorDashboard = ({ user }: { user: User | null }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  useEffect(() => {
    if (user) {
      // In a real app, query by doctor ID
      const all = MockDB.getAppointments().filter(a => a.doctorId === user.id);
      setAppointments(all);
    }
  }, [user]);

  const handleStatusChange = (id: string, newStatus: AppointmentStatus) => {
    MockDB.updateAppointmentStatus(id, newStatus);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const pending = appointments.filter(a => a.status === AppointmentStatus.PENDING);
  const today = appointments.filter(a => a.date === new Date().toISOString().split('T')[0] && a.status === AppointmentStatus.CONFIRMED);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dr. {user?.name}</h1>
        <p className="text-slate-500">You have {today.length} appointments today.</p>
      </div>

      {/* Action Required */}
      {pending.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
           <h3 className="font-bold text-amber-800 mb-4 flex items-center">
             <i className="fas fa-exclamation-circle mr-2"></i> Appointment Requests ({pending.length})
           </h3>
           <div className="space-y-3">
             {pending.map(appt => (
               <div key={appt.id} className="bg-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                    <p className="font-bold text-slate-800">{appt.patientName}</p>
                    <p className="text-sm text-slate-500">{appt.date} at {appt.timeSlot} • {appt.type}</p>
                 </div>
                 <div className="flex gap-2">
                   <button 
                     onClick={() => handleStatusChange(appt.id, AppointmentStatus.CONFIRMED)}
                     className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-700"
                   >
                     Confirm
                   </button>
                   <button 
                     onClick={() => handleStatusChange(appt.id, AppointmentStatus.DECLINED)}
                     className="bg-red-100 text-red-600 px-4 py-2 rounded text-sm font-bold hover:bg-red-200"
                   >
                     Decline
                   </button>
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}

      {/* Today's Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Today's Schedule</h3>
          <span className="text-sm text-slate-500">{new Date().toLocaleDateString()}</span>
        </div>
        <div className="divide-y divide-slate-100">
          {today.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No appointments scheduled for today.</div>
          ) : (
            today.map(appt => (
              <div key={appt.id} className="p-6 flex items-start gap-4 hover:bg-slate-50 transition">
                <div className="w-16 text-center">
                  <span className="block text-lg font-bold text-slate-800">{appt.timeSlot}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900">{appt.patientName}</h4>
                  <p className="text-sm text-slate-500 mb-2">{appt.type} Consultation</p>
                  <div className="flex gap-2">
                    <button className="text-primary text-sm font-medium hover:underline">View Patient Record</button>
                    <span className="text-slate-300">|</span>
                    <button className="text-primary text-sm font-medium hover:underline">Add Prescription</button>
                  </div>
                </div>
                <div>
                   <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">PAID</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
