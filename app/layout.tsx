import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AdminModeProvider } from '@/contexts/AdminModeContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminFloatingControls from '@/components/cms/AdminFloatingControls';
import {
  ConditionalAdminControls,
  ConditionalFooter,
  ConditionalNavbar,
} from '@/components/layout/ConditionalSiteChrome';
import { getAdminSessionFromCookies } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'YOANN XIMENES - Artiste Contemporain',
  description:
    "Site officiel de Yoann Ximenes, artiste plasticien qui transforme le son en sculptures et installations.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSessionFromCookies();

  return (
    <html lang="fr" dir="ltr">
      <body className="font-sans antialiased text-stone-100 bg-stone-950">
        <AdminModeProvider initialIsAdmin={Boolean(session)}>
          <LanguageProvider>
            <ConditionalNavbar>
              <Navbar />
            </ConditionalNavbar>
            {children}
            <ConditionalFooter>
              <Footer />
            </ConditionalFooter>
            <ConditionalAdminControls>
              <AdminFloatingControls />
            </ConditionalAdminControls>
          </LanguageProvider>
        </AdminModeProvider>
      </body>
    </html>
  );
}
