import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-10 border border-gray-700 text-center">
        <h1 className="text-4xl font-bold text-white mb-6">
          Assessment Management System
        </h1>
        <p className="text-gray-300 mb-8 text-lg">
          A simple platform to generate assessment reports with secure login.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/signup"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/generate"
            className="px-6 py-3 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700 transition-colors"
          >
            Generate Report
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-400">
          Use <code className="px-2 py-1 bg-black/30 rounded">session_001</code>{" "}
          or <code className="px-2 py-1 bg-black/30 rounded">session_002</code>{" "}
          to generate reports.
        </div>
      </div>
    </main>
  );
}
