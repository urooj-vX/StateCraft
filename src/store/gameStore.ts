import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Element, CanvasItem, VersionControl, Branch } from "../types";
import { AIHandler } from "../lib/ai";
import { AIProvider } from "../lib/ai/types";
import { soundManager } from "../lib/audio";
import {
  categorizeElement,
  isCommitWorthy,
  createCommit,
  initializeVersionControl,
  determineBranchCategory,
  generateBranchName,
  generateCommitId,
} from "../lib/versionControl";

export interface GameSettings {
  apiKey: string;
  provider: AIProvider;
  darkMode: boolean;
  soundEnabled: boolean;
}

export interface GameState {
  library: Element[];
  canvasItems: CanvasItem[];
  recipes: Record<string, string>; // "id1:id2" -> resultElementId
  settings: GameSettings;
  isGenerating: boolean;

  // Version Control
  versionControl: VersionControl;
  selectedCommit: string | null; // For viewing history
  lastCommitMessage: string | null; // For showing notifications

  addElementToLibrary: (element: Element) => void;
  addElementToCanvas: (elementId: string, x: number, y: number) => void;
  updateCanvasItemPosition: (itemId: string, x: number, y: number) => void;
  removeCanvasItem: (itemId: string) => void;
  clearCanvas: () => void;
  resetProgress: () => void;
  setSettings: (settings: Partial<GameSettings>) => void;

  combineElements: (canvasId1: string, canvasId2: string) => Promise<void>;

  // Version Control Methods
  selectCommit: (commitId: string | null) => void;
  checkoutCommit: (commitId: string) => void;
  createBranch: (fromCommit?: string) => void;
  switchBranch: (branchId: string) => void;
  clearCommitNotification: () => void;
}

