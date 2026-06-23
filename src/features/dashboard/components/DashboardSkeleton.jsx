const DashboardSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-28 rounded-3xl border theme-border theme-surface p-4"
        >
          <div className="h-4 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="mt-3 h-6 w-1/2 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="mt-2 h-3 w-3/4 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <div className="rounded-3xl border theme-border theme-surface p-5 xl:col-span-7">
        <div className="h-6 w-1/3 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="mt-4 h-48 rounded-2xl bg-slate-200 dark:bg-slate-700" />
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl border theme-border theme-surface p-3"
            >
              <div className="h-4 w-1/2 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="mt-2 h-6 w-3/4 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>
          ))}
        </div>
      </div>
      <div className="xl:col-span-5 space-y-4">
        <div className="rounded-3xl border theme-border theme-surface p-5">
          <div className="h-6 w-1/2 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-2xl border theme-border theme-surface p-3"
              >
                <div className="flex justify-between">
                  <div className="h-4 w-1/3 rounded-full bg-slate-200 dark:bg-slate-700" />
                  <div className="h-4 w-1/4 rounded-full bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border theme-border theme-surface p-5">
          <div className="h-6 w-1/2 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="mt-4 flex justify-center">
            <div className="h-32 w-32 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    </div>

    <div className="rounded-3xl border theme-border theme-surface p-5">
      <div className="h-6 w-1/3 rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="mt-4 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-5 w-full rounded-full bg-slate-200 dark:bg-slate-700"
          />
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <div className="rounded-3xl border theme-border theme-surface p-5 xl:col-span-8">
        <div className="h-6 w-1/3 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div
                  key={j}
                  className="h-4 w-full rounded-full bg-slate-200 dark:bg-slate-700"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-3xl border theme-border theme-surface p-5 xl:col-span-4">
        <div className="h-6 w-1/2 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-12 rounded-2xl border theme-border theme-surface p-2"
            >
              <div className="h-4 w-3/4 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default DashboardSkeleton;