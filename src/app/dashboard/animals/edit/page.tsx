'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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

export default function EditAnimal() {
    const [formData, setFormData] = useState({
        _id: '',
        name: '',
        breed: '',
        hoursTrained: 0,
        profilePicture: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    
    useEffect(() => {
        // Get animal ID from URL
        const animalId = searchParams.get('id');
        
        if (animalId) {
            fetchAnimal(animalId);
        }
    }, [searchParams]);
    
    const fetchAnimal = async (animalId: string) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/animal/${animalId}`, {
                method: 'GET',
                credentials: 'include',
            });
            
            if (res.ok) {
                const data = await res.json();
                const animal = data.animal;
                if (animal) {
                    setFormData({
                        _id: animal._id,
                        name: animal.name,
                        breed: animal.breed,
                        hoursTrained: animal.hoursTrained,
                        profilePicture: animal.profilePicture,
                    });
                } else {
                    setError('Animal not found');
                }
            } else {
                const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
                setError(errorData.message || 'Failed to load animal');
            }
        } catch (err) {
            setError('Error loading animal');
            console.error('Error fetching animal:', err);
        } finally {
            setLoading(false);
        }
    }
    const handleSubmit = async (e: React.FormEvent) => { 
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/animal', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });
    
            const data = await res.json();
    
            if (res.ok) {
                router.push('/dashboard/animals');
            } else {
                setError(data.message || 'Failed to update animal');
            }
        } catch (err) {
            setError('Something went wrong updating animal');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="bg-white min-h-screen px-8 pt-6">
            {/* title */}
            <div className="flex items-center justify-between">
                <h1 className="text-1xl font-bold text-gray-700">Animals</h1>
            </div>

            {/* horizontal line */}
            <hr className="mt-4 mb-8 border-gray-300" />

            {loading && <p className="mb-4">Loading...</p>}
            {error && <p className="text-red-600 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
                {/* Name */}
                <div className="flex flex-col">
                    <label className="mb-1 font-medium text-gray-600">Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 text-black"
                        required
                    />
                </div>

                {/* Breed */}
                <div className="flex flex-col">
                    <label className="mb-1 font-medium text-gray-600">Breed</label>
                    <input
                        type="text"
                        value={formData.breed}
                        onChange={(e) => setFormData({...formData, breed: e.target.value})}
                        className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 text-black"
                        required
                    />
                </div>

                {/* Hours Trained */}
                <div className="flex flex-col">
                    <label className="mb-1 font-medium text-gray-600">Hours Trained</label>
                    <input
                        type="number"
                        step="1"
                        value={formData.hoursTrained}
                        onChange={(e) => setFormData({...formData, hoursTrained: Number(e.target.value) || 0})}
                        className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 text-black"
                        required
                    />
                </div>

                {/* Profile Picture */}
                <div className="flex flex-col">
                    <label className="mb-1 font-medium text-gray-600">Profile Picture URL</label>
                    <input
                        type="text"
                        value={formData.profilePicture}
                        onChange={(e) => setFormData({...formData, profilePicture: e.target.value})}
                        className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 text-black"
                        required
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-4">
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/animals')}
                        className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
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
    )
}



