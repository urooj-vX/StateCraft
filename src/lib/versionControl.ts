import {
  Element,
  ElementCategory,
  Commit,
  Branch,
  CommitDiff,
  VersionControl,
} from "../types";

// Generate deterministic commit messages based on element category and name
export function generateCommitMessage(
  element: Element,
  isFirstDiscovery: boolean,
): string {
  if (!isFirstDiscovery) return ""; // No commit for rediscovery

  const category = element.category || "basic";
  const name = element.name;

  switch (category) {
    case "structure":
      if (name.toLowerCase().includes("mountain")) return `Formed: ${name}`;
      if (name.toLowerCase().includes("crystal"))
        return `Crystallized: ${name}`;
      if (
        name.toLowerCase().includes("rock") ||
        name.toLowerCase().includes("stone")
      )
        return `Solidified: ${name}`;
      return `Built: ${name}`;

    case "system":
      if (
        name.toLowerCase().includes("ocean") ||
        name.toLowerCase().includes("sea")
      )
        return `Established ocean: ${name}`;
      if (name.toLowerCase().includes("forest"))
        return `Grew ecosystem: ${name}`;
      if (name.toLowerCase().includes("desert"))
        return `Formed arid region: ${name}`;
      return `Created system: ${name}`;

    case "process":
      if (name.toLowerCase().includes("erosion"))
        return `Initiated erosion: ${name}`;
      if (name.toLowerCase().includes("cycle")) return `Started cycle: ${name}`;
      if (name.toLowerCase().includes("fusion"))
        return `Achieved fusion: ${name}`;
      return `Activated process: ${name}`;

    case "event":
      if (name.toLowerCase().includes("eruption"))
        return `🌋 Volcanic eruption: ${name}`;
      if (name.toLowerCase().includes("storm"))
        return `⛈️ Storm event: ${name}`;
      if (name.toLowerCase().includes("earthquake"))
        return `📍 Seismic event: ${name}`;
      if (name.toLowerCase().includes("black hole"))
        return `🕳️ Cosmic event: ${name}`;
      return `⚡ Triggered event: ${name}`;

    default:
      return `Discovered: ${name}`;
  }
}

// Determine element category based on name and description patterns
export function categorizeElement(element: Element): ElementCategory {
  const name = element.name.toLowerCase();
  const description = element.description?.toLowerCase() || "";

  // Event patterns (dramatic occurrences)
  if (
    name.includes("eruption") ||
    name.includes("black hole") ||
    name.includes("storm") ||
    name.includes("earthquake") ||
    name.includes("tsunami") ||
    name.includes("explosion") ||
    name.includes("supernova") ||
    name.includes("lightning") ||
    name.includes("tornado") ||
    description.includes("catastrophic") ||
    description.includes("explosive") ||
    description.includes("disaster") ||
    description.includes("phenomenon")
  ) {
    return "event";
  }

  // System patterns (complex formations)
  if (
    name.includes("range") ||
    name.includes("forest") ||
    name.includes("ocean") ||
    name.includes("desert") ||
    name.includes("swamp") ||
    name.includes("lake") ||
    name.includes("valley") ||
    name.includes("plateau") ||
    name.includes("wetland") ||
    name.includes("ecosystem") ||
    name.includes("biome") ||
    name.includes("habitat") ||
    name.includes("archipelago") ||
    name.includes("canyon") ||
    name.includes("reef")
  ) {
    return "system";
  }

  // Process patterns (ongoing activities)
  if (
    name.includes("erosion") ||
    name.includes("weathering") ||
    name.includes("photosynthesis") ||
    name.includes("evaporation") ||
    name.includes("condensation") ||
    name.includes("flow") ||
    name.includes("circulation") ||
    name.includes("cycle") ||
    name.includes("fermentation") ||
    name.includes("decomposition") ||
    name.includes("fusion") ||
    name.includes("crystallization") ||
    description.includes("process") ||
    description.includes("cycle") ||
    description.includes("transformation") ||
    description.includes("reaction")
  ) {
    return "process";
  }

  // Structure patterns (physical formations)
  if (
    name.includes("mountain") ||
    name.includes("rock") ||
    name.includes("crystal") ||
    name.includes("tree") ||
    name.includes("plant") ||
    name.includes("building") ||
    name.includes("structure") ||
    name.includes("mineral") ||
    name.includes("metal") ||
    name.includes("stone") ||
    name.includes("cliff") ||
    name.includes("cave") ||
    description.includes("formation") ||
    description.includes("solid") ||
    description.includes("structure") ||
    description.includes("building")
  ) {
    return "structure";
  }

  return "basic";
}

