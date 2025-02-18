import React, { createContext, useContext, useState, useCallback } from 'react';

type BreadcrumbContextType = {
  segments: Record<string, string>;
  setBreadcrumbSegment: (path: string, display: string) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [segments, setSegments] = useState<Record<string, string>>({});

  const setBreadcrumbSegment = useCallback((path: string, display: string) => {
    setSegments(prev => ({
      ...prev,
      [path]: display
    }));
  }, []);

  return (
    <BreadcrumbContext.Provider value={{ segments, setBreadcrumbSegment }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  if (context === undefined) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }
  return context;
} 