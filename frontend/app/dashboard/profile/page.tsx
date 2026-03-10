"use client";

import { useState, useEffect } from "react";
import { getUserFromToken } from "@/lib/auth";
import { API_BASE } from "@/lib/api";
import dynamic from "next/dynamic";
import { 
  User, Bell, Palette, Globe, Shield, HelpCircle, Upload, 
  Moon, Sun, Monitor, Check, X, Mail, Phone, MapPin, Briefcase,
  Settings, Lock, Eye, EyeOff, Download, Trash2
} from "lucide-react";

const RoleGuard = dynamic(() => import("@/components/RoleGuard"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[40vh]">
      <p className="text-slate-500">Loading...</p>
    </div>
  ),
});

export default function ProfilePage() {
  const [user, setUser] = useState<{ id?: string; email?: string; role?: string; avatarUrl?: string; name?: string } | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Profile state
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    lawFirm: "",
    barNumber: ""
  });

  // Notifications state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    caseUpdates: true,
    legalUpdates: false,
    marketingEmails: false,
    weeklyDigest: true
  });

  // Appearance state
  const [appearance, setAppearance] = useState({
    theme: "light",
    fontSize: "medium",
    sidebarCollapsed: false,
    highContrast: false
  });

  // Language state
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const currentUser = getUserFromToken();
    setUser(currentUser);
    setAvatarUrl(currentUser?.avatarUrl || "");
    if (currentUser) {
      setProfileData(prev => ({
        ...prev,
        email: currentUser.email || "",
        firstName: (currentUser as any).name?.split(' ')[0] || "",
        lastName: (currentUser as any).name?.split(' ')[1] || ""
      }));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem('access');
      const formData = new FormData();
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      } else if (avatarUrl) {
        formData.append('avatar_url', avatarUrl);
      }

      const res = await fetch(`${API_BASE}/auth/profile/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to update profile');

      const data = await res.json();
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setMessage("Profile picture updated successfully!");
      setAvatarFile(null);
      setPreviewUrl("");
    } catch (error) {
      setMessage("Failed to update profile picture");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem('access');
      const res = await fetch(`${API_BASE}/auth/profile/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!res.ok) throw new Error('Failed to update profile');

      const data = await res.json();
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "language", label: "Language", icon: Globe },
    { id: "privacy", label: "Data & Privacy", icon: Shield },
    { id: "help", label: "Help & Support", icon: HelpCircle }
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <div className="border border-slate-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Profile Picture</h3>
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            {(previewUrl || avatarUrl) ? (
              <img
                src={previewUrl || avatarUrl}
                alt="Profile"
                className="h-20 w-20 rounded-full object-cover border-2 border-slate-200"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-slate-200 flex items-center justify-center border-2 border-slate-200">
                <span className="text-2xl font-medium text-slate-600">
                  {profileData.firstName?.charAt(0).toUpperCase() || profileData.email?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-600 mb-2">
              Upload a profile picture to personalize your account.
            </p>
            <p className="text-xs text-slate-500">
              Recommended: Square image, at least 200x200px
            </p>
          </div>
        </div>

        <form onSubmit={handleAvatarUpdate} className="space-y-4">
          <div>
            <label htmlFor="avatarFile" className="block text-sm font-medium text-slate-700 mb-1">
              Upload Profile Picture
            </label>
            <input
              type="file"
              id="avatarFile"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}
            >
              {loading ? "Updating..." : "Update Picture"}
            </button>
            {previewUrl && (
              <button
                type="button"
                onClick={() => {
                  setPreviewUrl("");
                  setAvatarFile(null);
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility'
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Personal Information */}
      <div className="border border-slate-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h3>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={profileData.firstName}
                onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility'
                }}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={profileData.lastName}
                onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility'
                }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={profileData.email}
              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={profileData.phone}
              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={profileData.location}
              onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="City, Country"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
              placeholder="Tell us about yourself..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              style={{
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="lawFirm" className="block text-sm font-medium text-slate-700 mb-1">
                Law Firm
              </label>
              <input
                type="text"
                id="lawFirm"
                value={profileData.lawFirm}
                onChange={(e) => setProfileData(prev => ({ ...prev, lawFirm: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility'
                }}
              />
            </div>
            <div>
              <label htmlFor="barNumber" className="block text-sm font-medium text-slate-700 mb-1">
                Bar Number
              </label>
              <input
                type="text"
                id="barNumber"
                value={profileData.barNumber}
                onChange={(e) => setProfileData(prev => ({ ...prev, barNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility'
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="border border-slate-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {Object.entries({
            emailNotifications: "Email Notifications",
            pushNotifications: "Push Notifications",
            caseUpdates: "Case Updates",
            legalUpdates: "Legal Updates",
            marketingEmails: "Marketing Emails",
            weeklyDigest: "Weekly Digest"
          }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-900">{label}</h4>
                <p className="text-sm text-slate-600">
                  {key === 'emailNotifications' && "Receive notifications via email"}
                  {key === 'pushNotifications' && "Receive push notifications in your browser"}
                  {key === 'caseUpdates' && "Get updates about your ongoing cases"}
                  {key === 'legalUpdates' && "Stay informed about legal news and updates"}
                  {key === 'marketingEmails' && "Receive promotional emails and offers"}
                  {key === 'weeklyDigest' && "Get a weekly summary of your activities"}
                </p>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications[key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-slate-200'
                }`}
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility'
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications[key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div className="border border-slate-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Appearance Settings</h3>
        <div className="space-y-6">
          {/* Theme Selection */}
          <div>
            <h4 className="font-medium text-slate-900 mb-3">Theme</h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "light", label: "Light", icon: Sun },
                { value: "dark", label: "Dark", icon: Moon },
                { value: "system", label: "System", icon: Monitor }
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setAppearance(prev => ({ ...prev, theme: value }))}
                  className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                    appearance.theme === value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <h4 className="font-medium text-slate-900 mb-3">Font Size</h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "small", label: "Small" },
                { value: "medium", label: "Medium" },
                { value: "large", label: "Large" }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setAppearance(prev => ({ ...prev, fontSize: value }))}
                  className={`p-3 border rounded-lg transition-colors ${
                    appearance.fontSize === value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                >
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Other Settings */}
          <div className="space-y-3">
            {[
              { key: 'sidebarCollapsed', label: 'Collapse sidebar by default' },
              { key: 'highContrast', label: 'High contrast mode' }
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900">{label}</span>
                <button
                  onClick={() => setAppearance(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    appearance[key as keyof typeof appearance] ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      appearance[key as keyof typeof appearance] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLanguageTab = () => (
    <div className="space-y-6">
      <div className="border border-slate-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Language Settings</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-slate-700 mb-2">
              Display Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
              <option value="ja">Japanese</option>
            </select>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Language preferences will apply to the interface. Legal documents will remain in their original language.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div className="border border-slate-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Data & Privacy Settings</h3>
        <div className="space-y-6">
          {/* Data Export */}
          <div>
            <h4 className="font-medium text-slate-900 mb-3">Data Management</h4>
            <div className="space-y-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                <Download className="h-4 w-4" />
                Export Your Data
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                <Trash2 className="h-4 w-4" />
                Delete Account
              </button>
            </div>
          </div>

          {/* Privacy Settings */}
          <div>
            <h4 className="font-medium text-slate-900 mb-3">Privacy Controls</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-slate-900">Profile Visibility</span>
                  <p className="text-xs text-slate-600">Control who can see your profile</p>
                </div>
                <select className="px-3 py-1 border border-slate-300 rounded text-sm">
                  <option>Everyone</option>
                  <option>Lawyers Only</option>
                  <option>Private</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-slate-900">Search Engine Indexing</span>
                  <p className="text-xs text-slate-600">Allow search engines to index your profile</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Security */}
          <div>
            <h4 className="font-medium text-slate-900 mb-3">Security</h4>
            <div className="space-y-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                <Lock className="h-4 w-4" />
                Change Password
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                <Shield className="h-4 w-4" />
                Two-Factor Authentication
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHelpTab = () => (
    <div className="space-y-6">
      <div className="border border-slate-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Help & Support</h3>
        <div className="space-y-6">
          {/* Quick Help */}
          <div>
            <h4 className="font-medium text-slate-900 mb-3">Quick Help</h4>
            <div className="space-y-3">
              <button className="w-full text-left p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="font-medium text-slate-900">Getting Started Guide</div>
                <div className="text-sm text-slate-600">Learn how to use Legal Intel effectively</div>
              </button>
              <button className="w-full text-left p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="font-medium text-slate-900">FAQ</div>
                <div className="text-sm text-slate-600">Find answers to common questions</div>
              </button>
              <button className="w-full text-left p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="font-medium text-slate-900">Video Tutorials</div>
                <div className="text-sm text-slate-600">Watch step-by-step video guides</div>
              </button>
            </div>
          </div>

          {/* Contact Support */}
          <div>
            <h4 className="font-medium text-slate-900 mb-3">Contact Support</h4>
            <div className="space-y-3">
              <button className="w-full text-left p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="font-medium text-slate-900">Email Support</div>
                <div className="text-sm text-slate-600">support@legalintel.com</div>
              </button>
              <button className="w-full text-left p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="font-medium text-slate-900">Live Chat</div>
                <div className="text-sm text-slate-600">Chat with our support team</div>
              </button>
              <button className="w-full text-left p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="font-medium text-slate-900">Schedule a Call</div>
                <div className="text-sm text-slate-600">Book a consultation with our experts</div>
              </button>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-medium text-slate-900 mb-3">Resources</h4>
            <div className="space-y-3">
              <button className="w-full text-left p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="font-medium text-slate-900">Documentation</div>
                <div className="text-sm text-slate-600">Comprehensive platform documentation</div>
              </button>
              <button className="w-full text-left p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="font-medium text-slate-900">Community Forum</div>
                <div className="text-sm text-slate-600">Connect with other legal professionals</div>
              </button>
              <button className="w-full text-left p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="font-medium text-slate-900">API Documentation</div>
                <div className="text-sm text-slate-600">Developer resources and API reference</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <RoleGuard allowed={["ADMIN", "LAWYER", "STUDENT_LAWYER", "JUDGE", "RESEARCHER"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
          <p className="text-slate-600 mt-1">Manage your account information and preferences</p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-lg ${
            message.includes("success") 
              ? "bg-green-50 border border-green-200 text-green-800" 
              : "bg-red-50 border border-red-200 text-red-800"
          }`}>
            {message}
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="border border-slate-200 rounded-lg shadow-sm">
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                    }`}
                    style={{
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility'
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "profile" && renderProfileTab()}
            {activeTab === "notifications" && renderNotificationsTab()}
            {activeTab === "appearance" && renderAppearanceTab()}
            {activeTab === "language" && renderLanguageTab()}
            {activeTab === "privacy" && renderPrivacyTab()}
            {activeTab === "help" && renderHelpTab()}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}