"use client";

import { useEffect, useState } from "react";
import UserCard, { User } from "../../../components/UserCard";

export default function UsersDashboardDisplay() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/admin/users', { method: 'GET', credentials: 'include' });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.message || `Status ${res.status}`);
        }

        const data = await res.json();
        if (mounted) setUsers(data.users || []);
      } catch (err: any) {
        console.error('Error fetching users', err);
        if (mounted) setError(err.message || 'Failed to fetch users');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchUsers();
    return () => { mounted = false };
  }, []);

  return (
    <main className="bg-white min-h-screen px-8 pt-6">
      {/* title */}
      <div className="flex items-center justify-between">
        <h1 className="text-1xl font-bold text-gray-700">All Users</h1>
      </div>

      {/* horizontal line */}
      <hr className="mt-4 mb-6 border-gray-300" />

      {/* status/errors */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && users && users.length === 0 && (
        <p>No users found.</p>
      )}

      {/* user cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {users && users.map((user) => (
        <UserCard key={user._id} user={user} />
))}
      </div>

    </main>
  );
}
