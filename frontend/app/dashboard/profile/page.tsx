"use client";

import { useState, useEffect } from "react";
import { getUserFromToken } from "@/lib/auth";
import { API_BASE } from "@/lib/api";
import dynamic from "next/dynamic";

const RoleGuard = dynamic(() => import("@/components/RoleGuard"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[40vh]">
      <p className="text-slate-500">Loading...</p>
    </div>
  ),
});

export default function ProfilePage() {
  const [user, setUser] = useState<{ id?: string; email?: string; role?: string; avatarUrl?: string } | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const currentUser = getUserFromToken();
    setUser(currentUser);
    setAvatarUrl(currentUser?.avatarUrl || "");
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
        // Fallback to URL if no file selected
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
      // Update localStorage with the new user data
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

  return (
    <RoleGuard allowed={["ADMIN", "LAWYER", "STUDENT_LAWYER", "JUDGE", "RESEARCHER"]}>
      <div className="space-y-8 max-w-2xl mx-auto">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Profile Settings</h1>
          <p className="text-slate-500 mt-1">Manage your account information and preferences</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Profile Picture</h2>

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
                    {user?.email?.charAt(0).toUpperCase() || "U"}
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
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div className="border-t border-slate-200 pt-4">
              <label htmlFor="avatarUrl" className="block text-sm font-medium text-slate-700 mb-1">
                Or provide Profile Picture URL
              </label>
              <input
                type="url"
                id="avatarUrl"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            {message && (
              <div className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Profile Picture"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <p className="text-sm text-slate-600">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Role</label>
              <p className="text-sm text-slate-600">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}