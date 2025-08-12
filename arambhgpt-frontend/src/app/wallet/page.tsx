'use client';

import React from 'react';
import { WalletDashboard } from '@/components/wallet/WalletDashboard';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { PageLayout } from '@/components/layout/PageLayout';

export default function WalletPage() {
  return (
    <AuthGuard>
      <PageLayout>
        <WalletDashboard />
      </PageLayout>
    </AuthGuard>
  );
}