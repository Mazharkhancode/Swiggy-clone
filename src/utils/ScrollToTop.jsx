import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// Key used to store scroll map in sessionStorage
const STORAGE_KEY = 'swiggy_scroll_positions';

function getPositions() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function savePosition(key, value) {
  try {
    const positions = getPositions();
    positions[key] = value;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch {
    // ignore storage errors
  }
}

export default function ScrollToTop() {
  const { pathname, key } = useLocation();
  const navType = useNavigationType();

  // --- Save scroll position continuously while on the current page ---
  useEffect(() => {
    const handleScroll = () => {
      // Use pathname to save position
      savePosition(pathname, window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  // --- Restore or reset scroll on route change ---
  useEffect(() => {
    if (navType === 'POP') {
      // Back/forward navigation — restore saved position
      const savedY = getPositions()[pathname] || 0;
      // Double rAF: first frame lets React commit DOM, second lets browser paint
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: savedY, left: 0, behavior: 'instant' });
        });
      });
    } else {
      // New navigation (PUSH / REPLACE) — always go to top
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, navType]);

  return null;
}
