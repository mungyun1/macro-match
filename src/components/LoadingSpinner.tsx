interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export default function LoadingSpinner({
  message = "데이터를 불러오는 중...",
  size = "md",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div
          className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-blue-600 mx-auto`}
        ></div>
        <p className="mt-4 text-gray-600 text-sm sm:text-base">{message}</p>
      </div>
    </div>
  );
}
