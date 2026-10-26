
"use client";

import { useEffect, useState } from "react";
import { getActivityLogs, LOGS_UPDATED_EVENT } from "../lib/activity-logs";

const tools = [
  {
    number: "01",
    name: "Password Checker",
    description:
      "Check password strength and learn safer password practices.",
    status: "Available",
    href: "/password-checker",
    icon: "🔐",
    category: "IDENTITY SECURITY",
  },
  {
    number: "02",
    name: "File Integrity",
    description:
      "Calculate SHA-256 hashes and compare files for content changes.",
    status: "Available",
    href: "/file-integrity",
    icon: "🛡️",
    category: "DATA PROTECTION",
  },
  {
    number: "03",
    name: "Security Testing",
    description:
      "Inspect accessible HTTP security headers and learn what they do.",
    status: "Available",
    href: "/security-testing",
    icon: "🌐",
    category: "WEB SECURITY",
  },
  {
    number: "04",
    name: "Risk Assessment",
    description:
      "Evaluate cybersecurity habits, calculate risk scores, and get security recommendations.",
    status: "Available",
    href: "/risk-assessment",
    icon: "📊",
    category: "RISK MANAGEMENT",
  },
];

export default function Home() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activityCount, setActivityCount] = useState(0);
  const [warningCount, setWarningCount] = useState(0);
  const [assessmentCount, setAssessmentCount] = useState(0);

  useEffect(() => {
    const updateStats = () => {
      const logs = getActivityLogs();

      setActivityCount(logs.length);
      setWarningCount(
        logs.filter((log) => log.status === "Warning").length
      );
      setAssessmentCount(
        logs.filter((log) => log.action === "Risk Assessment").length
      );
    };

    updateStats();

    window.addEventListener(LOGS_UPDATED_EVENT, updateStats);
    window.addEventListener("storage", updateStats);

    return () => {
      window.removeEventListener(LOGS_UPDATED_EVENT, updateStats);
      window.removeEventListener("storage", updateStats);
    };
  }, []);

  function handleNavigation(name: string) {
    setActiveSection(name);
    setMobileMenuOpen(false);

    if (name === "Risk Assessment") {
      window.location.href = "/risk-assessment";
      return;
    }

    if (name === "Activity Logs") {
      window.location.href = "/activity-logs";
      return;
    }

    if (name === "Settings") {
      window.location.href = "/settings";
      return;
    }

    const sectionIds: Record<string, string> = {
      Dashboard: "top",
      "Security Tools": "security-tools",
    };

    const id = sectionIds[name];

    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (id) {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }

  const navigation = [
    { name: "Dashboard", icon: "⌂" },
    { name: "Security Tools", icon: "◈" },
    { name: "Risk Assessment", icon: "◎" },
    { name: "Activity Logs", icon: "≡" },
    { name: "Settings", icon: "⚙" },
  ];

  return (
    <main id="top" className="min-h-screen bg-[#070b14] text-slate-100">
      <div className="flex min-h-screen">
        {mobileMenuOpen && (
          <button
            aria-label="Close menu overlay"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
          />
        )}

        <aside
          className={`${
            mobileMenuOpen ? "block" : "hidden"
          } fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-800 bg-[#0b1120] p-6 md:sticky md:top-0 md:block md:h-screen md:w-64 md:shrink-0`}
        >
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-2xl">
              🛡️
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Secure<span className="text-cyan-400">Sphere</span>
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Cybersecurity Platform
              </p>
            </div>
          </a>

          <div className="mt-10">
            <p className="mb-3 px-3 text-xs font-semibold tracking-[0.18em] text-slate-500">
              WORKSPACE
            </p>

            <nav className="space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.name)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                    activeSection === item.name
                      ? "border border-cyan-400/15 bg-cyan-400/10 font-medium text-cyan-300"
                      : "text-slate-400 hover:bg-slate-800/70 hover:text-white"
                  }`}
                >
                  <span className="w-5 text-center text-lg">
                    {item.icon}
                  </span>
                  {item.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              <p className="text-sm font-medium">Workspace Status</p>
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-400">
              SecureSphere educational environment.
            </p>

            <p className="mt-3 text-xs text-green-400">
              Development mode
            </p>
          </div>

          <div className="mt-10 border-t border-slate-800 pt-5">
            <p className="text-xs text-slate-500">SecureSphere v1.0</p>
            <p className="mt-1 text-xs text-slate-600">
              Educational Project
            </p>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex items-center justify-between gap-4 border-b border-slate-800/80 px-5 py-5 md:px-10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-lg border border-slate-700 px-3 py-2 text-slate-300 md:hidden"
                aria-label="Open menu"
              >
                ☰
              </button>

              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400">
                  SECURITY WORKSPACE
                </p>
                <h2 className="mt-1 text-xl font-bold md:text-2xl">
                  {activeSection}
                </h2>
              </div>
            </div>

            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300 md:px-4 md:text-sm">
              Student Project
            </span>
          </header>

          <div className="p-5 md:p-10">
            <section className="relative overflow-hidden rounded-3xl border border-cyan-400/15 bg-gradient-to-br from-cyan-950/50 via-slate-900 to-[#0b1120] p-6 md:p-9">
              <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

              <div className="relative max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  YOUR SECURITY COMMAND CENTER
                </span>

                <h3 className="mt-5 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
                  Security starts
                  <br />
                  with <span className="text-cyan-400">awareness.</span>
                </h3>

                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 md:text-base">
                  Explore cybersecurity tools, check password strength,
                  compare file integrity, and learn about web security
                  in one educational workspace.
                </p>

                <button
                  onClick={() => handleNavigation("Security Tools")}
                  className="mt-6 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Explore Security Tools →
                </button>
              </div>

              <div className="pointer-events-none absolute bottom-7 right-8 hidden text-8xl opacity-10 lg:block">
                ◈
              </div>
            </section>

            <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon="◈"
                title="Security Tools"
                value={tools.filter((tool) => tool.status === "Available").length}
                note="Available modules"
              />

              <StatCard
                icon="≡"
                title="Total Activities"
                value={activityCount}
                note="Recorded tool activities"
              />

              <StatCard
                icon="⚑"
                title="Warnings"
                value={warningCount}
                note="Logged warning events"
              />

              <StatCard
                icon="◎"
                title="Risk Assessments"
                value={assessmentCount}
                note="Completed assessments logged"
              />
            </section>

            <section className="mt-10" id="security-tools">
              <p className="text-xs font-semibold tracking-[0.18em] text-cyan-400">
                YOUR TOOLKIT
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                Security Modules
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Select a module to open its workspace.
              </p>

              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {tools.map((tool) => {
                  const available = tool.status === "Available";

                  return (
                    <article
                      key={tool.number}
                      className="group rounded-2xl border border-slate-800 bg-[#0c1220] p-6 transition duration-200 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-slate-900/80"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700/70 bg-slate-800/70 text-2xl">
                          {tool.icon}
                        </div>

                        <span
                          className={`rounded-full px-3 py-1.5 text-xs ${
                            available
                              ? "border border-green-400/15 bg-green-400/10 text-green-300"
                              : "border border-slate-700 bg-slate-800/60 text-slate-400"
                          }`}
                        >
                          {tool.status}
                        </span>
                      </div>

                      <p className="mt-5 text-xs font-medium tracking-[0.15em] text-cyan-400">
                        MODULE {tool.number} · {tool.category}
                      </p>

                      <h4 className="mt-2 text-xl font-semibold">
                        {tool.name}
                      </h4>

                      <p className="mt-3 min-h-14 text-sm leading-6 text-slate-400">
                        {tool.description}
                      </p>

                      <div className="mt-6 border-t border-slate-800 pt-5">
                        {available ? (
                          <a
                            href={tool.href}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
                          >
                            Open Tool <span>→</span>
                          </a>
                        ) : (
                          <span className="text-sm text-slate-500">
                            Coming in a future update
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section
              id="risk-assessment"
              className="mt-10 rounded-2xl border border-slate-800 bg-[#0c1220] p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-xl">
                  📋
                </div>

                <div>
                  <h3 className="text-lg font-semibold">
                    Security Learning Roadmap
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Explore cryptography, web security, risk management,
                    and security models as you develop SecureSphere.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {[
                      "Cryptography",
                      "Web Security",
                      "Risk Management",
                      "Security Models",
                    ].map((topic) => (
                      <span
                        key={topic}
                        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section
              id="coming-soon"
              className="mt-6 rounded-2xl border border-dashed border-slate-800 p-5"
            >
              <p className="text-sm font-semibold text-slate-300">
                More workspace features
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Manage your workspace preferences and activity data from
                the Settings page. Real monitoring and incident collection
                are not connected yet.
              </p>

              <div className="mt-4 flex flex-wrap gap-4">
                <a
                  href="/settings"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
                >
                  Open Settings →
                </a>

                <a
                  href="/activity-logs"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
                >
                  Open Activity Logs →
                </a>
              </div>
            </section>

            <footer className="mt-10 flex flex-wrap justify-between gap-3 border-t border-slate-800 pt-6 text-xs text-slate-500">
              <p>© 2026 SecureSphere</p>
              <p>
                Educational Cybersecurity Project · Development Mode
              </p>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  title,
  value,
  note,
}: {
  icon: string;
  title: string;
  value: string | number;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0c1220] p-5 transition hover:border-slate-700">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400">{title}</p>
        <span className="text-lg text-cyan-400">{icon}</span>
      </div>

      <p className="mt-4 text-3xl font-bold tracking-tight">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-500">{note}</p>
    </div>
  );
}
