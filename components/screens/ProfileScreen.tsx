'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase';

export default function ProfileScreen() {
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, any>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push('/signin');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userDocRef);

        let profile: Record<string, any> = {};

        if (userSnap.exists()) {
          const data = userSnap.data();

          profile = {
            uid: firebaseUser.uid,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            name:
              data.name ||
              `${data.firstName || ''} ${data.lastName || ''}`.trim() ||
              firebaseUser.displayName ||
              'User',
            email: data.email || firebaseUser.email || '',
            phone: data.phone || '',
            bio: data.bio || '',
            location: data.location || '',
            age: data.age || '',
            height: data.height || '',
            currentWeight: data.currentWeight || '',
            targetWeight: data.targetWeight || '',
            photoURL: data.photoURL || firebaseUser.photoURL || null,
            streak: data.streak ?? 0,                       // ← added streak
            lastStreakIncrement: data.lastStreakIncrement,  // optional – can show "last claimed"
            memberSince: data.createdAt
              ? new Date(data.createdAt.toDate?.() || data.createdAt).toLocaleDateString('default', {
                  month: 'long',
                  year: 'numeric',
                })
              : 'Unknown',
            membershipType: data.membershipType || 'Starter',
          };
        } else {
          profile = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || null,
            streak: 0,
            memberSince: new Date().toLocaleDateString('default', { month: 'long', year: 'numeric' }),
            membershipType: 'Starter',
          };
        }

        setUserData(profile);
        setEditForm(profile);
        setPreviewImage(profile.photoURL);
      } catch (err: any) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);

    setEditForm((prev) => ({ ...prev, photoFile: file }));
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;

    setSaving(true);
    setError(null);

    try {
      let updatedPhotoURL = userData.photoURL;

      if (editForm.photoFile) {
        setUploadingPhoto(true);
        const file = editForm.photoFile;
        const storageRef = ref(storage, `profile-pictures/${auth.currentUser.uid}/${Date.now()}_${file.name}`);

        await uploadBytes(storageRef, file);
        updatedPhotoURL = await getDownloadURL(storageRef);
        setUploadingPhoto(false);
      }

      const authUpdates: { displayName?: string; photoURL?: string | null } = {};
      if (editForm.name?.trim() !== userData.name) {
        authUpdates.displayName = editForm.name.trim();
      }
      if (updatedPhotoURL !== userData.photoURL) {
        authUpdates.photoURL = updatedPhotoURL;
      }
      if (Object.keys(authUpdates).length > 0) {
        await updateProfile(auth.currentUser, authUpdates);
      }

      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const nameParts = (editForm.name || '').trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      await updateDoc(userDocRef, {
        firstName,
        lastName,
        name: editForm.name?.trim() || null,
        email: editForm.email?.trim() || null,
        phone: editForm.phone?.trim() || null,
        bio: editForm.bio?.trim() || null,
        location: editForm.location?.trim() || null,
        age: editForm.age ? Number(editForm.age) : null,
        height: editForm.height?.trim() || null,
        currentWeight: editForm.currentWeight?.trim() || null,
        targetWeight: editForm.targetWeight?.trim() || null,
        photoURL: updatedPhotoURL || null,
        updatedAt: new Date(),
      });

      const refreshedData = {
        ...editForm,
        name: editForm.name?.trim(),
        firstName,
        lastName,
        photoURL: updatedPhotoURL,
        photoFile: undefined,
      };

      setUserData(refreshedData);
      setEditForm(refreshedData);
      setPreviewImage(updatedPhotoURL);
      setIsEditing(false);

      alert('Profile updated successfully!');
    } catch (err: any) {
      console.error('Profile save error:', err);
      setError('Failed to save profile: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
      setUploadingPhoto(false);
    }
  };

  const handleCancel = () => {
    setEditForm({ ...userData });
    setPreviewImage(userData.photoURL);
    setIsEditing(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-2xl animate-pulse">Loading your profile...</div>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-400 text-center px-4">
        {error}
      </div>
    );
  }

  const profile = userData || {};
  const streak = Number(profile.streak) || 0;

  const editableFields = [
    { label: 'Full Name', key: 'name', type: 'text' },
    { label: 'Bio', key: 'bio', type: 'textarea' },
    { label: 'Phone', key: 'phone', type: 'tel' },
    { label: 'Location', key: 'location', type: 'text' },
    { label: 'Age', key: 'age', type: 'number' },
    { label: 'Height', key: 'height', type: 'text' },
    { label: 'Current Weight', key: 'currentWeight', type: 'text' },
    { label: 'Target Weight', key: 'targetWeight', type: 'text' },
  ];

  return (
    <div className="max-w-5xl mx-auto mt-6 space-y-8 p-4 md:p-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-1" style={{ fontFamily: 'Oswald, sans-serif' }}>
          YOUR <span className="text-red-500">PROFILE</span>
        </h1>
        <p className="text-gray-500 text-sm">Manage your personal information and preferences</p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden shadow-2xl">
        <div className="h-1 w-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500" />

        <div className="p-6 md:p-10">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Column – Avatar + Stats */}
            <div className="flex flex-col items-center gap-6 lg:w-64 shrink-0">
              <div className="relative group">
                <div className="w-44 h-44 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-7xl border-4 border-[#1a1a1a] ring-2 ring-red-600/50 shadow-2xl overflow-hidden">
                  {previewImage ? (
                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    profile.name?.charAt(0)?.toUpperCase() || '?'
                  )}
                </div>

                {isEditing && (
                  <label className="absolute bottom-2 right-2 bg-red-600 hover:bg-red-700 text-white p-3.5 rounded-full cursor-pointer shadow-lg transition-all hover:scale-110">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      disabled={uploadingPhoto || saving}
                    />
                  </label>
                )}

                {uploadingPhoto && (
                  <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
                    <div className="text-white text-sm animate-pulse">Uploading...</div>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="w-full text-center space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Member Since</p>
                  <p className="text-red-400 font-bold text-lg">{profile.memberSince || '—'}</p>
                </div>

                {/* Streak Display */}
                <div className="bg-gradient-to-br from-orange-900/40 to-red-900/30 border border-orange-700/40 rounded-xl p-4">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-4xl">🔥</span>
                    <div>
                      <p className="text-xs text-orange-300 uppercase tracking-wider">Current Streak</p>
                      <p className="text-3xl font-black text-orange-400">
                        {streak} {streak === 1 ? 'day' : 'days'}
                      </p>
                    </div>
                  </div>
                  {streak >= 7 && (
                    <p className="text-xs text-orange-200 mt-2 italic">
                      {streak >= 30 ? 'Legendary consistency!' : 'Keep the fire burning!'}
                    </p>
                  )}
                </div>

                <span className="inline-block bg-red-900/40 border border-red-700/50 text-red-300 text-sm font-bold uppercase px-5 py-2 rounded-full">
                  {profile.membershipType || 'Member'}
                </span>
              </div>
            </div>

            {/* Right Column – Details */}
            <div className="flex-1 space-y-7">
              {/* Name + Edit Button */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editForm.name || ''}
                    onChange={handleEditChange}
                    className="flex-1 text-3xl md:text-4xl font-black bg-[#1a1a1a] border border-[#444] focus:border-red-500 outline-none px-5 py-3 rounded-xl text-white"
                    placeholder="Your full name"
                  />
                ) : (
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight flex-1" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    {profile.name || 'User'}
                  </h2>
                )}

                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 px-7 py-3.5 rounded-xl font-bold text-white transition-all shadow-lg whitespace-nowrap"
                  >
                    EDIT PROFILE
                  </button>
                ) : (
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={handleSave}
                      disabled={saving || uploadingPhoto}
                      className="bg-green-600 hover:bg-green-500 px-7 py-3.5 rounded-xl font-bold text-white disabled:opacity-50 transition-colors shadow-lg"
                    >
                      {saving ? 'SAVING...' : 'SAVE CHANGES'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-800 hover:bg-gray-700 px-7 py-3.5 rounded-xl font-bold text-white transition-colors shadow-lg"
                    >
                      CANCEL
                    </button>
                  </div>
                )}
              </div>

              {/* Bio */}
              {isEditing ? (
                <textarea
                  name="bio"
                  value={editForm.bio || ''}
                  onChange={handleEditChange}
                  rows={3}
                  className="w-full bg-[#1a1a1a] border border-[#444] focus:border-red-500 outline-none px-5 py-3.5 rounded-xl text-gray-200 resize-none"
                  placeholder="Tell others about yourself..."
                />
              ) : (
                <p className="text-gray-300 leading-relaxed border-l-4 border-red-600/50 pl-5 italic">
                  {profile.bio || "No bio added yet. Add something about your fitness journey!"}
                </p>
              )}

              <div className="border-t border-gray-800 my-7" />

              {/* Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {editableFields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 block">
                      {field.label}
                    </label>

                    {isEditing ? (
                      field.type === 'textarea' ? (
                        <textarea
                          name={field.key}
                          value={editForm[field.key] || ''}
                          onChange={handleEditChange}
                          rows={field.key === 'bio' ? 4 : 2}
                          className="w-full bg-[#1a1a1a] border border-[#444] focus:border-red-500 outline-none px-4 py-2.5 rounded-lg text-white text-sm min-h-[80px]"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      ) : (
                        <input
                          type={field.type}
                          name={field.key}
                          value={editForm[field.key] || ''}
                          onChange={handleEditChange}
                          className="w-full bg-[#1a1a1a] border border-[#444] focus:border-red-500 outline-none px-4 py-2.5 rounded-lg text-white text-sm"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      )
                    ) : (
                      <p className="text-gray-200 font-medium">
                        {profile[field.key] || '—'}
                      </p>
                    )}
                  </div>
                ))}

                {/* Email – always read-only */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Email</p>
                  <p className="text-gray-200 font-medium break-all">{profile.email || '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-center text-red-400 mt-8 font-medium">{error}</p>}

      <p className="text-center text-gray-600 text-sm pt-6">
        More features (progress stats, badges, workout history, nutrition logs) coming soon...
      </p>
    </div>
  );
}