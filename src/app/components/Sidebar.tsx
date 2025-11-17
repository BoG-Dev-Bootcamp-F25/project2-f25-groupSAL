'use client';

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  userName: string;
  email: string;
  accountType: string;
}

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch('/api/user', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                }
            } catch (err) {
                console.error('Error fetching user:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    const handleLogout = () => {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.push('/login');
    };

    const isActive = (path: string) => {
        if (pathname === path) return true;
        if (pathname.startsWith(path + '/') && !pathname.startsWith('/dashboard/admin')) {
            return true;
        }
        if (path.startsWith('/dashboard/admin') && pathname.startsWith(path)) {
            return true;
        }
        return false;
    };
    const isAdmin = user?.accountType === 'admin';
    const userInitial = user?.userName?.charAt(0).toUpperCase() || '?';

    if (loading) {
        return <div className="w-64 bg-white border-r border-gray-300 p-4">Loading...</div>;
    }

    return (
        <div className="w-64 bg-white border-r border-gray-300 flex flex-col h-full overflow-hidden">
            {/* Navigation Items */}
            <div className="flex flex-col p-4 gap-2 overflow-y-auto flex-1 min-h-0">
                {/* Training Logs */}
                <Link
                    href="/dashboard/training"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive('/dashboard/training')
                            ? 'bg-red-500 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    <img
                        src={isActive('/dashboard/training') ? "/images/activeTrainingLogo.png" : "/images/inactiveTrainingLogs.png"}
                        alt="Training"
                        className="w-5 h-5"
                    />
                    <span className="font-medium">Training logs</span>
                </Link>

                {/* Animals */}
                <Link
                    href="/dashboard/animals"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive('/dashboard/animals')
                            ? 'bg-red-500 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    <img
                        src={isActive('/dashboard/animals') ? "/images/activeAnimalsLogo.png" : "/images/inactiveAnimalLogo.png"}
                        alt="Animals"
                        className="w-5 h-5"
                    />
                    <span className="font-medium">Animals</span>
                </Link>

                {/* Horizontal Line */}
                <hr className="my-2 border-gray-300" />

                {/* Admin Access Section - Conditional */}
                {isAdmin && (
                    <>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                            Admin access
                        </div>
                        
                        {/* All Training */}
                        <Link
                            href="/dashboard/admin/training"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                isActive('/dashboard/admin/training')
                                    ? 'bg-red-500 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <img
                                src={isActive('/dashboard/admin/training') ? "/images/activeAllTrainingLogo.png" : "/images/inactiveAllTrainingLogo.png"}
                                alt="All Training"
                                className="w-5 h-5"
                            />
                            <span className="font-medium">All training</span>
                        </Link>

                        {/* All Animals */}
                        <Link
                            href="/dashboard/admin/animals"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                isActive('/dashboard/admin/animals')
                                    ? 'bg-red-500 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <img
                                src={isActive('/dashboard/admin/animals') ? "/images/activeAllAnimalsLogo.png" : "/images/inactiveAllAnimalsLogo.png"}
                                alt="All Animals"
                                className="w-5 h-5"
                            />
                            <span className="font-medium">All animals</span>
                        </Link>

                        {/* All Users */}
                        <Link
                            href="/dashboard/admin/users"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                isActive('/dashboard/admin/users')
                                    ? 'bg-red-500 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <img
                                src={isActive('/dashboard/admin/users') ? "/images/activeAllUsersLogo.png" : "/images/inactiveAllUsersLogo.png"}
                                alt="All Users"
                                className="w-5 h-5"
                            />
                            <span className="font-medium">All users</span>
                        </Link>
                    </>
                )}

            </div>

            {/* User Profile Section - Bottom */}
            <div className="mt-auto p-4 border-t border-gray-300">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-lg">{userInitial}</span>
                    </div>
                    
                    {/* User Info */}
                    <div className="flex-grow min-w-0">
                        <div className="font-bold text-black truncate">{user?.userName || 'User'}</div>
                        <div className="text-sm text-gray-600">
                            {isAdmin ? 'Admin' : 'User'}
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Logout"
                    >
                        <img
                            src="/images/logoutLogo.png"
                            alt="Logout"
                            className="w-5 h-5"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
