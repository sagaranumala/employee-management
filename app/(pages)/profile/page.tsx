'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, Calendar, LogOut, Edit, Save, X, 
  CheckCircle, Package, ShoppingBag, BarChart3, Settings, 
  Bell, MapPin, Link as LinkIcon, Eye, EyeOff, Key, 
  AlertCircle, Building, Check, Shield, QrCode, Copy,
  Trash2, RefreshCw, ShieldAlert, ShieldCheck, Lock
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/src/auth/AuthContext';
import { api, API_BASE, ApiResponse, fetchCsrf, uploadFile } from '@/src/lib/api';
import { useToast } from '../components/toast';
import { addCsrfHeader, appendCsrfToFormData, fetchCsrfToken, getCsrfToken } from '@/src/lib/csrf';
import { handlePasswordChange } from '../employees/action';
import dynamic from 'next/dynamic';

// Dynamically import QRCode component to avoid SSR issues
const QRCodeSVG = dynamic(() => import('qrcode.react').then(mod => mod.QRCodeSVG), {
  ssr: false,
  loading: () => <div className="w-48 h-48 bg-gray-100 animate-pulse rounded-lg" />
});

// Mock updateProfile and changePassword functions since they're not in AuthContext
const updateProfile = async (data: any) => {
  // Implement your profile update API call here
  console.log('Updating profile:', data);
};

interface TwoFAData {
  userId: string;
  enable: boolean;
}

interface TwoFASecret {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
  createdAt: string;
}

export default function ProfilePage() {
  const toast = useToast();
  const router = useRouter();
  const { user, logout, token: jwtToken, loading } = useAuth();
  
  // State variables
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [employee, setEmployee] = useState<any>();
  
  // 2FA State
  const [is2FAEnabled, setIs2FAEnabled] = useState<boolean>(false);
  const [is2FALoading, setIs2FALoading] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [show2FADisableModal, setShow2FADisableModal] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [twoFASecret, setTwoFASecret] = useState<TwoFASecret | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isGeneratingBackupCodes, setIsGeneratingBackupCodes] = useState(false);
  
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
  
  // Profile picture state
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [isProfilePicModal, setIsProfilePicModal] = useState(false);

  // Initialize form data and check 2FA status
  useEffect(() => {
    if (loading) return; // Wait until auth is resolved
    
    if (!user || !jwtToken) {
      router.replace('/auth/login');
      return;
    }
    
    console.log('User:', user, 'Token:', jwtToken);
    
    // Set 2FA status from user object
    setIs2FAEnabled(Boolean(user?.twoFA || user?.isTwoFactorEnabled));
    
    setFormData({
      name: user?.name || 'John Doe',
      email: user?.email || 'john@example.com',
      phone: user?.phone || '+1 (555) 123-4567',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      website: 'https://techcorp.com',
      bio: 'Inventory manager with 5+ years of experience in supply chain optimization and stock management.'
    });
    
    // Load backup codes if they exist in localStorage
    const savedBackupCodes = localStorage.getItem('2fa_backup_codes');
    if (savedBackupCodes) {
      setBackupCodes(JSON.parse(savedBackupCodes));
    }
  }, [user, jwtToken, loading, router]);

const fetch2FASetup = async (token: string) => {
  const toast = useToast();
  try {
    if (!token) {
      toast.error("Authentication required");
      return { success: false, message: "Authentication required" };
    }

    // Ensure CSRF token is available
    if (!getCsrfToken()) await fetchCsrfToken();

    const formData = new FormData();
    // Add CSRF token
    appendCsrfToFormData(formData);

    const res = await fetch(`${API_BASE}auth/enable2FA`, {
      method: "POST",
      credentials: "include",
      body: formData,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Authorization": `Bearer ${jwtToken}`,
        ...addCsrfHeader(),
      },
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to load 2FA setup");
    }

    setTwoFASecret(data.data);
    setShow2FAModal(true);

    return data;
  } catch (err: any) {
    console.error("Failed to fetch 2FA setup:", err);
    toast.error(err.message || "Failed to load 2FA setup");
    return { success: false, message: err.message };
  }
};

