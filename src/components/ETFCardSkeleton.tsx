export default function ETFCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 animate-pulse">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          {/* Symbol */}
          <div className="h-5 sm:h-6 bg-gray-200 rounded w-16 mb-2"></div>
          {/* Name */}
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-full mb-2"></div>
          {/* Category Tag */}
          <div className="h-5 bg-gray-200 rounded-full w-16"></div>
        </div>
        {/* Risk Icon and Label */}
        <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-8"></div>
        </div>
      </div>

      {/* Price Section */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-baseline justify-between">
          <div>
            {/* Price */}
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-20 mb-2"></div>
            {/* Change Rate */}
            <div className="flex items-center">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded mr-1"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="space-y-1.5 sm:space-y-2">
        {/* Market Cap */}
        <div className="flex justify-between">
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-12"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-16"></div>
        </div>
        {/* Volume */}
        <div className="flex justify-between">
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-10"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-12"></div>
        </div>
        {/* Expense Ratio */}
        <div className="flex justify-between">
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-14"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-12"></div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
        {/* Description Text */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>

        {/* Correlation Factors Tags */}
        <div className="mt-2 flex flex-wrap gap-1">
          <div className="h-5 bg-gray-200 rounded w-12"></div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
          <div className="h-5 bg-gray-200 rounded w-14"></div>
        </div>
      </div>
    </div>
  );
}
