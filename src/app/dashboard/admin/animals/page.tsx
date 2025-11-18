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
            const res = await fetch('/api/admin/animals', {
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
            <h1 className="text-1xl font-bold text-gray-700">All Animals</h1>
    
          </div>
    
          {/* horizontal line */}
          <hr className="mt-4 mb-8 border-gray-300" />
    
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}
    
          {!loading && !error && animals && animals.length === 0 && (
            <p>No animals.</p>
          )}
    
        <div className="flex gap-6 overflow-x-auto pb-4">
            {animals.map((animal) => (
                <AnimalCard key={animal._id} animal={animal} />
            ))}
        </div>
        </main>
      );
}



