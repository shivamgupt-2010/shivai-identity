'use client';

import { motion } from 'framer-motion';
import { EcosystemNode } from '@/lib/sdk';
import { Shield, Mail, MessageCircle, Cloud, Brain, Lock } from 'lucide-react';

interface EcosystemGraphProps {
  nodes: EcosystemNode[];
}

export default function EcosystemGraph({ nodes }: EcosystemGraphProps) {
  // Center is the Hub
  const centerX = 200;
  const centerY = 200;
  const radius = 120;

  const getIcon = (label: string) => {
    switch(label.toLowerCase()) {
      case 'ai core': return <Brain size={20} />;
      case 'identity hub': return <Shield size={20} />;
      case 'shivai mail': return <Mail size={20} />;
      case 'vibeconnect': return <MessageCircle size={20} />;
      case 'shivai drive': return <Cloud size={20} />;
      default: return <Lock size={20} />;
    }
  };

  return (
    <div className="relative w-full aspect-square bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 overflow-hidden flex items-center justify-center">
      <svg className="w-full h-full absolute inset-0">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        
        {/* Connection Lines */}
        {nodes.map((node, i) => {
          const angle = (i / nodes.length) * (2 * Math.PI);
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);

          return (
            <motion.line
              key={`line-${node.id}`}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke="url(#lineGrad)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: i * 0.2 }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      <div className="relative w-full h-full">
         {nodes.map((node, i) => {
            const angle = (i / nodes.length) * (2 * Math.PI);
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            const isCore = node.type === 'core';

            return (
              <motion.div
                key={node.id}
                className="absolute"
                style={{ 
                  left: isCore ? centerX : x, 
                  top: isCore ? centerY : y, 
                  transform: 'translate(-50%, -50%)' 
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, delay: i * 0.1 }}
              >
                <div className={`
                  relative group cursor-pointer
                  ${isCore ? 'w-20 h-20' : 'w-14 h-14'}
                  bg-[#0a0a0a] border border-white/20 rounded-2xl flex items-center justify-center
                  hover:border-blue-500/50 transition-all duration-500
                  ${node.status === 'online' ? 'shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'opacity-40'}
                `}>
                  {node.status === 'online' && (
                    <div className="absolute inset-0 bg-blue-500/5 blur-xl group-hover:bg-blue-500/10 transition-all rounded-2xl" />
                  )}
                  <div className={`${node.status === 'online' ? 'text-blue-400' : 'text-gray-600'}`}>
                    {getIcon(node.label)}
                  </div>

                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50 bg-[#050505] px-2 py-1 rounded-md border border-white/10">
                      {node.label}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
         })}
      </div>

      <div className="absolute bottom-6 left-10 right-10 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black text-blue-500/50 uppercase tracking-[0.2em]">Neural Net Active</span>
         </div>
         <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">ShivAI Interconnect v2.0</span>
      </div>
    </div>
  );
}
