export const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export const formatDate = (date, month = "short") =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month,
    year: "numeric",
  });
