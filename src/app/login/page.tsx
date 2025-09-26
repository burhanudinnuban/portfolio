'use client';

import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../utils/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth(app);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/cms');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 flex justify-center items-center">
      <div className="w-full max-w-md">
        <form onSubmit={handleLogin} className="bg-card shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
          {error && <p className="bg-destructive/20 text-destructive p-3 rounded mb-4">{error}</p>}
          <div className="mb-4">
            <Label className="block text-card-foreground text-sm font-bold mb-2" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <Label className="block text-card-foreground text-sm font-bold mb-2" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <Button type="submit">
              Sign In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
