import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Message } from '../types';
import { User, Bot, Scale } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide bg-zinc-950/50">
      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] md:max-w-[75%] flex flex-col ${
                message.role === 'user' ? 'items-end text-right' : 'items-start text-left'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {message.role === 'ai' && message.type === 'debate' && (
                  <span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase">
                    [LAWAN] AI System
                  </span>
                )}
                {message.role === 'ai' && message.type === 'judge' && (
                  <span className="bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase">
                    [JURI] Evaluasi
                  </span>
                )}
                {message.role === 'ai' && message.type === 'intro' && (
                  <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase">
                    MODERATOR
                  </span>
                )}
                {message.role === 'user' && (
                  <span className="bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase">
                    [PEMAIN] Anda
                  </span>
                )}
                <span className="text-zinc-600 text-[9px] font-mono">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>

              <div
                className={`p-5 rounded-sm border ${
                  message.role === 'user'
                    ? 'bg-zinc-900 border-zinc-700 text-zinc-100 shadow-lg shadow-blue-900/5'
                    : message.type === 'judge'
                    ? 'bg-zinc-900 border-amber-900/50 text-amber-100 shadow-lg shadow-amber-900/5 italic'
                    : message.type === 'intro'
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-300'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-200'
                }`}
              >
                <p className={`text-lg md:text-xl font-light leading-relaxed whitespace-pre-wrap ${
                  message.role === 'ai' && message.type === 'debate' ? 'italic tracking-tight font-serif text-zinc-100' : ''
                }`}>
                  {message.text}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
