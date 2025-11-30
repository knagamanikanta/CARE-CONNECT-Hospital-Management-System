import { User, UserRole, Doctor, Patient, Appointment, AppointmentStatus } from '../types';

// Seed Data
const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Sarah Wilson',
    email: 'sarah@careconnect.com',
    role: UserRole.DOCTOR,
    specialization: 'Cardiology',
    experienceYears: 12,
    fee: 150,
    availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00'],
    bio: 'Expert cardiologist with over a decade of experience in treating heart diseases.',
    rating: 4.9,
    patientsCount: 1200,
    avatarUrl: 'https://picsum.photos/200/200?random=1',
  },
  {
    id: 'd2',
    name: 'Dr. James Chen',
    email: 'james@careconnect.com',
    role: UserRole.DOCTOR,
    specialization: 'Neurology',
    experienceYears: 8,
    fee: 180,
    availableSlots: ['10:00', '11:30', '14:30', '16:00'],
    bio: 'Specialist in neurological disorders and brain health.',
    rating: 4.8,
    patientsCount: 850,
    avatarUrl: 'https://picsum.photos/200/200?random=2',
  },
  {
    id: 'd3',
    name: 'Dr. Emily Carter',
    email: 'emily@careconnect.com',
    role: UserRole.DOCTOR,
    specialization: 'Pediatrics',
    experienceYears: 5,
    fee: 100,
    availableSlots: ['08:30', '09:30', '10:30', '13:00', '14:00'],
    bio: 'Compassionate pediatrician dedicated to child wellness.',
    rating: 4.95,
    patientsCount: 2100,
    avatarUrl: 'https://picsum.photos/200/200?random=3',
  },
];

const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p1',
    name: 'John Doe',
    email: 'john@gmail.com',
    role: UserRole.PATIENT,
    dob: '1985-04-12',
    bloodGroup: 'O+',
    address: '123 Main St, Springfield',
    medicalHistory: ['Hypertension', 'Seasonal Allergies'],
    avatarUrl: 'https://picsum.photos/200/200?random=4',
  },
];

const MOCK_ADMIN: User = {
  id: 'a1',
  name: 'Admin User',
  email: 'admin@careconnect.com',
  role: UserRole.ADMIN,
  avatarUrl: 'https://picsum.photos/200/200?random=5',
};

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt1',
    patientId: 'p1',
    doctorId: 'd1',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Wilson',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '10:00',
    status: AppointmentStatus.CONFIRMED,
    type: 'Video',
    paymentStatus: 'PAID',
    amount: 150,
  },
  {
    id: 'appt2',
    patientId: 'p1',
    doctorId: 'd2',
    patientName: 'John Doe',
    doctorName: 'Dr. James Chen',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    timeSlot: '14:30',
    status: AppointmentStatus.PENDING,
    type: 'In-Person',
    paymentStatus: 'UNPAID',
    amount: 180,
  },
];

// Local Storage Helper
const loadFromStorage = <T,>(key: string, defaultVal: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultVal;
};

const saveToStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Mock Database API
export const MockDB = {
  getDoctors: (): Doctor[] => loadFromStorage('doctors', MOCK_DOCTORS),
  
  getDoctorById: (id: string): Doctor | undefined => 
    loadFromStorage<Doctor[]>('doctors', MOCK_DOCTORS).find(d => d.id === id),

  getPatients: (): Patient[] => loadFromStorage('patients', MOCK_PATIENTS),

  getPatientById: (id: string): Patient | undefined => 
    loadFromStorage<Patient[]>('patients', MOCK_PATIENTS).find(p => p.id === id),
  
  updatePatient: (patient: Patient) => {
    const patients = loadFromStorage<Patient[]>('patients', MOCK_PATIENTS);
    const index = patients.findIndex(p => p.id === patient.id);
    if (index !== -1) {
      patients[index] = patient;
      saveToStorage('patients', patients);
    }
  },

  getAppointments: (): Appointment[] => loadFromStorage('appointments', MOCK_APPOINTMENTS),

  addAppointment: (appt: Appointment) => {
    const appts = loadFromStorage<Appointment[]>('appointments', MOCK_APPOINTMENTS);
    appts.push(appt);
    saveToStorage('appointments', appts);
    return appt;
  },

  updateAppointmentStatus: (id: string, status: AppointmentStatus) => {
    const appts = loadFromStorage<Appointment[]>('appointments', MOCK_APPOINTMENTS);
    const index = appts.findIndex(a => a.id === id);
    if (index !== -1) {
      appts[index].status = status;
      saveToStorage('appointments', appts);
    }
  },
  
  // Auth Helpers
  findUserByEmail: (email: string): User | undefined => {
    const doctors = loadFromStorage<Doctor[]>('doctors', MOCK_DOCTORS);
    const patients = loadFromStorage<Patient[]>('patients', MOCK_PATIENTS);
    const admin = MOCK_ADMIN;
    
    if (admin.email === email) return admin;
    const doc = doctors.find(d => d.email === email);
    if (doc) return doc;
    return patients.find(p => p.email === email);
  },

  registerPatient: (name: string, email: string) => {
     const patients = loadFromStorage<Patient[]>('patients', MOCK_PATIENTS);
     const newPatient: Patient = {
         id: `p${Date.now()}`,
         name,
         email,
         role: UserRole.PATIENT,
         dob: '',
         bloodGroup: '',
         address: '',
         medicalHistory: [],
         avatarUrl: `https://ui-avatars.com/api/?name=${name}`
     };
     patients.push(newPatient);
     saveToStorage('patients', patients);
     return newPatient;
  },

  addDoctor: (doctorData: Omit<Doctor, 'id' | 'role' | 'patientsCount' | 'rating' | 'avatarUrl'>) => {
      const doctors = loadFromStorage<Doctor[]>('doctors', MOCK_DOCTORS);
      const newDoctor: Doctor = {
          ...doctorData,
          id: `d${Date.now()}`,
          role: UserRole.DOCTOR,
          patientsCount: 0,
          rating: 0,
          avatarUrl: `https://ui-avatars.com/api/?name=${doctorData.name}`
      };
      doctors.push(newDoctor);
      saveToStorage('doctors', doctors);
      return newDoctor;
  },

  deleteDoctor: (id: string) => {
      let doctors = loadFromStorage<Doctor[]>('doctors', MOCK_DOCTORS);
      doctors = doctors.filter(d => d.id !== id);
      saveToStorage('doctors', doctors);
  }
};