// Check if an element discovery is commit-worthy
export function isCommitWorthy(element: Element, library: Element[]): boolean {
  // Only commit if this is a genuinely new discovery
  const isFirstDiscovery = !library.some((e) => e.id === element.id);
  if (!isFirstDiscovery) return false;

  const category = element.category || categorizeElement(element);

  // Basic elements don't get commits (except for the initial ones)
  if (category === "basic" && library.length > 4) return false;

  return true;
}

// Generate commit ID (simple hash-based approach)
export function generateCommitId(): string {
  return Math.random().toString(36).substr(2, 8);
}

// Create a new commit
export function createCommit(
  element: Element,
  parentCommit: string | null,
  library: Element[],
): Commit | null {
  const message = generateCommitMessage(element, true);
  if (!message) return null;

  const category = element.category || categorizeElement(element);

  const diff: CommitDiff = {
    addedElements: [element.id],
    addedProcesses: category === "process" ? [element.id] : [],
    addedSystems: category === "system" ? [element.id] : [],
  };

  return {
    id: generateCommitId(),
    parent: parentCommit,
    timestamp: Date.now(),
    message,
    diff,
    worldState: {
      elementIds: library.map((e) => e.id),
      processIds: library
        .filter((e) => (e.category || categorizeElement(e)) === "process")
        .map((e) => e.id),
      systemIds: library
        .filter((e) => (e.category || categorizeElement(e)) === "system")
        .map((e) => e.id),
    },
  };
}

// Determine branch category based on recent discoveries
export function determineBranchCategory(
  recentElements: Element[],
): Branch["category"] {
  const categories = recentElements.map(
    (e) => e.category || categorizeElement(e),
  );
  const names = recentElements.map((e) => e.name.toLowerCase());

  // Check for dominant themes
  if (
    names.some(
      (n) => n.includes("volcano") || n.includes("lava") || n.includes("magma"),
    )
  ) {
    return "volcanic";
  }
  if (
    names.some(
      (n) => n.includes("water") || n.includes("ocean") || n.includes("river"),
    )
  ) {
    return "hydrology";
  }
  if (
    names.some(
      (n) =>
        n.includes("rock") || n.includes("mountain") || n.includes("earth"),
    )
  ) {
    return "geological";
  }
  if (
    names.some(
      (n) => n.includes("air") || n.includes("wind") || n.includes("cloud"),
    )
  ) {
    return "atmospheric";
  }

  return "main";
}

// Generate branch name based on category and elements
export function generateBranchName(
  category: Branch["category"],
  recentElements: Element[],
): string {
  switch (category) {
    case "volcanic":
      return "Volcanic Evolution";
    case "hydrology":
      return "Wetland Development";
    case "geological":
      return "Terrestrial Formation";
    case "atmospheric":
      return "Atmospheric Dynamics";
    default:
      return "Primary Discovery";
  }
}

// Initialize version control with the first commit
export function initializeVersionControl(
  initialElements: Element[],
): VersionControl {
  const initialCommit: Commit = {
    id: "initial",
    parent: null,
    timestamp: Date.now(),
    message: "Genesis: Initial Elements",
    diff: {
      addedElements: initialElements.map((e) => e.id),
      addedProcesses: [],
      addedSystems: [],
    },
    worldState: {
      elementIds: initialElements.map((e) => e.id),
      processIds: [],
      systemIds: [],
    },
  };

  const mainBranch: Branch = {
    id: "main",
    name: "Primary Discovery",
    head: "initial",
    created: Date.now(),
    category: "main",
  };

  return {
    commits: [initialCommit],
    branches: [mainBranch],
    currentBranch: "main",
    head: "initial",
  };
}
