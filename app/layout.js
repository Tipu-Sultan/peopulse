import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ReduxProvider } from "@/redux/ReduxProvider";
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import MobileNav from '@/components/layout/MobileNav';
import ClientProvider from './ClientProvider';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { OnlineUsersProvider } from '@/context/OnlineUsersContext';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata() {
  return {
    title: 'Peopulse.com | A Modern Social Media Platform',
    description: 'Peopulse is a next-generation social media platform for seamless interaction and engagement.',
    keywords: 'social media, networking, Peopulse, online community, friends, chat',
    openGraph: {
      title: 'Peopulse.com | A Modern Social Media Platform',
      description: 'Peopulse is a next-generation social media platform for seamless interaction and engagement.',
      url: 'https://peopulse.com',
      type: 'website',
      images: [
        {
          url: 'https://peopulse.com/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Peopulse Social Media Banner',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Peopulse.com | A Modern Social Media Platform',
      description: 'Peopulse is a next-generation social media platform for seamless interaction and engagement.',
      images: ['https://peopulse.com/images/og-image.jpg'],
    },
  };
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="MgAlLUfNQ_EqUemSJdUo_t6xAWPCvcvQEQkMO4LJBho" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Peopulse Team" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ReduxProvider>
            <ClientProvider>
              <div className="min-h-screen bg-background">
                <Toaster />
                {session && <Sidebar />}
                {session && <Topbar />}
                <OnlineUsersProvider userId={session?.user?.id}>
                  <main className={session ? 'pt-16 pb-16 md:pb-0 md:ml-64' : ''}>
                    <div className="container mx-auto px-4 py-6">
                      {children}
                    </div>
                  </main>
                </OnlineUsersProvider>
                {session && <MobileNav />}
              </div>
            </ClientProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
