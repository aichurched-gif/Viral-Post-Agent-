
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Platform, GeneratedPost, PLATFORM_ALGORITHMS, ImageSize } from "../types";

// Always initialize the client with process.env.API_KEY directly.
export async function getAIInstance() {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export async function generateViralPosts(topic: string, description: string): Promise<GeneratedPost[]> {
  const ai = await getAIInstance();
  const prompt = `
    You are an elite Viral Content Strategist. 
    Topic: "${topic}"
    Context: "${description}"
    Generate 4 distinct viral posts for TikTok, Instagram, YouTube Shorts, and X.
    Return strictly as a JSON array of objects. Use only lowercase platform identifiers: "tiktok", "instagram", "youtube", "x".
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              platform: { type: Type.STRING },
              content: { type: Type.STRING },
              explanation: { type: Type.STRING },
              virality_score: { type: Type.NUMBER }
            },
            // Property ordering is recommended for object types in schemas.
            propertyOrdering: ["platform", "content", "explanation", "virality_score"],
            required: ["platform", "content", "explanation", "virality_score"]
          }
        }
      }
    });

    const results = JSON.parse(response.text || "[]");
    return results.map((item: any) => {
      const platformKey = item.platform.toLowerCase() as Platform;
      const config = PLATFORM_ALGORITHMS[platformKey] || PLATFORM_ALGORITHMS[Platform.TIKTOK];
      return { ...item, name: config.name, icon: config.icon, algorithm: config.mechanics };
    });
  } catch (error) {
    console.error("Post Generation Error:", error);
    throw error;
  }
}

export async function generateVisualAsset(prompt: string, size: ImageSize): Promise<string> {
  const ai = await getAIInstance();
  // Simplified contents call with a text string.
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: `A viral social media thumbnail or post image: ${prompt}`,
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: size
      }
    },
  });

  // Iterating through all parts to find the image part as recommended.
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  throw new Error("No image data returned from model");
}

export async function deepAnalyzeContent(content: string): Promise<string> {
  const ai = await getAIInstance();
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Analyze this content for psychological triggers, algorithm retention markers, and potential virality blindspots. Provide a deep, strategic teardown: \n\n${content}`,
    config: {
      // thinkingBudget provides better reasoning for complex analysis tasks.
      thinkingConfig: { thinkingBudget: 32768 }
    },
  });
  return response.text || "No analysis provided.";
}

export async function refinePostWithAI(content: string, feedback: string): Promise<string> {
  const ai = await getAIInstance();
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Refine this social media post based on the following request: "${feedback}". Keep it viral and algorithm-optimized. \n\nOriginal Content: ${content}`,
  });
  return response.text || content;
}

export async function chatWithGemini(messages: { role: string, parts: { text: string }[] }[]) {
  const ai = await getAIInstance();
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are the ViralPostAgent AI Strategist. You help users refine their social media game with behavioral science and algorithm insights."
    }
  });
  
  const lastMessage = messages[messages.length - 1].parts[0].text;
  // chat.sendMessage property access for text result.
  const response: GenerateContentResponse = await chat.sendMessage({ message: lastMessage });
  return response.text || "I'm not sure how to respond to that.";
}
