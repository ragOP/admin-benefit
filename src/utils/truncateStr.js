export const truncateStr = (str = "", length = 20, end = "...") => {
  if (!str) return "";

  if (str.length > length) {
    return str.substring(0, length) + end;
  }
  return str;
};
