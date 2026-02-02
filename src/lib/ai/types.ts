import { Element } from '../types';

export interface AIResponse {
  name: string;
  emoji: string;
  description: string;
  isNew: boolean;
}

export interface AIService {
  generateCombination(element1: Element, element2: Element): Promise<AIResponse>;
}

export type AIProvider = 'gemini' | 'groq' | 'cerebras';

export const SYSTEM_PROMPT = `
You are the engine for an infinite alchemy game.
Your goal is to creatively combine two elements into a new one.
- Result should be a single noun or short phrase.
- Emoji should be relevant.
- Description should be witty or scientific (1 short sentence).
- Be creative! "Water" + "Fire" = "Steam", but "Internet" + "Cat" = "Meme".
- If the combination makes no sense, invent a funny result.
- Return ONLY JSON.
`;
