import './globals.css';
import { AuthProvider } from '../src/auth/AuthContext';
import { Header } from '../src/components/Header';

export const metadata = {
  title: 'Inventory UI',
  description: 'Next.js UI for Yii backend',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 min-h-screen flex flex-col">
        <AuthProvider>
          {/* Sticky Header */}
          <Header />

          {/* Main content */}
          <main className="flex-1">
            <div className="w-full max-w-[1400px] mx-auto">{children}</div>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
