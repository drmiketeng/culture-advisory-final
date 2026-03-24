
import { GoogleGenAI, Type, Schema, Modality } from "@google/genai";
import { ReportData, ReportMode, Answer, TransformationPhase, Question, Submission, ChatMessage } from '../types';
import { QUESTIONS } from '../constants';
import { BOOK_CONTEXT } from './references';

// Simple in-memory cache to store generated audio URLs by text hash/content
const audioCache = new Map<string, string>();

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

// --- DETERMINISTIC SCORING LOGIC ---
const calculateAlignmentScore = (leaderAnswers: Answer[], staffSubmissions: Submission[]): number => {
  if (!leaderAnswers.length || !staffSubmissions.length) return 0;

  let totalMaxDistance = 0;
  let totalActualDistance = 0;

  QUESTIONS.forEach(q => {
    const leaderAns = leaderAnswers.find(a => a.questionId === q.id);
    if (!leaderAns) return; // Skip if leader didn't answer

    // Get all staff answers for this question
    const staffOptionIndices = staffSubmissions
      .map(s => s.answers.find(a => a.questionId === q.id)?.selectedOptionIndex)
      .filter(idx => idx !== undefined) as number[];

    if (staffOptionIndices.length === 0) return;

    // Calculate average staff choice (0, 1, 2)
    const staffAvg = staffOptionIndices.reduce((sum, val) => sum + val, 0) / staffOptionIndices.length;

    // Distance: Absolute difference between Leader Choice (0-2) and Staff Average (0-2)
    // Max possible distance per question is 2 (e.g. Leader picks 0, Staff picks 2)
    const distance = Math.abs(leaderAns.selectedOptionIndex - staffAvg);
    
    totalActualDistance += distance;
    totalMaxDistance += 2; // Max distance for one question
  });

  if (totalMaxDistance === 0) return 0;

  // Alignment Score: 100% - (Actual Deviation / Max Possible Deviation)
  const alignmentPercentage = 100 - ((totalActualDistance / totalMaxDistance) * 100);
  
  return parseFloat(alignmentPercentage.toFixed(1));
};

