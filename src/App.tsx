/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { createQuoteSubmitter } from './quoteSubmission';
import { 
  Phone, 
  MessageSquare, 
  Facebook, 
  X, 
  ChevronRight, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  ExternalLink,
  Shield,
  Layers,
  Sliders,
  Users,
  Award,
  Clock,
  Send,
  ZoomIn
} from 'lucide-react';

/* Minimalist Liquid Glass Theme Toggle matching Wojciech Zieliński vector reference */
function SunIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true">
      <circle cx="12" cy="12" r="3.75" />
      <rect x="11" y="2" width="2" height="3.2" rx="1" />
      <rect x="11" y="18.8" width="2" height="3.2" rx="1" />
      <rect x="2" y="11" width="3.2" height="2" rx="1" />
      <rect x="18.8" y="11" width="3.2" height="2" rx="1" />
      <g transform="rotate(45 12 12)">
        <rect x="11" y="2" width="2" height="3.2" rx="1" />
        <rect x="11" y="18.8" width="2" height="3.2" rx="1" />
        <rect x="2" y="11" width="3.2" height="2" rx="1" />
        <rect x="18.8" y="11" width="3.2" height="2" rx="1" />
      </g>
    </svg>
  );
}

function MoonIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true">
      <path d="M12.8 3.5a6.8 6.8 0 0 0 7.8 7.8 8.6 8.6 0 1 1-7.8-7.8z" />
    </svg>
  );
}

