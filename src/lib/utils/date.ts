export function formatDisplayDate(dateString: string | null) {
  if (!dateString) {
    return "未设置日期";
  }

  const date = new Date(dateString);

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
