import { GitBranch, GitCommit, Clock, Eye } from "lucide-react";

export function DiscoveryGuide() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg border border-blue-200 dark:border-blue-800 p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <GitBranch size={16} className="text-blue-600 dark:text-blue-400" />
        <h3 className="font-semibold text-blue-900 dark:text-blue-100">
          Discovery Version Control
        </h3>
      </div>

      <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
        <p>
          Every meaningful discovery creates a <strong>commit</strong> to your
          personal universe history.
        </p>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="flex items-center gap-2">
            <GitCommit size={12} />
            <span className="text-xs">New elements = New commit</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={12} />
            <span className="text-xs">Timeline preserved</span>
          </div>

          <div className="flex items-center gap-2">
            <GitBranch size={12} />
            <span className="text-xs">Branch evolution paths</span>
          </div>

          <div className="flex items-center gap-2">
            <Eye size={12} />
            <span className="text-xs">View past states</span>
          </div>
        </div>
      </div>
    </div>
  );
}
