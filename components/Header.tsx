'use client';
import Link from 'next/link';
import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import Button from '@/components/Button';
import { createClient } from '@/utils/supabase/client';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      if (session?.user) {
        const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
        setIsAdmin(data?.role === 'admin');
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        if (!session?.user) setIsAdmin(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <Link href="/">
            <span className="text-gradient logo-text" style={{ fontWeight: '700' }}>AUTRIXGPT AI</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          <Link href="/services" className="nav-link">Services</Link>
          <Link href="/automations" className="nav-link">Automations</Link>
          <Link href="/pricing" className="nav-link">Pricing</Link>
          <div className="dropdown">
            <button className="nav-link dropdown-toggle">Resources ▾</button>
            <div className="dropdown-menu">
              <Link href="/help-center" className="dropdown-item">Help Center</Link>
              <Link href="/faq" className="dropdown-item">FAQ</Link>
              <Link href="/contact" className="dropdown-item">Contact Support</Link>
              <Link href="/security" className="dropdown-item">Security</Link>
            </div>
          </div>
          <Link href="/about" className="nav-link">About</Link>
        </nav>

        <div className="header-actions nav-desktop">
          <ThemeToggle />
          
          {user ? (
            <>
              {isAdmin && <Link href="/admin" className="nav-link" style={{ marginLeft: '1rem', color: 'var(--primary-color)' }}>Admin</Link>}
              <Link href="/dashboard" className="nav-link" style={{ marginLeft: '1rem' }}>Dashboard</Link>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Log Out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="nav-link" style={{ marginLeft: '1rem' }}>
                Login
              </Link>
              <Button href="/signup" variant="primary">Start Now</Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Toggle Menu">
          ☰
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="nav-mobile">
          <Link href="/services" className="nav-mobile-link" onClick={toggleMobileMenu}>Services</Link>
          <Link href="/automations" className="nav-mobile-link" onClick={toggleMobileMenu}>Automations</Link>
          <Link href="/pricing" className="nav-mobile-link" onClick={toggleMobileMenu}>Pricing</Link>
          <Link href="/help-center" className="nav-mobile-link" onClick={toggleMobileMenu}>Help Center</Link>
          <Link href="/faq" className="nav-mobile-link" onClick={toggleMobileMenu}>FAQ</Link>
          <Link href="/contact" className="nav-mobile-link" onClick={toggleMobileMenu}>Contact</Link>
          <Link href="/about" className="nav-mobile-link" onClick={toggleMobileMenu}>About</Link>
          
          <div className="nav-mobile-actions">
            <ThemeToggle />
            {user ? (
              <>
                {isAdmin && <Link href="/admin" className="nav-mobile-link" onClick={toggleMobileMenu} style={{ marginTop: '1rem', color: 'var(--primary-color)' }}>Admin Panel</Link>}
                <Link href="/dashboard" className="nav-mobile-link" onClick={toggleMobileMenu} style={{ marginTop: isAdmin ? '0' : '1rem' }}>Dashboard</Link>
                <button onClick={() => { handleLogout(); toggleMobileMenu(); }} className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }}>Log Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="nav-mobile-link" onClick={toggleMobileMenu} style={{ marginTop: '1rem' }}>
                  Login
                </Link>
                <Button href="/signup" variant="primary" style={{ width: '100%', marginTop: '0.5rem' }}>Start Now</Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
