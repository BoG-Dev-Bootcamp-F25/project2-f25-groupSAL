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
                setError(data.message || 'Failed to load animal');
            }
        } catch (err) {
            setError('Something went wrong in fetching api animal');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}></input>
                <input value={formData.breed} onChange={(e) => setFormData({...formData, breed: e.target.value})}></input>
                <input 
                    type="number" 
                    min="0" 
                    step="0.1"
                    value={formData.hoursTrained} 
                    onChange={(e) => setFormData({...formData, hoursTrained: Number(e.target.value) || 0})}
                ></input>
                <input value={formData.profilePicture} onChange={(e) => setFormData({...formData, profilePicture: e.target.value})}></input>
                <button type = "submit">submit</button>
            </form>
        </div>
    )
}



