import { useGameStore } from "../store/gameStore";
import { Element } from "../types";
import { categorizeElement } from "./versionControl";

export interface GitCommandResult {
  success: boolean;
  output: string;
  action?: () => void;
}

export class GitCommandParser {
  constructor(
    private library: Element[],
    private versionControl: any,
    private gameActions: {
      selectCommit: (id: string | null) => void;
      checkoutCommit: (id: string) => void;
      createBranch: () => void;
      switchBranch: (id: string) => void;
    },
  ) {}

  parse(command: string): GitCommandResult {
    const cmd = command.trim().toLowerCase();

    if (!cmd.startsWith("git ")) {
      return {
        success: false,
        output: 'Not a git command. Try "git status" or "git log".',
      };
    }

    const args = cmd.slice(4).trim().split(" ").filter(Boolean);
    const subcommand = args[0];

    switch (subcommand) {
      case "status":
        return this.gitStatus();

      case "log":
        return this.gitLog(args.slice(1));

      case "add":
        return this.gitAdd(args.slice(1));

      case "commit":
        return this.gitCommit(args.slice(1));

      case "branch":
        return this.gitBranch(args.slice(1));

      case "checkout":
        return this.gitCheckout(args.slice(1));

      case "diff":
        return this.gitDiff(args.slice(1));

      case "show":
        return this.gitShow(args.slice(1));

      case "revert":
        return this.gitRevert(args.slice(1));

      case "reset":
        return this.gitReset(args.slice(1));

      case "push":
        return this.gitPush(args.slice(1));

      case "pull":
        return this.gitPull(args.slice(1));

      default:
        return {
          success: false,
          output: `git: '${subcommand}' is not a git command. Available: status, log, add, commit, branch, checkout, diff, show, revert, reset, push, pull`,
        };
    }
  }

  private gitStatus(): GitCommandResult {
    const currentBranch = this.versionControl.branches.find(
      (b: any) => b.id === this.versionControl.currentBranch,
    );

    const recentElements = this.library.slice(-3);
    const unstagedCount = recentElements.filter(
      (e) => categorizeElement(e) !== "basic",
    ).length;

    let output = `On branch ${currentBranch?.name || "unknown"}\n`;

    if (unstagedCount > 0) {
      output += `\nChanges not staged for commit:\n`;
      output += `\t(use "git add ." to stage discoveries)\n\n`;
      recentElements.forEach((e) => {
        if (categorizeElement(e) !== "basic") {
          output += `\tmodified:   ${e.name}\n`;
        }
      });
    } else {
      output += `\nNothing to commit, working tree clean`;
    }

    return { success: true, output };
  }

  private gitLog(args: string[]): GitCommandResult {
    const limit = args.includes("--oneline") ? 10 : 5;
    const commits = this.versionControl.commits.slice(-limit).reverse();

    let output = "";
    commits.forEach((commit: any) => {
      if (args.includes("--oneline")) {
        output += `${commit.id.substring(0, 7)} ${commit.message}\n`;
      } else {
        output += `commit ${commit.id}\n`;
        output += `Date: ${new Date(commit.timestamp).toISOString()}\n\n`;
        output += `    ${commit.message}\n\n`;
      }
    });

    return { success: true, output: output || "No commits yet." };
  }

  private gitAdd(args: string[]): GitCommandResult {
    if (args.length === 0) {
      return { success: false, output: "Nothing specified, nothing added." };
    }

    if (args[0] === ".") {
      const recentElements = this.library.slice(-3);
      const staged = recentElements.filter(
        (e) => categorizeElement(e) !== "basic",
      );

      if (staged.length === 0) {
        return { success: true, output: "No changes to stage." };
      }

      return {
        success: true,
        output: `Staged ${staged.length} discoveries for next commit.\nUse "git commit" to save progress.`,
      };
    }

    return {
      success: false,
      output: `pathspec '${args[0]}' did not match any files`,
    };
  }