const INITIAL_ELEMENTS: Element[] = [
  {
    id: "water",
    name: "Water",
    emoji: "💧",
    description: "Basic element",
    discoveredAt: Date.now(),
    category: "basic",
  },
  {
    id: "fire",
    name: "Fire",
    emoji: "🔥",
    description: "Basic element",
    discoveredAt: Date.now(),
    category: "basic",
  },
  {
    id: "air",
    name: "Air",
    emoji: "💨",
    description: "Basic element",
    discoveredAt: Date.now(),
    category: "basic",
  },
  {
    id: "earth",
    name: "Earth",
    emoji: "🌍",
    description: "Basic element",
    discoveredAt: Date.now(),
    category: "basic",
  },
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      library: INITIAL_ELEMENTS,
      canvasItems: [],
      recipes: {},
      settings: {
        apiKey: "",
        provider: "gemini", // Default
        darkMode: false,
        soundEnabled: true,
      },
      isGenerating: false,

      // Version Control
      versionControl: initializeVersionControl(INITIAL_ELEMENTS),
      selectedCommit: null,
      lastCommitMessage: null,

      addElementToLibrary: (element) =>
        set((state) => {
          if (state.library.some((e) => e.id === element.id)) return state;

          // Categorize the element
          const categorizedElement = {
            ...element,
            category: element.category || categorizeElement(element),
          };

          const newLibrary = [...state.library, categorizedElement];

          // Check if this discovery warrants a commit
          let newVersionControl = state.versionControl;
          if (isCommitWorthy(categorizedElement, state.library)) {
            const commit = createCommit(
              categorizedElement,
              state.versionControl.head,
              newLibrary,
            );

            if (commit) {
              newVersionControl = {
                ...state.versionControl,
                commits: [...state.versionControl.commits, commit],
                head: commit.id,
                branches: state.versionControl.branches.map((branch) =>
                  branch.id === state.versionControl.currentBranch
                    ? { ...branch, head: commit.id }
                    : branch,
                ),
              };
            }
          }

          return {
            library: newLibrary,
            versionControl: newVersionControl,
          };
        }),

      addElementToCanvas: (elementId, x, y) =>
        set((state) => ({
          canvasItems: [
            ...state.canvasItems,
            {
              id: crypto.randomUUID(),
              elementId,
              x,
              y,
            },
          ],
        })),

      updateCanvasItemPosition: (itemId, x, y) => {
        set((state) => {
          // Find if this item is close to another item to merge
          // Simple distance check could be done here or in UI
          // For now, just update position. Merge is triggered explicitly or by specific drop event?
          // DragEnd in App.tsx handles drop. logic should be moved there or called there.
          // We'll just update position here.
          return {
            canvasItems: state.canvasItems.map((item) =>
              item.id === itemId ? { ...item, x, y } : item,
            ),
          };
        });
      },

      removeCanvasItem: (itemId) =>
        set((state) => ({
          canvasItems: state.canvasItems.filter((item) => item.id !== itemId),
        })),

      clearCanvas: () => set({ canvasItems: [] }),

      resetProgress: () =>
        set({
          library: INITIAL_ELEMENTS,
          canvasItems: [],
          recipes: {},
          versionControl: initializeVersionControl(INITIAL_ELEMENTS),
          selectedCommit: null,
          lastCommitMessage: null,
        }),

      setSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      combineElements: async (canvasId1, canvasId2) => {
        const state = get();
        const item1 = state.canvasItems.find((i) => i.id === canvasId1);
        const item2 = state.canvasItems.find((i) => i.id === canvasId2);

        if (!item1 || !item2) return;

        const el1 = state.library.find((e) => e.id === item1.elementId);
        const el2 = state.library.find((e) => e.id === item2.elementId);

        if (!el1 || !el2) return;

        // Sort IDs for consistent recipe key
        const [id1, id2] = [el1.id, el2.id].sort();
        const recipeKey = `${id1}:${id2}`;

        // 1. Check Recipe Cache
        let resultId = state.recipes[recipeKey];

        // 2. If no recipe, Generate
        if (!resultId) {
          set({ isGenerating: true });
          try {
            // Prioritize Settings Key (if user manually overrides), then fallback to Env Vars
            // (kept for compatibility, though keys are unused by logic now)
            const keys = {};

            const ai = new AIHandler(keys);
            const response = await ai.combine(el1, el2);

            // Create new element
            const newId = response.name.toLowerCase().replace(/\s+/g, "-");

            // Check if this element already exists in library independent of recipe
            let existing = state.library.find((e) => e.id === newId);

            if (!existing) {
              const newElement: Element = {
                id: newId,
                name: response.name,
                emoji: response.emoji,
                description: response.description,
                parents: [el1.id, el2.id],
                isNew: response.isNew,
                discoveredAt: Date.now(),
                category: categorizeElement({
                  id: newId,
                  name: response.name,
                  emoji: response.emoji,
                  description: response.description,
                  discoveredAt: Date.now(),
                }),
              };

              // Use addElementToLibrary to handle version control
              get().addElementToLibrary(newElement);
              existing = newElement;
              soundManager.playSuccess();
            } else {
              // Already discovered
              soundManager.playFailure(); // Or just a snap? failures are better for "nothing new"
            }

            resultId = existing.id;

            // Save recipe
            set((s) => ({ recipes: { ...s.recipes, [recipeKey]: resultId } }));
          } catch (err) {
            console.error("Fusion failed", err);
            set({ isGenerating: false });
            return;
          } finally {
            set({ isGenerating: false });
          }
        }

        // 3. Execution: Remove parents, add child
        // Position child at the location of the target (item2 usually the drop target)
        set((s) => ({
          canvasItems: [
            ...s.canvasItems.filter(
              (i) => i.id !== canvasId1 && i.id !== canvasId2,
            ),
            {
              id: crypto.randomUUID(),
              elementId: resultId,
              x: item2.x,
              y: item2.y,
            },
          ],
        }));
      },

      // Version Control Methods
      selectCommit: (commitId) => set({ selectedCommit: commitId }),

      checkoutCommit: (commitId) =>
        set((state) => {
          const commit = state.versionControl.commits.find(
            (c) => c.id === commitId,
          );
          if (!commit) return state;

          // Restore library to the state at this commit
          const restoredLibrary = state.library.filter((e) =>
            commit.worldState.elementIds.includes(e.id),
          );

          return {
            library: restoredLibrary,
            selectedCommit: commitId,
            canvasItems: [], // Clear canvas when checking out
          };
        }),

      createBranch: (fromCommit) =>
        set((state) => {
          const recentElements = state.library.slice(-5); // Last 5 discoveries
          const category = determineBranchCategory(recentElements);
          const branchName = generateBranchName(category, recentElements);
          const branchId = generateCommitId();

          const newBranch: Branch = {
            id: branchId,
            name: branchName,
            head: fromCommit || state.versionControl.head,
            created: Date.now(),
            category,
          };

          return {
            versionControl: {
              ...state.versionControl,
              branches: [...state.versionControl.branches, newBranch],
              currentBranch: branchId,
            },
          };
        }),

      switchBranch: (branchId) =>
        set((state) => {
          const branch = state.versionControl.branches.find(
            (b) => b.id === branchId,
          );
          if (!branch) return state;

          return {
            versionControl: {
              ...state.versionControl,
              currentBranch: branchId,
              head: branch.head,
            },
          };
        }),

      clearCommitNotification: () => set({ lastCommitMessage: null }),
    }),
    {
      name: "canvas-storage-v2",
    },
  ),
);
