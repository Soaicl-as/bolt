import React, { createContext, useContext, useState, ReactNode } from 'react';

interface InstagramContextType {
  isLoggedIn: boolean;
  username: string;
  setLoggedIn: (status: boolean, username?: string) => void;
  logout: () => void;
}

const defaultContext: InstagramContextType = {
  isLoggedIn: false,
  username: '',
  setLoggedIn: () => {},
  logout: () => {},
};

const InstagramContext = createContext<InstagramContextType>(defaultContext);

export const useInstagram = () => useContext(InstagramContext);

interface InstagramProviderProps {
  children: ReactNode;
}

export const InstagramProvider = ({ children }: InstagramProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    localStorage.getItem('instagram_auth') ? true : false
  );
  const [username, setUsername] = useState<string>(
    localStorage.getItem('instagram_username') || ''
  );

  const setLoggedIn = (status: boolean, newUsername?: string) => {
    if (status && newUsername) {
      localStorage.setItem('instagram_auth', 'true');
      localStorage.setItem('instagram_username', newUsername);
      setUsername(newUsername);
    }
    setIsLoggedIn(status);
  };

  const logout = () => {
    localStorage.removeItem('instagram_auth');
    localStorage.removeItem('instagram_username');
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <InstagramContext.Provider
      value={{
        isLoggedIn,
        username,
        setLoggedIn,
        logout,
      }}
    >
      {children}
    </InstagramContext.Provider>
  );
};