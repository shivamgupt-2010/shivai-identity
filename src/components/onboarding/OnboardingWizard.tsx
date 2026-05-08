'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Shield, CheckCircle, ArrowRight, ArrowLeft, Lock } from 'lucide-react';
import { identity } from '@/lib/identity';

export default function OnboardingWizard({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: ''
  });

  const [isLogin, setIsLogin] = useState(false);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleAuth = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        const { error } = await identity.login(formData.email);
        if (error) throw error;
        setStep(4); // Move to "Check Email" step
      } else {
        const { error } = await identity.createIdentity(formData.email, {
            full_name: formData.fullName,
            username: formData.username,
            theme: 'Dark'
        });
        if (error) throw error;
        setStep(4); // Move to "Check Email" step
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
        desc: "Enter your email to receive a secure login link.",
        icon: <Shield className="text-blue-400" />,
        fields: (
          <div className="space-y-4">
            <Input label="Email" value={formData.email} onChange={v => setFormData({...formData, email: v})} placeholder="name@example.com" type="email" />
          </div>
        )
    }
  ] : [
    {
      title: "Basic Info",
      desc: "Let's create your digital identity.",
      icon: <User className="text-blue-400" />,
      fields: (
        <div className="space-y-4">
          <Input label="Full Name" value={formData.fullName} onChange={v => setFormData({...formData, fullName: v})} placeholder="John Doe" />
          <Input label="Email" value={formData.email} onChange={v => setFormData({...formData, email: v})} placeholder="name@example.com" type="email" />
        </div>
      )
    },
    {
      title: "Choose Handle",
      desc: "Pick a unique @shiv.ai username.",
      icon: <Mail className="text-purple-400" />,
      fields: (
        <div className="space-y-4">
          <Input label="Username" value={formData.username} onChange={v => setFormData({...formData, username: v})} placeholder="shivam_pioneer" />
        </div>
      )
    },
    {
      title: "Security Ready",
      desc: "ShivAI Identity uses passwordless magic links for maximum security.",
      icon: <Lock className="text-emerald-400" />,
      fields: (
        <div className="space-y-4">
           <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <p className="text-xs text-emerald-100 leading-relaxed font-medium">Your identity will be protected by Supabase Auth and industry-standard E2E encryption.</p>
           </div>
        </div>
      )
    },
    {
        title: "Magic Link Sent",
        desc: "Check your email for the verification link.",
        icon: <CheckCircle className="text-blue-400" />,
        fields: (
          <div className="text-center space-y-4">
            <p className="text-gray-400 text-sm">We've sent a login link to {formData.email}. Click it to instantly verify your identity.</p>
            <button onClick={() => window.location.reload()} className="w-full bg-white/5 border border-white/10 py-3 rounded-xl text-white font-bold">Back to Home</button>
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
          className="bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-500/5"
        >
          <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-white/10">
            {current?.icon}
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">{current?.title}</h1>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">{current?.desc}</p>

          <div className="mb-8">
            {current?.fields}
            {error && <p className="text-red-400 text-xs mt-4 bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</p>}
          </div>

          <div className="flex flex-col gap-6">
            {step < 4 && (
                <div className="flex gap-4">
                    {step > 1 && !isLogin && (
                        <button onClick={prevStep} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all">
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <button 
                        onClick={step < steps.length ? nextStep : handleAuth}
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                        {loading ? 'Decrypting...' : step < (isLogin ? 1 : 3) ? 'Continue' : isLogin ? 'Send Magic Link' : 'Initialize Identity'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </div>
            )}
            
            {step < 4 && (
                <button 
                    onClick={() => { setIsLogin(!isLogin); setStep(1); setError(''); }}
                    className="text-xs text-gray-600 font-bold uppercase tracking-widest hover:text-blue-400 transition-colors"
                >
                    {isLogin ? "New to ShivAI? Create Identity" : "Existing Identity? Secure Login"}
                </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }: { label: string, value: string, onChange: (v: string) => void, placeholder: string, type?: string }) {
  return (
    <div>
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
