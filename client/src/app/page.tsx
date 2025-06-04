'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CoursesSection from '@/components/CoursesSection';
import PalestrasSection from '@/components/PalestrasSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import PricingSection from '@/components/PricingSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';
import QueryDisplay from '@/components/QueryDisplay';
import { QueryProvider, useQuery } from '@/contexts/QueryContext';

function HomeContent() {
  const [darkMode, setDarkMode] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const { queries } = useQuery();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const openAdminLogin = () => {
    setShowAdminLogin(true);
  };

  const closeAdminLogin = () => {
    setShowAdminLogin(false);
  };

  const openAdminDashboard = () => {
    setShowAdminLogin(false);
    setShowAdminDashboard(true);
  };

  const closeAdminDashboard = () => {
    setShowAdminDashboard(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Hero />
      <CoursesSection />
      <PalestrasSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <Footer onAdminClick={openAdminLogin} />

      <AdminLogin
        isOpen={showAdminLogin}
        onClose={closeAdminLogin}
        onSuccess={openAdminDashboard}
      />
      <AdminDashboard
        isOpen={showAdminDashboard}
        onClose={closeAdminDashboard}
      />
      <QueryDisplay queries={queries} />
    </div>
  );
}

export default function Home() {
  return (
    <QueryProvider>
      <HomeContent />
    </QueryProvider>
  );
}
