'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Calendar,
  LogOut,
  Edit,
  Save,
  X,
  CheckCircle,
  Package,
  ShoppingBag,
  BarChart3,
  Settings,
  Bell,
  MapPin,
  Link as LinkIcon,
  Eye,
  EyeOff,
  Key,
  AlertCircle,
  Building,
  Check
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/src/auth/AuthContext';
import { api, API_BASE, uploadFile } from '@/src/lib/api';
import { useToast } from '../components/toast';

// Mock updateProfile and changePassword functions since they're not in AuthContext
const updateProfile = async (data: any) => {
  // Implement your profile update API call here
  console.log('Updating profile:', data);
};

const changePassword = async (currentPassword: string, newPassword: string) => {
  // Implement your password change API call here
  console.log('Changing password:', { currentPassword, newPassword });
};

export default function ProfilePage() {
  const toast = useToast();
  const router = useRouter();
  const { user, logout,token,loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [employee, setEmployee] = useState<any>();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    website: '',
    bio: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordError, setPasswordError] = useState('');

  // Profile picture
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [isProfilePicModal, setIsProfilePicModal] = useState(false);


//   if(!user || !token){ 
//     router.push('/auth/login');
//    }

   useEffect(() => {
  if (loading) return; // wait until auth is resolved

  if (!user || !token) {
    router.replace('/auth/login');
  }
  console.log('User:', user, 'Token:', token);  
  setFormData({
      name: user?.name || 'John Doe',
      email: user?.email || 'john@example.com',
      phone: user?.phone || '+1 (555) 123-4567',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      website: 'https://techcorp.com',
      bio: 'Inventory manager with 5+ years of experience in supply chain optimization and stock management.'
    });
}, [user, token, loading, router]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSaveProfile = async () => {
  //   setIsLoading(true);
  //   try {
  //     await updateProfile(formData);
  //     setIsEditing(false);
  //   } catch (error) {
  //     console.error('Failed to update profile:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handlePasswordChange = async () => {
  // Validation (same as before)
  if (!passwordData.currentPassword) {
    setPasswordError('Current password is required');
    return;
  }

  if (!passwordData.newPassword) {
    setPasswordError('New password is required');
    return;
  }

  if (passwordData.newPassword !== passwordData.confirmPassword) {
    setPasswordError('New passwords do not match');
    return;
  }

  if (passwordData.newPassword.length < 6) {
    setPasswordError('Password must be at least 6 characters long');
    return;
  }

  if (passwordData.currentPassword === passwordData.newPassword) {
    setPasswordError('New password must be different from current password');
    return;
  }

  setIsLoading(true);
  setPasswordError('');

  try {
    // Make API call WITHOUT userId in body
    const response = await fetch('http://localhost:8080/index.php?r=auth/updatePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // JWT token will identify the user
      },
      body: JSON.stringify({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        // NO userId here - server gets it from token
      }),
    });

    // Check for redirect (302 status)
    if (response.redirected) {
      throw new Error('Request was redirected. Check if CSRF is disabled for this endpoint.');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to change password');
    }

    // Success - clear form and close modal
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordModal(false);

    alert('Password changed successfully! Please login again with your new password.');

    // Force logout for security
    logout();

  } catch (error: any) {
    // Handle specific error messages
    let errorMessage = 'Failed to change password';

    if (error.message.includes('302') || error.message.includes('redirected')) {
      errorMessage = 'Server configuration issue. Contact administrator.';
    } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      errorMessage = 'Session expired. Please login again.';
      logout();
    } else if (error.message.includes('403')) {
      errorMessage = 'Current password is incorrect';
    } else if (error.message.includes('400')) {
      errorMessage = error.message.replace('Bad Request: ', '');
    } else {
      errorMessage = error.message || 'Failed to change password';
    }

    setPasswordError(errorMessage);
  } finally {
    setIsLoading(false);
  }
};


const getEmployeeIdFromUser = async (): Promise<any> => {
  try {
    const response = await fetch('http://localhost:8080/index.php?r=employee/findByUser', {
      method: 'POST', // JWT token identifies the user
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // send JWT token automatically
      },
      credentials: 'include',
      body: JSON.stringify({}) // no userId needed
    });

    const data = await response.json();
    setEmployee(data.data);

    if (!response.ok || !data.success) {
      console.error(data.message || 'Employee not found');
      return null;
    }
  } catch (err) {
    console.error('Failed to fetch employee ID:', err);
    return null;
  }
};



