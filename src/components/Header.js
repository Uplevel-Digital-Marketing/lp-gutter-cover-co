import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/Header.module.css';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (e) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    const element = document.querySelector(href);
    if (element) {
      setMobileMenuOpen(false);
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.mainNav}>
        <div className="container">
          <div className={styles.navContent}>
            <div className={styles.logo}>
              <Image 
                src="/assets/logo-gc-2020.jpeg"
                alt="Gutter Cover Co Logo"
                width={180}
                height={60}
                priority
              />
            </div>
            <nav className={styles.navigation}>
              <ul>
                <li><a href="#solutions" onClick={handleNavClick}>Solutions</a></li>
                <li><a href="#why-choose-us" onClick={handleNavClick}>Why Choose Us</a></li>
                <li><a href="#reviews" onClick={handleNavClick}>Reviews</a></li>
                <li><a href="#contact" onClick={handleNavClick}>Contact</a></li>
              </ul>
            </nav>
            <div className={styles.contact}>
              <div className={styles.phone}>
                <span>Give Us A Call</span>
                <a href="tel:4403368092">(440) 336-8092</a>
              </div>
              <a href="#contact" className="btn btn--primary">Free Estimate</a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={styles.menuButton}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenuOverlay} onClick={() => setMobileMenuOpen(false)}>
          <div className={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeButton}
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className={styles.mobileMenuContent}>
              {/* Mobile Phone Number - Prominent */}
              <div className={styles.mobilePhone}>
                <span>Call Us Now</span>
                <a href="tel:4403368092" className={styles.mobilePhoneLink}>
                  (440) 336-8092
                </a>
              </div>

              <nav className={styles.mobileNav}>
                <ul>
                  <li><a href="#solutions" onClick={handleNavClick}>Solutions</a></li>
                  <li><a href="#why-choose-us" onClick={handleNavClick}>Why Choose Us</a></li>
                  <li><a href="#reviews" onClick={handleNavClick}>Reviews</a></li>
                  <li><a href="#contact" onClick={handleNavClick}>Contact</a></li>
                </ul>
              </nav>

              <a
                href="#contact"
                className={styles.mobileCTA}
                onClick={handleNavClick}
              >
                Get Free Estimate
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 