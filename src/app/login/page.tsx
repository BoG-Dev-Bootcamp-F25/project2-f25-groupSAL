'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
        console.log('Attempting login with:', { email, password });
        const response = await fetch('/api/user/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies in request and response
        });

        const data = await response.json();
        
        // Check if Set-Cookie header is present
        const setCookieHeader = response.headers.get('set-cookie');


        if (response.status === 200) {
        router.push('/dashboard');
        } else {
        alert(data.message || 'Login failed');
        }
    } catch (err) {
        console.error('Login error:', err);
        alert('Something went wrong. Please try again.');
    }
    };

  // return (
  //   <main
  //     style={{
  //       display: 'flex',
  //       flexDirection: 'column',
  //       top: '400px',
  //       alignItems: 'center',
  //       minHeight: '100vh',
  //       justifyContent: 'center',
  //       marginTop: '-150px',
  //       backgroundColor: '#ffffff', // white background
  //     }}
  //   >
  //     <h1
  //       style={{
  //         fontSize: '3.5rem',
  //         fontWeight: 'bold',
  //         color: '#000000', // black text
  //         fontFamily: 'helvetica, sans-serif',
  //         marginBottom: '1rem',
  //       }}
  //     >
  //       Login
  //     </h1>

  //     <style>
  //       {`
  //       input::placeholder {
  //           font-size: 1.5rem;
  //           color: #999;
  //       }
  //       `}
  //     </style>
  //     <input
  //       type="email"
  //       placeholder="Email"
  //       value={email}
  //       onChange={(e) => setEmail(e.target.value)}
  //       style={{
  //         fontSize: '1.5rem',
  //         border: 'none',
  //         borderBottom: '2px solid #da0000ff',
  //         padding: '0.75rem',
  //         marginBottom: '1rem',
  //         width: '400px',
  //       }}
  //     />

  //     <input
  //       type="password"
  //       placeholder="Password"
  //       value={password}
  //       onChange={(e) => setPassword(e.target.value)}
  //       style={{
  //         border: 'none',
  //         borderBottom: '2px solid #da0000ff',
  //         padding: '0.75rem',
  //         marginBottom: '1.5rem',
  //         width: '400px',
  //       }}
  //     />

  //     <button
  //       onClick={handleLogin}
  //       style={{
  //         backgroundColor: '#da0000ff',
  //         color: 'white',
  //         fontWeight: 'bold',
  //         padding: '0.75rem',
  //         width: '400px', // wide button
  //         border: 'none',
  //         borderRadius: '8px',
  //         cursor: 'pointer',
  //         fontSize: '1.5rem',
  //         marginTop: '1rem',
  //         marginBottom: '1rem',
  //       }}
  //     >
  //       LOGIN
  //     </button>

  //     <Link
  //       href="/signup"
  //       style={{
  //         color: 'black',
  //         textDecoration: 'underline',
  //         marginTop: '0.5rem',
  //       }}
  //     >
  //       Don't have an account? Sign up
  //     </Link>
  //     <footer
  //       style={{
  //         position: 'absolute',
  //         bottom: '45px',
  //         fontSize: '1rem',
  //         color: '#666666a8',
  //       }}
  //     >
  //       Made with &hearts; by Group SAL
  //     </footer>
  //     <footer
  //       style={{
  //         position: 'absolute',
  //         bottom: '20px',
  //         fontSize: '1rem',
  //         color: '#666666a8',
  //       }}
  //     >
  //       &copy;2025 BOG Developer Bootcamp. All rights reserved.
  //     </footer>
  //     <img
  //       src="/images/quarterCircle.png"
  //       alt="red quarter circle"
  //       style={{ all: 'unset', position: 'absolute', bottom: 0, left: 0 }}
  //     />
  //   </main>
  // );
    return (
    <main className="flex flex-col justify-between min-h-screen bg-white px-4 overflow-hidden">
      {/* Centered login form */}
      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-4xl font-bold text-black mb-2">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full max-w-md mb-4 px-4 py-3 border-b-2 border-red-700 text-lg placeholder-gray-400 text-black focus:outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full max-w-md mb-6 px-4 py-3 border-b-2 border-red-700 text-lg placeholder-gray-400 text-black focus:outline-none"
        />

        <button
          onClick={handleLogin}
          className="w-full max-w-md bg-red-700 text-white font-bold py-3 rounded-lg text-lg hover:bg-red-800 transition-colors mb-4"
        >
          LOGIN
        </button>

        <Link href="/signup" className="text-black underline mb-12">
          Don't have an account? Sign up
        </Link>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 w-full text-center text-gray-500 text-sm pb-4">
        <p>Made with &hearts; by Group SAL</p>
        <p>&copy;2025 BOG Developer Bootcamp. All rights reserved.</p>
      </footer>

      {/* Background image */}
      <img
        src="/images/quarterCircle.png"
        alt="red quarter circle"
        className="absolute bottom-0 left-0"
      />
    </main>
  );
}
