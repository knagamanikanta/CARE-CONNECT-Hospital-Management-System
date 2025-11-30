import React, { useState, useEffect } from 'react';
import { User, Doctor, AppointmentStatus } from '../../types';
import { MockDB } from '../../services/mockDb';
import { useNavigate } from 'react-router-dom';

const BookAppointment = ({ user }: { user: User | null }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [apptType, setApptType] = useState<'In-Person' | 'Video'>('In-Person');
  
  // Payment State
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setDoctors(MockDB.getDoctors());
  }, []);

  const handleNext = () => setStep(p => p + 1);
  const handleBack = () => setStep(p => p - 1);

  const confirmBooking = () => {
    if (!user || !selectedDoctor) return;
    
    setIsProcessing(true);
    
    // Simulate Stripe Payment API call delay
    setTimeout(() => {
      MockDB.addAppointment({
        id: `appt_${Date.now()}`,
        patientId: user.id,
        doctorId: selectedDoctor.id,
        patientName: user.name,
        doctorName: selectedDoctor.name,
        date: selectedDate,
        timeSlot: selectedSlot,
        status: AppointmentStatus.PENDING,
        type: apptType,
        paymentStatus: 'PAID',
        amount: selectedDoctor.fee
      });
      setIsProcessing(false);
      setStep(4); // Success step
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Stepper */}
      <div className="mb-8 flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10"></div>
        {[1, 2, 3, 4].map(s => (
          <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
            step >= s ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'
          }`}>
            {s}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-8 min-h-[400px]">
        
        {/* Step 1: Select Doctor */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Select a Specialist</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {doctors.map(doc => (
                <div 
                  key={doc.id} 
                  onClick={() => setSelectedDoctor(doc)}
                  className={`p-4 border rounded-xl cursor-pointer transition hover:shadow-md flex items-start gap-4 ${
                    selectedDoctor?.id === doc.id ? 'border-primary ring-1 ring-primary bg-primary/5' : 'border-slate-200'
                  }`}
                >
                  <img src={doc.avatarUrl} alt={doc.name} className="w-16 h-16 rounded-full object-cover bg-slate-200" />
                  <div>
                    <h3 className="font-bold text-slate-900">{doc.name}</h3>
                    <p className="text-primary text-sm font-medium">{doc.specialization}</p>
                    <p className="text-xs text-slate-500 mt-1">{doc.experienceYears} years exp • {doc.rating} ⭐</p>
                    <p className="text-slate-700 font-bold mt-2">${doc.fee} / visit</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <button 
                disabled={!selectedDoctor}
                onClick={handleNext}
                className="bg-primary disabled:bg-slate-300 text-white px-6 py-2 rounded-lg font-medium"
              >
                Next: Schedule
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <div>
             <h2 className="text-2xl font-bold mb-6">Choose Date & Time</h2>
             <div className="grid md:grid-cols-2 gap-8">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                  <input 
                    type="date" 
                    className="w-full border-slate-300 rounded-lg shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border"
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Visit Type</label>
                    <div className="flex gap-4">
                      {['In-Person', 'Video'].map(type => (
                        <button
                          key={type}
                          onClick={() => setApptType(type as any)}
                          className={`flex-1 py-2 rounded-lg border text-sm font-medium ${
                            apptType === type ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-300'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-2">Available Slots</label>
                 <div className="grid grid-cols-3 gap-2">
                    {selectedDoctor?.availableSlots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 text-sm rounded-md border ${
                          selectedSlot === slot ? 'bg-primary text-white border-primary' : 'hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                 </div>
               </div>
             </div>
             <div className="mt-8 flex justify-between">
                <button onClick={handleBack} className="text-slate-500 font-medium hover:text-slate-800">Back</button>
                <button 
                  disabled={!selectedDate || !selectedSlot}
                  onClick={handleNext}
                  className="bg-primary disabled:bg-slate-300 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Next: Payment
                </button>
             </div>
          </div>
        )}

        {/* Step 3: Payment (Mock Stripe) */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Confirm & Pay</h2>
            <div className="bg-slate-50 p-6 rounded-lg mb-6 border border-slate-200">
               <div className="flex justify-between mb-2">
                 <span className="text-slate-600">Doctor</span>
                 <span className="font-medium">{selectedDoctor?.name}</span>
               </div>
               <div className="flex justify-between mb-2">
                 <span className="text-slate-600">Date & Time</span>
                 <span className="font-medium">{selectedDate} at {selectedSlot}</span>
               </div>
               <div className="flex justify-between mb-4 border-b pb-4 border-slate-200">
                 <span className="text-slate-600">Consultation Fee</span>
                 <span className="font-medium">${selectedDoctor?.fee}</span>
               </div>
               <div className="flex justify-between text-lg font-bold">
                 <span>Total</span>
                 <span className="text-primary">${selectedDoctor?.fee}</span>
               </div>
            </div>

            <div className="bg-white p-4 border border-slate-300 rounded-lg mb-6">
              <div className="flex items-center gap-3 mb-4 text-slate-700 font-medium">
                 <i className="fas fa-credit-card"></i> Card Details (Test Mode)
              </div>
              <input type="text" placeholder="Card Number (4242 4242 4242 4242)" className="w-full border p-2 rounded mb-2 bg-slate-50" disabled />
              <div className="flex gap-2">
                 <input type="text" placeholder="MM/YY" className="w-1/2 border p-2 rounded bg-slate-50" disabled />
                 <input type="text" placeholder="CVC" className="w-1/2 border p-2 rounded bg-slate-50" disabled />
              </div>
              <p className="text-xs text-slate-400 mt-2">This is a mock payment form. No real transaction will occur.</p>
            </div>

            <div className="mt-8 flex justify-between">
                <button onClick={handleBack} className="text-slate-500 font-medium hover:text-slate-800">Back</button>
                <button 
                  onClick={confirmBooking}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg flex items-center gap-2"
                >
                  {isProcessing ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-lock"></i>}
                  Pay & Confirm
                </button>
             </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              <i className="fas fa-check"></i>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
            <p className="text-slate-600 mb-8">Your appointment has been successfully scheduled. A confirmation email has been sent.</p>
            <button 
              onClick={() => navigate('/patient/dashboard')}
              className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-sky-600"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
