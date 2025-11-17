'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Animal {
  _id: string;
  name: string;
}

export default function CreateTrainingLogPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [animalId, setAnimalId] = useState('');
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch user's animals to populate the dropdown
  useEffect(() => {
    async function fetchAnimals() {
      try {
        const res = await fetch('/api/animal', { credentials: 'include' });
        const data = await res.json();
        if (res.ok) {
          setAnimals(data.animals || []);
        } else {
          setError(data.message || 'Failed to load animals');
        }
      } catch (err) {
        setError('Failed to load animals');
      }
    }
    fetchAnimals();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/training', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, animalId, hours, description }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push('/dashboard/training'); // redirect back to training dashboard
      } else {
        setError(data.message || 'Failed to create training log');
      }
    } catch (err) {
      setError('Failed to create training log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white min-h-screen px-8 pt-6">
      {/* title */}
      <div className="flex items-center justify-between">
        <h1 className="text-1xl font-bold text-gray-700">Training Logs</h1>
      </div>

      {/* horizontal line */}
      <hr className="mt-4 mb-8 border-gray-300" />

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="flex flex-col gap-4 max-w-md">
        {/* Title */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-600">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 text-black"
          />
        </div>

        {/* Animal */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-600">Animal</label>
          <select
            value={animalId}
            onChange={(e) => setAnimalId(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 text-black"
          >
            <option value="">Select an animal</option>
            {animals.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        {/* Hours */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-600">Hours Trained</label>
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            min="0"
            step="0.1"
            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 text-black"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-600">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 text-black"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <Link
            href="/dashboard/training"
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </main>
  );
}