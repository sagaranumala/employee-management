import Link from 'next/link';
import { useAuth } from '../src/auth/AuthContext';
import WelcomePage from './(pages)/dashboard/page';

export default function Page() {
  return (
    <div className="container">
      <WelcomePage/>
    </div>
  );
}
