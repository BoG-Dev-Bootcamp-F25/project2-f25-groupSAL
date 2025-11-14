'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
    const router = useRouter();

    useEffect(() => {
        router.push('/dashboard/animals');
    }, [router]);

    return null;
}



