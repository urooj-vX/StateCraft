import { AIService, AIResponse, SYSTEM_PROMPT } from './types';
import { Element } from '../../types';

export class GroqService implements AIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateCombination(element1: Element, element2: Element): Promise<AIResponse> {
    const url = 'https://api.groq.com/openai/v1/chat/completions';
    
    const messages = [
      { role: "system", content: SYSTEM_PROMPT + " Output strictly valid JSON." },
      { role: "user", content: `Combine: ${element1.name} + ${element2.name}` }
    ];

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "llama3-70b-8192", 
          messages: messages,
          temperature: 0.6,
          max_tokens: 200,
          response_format: { type: "json_object" }
        })
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (!content) throw new Error('No response from Groq');

      return JSON.parse(content);
    } catch (error) {
      console.error('Groq Error:', error);
      throw error;
    }
  }
}
