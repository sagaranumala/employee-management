'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/auth/AuthContext';
import ProfileHeader from './components/ProfileHeader';
import ProfileSidebar from './components/ProfileSidebar';
import ProfileTabs from './components/ProfileTabs';
import ProfilePicModal from './components/modals/ProfilePicModal';
import ChangePasswordModal from './components/modals/ChangePasswordModal';
import LogoutConfirmModal from './components/modals/LogoutConfirmModal';

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, logout, loading } = useAuth();

  // Tabs & form state
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'activity' | 'preferences'>('profile');
  const [employee, setEmployee] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    departmentName: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);

  // Modals
  const [showProfilePicModal, setShowProfilePicModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && (!user || !token)) {
      router.replace('/auth/login');
    }
  }, [user, token, loading]);

  // Example: load employee data
  useEffect(() => {
    if (user) {
      // Replace this with your actual API call
      const fetchEmployee = async () => {
        setIsLoading(true);
        try {
          // Fake API response
          const data = {
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            role: 'Employee',
            departmentName: 'Engineering',
          };
          setEmployee(data);
          setFormData(data);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchEmployee();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ProfileHeader
        user={user}
        onLogout={() => setShowLogoutConfirm(true)}
      />

      <main className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <ProfileSidebar
          user={user}
          employee={employee}
          onEditPic={() => setShowProfilePicModal(true)}
        />

        <ProfileTabs
          activeTab={activeTab}
          onChangeTab={setActiveTab}

          // Profile tab
          isEditing={isEditing}
          isLoading={isLoading}
          formData={formData}
          setFormData={setFormData}
          onEdit={() => setIsEditing(true)}
          onCancel={() => {
            setIsEditing(false);
            setFormData(employee); // Reset form to original
          }}
          onSave={() => {
            console.log('Saving', formData);
            setEmployee(formData); // Update employee data
            setIsEditing(false);
          }}

          // Security tab
          onChangePassword={() => setShowPasswordModal(true)}

          // Activity tab
          activityLogs={activityLogs}
        />
      </main>

      {/* Modals */}
      <ProfilePicModal
        open={showProfilePicModal}
        employee={employee}
        onClose={() => setShowProfilePicModal(false)}
      />

      <ChangePasswordModal
        open={showPasswordModal}
        token={token}
        onClose={() => setShowPasswordModal(false)}
        onLogout={logout}
      />

      <LogoutConfirmModal
        open={showLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={logout}
      />
    </div>
  );
}
