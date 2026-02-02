export interface Element {
  id: string;
  name: string;
  emoji: string;
  description?: string;
  parents?: [string, string]; // IDs of the two parent elements
  isNew?: boolean;
  discoveredAt: number;
  category?: ElementCategory;
}

export type ElementCategory =
  | "basic"
  | "structure"
  | "process"
  | "system"
  | "event";

export interface CanvasItem {
  id: string; // Unique instance ID on canvas
  elementId: string; // Reference to the Element
  x: number;
  y: number;
}

export interface DragItem {
  id: string;
  type: "sidebar-element" | "canvas-element";
  element: Element;
}

// Version Control Types
export interface WorldState {
  elements: Set<string>; // Element IDs
  processes: Set<string>; // Process Element IDs
  systems: Set<string>; // System Element IDs
}

export interface CommitDiff {
  addedElements: string[];
  addedProcesses: string[];
  addedSystems: string[];
}

export interface Commit {
  id: string;
  parent: string | null;
  timestamp: number;
  message: string;
  diff: CommitDiff;
  worldState: {
    elementIds: string[];
    processIds: string[];
    systemIds: string[];
  };
}

export interface Branch {
  id: string;
  name: string;
  head: string; // Commit ID
  created: number;
  category: "main" | "volcanic" | "hydrology" | "geological" | "atmospheric";
}

export interface VersionControl {
  commits: Commit[];
  branches: Branch[];
  currentBranch: string;
  head: string; // Current commit ID
}
