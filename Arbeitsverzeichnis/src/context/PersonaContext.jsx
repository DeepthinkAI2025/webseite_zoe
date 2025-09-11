import React, { createContext, useContext, useState, useCallback } from 'react';

// Lightweight Stub bis echte Persona Logik (Segmentierung/Chat) wieder integriert wird.
const PersonaContext = createContext({
  persona: null,
  setPersona: () => {},
  history: [],
  addTurn: () => {}
});

export function PersonaProvider({ children }) {
  const [persona, setPersona] = useState(null);
  const [history, setHistory] = useState([]);

  const addTurn = useCallback((turn) => {
    setHistory(h => [...h, { ts: Date.now(), ...turn }]);
  }, []);

  const value = { persona, setPersona, history, addTurn };
  return <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>;
}

export const usePersona = () => useContext(PersonaContext);

export default PersonaContext;