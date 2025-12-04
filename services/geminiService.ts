import { GoogleGenAI, Type } from "@google/genai";
import { SummaryType, SummaryResult } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing via process.env.API_KEY");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// Helper to get length description based on type
const getLengthInstruction = (type: SummaryType): string => {
  switch (type) {
    case SummaryType.SHORT:
      return "conciso, focado no lead (quem, o quê, quando, onde), aprox. 100-150 palavras";
    case SummaryType.MEDIUM:
      return "detalhado, cobrindo contexto e desenvolvimento, aprox. 300-400 palavras";
    case SummaryType.ANALYTICAL:
      return "profundo, incluindo análise de impacto, nuances e contexto histórico, aprox. 500+ palavras";
    default:
      return "conciso";
  }
};

export const generateNewsSummary = async (
  text: string, 
  type: SummaryType
): Promise<Omit<SummaryResult, 'timestamp' | 'originalTextLength' | 'type'>> => {
  
  const lengthInstruction = getLengthInstruction(type);

  const prompt = `
    Você é um editor sênior de um jornal de prestígio. Sua tarefa é resumir o texto fornecido.
    
    Diretrizes Estritas:
    1. O estilo deve ser jornalístico, objetivo e imparcial.
    2. Mantenha a integridade total de nomes próprios, datas, locais e fatos numéricos. Não invente ou alucine informações.
    3. O tipo de resumo deve ser: ${lengthInstruction}.
    4. Gere um título atraente e jornalístico.
    5. Extraia os pontos-chave (bullet points).
    
    Texto para resumir:
    "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Título jornalístico do resumo" },
            summary: { type: Type.STRING, description: "O corpo do resumo" },
            bulletPoints: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Lista de 3 a 5 pontos principais"
            }
          },
          required: ["title", "summary", "bulletPoints"]
        }
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return {
        title: parsed.title,
        summary: parsed.summary,
        bulletPoints: parsed.bulletPoints
      };
    } else {
      throw new Error("No response text from Gemini");
    }

  } catch (error) {
    console.error("Error generating summary:", error);
    throw error;
  }
};