import React from "react";

export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl border theme-border theme-surface p-4 shadow-sm sm:p-5 animate-pulse space-y-3"
        >
          <div className="h-3 w-1/3 rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-6 w-1/2 rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-3 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
      ))}
    </div>
  );
};

/* 📇 2. هيكل تحميل كروت الأطباء */
export const DoctorCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl border theme-border theme-surface p-5 shadow-md animate-pulse space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-3 w-1/3 rounded bg-zinc-200 dark:bg-zinc-700" />
            </div>
          </div>
          <div className="h-6 w-1/4 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          <div className="space-y-2 pt-2">
            <div className="h-8 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-8 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
          </div>
        </div>
      ))}
    </div>
  );
};