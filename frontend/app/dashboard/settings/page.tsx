/**
 * Settings Page
 * User settings and preferences
 */

'use client';

import { useState } from 'react';
import { User, Bell, Shield, Palette, Globe, Database, HelpCircle } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    research_updates: true,
    module_completions: true,
    ai_responses: true,
    system_updates: false
  });
  const [profileData, setProfileData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@judicial-ai.com',
    phone: '+234-800-000-0000',
    role: 'Student Lawyer',
    bio: ''
  });

  const handleSaveProfile = () => {
    console.log('Saving profile:', profileData);
  };

  const handleSaveNotifications = () => {
    console.log('Saving notifications:', notifications);
  };

  const handleSaveSecurity = () => {
    console.log('Saving security settings');
  };

  const handleSaveAppearance = () => {
    console.log('Saving appearance settings');
  };

  const handleSaveLanguage = () => {
    console.log('Saving language settings');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'data', label: 'Data & Privacy', icon: Database },
    { id: 'help', label: 'Help & Support', icon: HelpCircle }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                  <select 
                    value={profileData.role}
                    onChange={(e) => setProfileData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility'
                    }}
                  >
                    <option value="Student Lawyer">Student Lawyer</option>
                    <option value="Lawyer">Lawyer</option>
                    <option value="Researcher">Researcher</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                  <textarea
                    value={profileData.bio || ''}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Tell us about yourself..."
                    style={{
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility'
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={handleSaveProfile} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Save Profile
              </button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Notification Preferences</h3>
            
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900 capitalize">
                      {key.replace(/_/g, ' ')}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {key === 'email' && 'Receive email notifications'}
                      {key === 'push' && 'Receive push notifications in browser'}
                      {key === 'research_updates' && 'Get notified about new research articles'}
                      {key === 'module_completions' && 'Track your learning progress'}
                      {key === 'ai_responses' && 'Get notified when AI assistant responds'}
                      {key === 'system_updates' && 'Receive important system announcements'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${
                      value ? 'bg-blue-600' : 'bg-slate-200'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-0'
                      }`}></div>
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button onClick={handleSaveNotifications} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Save Preferences
              </button>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Security Settings</h3>
            
            <div className="space-y-6">
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-2">Change Password</h4>
                <p className="text-sm text-slate-600 mb-4">Enter your current password and new password to update your account security</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Change Password
                </button>
              </div>
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-2">Two-Factor Authentication</h4>
                <p className="text-sm text-slate-600 mb-4">Add an extra layer of security to your account</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Appearance Settings</h3>
            
            <div className="space-y-6">
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-2">Theme</h4>
                <div className="grid grid-cols-3 gap-4">
                  <button className="p-4 border-2 border-blue-500 rounded-lg text-center">
                    <div className="w-8 h-8 bg-white border border-slate-300 rounded mx-auto mb-2"></div>
                    <span className="text-sm">Light</span>
                  </button>
                  <button className="p-4 border border-slate-200 rounded-lg text-center hover:border-slate-300">
                    <div className="w-8 h-8 bg-slate-900 rounded mx-auto mb-2"></div>
                    <span className="text-sm">Dark</span>
                  </button>
                  <button className="p-4 border border-slate-200 rounded-lg text-center hover:border-slate-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-white to-slate-900 rounded mx-auto mb-2"></div>
                    <span className="text-sm">Auto</span>
                  </button>
                </div>
              </div>
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-2">Font Size</h4>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}>
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                  <option>Extra Large</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'language':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Language Settings</h3>
            
            <div className="space-y-6">
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-2">Display Language</h4>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}>
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <HelpCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Coming Soon</h3>
            <p className="text-slate-600">This section is under development</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600">Manage your account settings and preferences</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
    </div>
  );
}
