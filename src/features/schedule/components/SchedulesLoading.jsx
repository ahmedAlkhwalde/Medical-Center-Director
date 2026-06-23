const SchedulesLoading = () => (
  <div className="space-y-6 animate-pulse">
    {[1, 2, 3].map((index) => (
      <div
        key={index}
        className="rounded-4xl border theme-border theme-surface-90 p-5 md:p-6 shadow-md space-y-5 text-right"
        dir="rtl"
      >
        {/* الهيكل العلوي (معلومات الطبيب التخيلية) */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b theme-border pb-4">
          <div className="space-y-2 w-full max-w-[280px]">
            <div className="h-5 bg-gray-300 dark:bg-zinc-700 rounded-2xl w-5/6"></div>
            <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded-xl w-3/5"></div>
          </div>
          <div className="h-7 bg-gray-200 dark:bg-zinc-800 rounded-xl w-24 self-start sm:self-center"></div>
        </div>

        {/* هيكل أيام الأسبوع السبعة */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <div
              key={day}
              className="rounded-3xl border theme-border p-3 text-center bg-gray-50/40 dark:bg-zinc-900/20 space-y-3"
            >
              <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded-lg w-1/2 mx-auto"></div>
              <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded-xl w-4/5 mx-auto"></div>
              <div className="h-2.5 bg-gray-200 dark:bg-zinc-800 rounded-md w-1/3 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default SchedulesLoading;
