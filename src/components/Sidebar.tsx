import { useState, useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import { ElementCard } from "./ElementCard";
import { WorldHistory } from "./WorldHistory";
import { GitTerminal } from "./GitTerminal";
import {
  Search,
  Trash2,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Brush,
  Package,
  Clock,
  Terminal,
} from "lucide-react";
import { SettingsModal } from "./SettingsModal";
import { soundManager } from "../lib/audio";
import { GitCommandParser } from "../lib/gitCommands";

export function Sidebar() {
  const library = useGameStore((state) => state.library);
  const clearCanvas = useGameStore((state) => state.clearCanvas);
  const resetProgress = useGameStore((state) => state.resetProgress);
  const settings = useGameStore((state) => state.settings);
  const setSettings = useGameStore((state) => state.setSettings);
  const versionControl = useGameStore((state) => state.versionControl);
  const selectCommit = useGameStore((state) => state.selectCommit);
  const checkoutCommit = useGameStore((state) => state.checkoutCommit);
  const createBranch = useGameStore((state) => state.createBranch);
  const switchBranch = useGameStore((state) => state.switchBranch);

  const [search, setSearch] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"elements" | "history">(
    "elements",
  );
  const [gitOutput, setGitOutput] = useState("");
  const [showGitOutput, setShowGitOutput] = useState(false);

  // Git command parser
  const gitParser = new GitCommandParser(library, versionControl, {
    selectCommit,
    checkoutCommit,
    createBranch,
    switchBranch,
  });

  // Sync Audio
  useEffect(() => {
    soundManager.toggle(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Sync Dark Mode
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.darkMode]);

  const toggleOutcome = () => {
    setSettings({ darkMode: !settings.darkMode });
  };

  const toggleSound = () => {
    setSettings({ soundEnabled: !settings.soundEnabled });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim().startsWith("git ")) {
      e.preventDefault();
      const result = gitParser.parse(search.trim());

      setGitOutput(result.output);
      setShowGitOutput(true);

      if (result.action) {
        result.action();
      }

      // Clear search after command
      setSearch("");

      // Hide output after 5 seconds
      setTimeout(() => setShowGitOutput(false), 5000);
    }
  };

  const filteredElements = library.filter((el) =>
    el.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="w-[340px] h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col z-10 shadow-xl transition-colors">
        {/* Tab Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("elements")}
              className={`flex-1 px-4 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
                activeTab === "elements"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Package size={16} />
                Elements ({library.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 px-4 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
                activeTab === "history"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Clock size={16} />
                History ({versionControl.commits.length})
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === "elements" ? (
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex flex-wrap content-start gap-2">
                {filteredElements.map((element) => (
                  <ElementCard key={element.id} element={element} />
                ))}
              </div>

              {filteredElements.length === 0 && (
                <div className="text-center py-10 text-slate-400 dark:text-slate-600">
                  <p className="text-sm">No elements found.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <WorldHistory />
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-3">
          {/* Git Command Output */}
          {showGitOutput && (
            <div className="bg-gray-900 text-green-400 p-3 rounded-lg border text-xs font-mono max-h-32 overflow-y-auto">
              <pre className="whitespace-pre-wrap">{gitOutput}</pre>
            </div>
          )}

          {/* Search / Git Command Input */}
          <div className="relative">
            {search.startsWith("git ") ? (
              <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
            ) : (
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            )}
            <input
              type="text"
              placeholder={
                search.startsWith("git ")
                  ? "Git command (press Enter to execute)"
                  : "Search items or type 'git' commands..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className={`w-full border rounded-lg py-2 pl-9 pr-3 text-sm transition-all focus:outline-none focus:ring-2 ${
                search.startsWith("git ")
                  ? "bg-gray-900 border-green-500 text-green-400 placeholder-green-600 focus:ring-green-500 font-mono"
                  : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:ring-slate-300 dark:focus:ring-slate-600"
              }`}
            />
          </div>

          {/* 4 Options Row: DarkMode | Clear | Sound | Terminal */}
          <div className="flex justify-between items-center px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            {/* Dark Mode */}
            <button
              onClick={toggleOutcome}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              title={
                settings.darkMode
                  ? "Switch to Light Mode"
                  : "Switch to Dark Mode"
              }
            >
              {settings.darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Clear Canvas (Broom) */}
            <button
              onClick={clearCanvas}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors"
              title="Clear Canvas"
            >
              <Brush className="w-5 h-5" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              title={settings.soundEnabled ? "Mute Sound" : "Enable Sound"}
            >
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>

            {/* Git Terminal Toggle */}
            <button
              onClick={() => setIsTerminalOpen(!isTerminalOpen)}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-green-500 transition-colors"
              title="Open Git Terminal"
            >
              <Terminal className="w-5 h-5" />
            </button>
          </div>

          {/* Reset Progress (Still separate as it's destructive) */}
          <button
            onClick={() => {
              if (
                confirm(
                  "Are you sure? This will delete all discovered elements.",
                )
              ) {
                resetProgress();
              }
            }}
            className="w-full px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors flex items-center justify-center gap-2 opacity-60 hover:opacity-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Reset Progress
          </button>
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <GitTerminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />
    </>
  );
}
