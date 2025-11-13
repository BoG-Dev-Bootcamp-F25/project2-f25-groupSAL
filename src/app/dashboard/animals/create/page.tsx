'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { NextResponse } from 'next/server';

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
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent) => { 
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/animal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                router.push('/dashboard/animals');
            } else {
                return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
            }
        } catch (err) {
            return NextResponse.json({ message: 'Cannot add animal' }, { status: 500 });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}></input>
                <input value={formData.breed} onChange={(e) => setFormData({...formData, breed: e.target.value})}></input>
                <input value={formData.hoursTrained} onChange={(e) => setFormData({...formData, hoursTrained: Number(e.target.value)})}></input>
                <input value={formData.profilePicture} onChange={(e) => setFormData({...formData, profilePicture: e.target.value})}></input>
            </form>
        </div>
    )
}



