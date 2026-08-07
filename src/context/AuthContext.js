import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

// Wrap het beheer-gedeelte van de app hiermee zodat overal bekend is
// of er iemand is ingelogd met het gedeelde teamaccount.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [laden, setLaden] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLaden(false);
    });
    return unsubscribe;
  }, []);

  // Render nog niks totdat bekend is of iemand is ingelogd,
  // anders flitst het inlogscherm even op bij een geldige sessie.
  if (laden) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}
