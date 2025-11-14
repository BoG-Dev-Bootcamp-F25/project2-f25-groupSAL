'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    const [error, setError] = useState('')
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent) => { 
        e.preventDefault();
        setLoading(true);
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
                setError(data.message || 'Response was not ok');
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



