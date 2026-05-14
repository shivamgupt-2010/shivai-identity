'use client';

import { motion } from 'framer-motion';
import { Activity, Clock, Terminal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { shivai } from '@/lib/sdk';

export default function ActivityTimeline() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const user = await shivai.getCurrentUser();
      if (user) {
        // In a real app, this would fetch from 'activity_logs'
        // For now, we simulate recent neural activity
        setLogs([
          { id: 1, action: 'Identity Sync', time: '2m ago', app: 'Core' },
          { id: 2, action: 'Neural Scan', time: '15m ago', app: 'Drive' },
          { id: 3, action: 'Biometric Check', time: '1h ago', app: 'Identity' },
        ]);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8">
      <div className="flex items-center gap-3 mb-8">
        <Activity className="text-blue-500" size={18} />
        <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] italic">Neural Log</h3>
      </div>

      <div className="space-y-6">
        {logs.map((log, i) => (
          <div key={log.id} className="flex gap-4 group cursor-default">
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-blue-500/50 group-hover:bg-blue-500 transition-colors" />
              {i !== logs.length - 1 && <div className="w-px flex-1 bg-white/5 my-1" />}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">{log.action}</span>
                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{log.time}</span>
              </div>
              <div className="flex items-center gap-2">
                 <Terminal size={10} className="text-blue-500/40" />
                 <span className="text-[9px] font-bold text-blue-500/40 uppercase tracking-widest">{log.app} Hub</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
