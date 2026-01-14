import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
}

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMouseTop, setIsMouseTop] = useState(false);

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'services', label: 'Services', href: '#services' },
    { id: 'skills', label: 'Skills', href: '#skills' },
    { id: 'projects', label: 'Projects', href: '#projects' },
    { id: 'contact', label: 'Contact', href: '#contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Show nav if mouse is within top 100px
      if (e.clientY < 100) {
        setIsMouseTop(true);
      } else {
        setIsMouseTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const isNavVisible = !isScrolled || isMouseTop || isMobileMenuOpen;

  const scrollToSection = (href: string, id: string) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
    
    // Map navigation IDs to actual section IDs
    const sectionMap: { [key: string]: string } = {
      'home': 'home',
      'about': 'about',
      'services': 'services',
      'skills': 'skills',
      'projects': 'featured-projects',
      'contact': 'contact'
    };
    
    const targetId = sectionMap[id] || id;
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: isNavVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 right-0 z-50 px-8 py-4 transition-all duration-300"
        onMouseEnter={() => setIsMouseTop(true)}
        style={{
          backgroundColor: isScrolled ? 'rgba(15, 39, 68, 0.85)' : 'rgba(8, 20, 38, 0.5)',
          backdropFilter: isScrolled ? 'blur(12px)' : 'blur(8px)',
          borderBottom: isScrolled ? '1px solid rgba(100, 255, 218, 0.15)' : '1px solid rgba(100, 255, 218, 0.08)',
          boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.3)' : 'none'
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#home"
            whileHover={{ scale: 1.05 }}
            className="text-xl tracking-wider"
            style={{ color: '#64FFDA', textShadow: '0 0 10px rgba(100, 255, 218, 0.3)' }}
          >
            {'<JY />'}
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.id}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.href, item.id);
                }}
                className="relative text-sm tracking-wider transition-colors"
                style={{
                  color: activeSection === item.id ? '#64FFDA' : '#8892B0'
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== item.id) {
                    e.currentTarget.style.color = '#E6F1FF';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== item.id) {
                    e.currentTarget.style.color = '#8892B0';
                  }
                }}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0, scaleX: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -bottom-1 left-0 right-0 h-0.5 origin-left"
                    style={{ backgroundColor: '#64FFDA' }}
                  />
                )}
              </motion.a>
            ))}
            
            {/* Resume Button */}
            <motion.a
              href="#resume"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 border-2 rounded text-sm tracking-wider transition-all"
              style={{
                borderColor: '#64FFDA',
                color: '#64FFDA',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(100, 255, 218, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Resume
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center"
            style={{ color: '#64FFDA' }}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-64 md:hidden z-40 backdrop-blur-lg border-l"
            style={{
              backgroundColor: 'rgba(10, 25, 47, 0.95)',
              borderColor: 'rgba(100, 255, 218, 0.2)'
            }}
          >
            <div className="pt-24 px-8">
              <nav className="space-y-6">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.href, item.id);
                    }}
                    className="block text-lg tracking-wider transition-colors"
                    style={{
                      color: activeSection === item.id ? '#64FFDA' : '#8892B0'
                    }}
                  >
                    {item.label}
                  </motion.a>
                ))}
                
                <motion.a
                  href="#resume"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.1 }}
                  className="block px-6 py-3 border-2 rounded text-center tracking-wider transition-all"
                  style={{
                    borderColor: '#64FFDA',
                    color: '#64FFDA',
                    backgroundColor: 'transparent'
                  }}
                >
                  Resume
                </motion.a>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 md:hidden z-30"
            style={{ backgroundColor: 'rgba(2, 12, 27, 0.8)' }}
          />
        )}
      </AnimatePresence>
    </>
  );
}