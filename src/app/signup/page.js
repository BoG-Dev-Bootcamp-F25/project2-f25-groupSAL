'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [form, setForm] = useState({
  userName: '',
  email: '',
  password: '',
  confirmPassword: '',
  isAdmin: false,
  });

  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    console.log('Form data:', form);

    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include', 
      });

      const data = await res.json();
      if (res.ok) router.push('/dashboard');
      else setError(data.message);
    } catch (err) {
      console.error('Signup error:', err);
      setError('Sign up failed. Try again.');
    }
  }

  // return (
  //     <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', margin: '0 auto', marginTop: '100px' , alignItems: 'center' }}>
  //       <h2 style={{fontSize: '3.5rem', fontWeight: 'bold', color: '#000000', fontFamily: 'helvetica, sans-serif', marginBottom: '1rem',}}>Create Account</h2>
  //       <input placeholder="Username" value={form.userName} onChange={e => setForm({ ...form, userName: e.target.value })} style={{fontSize: '1.5rem', border: 'none', borderBottom: '2px solid #da0000ff', padding: '0.75rem', marginBottom: '1rem', width: '400px',}}/>
  //       <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{fontSize: '1.5rem', border: 'none', borderBottom: '2px solid #da0000ff', padding: '0.75rem', marginBottom: '1rem', width: '400px',}}/>
  //       <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{fontSize: '1.5rem', border: 'none', borderBottom: '2px solid #da0000ff', padding: '0.75rem', marginBottom: '1rem', width: '400px',}}/>
  //       <input type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} style={{fontSize: '1.5rem', border: 'none', borderBottom: '2px solid #da0000ff', padding: '0.75rem', marginBottom: '1rem', width: '400px',}}/>
  //       <label>
  //         <input type="checkbox" checked={form.isAdmin} onChange={e => setForm({ ...form, isAdmin: e.target.checked })}/>
  //         Admin
  //       </label>
  //       <button type="submit" style={{backgroundColor: '#da0000ff', color: 'white', fontWeight: 'bold', padding: '0.75rem', width: '425px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.5rem', marginTop: '1rem', marginBottom: '1rem',}}>Sign Up</button>
  //       {error && <p style={{ color: 'red' }}>{error}</p>}
  //       <p>Already have an account? <a href="/login" style={{fontWeight: 'bold',}}>Log in</a></p>
  //       <img src="/images/quarterCircle.png" alt="red quarter circle" style={{ all: 'unset', position: 'absolute', bottom: 0, left: 0 }}/>
  //     </form>
  // );
    return (
    <main className="relative flex flex-col items-center justify-center h-[calc(100vh-3.6rem)] bg-white px-4 overflow-hidden">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-2 w-full max-w-md"
      >
        <h2 className="text-4xl font-bold text-black mb-2">Create Account</h2>

        <input
          placeholder="Username"
          value={form.userName}
          onChange={(e) => setForm({ ...form, userName: e.target.value })}
          className="w-full px-4 py-3 text-lg border-b-2 border-red-700 focus:outline-none placeholder-gray-400 text-black"
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-3 text-lg border-b-2 border-red-700 focus:outline-none placeholder-gray-400 text-black"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full px-4 py-3 text-lg border-b-2 border-red-700 focus:outline-none placeholder-gray-400 text-black"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          className="w-full px-4 py-3 text-lg border-b-2 border-red-700 focus:outline-none placeholder-gray-400 text-black"
        />

        <label className="flex items-center gap-2 text-gray-400 mt-2">
          <input
            type="checkbox"
            checked={form.isAdmin}
            onChange={(e) => setForm({ ...form, isAdmin: e.target.checked })}
            className="w-4 h-4 accent-red-700"
          />
          Admin access
        </label>

        <button
          type="submit"
          className="w-full bg-red-700 text-white font-bold py-3 rounded-lg text-xl hover:bg-red-800 transition-colors mt-4 mb-4"
        >
          Sign Up
        </button>

        {error && <p className="text-red-600">{error}</p>}

        <Link href="/login" className="text-black underline mb-12">
          Already have an account? Log in
        </Link>
      </form>

      {/* Quarter circle */}
      <img
        src="/images/quarterCircle.png"
        alt="red quarter circle"
        className="absolute bottom-0 left-0"
      />

      {/* Footer */}
      <footer className="absolute left-0 w-full bottom-0 text-center text-gray-500 text-sm pb-4">
        <p>Made with &hearts; by Group SAL</p>
        <p>&copy;2025 BOG Developer Bootcamp. All rights reserved.</p>
      </footer>
    </main>
  );
}