  private gitCommit(args: string[]): GitCommandResult {
    const messageIndex = args.findIndex((arg) => arg === "-m");

    if (messageIndex === -1) {
      return {
        success: false,
        output:
          'Please specify a commit message with -m flag.\nExample: git commit -m "Discovered new elements"',
      };
    }

    const message = args
      .slice(messageIndex + 1)
      .join(" ")
      .replace(/['"]/g, "");

    if (!message) {
      return {
        success: false,
        output: "Aborting commit due to empty commit message.",
      };
    }

    // Check if there's anything to commit
    const recentElements = this.library.slice(-3);
    const newDiscoveries = recentElements.filter(
      (e) => categorizeElement(e) !== "basic",
    );

    if (newDiscoveries.length === 0) {
      return {
        success: true,
        output: "On branch main\nnothing to commit, working tree clean",
      };
    }

    // This would trigger a manual commit in the actual implementation
    return {
      success: true,
      output: `[main ${Math.random().toString(36).substr(2, 8)}] ${message}\n${newDiscoveries.length} discovery(ies) committed.`,
    };
  }

  private gitBranch(args: string[]): GitCommandResult {
    if (args.length === 0) {
      // List branches
      let output = "";
      this.versionControl.branches.forEach((branch: any) => {
        const prefix =
          branch.id === this.versionControl.currentBranch ? "* " : "  ";
        output += `${prefix}${branch.name}\n`;
      });
      return { success: true, output };
    }

    // Create new branch
    const branchName = args[0];
    return {
      success: true,
      output: `Switched to a new branch '${branchName}'\nExplore a new discovery path!`,
      action: () => this.gameActions.createBranch(),
    };
  }

  private gitCheckout(args: string[]): GitCommandResult {
    if (args.length === 0) {
      return {
        success: false,
        output: "error: You must specify a branch or commit to checkout.",
      };
    }

    const target = args[0];

    // Find branch by name
    const branch = this.versionControl.branches.find((b: any) =>
      b.name.toLowerCase().includes(target.toLowerCase()),
    );

    if (branch) {
      return {
        success: true,
        output: `Switched to branch '${branch.name}'\nYour discoveries are now on this evolution path.`,
        action: () => this.gameActions.switchBranch(branch.id),
      };
    }

    // Find commit by ID prefix
    const commit = this.versionControl.commits.find((c: any) =>
      c.id.startsWith(target.toLowerCase()),
    );

    if (commit) {
      return {
        success: true,
        output: `HEAD is now at ${commit.id.substring(0, 7)} ${commit.message}\nViewing past world state.`,
        action: () => this.gameActions.checkoutCommit(commit.id),
      };
    }

    return {
      success: false,
      output: `error: pathspec '${target}' did not match any known branch or commit.`,
    };
  }

  private gitDiff(args: string[]): GitCommandResult {
    const currentCommit = this.versionControl.commits.find(
      (c: any) => c.id === this.versionControl.head,
    );

    if (!currentCommit) {
      return { success: true, output: "No commits to compare." };
    }

    const parentCommit = this.versionControl.commits.find(
      (c: any) => c.id === currentCommit.parent,
    );

    if (!parentCommit) {
      return {
        success: true,
        output: "Initial commit - no parent to diff against.",
      };
    }

    let output = `diff --git a/universe b/universe\nindex ${parentCommit.id.substring(0, 7)}..${currentCommit.id.substring(0, 7)}\n`;
    output += `--- a/universe\n+++ b/universe\n@@ -1,${parentCommit.worldState.elementIds.length} +1,${currentCommit.worldState.elementIds.length} @@\n`;

    currentCommit.diff.addedElements.forEach((elementId: string) => {
      const element = this.library.find((e) => e.id === elementId);
      output += `+${element?.name || elementId} (${element?.emoji || "?"})\n`;
    });

    return { success: true, output };
  }

  private gitShow(args: string[]): GitCommandResult {
    const target = args[0] || this.versionControl.head;

    const commit = this.versionControl.commits.find(
      (c: any) => c.id === target || c.id.startsWith(target),
    );

    if (!commit) {
      return { success: false, output: `fatal: bad object ${target}` };
    }

    let output = `commit ${commit.id}\n`;
    output += `Date: ${new Date(commit.timestamp).toISOString()}\n\n`;
    output += `    ${commit.message}\n\n`;

    if (commit.diff.addedElements.length > 0) {
      output += `diff --git a/universe b/universe\n`;
      commit.diff.addedElements.forEach((elementId: string) => {
        const element = this.library.find((e) => e.id === elementId);
        output += `+${element?.name || elementId}\n`;
      });
    }

    return {
      success: true,
      output,
      action: () => this.gameActions.selectCommit(commit.id),
    };
  }

  private gitRevert(args: string[]): GitCommandResult {
    if (args.length === 0) {
      return {
        success: false,
        output:
          "error: You must specify a commit to revert.\nUsage: git revert <commit-hash>",
      };
    }

    const target = args[0];
    const commit = this.versionControl.commits.find(
      (c: any) => c.id === target || c.id.startsWith(target),
    );

    if (!commit) {
      return {
        success: false,
        output: `fatal: bad revision '${target}'`,
      };
    }

    if (commit.id === "initial") {
      return {
        success: false,
        output: "error: Cannot revert initial commit",
      };
    }

    // Find the parent commit to revert to
    const parentCommit = this.versionControl.commits.find(
      (c: any) => c.id === commit.parent,
    );

    if (!parentCommit) {
      return {
        success: false,
        output: "error: Cannot find parent commit to revert to",
      };
    }

    return {
      success: true,
      output: `Reverted commit ${commit.id.substring(0, 7)}: "${commit.message}"\nWorld state restored to: ${parentCommit.message}`,
      action: () => this.gameActions.checkoutCommit(parentCommit.id),
    };
  }

  private gitReset(args: string[]): GitCommandResult {
    if (args.length === 0) {
      return {
        success: false,
        output:
          "error: You must specify a commit to reset to.\nUsage: git reset <commit-hash>",
      };
    }

    const target = args[0];
    let commit;

    if (target === "HEAD~1" || target === "HEAD^") {
      // Go back one commit
      const currentCommit = this.versionControl.commits.find(
        (c: any) => c.id === this.versionControl.head,
      );
      if (currentCommit) {
        commit = this.versionControl.commits.find(
          (c: any) => c.id === currentCommit.parent,
        );
      }
    } else {
      commit = this.versionControl.commits.find(
        (c: any) => c.id === target || c.id.startsWith(target),
      );
    }

    if (!commit) {
      return {
        success: false,
        output: `fatal: bad revision '${target}'`,
      };
    }

    return {
      success: true,
      output: `HEAD is now at ${commit.id.substring(0, 7)} ${commit.message}\nWorld state reset to this discovery point.`,
      action: () => this.gameActions.checkoutCommit(commit.id),
    };
  }

  private gitPush(args: string[]): GitCommandResult {
    const uncommittedCount = this.library
      .slice(-3)
      .filter((e) => (e as any).category !== "basic").length;

    if (uncommittedCount > 0) {
      return {
        success: false,
        output: `error: You have ${uncommittedCount} uncommitted discoveries.\nCommit your changes before pushing.\nUse: git add . && git commit -m "your message"`,
      };
    }

    const recentCommits = this.versionControl.commits.slice(-3);
    const syncedCount = recentCommits.length;

    return {
      success: true,
      output: `Pushing to origin/main...\nTo github.com:universe/discovery-world.git\n   ${recentCommits[0]?.id?.substring(0, 7) || "initial"}..${this.versionControl.head.substring(0, 7)}  main -> main\n\n✨ ${syncedCount} discovery commits synced to the multiverse!\nYour world-building progress is now backed up.`,
    };
  }

  private gitPull(args: string[]): GitCommandResult {
    // Simulate pulling from a "multiverse repository"
    const isUpToDate = Math.random() > 0.3; // 70% chance of being up to date

    if (isUpToDate) {
      return {
        success: true,
        output: `From github.com:universe/discovery-world\n * branch            main       -> FETCH_HEAD\nAlready up to date.\n\n🌌 Your discovery world is synchronized with the multiverse.`,
      };
    } else {
      const newDiscoveries = [
        "Quantum Foam",
        "Dark Energy",
        "Parallel Universe",
      ];
      const randomDiscovery =
        newDiscoveries[Math.floor(Math.random() * newDiscoveries.length)];

      return {
        success: true,
        output: `From github.com:universe/discovery-world\n * branch            main       -> FETCH_HEAD\n   ${Math.random().toString(36).substr(2, 8)}..${Math.random().toString(36).substr(2, 8)}  main       -> origin/main\nUpdating discovery database...\n\n🔮 New discovery available from the multiverse: "${randomDiscovery}"\nMerge complete. Try combining your elements to rediscover it!`,
      };
    }
  }
}
