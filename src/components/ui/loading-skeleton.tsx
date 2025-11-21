export function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4" />
      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
    </div>
  );
}