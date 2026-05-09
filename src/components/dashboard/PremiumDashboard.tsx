'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Mail, MessageCircle, Cloud, Clock, RefreshCw, 
  Settings, LogOut, CheckCircle, Smartphone, Globe, Brain, QrCode,
  Calendar, MapPin
} from 'lucide-react';
import { identity } from '@/lib/identity';
import { ShivAIUser, ActivityLog, Device } from '@/lib/sdk';
import { QRCodeSVG } from 'qrcode.react';
import { DateTime } from 'luxon';

export default function PremiumDashboard() {
  const [user, setUser] = useState<ShivAIUser | null>(null);
  const [timeline, setTimeline] = useState<ActivityLog[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const u = await identity.getCurrentUser();
      if (!u) {
         setLoading(false);
         return;
      }
      const [t, d] = await Promise.all([
        identity.getTimeline(),
        identity.getDevices()
      ]);
      setUser(u);
      setTimeline(t);
      setDevices(d);
      setLoading(false);
    };
    loadData();
  }, []);

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
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Profile Card */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#0a0a0a] backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/20 transition-all duration-700" />
            
            <header className="flex justify-between items-start mb-8 relative">
               <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/20">
                  <div className="w-full h-full bg-[#0a0a0a] rounded-[22px] flex items-center justify-center overflow-hidden">
                     <Globe size={40} className="text-blue-400 opacity-50" />
                  </div>
               </div>
               <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                  <QrCode size={20} className="text-blue-400" />
               </div>
            </header>

            <div className="relative">
               <h1 className="text-3xl font-black tracking-tight">{user.fullName || 'ShivAI Pioneer'}</h1>
               <div className="flex items-center gap-2 mt-1">
                  <span className="text-blue-400 font-bold">@{user.username || 'user'}</span>
                  <CheckCircle size={14} className="fill-blue-500 text-[#050505]" />
               </div>
               <p className="text-xs text-gray-500 font-bold mt-2 lowercase">{user.email}</p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <Calendar size={14} className="text-gray-500 mb-2" />
                  <p className="text-[10px] font-black uppercase text-gray-600">DOB</p>
                  <p className="text-xs font-bold text-gray-300">{user.dob ? DateTime.fromISO(user.dob).toLocaleString(DateTime.DATE_MED) : 'N/A'}</p>
               </div>
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <MapPin size={14} className="text-gray-500 mb-2" />
                  <p className="text-[10px] font-black uppercase text-gray-600">Country</p>
                  <p className="text-xs font-bold text-gray-300">{user.country || 'N/A'}</p>
               </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 space-y-6 relative">
               <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Global Pass</span>
                  <div className="p-2 bg-white rounded-xl">
                    <QRCodeSVG value={`shivai-id:${user.id}`} size={80} level="H" />
                  </div>
               </div>
               <button 
                  onClick={() => identity.logout().then(() => window.location.reload())}
                  className="w-full bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white py-4 rounded-2xl font-bold transition-all border border-red-500/20"
                >
                  <div className="flex items-center justify-center gap-2">
                    <LogOut size={18} />
                    <span>Secure Logout</span>
                  </div>
               </button>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-[2.5rem]">
             <div className="flex items-center gap-4 mb-6">
                <Shield className="text-emerald-400" size={24} />
                <h3 className="font-bold">Security Shield</h3>
             </div>
             <div className="space-y-4">
                <SecurityStat label="Identity Verified" status={user.isVerified ? "Trusted" : "Standard"} />
                <SecurityStat label="Account Status" status="Active" />
             </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-8 space-y-8">
          <div className="p-10 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
             <div className="flex items-center gap-6 relative">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
                   <Brain className="text-white" size={32} />
                </div>
                <div>
                   <h2 className="text-2xl font-black text-white italic">ShivAI Intelligence</h2>
                   <p className="text-blue-100 text-sm">Processing real-time identity signals.</p>
                </div>
             </div>
             <div className="relative bg-[#00000030] px-8 py-5 rounded-[2rem] backdrop-blur-md border border-white/10">
                <span className="text-[10px] font-black uppercase text-blue-200 tracking-[0.2em]">Intel Score</span>
                <div className="text-4xl font-black text-white leading-none mt-1">{user.behaviorScore?.toFixed(2) || '1.00'}</div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <AppCard name="ShivAI Mail" icon={<Mail className="text-blue-400" />} status="Active" />
             <AppCard name="VibeConnect" icon={<MessageCircle className="text-pink-400" />} status="Active" />
             <AppCard name="ShivAI Drive" icon={<Cloud className="text-indigo-400" />} status="Locked" />
             <AppCard name="Security Vault" icon={<Shield className="text-emerald-400" />} status="Secured" />
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-[2.5rem]">
             <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
                <Clock className="text-blue-400" size={20} />
                Identity Timeline
             </h3>
             <div className="space-y-6">
                {timeline.length > 0 ? timeline.map((log) => (
                   <div key={log.id} className="flex gap-4 items-start">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                      <div>
                         <p className="text-sm font-bold text-gray-200">{log.action}</p>
                         <p className="text-xs text-gray-500 mt-1">{log.description}</p>
                         <p className="text-[9px] font-black uppercase text-gray-600 mt-2">{DateTime.fromISO(log.created_at).toRelative()}</p>
                      </div>
                   </div>
                )) : (
                   <p className="text-sm text-gray-600 italic">No recent activities recorded.</p>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecurityStat({ label, status }: any) {
    return (
        <div className="flex justify-between items-center py-2">
            <span className="text-xs text-gray-500 font-bold">{label}</span>
            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">{status}</span>
        </div>
    );
}

function AppCard({ name, icon, status }: any) {
    return (
        <div className="bg-white/5 border border-white/5 p-6 rounded-3xl hover:border-white/10 transition-all group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-all">
                    {icon}
                </div>
                <div>
                    <h4 className="font-bold">{name}</h4>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-tighter">{status}</p>
                </div>
            </div>
        </div>
    )
}
