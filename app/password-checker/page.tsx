
"use client";

import { useState } from "react";
import { logActivity } from "../../lib/activity-logs";

export default function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const checks = [
    {
      label: "At least 8 characters",
      passed: password.length >= 8,
    },
    {
      label: "Contains uppercase letter (A-Z)",
      passed: /[A-Z]/.test(password),
    },
    {
      label: "Contains lowercase letter (a-z)",
      passed: /[a-z]/.test(password),
    },
    {
      label: "Contains a number (0-9)",
      passed: /[0-9]/.test(password),
    },
    {
      label: "Contains a special character (!@#$...)",
      passed: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const score = checks.filter((check) => check.passed).length;

  let strength = "Not checked";
  let strengthColor = "text-slate-400";
  let barColor = "bg-slate-700";
  let barWidth = "0%";

  if (password.length > 0) {
    if (score <= 2) {
      strength = "Weak";
      strengthColor = "text-red-400";
      barColor = "bg-red-500";
      barWidth = "25%";
    } else if (score <= 3) {
      strength = "Medium";
      strengthColor = "text-yellow-400";
      barColor = "bg-yellow-400";
      barWidth = "50%";
    } else if (score === 4) {
      strength = "Strong";
      strengthColor = "text-cyan-400";
      barColor = "bg-cyan-400";
      barWidth = "75%";
    } else {
      strength = "Very Strong";
      strengthColor = "text-green-400";
      barColor = "bg-green-500";
      barWidth = "100%";
    }
  }

  function handlePasswordCheck() {
    if (!password.trim()) return;

    logActivity(
      "Password Checker",
      `Password strength assessment completed. Result: ${strength}. Requirements met: ${score}/5.`,
      strength === "Weak" ? "Warning" : "Success"
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-slate-100 md:px-10">
      <div className="mx-auto max-w-3xl">
        <a
          href="/"
          className="text-sm text-cyan-400 hover:text-cyan-300"
        >
          ← Back to Dashboard
        </a>

        <header className="mt-8">
          <p className="text-sm font-semibold tracking-widest text-cyan-400">
            SECURITY TOOL · 01
          </p>

          <h1 className="mt-3 text-3xl font-bold md:text-4xl">
            Password Strength Checker
          </h1>

          <p className="mt-3 leading-7 text-slate-400">
            Check password requirements and learn how to improve your
            password security.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
          <label
            htmlFor="password"
            className="mb-3 block text-sm font-medium"
          >
            Enter a password to test
          </label>

          <div className="flex gap-2">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter a test password"
              autoComplete="off"
              className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="rounded-lg border border-slate-700 px-4 text-sm hover:bg-slate-800"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <p className="mt-3 text-xs leading-5 text-slate-500">
            Educational check only. Use a sample password, not your real
            account password.
          </p>

          <div className="mt-8">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">Password Strength</h2>

              <span className={`text-sm font-bold ${strengthColor}`}>
                {strength}
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                style={{ width: barWidth }}
              />
            </div>

            <p className="mt-3 text-sm text-slate-400">
              {password.length === 0
                ? "Enter a sample password to begin."
                : `${score} out of 5 basic requirements met.`}
            </p>
          </div>

          <div className="mt-8">
            <h2 className="font-semibold">Security Requirements</h2>

            <div className="mt-4 space-y-4">
              {checks.map((check) => (
                <div
                  key={check.label}
                  className="flex items-center gap-3 text-sm"
                >
                  <span
                    className={
                      check.passed
                        ? "flex h-6 w-6 items-center justify-center rounded-full bg-green-500/15 text-green-400"
                        : "flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-slate-500"
                    }
                  >
                    {check.passed ? "✓" : "–"}
                  </span>

                  <span
                    className={
                      check.passed ? "text-slate-200" : "text-slate-400"
                    }
                  >
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <h2 className="font-semibold text-cyan-300">
              Security Recommendations
            </h2>

            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-400">
              <li>• Use a long, unique password for every account.</li>
              <li>• Avoid names, birthdays and predictable patterns.</li>
              <li>• Consider a password manager and enable MFA.</li>
              <li>• Never share passwords or reuse compromised ones.</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => {
              handlePasswordCheck();
              setPassword("");
              setShowPassword(false);
            }}
            className="mt-6 rounded-lg border border-slate-700 px-5 py-3 text-sm font-medium transition hover:bg-slate-800"
          >
            Check & Clear Password
          </button>
        </section>

        <p className="mt-6 text-center text-xs text-slate-600">
          SecureSphere · Educational Cybersecurity Project
        </p>
      </div>
    </main>
  );
}
