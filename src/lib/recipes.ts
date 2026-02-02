import { AIResponse } from './ai/types';

export const STATIC_RECIPES: Record<string, AIResponse> = {};

// Helper to register recipes safely
function register(e1: string, e2: string, result: string, emoji: string = "✨", tier: number = 1) {
    const key = [e1, e2].sort().join(":");
    STATIC_RECIPES[key] = {
        name: result,
        emoji,
        description: `Tier ${tier} element created from ${e1} and ${e2}.`,
        isNew: true
    };
}

// ==========================================
// CORE / ABSTRACT (Bootstrapping)
// ==========================================
// User wants Time/Pressure. 
// Logic: Earth+Earth=Pressure, Sun+Plant=Time (Growth) or maybe Abstract?
register("Earth", "Earth", "Pressure", "⬇️", 1); 
register("Plant", "Sun", "Time", "⏳", 1); // Creative liberty to bootstrap Time
register("Time", "Time", "Eternity", "♾️", 5);
register("Wind", "Time", "Erosion", "🏜️", 2);

// ==========================================
// GEOLOGY & VOLCANIC CHAIN (PRIMARY)
// ==========================================
register("Earth", "Fire", "Lava", "🌋", 1);
register("Lava", "Earth", "Volcano", "🌋", 2);
register("Volcano", "Eruption", "Eruption", "💥", 3); // ??? Volcano+Eruption -> Eruption? Maybe "Super Eruption"?
register("Volcano", "Volcano", "Mountain", "⛰️", 3);
register("Mountain", "Mountain", "Mountain Range", "🏔️", 4);
register("Mountain Range", "Time", "Plateau", "🦅", 4);
register("Volcano", "Time", "Dormant Volcano", "💤", 3);
register("Dormant Volcano", "Time", "Mountain", "⛰️", 3);
register("Lava", "Water", "Obsidian", "🖤", 2);
register("Lava", "Air", "Ash", "⚱️", 2);
register("Ash", "Earth", "Fertile Soil", "🌱", 2);
register("Fertile Soil", "Plant", "Vegetation", "🌿", 2);

// ==========================================
// SUPERVOLCANO / YELLOWSTONE LOGIC
// ==========================================
register("Volcano", "Pressure", "Super Volcano", "☢️", 5);
register("Super Volcano", "Eruption", "Super Eruption", "🤯", 5);
register("Super Eruption", "Ash", "Global Ash Cloud", "🌫️", 5);
register("Super Volcano", "Location", "Yellowstone", "🏞️", 5); // Need Location?
register("Yellowstone", "Eruption", "Super Eruption", "🤯", 5);

// ==========================================
// HYDROLOGY & WETLANDS
// ==========================================
register("Water", "Earth", "Mud", "💩", 1);
register("Mud", "Plant", "Swamp", "🐊", 2);
register("Swamp", "Time", "Bog", "🦠", 2);
register("Bog", "Pressure", "Peat", "🟫", 3);
register("Water", "Depression", "Lake", "🌊", 3); // Need Depression?
register("Lake", "Plant", "Wetland", "🌾", 3);
register("Wetland", "Time", "Swamp", "🐊", 3);
register("Swamp", "Stagnation", "Bog", "🦠", 3); // Need Stagnation?

// ==========================================
// ATMOSPHERIC INTERACTIONS
// ==========================================
register("Fire", "Air", "Smoke", "☁️", 1);
register("Smoke", "Wind", "Smog", "🏭", 2);
register("Wind", "Mountain", "Orographic Lift", "✈️", 3);
register("Orographic Lift", "Water", "Rain", "🌧️", 3);
register("Rain", "Earth", "Erosion", "🏜️", 2);
register("Erosion", "Mountain", "Valley", "🏞️", 3);

// ==========================================
// COSMIC CHAIN (FROM IMAGE)
// ==========================================
// Bootstrapping Star?
register("Fire", "Pressure", "Energy", "⚡", 2);
register("Energy", "Matter", "Star", "🌟", 3); // Need Matter
register("Star", "Collapse", "Supernova", "💥", 4); // Need Collapse
register("Supernova", "Gravity", "Black Hole", "🕳️", 5); // Need Gravity
register("Black Hole", "Matter", "Accretion Disk", "💿", 5);
register("Black Hole", "Time", "Evaporation", "👻", 5);

// ==========================================
// CROSS-DOMAIN (LIMITED & CONTROLLED)
// ==========================================
register("Black Hole", "Mountain", "Absorption", "⚫", 5);
register("Black Hole", "Lake", "Absorption", "⚫", 5);
register("Supernova", "Earth", "Extinction Event", "🦖", 5);
register("Extinction Event", "Time", "New Ecosystem", "🌳", 5);

// ==========================================
// HELPERS FOR BOOTSTRAPPING
// ==========================================
register("Earth", "Gravity", "Pressure", "⬇️", 1);
register("Earth", "Earth", "Gravity", "🍎", 1); // Gravity from mass?
register("Earth", "Water", "Mud", "💩", 1);
register("Wind", "Water", "Wave", "🌊", 1);
register("Sun", "Sun", "Supernova", "💥", 4); // Shortcut?

export function getRecipeKey(name1: string, name2: string): string {
    const [n1, n2] = [name1, name2].sort();
    return `${n1}:${n2}`;
}
