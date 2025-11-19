'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Animal {
  _id: string;
  name: string;
  breed: string;
}

export default function EditTrainingLogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [title, setTitle] = useState('');
  const [animalId, setAnimalId] = useState('');
  const [animalName, setAnimalName] = useState('');
  const [breed, setBreed] = useState('');
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) fetchLog(id);
  }, [searchParams]);

  const fetchLog = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/training/${id}`, { method: 'GET', credentials: 'include' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.message || 'Failed to load training log');
        return;
      }
      const data = await res.json();
      const log = data.trainingLog;
      if (log) {
        setTitle(log.title || '');
        // Keep animal read-only: use stored fields from the training log
        setAnimalName(log.animalName || '');
        setBreed(log.breed || '');
        setAnimalId((log.animal && (log.animal._id || String(log.animal))) || (log.animal && String(log.animal)) || '');
        setHours(String(log.hoursLogged || ''));
        setDescription(log.description || '');
      }
    } catch (err) {
      console.error('Error fetching log', err);
      setError('Error loading training log');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const id = searchParams.get('id');
    if (!id) {
      setError('Missing training log id');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/training/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, hours }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push('/dashboard/training');
      } else {
        setError(data.message || 'Failed to update training log');
      }
    } catch (err) {
      console.error('Error updating training log', err);
      setError('Failed to update training log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white min-h-screen px-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-1xl font-bold text-gray-700">Edit Training Log</h1>
      </div>

      <hr className="mt-4 mb-8 border-gray-300" />

      {loading && <p className="mb-4">Loading...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSave} className="flex flex-col gap-4 max-w-md">
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-600">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 text-black"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-600">Animal</label>
          <div className="border rounded px-3 py-2 text-black bg-gray-50">
            {animalName} {breed ? `- ${breed}` : ''}
          </div>
          <p className="text-sm text-gray-500 mt-2">Animal cannot be changed after Training Log creation.</p>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-600">Hours Trained</label>
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            min="0"
            step="0.1"
            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 text-black"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-600">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 text-black"
            required
          />
        </div>

        <div className="flex gap-4 mt-4">
          <Link
            href="/dashboard/training"
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </main>
  );
}
