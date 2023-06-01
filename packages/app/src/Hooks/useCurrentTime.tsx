import {useContext, createContext, useState, useEffect} from 'react';

export const CurrentTimeContext = createContext<number | null>(null);

export const CurrentTimeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return <CurrentTimeContext.Provider value={currentTime}>{children}</CurrentTimeContext.Provider>;
};

export const useCurrentTime = () => {
  return useContext(CurrentTimeContext);
};
