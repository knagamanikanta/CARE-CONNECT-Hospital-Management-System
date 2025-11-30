import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-blue-600 text-white py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Healthcare Simplified. <br/> Life Amplified.
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto">
            Book appointments, manage prescriptions, and consult with top doctors—all in one place. Experience the future of hospital management.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="px-8 py-4 bg-white text-primary font-bold rounded-lg shadow-lg hover:bg-slate-100 transition transform hover:-translate-y-1">
              Get Started
            </Link>
            <Link to="/login" className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition">
              Patient Login
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl"></div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why Choose Care Connect?</h2>
            <p className="text-slate-600 mt-4">Comprehensive care management for everyone.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: 'fa-calendar-check', title: 'Easy Booking', desc: 'Book appointments with specialists in seconds.' },
              { icon: 'fa-user-md', title: 'Top Doctors', desc: 'Access highly qualified and rated medical professionals.' },
              { icon: 'fa-robot', title: 'AI Health Assistant', desc: 'Get instant answers to general health questions 24/7.' }
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl mb-6">
                  <i className={`fas ${f.icon}`}></i>
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{f.title}</h3>
                <p className="text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="text-2xl font-bold text-white mb-2"><i className="fas fa-heartbeat mr-2"></i>CARE CONNECT</div>
            <p className="text-sm">© 2024 Care Connect HMS. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition"><i className="fab fa-twitter text-xl"></i></a>
            <a href="#" className="hover:text-white transition"><i className="fab fa-facebook text-xl"></i></a>
            <a href="#" className="hover:text-white transition"><i className="fab fa-linkedin text-xl"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
