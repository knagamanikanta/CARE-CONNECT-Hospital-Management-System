import { GoogleGenAI } from "@google/genai";

const AI_API_KEY = process.env.API_KEY || ''; // In a real app, strict env check

// Fallback if no key provided
const isConfigured = !!AI_API_KEY;

let ai: GoogleGenAI | null = null;
if (isConfigured) {
  ai = new GoogleGenAI({ apiKey: AI_API_KEY });
}

export const chatWithHealthAssistant = async (message: string): Promise<string> => {
  if (!ai) {
    return "AI Assistant is not configured. Please add a valid API_KEY to the environment variables.";
  }

  try {
    const model = ai.models;
    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: "You are a helpful, empathetic medical assistant for a hospital app called 'Care Connect'. You provide general health information and symptom checking but ALWAYS include a disclaimer that you are an AI and not a doctor. Keep responses concise (under 150 words) unless asked for detail. If the user asks to book an appointment, guide them to the 'Book Appointment' page.",
      }
    });
    return response.text || "I'm sorry, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("AI Error:", error);
    return "I'm having trouble connecting to the service. Please try again later.";
  }
};
