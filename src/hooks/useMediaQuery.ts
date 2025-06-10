// hooks/useMediaQuery.ts
"use client";
import { useMediaQuery } from 'react-responsive'; 
import { useEffect, useState } from 'react';

export const useIsDesktop = () => {
  const [isClient, setIsClient] = useState(false);
  const isDesktop = useMediaQuery({ minWidth: 768 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? isDesktop : false;
};

export const useIsMobile = () => {
  const [isClient, setIsClient] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? isMobile : true; // Default to mobile durante SSR
};