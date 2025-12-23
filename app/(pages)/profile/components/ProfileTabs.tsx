'use client';

import { User, Key, BarChart3, Settings } from 'lucide-react';
import ProfileTab from './tabs/ProfileTab';
import SecurityTab from './tabs/SecurityTab';
import ActivityTab from './tabs/ActivityTab';
import PreferencesTab from './tabs/PreferencesTab';

type TabKey = 'profile' | 'security' | 'activity' | 'preferences';

interface ProfileTabsProps {
  activeTab: TabKey;
  onChangeTab: (tab: TabKey) => void;

  // Profile tab props
  isEditing: boolean;
  isLoading: boolean;
  formData: any;
  setFormData: (data: any) => void;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;

  // Security tab
  onChangePassword: () => void;

  // Activity tab
  activityLogs: any[];
}

export default function ProfileTabs({
  activeTab,
  onChangeTab,
  isEditing,
  isLoading,
  formData,
  setFormData,
  onEdit,
  onCancel,
  onSave,
  onChangePassword,
  activityLogs,
}: ProfileTabsProps) {
  const tabs: { id: TabKey; icon: any; label: string }[] = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'security', icon: Key, label: 'Security' },
    { id: 'activity', icon: BarChart3, label: 'Activity' },
    { id: 'preferences', icon: Settings, label: 'Preferences' },
  ];

  return (
    <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg">
      {/* TAB HEADERS */}
      <div className="flex border-b overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`flex items-center px-6 py-4 border-b-2 whitespace-nowrap transition-all
              ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
          >
            <tab.icon className="h-4 w-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="p-8">
        {activeTab === 'profile' && (
          <ProfileTab
            isEditing={isEditing}
            isLoading={isLoading}
            formData={formData}
            setFormData={setFormData}
            onEdit={onEdit}
            onCancel={onCancel}
            onSave={onSave}
          />
        )}

        {activeTab === 'security' && (
          <SecurityTab onChangePassword={onChangePassword} />
        )}

        {activeTab === 'activity' && (
          <ActivityTab logs={activityLogs} />
        )}

        {activeTab === 'preferences' && <PreferencesTab />}
      </div>
    </div>
  );
}
