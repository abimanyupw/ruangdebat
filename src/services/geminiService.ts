import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

const apiKey = process.env.GEMINI_API_KEY || "";

if (!apiKey) {
  console.error("CRITICAL: GEMINI_API_KEY is missing. Please set it in Vercel Environment Variables.");
}

const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION_DEBATER = `
Kamu adalah sistem RuangDebat — platform debat interaktif berbahasa Indonesia.
PERANMU: LAWAN DEBAT.
Aturan:
1. Ketika user menyampaikan argumen, balas dengan argumen kontra yang sangat kuat.
2. Gunakan data, logika, dan contoh nyata.
3. Maksimal 3 kalimat per respons.
4. Jangan pernah setuju dengan posisi user.
5. Gunakan Bahasa Indonesia yang formal namun tajam.
6. Format respons harus diawali dengan [LAWAN]:
`;

const SYSTEM_INSTRUCTION_JUDGE = `
Kamu adalah sistem RuangDebat — platform debat interaktif berbahasa Indonesia.
PERANMU: JURI AI PROFESIONAL.
Tugas: Memberikan penilaian objektif dan EVALUASI MENDALAM terhadap performa user dalam debat (minimal 5 ronde).

Output harus dalam format JSON yang valid:
{
  "userScore": number (0-100),
  "aiScore": number (0-100),
  "winner": "Kamu" | "AI",
  "pros": string[] (3 poin spesifik kelebihan argumen user),
  "cons": string[] (3 poin spesifik hambatan/kelemahan user),
  "growthTips": string[] (3 saran praktis agar user dapat berkembang dalam debat di masa depan)
}

Kriteria Penilaian:
1. Validitas Data: Apakah user menggunakan bukti atau hanya asumsi?
2. Struktur Logika: Apakah ada sesat pikir (fallacy)?
3. Respon Kritik: Bagaimana user membalas serangan balik dari lawan?
4. Retorika: Gaya penyampaian dan pemilihan kosakata.

PENTING: Berikan kritik yang jujur namun membangun. Fokus pada bagaimana user bisa menjadi pendebat yang lebih baik.
`;

export async function getDebateResponse(history: Message[]) {
  const contents = history.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }]
  }));

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_DEBATER,
      temperature: 0.7,
    },
  });

  return response.text?.replace('[LAWAN]: ', '').trim() || "Maaf, saya tidak bisa merespons argumen Anda saat ini.";
}

export async function getJudgeResult(history: Message[]) {
  const conversationText = history
    .map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.text}`)
    .join('\n');

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Nilailah debat berikut ini:\n\n${conversationText}`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_JUDGE,
      responseMimeType: "application/json",
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse judge result:", e);
    return null;
  }
}

export async function generateTopic() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Berikan satu topik debat yang sangat spesifik, kontroversial, dan acak dalam Bahasa Indonesia. Pilih dari kategori yang berbeda setiap kali (seperti: Bioetika, Keamanan Siber, Kebijakan Publik, Hubungan Manusia, atau Teknologi Masa Depan). Berikan HANYA judul topiknya saja tanpa tanda kutip.",
    config: {
      systemInstruction: "Kamu adalah moderator debat profesional yang ingin menantang logika manusia dengan topik-topik unik.",
    }
  });

  return response.text?.trim() || "Efektivitas sistem demokrasi digital dalam menggantikan birokrasi tradisional";
}
