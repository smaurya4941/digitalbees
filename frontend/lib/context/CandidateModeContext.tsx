'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CandidateModeContextType {
  isCandidateMode: boolean;
  setCandidateMode: (val: boolean) => void;
  toggleCandidateMode: () => void;
}

const CandidateModeContext = createContext<CandidateModeContextType>({
  isCandidateMode: false,
  setCandidateMode: () => {},
  toggleCandidateMode: () => {},
});

export function CandidateModeProvider({ children }: { children: React.ReactNode }) {
  const [isCandidateMode, setIsCandidateMode] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('teambees_candidate_mode');
      if (saved !== null) {
        setIsCandidateMode(saved === 'true');
      }
    } catch {
      // localStorage may fail in restricted environments
    }
  }, []);

  const setCandidateMode = (val: boolean) => {
    setIsCandidateMode(val);
    try {
      localStorage.setItem('teambees_candidate_mode', String(val));
    } catch {
      // ignore
    }
  };

  const toggleCandidateMode = () => {
    setCandidateMode(!isCandidateMode);
  };

  return (
    <CandidateModeContext.Provider value={{ isCandidateMode, setCandidateMode, toggleCandidateMode }}>
      {children}
    </CandidateModeContext.Provider>
  );
}

export function useCandidateMode() {
  return useContext(CandidateModeContext);
}
