const MiniBarList = ({ items = [] }) => {
  const maxVal = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span className="w-24 text-sm truncate theme-text">{item.label}</span>
          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(item.value / maxVal) * 100}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
          <span className="text-sm font-bold w-10 text-right">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

export default MiniBarList;