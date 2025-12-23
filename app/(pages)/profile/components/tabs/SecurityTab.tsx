import { Key } from 'lucide-react';

export default function SecurityTab({
  onChangePassword,
}: {
  onChangePassword: () => void;
}) {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">Security Settings</h3>

      <div className="bg-indigo-50 p-6 rounded-xl flex justify-between">
        <div>
          <h4 className="font-bold">Password</h4>
          <p className="text-gray-600">
            Change your password to keep account secure
          </p>
        </div>

        <button
          onClick={onChangePassword}
          className="px-5 py-2 bg-indigo-600 text-white rounded-xl"
        >
          <Key className="h-4 w-4 mr-2 inline" />
          Change Password
        </button>
      </div>
    </div>
  );
}
