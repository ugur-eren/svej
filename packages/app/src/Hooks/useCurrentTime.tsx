import {useContext, createContext, useState, useEffect} from 'react';

export const CurrentTimeContext = createContext<number>(Date.now());

export const CurrentTimeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [currentTime, setCurrentTime] = useState<number>(Date.now);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 30_000);

    return () => clearInterval(interval);
  }, []);

  return <CurrentTimeContext.Provider value={currentTime}>{children}</CurrentTimeContext.Provider>;
};

export const useCurrentTime = () => {
  return useContext(CurrentTimeContext);
};
