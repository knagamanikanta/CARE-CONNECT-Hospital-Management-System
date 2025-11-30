import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { MockDB } from '../services/mockDb';

const Login = ({ onLogin }: { onLogin: (u: User) => void }) => {
  const [email, setEmail] = useState('sarah@careconnect.com'); // Default doctor credential for demo
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mock Authentication Logic
    const user = MockDB.findUserByEmail(email);
    
    if (user) {
      // In real app, check password hash here
      onLogin(user);
      navigate(`/${user.role.toLowerCase()}/dashboard`);
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-primary block mb-2"><i className="fas fa-heartbeat"></i></Link>
          <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-slate-500">Sign in to your Care Connect account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-sky-600 transition shadow-lg shadow-sky-200">
            Sign In
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="text-center text-sm text-slate-500 mb-4">Demo Credentials</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button onClick={() => setEmail('sarah@careconnect.com')} className="p-2 bg-slate-50 hover:bg-slate-100 rounded border">Doctor</button>
            <button onClick={() => setEmail('john@gmail.com')} className="p-2 bg-slate-50 hover:bg-slate-100 rounded border">Patient</button>
            <button onClick={() => setEmail('admin@careconnect.com')} className="p-2 bg-slate-50 hover:bg-slate-100 rounded border">Admin</button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
