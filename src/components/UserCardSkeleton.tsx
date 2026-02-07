import React from "react";
import { Card, CardHeader, CardContent } from "./ui/Card";
import { Skeleton } from "./ui/Skeleton";

export const UserCardSkeleton: React.FC = () => {
  return (
    <Card className="animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar skeleton */}
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              {/* Name skeleton */}
              <Skeleton className="h-5 w-32" />
              {/* ID skeleton */}
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="flex gap-2">
            {/* Action buttons skeleton */}
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Field skeletons */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-36" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-44" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface UserCardSkeletonGridProps {
  count?: number;
}

export const UserCardSkeletonGrid: React.FC<UserCardSkeletonGridProps> = ({
  count = 6,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <UserCardSkeleton key={index} />
      ))}
    </div>
  );
};
