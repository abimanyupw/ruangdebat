import React from 'react';
import { motion } from 'motion/react';
import { DebateResult } from '../types';
import { Trophy, AlertCircle, CheckCircle2, RotateCcw, Lightbulb } from 'lucide-react';

interface ResultModalProps {
  result: DebateResult;
  onReset: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ result, onReset }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto py-10"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-zinc-800 my-auto"
      >
        <div className="bg-zinc-950 p-8 text-center text-zinc-100 relative border-b border-zinc-800">
          <div className="absolute top-4 right-4 text-zinc-700 font-mono text-[9px] uppercase tracking-widest">
            REPORT_ID_#RD{Math.floor(Math.random() * 9000) + 1000}
          </div>
          <Trophy className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-2xl font-black mb-1 uppercase tracking-tighter">Keputusan Akhir</h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Debat Selesai • 5 Ronde Lengkap</p>
        </div>

        <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-center shadow-inner">
              <span className="text-[10px] uppercase tracking-widest font-black text-zinc-600 block mb-2">Skor Kamu</span>
              <span className="text-4xl font-black text-zinc-100 tabular-nums">{result.userScore}</span>
            </div>
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-center shadow-inner">
              <span className="text-[10px] uppercase tracking-widest font-black text-zinc-600 block mb-2">Skor AI</span>
              <span className="text-4xl font-black text-zinc-100 tabular-nums">{result.aiScore}</span>
            </div>
          </div>

          <div className="text-center">
            <div className={`inline-block px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-lg ${
              result.winner === 'Kamu' 
                ? 'bg-green-500/10 border-green-500/30 text-green-500 shadow-green-500/10' 
                : 'bg-red-500/10 border-red-500/30 text-red-500 shadow-red-500/10'
            }`}>
              PEMENANG: {result.winner === 'Kamu' ? 'KAMU' : 'AI'}
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4 text-green-500 font-black text-[10px] uppercase tracking-widest">
                <CheckCircle2 size={14} /> Kelebihan Argumen
              </div>
              <ul className="space-y-3">
                {result.pros.map((pro, index) => (
                  <li key={index} className="text-zinc-400 text-xs leading-relaxed flex gap-3">
                    <span className="text-green-500 font-mono font-bold">/</span> {pro}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4 text-amber-500 font-black text-[10px] uppercase tracking-widest">
                <AlertCircle size={14} /> Evaluasi Kritis
              </div>
              <ul className="space-y-3">
                {result.cons.map((con, index) => (
                  <li key={index} className="text-zinc-400 text-xs leading-relaxed flex gap-3">
                    <span className="text-amber-500 font-mono font-bold">/</span> {con}
                  </li>
                ))}
              </ul>
            </div>

            {result.growthTips && (
              <div className="bg-blue-500/5 p-6 rounded-2xl border border-blue-500/20">
                <div className="flex items-center gap-2 mb-4 text-blue-400 font-black text-[10px] uppercase tracking-widest">
                  <Lightbulb size={14} /> Juri Notes: Saran Pengembangan
                </div>
                <ul className="space-y-3">
                  {result.growthTips.map((tip, index) => (
                    <li key={index} className="text-zinc-300 text-xs leading-relaxed flex gap-3 italic">
                      <span className="text-blue-500 font-bold">★</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="p-8 border-t border-zinc-800">
          <button
            onClick={onReset}
            className="w-full bg-red-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-xl shadow-red-900/20 uppercase tracking-widest text-xs active:scale-[0.98]"
          >
            <RotateCcw size={16} /> Mulai Debat Baru
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
