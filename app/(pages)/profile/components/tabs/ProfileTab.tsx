import { Edit, Save, X, MapPin, Link as LinkIcon } from 'lucide-react';

interface Props {
  isEditing: boolean;
  isLoading: boolean;
  formData: any;
  setFormData: (data: any) => void;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function ProfileTab({
  isEditing,
  isLoading,
  formData,
  setFormData,
  onEdit,
  onCancel,
  onSave,
}: Props) {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900">
          Personal Information
        </h3>

        {!isEditing ? (
          <button
            onClick={onEdit}
            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border rounded-xl"
            >
              <X className="h-4 w-4 mr-2 inline" />
              Cancel
            </button>

            <button
              onClick={onSave}
              disabled={isLoading}
              className="px-5 py-2 bg-green-600 text-white rounded-xl"
            >
              {isLoading ? 'Saving...' : <Save className="h-4 w-4 inline mr-2" />}
              Save
            </button>
          </div>
        )}
      </div>

      {/* FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['name', 'email', 'phone', 'company'].map((field) => (
          <div key={field}>
            <label className="block text-sm mb-2 capitalize">{field}</label>
            {isEditing ? (
              <input
                value={formData[field]}
                onChange={(e) =>
                  setFormData({ ...formData, [field]: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-xl"
              />
            ) : (
              <div className="px-4 py-3 bg-gray-50 rounded-xl">
                {formData[field]}
              </div>
            )}
          </div>
        ))}

        <div>
          <label className="block text-sm mb-2">Location</label>
          <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            {formData.location}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2">Website</label>
          <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
            <LinkIcon className="h-4 w-4 mr-2 text-gray-400" />
            {formData.website}
          </div>
        </div>
      </div>
    </div>
  );
}
