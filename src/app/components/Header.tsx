
'use client';
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu, X, BookUser } from "lucide-react";
import { getAuth, onAuthStateChanged, User, signOut } from "firebase/auth";
import app from "../utils/firebase";
import Link from "next/link";

interface NavItem {
  href: string;
  label: string;
}

interface HeaderData {
  logo: {
    initials: string;
    name: string;
  };
  navItems: NavItem[];
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    fetch('/api/header')
      .then((res) => res.json())
      .then((data) => {
        setHeaderData(data);
      });
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (!headerData) {
    return <div>Loading...</div>;
  }

  return (
    <header className="bg-background/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 h-20 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <BookUser className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold">{headerData.logo.name}</span>
        </Link>

        <nav className="hidden md:flex space-x-6">
          {headerData.navItems.map((link) => (
            <a key={link.href} href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
              {link.label}
            </a>
          ))}
          {user && user.email === 'burhanudinnuban@gmail.com' && (
            <Link href="/cms" className="text-muted-foreground hover:text-primary transition-colors">
              CMS
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
            {user ? (
                <Button onClick={handleSignOut}>Sign Out</Button>
            ) : (
                <Button asChild>
                    <Link href="/login">Login</Link>
                </Button>
            )}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X /> : <Menu />}
            </Button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background/90 backdrop-blur-sm">
          <nav className="flex flex-col items-center py-4 space-y-4">
            {headerData.navItems.map((link) => (
              <a key={link.href} href={link.href} className="text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                {link.label}
              </a>
            ))}
            {user && user.email === 'burhanudinnuban@gmail.com' && (
              <Link href="/cms" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                CMS
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
