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
      <body className="bg-gray-100 min-h-screen flex flex-col ">
        <AuthProvider>
          <Header />
          <main className="flex-1 flex justify-center items-start pl-[5%] pr-[5%] mt-12 md:p-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
