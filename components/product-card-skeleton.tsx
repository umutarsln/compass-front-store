import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary rounded-lg">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content Skeleton */}
      <div className="space-y-2">
        {/* Category Skeleton */}
        <Skeleton className="h-3 w-20" />

        {/* Title Skeleton */}
        <div className="space-y-1">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>

        {/* Subtitle Skeleton */}
        <Skeleton className="h-3 w-2/3" />

        {/* Price Skeleton */}
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  )
}
