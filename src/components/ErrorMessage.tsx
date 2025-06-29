import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export default function ErrorMessage({
  message,
  onRetry,
  retryLabel = "다시 시도",
}: ErrorMessageProps) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
        <p className="mt-4 text-red-600 text-sm sm:text-base px-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  );
}
