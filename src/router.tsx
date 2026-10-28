import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { sanitizeDomId, sanitizeInternalPath } from './utils/security';

export interface RouteLocation {
  pathname: string;
  search: string;
  hash: string;
}

interface RouterContextValue {
  location: RouteLocation;
  navigate: (to: string, options?: { replace?: boolean }) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

function normalizePathname(rawPath: string): string {
  if (!rawPath || rawPath === '/') return '/';
  const cleaned = rawPath.replace(/\/+$/, '');
  const normalized = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
  if (normalized === '/programmes') {
    return '/solutions';
  }
  return normalized;
}

function getWindowLocation(): RouteLocation {
  if (typeof window === 'undefined') {
    return { pathname: '/', search: '', hash: '' };
  }
  return {
    pathname: normalizePathname(window.location.pathname),
    search: window.location.search || '',
    hash: window.location.hash || '',
  };
}

const ROUTE_META: Record<
  string,
  { title: string; description: string }
> = {
  '/': {
    title: 'Brainbench Technology — Learn Today. Build Tomorrow.',
    description:
      'Brainbench Technology equips individuals and organisations in Ado-Ekiti and beyond with practical, career-ready skills across Web Development, Design, Data, Professional Courses, Advanced Technology, and signature academic events.',
  },
  '/about': {
    title: 'About Us | Brainbench Technology',
    description:
      'Learn about Brainbench Technology — who we are, our practical hands-on training philosophy, industry practitioners, and our training centre in Ado-Ekiti, Ekiti State.',
  },
  '/courses': {
    title: 'Courses & 2026 Catalogue | Brainbench Technology',
    description:
      'Explore all 39 certified technology, design, data analysis, accounting, management, and AI courses offered by Brainbench Technology.',
  },
  '/solutions': {
    title: 'Software Solutions & Products | Brainbench Technology',
    description:
      'Explore Brainbench Technology software solutions: ULTRA CBT (Computer-Based Testing and examination management), PORTAL PRO (School Portal and digital school management), and LMS E-LIBRARY (Digital library repository and e-learning).',
  },
  '/programmes': {
    title: 'Software Solutions & Products | Brainbench Technology',
    description:
      'Explore Brainbench Technology software solutions: ULTRA CBT, PORTAL PRO, and LMS E-LIBRARY.',
  },
  '/events': {
    title: 'Events & Programmes | Brainbench Technology',
    description:
      'Explore Brainbench Technology signature events: The Edge: Beyond the Classroom (every two weeks) and Brainbench Spark It (once every quarter).',
  },
  '/events/the-edge': {
    title: 'The Edge: Beyond the Classroom | Brainbench Technology Events',
    description:
      'A bi-weekly guest-speaker programme helping students develop the professional skills, confidence and connections that technical lessons alone cannot teach.',
  },
  '/events/brainbench-spark-it': {
    title: 'Brainbench Spark It | Brainbench Technology Events',
    description:
      'A quarterly showcase where students and graduates present ideas and innovations, receive expert feedback and gain experience defending their work in public.',
  },
  '/contact': {
    title: 'Contact & Admissions | Brainbench Technology',
    description:
      'Get in touch with Brainbench Technology at Brainbench Building, 47 Damilore Street, Ado-Ekiti, Ekiti State. Call +234 816 099 3158 or email info@bbtechng.com.',
  },
  '/admin': {
    title: 'Demo Request Admin Portal | Brainbench Technology',
    description:
      'Protected Brainbench Technology administration portal for managing software product demo requests.',
  },
  '/admin/demo-requests': {
    title: 'Demo Request Admin Portal | Brainbench Technology',
    description:
      'Protected Brainbench Technology administration portal for managing ULTRA CBT, PORTAL PRO, and LMS E-LIBRARY demo requests.',
  },
};

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [location, setLocation] = useState<RouteLocation>(getWindowLocation);

  useEffect(() => {
    const handlePopState = () => {
      setLocation(getWindowLocation());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update page title, meta description, and scroll position on route change
  useEffect(() => {
    const meta = ROUTE_META[location.pathname] || ROUTE_META['/'];
    document.title = meta.title;
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) {
      descEl.setAttribute('content', meta.description);
    }
    const ogTitleEl = document.querySelector('meta[property="og:title"]');
    if (ogTitleEl) {
      ogTitleEl.setAttribute('content', meta.title);
    }
    const ogDescEl = document.querySelector('meta[property="og:description"]');
    if (ogDescEl) {
      ogDescEl.setAttribute('content', meta.description);
    }

    if (location.hash) {
      const targetId = sanitizeDomId(location.hash);
      if (targetId) {
        window.requestAnimationFrame(() => {
          const el = document.getElementById(targetId);
          if (el) {
            const headerOffset = 76;
            const pos = el.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
              top: Math.max(0, pos - headerOffset),
              behavior: 'smooth',
            });
          }
        });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location.pathname, location.search, location.hash]);

  const navigate = useCallback(
    (to: string, options?: { replace?: boolean }) => {
      if (typeof window === 'undefined') return;
      const safePath = sanitizeInternalPath(to);
      const url = new URL(safePath, window.location.origin);
      const nextLoc: RouteLocation = {
        pathname: normalizePathname(url.pathname),
        search: url.search || '',
        hash: url.hash || '',
      };

      const fullUrl = `${nextLoc.pathname}${nextLoc.search}${nextLoc.hash}`;
      if (options?.replace) {
        window.history.replaceState({}, '', fullUrl);
      } else {
        window.history.pushState({}, '', fullUrl);
      }
      setLocation(nextLoc);

      if (nextLoc.hash) {
        const targetId = sanitizeDomId(nextLoc.hash);
        if (targetId) {
          window.requestAnimationFrame(() => {
            const el = document.getElementById(targetId);
            if (el) {
              const headerOffset = 76;
              const pos = el.getBoundingClientRect().top + window.scrollY;
              window.scrollTo({
                top: Math.max(0, pos - headerOffset),
                behavior: 'smooth',
              });
            }
          });
        }
      }
    },
    []
  );

  return (
    <RouterContext.Provider value={{ location, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export function useRouter(): RouterContextValue {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return ctx;
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
}

export const Link: React.FC<LinkProps> = ({
  to,
  replace,
  onClick,
  children,
  ...rest
}) => {
  const { navigate } = useRouter();
  const safeHref = sanitizeInternalPath(to);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.altKey ||
      e.ctrlKey ||
      e.shiftKey ||
      rest.target === '_blank'
    ) {
      return;
    }
    e.preventDefault();
    navigate(safeHref, { replace });
  };

  return (
    <a
      href={safeHref}
      onClick={handleClick}
      rel={rest.target === '_blank' ? 'noopener noreferrer' : rest.rel}
      {...rest}
    >
      {children}
    </a>
  );
};
