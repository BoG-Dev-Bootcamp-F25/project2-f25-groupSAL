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
    
}



