'use client';

import React from 'react';
import { ProfessionalWalletDashboard } from '@/components/professional/ProfessionalWalletDashboard';
import { PageLayout } from '@/components/layout/PageLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function ProfessionalWalletPage() {
  return (
    <AuthGuard requireProfessional>
      <PageLayout>
        <ProfessionalWalletDashboard />
      </PageLayout>
    </AuthGuard>
  );
}