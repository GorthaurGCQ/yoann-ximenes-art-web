'use client';

import { usePathname } from 'next/navigation';

function isStudioRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    pathname.startsWith('/studio-x9/edit') ||
    pathname === '/studio-x9/login' ||
    pathname === '/studio-x9'
  );
}

export function ConditionalNavbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (isStudioRoute(pathname)) return null;
  return <>{children}</>;
}

export function ConditionalFooter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (isStudioRoute(pathname)) return null;
  return <>{children}</>;
}

export function ConditionalAdminControls({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (isStudioRoute(pathname)) return null;
  return <>{children}</>;
}
