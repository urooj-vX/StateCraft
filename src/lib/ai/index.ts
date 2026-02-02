import { AIResponse } from './types';
import { Element } from '../../types';
import { SimulationEngine } from '../simulation/engine';

export interface AIConfig {
    // Left empty or legacy keys
}

export class AIHandler {
  constructor(_config: AIConfig) {}

  async combine(element1: Element, element2: Element): Promise<AIResponse> {
    
    // Use Physics Simulation Engine
    const result = SimulationEngine.simulate(element1.name, element2.name);

    if (result) {
        return {
            name: result.name,
            emoji: result.emoji,
            description: `A product of nature: ${element1.name} + ${element2.name}.`,
            isNew: true
        };
    } else {
        // "No Reaction" -> Return same elements or special "Nothing"
        // Returning one of the parents indicates "Nothing happened"
        return {
            name: element1.name, // Just bounce back
            emoji: element1.emoji,
            description: "Nothing happened.",
            isNew: false
        };
    }
  }
}
