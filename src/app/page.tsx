'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import PremiumDashboard from '@/components/dashboard/PremiumDashboard';
import { identity } from '@/lib/sdk';

export default function Home() {
  const [view, setView] = useState<'welcome' | 'onboarding' | 'dashboard'>('welcome');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
        const u = await identity.getCurrentUser();
        if (u) {
            setView('dashboard');
        }
        setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#050505]">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="bg-[#050505] min-h-screen selection:bg-blue-500/30">
      <AnimatePresence mode="wait">
        {view === 'welcome' && (
          <motion.div 
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen flex items-center justify-center overflow-hidden relative"
          >
            <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full" />
            <div className="relative z-10 text-center px-4">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
              >
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Powered by Supabase Root</span>
              </motion.div>

              <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-tight">
                SHIVAI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">IDENTITY</span>
              </h1>
              
              <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
                The unified digital brain of the ShivAI Ecosystem. Secure, intelligent, and entirely yours.
              </p>

              <div className="flex flex-col md:flex-row gap-6 justify-center">
                <button 
                    onClick={() => setView('onboarding')}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-500/20"
                >
                  Enter Gateway <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'onboarding' && (
          <motion.div 
            key="onboarding"
            className="min-h-screen flex items-center justify-center p-4"
          >
            <OnboardingWizard onComplete={() => setView('dashboard')} />
          </motion.div>
        )}

        {view === 'dashboard' && (
          <motion.div key="dashboard">
            <PremiumDashboard />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
