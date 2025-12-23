import { Mail, Phone, Edit } from 'lucide-react';

export default function ProfileSidebar({ user, employee, onEditPic }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
      <div className="relative mb-6">
        {employee?.profilePicture ? (
          <img
            src={employee.profilePicture}
            className="w-32 h-32 rounded-full object-cover mx-auto"
          />
        ) : (
          <div className="w-32 h-32 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl">
            {user.name?.[0]}
          </div>
        )}

        <button
          onClick={onEditPic}
          className="absolute bottom-3 right-1/2 translate-x-16 bg-white p-2 rounded-full shadow hover:scale-110"
        >
          <Edit className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      <h2 className="text-xl font-bold">{user.name}</h2>
      <p className="text-gray-500 mb-4">{user.role}</p>

      <div className="space-y-2 text-left">
        <div className="flex items-center text-gray-600">
          <Mail className="h-4 w-4 mr-2" /> {user.email}
        </div>
        <div className="flex items-center text-gray-600">
          <Phone className="h-4 w-4 mr-2" /> {user.phone}
        </div>
      </div>
    </div>
  );
}
