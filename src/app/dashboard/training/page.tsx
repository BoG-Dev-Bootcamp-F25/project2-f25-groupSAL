"use client";

import { useEffect, useState } from "react";
import TrainingLogCard, { TrainingLog } from "../../components/TrainingLogCard";
import Link from "next/link";

export default function TrainingDashboardPage() {
  const [logs, setLogs] = useState<TrainingLog[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchLogs() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/training', { method: 'GET', credentials: 'include' });
        
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.message || `Status ${res.status}`);
        }

        const data = await res.json();
        if (mounted) setLogs(data.trainingLogs || []);
      } catch (err: any) {
        console.error('Error fetching training logs', err);
        if (mounted) setError(err.message || 'Failed to fetch training logs');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchLogs();
    return () => { mounted = false };
  }, []);

  return (
    <main className="bg-white min-h-screen px-8 pt-6">
      {/* title & create new */}
      <div className="flex items-center justify-between">
        <h1 className="text-1xl font-bold text-gray-700">Training Logs</h1>

        <Link
          href="/dashboard/training/create"
          className="flex items-center text-gray-500 font-medium text-md hover:text-gray-700 space-x-2"
        >
          <img src="/images/createNewLogo.png" alt="Plus" className="w-5 h-5" />
          <span>Create new</span>
        </Link>
      </div>

      {/* horizontal line */}
      <hr className="mt-4 mb-8 border-gray-300" />

      {/* status/errors */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && logs && logs.length === 0 && (
        <p>No training logs found. Create one to get started.</p>
      )}

      {/* traininglog cards */}
      <div className="flex flex-col gap-6">
        {logs &&
          logs.map((log) => (
            <TrainingLogCard
              key={log._id || `${log.title}-${log.date}`}
              log={log}
            />
          ))}
      </div>
    </main>
  );
}
