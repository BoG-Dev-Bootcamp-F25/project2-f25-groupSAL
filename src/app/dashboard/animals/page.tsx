'use client';
import { useState, useEffect } from 'react';
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

export default function AnimalDashboard() {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [loading, setLoading] = useState(true);
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
        <div>
            <h1>Animals</h1>
            {animals.length === 0 ? (
                <p>No animals found</p>
            ) : (
                <div>
                    {animals.map((animal) => (
                        <div key={animal._id} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem' }}>
                            <h2>{animal.name}</h2>
                            <p>Breed: {animal.breed}</p>
                            <p>Owner: {animal.owner?.userName || 'Unknown'}</p>
                            <p>Hours Trained: {animal.hoursTrained}</p>
                            {animal.profilePicture && (
                                <img src={animal.profilePicture} alt={animal.name} style={{ maxWidth: '200px' }} />
                            )}
                            <button onClick={() => {
                                router.push(`/dashboard/animals/edit?id=${animal._id}`);
                            }}>Edit</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}



