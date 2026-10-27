import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_WILAYA,
  getWilayaByCode,
  type Wilaya,
} from '../data/wilayas';

interface WilayaContextValue {
  wilaya: Wilaya;
  setWilaya: (wilaya: Wilaya) => void;
}

const WilayaContext = createContext<WilayaContextValue | null>(null);

const STORAGE_KEY = 'zitouni-wilaya';

function loadWilaya(): Wilaya {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const wilaya = getWilayaByCode(saved);
      if (wilaya) return wilaya;
    }
  } catch {
    // Ignore storage restrictions.
  }
  return DEFAULT_WILAYA;
}

export function WilayaProvider({ children }: { children: ReactNode }) {
  const [wilaya, setWilaya] = useState<Wilaya>(loadWilaya);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, wilaya.code);
    } catch {
      // Ignore storage restrictions.
    }
  }, [wilaya]);

  return (
    <WilayaContext.Provider value={{ wilaya, setWilaya }}>
      {children}
    </WilayaContext.Provider>
  );
}

export function useWilaya(): WilayaContextValue {
  const context = useContext(WilayaContext);
  if (!context) {
    throw new Error('useWilaya must be used within WilayaProvider');
  }
  return context;
}
