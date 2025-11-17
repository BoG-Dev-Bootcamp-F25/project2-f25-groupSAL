"use client";

import { useEffect, useState } from "react";
import TrainingLogCard, { TrainingLog } from "../../components/TrainingLogCard";

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
    <main style={{ padding: '1rem' }}>
      <h1>Training Logs</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && logs && logs.length === 0 && (
        <p>No training logs found. Create one to get started.</p>
      )}

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {logs && logs.map((log) => (
          <TrainingLogCard key={log._id || `${log.title}-${log.date}`} log={log} />
        ))}
      </div>
    </main>
  );
}
