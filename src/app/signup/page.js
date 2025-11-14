'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

    const res = await fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      credentials: 'include', 
    });

    const data = await res.json();
    if (res.ok) router.push('/dashboard');
    else setError(data.message);
  }

  return (
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', margin: '0 auto', marginTop: '100px' , alignItems: 'center' }}>
        <h2 style={{fontSize: '3.5rem', fontWeight: 'bold', color: '#000000', fontFamily: 'helvetica, sans-serif', marginBottom: '1rem',}}>Create Account</h2>
        <input placeholder="Username" value={form.userName} onChange={e => setForm({ ...form, userName: e.target.value })} style={{fontSize: '1.5rem', border: 'none', borderBottom: '2px solid #da0000ff', padding: '0.75rem', marginBottom: '1rem', width: '400px',}}/>
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{fontSize: '1.5rem', border: 'none', borderBottom: '2px solid #da0000ff', padding: '0.75rem', marginBottom: '1rem', width: '400px',}}/>
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{fontSize: '1.5rem', border: 'none', borderBottom: '2px solid #da0000ff', padding: '0.75rem', marginBottom: '1rem', width: '400px',}}/>
        <input type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} style={{fontSize: '1.5rem', border: 'none', borderBottom: '2px solid #da0000ff', padding: '0.75rem', marginBottom: '1rem', width: '400px',}}/>
        <label>
          <input type="checkbox" checked={form.isAdmin} onChange={e => setForm({ ...form, isAdmin: e.target.checked })}/>
          Admin
        </label>
        <button type="submit" style={{backgroundColor: '#da0000ff', color: 'white', fontWeight: 'bold', padding: '0.75rem', width: '425px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.5rem', marginTop: '1rem', marginBottom: '1rem',}}>Sign Up</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>Already have an account? <a href="/login" style={{fontWeight: 'bold',}}>Log in</a></p>
        <img src="/public/images/quarterCircle.png" alt="red quarter circle" style={{ all: 'unset', position: 'absolute', bottom: 0, left: 0 }}/>
      </form>
  );
}
