const Heatmap = ({ matrix }) => {
  const max = Math.max(...matrix.flat(), 1);
  const days = ["س", "ح", "ن", "ث", "ر", "خ"];
  const hours = ["8", "10", "12", "14", "16", "18", "20"];

  return (
    <div className="grid grid-cols-[auto_repeat(7,minmax(0,1fr))] gap-1.5 text-center text-xs">
      <span />
      {hours.map((hour) => (
        <span key={hour} className="pb-1 font-semibold theme-text-muted">
          {hour}
        </span>
      ))}
      {matrix.map((row, rowIndex) => (
        <div key={days[rowIndex]} className="contents">
          <span className="flex items-center justify-end pr-1 font-semibold theme-text-muted">
            {days[rowIndex]}
          </span>
          {row.map((value, colIndex) => {
            const intensity = value / max;
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="h-9 rounded-xl border border-white/30"
                style={{
                  backgroundColor: `rgba(10, 179, 186, ${0.1 + intensity * 0.8})`,
                }}
                title={`كثافة ${value}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Heatmap;