const verify2FA = async (
  // token: string,
  // verificationCode: string,
  // twoFASecret: any,
  // setIs2FAEnabled: any,
  // setShow2FAModal: any,
  // setBackupCodes: any,
  // refreshUser?: () => Promise<void>
) => {
  const toast = useToast();
  if (!verificationCode || verificationCode.length !== 6) {
    toast.error("Please enter a valid 6-digit code");
    return { success: false, message: "Invalid code" };
  }

  try {
    if (!getCsrfToken()) await fetchCsrfToken();

    const formData = new FormData();
    formData.append("code", verificationCode);
    if (twoFASecret?.secret) formData.append("secret", twoFASecret.secret);
    appendCsrfToFormData(formData);

    const res = await fetch(`${API_BASE}auth/confirm2FA`, {
      method: "POST",
      credentials: "include",
      body: formData,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Authorization": `Bearer ${jwtToken}`,
        ...addCsrfHeader(),
      },
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Invalid verification code");
    }

    if (data.data.backupCodes) {
      setBackupCodes(data.data.backupCodes);
      localStorage.setItem("2fa_backup_codes", JSON.stringify(data.data.backupCodes));
    }

    setIs2FAEnabled(true);
    setShow2FAModal(false);

    // if (refreshUser) await refreshUser();

    toast.success("Two-Factor Authentication enabled successfully!");
    return data;
  } catch (err: any) {
    console.error("Failed to verify 2FA:", err);
    toast.error(err.message || "Invalid verification code");
    return { success: false, message: err.message };
  }
};

