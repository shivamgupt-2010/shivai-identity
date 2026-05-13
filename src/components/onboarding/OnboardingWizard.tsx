'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Shield, CheckCircle, ArrowRight, ArrowLeft, Lock, Globe, Calendar } from 'lucide-react';
import { shivai } from '@/lib/sdk';

export default function OnboardingWizard({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '', // This will be the @shiv.ai address
    username: '',
    dob: '',
    country: '',
    password: ''
  });

  const [isLogin, setIsLogin] = useState(false);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleAuth = async () => {
    setLoading(true);
    setError('');
    
    // Validation
    if (!formData.email.endsWith('@shiv.ai')) {
        setError('Only @shiv.ai email addresses are allowed.');
        setLoading(false);
        return;
    }

    try {
      if (isLogin) {
        const { data, error } = await shivai.login(formData.email, formData.password);
        if (error) throw error;
        onComplete();
      } else {
        const { data, error } = await shivai.signUp(formData.email, formData.password, {
            full_name: formData.fullName,
            username: formData.username,
            dob: formData.dob,
            country: formData.country,
        });
        if (error) throw error;
        
        if (data.session) {
            onComplete();
        } else {
            setError('Identity initialized. Please check if verification is required or try logging in.');
            setIsLogin(true);
            setStep(1);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const steps = isLogin ? [
    {
        title: "Welcome Back",
        desc: "Enter your ShivAI credentials.",
        icon: <Shield className="text-blue-400" />,
        fields: (
          <div className="space-y-4">
            <Input label="ShivAI Email" value={formData.email} onChange={v => setFormData({...formData, email: v})} placeholder="name@shiv.ai" type="email" />
            <Input label="Password" value={formData.password} onChange={v => setFormData({...formData, password: v})} placeholder="••••••••" type="password" />
          </div>
        )
    }
  ] : [
    {
      title: "Basic Info",
      desc: "Who are you in the physical world?",
      icon: <User className="text-blue-400" />,
      fields: (
        <div className="space-y-4">
          <Input label="Full Name" value={formData.fullName} onChange={v => setFormData({...formData, fullName: v})} placeholder="John Doe" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date of Birth" value={formData.dob} onChange={v => setFormData({...formData, dob: v})} placeholder="YYYY-MM-DD" type="date" />
            <Input label="Country" value={formData.country} onChange={v => setFormData({...formData, country: v})} placeholder="India" />
          </div>
        </div>
      )
    },
    {
      title: "Choose Handle",
      desc: "Pick your unique @shiv.ai identity.",
      icon: <Mail className="text-purple-400" />,
      fields: (
        <div className="space-y-4">
          <Input label="Username" value={formData.username} onChange={v => {
              setFormData({
                  ...formData, 
                  username: v,
                  email: `${v.toLowerCase()}@shiv.ai`
              })
          }} placeholder="shivam_pioneer" />
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
             <p className="text-[10px] font-black uppercase text-blue-400 mb-1">Your Digital Address</p>
             <p className="text-sm font-bold text-white">{formData.email || '...@shiv.ai'}</p>
          </div>
        </div>
      )
    },
    {
      title: "Security Setup",
      desc: "Create a master password for your identity.",
      icon: <Lock className="text-emerald-400" />,
      fields: (
        <div className="space-y-4">
          <Input label="Master Password" value={formData.password} onChange={v => setFormData({...formData, password: v})} placeholder="••••••••" type="password" />
          <p className="text-[10px] text-gray-500 leading-relaxed">This password grants access to all ShivAI apps including Mail and VibeConnect.</p>
        </div>
      )
    }
  ];

  const current = steps[step - 1];

  return (
    <div className="max-w-md w-full mx-auto p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={isLogin ? 'login' : 'signup'}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl"
        >
          <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-white/10">
            {current?.icon}
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">{current?.title}</h1>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">{current?.desc}</p>

          <div className="mb-8">
            {current?.fields}
            {error && <p className="text-red-400 text-xs mt-4 bg-red-400/10 p-3 rounded-lg border border-red-400/20 font-bold">{error}</p>}
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex gap-4">
                {step > 1 && !isLogin && (
                    <button onClick={prevStep} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                )}
                <button 
                    onClick={step < (isLogin ? 1 : 3) ? nextStep : handleAuth}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95"
                >
                    {loading ? 'Processing...' : step < (isLogin ? 1 : 3) ? 'Continue' : isLogin ? 'Login' : 'Create Identity'}
                    {!loading && <ArrowRight size={18} />}
                </button>
            </div>
            
            <button 
                onClick={() => { setIsLogin(!isLogin); setStep(1); setError(''); }}
                className="text-xs text-gray-600 font-bold uppercase tracking-widest hover:text-blue-400 transition-colors"
            >
                {isLogin ? "New Identity? Register" : "Have Identity? Secure Login"}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }: { label: string, value: string, onChange: (v: string) => void, placeholder: string, type?: string }) {
  return (
    <div className="w-full">
      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">{label}</label>
      <input 
        type={type}
        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder:text-white/20 transition-all font-medium"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