const handleUploadProfilePic = async () => {
  if (!profilePic) {
    toast.error('Please select a profile picture');
    return;
  }

  if (!employee?.employeeId) {
    toast.error('Employee information missing');
    return;
  }

  setIsLoading(true);

  try {
    /* =========================
       1️⃣ Upload file to server
    ========================== */
    const uploadRes: any = await uploadFile('/profile/upload', profilePic);

    if (!uploadRes?.success) {
      throw new Error(uploadRes?.message || 'File upload failed');
    }

    const profileUrl = uploadRes.fileUrl || uploadRes.filePath;

    if (!profileUrl) {
      throw new Error('Uploaded file URL not returned');
    }

    /* =========================
       2️⃣ Update employee record
    ========================== */
    const updateRes: any = await api('employee/update', {
      method: 'POST',
      body: {
        employeeId: employee.employeeId,
        employee: {
          profilePicture: profileUrl,
        },
      },
    });

    if (!updateRes?.success) {
      throw new Error(updateRes?.message || 'Failed to update profile picture');
    }

    /* =========================
       3️⃣ UI success updates
    ========================== */
    toast.success('Profile picture updated successfully');

    setProfilePicPreview(
      profileUrl.startsWith('http')
        ? profileUrl
        : `${API_BASE}/${profileUrl}`
    );

    setIsProfilePicModal(false);

  } catch (error: any) {
    console.error('Profile picture upload error:', error);

    // Friendly messages for UI
    const message =
      error?.message ||
      'Unable to update profile picture. Please try again.';

    toast.error(message);

  } finally {
    setIsLoading(false);
  }
};


// if (!profilePic) return;
//               setIsLoading(true);
//               try {
//                 const res =await uploadFile('/profile/upload', profilePic);
//                 if (res.success) {
//                   toast.success('Profile picture uploaded successfully');
//                   // Update preview or user state
//                   setProfilePicPreview(res.filePath ? `${API_BASE}/${res.filePath}` : null);
//                   setIsProfilePicModal(false); // Close modal after success
//                 } else {
//                   toast.error(res.message || 'Upload failed');
//                 }
//               } catch (err: any) {
//                 toast.error(err.message || 'Something went wrong');
//               } finally {
//                 setIsLoading(false);
//               }

// const handleUploadProfilePic = async () => {
//   if (!profilePic) {
//     console.warn('No file selected');
//     return;
//   }

//   try {
//     const uploadRes = await uploadFile('/profile/upload', profilePic);

//     const url = uploadRes.fileUrl || uploadRes.filePath;

//     console.log("url",url);

