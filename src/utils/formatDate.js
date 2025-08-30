import format from "date-fns/format";

export const formatDate = (date = new Date()) => {
  if (!date) return "";

  return format(date, "dd/MM/yyyy");
};
