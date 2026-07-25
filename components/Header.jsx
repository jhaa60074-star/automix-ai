'use client';
import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import Button from './Button';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <Link href="/">
            <span className="text-gradient" style={{ fontWeight: '700', fontSize: '1.5rem' }}>AUTOMIK</span>
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
              <Link href="/help" className="dropdown-item">Help Center</Link>
              <Link href="/faq" className="dropdown-item">FAQ</Link>
              <Link href="/contact" className="dropdown-item">Contact Support</Link>
              <Link href="/security" className="dropdown-item">Security</Link>
              <Link href="#" className="dropdown-item">Documentation (Soon)</Link>
            </div>
          </div>
          <Link href="/about" className="nav-link">About</Link>
        </nav>

        <div className="header-actions nav-desktop">
          <ThemeToggle />
          <Link href="/login" className="nav-link" style={{ marginLeft: '1rem' }}>Login</Link>
          <Button href="/signup" variant="primary">Start Now</Button>
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
          <Link href="/help" className="nav-mobile-link" onClick={toggleMobileMenu}>Help Center</Link>
          <Link href="/faq" className="nav-mobile-link" onClick={toggleMobileMenu}>FAQ</Link>
          <Link href="/contact" className="nav-mobile-link" onClick={toggleMobileMenu}>Contact</Link>
          <Link href="/about" className="nav-mobile-link" onClick={toggleMobileMenu}>About</Link>
          <Link href="/login" className="nav-mobile-link" onClick={toggleMobileMenu}>Login</Link>
          <div className="nav-mobile-actions">
            <ThemeToggle />
            <Button href="/signup" variant="primary" style={{ width: '100%', marginTop: '1rem' }}>Start Now</Button>
          </div>
        </div>
      )}
    </header>
  );
}
