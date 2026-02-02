import { useState, useEffect, useRef } from "react";
import { Terminal, X } from "lucide-react";
import { GitCommandParser, GitCommandResult } from "../lib/gitCommands";
import { useGameStore } from "../store/gameStore";

interface GitTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GitTerminal({ isOpen, onClose }: GitTerminalProps) {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<
    Array<{ command: string; result: GitCommandResult }>
  >([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const library = useGameStore((state) => state.library);
  const versionControl = useGameStore((state) => state.versionControl);
  const selectCommit = useGameStore((state) => state.selectCommit);
  const checkoutCommit = useGameStore((state) => state.checkoutCommit);
  const createBranch = useGameStore((state) => state.createBranch);
  const switchBranch = useGameStore((state) => state.switchBranch);

  const gitParser = new GitCommandParser(library, versionControl, {
    selectCommit,
    checkoutCommit,
    createBranch,
    switchBranch,
  });

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (cmd: string) => {
    if (!cmd.trim()) return;

    const result = gitParser.parse(cmd);
    setHistory((prev) => [...prev, { command: cmd, result }]);
    setCommand("");
    setHistoryIndex(-1);

    // Execute any actions
    if (result.action) {
      setTimeout(result.action, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(command);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(history[history.length - 1 - newIndex].command);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(history[history.length - 1 - newIndex].command);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand("");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-green-400 font-mono text-sm w-[800px] h-[600px] rounded-lg border border-gray-700 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Terminal size={16} />
            <span className="text-gray-300">Discovery Git Terminal</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Output */}
        <div ref={outputRef} className="flex-1 p-4 overflow-y-auto space-y-2">
          {history.length === 0 && (
            <div className="text-gray-500">
              <p>Discovery Version Control Terminal</p>
              <p>
                Type 'git status' to see your world state, or 'git log' to view
                history.
              </p>
              <p>
                Available commands: status, log, add, commit, branch, checkout,
                diff, show
              </p>
            </div>
          )}

          {history.map((entry, index) => (
            <div key={index} className="space-y-1">
              <div className="text-gray-300">
                <span className="text-blue-400">$</span> {entry.command}
              </div>
              <pre
                className={`whitespace-pre-wrap text-xs leading-relaxed ${
                  entry.result.success ? "text-green-400" : "text-red-400"
                }`}
              >
                {entry.result.output}
              </pre>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-blue-400">$</span>
            <input
              ref={inputRef}
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-green-400 outline-none"
              placeholder="git status"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
