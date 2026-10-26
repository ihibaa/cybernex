
"use client";

import { useState } from "react";
import { logActivity } from "../../lib/activity-logs";

const headers = [
  {
    name: "Strict-Transport-Security",
    purpose: "Tells browsers to use HTTPS for future connections.",
  },
  {
    name: "Content-Security-Policy",
    purpose: "Helps restrict the sources from which content can load.",
  },
  {
    name: "X-Content-Type-Options",
    purpose: "Helps prevent MIME-type sniffing.",
  },
  {
    name: "X-Frame-Options",
    purpose: "Can help prevent a site from being embedded in frames.",
  },
  {
    name: "Referrer-Policy",
    purpose: "Controls how much referrer information browsers send.",
  },
  {
    name: "Permissions-Policy",
    purpose: "Controls access to selected browser features.",
  },
];

export default function SecurityTesting() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<Record<string, string> | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkHeaders() {
    setMessage("");
    setResult(null);

    let target: URL;

    try {
      target = new URL(url.trim());
    } catch {
      setMessage("Please enter a valid URL, for example https://example.com");
      return;
    }

    if (!["http:", "https:"].includes(target.protocol)) {
      setMessage("Only HTTP and HTTPS URLs are supported.");
      return;
    }

    if (target.username || target.password) {
      setMessage("URLs containing usernames or passwords are not allowed.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(target.toString(), {
        method: "GET",
        mode: "cors",
        redirect: "follow",
        credentials: "omit",
      });

      const values: Record<string, string> = {};

      headers.forEach((header) => {
        values[header.name] =
          response.headers.get(header.name) ?? "Not visible";
      });

      setResult(values);
      setMessage(
        `Response received: HTTP ${response.status}. Some headers may be hidden by browser CORS rules.`
      );

      logActivity(
        "Security Testing",
        `HTTP security header check completed for ${target.hostname}. HTTP status: ${response.status}.`,
        "Success"
      );
    } catch {
      setMessage(
        "Could not read this website's response. The site may block cross-origin browser requests. This does not mean the website is insecure."
      );

      logActivity(
        "Security Testing",
        `HTTP security header check could not read the response from ${target.hostname}.`,
        "Warning"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070b14] px-5 py-10 text-slate-100">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="text-sm text-cyan-400 hover:text-cyan-300">
          ← Back to Dashboard
        </a>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-[#0c1220] p-6 md:p-9">
          <div className="text-4xl">🌐</div>

          <p className="mt-5 text-xs font-semibold tracking-widest text-cyan-400">
            WEB SECURITY
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Security Testing
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Learn about common HTTP security headers and inspect headers
            that a website allows your browser to read.
          </p>

          <label className="mt-8 block text-sm font-medium">
            Website URL
          </label>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
            />

            <button
              onClick={checkHeaders}
              disabled={loading}
              className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
            >
              {loading ? "Checking..." : "Check Headers"}
            </button>
          </div>

          {message && (
            <p className="mt-5 rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm leading-6 text-slate-300">
              {message}
            </p>
          )}

          {result && (
            <div className="mt-6 space-y-3">
              <h2 className="text-lg font-semibold">
                Header Results
              </h2>

              {headers.map((header) => {
                const value = result[header.name];
                const found = value !== "Not visible";

                return (
                  <article
                    key={header.name}
                    className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-medium">
                        {header.name}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          found
                            ? "bg-green-400/10 text-green-300"
                            : "bg-yellow-400/10 text-yellow-300"
                        }`}
                      >
                        {found ? "Visible" : "Not visible"}
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {header.purpose}
                    </p>

                    <p className="mt-3 break-all font-mono text-xs text-cyan-300">
                      {value}
                    </p>
                  </article>
                );
              })}
            </div>
          )}

          <div className="mt-8 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
            <h2 className="font-semibold text-amber-300">
              Important limitation
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Browsers restrict access to many cross-origin responses.
              A failed request or a header marked Not visible is not proof
              that the website lacks that security header. For a reliable
              assessment, use a server-side checker with appropriate
              protections against requests to private or internal networks,
              or inspect the response in authorized developer tools.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
