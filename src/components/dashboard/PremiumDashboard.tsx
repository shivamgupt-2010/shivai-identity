'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, LogOut, CheckCircle, Smartphone, Globe, QrCode,
  Calendar, MapPin, AlertTriangle, ShieldAlert, Cpu
} from 'lucide-react';
import { identity } from '@/lib/identity';
import { ShivAIUser, ActivityLog, Device, EcosystemNode } from '@/lib/sdk';
import { QRCodeSVG } from 'qrcode.react';
import { DateTime } from 'luxon';

// New Futuristic Components
import IntelligenceScore from './IntelligenceScore';
import EcosystemGraph from './EcosystemGraph';
import AIAssistantOrb from './AIAssistantOrb';
import DigitalDNA from './DigitalDNA';

export default function PremiumDashboard() {
  const [user, setUser] = useState<ShivAIUser | null>(null);
  const [timeline, setTimeline] = useState<ActivityLog[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [nodes, setNodes] = useState<EcosystemNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrToken, setQrToken] = useState(Math.random().toString(36).substring(7));
  const [showLockdownConfirm, setShowLockdownConfirm] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const u = await identity.getCurrentUser();
      if (!u) {
         setLoading(false);
         return;
      }
      const [t, d, g] = await Promise.all([
        identity.getTimeline(),
        identity.getDevices(),
        identity.getEcosystemGraph()
      ]);
      setUser(u);
      setTimeline(t);
      setDevices(d);
      setNodes(g);
      setLoading(false);
    };
    loadData();

    // Rotate QR Token every 30 seconds
    const interval = setInterval(() => {
      setQrToken(Math.random().toString(36).substring(7));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleLockdown = async () => {
     await identity.lockdown();
     window.location.reload();
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#050505] text-white">
       <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500/50">Syncing Identity</p>
       </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 selection:bg-blue-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[150px] rounded-full" />
         <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Top Intelligence Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
           <div className="lg:col-span-8">
              <IntelligenceScore user={user} />
           </div>
           <div className="lg:col-span-4">
              <DigitalDNA user={user} />
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Identity & Access */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Global Pass Card */}
            <div className="bg-[#0a0a0a] backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
              <div className="flex justify-between items-start mb-10">
                 <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white italic">Global Pass</h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">One-Tap Auth Enabled</p>
                 </div>
                 <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                    <QrCode size={20} className="text-blue-400" />
                 </div>
              </div>

              <div className="flex justify-center items-center py-6 relative">
                 <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full" />
                 <div className="p-4 bg-white rounded-3xl relative">
                    <QRCodeSVG 
                      value={`shivai-id:${user.id}:${qrToken}`} 
                      size={160} 
                      level="H" 
                      includeMargin={false}
                    />
                    {/* Scan Animation */}
                    <motion.div 
                       animate={{ top: ['0%', '100%', '0%'] }}
                       transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                       className="absolute left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_#3b82f6] z-20 pointer-events-none"
                    />
                 </div>
              </div>

              <div className="mt-8 space-y-4">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
                    <span className="text-gray-500">Token Rotation</span>
                    <span className="text-blue-400">Next update in 24s</span>
                 </div>
                 <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      key={qrToken}
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: 30, ease: "linear" }}
                      className="h-full bg-blue-500"
                    />
                 </div>
              </div>
            </div>

            {/* Profile Brief */}
            <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-[2.5rem]">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/20">
                    <div className="w-full h-full bg-[#0a0a0a] rounded-[14px] flex items-center justify-center overflow-hidden">
                       <Globe size={24} className="text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-xl font-black tracking-tight">{user.fullName || 'ShivAI Pioneer'}</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-blue-400 font-bold text-xs">@{user.username || 'user'}</span>
                        <CheckCircle size={12} className="fill-blue-500 text-[#050505]" />
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Calendar size={14} className="text-gray-500" />
                        <span className="text-[10px] font-black uppercase text-gray-500">DOB</span>
                     </div>
                     <span className="text-xs font-bold text-gray-300">{user.dob ? DateTime.fromISO(user.dob).toLocaleString(DateTime.DATE_MED) : 'N/A'}</span>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <MapPin size={14} className="text-gray-500" />
                        <span className="text-[10px] font-black uppercase text-gray-500">Region</span>
                     </div>
                     <span className="text-xs font-bold text-gray-300">{user.country || 'N/A'}</span>
                  </div>
               </div>
            </div>

            {/* Emergency Button */}
            <button 
               onClick={() => setShowLockdownConfirm(true)}
               className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-6 rounded-[2rem] border border-red-500/20 transition-all group overflow-hidden relative"
            >
               <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-10 transition-opacity" />
               <div className="flex items-center justify-center gap-3 relative z-10">
                  <ShieldAlert size={20} className="group-hover:animate-bounce" />
                  <span className="font-black uppercase tracking-widest text-xs italic">Emergency Lockdown</span>
               </div>
            </button>

          </div>

          {/* Right Column: Ecosystem & Insights */}
          <div className="lg:col-span-8 space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Ecosystem Visualization */}
               <div className="space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] italic flex items-center gap-3">
                     <Cpu size={18} className="text-blue-500" />
                     Ecosystem Graph
                  </h3>
                  <EcosystemGraph nodes={nodes} />
               </div>

               {/* Timeline Expansion */}
               <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-[2.5rem]">
                  <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] italic mb-8 flex items-center gap-3">
                     <AlertTriangle size={18} className="text-amber-500" />
                     AI Event Log
                  </h3>
                  <div className="space-y-6 max-h-[360px] overflow-y-auto pr-4 scrollbar-hide">
                     {timeline.length > 0 ? timeline.map((log) => (
                        <div key={log.id} className="flex gap-4 items-start group">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shadow-[0_0_8px_rgba(59,130,246,0.5)] group-hover:scale-150 transition-all" />
                           <div className="flex-1">
                              <div className="flex justify-between items-center">
                                 <p className="text-xs font-black text-gray-200 uppercase tracking-tight">{log.action}</p>
                                 <span className="text-[9px] font-black uppercase text-gray-600">{DateTime.fromISO(log.created_at).toRelative()}</span>
                              </div>
                              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{log.description}</p>
                           </div>
                        </div>
                     )) : (
                        <p className="text-sm text-gray-600 italic">No recent activities recorded.</p>
                     )}
                  </div>
               </div>
            </div>

            {/* Device Management Section */}
            <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-[2.5rem]">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] italic flex items-center gap-3">
                     <Smartphone size={18} className="text-pink-500" />
                     Trusted Nodes
                  </h3>
                  <span className="text-[10px] font-black text-gray-500 uppercase">{devices.length} Devices Active</span>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {devices.map(device => (
                     <div key={device.id} className="bg-white/5 border border-white/5 p-5 rounded-3xl hover:border-white/20 transition-all group">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-400 transition-colors">
                              <Smartphone size={20} />
                           </div>
                           <div className="overflow-hidden">
                              <h4 className="text-xs font-black truncate">{device.device_name || 'Unknown Node'}</h4>
                              <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">{device.device_type}</p>
                           </div>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-white/5">
                           <div className="flex items-center gap-1.5">
                              <div className={`w-1 h-1 rounded-full ${device.is_trusted ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                              <span className="text-[9px] font-black uppercase text-gray-500">{device.is_trusted ? 'Trusted' : 'Unverified'}</span>
                           </div>
                           <span className="text-[9px] font-bold text-blue-500/50 italic">{DateTime.fromISO(device.last_active).toRelative()}</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

          </div>
        </div>
      </div>

      {/* AI Assistant Layer */}
      <AIAssistantOrb />

      {/* Lockdown Confirmation Modal */}
      <AnimatePresence>
         {showLockdownConfirm && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#050505]/90 backdrop-blur-md"
            >
               <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="max-w-md w-full bg-[#0a0a0a] border border-red-500/30 p-10 rounded-[3rem] shadow-[0_20px_100px_rgba(239,68,68,0.2)] text-center"
               >
                  <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500">
                     <ShieldAlert size={40} />
                  </div>
                  <h2 className="text-2xl font-black text-white italic mb-4">INITIATE LOCKDOWN?</h2>
                  <p className="text-gray-500 text-sm mb-10 leading-relaxed font-medium">
                     This will instantly revoke all active sessions, freeze ecosystem APIs, and logout this device. Use only in case of active identity breach.
                  </p>
                  <div className="flex gap-4">
                     <button 
                        onClick={() => setShowLockdownConfirm(false)}
                        className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all border border-white/10"
                     >
                        Cancel
                     </button>
                     <button 
                        onClick={handleLockdown}
                        className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-black uppercase tracking-widest text-xs hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                     >
                        Confirm
                     </button>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>

    </div>
  );
}
