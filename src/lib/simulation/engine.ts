import { BASE_ELEMENTS, ElementDef, Domain } from './types';
import { STATIC_RECIPES, getRecipeKey } from '../recipes';

export class SimulationEngine {
    
    // Core Simulation Logic
    static simulate(name1: string, name2: string): { name: string, emoji: string, isNew: boolean } | null {
        // 1. Direct Recipe (Overrules everything)
        const key = getRecipeKey(name1, name2);
        if (STATIC_RECIPES[key]) {
            return STATIC_RECIPES[key];
        }

        // Get Defs via Name Lookup (or defaults)
        const def1 = this.getDef(name1);
        const def2 = this.getDef(name2);

        // 2. Cosmic Dominance
        // If one is Cosmic and massive, it destroys/absorbs the other
        if (this.isCosmicDominator(def1) && !this.isCosmicDominator(def2)) return this.createCosmicResult(def1, name2);
        if (this.isCosmicDominator(def2) && !this.isCosmicDominator(def1)) return this.createCosmicResult(def2, name1);

        // 3. Process Injection (Cross-Domain)
        // Geo + Hydro -> Erosion / Sediment
        if (this.matchDomains(def1, def2, "Geo", "Hydro")) return { name: "Erosion", emoji: "🏜️", isNew: true };
        // Fire/Atmo + Hydro -> Steam/Vapor
        if (this.matchDomains(def1, def2, "Atmo", "Hydro")) return { name: "Vapor", emoji: "💨", isNew: true };
        
        // 4. Stabilization (Same Domain/Scale)
        // Prevent "Mega X". Return a sensible aggregate or blocked.
        if (def1.domain === def2.domain && def1.role === def2.role && name1 === name2) {
             // Mountain + Mountain -> Mountain Range (Handled by recipe)
             // If NO recipe exists for X + X, check logic:
             if (def1.domain === "Geo" && def1.role === "Structure") return { name: "Tectonic Plate", emoji: "🗺️", isNew: true };
             if (def1.domain === "Hydro" && def1.role === "System") return { name: "Ocean", emoji: "🌊", isNew: true };
             
             // Block others to prevent "Mega X"
             return null; 
        }

        // 5. Universal Fallback logic for "Time" and "Pressure"
        if (name1 === "Time" || name2 === "Time") return { name: "Age", emoji: "🕰️", isNew: true };
        if (name1 === "Pressure" || name2 === "Pressure") return { name: "Diamond", emoji: "💎", isNew: true }; // Joke but physics?
        
        // 6. Generic Fallback: "Debris" or "Pile"?
        // User said "No dead merges". But also "Zero invalid merges".
        // Infinite Craft usually returns "Nothing" (Shake) if invalid.
        // We will return NULL behavior to mimic "No Reaction"
        
        return null;
    }

    private static getDef(name: string): ElementDef {
        return BASE_ELEMENTS[name] || { domain: "Abstract", role: "Matter", scale: 1 };
    }

    private static isCosmicDominator(def: ElementDef): boolean {
        return def.domain === "Cosmic" && def.role === "Dominator";
    }

    private static createCosmicResult(_dominator: ElementDef, _victimName: string): { name: string, emoji: string, isNew: boolean } {
        // Black Hole destroys
        return { name: "Absorption", emoji: "⚫", isNew: true };
    }

    private static matchDomains(d1: ElementDef, d2: ElementDef, target1: Domain, target2: Domain): boolean {
        return (d1.domain === target1 && d2.domain === target2) || (d1.domain === target2 && d2.domain === target1);
    }
}
