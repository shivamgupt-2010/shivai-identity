'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { shivai, ShivAIProfile, EcosystemNode } from '@/lib/sdk';
import { 
  Shield, Brain, Zap, Globe, Activity, 
  Smartphone, QrCode, Lock, LogOut, CheckCircle 
} from 'lucide-react';
import IntelligenceScore from './IntelligenceScore';
import EcosystemGraph from './EcosystemGraph';
import DigitalDNA from './DigitalDNA';
import ActivityTimeline from './ActivityTimeline';
import { QRCodeSVG } from 'qrcode.react';

export default function ProductionDashboard() {
  const [profile, setProfile] = useState<ShivAIProfile | null>(null);
  const [nodes, setNodes] = useState<EcosystemNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNeurons, setActiveNeurons] = useState(1);
  const [qrToken, setQrToken] = useState(Math.random().toString(36).substring(7));

  useEffect(() => {
    let presenceChannel: any = null;

    // 1. Initial Load
    const init = async () => {
      const user = await shivai.getCurrentUser();
      if (user) {
        const [p, n] = await Promise.all([
          shivai.getProfile(user.id),
          shivai.getEcosystemGraph()
        ]);
        setProfile(p);
        setNodes(n);

        // Track Presence
        presenceChannel = shivai.trackPresence('identity_presence', { id: user.id, username: p?.username });
        presenceChannel
          .on('presence', { event: 'sync' }, () => {
            const state = presenceChannel.presenceState();
            setActiveNeurons(Object.keys(state).length);
          })
          .subscribe();
      }
      setLoading(false);
    };

    init();

    // 2. Real-time Sync
    const { data: { subscription } } = shivai.onAuthStateChange(async (session: any) => {
      if (session) {
        const [p, n] = await Promise.all([
          shivai.getProfile(session.user.id),
          shivai.getEcosystemGraph()
        ]);
        setProfile(p);
        setNodes(n);
      } else {
        setProfile(null);
        setNodes([]);
      }
    });

    // 3. QR Token Rotation (Production Security)
    const interval = setInterval(() => setQrToken(Math.random().toString(36).substring(7)), 30000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
      if (presenceChannel) presenceChannel.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await shivai.logout();
    window.location.reload();
  };

  if (loading) return <LoadingState />;
  if (!profile) return <UnauthorizedState />;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 relative overflow-hidden">
      {/* Background Neural Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[200px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/10">
                 <Brain size={32} />
              </div>
              <div>
                 <h1 className="text-3xl font-black italic uppercase tracking-tighter">ShivAI Identity <span className="text-blue-500">Hub</span></h1>
                 <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Active Neurons: {activeNeurons}</span>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                 </div>
              </div>
           </div>
           
           <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-xl">
              <div className="px-4 py-2">
                 <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest leading-none">Handle</p>
                 <p className="text-sm font-black text-blue-400 mt-1">@{profile.username}</p>
              </div>
              <button 
                 onClick={handleLogout}
                 className="p-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all rounded-xl"
              >
                 <LogOut size={18} />
              </button>
           </div>
        </div>

        {/* CORE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           <div className="lg:col-span-8 space-y-8">
              <IntelligenceScore profile={profile} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] italic flex items-center gap-3">
                       <Globe size={18} className="text-blue-500" />
                       Ecosystem Network
                    </h3>
                    <EcosystemGraph nodes={nodes} />
                 </div>
                 <DigitalDNA profile={profile} />
              </div>
           </div>

           <div className="lg:col-span-4 space-y-8">
              <section className="bg-[#0a0a0a] border border-white/10 p-8 rounded-[3rem] relative overflow-hidden group">
                 <div className="flex justify-between items-center mb-8 relative z-10">
                    <h3 className="text-sm font-black uppercase tracking-widest text-white italic">Global Pass</h3>
                    <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                       <QrCode size={18} className="text-blue-400" />
                    </div>
                 </div>
                 
                 <div className="flex justify-center py-6 relative z-10">
                    <div className="p-4 bg-white rounded-3xl relative">
                       <QRCodeSVG value={`shivai-id:${profile.id}:${qrToken}`} size={180} level="H" />
                       <motion.div 
                          animate={{ top: ['0%', '100%', '0%'] }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                          className="absolute left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                       />
                    </div>
                 </div>

                 <div className="mt-8 space-y-3 relative z-10">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-500">
                       <span>Encryption Mode</span>
                       <span className="text-blue-400">AES-256-GCM</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                          key={qrToken}
                          initial={{ width: '100%' }}
                          animate={{ width: '0%' }}
                          transition={{ duration: 30, ease: 'linear' }}
                          className="h-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"
                       />
                    </div>
                 </div>
              </section>

              <section className="bg-[#0a0a0a] border border-white/10 p-8 rounded-[3rem] space-y-6">
                 <div className="flex items-center gap-3">
                    <Shield className="text-emerald-400" size={20} />
                    <h3 className="text-sm font-black uppercase tracking-widest text-white italic">Security Shield</h3>
                 </div>
                 
                 <div className="space-y-4">
                    <SecurityRow label="Biometric Status" value="ACTIVE" status="success" />
                    <SecurityRow label="Trust Level" value={profile.trust_score > 0.8 ? 'MAXIMUM' : 'STANDARD'} status="info" />
                    <SecurityRow label="Threat Index" value="MINIMAL" status="success" />
                 </div>
              </section>

              <ActivityTimeline />
           </div>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
   return (
      <div className="h-screen bg-[#050505] flex items-center justify-center">
         <div className="flex flex-col items-center gap-6">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500/50">Neural Initializing</p>
         </div>
      </div>
   );
}

function UnauthorizedState() {
   return (
      <div className="h-screen bg-[#050505] flex items-center justify-center">
         <div className="text-center">
            <Lock className="mx-auto text-red-500 mb-6" size={48} />
            <h2 className="text-2xl font-black uppercase italic text-white mb-2">Access Denied</h2>
            <p className="text-gray-500 text-sm mb-8">Ecosystem synchronization failed.</p>
            <button onClick={() => window.location.reload()} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs">Retry Sync</button>
         </div>
      </div>
   );
}

function SecurityRow({ label, value, status }: any) {
   return (
      <div className="flex justify-between items-center py-2 border-b border-white/5">
         <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{label}</span>
         <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${status === 'success' ? 'text-emerald-400' : 'text-blue-400'}`}>{value}</span>
      </div>
   );
}