//     const res = await api('employee/update', {
//       method: 'POST',
//       body: {
//         employeeId: employee.employeeId, // must be inside the POST body
//         employee: {
//           employeeId: employee?.employeeId,
//           profilePicture: url, // save URL in employee record
//         },
//       },
//    } )
//     console.log('Upload successful:', uploadRes);
//   } catch (err: any) {
//     console.error('Upload failed:', err.message);
//   }
// };



  const handleLogout = () => {
    logout();
    router.push('/');
  };

  useEffect(() => {
    getEmployeeIdFromUser();  
  }, [user]);

 // Profile picture handlers
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert('Image must be under 2MB');
        return;
      }
      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  // const handleUploadProfilePic = async () => {
  //   if (!profilePic) return;
  //   setIsLoading(true);

  //   const form = new FormData();
  //   form.append('profilePic', profilePic);

  //   try {
  //     await updateProfile(form);
  //     setIsProfilePicModal(false);
  //     alert('Profile picture updated successfully!');
  //   } catch (err) {
  //     console.error(err);
  //     alert('Failed to update profile picture');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  const stats = [
    { label: 'Total Products', value: '1,245', icon: Package, color: 'bg-blue-500', change: '+12%' },
    { label: 'Active Orders', value: '48', icon: ShoppingBag, color: 'bg-green-500', change: '+5%' },
    { label: 'Monthly Revenue', value: '$24,580', icon: BarChart3, color: 'bg-purple-500', change: '+18%' },
    { label: 'Warehouses', value: '12', icon: Building, color: 'bg-orange-500', change: '+2' },
  ];

  const activityLogs = [
    { action: 'Added new product', time: '2 hours ago', icon: Package, color: 'bg-blue-100 text-blue-600' },
    { action: 'Updated inventory levels', time: '4 hours ago', icon: Settings, color: 'bg-green-100 text-green-600' },
    { action: 'Created purchase order', time: '1 day ago', icon: ShoppingBag, color: 'bg-purple-100 text-purple-600' },
    { action: 'Generated monthly report', time: '2 days ago', icon: BarChart3, color: 'bg-yellow-100 text-yellow-600' },
    { action: 'Updated profile settings', time: '3 days ago', icon: User, color: 'bg-pink-100 text-pink-600' },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation */}
      {/* <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">StockFlow</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600 transition">
                Dashboard
              </Link>
              <Link href="/employees" className="text-gray-600 hover:text-indigo-600 transition">
                Employees
              </Link>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav> */}

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
                <p className="text-gray-600">Manage your account settings and preferences</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                  {user.userId || 'User123'}
                </span>
                <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex flex-col items-center text-center">
                  {/* <div className="relative mb-6">
                    <div className="w-32 h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                      {user.name?.[0]?.toUpperCase() || 'J'}
                    </div>
                    <button 
                      // onClick={() => setIsEditing(!isEditing)}
                      onClick={() => setIsProfilePicModal(true)}
                      className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Edit className="h-4 w-4 text-gray-600" />
                    </button>
                  </div> */}

                  <div className="relative mb-6">
                    {employee?.profilePicture ? (
                      <img
                        src={employee.profilePicture} // presigned URL from backend
                        alt={`${user.name} profile`}
                        className="w-32 h-32 rounded-full object-cover shadow-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                        {user.name?.[0]?.toUpperCase() || 'J'}
                      </div>
                    )}

                    <button 
                      onClick={() => setIsProfilePicModal(true)}
                      className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Edit className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>


                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {formData.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{user.role || 'Inventory Manager'}</p>
                  
                  <div className="w-full space-y-3">
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-700">{formData.email}</span>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-700">{formData.phone}</span>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-700">
                        Joined {new Date().toLocaleDateString('en-US', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition group">
                      <div className="flex items-center">
                        <div className={`${stat.color} p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform`}>
                          <stat.icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{stat.label}</p>
                          <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                        </div>
                      </div>
                      <span className="text-green-600 text-sm font-medium">{stat.change}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <div className="flex overflow-x-auto">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`flex items-center px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                        activeTab === 'profile'
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <User className="h-5 w-5 mr-2" />
                      Profile
                    </button>
                    <button
                      onClick={() => setActiveTab('security')}
                      className={`flex items-center px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                        activeTab === 'security'
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Key className="h-5 w-5 mr-2" />
                      Security
                    </button>
                    <button
                      onClick={() => setActiveTab('activity')}
                      className={`flex items-center px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                        activeTab === 'activity'
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Activity
                    </button>
                    <button
                      onClick={() => setActiveTab('preferences')}
                      className={`flex items-center px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                        activeTab === 'preferences'
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Settings className="h-5 w-5 mr-2" />
                      Preferences
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-8">
                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <div>
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
                        {!isEditing ? (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all hover:scale-105"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                          </button>
                        ) : (
                          <div className="flex space-x-3">
                            <button
                              onClick={() => setIsEditing(false)}
                              className="flex items-center px-4 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:border-gray-400 transition"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </button>
                            <button
                              onClick={handleSave}
                              disabled={isLoading}
                              className="flex items-center px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                            >
                              {isLoading ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save className="h-4 w-4 mr-2" />
                                  Save Changes
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="Enter your name"
                            />
                          ) : (
                            <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                              {formData.name}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          {isEditing ? (
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="Enter your email"
                            />
                          ) : (
                            <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                              {formData.email}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          {isEditing ? (
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="Enter your phone number"
                            />
                          ) : (
                            <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                              {formData.phone}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={formData.company}
                              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="Enter your company"
                            />
                          ) : (
                            <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                              {formData.company}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={formData.location}
                              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="Enter your location"
                            />
                          ) : (
                            <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                              {formData.location}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Website
                          </label>
                          {isEditing ? (
                            <input
                              type="url"
                              value={formData.website}
                              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="Enter your website"
                            />
                          ) : (
                            <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                              <LinkIcon className="h-4 w-4 mr-2 text-gray-400" />
                              <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                                {formData.website}
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bio
                          </label>
                          {isEditing ? (
                            <textarea
                              value={formData.bio}
                              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                              rows={4}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="Tell us about yourself"
                            />
                          ) : (
                            <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                              {formData.bio}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Tab */}
                  {activeTab === 'security' && (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h3>
                      
                      <div className="space-y-6">
                        {/* Password Change Card */}
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">Password</h4>
                              <p className="text-gray-600">Change your password regularly to keep your account secure</p>
                            </div>
                            <button
                              onClick={() => setShowPasswordModal(true)}
                              className="flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"
                            >
                              <Key className="h-4 w-4 mr-2" />
                              Change Password
                            </button>
                          </div>
                        </div>

                        {/* Two-Factor Authentication */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">Two-Factor Authentication</h4>
                              <p className="text-gray-600">Add an extra layer of security to your account</p>
                            </div>
                            <button className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:border-gray-400 transition">
                              Enable 2FA
                            </button>
                          </div>
                        </div>

                        {/* Security Logs */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                          <h4 className="text-lg font-bold text-gray-900 mb-4">Recent Security Activity</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                                <span>Successful login from Chrome on Windows</span>
                              </div>
                              <span className="text-gray-500 text-sm">2 hours ago</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                                <span>Password changed successfully</span>
                              </div>
                              <span className="text-gray-500 text-sm">1 week ago</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Activity Tab */}
                  {activeTab === 'activity' && (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h3>
                      
                      <div className="space-y-4">
                        {activityLogs.map((log, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition group"
                          >
                            <div className="flex items-center">
                              <div className={`${log.color} p-2 rounded-lg mr-4 group-hover:scale-110 transition-transform`}>
                                <log.icon className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{log.action}</p>
                                <p className="text-sm text-gray-600">{log.time}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-8 text-center">
                        <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                          View All Activity →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Preferences Tab */}
                  {activeTab === 'preferences' && (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Preferences</h3>
                      
                      <div className="space-y-6">
                        {/* Notifications */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">Notifications</h4>
                              <p className="text-gray-600">Configure how you receive notifications</p>
                            </div>
                            <Bell className="h-5 w-5 text-indigo-600" />
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900">Email Notifications</p>
                                <p className="text-sm text-gray-600">Receive updates via email</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                              </label>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900">Push Notifications</p>
                                <p className="text-sm text-gray-600">Receive browser notifications</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Language & Region */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                          <h4 className="text-lg font-bold text-gray-900 mb-4">Language & Region</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                              <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option>English (US)</option>
                                <option>Spanish</option>
                                <option>French</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                              <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option>UTC-05:00 Eastern Time</option>
                                <option>UTC-08:00 Pacific Time</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Logout</h3>
              <p className="text-gray-600">Are you sure you want to logout?</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:border-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transition"
              >
                Yes, Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {passwordError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-600">{passwordError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:border-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:shadow-lg transition disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                  </>
                ) : (
                  'Change Password'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}


{isProfilePicModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl p-6 w-80 shadow-2xl"
    >
      <h3 className="text-xl font-semibold mb-6 text-center">Update Profile Picture</h3>

      <div className="flex flex-col items-center space-y-4">
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 shadow-md">
          {profilePicPreview ? (
            <img src={profilePicPreview} alt="Preview" className="w-full h-full object-cover transition-all duration-300" />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 font-medium">
              Preview
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleProfilePicChange}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 cursor-pointer"
        />

        <div className="flex space-x-4 w-full justify-center mt-2">
          <button
            onClick={() => setIsProfilePicModal(false)}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </button>

          <button
            onClick={handleUploadProfilePic}
            disabled={isLoading || !profilePic}
            className={`flex-1 px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center space-x-2 transition-all duration-200
              ${isLoading || !profilePic ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
            `}
          >
            {isLoading ? (
              <svg
                className="w-5 h-5 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              <Check className="h-4 w-4" />
            )}
            <span>{isLoading ? 'Uploading...' : 'Save'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  </div>
)}

      

         {/* Profile Pic Modal */}
     {/* {isProfilePicModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-6 w-80 shadow-2xl"
          >
            <h3 className="text-xl font-semibold mb-6 text-center">Update Profile Picture</h3>

            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 shadow-md">
                {profilePicPreview ? (
                  <img src={profilePicPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 font-medium">
                    Preview
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 cursor-pointer"
              />

              <div className="flex space-x-4 w-full justify-center mt-2">
                <button
                  onClick={() => setIsProfilePicModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>

                <button
                  onClick={handleUploadProfilePic}
                  disabled={isLoading || !profilePic}
                  className={`flex-1 px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center space-x-2 transition-all duration-200
                    ${isLoading || !profilePic ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
                  `}
                >
                  {isLoading ? (
                    <svg
                      className="w-5 h-5 text-white animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  <span>{isLoading ? 'Uploading...' : 'Save'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )} */}

      

    </div>
  );
}