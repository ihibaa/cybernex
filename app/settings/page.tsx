
"use client";

import { useEffect, useState } from "react";
import {
  getActivityLogs,
  clearActivityLogs,
  logActivity,
  LOGS_UPDATED_EVENT,
} from "../../lib/activity-logs";

const WORKSPACE_KEY = "securesphere_workspace_name";
const THEME_KEY = "securesphere_theme";

type Theme = "dark" | "light";

export default function SettingsPage() {
  const [workspaceName, setWorkspaceName] = useState(
    "SecureSphere Workspace"
  );
  const [savedName, setSavedName] = useState(
    "SecureSphere Workspace"
  );
  const [logCount, setLogCount] = useState(0);
  const [theme, setTheme] = useState<Theme>("dark");
  const [showClearConfirmation, setShowClearConfirmation] =
    useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error"
  >("success");

  useEffect(() => {
    try {
      const storedName = localStorage.getItem(WORKSPACE_KEY);

      if (storedName) {
        setWorkspaceName(storedName);
        setSavedName(storedName);
      }

      const savedTheme = localStorage.getItem(THEME_KEY);

      const initialTheme: Theme =
        savedTheme === "light" ? "light" : "dark";

      setTheme(initialTheme);
      document.documentElement.dataset.theme = initialTheme;
    } catch {
      document.documentElement.dataset.theme = "dark";
    }

    const updateLogCount = () => {
      setLogCount(getActivityLogs().length);
    };

    updateLogCount();

    window.addEventListener(LOGS_UPDATED_EVENT, updateLogCount);
    window.addEventListener("storage", updateLogCount);

    return () => {
      window.removeEventListener(
        LOGS_UPDATED_EVENT,
        updateLogCount
      );
      window.removeEventListener("storage", updateLogCount);
    };
  }, []);

  function changeTheme(newTheme: Theme) {
    try {
      localStorage.setItem(THEME_KEY, newTheme);
      document.documentElement.dataset.theme = newTheme;
      setTheme(newTheme);

      logActivity(
        "Settings",
        `Appearance changed to ${newTheme} mode.`,
        "Success"
      );

      setMessageType("success");
      setMessage(
        `${newTheme === "dark" ? "Dark" : "Light"} mode enabled.`
      );
    } catch {
      setMessageType("error");
      setMessage("Unable to save the theme preference.");
    }
  }

  function saveWorkspaceName() {
    const trimmedName = workspaceName.trim();

    if (!trimmedName) {
      setMessageType("error");
      setMessage("Workspace name cannot be empty.");
      return;
    }

    try {
      localStorage.setItem(WORKSPACE_KEY, trimmedName);
      setWorkspaceName(trimmedName);
      setSavedName(trimmedName);

      logActivity(
        "Settings",
        `Workspace name updated to "${trimmedName}".`,
        "Success"
      );

      setMessageType("success");
      setMessage("Workspace settings saved successfully.");
    } catch {
      setMessageType("error");
      setMessage("Unable to save settings in browser storage.");
    }
  }

  function exportActivityLogs() {
    try {
      const logs = getActivityLogs();
      const fileContent = JSON.stringify(logs, null, 2);
      const blob = new Blob([fileContent], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "securesphere-activity-logs.json";
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);

      setMessageType("success");
      setMessage("Activity logs exported successfully.");
    } catch {
      setMessageType("error");
      setMessage("Unable to export activity logs.");
    }
  }

  function confirmClearLogs() {
    try {
      clearActivityLogs();
      setShowClearConfirmation(false);
      setLogCount(0);
      setMessageType("success");
      setMessage("All activity logs have been cleared.");
    } catch {
      setMessageType("error");
      setMessage("Unable to clear activity logs.");
    }
  }

  return (
    <main className="min-h-screen bg-[#070b14] text-slate-100">
      <header className="border-b border-slate-800/80 px-5 py-5 md:px-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-2xl">
              🛡️
            </div>

            <div>
              <h1 className="text-xl font-bold">
                Secure<span className="text-cyan-400">Sphere</span>
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Cybersecurity Platform
              </p>
            </div>
          </a>

          <a
            href="/"
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-300"
          >
            ← Dashboard
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8 md:px-10 md:py-12">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400">
            WORKSPACE CONFIGURATION
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Settings
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Manage your workspace preferences and activity data.
            Your settings are stored locally in this browser.
          </p>
        </div>

        {message && (
          <div
            role="status"
            className={`mt-6 rounded-xl border p-4 text-sm ${
              messageType === "success"
                ? "border-green-400/20 bg-green-400/10 text-green-300"
                : "border-red-400/20 bg-red-400/10 text-red-300"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p>{message}</p>

              <button
                type="button"
                onClick={() => setMessage("")}
                aria-label="Dismiss message"
                className="text-lg leading-none opacity-80 hover:opacity-100"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Appearance and Theme */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-[#0c1220] p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-2xl">
              {theme === "dark" ? "🌙" : "☀️"}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold">Appearance</h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Choose the appearance for your SecureSphere workspace.
                Your selection is saved in this browser.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => changeTheme("dark")}
                  aria-pressed={theme === "dark"}
                  className={`rounded-xl border p-4 text-left transition ${
                    theme === "dark"
                      ? "border-cyan-400 bg-cyan-400/10"
                      : "border-slate-700 hover:border-cyan-400/50"
                  }`}
                >
                  <span className="text-2xl">🌙</span>

                  <span className="mt-3 block font-semibold">
                    Dark Mode
                  </span>

                  <span className="mt-1 block text-sm text-slate-400">
                    Original navy and cyan theme
                  </span>

                  {theme === "dark" && (
                    <span className="mt-3 block text-xs font-semibold text-cyan-300">
                      ✓ Currently active
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => changeTheme("light")}
                  aria-pressed={theme === "light"}
                  className={`rounded-xl border p-4 text-left transition ${
                    theme === "light"
                      ? "border-cyan-400 bg-cyan-400/10"
                      : "border-slate-700 hover:border-cyan-400/50"
                  }`}
                >
                  <span className="text-2xl">☀️</span>

                  <span className="mt-3 block font-semibold">
                    Light Mode
                  </span>

                  <span className="mt-1 block text-sm text-slate-400">
                    Bright surfaces with cyan accents
                  </span>

                  {theme === "light" && (
                    <span className="mt-3 block text-xs font-semibold text-cyan-300">
                      ✓ Currently active
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Workspace Preferences */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-[#0c1220] p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-2xl">
              ⚙️
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                Workspace Preferences
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Customize the name used for your SecureSphere workspace.
              </p>
            </div>
          </div>

          <form
            className="mt-7"
            onSubmit={(event) => {
              event.preventDefault();
              saveWorkspaceName();
            }}
          >
            <label
              htmlFor="workspaceName"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Workspace Name
            </label>

            <input
              id="workspaceName"
              type="text"
              maxLength={60}
              value={workspaceName}
              onChange={(event) =>
                setWorkspaceName(event.target.value)
              }
              placeholder="Enter workspace name"
              className="w-full rounded-xl border border-slate-700 bg-[#070b14] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />

            <p className="mt-2 text-xs text-slate-500">
              This preference is saved in your current browser.
            </p>

            <button
              type="submit"
              disabled={
                !workspaceName.trim() ||
                workspaceName.trim() === savedName
              }
              className="mt-5 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Save Changes
            </button>
          </form>
        </section>

        {/* Activity Logs */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-[#0c1220] p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-400/10 text-2xl">
              📋
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold">Activity Logs</h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Review the number of recorded activities, export a backup,
                or clear the logs stored in this browser.
              </p>

              <div className="mt-5 rounded-xl border border-slate-800 bg-[#070b14] p-4">
                <p className="text-sm text-slate-400">
                  Stored log entries
                </p>

                <p className="mt-2 text-3xl font-bold text-cyan-300">
                  {logCount}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={exportActivityLogs}
                  className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
                >
                  ↓ Export Logs (JSON)
                </button>

                <button
                  type="button"
                  onClick={() => setShowClearConfirmation(true)}
                  disabled={logCount === 0}
                  className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Clear All Logs
                </button>

                <a
                  href="/activity-logs"
                  className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
                >
                  View Activity Logs →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Security and Storage */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-[#0c1220] p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-400/10 text-2xl">
              🔒
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold">
                Security &amp; Storage
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Current application storage and environment information.
              </p>

              <div className="mt-5 divide-y divide-slate-800">
                <InfoRow label="Application" value="SecureSphere v1.0" />
                <InfoRow label="Environment" value="Development Mode" />
                <InfoRow label="Storage" value="Browser Local Storage" />
                <InfoRow label="Authentication" value="Not connected" />
                <InfoRow label="Remote Monitoring" value="Not connected" />
              </div>

              <p className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-xs leading-6 text-amber-200/80">
                Activity logs and workspace preferences are stored locally
                in this browser. They are not synced to a server and may
                not appear on another device or browser. This educational
                project is not a substitute for production security monitoring.
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-10 border-t border-slate-800 pt-6 text-xs text-slate-500">
          SecureSphere © 2026 · Educational Cybersecurity Project
        </footer>
      </div>

      {/* Clear Logs Confirmation */}
      {showClearConfirmation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-5"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowClearConfirmation(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="clearLogsTitle"
            className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#0c1220] p-6 shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-400/10 text-2xl">
              ⚠️
            </div>

            <h3 id="clearLogsTitle" className="mt-5 text-xl font-bold">
              Clear all activity logs?
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              This will remove all {logCount} log entries stored by
              SecureSphere in this browser. Export a backup first if you
              want to keep them. This action cannot be undone from this page.
            </p>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowClearConfirmation(false)}
                className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmClearLogs}
                className="rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400"
              >
                Yes, Clear Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-4">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-medium text-slate-200">{value}</span>
    </div>
  );
}
