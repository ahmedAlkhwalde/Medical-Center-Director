const salaryFormatter = new Intl.NumberFormat("ar-SY", {
  maximumFractionDigits: 0,
});

export const formatSalary = (value = 0) =>
  `${salaryFormatter.format(Number(value) || 0)} ل.س`;