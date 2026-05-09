'use client';

import { motion } from 'framer-motion';
import { ShivAIUser } from '@/lib/sdk';

interface DigitalDNAProps {
  user: ShivAIUser;
}

export default function DigitalDNA({ user }: DigitalDNAProps) {
  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 overflow-hidden relative group">
       <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
          <div className="flex gap-1 items-end h-8">
             {[0.4, 0.7, 0.2, 0.9, 0.5, 0.8, 0.3, 0.6].map((h, i) => (
                <motion.div 
                   key={i}
                   animate={{ height: [`${h*100}%`, `${(1-h)*100}%`, `${h*100}%`] }}
                   transition={{ duration: 1.5 + i*0.2, repeat: Infinity }}
                   className="w-1 bg-blue-500 rounded-full"
                />
             ))}
          </div>
       </div>

       <div className="relative z-10">
          <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-8 italic">Digital DNA Signature</h3>
          
          <div className="space-y-6">
             <DNAMetric label="Neural Pattern" value={user.neuralPatternStatus || 'STABLE'} color="text-blue-400" />
             <DNAMetric label="Behavior Match" value="98.2%" color="text-emerald-400" />
             <DNAMetric label="Threat Prob." value="0.01%" color="text-white/40" />
             <DNAMetric label="DNA Integrity" value="VERIFIED" color="text-blue-500" />
          </div>

          <div className="mt-10 pt-8 border-t border-white/5">
             <div className="flex flex-wrap gap-2">
                {["Sovereign", "Active", "Encrypted", "Biometric"].map(tag => (
                   <span key={tag} className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 border border-white/10 rounded-md text-gray-500">
                      {tag}
                   </span>
                ))}
             </div>
          </div>
       </div>

       {/* Background DNA Spiral (Simplified) */}
       <div className="absolute -bottom-20 -left-20 w-64 h-64 border-[40px] border-blue-500/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}

function DNAMetric({ label, value, color }: any) {
  return (
    <div className="flex justify-between items-center group/item">
       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
       <div className="flex items-center gap-4">
          <div className="flex gap-0.5">
             {[1, 1, 1, 1, 0, 0].map((v, i) => (
                <div key={i} className={`w-1 h-3 rounded-full ${v ? 'bg-blue-500/40' : 'bg-white/5'}`} />
             ))}
          </div>
          <span className={`text-xs font-black ${color} tracking-tighter`}>{value}</span>
       </div>
    </div>
  )
}