const disable2FA = async (
  // token: string,
  // userId: string,
  // setIs2FAEnabled: any,
  // setShow2FADisableModal: any,
  // setBackupCodes: any,
  // refreshUser?: () => Promise<void>
) => {
  const toast = useToast();
  try {
    if (!jwtToken) {
      toast.error("Authentication required");
      return { success: false, message: "Authentication required" };
    }

    if (!getCsrfToken()) await fetchCsrfToken();

    const formData = new FormData();
    formData.append("userId",user?.userId);
    appendCsrfToFormData(formData);

    const res = await fetch(`${API_BASE}auth/disable2FA`, {
      method: "POST",
      credentials: "include",
      body: formData,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Authorization": `Bearer ${jwtToken}`,
        ...addCsrfHeader(),
      },
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to disable 2FA");
    }

    setIs2FAEnabled(false);
    setShow2FADisableModal(false);
    setBackupCodes([]);
    localStorage.removeItem("2fa_backup_codes");

    // if (refreshUser) await refreshUser();

    toast.success("Two-Factor Authentication disabled successfully");
    return data;
  } catch (err: any) {
    console.error("Failed to disable 2FA:", err);
    toast.error(err.message || "Failed to disable 2FA");
    return { success: false, message: err.message };
  }
};

  // Generate new backup codes
  const generateBackupCodes = async () => {
    if (!jwtToken) {
      toast.error('Authentication required');
      return;
    }
    
    setIsGeneratingBackupCodes(true);
    try {
      if (!getCsrfToken()) {
        await fetchCsrfToken();
      }
      
      const csrfToken = getCsrfToken();
      
      const response = await fetch(`${API_BASE}auth/generate-backup-codes`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'X-CSRF-TOKEN': csrfToken || '',
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to generate backup codes');
      }
      
      setBackupCodes(data.data.backupCodes);
      localStorage.setItem('2fa_backup_codes', JSON.stringify(data.data.backupCodes));
      
      toast.success('New backup codes generated successfully');
      setShowBackupCodes(true);
    } catch (error: any) {
      console.error('Failed to generate backup codes:', error);
      toast.error(error.message || 'Failed to generate backup codes');
    } finally {
      setIsGeneratingBackupCodes(false);
    }
  };

  // Copy backup codes to clipboard
  const copyBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeText(codesText)
      .then(() => {
        toast.success('Backup codes copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        toast.error('Failed to copy backup codes');
      });
  };

  // Download backup codes
  const downloadBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '2fa-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Backup codes downloaded');
  };

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

  const handleSubmit = async () => {
    setIsLoading(true);
    const result = await handlePasswordChange(passwordData, jwtToken);
    if (result.success) {
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordModal(false);
    }
    setIsLoading(false);
  };

  const getEmployeeIdFromUser = async (): Promise<any> => {
    try {
      const data = await api<ApiResponse<any>>('employee/findByUser', {
        method: 'GET',
      });
      
      if (!data.success) {
        console.error(data.message || 'Employee not found');
        return null;
      }
      
      setEmployee(data.data);
      return data.data;
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
      console.log('Starting profile upload for employee:', employee.employeeId);
      
      const uploadRes: any = await uploadFile(
        '/profile/upload',
        profilePic,
        'profile',
        { employeeId: employee.employeeId }
      );
      
      console.log('Upload response:', uploadRes);
      
      if (!uploadRes?.success) {
        throw new Error(uploadRes?.message || 'File upload failed');
      }
      
      const profileUrl = uploadRes.fileUrl || uploadRes.filePath || uploadRes.profilePicture;
      
      if (!profileUrl) {
        throw new Error('Uploaded file URL not returned');
      }
      
      console.log('File uploaded successfully. URL:', profileUrl);
      
      toast.success('Profile picture updated successfully');
      
      if (profileUrl.startsWith('http')) {
        setProfilePicPreview(profileUrl);
      }
      
      setIsProfilePicModal(false);
      setTimeout(() => {
        getEmployeeIdFromUser();
      }, 1000);
    } catch (error: any) {
      console.error('Profile picture upload error:', error);
      const message = error?.message || 'Unable to update profile picture. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  useEffect(() => {
    getEmployeeIdFromUser();
  }, [user]);

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
      <main className="pt-5">
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
                  <CheckCircle className="h-3 w-3 mr-1" /> Active
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
                  <div className="relative mb-6">
                    {employee?.profilePicture ? (
                      <img
                        src={employee.profilePicture}
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
                        Joined {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
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
                      className={`flex items-center px-6 py-4 border-b-2 transition-all whitespace-nowrap ${activeTab === 'profile' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                    >
                      <User className="h-5 w-5 mr-2" />
                      Profile
                    </button>
                    <button
                      onClick={() => setActiveTab('security')}
                      className={`flex items-center px-6 py-4 border-b-2 transition-all whitespace-nowrap ${activeTab === 'security' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                    >
                      <Key className="h-5 w-5 mr-2" />
                      Security
                    </button>
                    <button
                      onClick={() => setActiveTab('activity')}
                      className={`flex items-center px-6 py-4 border-b-2 transition-all whitespace-nowrap ${activeTab === 'activity' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                    >
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Activity
                    </button>
                    <button
                      onClick={() => setActiveTab('preferences')}
                      className={`flex items-center px-6 py-4 border-b-2 transition-all whitespace-nowrap ${activeTab === 'preferences' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
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
                        {/* Form fields remain the same */}
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
                            <div className="flex items-center space-x-3">
                              {is2FAEnabled ? (
                                <>
                                  <button
                                    onClick={() => setShow2FADisableModal(true)}
                                    disabled={is2FALoading}
                                    className="flex items-center px-4 py-2.5 border-2 border-red-300 text-red-600 font-medium rounded-xl hover:border-red-400 transition disabled:opacity-50"
                                  >
                                    <Lock className="h-4 w-4 mr-2" />
                                    {is2FALoading ? 'Processing...' : 'Disable 2FA'}
                                  </button>
                                  <button
                                    onClick={() => setShowBackupCodes(true)}
                                    className="flex items-center px-4 py-2.5 bg-blue-50 text-blue-600 font-medium rounded-xl hover:bg-blue-100 transition"
                                  >
                                    <Shield className="h-4 w-4 mr-2" />
                                    Backup Codes
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={fetch2FASetup}
                                  disabled={is2FALoading}
                                  className="flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  {is2FALoading ? 'Setting up...' : 'Enable 2FA'}
                                </button>
                              )}
                            </div>
                          </div>
                          {is2FAEnabled && (
                            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                              <div className="flex items-center">
                                <ShieldCheck className="h-5 w-5 text-green-600 mr-2" />
                                <span className="text-green-700 font-medium">
                                  Two-Factor Authentication is active for your account
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Backup Codes Card (only shown when 2FA is enabled) */}
                        {is2FAEnabled && backupCodes.length > 0 && (
                          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="text-lg font-bold text-gray-900">Backup Codes</h4>
                                <p className="text-gray-600">
                                  Save these codes in a secure place. Each code can be used once.
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={generateBackupCodes}
                                  disabled={isGeneratingBackupCodes}
                                  className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:border-gray-400 transition disabled:opacity-50"
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  {isGeneratingBackupCodes ? 'Generating...' : 'Regenerate'}
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {backupCodes.slice(0, 4).map((code, index) => (
                                <div key={index} className="p-3 bg-white border border-gray-200 rounded-lg font-mono text-center">
                                  {code}
                                </div>
                              ))}
                            </div>
                            <button
                              onClick={() => setShowBackupCodes(true)}
                              className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                              View all backup codes →
                            </button>
                          </div>
                        )}

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

                  {/* Activity Tab (unchanged) */}
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

                  {/* Preferences Tab (unchanged) */}
                  {activeTab === 'preferences' && (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Preferences</h3>
                      <div className="space-y-6">
                        {/* Notifications and Language/Region sections remain the same */}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      
      {/* 2FA Setup Modal */}
      {show2FAModal && twoFASecret && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 backdrop-blur-sm">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-5 max-w-xl w-full" // ⬅ reduced padding & width
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          Set up Two-Factor Authentication
        </h3>
        <button
          onClick={() => {
            setShow2FAModal(false);
            setVerificationCode('');
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-2"> {/* ⬅ reduced spacing */}

        {/* Step 1 */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Step 1: Scan QR Code
          </h4>
          <div className="bg-gray-50 p-1 rounded-xl flex flex-col items-center">
            <div className="mb-2 p-2 bg-white rounded-lg shadow-sm">
              {twoFASecret.qrCodeUrl && (
                 <QRCodeSVG
                    value={twoFASecret.qrCodeUrl}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />

                // <QRCodeSVG
                //   value={twoFASecret.qrCodeUrl}
                //   size={150} // ⬅ reduced from 200
                //   level="H"
                //   includeMargin
                // />
              )}
            </div>
            <p className="text-xs text-gray-600 text-center">
              Scan with Google Authenticator or Authy
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Step 2: Manual Entry
          </h4>
          <div className="bg-gray-50 p-3 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-700">Secret Key</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(twoFASecret.secret);
                  toast.success('Copied');
                }}
                className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </button>
            </div>
            <div className="p-2 bg-white border rounded-lg font-mono text-xs text-center break-all">
              {twoFASecret.secret}
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Step 3: Verify
          </h4>

          <input
            type="text"
            value={verificationCode}
            onChange={(e) =>
              setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))
            }
            placeholder="000000"
            className="w-full px-3 py-2 text-center text-lg font-mono tracking-widest border rounded-xl focus:ring-2 focus:ring-indigo-500"
            maxLength={6}
          />

          <div className="flex space-x-3 mt-3">
            <button
              onClick={() => {
                setShow2FAModal(false);
                setVerificationCode('');
              }}
              className="flex-1 px-3 py-2 border text-sm rounded-xl"
            >
              Cancel
            </button>

            <button
              onClick={verify2FA}
              disabled={isVerifying || verificationCode.length !== 6}
              className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-xl disabled:opacity-50"
            >
              {isVerifying ? 'Verifying...' : 'Verify & Enable'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  </div>
)}

      {/* 2FA Disable Confirmation Modal */}
      {show2FADisableModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Disable Two-Factor Authentication</h3>
              <p className="text-gray-600">
                Are you sure you want to disable 2FA? This will remove the extra security layer from your account.
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShow2FADisableModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:border-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={disable2FA}
                disabled={is2FALoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transition disabled:opacity-50"
              >
                {is2FALoading ? 'Disabling...' : 'Yes, Disable'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Backup Codes Modal */}
      {showBackupCodes && backupCodes.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Backup Codes</h3>
                <p className="text-gray-600 mt-1">
                  Save these codes in a secure place. Each code can be used once if you lose access to your authenticator app.
                </p>
              </div>
              <button
                onClick={() => setShowBackupCodes(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-800 font-medium mb-1">Important</p>
                  <p className="text-yellow-700 text-sm">
                    These backup codes are shown only once. Save them now! If you lose them,
                    you can generate new codes, but the old ones will stop working.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
              {backupCodes.map((code, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-lg font-mono text-center text-sm hover:bg-gray-100 transition"
                >
                  {code}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={copyBackupCodes}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:border-gray-400 transition"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy All Codes
              </button>
              <button
                onClick={downloadBackupCodes}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition"
              >
                <Save className="h-4 w-4 mr-2" />
                Download Codes
              </button>
              <button
                onClick={generateBackupCodes}
                disabled={isGeneratingBackupCodes}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-white border-2 border-red-300 text-red-600 font-medium rounded-xl hover:border-red-400 transition disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {isGeneratingBackupCodes ? 'Generating...' : 'Regenerate All'}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                Store these codes securely. Consider printing them or saving them in a password manager.
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Logout Confirmation Modal (unchanged) */}
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

      {/* Change Password Modal (unchanged) */}
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
              {/* Password fields remain the same */}
            </div>
            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:border-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
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

      {/* Profile Picture Modal (unchanged) */}
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
                  className={`flex-1 px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center space-x-2 transition-all duration-200 ${isLoading || !profilePic ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                  {isLoading ? (
                    <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
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
    </div>
  );
}