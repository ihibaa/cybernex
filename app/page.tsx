
const tools = [
  {
    number: "01",
    name: "Password Checker",
    description: "Evaluate password strength and security.",
    status: "Ready to build",
  },
  {
    number: "02",
    name: "File Integrity",
    description: "Calculate hashes and detect file changes.",
    status: "Coming next",
  },
  {
    number: "03",
    name: "Security Testing",
    description: "Review basic web security configurations.",
    status: "Planned",
  },
  {
    number: "04",
    name: "Risk Assessment",
    description: "Identify threats and calculate risk levels.",
    status: "Planned",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-slate-800 p-6 md:block">
          <h1 className="text-2xl font-bold text-cyan-400">
            SecureSphere
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Cybersecurity Platform
          </p>

          <nav className="mt-10 space-y-3 text-sm">
            <p className="rounded-lg bg-cyan-400/10 p-3 text-cyan-300">
              Dashboard
            </p>
            <p className="p-3 text-slate-400">Security Tools</p>
            <p className="p-3 text-slate-400">Risk Assessment</p>
            <p className="p-3 text-slate-400">Activity Logs</p>
            <p className="p-3 text-slate-400">Settings</p>
          </nav>
        </aside>

        <section className="min-w-0 flex-1 p-6 md:p-10">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-cyan-400">
                SECURITY WORKSPACE
              </p>
              <h2 className="mt-2 text-3xl font-bold">
                Dashboard
              </h2>
              <p className="mt-2 text-slate-400">
                Your security tools, all in one place.
              </p>
            </div>

            <span className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">
              Student Project
            </span>
          </header>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Security Tools" value="4" />
            <StatCard title="Active Alerts" value="0" />
            <StatCard title="Open Incidents" value="0" />
            <StatCard title="Risk Assessments" value="0" />
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-semibold">
              Security Toolkit
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Select a module to explore as we build it.
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {tools.map((tool) => (
                <article
                  key={tool.number}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-cyan-500/60"
                >
                  <p className="text-sm text-cyan-400">
                    MODULE {tool.number}
                  </p>
                  <h4 className="mt-3 text-lg font-semibold">
                    {tool.name}
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {tool.description}
                  </p>
                  <p className="mt-5 text-xs text-slate-500">
                    {tool.status}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <footer className="mt-12 border-t border-slate-800 pt-5 text-sm text-slate-500">
            SecureSphere · Educational Cybersecurity Project
          </footer>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-3 text-3xl font-bold">{value}</p>
    </div>
  );
}
