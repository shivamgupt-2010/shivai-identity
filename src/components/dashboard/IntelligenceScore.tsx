'use client';

import { motion } from 'framer-motion';
import { ShivAIProfile } from '@/lib/sdk';
import { Brain, ShieldCheck, Activity, Zap } from 'lucide-react';

interface IntelligenceScoreProps {
  profile: ShivAIProfile;
}

export default function IntelligenceScore({ profile }: IntelligenceScoreProps) {
  const strength = profile.identity_strength || 0;
  const confidence = profile.human_confidence || 0;
  
  return (
    <div className="p-8 bg-gradient-to-br from-blue-600/20 to-indigo-800/20 rounded-[3rem] border border-white/10 relative overflow-hidden group">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
      
      {/* Background Pulse */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full"
      />

      <div className="flex flex-col lg:flex-row gap-12 relative z-10">
        {/* Main Score Display */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-white/10">
                <Brain className="text-blue-400" size={24} />
             </div>
             <div>
                <h2 className="text-xl font-black text-white italic tracking-tight uppercase">Identity Brain</h2>
                <p className="text-blue-400/60 text-[10px] font-black uppercase tracking-[0.2em]">Ecosystem Trust Engine</p>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <MetricCard 
                label="Identity Strength" 
                value={`${strength.toFixed(0)}%`} 
                icon={<ShieldCheck size={14} />} 
                color="text-blue-400"
                progress={strength}
             />
             <MetricCard 
                label="Trust Level" 
                value={profile.trust_score > 0.8 ? 'Elite' : 'Stable'} 
                icon={<Activity size={14} />} 
                color="text-emerald-400"
                progress={100}
             />
             <MetricCard 
                label="Human Conf." 
                value={`${(confidence * 100).toFixed(0)}%`} 
                icon={<Zap size={14} />} 
                color="text-amber-400"
                progress={confidence * 100}
             />
             <MetricCard 
                label="Security" 
                value={profile.verification_level === 5 ? 'Sovereign' : 'Verified'} 
                icon={<ShieldCheck size={14} />} 
                color="text-indigo-400"
                progress={80}
             />
          </div>
        </div>

        {/* Massive Radial Score */}
        <div className="flex items-center justify-center">
           <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                 <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-white/5"
                 />
                 <motion.circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={502.65}
                    initial={{ strokeDashoffset: 502.65 }}
                    animate={{ strokeDashoffset: 502.65 - (502.65 * strength) / 100 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                 />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                 <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1">Global IQ</span>
                 <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-5xl font-black text-white tracking-tighter"
                 >
                    {strength.toFixed(0)}
                 </motion.span>
                 <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mt-1">STABLE</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon, color, progress }: any) {
  return (
    <div className="bg-[#050505]/40 border border-white/5 p-4 rounded-3xl backdrop-blur-md">
       <div className="flex items-center gap-2 mb-2">
          <div className={`${color} opacity-70`}>{icon}</div>
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
       </div>
       <div className={`text-lg font-black ${color} mb-2`}>{value}</div>
       <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className={`h-full ${color.replace('text', 'bg')}`}
          />
       </div>
    </div>
  );
}
