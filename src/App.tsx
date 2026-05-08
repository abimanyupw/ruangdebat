/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Message, DebateStatus, DebateResult } from './types';
import { MessageList } from './components/MessageList';
import { ArgumentInput } from './components/ArgumentInput';
import { ResultModal } from './components/ResultModal';
import { getDebateResponse, getJudgeResult, generateTopic } from './services/geminiService';
import { MessageSquare, RefreshCw, Info, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<DebateStatus>('SETUP');
  const [roundCount, setRoundCount] = useState(0);
  const [maxRounds, setMaxRounds] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<DebateResult | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const startDebate = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setStatus('INTRO');
    try {
      const newTopic = await generateTopic();
      setTopic(newTopic);
      const introMessage: Message = {
        id: 'intro-' + Date.now(),
        role: 'ai',
        text: `Selamat datang di RuangDebat. Topik kita hari ini adalah:\n\n"${newTopic}"\n\nSilakan sampaikan argumen pembuka Anda. Kita akan melakukan ${maxRounds} ronde perdebatan sengit sebelum juri memberikan penilaian.`,
        timestamp: new Date(),
        type: 'intro'
      };
      setMessages([introMessage]);
      setStatus('DEBATING');
      setRoundCount(0);
      setResult(null);
    } catch (error: any) {
      console.error("Failed to init debate:", error);
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        setErrorMsg("Kuota harian habis (Limit 20/hari). Silakan tunggu beberapa saat atau coba lagi besok.");
      } else {
        setErrorMsg("Gagal memuat topik. Silakan periksa koneksi atau API Key Anda.");
      }
      setStatus('SETUP');
    } finally {
      setIsLoading(false);
    }
  };

  const resetToSetup = () => {
    setStatus('SETUP');
    setMessages([]);
    setRoundCount(0);
    setResult(null);
    setTopic('');
    setErrorMsg(null);
  };

  const handleSendMessage = async (text: string) => {
    if (status !== 'DEBATING' || isLoading || roundCount >= maxRounds) return;

    const userMessage: Message = {
      id: 'user-' + Date.now(),
      role: 'user',
      text,
      timestamp: new Date(),
      type: 'debate'
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    const newRoundCount = roundCount + 1;
    setRoundCount(newRoundCount);
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // AI counter-argument for all rounds
      const aiResponseText = await getDebateResponse(newMessages);
      const aiMessage: Message = {
        id: 'ai-' + Date.now(),
        role: 'ai',
        text: aiResponseText,
        timestamp: new Date(),
        type: 'debate'
      };
      
      const finalMessagesAfterAI = [...newMessages, aiMessage];
      setMessages(finalMessagesAfterAI);

      if (newRoundCount >= maxRounds) {
        // Just stop debating, don't auto-judge
        // User will trigger manually
      }
    } catch (error: any) {
      console.error("Debate error:", error);
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        setErrorMsg("Batas penggunaan tercapai. Selesaikan ronde ini atau coba lagi nanti.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerJudge = async () => {
    if (status !== 'DEBATING' || roundCount < maxRounds || isLoading) return;
    
    setIsLoading(true);
    setStatus('JUDGING');
    setErrorMsg(null);
    
    try {
      const judgeResult = await getJudgeResult(messages);
      if (judgeResult) {
        setResult(judgeResult);
        const judgeMessage: Message = {
          id: 'judge-' + Date.now(),
          role: 'ai',
          text: `Analisis mendalam telah selesai. Saya telah meninjau ${maxRounds} ronde perdebatan ini dari segi retorika, data, dan logika. Skor Anda: ${judgeResult.userScore}/100. Silakan lihat panel hasil untuk evaluasi lengkap.`,
          timestamp: new Date(),
          type: 'judge'
        };
        setMessages(prev => [...prev, judgeMessage]);
        setStatus('FINISHED');
      }
    } catch (error: any) {
      console.error("Judging error:", error);
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        setErrorMsg("Gagal menilai: Kuota API habis. Silakan coba lagi nanti.");
      }
      setStatus('DEBATING'); // Fallback to allow retry
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-4 md:p-6 flex flex-col gap-6 overflow-x-hidden">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded-sm flex items-center justify-center font-bold text-lg shadow-lg shadow-red-900/20">RD</div>
          <h1 className="text-xl font-black tracking-tight uppercase">Ruang<span className="text-red-500">Debat</span></h1>
        </div>
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
          <span className="hidden sm:inline">Sesi: #RD-{Date.now().toString().slice(-4)}</span>
          <span className="hidden sm:inline">Server: ASIA-SE1</span>
          <span className="text-green-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Live
          </span>
          <button 
            onClick={resetToSetup}
            disabled={isLoading}
            className="ml-2 hover:text-zinc-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      {/* Lobby / Setup */}
      {status === 'SETUP' ? (
        <main className="flex-1 max-w-4xl w-full mx-auto flex flex-col justify-center items-center gap-8 py-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">Persiapkan Sesi Debat</h2>
            <p className="text-zinc-500 text-sm max-w-md mx-auto uppercase tracking-widest font-bold">Pilih durasi perdebatan untuk menguji ketajaman logika Anda</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4">
            {[
              { rounds: 3, label: 'Singkat', desc: 'Debat cepat dengan 3 ronde intens.' },
              { rounds: 5, label: 'Standar', desc: '5 ronde untuk eksplorasi argumen mendalam.' },
              { rounds: 10, label: 'Maraton', desc: 'Uji daya tahan intelektual Anda dalam 10 ronde.' }
            ].map((config) => (
              <motion.button
                key={config.rounds}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMaxRounds(config.rounds)}
                className={`p-6 rounded-2xl border transition-all text-left flex flex-col gap-4 shadow-xl ${
                  maxRounds === config.rounds 
                    ? 'bg-zinc-900 border-red-500 shadow-red-900/10' 
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    maxRounds === config.rounds ? 'text-red-500' : 'text-zinc-600'
                  }`}>{config.label}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                    maxRounds === config.rounds ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    {config.rounds}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase italic mb-1">Ronde {config.rounds}</h3>
                  <p className="text-[11px] text-zinc-500 leading-relaxed uppercase font-bold">{config.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest animate-bounce">
              {errorMsg}
            </div>
          )}

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={startDebate}
            disabled={isLoading}
            className="group relative bg-red-600 hover:bg-red-700 text-white font-black py-5 px-12 rounded-xl transition-all shadow-2xl shadow-red-900/40 uppercase tracking-widest text-sm flex items-center gap-3 active:scale-95 disabled:opacity-50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            Mulai Perdebatan <MessageSquare size={18} />
          </motion.button>
        </main>
      ) : (
        /* Main Bento Grid */
        <div className="grid grid-cols-12 auto-rows-min gap-4 flex-1">
          
          {/* Topic Panel - Top Left */}
          <div className="col-span-12 md:col-span-8 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-center shadow-inner shadow-white/5">
            <span className="text-[10px] text-red-500 font-black uppercase tracking-widest mb-2">Topik Debat</span>
            <h2 className="text-lg md:text-xl font-medium leading-tight">
              {topic ? `"${topic}"` : 'Menghasilkan topik debat...'}
            </h2>
          </div>

          {/* Round Counter - Top Right */}
          <div className="col-span-12 md:col-span-4 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between shadow-inner shadow-white/5">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">Progress</p>
              <p className="text-2xl font-black tabular-nums">
                RONDE {Math.min(roundCount, maxRounds).toString().padStart(2, '0')}
                <span className="text-zinc-700">/{maxRounds.toString().padStart(2, '0')}</span>
              </p>
            </div>
            <div className="flex gap-1.5 flex-wrap justify-end max-w-[100px]">
              {[...Array(maxRounds)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-6 transition-all duration-500 ${
                    i < roundCount ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-zinc-800'
                  }`} 
                />
              ))}
            </div>
          </div>

          {/* Debate Messages - Middle Left */}
          <div className="col-span-12 md:col-span-8 flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-inner shadow-white/5 min-h-[400px]">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
              <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Ruang Percapakan</span>
              {isLoading && (
                <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase animate-pulse">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Lawan sedang mengetik...
                </div>
              )}
              {errorMsg && !isLoading && (
                <div className="text-[10px] text-red-500 font-bold uppercase animate-bounce">
                  Error: {errorMsg}
                </div>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <MessageList messages={messages} />
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Sidebar Info/Result - Right Column */}
          <div className="col-span-12 md:col-span-4 md:row-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-inner shadow-white/5">
            <div className="flex flex-col h-full">
              <div className="mb-6 pb-6 border-b border-zinc-800">
                <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest">Status Juri AI</span>
                {status === 'JUDGING' || (isLoading && roundCount >= maxRounds) ? (
                  <>
                    <h3 className="text-lg font-black mt-1 uppercase italic animate-pulse">Menganalisis...</h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">Juri sedang meninjau kekuatan logis dan bukti dari seluruh rangkaian argumen Anda.</p>
                  </>
                ) : status === 'FINISHED' ? (
                  <>
                    <h3 className="text-lg font-black mt-1 uppercase italic text-green-500">Selesai</h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">Penilaian telah dirilis. Anda dapat melihat detail skor di panel hasil.</p>
                  </>
                ) : roundCount >= maxRounds ? (
                  <>
                    <h3 className="text-lg font-black mt-1 uppercase italic text-blue-500">Siap Dinilai</h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed mb-4">Semua ronde telah terpenuhi. Klik tombol di bawah untuk mendapatkan feedback juri.</p>
                    <button 
                      onClick={handleTriggerJudge}
                      disabled={isLoading}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 uppercase tracking-widest text-[10px] active:scale-95 disabled:opacity-50"
                    >
                      <Scale size={14} /> Minta Penilaian
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-black mt-1 uppercase italic">Menunggu...</h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">Juri akan memberikan skor setelah ronde ke-{maxRounds} berakhir. Fokus pada data dan logika tajam.</p>
                  </>
                )}
              </div>
              
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase mb-3 font-black tracking-widest">Kriteria Penilaian</p>
                  <div className="space-y-4">
                    {[
                      { label: 'Ketajaman Argumen', progress: status === 'FINISHED' ? 100 : (roundCount / maxRounds) * 30 + 10 },
                      { label: 'Data & Referensi', progress: status === 'FINISHED' ? 100 : (roundCount / maxRounds) * 20 + 5 },
                      { label: 'Kontra Logika', progress: status === 'FINISHED' ? 100 : (roundCount / maxRounds) * 25 + 10 }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                          <span className="text-zinc-400">{item.label}</span>
                          <span className="text-zinc-600">{status === 'FINISHED' ? 'Final' : `${Math.round(item.progress)}%`}</span>
                        </div>
                        <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.progress}%` }}
                            className="bg-zinc-600 h-full rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-4">
                  <div className="bg-zinc-800/30 p-4 rounded-xl border border-zinc-800/50">
                    <p className="text-[10px] text-zinc-500 uppercase mb-2 font-black tracking-widest">Tips Ronde Ini</p>
                    <p className="text-[11px] leading-relaxed text-zinc-400 italic">
                      {roundCount === 0 ? "Mulailah dengan premis yang kuat dan sertakan fakta yang sulit dibantah." : 
                       roundCount < maxRounds ? "Identifikasi celah pada argumen AI dan serang balik dengan data spesifik." :
                       roundCount === maxRounds ? "Simpulkan argumen Anda dengan penegasan posisi yang tidak tergoyahkan." :
                       "Lihat hasil evaluasi juri di layar pop-up."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Input - Bottom Left */}
          <div className="col-span-12 md:col-span-8 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-inner shadow-white/5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest">Argumen Anda</span>
              <span className="text-[10px] text-zinc-600 font-mono">SESI AKTIF</span>
            </div>
            <ArgumentInput 
              onSend={handleSendMessage} 
              disabled={status !== 'DEBATING' || isLoading} 
              placeholder={status === 'FINISHED' ? "Debat selesai." : "Ketik argumen kontra anda di sini..."}
            />
          </div>

        </div>
      )}

      {/* Footer Bar */}
      <footer className="flex justify-between text-[9px] text-zinc-600 font-mono uppercase tracking-widest pt-2">
        <div>MODUS: INTERAKTIF / BAHASA: ID_ID</div>
        <div className="text-right">© 2024 RUANGDEBAT AI ENGINE. ALL RIGHTS RESERVED.</div>
      </footer>

      {/* Result Modal */}
      <AnimatePresence>
        {status === 'FINISHED' && result && (
          <ResultModal result={result} onReset={resetToSetup} />
        )}
      </AnimatePresence>
    </div>
  );
}
