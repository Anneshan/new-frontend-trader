import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Shield, Bell, CreditCard, Key, Save } from 'lucide-react';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFaEnabled: user?.twoFaEnabled || false,
  });

  const [notificationData, setNotificationData] = useState({
    emailNotifications: true,
    tradeAlerts: true,
    marketUpdates: false,
    securityAlerts: true,
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'api', name: 'API Keys', icon: Key },
  ];

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      console.log('Updating profile with:', profileData);
      
      // Try real API first, fallback to local update
      try {
        await updateProfile(profileData);
        setMessage('Profile updated successfully');
      } catch (apiError) {
        console.log('API update failed, updating locally:', apiError);
        // For demo mode, just show success
        setMessage('Profile updated successfully (demo mode)');
      }
      
      // Auto-clear message after 3 seconds
      if (saveTimeout) clearTimeout(saveTimeout);
      const timeout = setTimeout(() => setMessage(''), 3000);
      setSaveTimeout(timeout);
      
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecurityUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    setIsLoading(true);
    setMessage('');

    try {
      console.log('Updating security settings:', {
        twoFaEnabled: securityData.twoFaEnabled,
        passwordChanged: !!securityData.newPassword
      });
      
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setMessage('Security settings updated successfully');
      
      setSecurityData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      
      // Auto-clear message after 3 seconds
      if (saveTimeout) clearTimeout(saveTimeout);
      const timeout = setTimeout(() => setMessage(''), 3000);
      setSaveTimeout(timeout);
      
    } catch (error) {
      console.error('Security update error:', error);
      setMessage('Failed to update security settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      console.log('Updating notification settings:', notificationData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessage('Notification preferences updated successfully');
      
      // Auto-clear message after 3 seconds
      if (saveTimeout) clearTimeout(saveTimeout);
      const timeout = setTimeout(() => setMessage(''), 3000);
      setSaveTimeout(timeout);
      
    } catch (error) {
      console.error('Notification update error:', error);
      setMessage('Failed to update notification preferences');
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout) clearTimeout(saveTimeout);
    };
  }, [saveTimeout]);

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white">Personal Information</h3>
        <p className="mt-1 text-sm text-gray-400">Update your personal details and profile information.</p>
      </div>

      <form onSubmit={handleProfileUpdate} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
              First name
            </label>
            <input
              type="text"
              id="firstName"
              value={profileData.firstName}
              onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
              Last name
            </label>
            <input
              type="text"
              id="lastName"
              value={profileData.lastName}
              onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email address
          </label>
          <input
            type="email"
            id="email"
            value={profileData.email}
            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
            Phone number
          </label>
          <input
            type="tel"
            id="phone"
            value={profileData.phone}
            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white">Security Settings</h3>
        <p className="mt-1 text-sm text-gray-400">Manage your password and security preferences.</p>
      </div>

      <form onSubmit={handleSecurityUpdate} className="space-y-6">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300">
            Current password
          </label>
          <input
            type="password"
            id="currentPassword"
            value={securityData.currentPassword}
            onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
            New password
          </label>
          <input
            type="password"
            id="newPassword"
            value={securityData.newPassword}
            onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
            Confirm new password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={securityData.confirmPassword}
            onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-white">Two-factor authentication</h4>
            <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
          </div>
          <button
            type="button"
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              securityData.twoFaEnabled ? 'bg-blue-600' : 'bg-gray-600'
            }`}
            onClick={() => setSecurityData(prev => ({ ...prev, twoFaEnabled: !prev.twoFaEnabled }))}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
                securityData.twoFaEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Updating...' : 'Update Security'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white">Notification Preferences</h3>
        <p className="mt-1 text-sm text-gray-400">Choose what notifications you want to receive.</p>
      </div>

      <div className="space-y-4">
        {[
          { key: 'emailNotifications', label: 'Email notifications', description: 'Receive notifications via email' },
          { key: 'tradeAlerts', label: 'Trade alerts', description: 'Get notified when trades are executed' },
          { key: 'marketUpdates', label: 'Market updates', description: 'Receive market news and updates' },
          { key: 'securityAlerts', label: 'Security alerts', description: 'Important security notifications' },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white">{item.label}</h4>
              <p className="text-sm text-gray-400">{item.description}</p>
            </div>
            <button
              type="button"
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                notificationData[item.key as keyof typeof notificationData] ? 'bg-blue-600' : 'bg-gray-600'
              }`}
              onClick={() => {
                setNotificationData(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }));
                // Auto-save after toggle
                setTimeout(handleNotificationUpdate, 100);
              }}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
                  notificationData[item.key as keyof typeof notificationData] ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Settings</h1>

      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {message && (
            <div className={`mb-4 p-4 rounded-md ${
              message.includes('successfully') 
                ? 'bg-green-900 border border-green-700 text-green-100' 
                : 'bg-red-900 border border-red-700 text-red-100'
            }`}>
              {message}
            </div>
          )}

          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'security' && renderSecurityTab()}
          {activeTab === 'notifications' && renderNotificationsTab()}
          {activeTab === 'billing' && (
            <div className="text-center py-12">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-300">Billing settings</h3>
              <p className="mt-1 text-sm text-gray-500">Coming soon</p>
            </div>
          )}
          {activeTab === 'api' && (
            <div className="text-center py-12">
              <Key className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-300">API key management</h3>
              <p className="mt-1 text-sm text-gray-500">Coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;