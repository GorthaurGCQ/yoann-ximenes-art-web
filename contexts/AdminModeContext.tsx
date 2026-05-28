'use client';

import { createContext, useContext, useMemo, useState } from 'react';

interface AdminModeContextValue {
  isAdmin: boolean;
  setIsAdmin: (next: boolean) => void;
}

const AdminModeContext = createContext<AdminModeContextValue | null>(null);

export function AdminModeProvider({
  children,
  initialIsAdmin,
}: {
  children: React.ReactNode;
  initialIsAdmin: boolean;
}) {
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);
  const value = useMemo(() => ({ isAdmin, setIsAdmin }), [isAdmin]);

  return <AdminModeContext.Provider value={value}>{children}</AdminModeContext.Provider>;
}

export function useAdminMode() {
  const ctx = useContext(AdminModeContext);
  if (!ctx) {
    throw new Error('useAdminMode must be used inside AdminModeProvider');
  }
  return ctx;
}
