'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PatientExpertChat } from '@/components/communication/PatientExpertChat';
import { useProfessional } from '@/hooks/useProfessional';

export default function ConsultationPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const { isAuthenticated: isProfessionalAuthenticated } = useProfessional();

  return (
    <div className="h-screen">
      <PatientExpertChat 
        sessionId={sessionId} 
        isExpert={isProfessionalAuthenticated}
      />
    </div>
  );
}