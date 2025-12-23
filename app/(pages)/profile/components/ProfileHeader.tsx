import { LogOut, CheckCircle } from 'lucide-react';

export default function ProfileHeader({ user, onLogout }: any) {
  return (
    <div className="container mx-auto px-6 pt-10 mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold">My Profile</h1>
        <p className="text-gray-600">Manage your account</p>
      </div>

      <div className="flex items-center gap-4">
        <span className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
          <CheckCircle className="h-4 w-4 mr-1" /> Active
        </span>
        <button
          onClick={onLogout}
          className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
        >
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </button>
      </div>
    </div>
  );
}
