
"use client";

import { useState } from "react";
import Link from "next/link";
import { logActivity } from "../../lib/activity-logs";

const questions = [
  {
    question: "Do you use strong and unique passwords?",
    options: [
      { label: "Yes, for every account", risk: 0 },
      { label: "For some accounts", risk: 1 },
      { label: "No, I reuse simple passwords", risk: 2 },
    ],
  },
  {
    question: "Is Two-Factor Authentication (2FA) enabled?",
    options: [
      { label: "Yes, on important accounts", risk: 0 },
      { label: "On a few accounts", risk: 1 },
      { label: "No", risk: 2 },
    ],
  },
  {
    question: "Do you keep your software and operating system updated?",
    options: [
      { label: "Yes, regularly", risk: 0 },
      { label: "Sometimes", risk: 1 },
      { label: "Rarely or never", risk: 2 },
    ],
  },
  {
    question: "Do you back up your important files?",
    options: [
      { label: "Yes, regularly", risk: 0 },
      { label: "Sometimes", risk: 1 },
      { label: "No backups", risk: 2 },
    ],
  },
  {
    question: "How do you handle suspicious emails and links?",
    options: [
      { label: "I verify them before clicking", risk: 0 },
      { label: "I am not always sure", risk: 1 },
      { label: "I sometimes click without checking", risk: 2 },
    ],
  },
  {
    question: "Do you use antivirus or built-in device protection?",
    options: [
      { label: "Yes, and it is up to date", risk: 0 },
      { label: "I am not sure if it is up to date", risk: 1 },
      { label: "No protection is enabled", risk: 2 },
    ],
  },
  {
    question: "Is your Wi-Fi router protected with a strong password?",
    options: [
      { label: "Yes, with a strong password", risk: 0 },
      { label: "I use the default or a weak password", risk: 1 },
      { label: "My Wi-Fi has no password", risk: 2 },
    ],
  },
  {
    question: "How do you use public Wi-Fi?",
    options: [
      { label: "I avoid sensitive activities on public Wi-Fi", risk: 0 },
      { label: "I sometimes access sensitive accounts", risk: 1 },
      { label: "I access sensitive accounts without precautions", risk: 2 },
    ],
  },
  {
    question: "Do you review app permissions before allowing access?",
    options: [
      { label: "Yes, I check permissions carefully", risk: 0 },
      { label: "Sometimes", risk: 1 },
      { label: "I allow permissions without checking", risk: 2 },
    ],
  },
  {
    question: "Do you lock your phone and computer when not in use?",
    options: [
      { label: "Yes, with a PIN, password, or biometrics", risk: 0 },
      { label: "Only sometimes", risk: 1 },
      { label: "No screen lock is enabled", risk: 2 },
    ],
  },
  {
    question: "Where do you download apps and software?",
    options: [
      { label: "Official websites or trusted app stores", risk: 0 },
      { label: "From sources I do not always verify", risk: 1 },
      { label: "From unknown or suspicious websites", risk: 2 },
    ],
  },
  {
    question: "Do you review login activity on important accounts?",
    options: [
      { label: "Yes, regularly", risk: 0 },
      { label: "Occasionally", risk: 1 },
      { label: "Never", risk: 2 },
    ],
  },
  {
    question: "Do you share your passwords with other people?",
    options: [
      { label: "No, I keep them private", risk: 0 },
      { label: "Only in certain situations", risk: 1 },
      { label: "Yes, frequently", risk: 2 },
    ],
  },
  {
    question: "Do you sign out of accounts on shared devices?",
    options: [
      { label: "Always", risk: 0 },
      { label: "Sometimes", risk: 1 },
      { label: "I usually stay signed in", risk: 2 },
    ],
  },
  {
    question: "Would you know what to do if an account were compromised?",
    options: [
      { label: "Yes, I know how to secure and recover it", risk: 0 },
      { label: "I know a few basic steps", risk: 1 },
      { label: "No, I would not know what to do", risk: 2 },
    ],
  },
];

const recommendations = [
  "Use a different, strong password for every account. A password manager can help.",
  "Enable two-factor authentication on important accounts.",
  "Install operating system, browser, and application updates regularly.",
  "Keep backups of important files in a separate, safe location.",
  "Check email addresses, links, and attachments before interacting with them.",
  "Keep built-in security protections enabled and updated.",
  "Change default router credentials and use modern Wi-Fi security.",
  "Avoid accessing sensitive accounts on public Wi-Fi unless you have suitable protection.",
  "Review app permissions and remove access that is not needed.",
  "Use a screen lock and set your devices to lock automatically.",
  "Download software only from official or trusted sources.",
  "Review account login history and investigate unfamiliar activity.",
  "Never share passwords through messages or insecure channels.",
  "Sign out of accounts when using shared or public devices.",
  "If an account is compromised, change its password, secure recovery methods, enable 2FA, and contact the provider if necessary.",
];

