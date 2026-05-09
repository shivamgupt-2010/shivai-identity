'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Brain, Command, Mic, X } from 'lucide-react';

export default function AIAssistantOrb() {
  const [isOpen, setIsOpen] = useState(false);
  const [command, setCommand] = useState('');

  const quickCommands = [
    "Scan Identity",
    "Open Mail Hub",
    "Emergency Lockdown",
    "Trust Device",
    "Generate Global Pass"
  ];

  return (
    <div className="fixed bottom-10 right-10 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-24 right-0 w-80 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 overflow-hidden"
          >
            <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
            
            <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                     <Brain size={18} className="text-white" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-white italic">ShivAI Assistant</span>
               </div>
               <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={18} />
               </button>
            </div>

            <div className="space-y-4">
               <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Enter command..."
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                  <Mic size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-blue-400 opacity-50 cursor-pointer" />
               </div>

               <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em] px-2">Quick Access</p>
                  <div className="flex flex-wrap gap-2">
                     {quickCommands.map((cmd) => (
                        <button 
                          key={cmd}
                          onClick={() => setCommand(cmd)}
                          className="px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                        >
                           {cmd}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400/50">
                     <Command size={12} />
                     <span>Press Cmd + K for global search</span>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] relative group border-2 border-white/10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 opacity-90" />
        
        {/* Animated Rings */}
        <motion.div 
           animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
           transition={{ duration: 2, repeat: Infinity }}
           className="absolute inset-0 border-2 border-white/20 rounded-full"
        />

        <Brain className="text-white relative z-10" size={28} />
      </motion.button>
    </div>
  );
}
