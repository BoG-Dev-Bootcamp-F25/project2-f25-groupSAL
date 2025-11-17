'use client';

import { ReactNode, useState, useEffect } from 'react';
import './globals.css'

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif' }}>
        {/* Header / Title Bar */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.5rem 2rem',
            backgroundColor: '#f8f8f8',
            borderBottom: '1px solid #ddd',
          }}
        >
          {/* Left: Logo + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/images/appLogo.png" alt="Logo" style={{ height: '40px', width: '40px' }} />
            <h1 style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Progress</h1>
          </div>

          {/* Center: Search bar (only if logged in) */}
          {isLoggedIn && (
            <form onSubmit={handleSearch} style={{ flexGrow: 1, maxWidth: '400px', margin: '0 auto' }}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: '1px solid #ccc',
                }}
              />
            </form>
          )}

          {/* Right: empty */}
          <div style={{ width: '40px' }} />
        </header>

        {/* Page content */}
        <main>{children}</main>
      </body>
    </html>
  );
}
