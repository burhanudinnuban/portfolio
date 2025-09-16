'use client';

import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, push } from 'firebase/database';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import app from '../utils/firebase';

interface Data {
  [key: string]: string;
}

export default function CMS() {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<Data | null>(null);
  const [newItem, setNewItem] = useState('');
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (user && user.email === 'burhanudinnuban@gmail.com') {
      const db = getDatabase(app);
      const dbRef = ref(db, 'data');
      onValue(dbRef, (snapshot) => {
        setData(snapshot.val());
      });
    }
  }, [user]);

  const handleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const handleAddItem = () => {
    if (newItem.trim() !== '') {
      const db = getDatabase(app);
      const dbRef = ref(db, 'data');
      push(dbRef, newItem);
      setNewItem('');
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-24">
        <button
          onClick={handleSignIn}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  if (user.email !== 'burhanudinnuban@gmail.com') {
    return <div>Access Denied</div>;
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-8">CMS</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add New Item</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
            <button
              onClick={handleAddItem}
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              Add
            </button>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Data from Firebase</h2>
          {data ? (
            <ul>
              {Object.entries(data).map(([key, value]) => (
                <li key={key} className="border-b py-2">
                  {value}
                </li>
              ))}
            </ul>
          ) : (
            <p>No data found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
