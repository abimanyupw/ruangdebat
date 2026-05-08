import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ArgumentInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
  placeholder?: string;
}

export const ArgumentInput: React.FC<ArgumentInputProps> = ({ onSend, disabled, placeholder }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="relative group">
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          placeholder={placeholder || "Ketik argumen Anda di sini..."}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-zinc-100 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all disabled:opacity-50 resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              handleSubmit(e);
            }
          }}
        />
        <div className="absolute bottom-3 right-3 text-[9px] text-zinc-700 font-mono pointer-events-none group-focus-within:text-zinc-500 transition-colors">
          SHIFT + ENTER UNTUK BARIS BARU
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!text.trim() || disabled}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-2.5 rounded shadow-lg shadow-red-900/10 font-bold text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 disabled:hover:bg-red-600 flex items-center gap-2 active:scale-95"
        >
          Kirim Argumen <Send size={12} />
        </button>
      </div>
    </form>
  );
};
