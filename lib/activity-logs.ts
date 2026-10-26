
export type ActivityLog = {
  id: string;
  action: string;
  description: string;
  status: "Success" | "Info" | "Warning";
  timestamp: string;
};

const STORAGE_KEY = "securesphere_activity_logs";
const LOGS_UPDATED_EVENT = "securesphere_logs_updated";
const MAX_LOGS = 200;

export function getActivityLogs(): ActivityLog[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is ActivityLog =>
        item !== null &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.action === "string" &&
        typeof item.description === "string" &&
        typeof item.timestamp === "string" &&
        ["Success", "Info", "Warning"].includes(item.status)
    );
  } catch {
    return [];
  }
}

export function logActivity(
  action: string,
  description: string,
  status: ActivityLog["status"] = "Success"
): void {
  if (typeof window === "undefined") return;

  try {
    const existingLogs = getActivityLogs();

    const newLog: ActivityLog = {
      id: crypto.randomUUID(),
      action,
      description,
      status,
      timestamp: new Date().toISOString(),
    };

    const updatedLogs = [newLog, ...existingLogs].slice(0, MAX_LOGS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));

    window.dispatchEvent(new Event(LOGS_UPDATED_EVENT));
  } catch (error) {
    console.error("Unable to save activity log:", error);
  }
}

export function clearActivityLogs(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(LOGS_UPDATED_EVENT));
  } catch (error) {
    console.error("Unable to clear activity logs:", error);
  }
}

export { LOGS_UPDATED_EVENT };