export const generateCultureReport = async (
  leaderAnswers: Answer[],
  staffSubmissions: Submission[],
  mode: ReportMode
): Promise<ReportData> => {
  const ai = getAiClient();
  
  // 1. Calculate the Real Math Score
  const calculatedScore = calculateAlignmentScore(leaderAnswers, staffSubmissions);

  // Helper to get text for an answer
  const getAnswerText = (qId: string, optIdx: number) => {
    const q = QUESTIONS.find(q => q.id === qId);
    return q ? q.options[optIdx] : "Unknown";
  };

  // Construct comparison context across ALL phases
  let dataContext = `ORGANIZATIONAL CULTURE ASSESSMENT DATA\n\n`;
  
  // Iterate through all phases to ensure full report coverage
  const phases = [TransformationPhase.SURGERY, TransformationPhase.RESUSCITATION, TransformationPhase.THERAPY];

  phases.forEach(phase => {
    dataContext += `=== PHASE: ${phase.toUpperCase()} ===\n\n`;
    const phaseQuestions = QUESTIONS.filter(q => q.phase === phase);

    phaseQuestions.forEach(q => {
      const leaderAns = leaderAnswers.find(a => a.questionId === q.id);
      const staffAnsList = staffSubmissions.map(s => s.answers.find(a => a.questionId === q.id)).filter(Boolean);

      dataContext += `SCENARIO: ${q.text}\n`;
      
      if (leaderAns) {
        dataContext += `LEADER VIEW: ${getAnswerText(q.id, leaderAns.selectedOptionIndex)}\n`;
      } else {
        dataContext += `LEADER VIEW: [Not Answered]\n`;
      }

      // Aggregate staff
      const staffCounts: Record<string, number> = {};
      staffAnsList.forEach(a => {
        if (a) {
          const txt = getAnswerText(q.id, a.selectedOptionIndex);
          staffCounts[txt] = (staffCounts[txt] || 0) + 1;
        }
      });

      dataContext += `STAFF CONSENSUS (Aggregated from ${staffSubmissions.length} staff):\n`;
      if (Object.keys(staffCounts).length === 0) {
        dataContext += `- No staff responses.\n`;
      } else {
        Object.entries(staffCounts).forEach(([text, count]) => {
          dataContext += `- "${text}": ${count} staff member(s)\n`;
        });
      }
      dataContext += `\n---\n`;
    });
    dataContext += `\n\n`;
  });

  const isFaith = mode === ReportMode.FAITH;

  const systemInstruction = `You are an expert Culture Advisory AI consultant, emulating the expertise of Dr. Michael Teng. 
  Your goal is to generate a **Final Strategic Report** that is professional, well-organized, and comprehensive.
  
  REFERENCE LIBRARY (Dr. Michael Teng's Works):
  Use the concepts, metaphors (e.g., Lion, Monkey, Eagle), and principles from these specific books.
  ${BOOK_CONTEXT}

  Input Data: Leader's strategic intent vs. Aggregated Staff reality across all phases.
  
  **CRITICAL SCORING INSTRUCTION:**
  The Calculated Cultural Alignment Score is: **${calculatedScore}/100**.
  Use this EXACT number. Do not estimate.

  **FORMATTING & READABILITY RULES (STRICT):**
  - Use **Short Paragraphs** (3-4 lines max).
  - Use **Bullet Points** heavily for lists and recommendations.
  - Use **Bold** for key terms and principles (e.g., **Cash is Oxygen**).
  - **Citations**: You MUST use the **"Required Citation"** format specified in the Reference Library. 
    - Example: Teng, M. (2006). *Corporate Wellness: 101 principles in corporate turnaround and transformation*.
    - DO NOT use (n.d.). DO NOT use dates for books that do not have them in the reference list.

  **STRUCTURE:**
  You are required to generate content for specific fields in the JSON schema. Do NOT combine them.
  1. **Executive Summary**: High-level diagnosis.
  2. **Surgery Analysis**: Deep dive into financial discipline/efficiency.
  3. **Resuscitation Analysis**: Deep dive into marketing/sales.
  4. **Therapy Analysis**: Deep dive into culture/HR.
  5. **Prayer/Reflection**: A separate field.

  ----------------------------------------------------------------------
  **SECTION DETAILS**
  ----------------------------------------------------------------------
  
  **Surgery Phase (Financial/Efficiency)**:
  - Analyze cost-cutting and survival measures.
  - Reference *Sun Zi* (Art of War concepts) and *Corporate Wellness*.
  
  **Resuscitation Phase (Marketing/Growth)**:
  - Analyze marketing sales and expansion.
  - Reference *Zheng He* (Collaboration/Diplomacy) and *Animals* (Monkey teams).

  **Therapy Phase (Culture/HR)**:
  - Analyze talent, morale, and mindset.
  - Reference *Confucius* (Relationships/Ren) and *Corporate Wellness* (Immunity).
  - **MANDATORY**: You MUST provide a full analysis here. Do not skip.

  **Prayer/Reflection Content**:
  ${isFaith ? `
  - **MODE: FAITH-BASED**
  - **Content**: Write a powerful ~700 word prayer script.
  - **Focus**: Based strictly on the Executive Summary.
  - **References**: Use Dr. Teng's "Office Politics: Biblical perspective". Cite Biblical scriptures.
  - **Anonymity**: Do NOT use the user's name. Use "this leader", "this organization".
  - **MANDATORY CLOSING**: "We pray all these in the name of Jesus Christ, Amen."
  ` : `
  - **MODE: SECULAR**
  - **Content**: Write a ~400 word "Leadership Reflection" or "Manifesto".
  - **Focus**: A secular meditation on the responsibilities of leadership based on the findings.
  `}
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      gapScore: { type: Type.NUMBER, description: "The calculated score provided in the prompt." },
      executiveSummary: { type: Type.STRING, description: "High level summary of findings in Markdown." },
      surgeryAnalysis: { type: Type.STRING, description: "Detailed analysis for Phase 1 (Surgery) in Markdown." },
      resuscitationAnalysis: { type: Type.STRING, description: "Detailed analysis for Phase 2 (Resuscitation) in Markdown." },
      therapyAnalysis: { type: Type.STRING, description: "Detailed analysis for Phase 3 (Therapy) in Markdown. MUST BE POPULATED." },
      conclusion: { type: Type.STRING, description: "Final thoughts and roadmap in Markdown." },
      prayerTitle: { type: Type.STRING, description: isFaith ? "Title for the prayer" : "Title for reflection" },
      prayerContent: { type: Type.STRING, description: "The ~700 word Prayer (Faith) or ~400 word Reflection (Secular). THIS FIELD IS MANDATORY." },
    },
    required: ["gapScore", "executiveSummary", "surgeryAnalysis", "resuscitationAnalysis", "therapyAnalysis", "conclusion", "prayerContent", "prayerTitle"]
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Generate the Final Strategic Report. The calculated score is ${calculatedScore}. Mode: ${mode}. \nData:\n${dataContext}`,
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: schema,
      temperature: 0.7,
      maxOutputTokens: 8192, 
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as ReportData;
};

export const generatePrayerAudio = async (text: string): Promise<string> => {
  if (audioCache.has(text)) {
    console.log("Serving audio from cache");
    return audioCache.get(text)!;
  }

  const ai = getAiClient();
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Fenrir' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error("Failed to generate audio");
  }

  const binaryString = atob(base64Audio);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const url = createWavUrl(bytes, 24000);
  
  audioCache.set(text, url);
  
  return url;
};

function createWavUrl(pcmData: Uint8Array, sampleRate: number): string {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmData.length;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  const pcmBytes = new Uint8Array(buffer, 44);
  pcmBytes.set(pcmData);

  const blob = new Blob([buffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

export const chatWithAssistant = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  const ai = getAiClient();
  
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
        systemInstruction: `You are a virtual assistant for the Culture Advisory Centre. 
        Your knowledge base includes Dr. Michael Teng's books:
        ${BOOK_CONTEXT}
        
        Answer questions pertaining ONLY to the centre, its methodology (Surgery, Resuscitation, Therapy), and organizational culture based on these books. 
        Your answers must be restricted to 200 words maximum. Be helpful, professional, and concise.
        IMPORTANT: If asked about citations, follow the format in the reference library EXACTLY.`
    },
    history: history.filter(msg => msg.role === 'user' || msg.role === 'model').map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }],
    })),
  });

  const result = await chat.sendMessage({ message: newMessage });
  return result.text;
};
