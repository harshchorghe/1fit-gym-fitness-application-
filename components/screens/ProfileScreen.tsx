'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase';  // ← make sure storage is exported

export default function ProfileScreen() {
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fallbackProfile = {
    name: 'Harsh Chorghe',
    email: 'harsh.chorghe@1fit.com',
    phone: '+91 98765 43210',
    memberSince: 'January 2025',
    membershipType: 'Pro',
    avatar: '👤',
    bio: 'Fitness enthusiast focused on strength training and endurance.',
    location: 'Maharashtra, IN',
    age: 20,
    height: "5'10\"",
    currentWeight: '75 kg',
    targetWeight: '72 kg'
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push('/signin');
        return;
      }

      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userDocRef);

        let profileData;

        if (userSnap.exists()) {
          const data = userSnap.data();
          profileData = {
            ...data,
            name: firebaseUser.displayName || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'User',
            email: firebaseUser.email || data.email,
            avatar: firebaseUser.photoURL || data.photoURL || '👤',
            memberSince: new Date(data.createdAt || Date.now()).toLocaleDateString('default', { month: 'long', year: 'numeric' }),
            membershipType: data.membershipType || 'Starter',
            phone: data.phone || '',
            location: data.location || '',
            age: data.age || '',
            height: data.height || '',
            currentWeight: data.currentWeight || '',
            targetWeight: data.targetWeight || '',
            bio: data.bio || ''
          };
        } else {
          profileData = fallbackProfile;
        }

        setUserData(profileData);
        setEditForm(profileData);
        setPreviewImage(profileData.avatar); // initial preview
      } catch (err) {
        console.error('Error fetching profile:', err);
        setUserData(fallbackProfile);
        setEditForm(fallbackProfile);
        setPreviewImage(fallbackProfile.avatar);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Store file for upload on save
    setEditForm((prev: any) => ({ ...prev, photoFile: file }));
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setSaving(true);

    try {
      let photoURL = userData.avatar;

      // 1. Upload new photo if selected
      if (editForm.photoFile) {
        setUploadingPhoto(true);
        const file = editForm.photoFile;
        const storageRef = ref(storage, `profile-pictures/${auth.currentUser.uid}/${Date.now()}_${file.name}`);

        await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(storageRef);
        setUploadingPhoto(false);
      }

      // 2. Update Firebase Auth (name + photoURL)
      if (editForm.name !== userData.name || photoURL !== userData.avatar) {
        await updateProfile(auth.currentUser, {
          displayName: editForm.name.trim(),
          photoURL: photoURL.startsWith('http') ? photoURL : null
        });
      }

      // 3. Update Firestore
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, {
        firstName: editForm.name.split(' ')[0] || '',
        lastName: editForm.name.split(' ').slice(1).join(' ') || '',
        name: editForm.name.trim(),
        bio: editForm.bio.trim(),
        phone: editForm.phone.trim(),
        location: editForm.location.trim(),
        age: editForm.age ? Number(editForm.age) : null,
        height: editForm.height.trim(),
        currentWeight: editForm.currentWeight.trim(),
        targetWeight: editForm.targetWeight.trim(),
        photoURL: photoURL.startsWith('http') ? photoURL : null,
        updatedAt: new Date().toISOString()
      });

      // 4. Refresh local state
      setUserData({
        ...editForm,
        avatar: photoURL,
        memberSince: userData.memberSince,
        membershipType: userData.membershipType
      });
      setEditForm({
        ...editForm,
        avatar: photoURL,
        photoFile: null
      });
      setPreviewImage(photoURL);
      setIsEditing(false);

      alert('Profile updated successfully!');
    } catch (err: any) {
      console.error('Save error:', err);
      alert('Failed to update profile: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
      setUploadingPhoto(false);
    }
  };

  const handleCancel = () => {
    setEditForm(userData);
    setPreviewImage(userData.avatar);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-2xl animate-pulse">Loading your profile...</div>
      </div>
    );
  }

  const profile = userData || fallbackProfile;

  const editableFields = [
    { label: 'Phone', key: 'phone', type: 'tel' },
    { label: 'Location', key: 'location', type: 'text' },
    { label: 'Age', key: 'age', type: 'number' },
    { label: 'Height', key: 'height', type: 'text' },
    { label: 'Current Weight', key: 'currentWeight', type: 'text' },
    { label: 'Target Weight', key: 'targetWeight', type: 'text' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-8">

      {/* Page Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-1" style={{ fontFamily: 'Oswald, sans-serif' }}>
          YOUR <span className="text-red-500">PROFILE</span>
        </h1>
        <p className="text-gray-500 text-sm">Manage your personal information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden shadow-2xl">

        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500" />

        <div className="p-6 md:p-10">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* ── LEFT COLUMN ── Avatar + Upload */}
            <div className="flex flex-col items-center gap-5 lg:w-52 shrink-0">
              <div className="relative group">
                <div className="w-36 h-36 rounded-full bg-gradient-to-br from-red-500 to-red-800 flex items-center justify-center text-6xl border-4 border-[#1a1a1a] ring-2 ring-red-500 shadow-xl shadow-red-900/30 overflow-hidden">
                  {previewImage && previewImage.startsWith('http') || previewImage?.startsWith('data:') ? (
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    previewImage || profile.avatar
                  )}
                </div>

                {/* Upload button - only visible in edit mode */}
                {isEditing && (
                  <label className="absolute bottom-1 right-1 bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-full cursor-pointer shadow-lg transition-transform transform hover:scale-110">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
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
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                    <div className="text-white text-sm animate-pulse">Uploading...</div>
                  </div>
                )}
              </div>

              {/* Member Since */}
              <div className="text-center">
                <p className="text-xs text-gray-600 uppercase tracking-widest mb-0.5">Member Since</p>
                <p className="text-red-500 font-bold text-base">{profile.memberSince}</p>
              </div>

              {/* Badge */}
              <span className="bg-red-600/20 border border-red-600/40 text-red-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                {profile.membershipType} Member
              </span>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="flex-1 min-w-0 space-y-6">
              {/* Name row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="flex-1 text-2xl font-bold bg-[#1a1a1a] border border-[#333] focus:border-red-500 outline-none px-4 py-2.5 rounded-lg text-white placeholder-gray-600 transition-colors"
                    placeholder="Your Name"
                  />
                ) : (
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight flex-1" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    {profile.name}
                  </h2>
                )}

                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="shrink-0 bg-[#1e1e1e] hover:bg-red-600 border border-[#333] hover:border-red-600 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-all duration-200"
                  >
                    EDIT PROFILE
                  </button>
                ) : (
                  <div className="flex gap-3 shrink-0">
                    <button
                      onClick={handleSave}
                      disabled={saving || uploadingPhoto}
                      className="bg-green-600 hover:bg-green-500 text-white text-sm font-bold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {saving ? 'SAVING...' : 'SAVE'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-[#1e1e1e] hover:bg-[#2a2a2a] border border-[#333] text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors"
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
                  value={editForm.bio}
                  onChange={handleEditChange}
                  rows={3}
                  className="w-full bg-[#1a1a1a] border border-[#333] focus:border-red-500 outline-none px-4 py-3 rounded-lg text-gray-200 placeholder-gray-600 resize-none transition-colors"
                  placeholder="Write something about yourself..."
                />
              ) : (
                <p className="text-gray-400 leading-relaxed text-sm border-l-2 border-red-600/40 pl-4">
                  {profile.bio || "No bio yet. Click 'Edit Profile' to add one!"}
                </p>
              )}

              {/* Divider */}
              <div className="border-t border-[#1e1e1e]" />

              {/* Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
                {/* Email */}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Email</p>
                  <p className="text-sm font-semibold text-gray-200 truncate">{profile.email}</p>
                </div>

                {/* Editable fields */}
                {editableFields.map((field) => (
                  <div key={field.key} className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{field.label}</p>
                    {isEditing ? (
                      <input
                        type={field.type}
                        name={field.key}
                        value={editForm[field.key] || ''}
                        onChange={handleEditChange}
                        className="w-full bg-[#1a1a1a] border border-[#333] focus:border-red-500 outline-none px-3 py-2 rounded-lg text-white text-sm placeholder-gray-600 transition-colors"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    ) : (
                      <p className={`text-sm font-semibold ${profile[field.key] ? 'text-gray-200' : 'text-gray-600'}`}>
                        {profile[field.key] || 'Not set'}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-center text-gray-600 text-sm pb-4">
        More features (workout stats, badges, history) coming soon...
      </p>
    </div>
  );
}