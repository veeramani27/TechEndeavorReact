import type { FC } from 'react';

export const SkeletonText: FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-slate-200 animate-pulse rounded ${className}`}></div>
);

export const BlogCardSkeleton: FC = () => (
  <div className="bg-white p-3 sm:p-5 rounded-2xl border border-slate-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
    <div className="flex-grow w-full">
      <div className="h-8 sm:h-10 bg-slate-200 animate-pulse rounded-lg mb-3 w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-100 animate-pulse rounded w-full"></div>
        <div className="h-4 bg-slate-100 animate-pulse rounded w-5/6"></div>
      </div>
    </div>
    <div className="h-12 w-40 bg-slate-200 animate-pulse rounded-xl flex-shrink-0"></div>
    
    {/* Wave animation overlay */}
    <div className="absolute inset-0 skeleton-wave"></div>
  </div>
);

export const BlogPostSkeleton: FC = () => (
  <div className="max-w-4xl mx-auto py-10 px-6 sm:px-8 relative overflow-hidden">
    <div className="h-8 w-32 bg-slate-100 animate-pulse rounded-lg mb-8"></div>
    <div className="mb-12">
      <div className="h-16 sm:h-24 bg-slate-200 animate-pulse rounded-xl mb-8 w-full"></div>
      <div className="h-6 w-48 bg-slate-100 animate-pulse rounded-lg mb-6"></div>
      <div className="flex items-center gap-4 py-6 border-y border-slate-200">
        <div className="w-12 h-12 bg-slate-100 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-3 w-20 bg-slate-100 animate-pulse rounded"></div>
          <div className="h-4 w-32 bg-slate-200 animate-pulse rounded"></div>
        </div>
      </div>
    </div>
    <div className="space-y-4">
      <div className="h-4 bg-slate-100 animate-pulse rounded w-full"></div>
      <div className="h-4 bg-slate-100 animate-pulse rounded w-full"></div>
      <div className="h-4 bg-slate-100 animate-pulse rounded w-3/4"></div>
      <div className="h-4 bg-slate-100 animate-pulse rounded w-full"></div>
      <div className="h-4 bg-slate-100 animate-pulse rounded w-5/6"></div>
    </div>
    <div className="absolute inset-0 skeleton-wave"></div>
  </div>
);