export default function RiskAssessmentPage() {
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<{
    score: number;
    level: string;
    message: string;
  } | null>(null);

  const answeredCount = questions.filter(
    (_, index) => answers[index] !== undefined
  ).length;

  const maxScore = questions.length * 2;

  const handleSubmit = () => {
    const allAnswered = questions.every(
      (_, index) => answers[index] !== undefined
    );

    if (!allAnswered) {
      alert("Please answer all 15 questions before calculating your score.");
      return;
    }

    const score = questions.reduce((total, question, index) => {
      const selectedOption = question.options[answers[index]];
      return total + (selectedOption?.risk ?? 0);
    }, 0);

    let level: string;
    let message: string;
    let status: "Success" | "Info" | "Warning";

    if (score <= 10) {
      level = "Low Risk";
      message =
        "Your reported security habits are generally good. Keep following safe practices and review them regularly.";
      status = "Success";
    } else if (score <= 20) {
      level = "Medium Risk";
      message =
        "Some of your security habits may need improvement. Focus on the areas where you selected higher-risk answers.";
      status = "Info";
    } else {
      level = "High Risk";
      message =
        "Your answers indicate several areas of potential concern. Prioritize improving your security practices.";
      status = "Warning";
    }

    setResult({ score, level, message });

    // Save the completed assessment in Activity Logs.
    logActivity(
      "Risk Assessment",
      `Cybersecurity risk assessment completed. Result: ${level}. Score: ${score}/${maxScore}.`,
      status
    );
  };

  const resetAssessment = () => {
    setAnswers([]);
    setResult(null);
  };

  const riskColor =
    result?.level === "Low Risk"
      ? "text-green-400"
      : result?.level === "Medium Risk"
      ? "text-amber-400"
      : "text-red-400";

  const progressColor =
    result?.level === "Low Risk"
      ? "bg-green-400"
      : result?.level === "Medium Risk"
      ? "bg-amber-400"
      : "bg-red-400";

  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-cyan-400 transition hover:text-cyan-300"
        >
          ← Back to Dashboard
        </Link>

        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            SecureSphere / Security Tools
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Cybersecurity Risk Assessment
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-slate-400">
            Answer 15 questions about your cybersecurity habits to estimate
            your risk level and identify areas for improvement.
          </p>
        </header>

        {!result ? (
          <section className="space-y-5">
            <div className="rounded-2xl border border-slate-700 bg-[#0d1b2a] p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-300">
                  Assessment Progress
                </span>
                <span className="text-sm font-semibold text-cyan-400">
                  {answeredCount} / {questions.length} answered
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                <div
                  className="h-full rounded-full bg-cyan-400 transition-all"
                  style={{
                    width: `${(answeredCount / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {questions.map((item, index) => (
              <div
                key={item.question}
                className="rounded-2xl border border-slate-700 bg-[#0d1b2a] p-5 sm:p-6"
              >
                <h2 className="mb-4 font-semibold leading-6">
                  <span className="mr-2 text-cyan-400">
                    {String(index + 1).padStart(2, "0")}.
                  </span>
                  {item.question}
                </h2>

                <div className="space-y-3">
                  {item.options.map((option, optionIndex) => (
                    <label
                      key={option.label}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                        answers[index] === optionIndex
                          ? "border-cyan-400 bg-cyan-400/10"
                          : "border-slate-700 bg-[#091522] hover:border-slate-500"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        checked={answers[index] === optionIndex}
                        onChange={() => {
                          setAnswers((previous) => {
                            const updated = [...previous];
                            updated[index] = optionIndex;
                            return updated;
                          });
                        }}
                        className="accent-cyan-400"
                      />
                      <span className="text-sm leading-6 text-slate-200">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={handleSubmit}
              className="w-full rounded-xl bg-cyan-400 px-6 py-4 font-bold text-[#07111f] transition hover:bg-cyan-300"
            >
              Calculate My Risk Score →
            </button>

            <p className="text-center text-xs text-slate-500">
              Answer all 15 questions to calculate your score.
            </p>
          </section>
        ) : (
          <section className="rounded-2xl border border-slate-700 bg-[#0d1b2a] p-6 sm:p-8">
            <p className="text-sm uppercase tracking-widest text-slate-400">
              Your Assessment Result
            </p>

            <h2 className={`mt-3 text-3xl font-bold ${riskColor}`}>
              {result.level}
            </h2>

            <p className="mt-3 leading-7 text-slate-300">
              {result.message}
            </p>

            <div className="mt-6 rounded-xl border border-slate-700 bg-[#07111f] p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-slate-400">Risk Score</span>
                <span className="font-semibold text-white">
                  {result.score} / {maxScore}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-700">
                <div
                  className={`h-full rounded-full transition-all ${progressColor}`}
                  style={{
                    width: `${(result.score / maxScore) * 100}%`,
                  }}
                />
              </div>

              <div className="mt-3 flex justify-between text-xs text-slate-500">
                <span>0 — Lower risk</span>
                <span>{maxScore} — Higher risk</span>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-slate-700 bg-[#07111f] p-5">
              <h3 className="font-semibold text-white">
                Your Risk Level Guide
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li><span className="text-green-400">0–10:</span> Low Risk</li>
                <li><span className="text-amber-400">11–20:</span> Medium Risk</li>
                <li><span className="text-red-400">21–30:</span> High Risk</li>
              </ul>
            </div>

            <h3 className="mt-8 text-lg font-semibold">
              Recommended Security Actions
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Review these actions and prioritize the ones related to your
              higher-risk answers.
            </p>

            <ul className="mt-4 space-y-3">
              {recommendations.map((recommendation) => (
                <li
                  key={recommendation}
                  className="flex gap-3 text-sm leading-6 text-slate-300"
                >
                  <span className="text-cyan-400">✓</span>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={resetAssessment}
              className="mt-8 w-full rounded-xl border border-cyan-400 px-5 py-3 font-semibold text-cyan-400 transition hover:bg-cyan-400/10"
            >
              Retake Assessment
            </button>
          </section>
        )}

        <footer className="mt-8 text-center text-xs leading-5 text-slate-500">
          This tool provides an educational estimate based on your answers. It
          is not a professional security audit and does not scan your device.
        </footer>
      </div>
    </main>
  );
}
