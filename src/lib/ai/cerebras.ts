import { AIService, AIResponse, SYSTEM_PROMPT } from './types';
import { Element } from '../../types';

export class CerebrasService implements AIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateCombination(element1: Element, element2: Element): Promise<AIResponse> {
    const url = 'https://api.cerebras.ai/v1/chat/completions';
    
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
          model: "llama3.1-70b", // Or glm-4.7 if available via their specific endpoint, usually they host llamas
          messages: messages,
          temperature: 0.7,
          max_tokens: 200,
          response_format: { type: "json_object" } // Cerebras supports this
        })
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (!content) throw new Error('No response from Cerebras');

      return JSON.parse(content);
    } catch (error) {
      console.error('Cerebras Error:', error);
      throw error;
    }
  }
}
