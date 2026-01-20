
import { GoogleGenAI } from "@google/genai";

const PROMPT = `Transform this photo into an ultra-realistic, Vogue-style high-fashion portrait with a cowboy-inspired aesthetic. 
The subject should wear a sophisticated tailored jacket and fitted trousers. 
Include a classic "cowboy kofia" (a unique fusion of a traditional kofia shape with cowboy elements). 
CRITICAL: Keep the subject's REAL FACE exactly as it is in the original image. NO facial changes. 
The background should be minimalist and high-end, similar to a professional studio fashion shoot. 
Style: Cinematic lighting, luxury textures, hyper-detailed.`;

export async function transformImageToCowboy(base64Image: string): Promise<string> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure it is configured.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Extract data after the comma if it's a data URL
  const base64Data = base64Image.split(',')[1] || base64Image;
  const mimeType = base64Image.match(/data:([^;]+);/)?.[1] || 'image/jpeg';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: PROMPT,
          },
        ],
      },
    });

    let resultImageUrl: string | null = null;

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          resultImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!resultImageUrl) {
      throw new Error("Failed to receive an edited image from the AI. It might have only returned text.");
    }

    return resultImageUrl;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "An unexpected error occurred during transformation.");
  }
}
