import { CheckCircle, GitCommit } from "lucide-react";
import { useEffect } from "react";

interface CommitNotificationProps {
  message: string;
  visible: boolean;
  onHide: () => void;
}

export function CommitNotification({
  message,
  visible,
  onHide,
}: CommitNotificationProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onHide, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onHide]);

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-2">
        <GitCommit size={16} className="text-green-600 dark:text-green-400" />
        <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
      </div>

      <div>
        <p className="font-medium text-sm">Commit Created!</p>
        <p className="text-xs opacity-80">{message}</p>
      </div>
    </div>
  );
}
