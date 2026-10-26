
"use client";

import { useState } from "react";
import { logActivity } from "../../lib/activity-logs";

export default function FileIntegrity() {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [hashA, setHashA] = useState("");
  const [hashB, setHashB] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function calculateHash(file: File): Promise<string> {
    const fileBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      fileBuffer
    );

    return Array.from(new Uint8Array(hashBuffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  async function compareFiles() {
    if (!fileA || !fileB) {
      setResult("Please select both files before comparing.");
      return;
    }

    if (!window.crypto?.subtle) {
      setResult(
        "SHA-256 is unavailable. Open this page using localhost or HTTPS."
      );
      return;
    }

    setLoading(true);
    setResult("");
    setHashA("");
    setHashB("");

    try {
      const firstHash = await calculateHash(fileA);
      const secondHash = await calculateHash(fileB);

      setHashA(firstHash);
      setHashB(secondHash);

      if (firstHash === secondHash) {
        setResult("MATCH: Both files have identical content.");

        logActivity(
          "File Integrity",
          "File comparison completed. Both files have matching SHA-256 hashes.",
          "Success"
        );
      } else {
        setResult("NO MATCH: The file contents are different.");

        logActivity(
          "File Integrity",
          "File comparison completed. The SHA-256 hashes do not match.",
          "Warning"
        );
      }
    } catch {
      setResult("An error occurred while reading or comparing the files.");

      logActivity(
        "File Integrity",
        "File comparison failed because an error occurred while processing the files.",
        "Warning"
      );
    } finally {
      setLoading(false);
    }
  }

  function resetChecker() {
    setFileA(null);
    setFileB(null);
    setHashA("");
    setHashB("");
    setResult("");

    const inputs = document.querySelectorAll<HTMLInputElement>(
      'input[type="file"]'
    );

    inputs.forEach((input) => {
      input.value = "";
    });
  }

  return (
    <main className="min-h-screen bg-[#070b14] px-5 py-10 text-slate-100">
      <div className="mx-auto max-w-4xl">
        <a
          href="/"
          className="text-sm text-cyan-400 hover:text-cyan-300"
        >
          ← Back to Dashboard
        </a>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-[#0c1220] p-6 md:p-9">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-3xl">
            🛡️
          </div>

          <p className="mt-6 text-xs font-semibold tracking-[0.18em] text-cyan-400">
            DATA PROTECTION
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            File Integrity Checker
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            Verify file integrity by generating SHA-256 hashes.
            Select two files and compare their hashes to check
            whether their contents are identical.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
              <h2 className="font-semibold">File 01</h2>
              <p className="mt-2 text-xs text-slate-500">
                Select the original file
              </p>

              <input
                type="file"
                onChange={(event) => {
                  setFileA(event.target.files?.[0] ?? null);
                  setHashA("");
                  setHashB("");
                  setResult("");
                }}
                className="mt-5 block w-full text-sm text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-cyan-400 file:px-3 file:py-2 file:font-semibold file:text-slate-950"
              />

              {fileA && (
                <div className="mt-4 rounded-lg bg-slate-900 p-3">
                  <p className="break-all text-sm text-cyan-300">
                    {fileA.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {(fileA.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
              <h2 className="font-semibold">File 02</h2>
              <p className="mt-2 text-xs text-slate-500">
                Select the file to compare
              </p>

              <input
                type="file"
                onChange={(event) => {
                  setFileB(event.target.files?.[0] ?? null);
                  setHashA("");
                  setHashB("");
                  setResult("");
                }}
                className="mt-5 block w-full text-sm text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-cyan-400 file:px-3 file:py-2 file:font-semibold file:text-slate-950"
              />

              {fileB && (
                <div className="mt-4 rounded-lg bg-slate-900 p-3">
                  <p className="break-all text-sm text-cyan-300">
                    {fileB.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {(fileB.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={compareFiles}
              disabled={loading}
              className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Comparing Files..." : "Compare Files"}
            </button>

            <button
              onClick={resetChecker}
              className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
            >
              Reset
            </button>
          </div>

          {result && (
            <div
              className={`mt-6 rounded-2xl border p-5 ${
                result.startsWith("MATCH:")
                  ? "border-green-400/20 bg-green-400/5"
                  : result.startsWith("NO MATCH:")
                  ? "border-red-400/20 bg-red-400/5"
                  : "border-yellow-400/20 bg-yellow-400/5"
              }`}
            >
              <h2
                className={`font-semibold ${
                  result.startsWith("MATCH:")
                    ? "text-green-400"
                    : result.startsWith("NO MATCH:")
                    ? "text-red-400"
                    : "text-yellow-300"
                }`}
              >
                {result}
              </h2>
            </div>
          )}

          {hashA && hashB && (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                <h3 className="text-sm font-semibold text-slate-300">
                  FILE 01 — SHA-256 HASH
                </h3>
                <p className="mt-3 break-all font-mono text-xs leading-6 text-cyan-300">
                  {hashA}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                <h3 className="text-sm font-semibold text-slate-300">
                  FILE 02 — SHA-256 HASH
                </h3>
                <p className="mt-3 break-all font-mono text-xs leading-6 text-cyan-300">
                  {hashB}
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-5">
            <h3 className="font-semibold text-cyan-300">
              How it works
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              SHA-256 converts file contents into a fixed-length
              digital hash. If the hashes match, the contents are
              identical for practical purposes. If they differ, the
              contents are different.
            </p>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              Files are processed in your browser. This educational
              tool does not upload them to a server or prove that a
              file comes from a trusted source.
            </p>
          </div>
        </section>

        <footer className="mt-6 text-center text-xs text-slate-600">
          SecureSphere · File Integrity Module
        </footer>
      </div>
    </main>
  );
}
