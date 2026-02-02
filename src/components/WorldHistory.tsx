import { useState } from "react";
import {
  Clock,
  GitBranch,
  ChevronRight,
  ChevronDown,
  Eye,
  GitCommit,
  Zap,
  Cog,
  Mountain,
  Globe,
} from "lucide-react";
import { useGameStore } from "../store/gameStore";
import { Commit, Branch, ElementCategory } from "../types";
import { DiscoveryGuide } from "./DiscoveryGuide";

interface WorldHistoryProps {
  className?: string;
}

function getCategoryIcon(category?: ElementCategory) {
  switch (category) {
    case "event":
      return <Zap size={12} className="text-yellow-500" />;
    case "process":
      return <Cog size={12} className="text-blue-500" />;
    case "structure":
      return <Mountain size={12} className="text-gray-600" />;
    case "system":
      return <Globe size={12} className="text-green-500" />;
    default:
      return <div className="w-3 h-3 rounded-full bg-gray-300" />;
  }
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

function CommitItem({
  commit,
  isSelected,
  onSelect,
  onCheckout,
}: {
  commit: Commit;
  isSelected: boolean;
  onSelect: () => void;
  onCheckout: () => void;
}) {
  const library = useGameStore((state) => state.library);

  return (
    <div
      className={`group p-3 border-l-2 transition-all duration-200 cursor-pointer ${
        isSelected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <GitCommit
            size={14}
            className={isSelected ? "text-blue-500" : "text-gray-400"}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <code className="text-xs font-mono text-gray-500 dark:text-gray-400">
              {commit.id.substring(0, 7)}
            </code>
            <span className="text-xs text-gray-400">
              {formatTimestamp(commit.timestamp)}
            </span>
          </div>

          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
            {commit.message}
          </p>

          {commit.diff.addedElements.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {commit.diff.addedElements.slice(0, 3).map((elementId) => {
                const element = library.find((e) => e.id === elementId);
                return (
                  <span
                    key={elementId}
                    className="px-1.5 py-0.5 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded flex items-center gap-1"
                  >
                    {element && getCategoryIcon(element.category)}+{elementId}
                  </span>
                );
              })}
              {commit.diff.addedElements.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{commit.diff.addedElements.length - 3} more
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCheckout();
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
            >
              <Eye size={12} />
              View State
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BranchItem({
  branch,
  isActive,
  onSwitch,
}: {
  branch: Branch;
  isActive: boolean;
  onSwitch: () => void;
}) {
  return (
    <div
      className={`p-2 rounded-md border cursor-pointer transition-all ${
        isActive
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
      }`}
      onClick={onSwitch}
    >
      <div className="flex items-center gap-2">
        <GitBranch
          size={14}
          className={isActive ? "text-blue-500" : "text-gray-400"}
        />
        <span className="text-sm font-medium flex-1">{branch.name}</span>
        <span className="text-xs text-gray-500 capitalize">
          {branch.category}
        </span>
      </div>
    </div>
  );
}

export function WorldHistory({ className = "" }: WorldHistoryProps) {
  const [showBranches, setShowBranches] = useState(false);
  const [showCommits, setShowCommits] = useState(true);

  const versionControl = useGameStore((state) => state.versionControl);
  const selectedCommit = useGameStore((state) => state.selectedCommit);
  const selectCommit = useGameStore((state) => state.selectCommit);
  const checkoutCommit = useGameStore((state) => state.checkoutCommit);
  const createBranch = useGameStore((state) => state.createBranch);
  const switchBranch = useGameStore((state) => state.switchBranch);

  const currentBranch = versionControl.branches.find(
    (b) => b.id === versionControl.currentBranch,
  );

  // Get commits in reverse chronological order
  const sortedCommits = [...versionControl.commits].reverse();

  return (
    <div className={className}>
      <DiscoveryGuide />

      <div className="space-y-4">
        {/* Branch Selector */}
        <div>
          <button
            onClick={() => setShowBranches(!showBranches)}
            className="flex items-center gap-2 w-full p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
          >
            {showBranches ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
            <GitBranch size={16} />
            Branches ({versionControl.branches.length})
          </button>

          {showBranches && (
            <div className="mt-2 space-y-2">
              {versionControl.branches.map((branch) => (
                <BranchItem
                  key={branch.id}
                  branch={branch}
                  isActive={branch.id === versionControl.currentBranch}
                  onSwitch={() => switchBranch(branch.id)}
                />
              ))}

              <button
                onClick={() => createBranch()}
                className="w-full p-2 text-sm text-blue-600 dark:text-blue-400 border border-dashed border-blue-300 dark:border-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950"
              >
                + Create Branch
              </button>
            </div>
          )}
        </div>

        {/* World History */}
        <div>
          <button
            onClick={() => setShowCommits(!showCommits)}
            className="flex items-center gap-2 w-full p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
          >
            {showCommits ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
            <Clock size={16} />
            World History
          </button>

          {showCommits && (
            <div className="mt-2">
              <div className="text-xs text-gray-500 mb-3 px-3">
                Current: {currentBranch?.name || "Unknown Branch"}
              </div>

              <div className="space-y-1 max-h-96 overflow-y-auto">
                {sortedCommits.map((commit) => (
                  <CommitItem
                    key={commit.id}
                    commit={commit}
                    isSelected={selectedCommit === commit.id}
                    onSelect={() =>
                      selectCommit(
                        selectedCommit === commit.id ? null : commit.id,
                      )
                    }
                    onCheckout={() => checkoutCommit(commit.id)}
                  />
                ))}
              </div>

              {sortedCommits.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Clock size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No discoveries yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
