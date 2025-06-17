type DateFormatOptions = {
  includeYear?: boolean;
  includeTime?: boolean;
};

export function useFormatDate() {
  const formatDate = (
    date: Date | string | undefined,
    options: DateFormatOptions = { includeYear: true, includeTime: false }
  ) => {
    if (!date) return "Unknown";

    const dateObj = typeof date === "string" ? new Date(date) : date;

    try {
      const formatOptions: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
      };

      if (options.includeYear) {
        formatOptions.year = "numeric";
      }

      if (options.includeTime) {
        formatOptions.hour = "2-digit";
        formatOptions.minute = "2-digit";
      }

      return dateObj.toLocaleDateString("en-US", formatOptions);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  return { formatDate };
}
