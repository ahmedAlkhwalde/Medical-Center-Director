const pad = (value) => String(value).padStart(2, "0");

const parseDateValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  const normalizedText = String(value).trim();

  const isoMatch = normalizedText.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const parsedDate = new Date(
      Number(isoMatch[1]),
      Number(isoMatch[2]) - 1,
      Number(isoMatch[3]),
    );
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  const slashMatch = normalizedText.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (slashMatch) {
    const parsedDate = new Date(
      Number(slashMatch[3]),
      Number(slashMatch[2]) - 1,
      Number(slashMatch[1]),
    );
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  const parsedByNativeDate = new Date(normalizedText);
  if (!Number.isNaN(parsedByNativeDate.getTime())) {
    return parsedByNativeDate;
  }

  return null;
};

export const formatDateLabel = (value) => {
  const parsedDate = parseDateValue(value);
  if (!parsedDate) return "غير محدد";

  return `${pad(parsedDate.getDate())}/${pad(parsedDate.getMonth() + 1)}/${parsedDate.getFullYear()}`;
};

export const formatWorkDuration = (joinedAt) => {
  if (!joinedAt) return "غير محددة";

  const start = parseDateValue(joinedAt);
  if (!start) return joinedAt;

  const now = new Date();
  let months = (now.getFullYear() - start.getFullYear()) * 12;
  months += now.getMonth() - start.getMonth();
  if (now.getDate() < start.getDate()) {
    months -= 1;
  }

  if (months < 0) months = 0;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0 && remainingMonths === 0) return "أقل من شهر";
  if (years === 0) return `${remainingMonths} شهر`;
  if (remainingMonths === 0) return `${years} سنة`;
  return `${years} سنة و${remainingMonths} شهر`;
};

export const formatRemainingContractLabel = (contractEndDate) => {
  if (!contractEndDate) return "غير محددة";

  const endDate = parseDateValue(contractEndDate);
  if (!endDate) return contractEndDate;

  const now = new Date();
  const diffMs = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "منتهي";
  if (diffDays === 0) return "ينتهي اليوم";

  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);
  const days = diffDays % 30;

  const parts = [];
  if (years > 0) parts.push(`${years} سنة`);
  if (months > 0) parts.push(`${months} شهر`);
  if (days > 0 && parts.length < 2) parts.push(`${days} يوم`);

  return parts.join(" و ");
};
