'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AnimalCard from '@/app/components/AnimalCard';
import Link from 'next/link';

interface Animal {
    _id: string;
    name: string;
    breed: string;
    owner: {
        userName: string;
        _id: string;
    };
    hoursTrained: number;
    profilePicture: string;
}

export default function AnimalDashboard() {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();
    const fetchAnimals = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/animal', {
                method: 'GET',
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                setAnimals(data.animals || []);
            }
        } catch (err) {
            console.log("Error getting animals");
            setError('Cannot load animals');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAnimals();
    }, [])

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <main className="bg-white min-h-screen px-8 pt-6">
          <div className="flex items-center justify-between">
            <h1 className="text-1xl font-bold text-gray-700">Animals</h1>
    
            <Link
              href="/dashboard/animals/create"
              className="flex items-center text-gray-500 font-medium text-md hover:text-gray-700 space-x-2"
            >
              <img src="/images/createNewLogo.png" alt="Plus" className="w-5 h-5" />
              <span className="text-1xl text-gray-700">Create new</span>
            </Link>
          </div>
    
          {/* horizontal line */}
          <hr className="mt-4 mb-8 border-gray-300" />
    
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}
    
          {!loading && !error && animals && animals.length === 0 && (
            <p>No animals. Create one to get started.</p>
          )}
    
        <div className="flex flex-wrap gap-6 pb-4">
            {animals.map((animal) => (
                <AnimalCard key={animal._id} animal={animal} />
            ))}
        </div>
        </main>
      );
}



