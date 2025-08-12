'use client';

import { useState, useEffect } from 'react';

interface ProfessionalUser {
  id: string;
  name: string;
  email: string;
  title: string;
  availability: 'online' | 'busy' | 'offline';
}

export function useProfessionalAuth() {
  const [isProfessional, setIsProfessional] = useState(false);
  const [professionalUser, setProfessionalUser] = useState<ProfessionalUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkProfessionalAuth();
  }, []);

  const checkProfessionalAuth = () => {
    try {
      // Check if professional token exists
      const professionalToken = localStorage.getItem('professional_token');
      const professionalData = localStorage.getItem('professional_data');

      if (professionalToken && professionalData) {
        try {
          const professional = JSON.parse(professionalData);
          setProfessionalUser(professional);
          setIsProfessional(true);
        } catch (error) {
          // Invalid data, clear it
          localStorage.removeItem('professional_token');
          localStorage.removeItem('professional_data');
          setIsProfessional(false);
          setProfessionalUser(null);
        }
      } else {
        setIsProfessional(false);
        setProfessionalUser(null);
      }
    } catch (error) {
      console.error('Professional auth check failed:', error);
      setIsProfessional(false);
      setProfessionalUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signOutProfessional = () => {
    localStorage.removeItem('professional_token');
    localStorage.removeItem('professional_data');
    setIsProfessional(false);
    setProfessionalUser(null);
  };

  return {
    isProfessional,
    professionalUser,
    isLoading,
    checkProfessionalAuth,
    signOutProfessional
  };
}