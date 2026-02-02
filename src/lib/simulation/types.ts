export type Domain = "Geo" | "Hydro" | "Atmo" | "Bio" | "Cosmic" | "Event" | "Abstract" | "Tech";
export type Role = "Matter" | "Structure" | "Process" | "State" | "System" | "Dominator" | "Source" | "Modifier" | "Event";

export interface ElementDef {
    domain: Domain;
    role: Role;
    scale: number; // 1-5
}

export const BASE_ELEMENTS: Record<string, ElementDef> = {
    // Base
    "Fire": { domain: "Atmo", role: "Source", scale: 1 }, // Or Energy?
    "Water": { domain: "Hydro", role: "Matter", scale: 1 },
    "Earth": { domain: "Geo", role: "Matter", scale: 1 },
    "Air": { domain: "Atmo", role: "Matter", scale: 1 }, // Wind?
    "Wind": { domain: "Atmo", role: "Process", scale: 1 },
    "Plant": { domain: "Bio", role: "Matter", scale: 1 },
    "Smoke": { domain: "Atmo", role: "Matter", scale: 1 },

    // Key Modifiers
    "Time": { domain: "Abstract", role: "Modifier", scale: 0 },
    "Pressure": { domain: "Abstract", role: "Modifier", scale: 0 },
    "Gravity": { domain: "Abstract", role: "Modifier", scale: 0 },
    
    // Geology
    "Lava": { domain: "Geo", role: "Matter", scale: 2 },
    "Volcano": { domain: "Geo", role: "Structure", scale: 3 },
    "Mountain": { domain: "Geo", role: "Structure", scale: 3 },
    "Mountain Range": { domain: "Geo", role: "Structure", scale: 4 },
    "Plateau": { domain: "Geo", role: "Structure", scale: 4 },
    "Ash": { domain: "Geo", role: "Matter", scale: 1 },
    "Obsidian": { domain: "Geo", role: "Matter", scale: 2 },
    "Valley": { domain: "Geo", role: "Structure", scale: 3 },

    // Volcanic
    "Super Volcano": { domain: "Geo", role: "Structure", scale: 5 },
    "Eruption": { domain: "Event", role: "Process", scale: 3 },
    "Super Eruption": { domain: "Event", role: "Process", scale: 5 },
    "Caldera": { domain: "Geo", role: "Structure", scale: 4 },
    "Yellowstone": { domain: "Geo", role: "Structure", scale: 5 },

    // Hydrology
    "Mud": { domain: "Hydro", role: "Matter", scale: 1 },
    "Swamp": { domain: "Hydro", role: "System", scale: 2 },
    "Bog": { domain: "Hydro", role: "System", scale: 2 },
    "Peat": { domain: "Geo", role: "Matter", scale: 2 },
    "Lake": { domain: "Hydro", role: "System", scale: 3 },
    "Wetland": { domain: "Hydro", role: "System", scale: 3 },
    "Rain": { domain: "Hydro", role: "Process", scale: 1 },
    "Erosion": { domain: "Geo", role: "Process", scale: 2 },

    // Cosmic
    "Star": { domain: "Cosmic", role: "Source", scale: 4 },
    "Supernova": { domain: "Cosmic", role: "Event", scale: 5 },
    "Black Hole": { domain: "Cosmic", role: "Dominator", scale: 5 },
    "Accretion Disk": { domain: "Cosmic", role: "Structure", scale: 5 },
    "Matter": { domain: "Abstract", role: "Matter", scale: 1 }, // Generic

    // Atmospheric
    "Smog": { domain: "Atmo", role: "Matter", scale: 2 },
    "Orographic Lift": { domain: "Atmo", role: "Process", scale: 3 },

    // Abstract / Misc
    "Tectonic Plate": { domain: "Geo", role: "Structure", scale: 5 },
};