function LiquidGlassThemeToggle({
  theme,
  onToggle,
  className = ''
}: {
  theme: 'light' | 'dark';
  onToggle: () => void;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Theme mode switcher"
      data-theme={theme}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onToggle();
        } else if (e.key === 'ArrowRight' && theme !== 'dark') {
          e.preventDefault();
          onToggle();
        } else if (e.key === 'ArrowLeft' && theme !== 'light') {
          e.preventDefault();
          onToggle();
        }
      }}
      className={`liquid-glass-segmented w-[74px] h-[34px] ${className}`}
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      {/* Sliding Liquid Glass Active Thumb (Authentic clear glass cabochon pill) */}
      <div
        className="liquid-glass-segmented-thumb"
        style={{
          width: 'calc(50% - 3px)',
          transform: theme === 'dark' ? 'translateX(100%)' : 'translateX(0%)'
        }}
        aria-hidden="true"
      />

      {/* Two interactive icon-only segments (No text, just icon) */}
      <div className="relative z-10 grid grid-cols-2 w-full h-full">
        {/* Light Option (Left) */}
        <button
          type="button"
          role="radio"
          aria-checked={theme === 'light'}
          aria-label="Light mode"
          onClick={(e) => {
            e.stopPropagation();
            if (theme !== 'light') onToggle();
          }}
          className={`flex items-center justify-center h-full rounded-full transition-all duration-300 focus:outline-none ${
            theme === 'light'
              ? 'text-black scale-105 drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]'
              : 'text-white/45 hover:text-white/80 scale-95'
          }`}
        >
          <SunIcon className="w-4 h-4 text-current fill-current" />
        </button>

        {/* Dark Option (Right) */}
        <button
          type="button"
          role="radio"
          aria-checked={theme === 'dark'}
          aria-label="Dark mode"
          onClick={(e) => {
            e.stopPropagation();
            if (theme !== 'dark') onToggle();
          }}
          className={`flex items-center justify-center h-full rounded-full transition-all duration-300 focus:outline-none ${
            theme === 'dark'
              ? 'text-white scale-105 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]'
              : 'text-black/45 hover:text-black/80 scale-95'
          }`}
        >
          <MoonIcon className="w-4 h-4 text-current fill-current" />
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuRendered, setMobileMenuRendered] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string; desc: string } | null>(null);
  const [lightboxClosing, setLightboxClosing] = useState(false);
  const mobileMenuCloseTimer = useRef<number | null>(null);
  const lightboxCloseTimer = useRef<number | null>(null);
  const [heroVideoTheme, setHeroVideoTheme] = useState<'light' | 'dark' | null>(null);

  // Active section for liquid navigation
  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ] as const;

  type SectionId = typeof navLinks[number]['id'];
  const [activeSection, setActiveSection] = useState<SectionId>('hero');

  // Liquid sliding lens position state
  const navContainerRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  // Pre-fill notification state for quote form
  const [recentlySelectedService, setRecentlySelectedService] = useState<string | null>(null);
  const [serviceNotification, setServiceNotification] = useState<string | null>(null);

  // Quote form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    eventType: 'Wedding',
    eventDate: '',
    location: '',
    services: [] as string[],
    details: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const quoteSubmitterRef = useRef<ReturnType<typeof createQuoteSubmitter> | null>(null);
  if (!quoteSubmitterRef.current) quoteSubmitterRef.current = createQuoteSubmitter();

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const openMobileMenu = () => {
    if (mobileMenuCloseTimer.current !== null) window.clearTimeout(mobileMenuCloseTimer.current);
    setMobileMenuRendered(true);
    window.requestAnimationFrame(() => setMobileMenuOpen(true));
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    if (mobileMenuCloseTimer.current !== null) window.clearTimeout(mobileMenuCloseTimer.current);
    mobileMenuCloseTimer.current = window.setTimeout(() => {
      setMobileMenuRendered(false);
      mobileMenuCloseTimer.current = null;
    }, 240);
  };

  const closeLightbox = () => {
    setLightboxClosing(true);
    if (lightboxCloseTimer.current !== null) window.clearTimeout(lightboxCloseTimer.current);
    lightboxCloseTimer.current = window.setTimeout(() => {
      setLightboxImage(null);
      setLightboxClosing(false);
      lightboxCloseTimer.current = null;
    }, 200);
  };

  const openLightbox = (image: { src: string; title: string; desc: string }) => {
    if (lightboxCloseTimer.current !== null) window.clearTimeout(lightboxCloseTimer.current);
    setLightboxClosing(false);
    setLightboxImage(image);
  };

  // Theme state with localStorage persistence and OS preference fallback
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('one_umbrella_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('one_umbrella_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Check prefers-reduced-motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Reveal grouped content as it enters the viewport. Without IntersectionObserver,
  // with reduced motion, or if observer setup fails, content remains fully visible.
  useEffect(() => {
    const root = document.documentElement;
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches || !('IntersectionObserver' in window) || targets.length === 0) return;

    let observer: IntersectionObserver;
    let initialCallbackReceived = false;
    let fallbackTimer = 0;
    try {
      observer = new IntersectionObserver((entries) => {
        initialCallbackReceived = true;
        window.clearTimeout(fallbackTimer);
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

      targets.forEach((target) => observer.observe(target));
      root.classList.add('motion-ready');
      fallbackTimer = window.setTimeout(() => {
        if (!initialCallbackReceived) {
          root.classList.remove('motion-ready');
          observer.disconnect();
        }
      }, 1800);
    } catch {
      root.classList.remove('motion-ready');
      return;
    }

    return () => {
      window.clearTimeout(fallbackTimer);
      observer.disconnect();
      root.classList.remove('motion-ready');
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (lightboxImage) closeLightbox();
      else if (mobileMenuOpen) closeMobileMenu();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [lightboxImage, mobileMenuOpen]);

  useEffect(() => () => {
    if (mobileMenuCloseTimer.current !== null) window.clearTimeout(mobileMenuCloseTimer.current);
    if (lightboxCloseTimer.current !== null) window.clearTimeout(lightboxCloseTimer.current);
  }, []);

  // Update liquid lens position and dimensions smoothly
  const updateIndicator = () => {
    const activeEl = linkRefs.current[activeSection];
    const containerEl = navContainerRef.current;
    if (activeEl && containerEl) {
      const containerRect = containerEl.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      setIndicatorStyle({
        left: activeRect.left - containerRect.left,
        width: activeRect.width,
        opacity: 1,
      });
    }
  };

  useEffect(() => {
    updateIndicator();
    const timer = setTimeout(updateIndicator, 60);
    window.addEventListener('resize', updateIndicator);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activeSection]);

  // Handle active section tracking strictly based on scroll position
  useEffect(() => {
    const sections: SectionId[] = ['hero', 'about', 'services', 'gallery', 'contact'];
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setScrollY(currentY);
          setScrolled(currentY > 50);

          // If scrolled near page bottom, highlight contact
          if (window.innerHeight + currentY >= document.documentElement.scrollHeight - 90) {
            setActiveSection('contact');
            ticking = false;
            return;
          }

          const scrollPosition = currentY + 220;
          for (let i = sections.length - 1; i >= 0; i--) {
            const sectionId = sections[i];
            const el = document.getElementById(sectionId);
            if (el) {
              const top = el.offsetTop;
              if (scrollPosition >= top) {
                setActiveSection(sectionId);
                ticking = false;
                return;
              }
            }
          }
          setActiveSection('hero');
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler with fixed header offset compensation
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: SectionId) => {
    e.preventDefault();
    setActiveSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '#');
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 85;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        window.history.pushState(null, '', `#${sectionId}`);
      }
    }
  };

  // Pre-fill 'Services Required' checklist when user clicks 'Enquire' on a service card
  const handleEnquireService = (e: React.MouseEvent, serviceTitle: string) => {
    e.preventDefault();

    // Ensure the clicked service is selected in the quote form checklist
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceTitle)
        ? prev.services
        : [...prev.services, serviceTitle]
    }));

    setRecentlySelectedService(serviceTitle);
    setServiceNotification(`Pre-filled "${serviceTitle}" in your quote enquiry checklist.`);

    // Smooth scroll down to contact quote form
    const contactElement = document.getElementById('contact');
    if (contactElement) {
      const headerOffset = 85;
      const elementPosition = contactElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      window.history.pushState(null, '', '#contact');
      setActiveSection('contact');
    }

    setTimeout(() => {
      setRecentlySelectedService(null);
    }, 4500);

    setTimeout(() => {
      setServiceNotification(null);
    }, 5500);
  };

  const handleServiceCheckbox = (serviceName: string) => {
    setFormData(prev => {
      const exists = prev.services.includes(serviceName);
      if (exists) {
        return { ...prev, services: prev.services.filter(s => s !== serviceName) };
      } else {
        return { ...prev, services: [...prev.services, serviceName] };
      }
    });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.eventDate || !formData.location.trim()) {
      setFormError('Please fill in all required fields (Name, Phone, Date, and Location).');
      return;
    }

    if (formData.services.length === 0) {
      setFormError('Please select at least one service required for your event.');
      return;
    }

    const apiUrl = import.meta.env.VITE_FORMS_API_URL?.trim();
    const clientId = import.meta.env.VITE_FORMS_CLIENT_ID?.trim();
    if (!apiUrl || !clientId) {
      setFormError('The quote form is not configured yet. Please contact us by phone or WhatsApp.');
      return;
    }

    setFormSubmitting(true);
    try {
      await quoteSubmitterRef.current!(apiUrl, clientId, formData, window.location.origin);
      setFormSubmitted(true);
    } catch (error) {
      setFormError(error instanceof TypeError
        ? 'We could not reach the enquiry service. Please check your connection and try again.'
        : error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const serviceList = [
    {
      id: 'decor',
      title: 'Event Décor and Styling',
      description: 'Balloon installations, themed décor, celebration backdrops, table styling and coordinated event setups designed to create an unforgettable atmosphere.',
      image: '/assets/aistudio/event_decor_c9ceaebf.png',
      tag: 'Celebrations & Weddings'
    },
    {
      id: 'furniture',
      title: 'Furniture and Lounge Hire',
      description: 'Sophisticated lounge seating, velvet benches, elegant chairs, coffee tables and coordinated furniture arrangements tailored for any occasion.',
      image: '/assets/aistudio/Furniture_90181b60.png',
      tag: 'Seating & Comfort'
    },
    {
      id: 'marquees',
      title: 'Marquees and Tents',
      description: 'Premium marquee structures and outdoor event-cover setups providing shelter and elegance for gatherings of all sizes.',
      image: '/assets/aistudio/Tent_hire_faf66289.png',
      tag: 'Outdoor Infrastructure'
    },
    {
      id: 'stage',
      title: 'Stage, Sound and Lighting',
      description: 'Professional stage installations, high-fidelity speaker systems, DJ setups and dynamic event lighting arrangements for standout presentations.',
      image: '/assets/aistudio/Stage_268f7efe.png',
      tag: 'Production & Audio'
    },
    {
      id: 'jumping-castles',
      title: 'Jumping Castles and Childrens Entertainment',
      description: 'Colourful, safe, and exciting inflatable jumping castles designed to bring endless joy to children’s parties and family celebrations.',
      image: '/assets/aistudio/Children_s_entertainment_66e6e4d7.png',
      tag: 'Family & Parties'
    },
    {
      id: 'fencing',
      title: 'Fencing and Event Barriers',
      description: 'Temporary event fencing, black mesh security barriers, and white picket event fencing for entrances, walkways, boundaries and crowd control.',
      image: '/assets/aistudio/Fencing_6a449f8e.png',
      tag: 'Safety & Boundaries'
    },
    {
      id: 'weddings',
      title: 'Weddings and Special Occasions',
      description: 'Bespoke décor, furniture arrangement, and complete setup solutions designed specifically for weddings, milestone birthdays, and celebrations.',
      image: '/assets/aistudio/Hero_image_2868e81b.png',
      tag: 'Milestone Events'
    },
    {
      id: 'corporate',
      title: 'Corporate Events and Brand Activations',
      description: 'Professional staging, infrastructure, and refined styling for corporate gatherings, brand launches, executive presentations, and galas.',
      image: '/assets/aistudio/Stage_268f7efe.png',
      tag: 'Corporate & Brand'
    },
    {
      id: 'sports',
      title: 'Sports Tournaments and Community Events',
      description: 'Robust outdoor equipment, marquee tents, fencing barriers, and organizational setups for sports tournaments and community festivals.',
      image: '/assets/aistudio/Tent_hire_faf66289.png',
      tag: 'Festivals & Tournaments'
    }
  ];

  const galleryItems = [
    {
      src: '/assets/aistudio/Hero_image_2868e81b.png',
      title: 'Signature Sunset Event Setup',
      desc: 'Complete outdoor celebration infrastructure including stage, marquee, lounge seating and dining.'
    },
    {
      src: '/assets/aistudio/event_decor_c9ceaebf.png',
      title: 'Baby Shower Styling & Décor',
      desc: 'Pink themed celebration table with gold Chivari chairs, balloon arch and floral centrepieces.'
    },
    {
      src: '/assets/aistudio/Furniture_90181b60.png',
      title: 'Lounge Furniture & Seating Arrangement',
      desc: 'Velvet green and black sofas with gold-accented coffee tables under marquee cover.'
    },
    {
      src: '/assets/aistudio/Stage_268f7efe.png',
      title: 'Professional Stage & Backdrop',
      desc: 'Custom branded event backdrop with modern lounge seating and audio staging.'
    },
    {
      src: '/assets/aistudio/Sound_and_lighting_564b3b4a.png',
      title: 'Stage, Sound and Lighting Rig',
      desc: 'Professional truss lighting, DJ console, and high-output line array speaker system.'
    },
    {
      src: '/assets/aistudio/Tent_hire_faf66289.png',
      title: 'Spacious Marquee Tent Installation',
      desc: 'Heavy-duty white marquee structure set up on lush green lawn for large gatherings.'
    },
    {
      src: '/assets/aistudio/Fencing_6a449f8e.png',
      title: 'Event Fencing & White Picket Barriers',
      desc: 'Black mesh security fencing and charming white picket barriers organizing event walkways.'
    },
    {
      src: '/assets/aistudio/Children_s_entertainment_66e6e4d7.png',
      title: 'Colourful Jumping Castles',
      desc: 'Dual-tower inflatable jumping castle for children’s birthday parties and family events.'
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-[#d4af37]/20 transition-colors duration-300">
      
      {/* FLOATING NAVIGATION BAR */}
      <header className="fixed top-4 sm:top-6 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto glass-nav rounded-full px-5 sm:px-8 py-3 flex items-center justify-between">
          
          {/* Brand Wordmark */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[#000000] dark:bg-[#FFFFFF] flex items-center justify-center text-white dark:text-[#000000] font-serif italic text-base group-hover:bg-[#1A1A1A] dark:group-hover:bg-[#F2F2F2] transition-colors">
              OU
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl tracking-tight text-[var(--text-primary)] leading-none">
                One Umbrella
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold mt-0.5">
                Events Solutions
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links with Liquid Style Active Menu Indicator */}
          <nav 
            ref={navContainerRef}
            className="hidden md:flex items-center liquid-glass-nav-track relative"
            aria-label="Main Navigation"
          >
            {/* Morphing Liquid Glass Active Lens */}
            <div 
              className="liquid-glass-nav-lens"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.opacity,
              }}
              aria-hidden="true"
            />

            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  ref={(el) => { linkRefs.current[link.id] = el; }}
                  href={`#${link.id === 'hero' ? '' : link.id}`}
                  onClick={(e) => scrollToSection(e, link.id)}
                  className={`relative z-10 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors duration-300 select-none ${
                    isActive 
                      ? 'text-[#000000] dark:text-[#FFFFFF]' 
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            <LiquidGlassThemeToggle theme={theme} onToggle={toggleTheme} />
            <a 
              href="tel:0695062102"
              className="liquid-glass text-xs font-semibold text-[#000000] dark:text-[#FFFFFF] hover:bg-white/20 dark:hover:bg-white/10 transition-colors flex items-center gap-1.5 px-3.5 py-2 rounded-full shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            >
              <Phone className="w-3.5 h-3.5 text-current" />
              <span>069 506 2102</span>
            </a>
            <a 
              href="#contact"
              onClick={(e) => scrollToSection(e, 'contact')}
              className="bg-[#000000] text-[#FFFFFF] hover:bg-[#1A1A1A] dark:bg-[#FFFFFF] dark:text-[#000000] dark:hover:bg-[#F2F2F2] text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-full transition-all shadow-sm hover:shadow flex items-center gap-1.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            >
              <span>Request a Quote</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-[#FFFFFF] dark:text-[#000000]" />
            </a>
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="flex items-center gap-2.5 md:hidden shrink-0 z-20">
            <LiquidGlassThemeToggle theme={theme} onToggle={toggleTheme} />
            <button
              type="button"
              onClick={() => mobileMenuOpen ? closeMobileMenu() : openMobileMenu()}
              className="liquid-glass-hamburger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-panel"
            >
              <span className={`hamburger-icon${mobileMenuOpen ? ' is-open' : ''}`} aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu (Clean standard navigation without active styling) */}
        {mobileMenuRendered && (
          <div
            id="mobile-navigation-panel"
            aria-hidden={!mobileMenuOpen}
            inert={!mobileMenuOpen}
            className={`mobile-menu-panel md:hidden max-w-7xl mx-auto liquid-glass-drawer rounded-3xl p-6 shadow-xl${mobileMenuOpen ? ' is-open' : ''}`}
          >
            <nav className="flex flex-col gap-4 text-base font-medium text-[var(--text-primary)]">
              <a 
                href="#" 
                onClick={(e) => {
                  scrollToSection(e, 'hero');
                  closeMobileMenu();
                }}
                className="py-2 border-b border-[var(--border-color)] flex items-center justify-between hover:text-black dark:hover:text-white transition-colors"
              >
                <span>Home</span>
                <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
              </a>
              <a 
                href="#about" 
                onClick={(e) => {
                  scrollToSection(e, 'about');
                  closeMobileMenu();
                }}
                className="py-2 border-b border-[var(--border-color)] flex items-center justify-between hover:text-black dark:hover:text-white transition-colors"
              >
                <span>About Us</span>
                <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
              </a>
              <a 
                href="#services" 
                onClick={(e) => {
                  scrollToSection(e, 'services');
                  closeMobileMenu();
                }}
                className="py-2 border-b border-[var(--border-color)] flex items-center justify-between hover:text-black dark:hover:text-white transition-colors"
              >
                <span>Services & Equipment</span>
                <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
              </a>
              <a 
                href="#gallery" 
                onClick={(e) => {
                  scrollToSection(e, 'gallery');
                  closeMobileMenu();
                }}
                className="py-2 border-b border-[var(--border-color)] flex items-center justify-between hover:text-black dark:hover:text-white transition-colors"
              >
                <span>Event Gallery</span>
                <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
              </a>
              <a 
                href="#contact" 
                onClick={(e) => {
                  scrollToSection(e, 'contact');
                  closeMobileMenu();
                }}
                className="py-2 flex items-center justify-between hover:text-black dark:hover:text-white transition-colors"
              >
                <span>Contact & Quote</span>
                <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
              </a>
            </nav>

            <div className="mt-6 pt-6 border-t border-[var(--border-color)] flex flex-col gap-3">
              <a 
                href="tel:0695062102"
                className="liquid-glass mobile-drawer-contact-btn flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <Phone className="w-4 h-4 text-black dark:text-white" />
                <span className="text-black dark:text-white font-semibold">Call: 069 506 2102</span>
              </a>
              <a 
                href="https://wa.me/27695062102"
                target="_blank"
                rel="noopener noreferrer"
                className="liquid-glass mobile-drawer-contact-btn flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-black dark:text-white" />
                <span className="text-black dark:text-white font-semibold">WhatsApp: +27 69 506 2102</span>
              </a>
              <a 
                href="#contact" 
                onClick={(e) => {
                  scrollToSection(e, 'contact');
                  closeMobileMenu();
                }}
                className="bg-[#000000] text-[#FFFFFF] hover:bg-[#1A1A1A] dark:bg-[#FFFFFF] dark:text-[#000000] dark:hover:bg-[#F2F2F2] flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold uppercase tracking-wider shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              >
                Request a Quote
              </a>
            </div>
          </div>
        )}
      </header>


      {/* HERO SECTION */}
      <section id="hero" className="relative h-[100svh] min-h-[640px] w-full flex items-center overflow-hidden">
        {/* Full-bleed background video (Dynamic based on theme) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            key={theme}
            autoPlay={!prefersReducedMotion}
            muted
            loop
            playsInline
            preload={prefersReducedMotion ? 'none' : 'metadata'}
            onLoadedData={() => setHeroVideoTheme(theme)}
            onError={() => setHeroVideoTheme(theme)}
            poster="/assets/aistudio/Hero_image_2868e81b.png"
            className={`hero-video w-full h-full object-cover object-[center_35%]${prefersReducedMotion || heroVideoTheme === theme ? ' is-ready' : ''}`}
          >
            <source 
              src={
                theme === 'dark'
                  ? 'https://res.cloudinary.com/dvvugpu04/video/upload/v1792540142/100313119_1792540114303173_tedt6i.mp4'
                  : 'https://res.cloudinary.com/dvvugpu04/video/upload/v1792538597/586849936_1792538450460594_ogohic.mp4'
              } 
              type="video/mp4" 
            />
          </video>
          {/* Subtle warm ambient lighting and soft natural contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/15 to-transparent pointer-events-none" />
        </div>

        {/* Compact translucent glass information panel */}
        <div className="relative z-10 max-w-[420px] sm:max-w-[460px] mx-4 sm:mx-8 lg:mx-14 mt-16 sm:mt-20">
          <div className="glass-surface hero-sequence p-6 sm:p-7 lg:p-8 rounded-3xl shadow-2xl">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.65rem] text-[#242321] dark:text-[#F5F1E8] leading-[1.1] tracking-tight mb-3">
              Every occasion deserves an unforgettable <span className="italic text-[#9b783e] dark:text-[#d4af37]">setup.</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#514D47] dark:text-[#D0CBC2] leading-relaxed mb-6 font-medium">
              From beautiful celebrations to professional event setups, we bring every detail together.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a 
                href="#contact"
                className="bg-[#000000] text-[#FFFFFF] hover:bg-[#1A1A1A] dark:bg-[#FFFFFF] dark:text-[#000000] dark:hover:bg-[#F2F2F2] px-5 sm:px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              >
                <span>Request a Quote</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#FFFFFF] dark:text-[#000000]" />
              </a>
              <a 
                href="#services"
                className="liquid-glass px-5 sm:px-6 py-3 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm hover:bg-white/20 dark:hover:bg-white/10 flex items-center justify-center text-[#000000] dark:text-[#FFFFFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              >
                Explore Our Services
              </a>
            </div>
          </div>
        </div>

        {/* Smooth gradient transition blending hero bottom edge into the next section */}
        <div className={`absolute bottom-0 left-0 right-0 h-28 sm:h-36 bg-gradient-to-t ${theme === 'dark' ? 'from-[#12100e] via-[#12100e]/60' : 'from-[#faf8f5] via-[#faf8f5]/60'} to-transparent pointer-events-none z-10`} />
      </section>


      {/* ABOUT SECTION */}
      <section id="about" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Text / Editorial Story */}
          <div data-reveal className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#a88d52]">
              <span>About One Umbrella</span>
            </div>
            
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[var(--text-primary)] tracking-tight leading-[1.08]">
              We bring the pieces <span className="italic text-[#a88d52]">together.</span>
            </h2>

            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              “Every successful occasion comes together through thoughtful planning, the right equipment and a setup that suits the moment. One Umbrella Events Solutions helps bring those details together for celebrations, gatherings and professional events.”
            </p>

            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
              Based in South Africa, we provide reliable event setups, exquisite décor, high-quality furniture, marquees, and robust event infrastructure. Whether you are hosting an intimate baby shower, an elegant wedding, a corporate brand activation, or a vibrant community celebration, we ensure every element is flawlessly arranged.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-6 border-t border-[var(--border-color)]">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)] mb-1">Full Service</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">From tents and staging to seating, styling, and barriers.</p>
              </div>
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)] mb-1">Reliable Execution</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">Professional delivery and setup for every scale of occasion.</p>
              </div>
            </div>

            <div className="pt-4">
              <a 
                href="#contact"
                className="liquid-glass inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-[#000000] dark:text-[#FFFFFF] hover:bg-white/20 dark:hover:bg-white/10 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              >
                <span>Discuss Your Event Requirements</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#000000] dark:text-[#FFFFFF]" />
              </a>
            </div>
          </div>

          {/* Right Image Composition */}
          <div data-reveal className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[var(--border-color)] aspect-[4/3] bg-[var(--bg-secondary)]">
              <img 
                src="/assets/aistudio/event_decor_c9ceaebf.png" 
                alt="One Umbrella Events Décor and Styling" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 hidden sm:block w-56 p-6 glass-surface rounded-2xl shadow-xl">
              <p className="font-serif text-xl text-[var(--text-primary)] mb-1">Versatile & Creative</p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">Tailored setups for birthdays, weddings, corporate functions and more.</p>
            </div>
          </div>

        </div>
      </section>


      {/* SERVICES SECTION */}
      <section id="services" className="py-24 sm:py-32 bg-[var(--bg-secondary)]/50 border-y border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div data-reveal className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#a88d52] mb-3 block">
              Our Professional Offerings
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[var(--text-primary)] tracking-tight mb-4">
              Everything your occasion <span className="italic text-[#a88d52]">needs.</span>
            </h2>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              “From intimate celebrations to large gatherings, explore the event services and equipment available through One Umbrella Events Solutions.”
            </p>
          </div>

          {/* Services Grid (Editorial asymmetric layout) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceList.map((service, index) => (
              <div 
                key={service.id}
                data-reveal
                className="bg-[var(--card-bg)] rounded-3xl overflow-hidden border border-[var(--border-color)] hover:border-[#a88d52] shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col group"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[var(--bg-secondary)]">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 glass-surface px-3 py-1 rounded-full text-[11px] font-semibold text-[var(--text-primary)] shadow-sm">
                    {service.tag}
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)] mb-3 group-hover:text-[#a88d52] transition-colors leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[var(--border-color)]">
                    <a 
                      href="#contact" 
                      onClick={(e) => handleEnquireService(e, service.title)}
                      className="liquid-glass w-full py-2.5 px-4 rounded-full text-xs font-semibold uppercase tracking-wider text-[#000000] dark:text-[#FFFFFF] hover:bg-white/20 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                    >
                      <span>Enquire about this service</span>
                      <ArrowRight className="w-3.5 h-3.5 text-current group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* EVENT GALLERY SECTION */}
      <section id="gallery" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div data-reveal className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#a88d52] mb-3 block">
            Curated Portfolio
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[var(--text-primary)] tracking-tight mb-4">
            A look at what we bring <span className="italic text-[#a88d52]">together.</span>
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            Explore authentic photographs of real setups, décor, marquees, lounge furniture, staging, and equipment delivered by One Umbrella Events Solutions.
          </p>
        </div>

        {/* Masonry / Editorial Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryItems.map((item, idx) => (
            <div 
              key={idx}
              onClick={() => openLightbox(item)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  openLightbox(item);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`View ${item.title}`}
              data-reveal
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-[var(--bg-secondary)] cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <img 
                src={item.src} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <ZoomIn className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-serif text-xl mb-1">{item.title}</h3>
                <p className="text-xs text-white/80 line-clamp-2">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* HOW IT WORKS SECTION */}
      <section className="py-24 sm:py-32 bg-[#2c2825] dark:bg-[#1a1715] text-[#faf8f5] px-4 sm:px-6 lg:px-8 relative overflow-hidden border-y border-[#3d3733]">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#a88d52_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div data-reveal className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#a88d52] mb-3 block">
              Simple & Transparent Process
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight mb-4">
              How we work with <span className="italic text-[#d4af37]">you.</span>
            </h2>
            <p className="text-base text-[#b5ac9b]">
              Planning your occasion should be straightforward and inspiring. Here is how we bring your setup together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            
            <div data-reveal className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm relative">
              <span className="font-serif italic text-6xl text-[#a88d52]/35 absolute top-5 right-8 select-none">01</span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white mb-3 mt-4">Tell us about your occasion</h3>
              <p className="text-sm text-[#b5ac9b] leading-relaxed">
                Share the type of event, date, venue and the services or equipment you need through our quote form or via direct WhatsApp / phone call.
              </p>
            </div>

            <div data-reveal className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm relative">
              <span className="font-serif italic text-6xl text-[#a88d52]/35 absolute top-5 right-8 select-none">02</span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white mb-3 mt-4">Discuss your setup</h3>
              <p className="text-sm text-[#b5ac9b] leading-relaxed">
                Contact One Umbrella to discuss your specific requirements, layout preferences, and availability of suitable services and equipment.
              </p>
            </div>

            <div data-reveal className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm relative">
              <span className="font-serif italic text-6xl text-[#a88d52]/35 absolute top-5 right-8 select-none">03</span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white mb-3 mt-4">Bring your occasion together</h3>
              <p className="text-sm text-[#b5ac9b] leading-relaxed">
                Finalise the arrangements directly with our professional team and enjoy a flawless, unforgettable setup for your celebration.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* CONTACT & QUOTE ENQUIRY SECTION */}
      <section id="contact" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Info & Direct Contact */}
          <div data-reveal className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#a88d52] mb-3 block">
                Get In Touch
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[var(--text-primary)] tracking-tight mb-4">
                Let’s plan your <span className="italic text-[#a88d52]">setup.</span>
              </h2>
              <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
                “Tell us a little about your event and the services you need. We’ll help you take the next step.”
              </p>
            </div>

            <div className="space-y-6 pt-4 border-t border-[var(--border-color)]">
              
              <a 
                href="tel:0695062102"
                className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[#a88d52] transition-all shadow-sm group"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[#a88d52] group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block">Call Telephone</span>
                  <span className="font-serif text-xl text-[var(--text-primary)]">069 506 2102</span>
                </div>
              </a>

              <a 
                href="https://wa.me/27695062102"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[#a88d52] transition-all shadow-sm group"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[#a88d52] group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block">Chat on WhatsApp</span>
                  <span className="font-serif text-xl text-[var(--text-primary)]">+27 69 506 2102</span>
                </div>
              </a>

              <a 
                href="https://web.facebook.com/profile.php?id=100083234497061"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[#a88d52] transition-all shadow-sm group"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] group-hover:scale-110 transition-transform">
                  <Facebook className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block">Facebook Page</span>
                  <span className="font-serif text-lg text-[var(--text-primary)]">One Umbrella Events Solutions</span>
                </div>
              </a>

            </div>
          </div>

          {/* Right Quote Form */}
          <div data-reveal className="lg:col-span-7 bg-[var(--card-bg)] p-8 sm:p-12 rounded-3xl border border-[var(--border-color)] shadow-xl">
            {formSubmitted ? (
              <div className="text-center py-16 space-y-6">
                <div className="w-20 h-20 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[#000000] dark:text-[#FFFFFF] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)]">Enquiry Received Successfully!</h3>
                <p className="text-base text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out to One Umbrella Events Solutions. We have received your quote request and will contact you promptly via phone or WhatsApp.
                </p>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({
                      fullName: '',
                      phone: '',
                      email: '',
                      eventType: 'Wedding',
                      eventDate: '',
                      location: '',
                      services: [],
                      details: ''
                    });
                  }}
                  className="bg-[#000000] text-[#FFFFFF] hover:bg-[#1A1A1A] dark:bg-[#FFFFFF] dark:text-[#000000] dark:hover:bg-[#F2F2F2] px-8 py-3.5 rounded-full font-semibold text-xs uppercase tracking-wider transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <h3 className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)] mb-2">Request a Quote / Consultation</h3>
                <p className="text-xs text-[var(--text-muted)] mb-6">Fill in the details below and our team will get back to you with availability and pricing.</p>

                {serviceNotification && (
                  <div className="liquid-glass p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs font-semibold text-[#8c6d32] dark:text-[#d4af37] border border-[#a88d52]/50 bg-[#a88d52]/10 animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#8c6d32] dark:text-[#d4af37] shrink-0" />
                      <span>{serviceNotification}</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setServiceNotification(null)}
                      className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                      aria-label="Dismiss notification"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {formError && (
                  <div role="alert" aria-live="polite" className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded-2xl text-xs font-medium">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                      Full Name *
                    </label>
                    <input 
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Sipho Dlamini"
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl px-4 py-3.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-neutral-800 dark:focus:border-neutral-200 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                      Phone Number *
                    </label>
                    <input 
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 069 506 2102"
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl px-4 py-3.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-neutral-800 dark:focus:border-neutral-200 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                      Email Address *
                    </label>
                    <input 
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. sipho@example.com"
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl px-4 py-3.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-neutral-800 dark:focus:border-neutral-200 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                      Event Type *
                    </label>
                    <select
                      value={formData.eventType}
                      onChange={e => setFormData({ ...formData, eventType: e.target.value })}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl px-4 py-3.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-neutral-800 dark:focus:border-neutral-200 transition-colors"
                    >
                      <option value="Wedding">Wedding</option>
                      <option value="Birthday Celebration">Birthday Celebration</option>
                      <option value="Baby Shower">Baby Shower</option>
                      <option value="Christmas / New Year">Christmas or New Year Celebration</option>
                      <option value="Corporate Event / Brand Activation">Corporate Event / Brand Activation</option>
                      <option value="Sports Tournament / Community Event">Sports Tournament / Community Event</option>
                      <option value="Other Special Occasion">Other Special Occasion</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                      Event Date *
                    </label>
                    <input 
                      type="date"
                      required
                      value={formData.eventDate}
                      onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl px-4 py-3.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-neutral-800 dark:focus:border-neutral-200 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                      Venue or Event Location *
                    </label>
                    <input 
                      type="text"
                      required
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Johannesburg / Venue Name"
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl px-4 py-3.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-neutral-800 dark:focus:border-neutral-200 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                      Services Required (Select all that apply) *
                    </label>
                    {formData.services.length > 0 && (
                      <span className="text-[11px] font-semibold text-[#8c6d32] dark:text-[#d4af37]">
                        {formData.services.length} selected
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'Event Décor and Styling',
                      'Furniture and Lounge Hire',
                      'Marquees and Tents',
                      'Stage, Sound and Lighting',
                      'Jumping Castles and Childrens Entertainment',
                      'Fencing and Event Barriers',
                      'Weddings and Special Occasions',
                      'Corporate Events and Brand Activations',
                      'Sports Tournaments and Community Events'
                    ].map(service => {
                      const isSelected = formData.services.includes(service);
                      const isRecentlyPreFilled = recentlySelectedService === service;
                      return (
                        <div 
                          key={service}
                          onClick={() => handleServiceCheckbox(service)}
                          className={`p-3.5 rounded-2xl border text-xs font-medium cursor-pointer transition-all flex items-center justify-between relative ${
                            isRecentlyPreFilled
                              ? 'ring-2 ring-[#a88d52] ring-offset-2 dark:ring-offset-[#1a1715] bg-[#a88d52]/15 border-[#a88d52] text-[var(--text-primary)] shadow-md'
                              : isSelected 
                                ? 'bg-[#000000] text-[#FFFFFF] border-[#000000] dark:bg-[#FFFFFF] dark:text-[#000000] dark:border-[#FFFFFF]' 
                                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-neutral-400 dark:hover:border-neutral-500'
                          }`}
                        >
                          <div className="flex items-center gap-2 pr-2">
                            <span>{service}</span>
                            {isRecentlyPreFilled && (
                              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#a88d52] text-white animate-pulse">
                                Pre-filled
                              </span>
                            )}
                          </div>
                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${isSelected ? 'border-white dark:border-[#000000] bg-white/20 dark:bg-black/20' : 'border-[var(--border-color)]'}`}>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white dark:text-[#000000]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                    Additional Details / Specific Requirements
                  </label>
                  <textarea 
                    rows={4}
                    value={formData.details}
                    onChange={e => setFormData({ ...formData, details: e.target.value })}
                    placeholder="Tell us about guest count, theme, or specific equipment needs..."
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-neutral-800 dark:focus:border-neutral-200 transition-colors"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full bg-[#000000] text-[#FFFFFF] hover:bg-[#1A1A1A] dark:bg-[#FFFFFF] dark:text-[#000000] dark:hover:bg-[#F2F2F2] py-4 rounded-full font-semibold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                >
                  {formSubmitting ? (
                    <span>Submitting Enquiry...</span>
                  ) : (
                    <>
                      <span>Submit Quote Enquiry</span>
                      <Send className="w-4 h-4 text-[#FFFFFF] dark:text-[#000000]" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </section>


      {/* FOOTER */}
      <footer className="bg-[#2c2825] text-[#faf8f5] pt-16 pb-12 border-t border-[#3d3733]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-12 border-b border-[#3d3733]">
            
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#a88d52] flex items-center justify-center text-[#2c2825] font-serif italic text-base">
                  OU
                </div>
                <span className="font-serif text-2xl tracking-tight text-white">
                  One Umbrella Events Solutions
                </span>
              </div>
              <p className="text-sm text-[#b5ac9b] leading-relaxed max-w-sm">
                Providing event setups, décor, furniture, equipment and event infrastructure for weddings, birthdays, corporate events, and special occasions.
              </p>
            </div>

            <div className="lg:col-span-3 space-y-4">
              <h4 className="font-serif text-lg text-white tracking-wide">Quick Links</h4>
              <ul className="space-y-2.5 text-sm text-[#b5ac9b]">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Services & Equipment</a></li>
                <li><a href="#gallery" className="hover:text-white transition-colors">Event Gallery</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Request a Quote</a></li>
              </ul>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <h4 className="font-serif text-lg text-white tracking-wide">Direct Contact</h4>
              <div className="space-y-3 text-sm text-[#b5ac9b]">
                <a href="tel:0695062102" className="flex items-center gap-2.5 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-[#a88d52]" />
                  <span>069 506 2102</span>
                </a>
                <a href="https://wa.me/27695062102" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-white transition-colors">
                  <MessageSquare className="w-4 h-4 text-[#a88d52]" />
                  <span>+27 69 506 2102 (WhatsApp)</span>
                </a>
                <a href="https://web.facebook.com/profile.php?id=100083234497061" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-white transition-colors">
                  <Facebook className="w-4 h-4 text-[#a88d52]" />
                  <span>Facebook Official Page</span>
                </a>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#766e63]">
            <p>&copy; {new Date().getFullYear()} One Umbrella Events Solutions. All rights reserved.</p>
            <p className="mt-4 sm:mt-0">Crafted with precision for unforgettable occasions.</p>
          </div>
        </div>
      </footer>


      {/* LIGHTBOX MODAL */}
      {lightboxImage && (
        <div 
          onClick={closeLightbox}
          data-closing={lightboxClosing}
          className="lightbox-backdrop fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
        >
          <div 
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={lightboxImage.title}
            tabIndex={-1}
            className="lightbox-dialog bg-white rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl border border-[#e8e2d5] relative"
          >
            <button 
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[60vh] bg-black flex items-center justify-center overflow-hidden">
              <img 
                src={lightboxImage.src} 
                alt={lightboxImage.title} 
                className="w-full h-full object-contain max-h-[60vh]"
              />
            </div>
            <div className="p-6 sm:p-8 bg-white">
              <h3 className="font-serif text-2xl sm:text-3xl text-[#2c2825] mb-2">{lightboxImage.title}</h3>
              <p className="text-sm text-[#5c5346] mb-6">{lightboxImage.desc}</p>
              <div className="flex justify-end gap-3">
                <a 
                  href="#contact"
                  onClick={(e) => {
                    const galleryServiceMapping: Record<string, string> = {
                      'Signature Sunset Event Setup': 'Marquees and Tents',
                      'Baby Shower Styling & Décor': 'Event Décor and Styling',
                      'Lounge Furniture & Seating Arrangement': 'Furniture and Lounge Hire',
                      'Professional Stage & Backdrop': 'Stage, Sound and Lighting',
                      'Stage, Sound and Lighting Rig': 'Stage, Sound and Lighting',
                      'Spacious Marquee Tent Installation': 'Marquees and Tents',
                      'Event Fencing & White Picket Barriers': 'Fencing and Event Barriers',
                      'Colourful Jumping Castles': 'Jumping Castles and Childrens Entertainment',
                    };
                    const mapped = lightboxImage ? galleryServiceMapping[lightboxImage.title] : null;
                    closeLightbox();
                    if (mapped) {
                      handleEnquireService(e, mapped);
                    } else {
                      scrollToSection(e, 'contact');
                    }
                  }}
                  className="bg-[#000000] text-[#FFFFFF] hover:bg-[#1A1A1A] px-6 py-3 rounded-full font-semibold text-xs uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                >
                  Enquire About Setup
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
