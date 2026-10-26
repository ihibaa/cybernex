
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type ActivityLog = {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  status: "Success" | "Warning" | "Info";
};

const ACTIVITY_LOGS_STORAGE_KEY = "cybernex_activity_logs";
const LOGS_UPDATED_EVENT = "cybernex:activity-logs-updated";

const getActivityLogs = (): ActivityLog[] => {
  try {
    const storedLogs = window.localStorage.getItem(ACTIVITY_LOGS_STORAGE_KEY);
    return storedLogs ? (JSON.parse(storedLogs) as ActivityLog[]) : [];
  } catch {
    return [];
  }
};

const clearActivityLogs = () => {
  window.localStorage.removeItem(ACTIVITY_LOGS_STORAGE_KEY);
  window.dispatchEvent(new Event(LOGS_UPDATED_EVENT));
};

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [ready, setReady] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const refreshLogs = useCallback(() => {
    setLogs(getActivityLogs());
  }, []);

  useEffect(() => {
    refreshLogs();
    setReady(true);

    window.addEventListener(LOGS_UPDATED_EVENT, refreshLogs);
    window.addEventListener("storage", refreshLogs);

    return () => {
      window.removeEventListener(LOGS_UPDATED_EVENT, refreshLogs);
      window.removeEventListener("storage", refreshLogs);
    };
  }, [refreshLogs]);

  const handleClear = () => {
    clearActivityLogs();
    setLogs([]);
    setShowConfirm(false);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) return "Unknown date";

    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const statusStyle = (status: ActivityLog["status"]) => {
    if (status === "Success") {
      return "border-green-500/30 bg-green-500/10 text-green-400";
    }

    if (status === "Warning") {
      return "border-amber-500/30 bg-amber-500/10 text-amber-400";
    }

    return "border-cyan-500/30 bg-cyan-500/10 text-cyan-400";
  };

  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-8 inline-flex text-sm text-cyan-400 transition hover:text-cyan-300"
        >
          ← Back to Dashboard
        </Link>

        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            SecureSphere / Workspace
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Activity Logs
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-slate-400">
            Review your recent security tool activities, their timestamps,
            and their recorded statuses.
          </p>
        </header>

        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-700 bg-[#0d1b2a] p-5">
            <p className="text-sm text-slate-400">Total Activities</p>
            <p className="mt-2 text-3xl font-bold text-cyan-400">
              {ready ? logs.length : "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-[#0d1b2a] p-5">
            <p className="text-sm text-slate-400">Successful Activities</p>
            <p className="mt-2 text-3xl font-bold text-green-400">
              {ready
                ? logs.filter((log) => log.status === "Success").length
                : "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-[#0d1b2a] p-5">
            <p className="text-sm text-slate-400">Warnings</p>
            <p className="mt-2 text-3xl font-bold text-amber-400">
              {ready
                ? logs.filter((log) => log.status === "Warning").length
                : "—"}
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-700 bg-[#0d1b2a]">
          <div className="flex flex-col gap-4 border-b border-slate-700 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <p className="mt-1 text-sm text-slate-400">
                Newest activities appear first.
              </p>
            </div>

            <button
              onClick={() => setShowConfirm(true)}
              disabled={!ready || logs.length === 0}
              className="rounded-xl border border-red-500/40 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear Logs
            </button>
          </div>

          {!ready ? (
            <div className="p-10 text-center text-slate-400">
              Loading activity logs...
            </div>
          ) : logs.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-[#07111f] text-2xl">
                <span aria-hidden="true">↻</span>
              </div>

              <h3 className="mt-4 text-lg font-semibold">
                No activities yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                Use a SecureSphere security tool to start building your
                activity history.
              </p>

              <Link
                href="/"
                className="mt-5 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-[#07111f] transition hover:bg-cyan-300"
              >
                Explore Security Tools
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {logs.map((log) => (
                <article
                  key={log.id}
                  className="flex flex-col gap-3 p-5 transition hover:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white">
                      {log.action}
                    </h3>

                    <p className="mt-1 break-words text-sm leading-6 text-slate-400">
                      {log.description}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      {formatDate(log.timestamp)}
                    </p>
                  </div>

                  <span
                    className={`w-fit shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle(log.status)}`}
                  >
                    {log.status}
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="mt-5 rounded-xl border border-slate-700 bg-[#0d1b2a] p-4 text-sm leading-6 text-slate-400">
          <span className="font-semibold text-cyan-400">Privacy note:</span>{" "}
          These logs are stored locally in this browser. They are not
          uploaded to a server and may disappear if browser storage is cleared.
        </div>

        {showConfirm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-dialog-title"
          >
            <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#0d1b2a] p-6 shadow-2xl">
              <h2 id="clear-dialog-title" className="text-xl font-bold">
                Clear all activity logs?
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                This will permanently remove the saved activity history from
                this browser.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 rounded-xl border border-slate-600 px-4 py-3 font-semibold text-slate-200 hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  onClick={handleClear}
                  className="flex-1 rounded-xl bg-red-500 px-4 py-3 font-semibold text-white hover:bg-red-400"
                >
                  Clear Logs
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
