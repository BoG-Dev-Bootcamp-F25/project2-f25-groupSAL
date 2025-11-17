'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function CreateAnimal() {
    const [formData, setFormData] = useState({
        name: '',
        breed: '',
        hoursTrained: 0,
        profilePicture: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => { 
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/animal', {
                method: 'POST',
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
                setError(data.message || 'Failed to create animal');
            }
        } catch (err) {
            setError('Something went wrong creating animal');
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
                    <Link
                        href="/dashboard/animals"
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



