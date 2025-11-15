import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Save, User, Phone, Camera, Upload } from 'lucide-react';
import { GiMuscleUp, GiTrophy } from 'react-icons/gi';

export const ProfileEditor = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [fitnessGoals, setFitnessGoals] = useState('');
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setEmergencyContact(profile.emergency_contact || '');
      setFitnessGoals(profile.fitness_goals || '');
      setProfilePicture(profile.profile_picture || '');
    }
  }, [profile]);

  const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          emergency_contact: emergencyContact,
          fitness_goals: fitnessGoals,
          profile_picture: profilePicture,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const subscription = profile?.membership_subscriptions?.[0];
  const tier = subscription?.membership_tiers;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-100 tracking-tight stagger-1">Profile Settings</h2>

      {success && (
        <div className="bg-gold-500/20 border border-gold-500 text-gold-400 px-6 py-4 rounded-xl flex items-center gap-3 shadow-lg animate-scale-in">
          <GiTrophy className="w-6 h-6" />
          <span className="font-medium">Profile updated successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Picture Section */}
        <div className="bg-gray-800/60 rounded-2xl border border-gray-700/50 hover:border-gold-500/30 transition-all duration-300 p-6 hover:shadow-xl hover:shadow-gold-500/5 stagger-2">
          <h3 className="text-xl font-bold text-gray-100 mb-6 flex items-center gap-2">
            <Camera className="w-6 h-6 text-gold-400" />
            Profile Picture
          </h3>

          <div className="flex flex-col items-center space-y-4">
            {/* Profile Picture Preview */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700/50 group-hover:border-gold-500/50 transition-all duration-300 shadow-lg">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700/50 flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-500" />
                  </div>
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Upload Button */}
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handlePictureUpload}
                className="hidden"
              />
              <div className="flex items-center gap-2 px-6 py-3 bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-gold-400 rounded-xl font-semibold transition-all duration-300 border border-gray-600/50 hover:border-gold-500/50">
                <Upload className="w-5 h-5" />
                <span>Upload Photo</span>
              </div>
            </label>
            <p className="text-xs text-gray-400 text-center">
              JPG, PNG or GIF. Max size 5MB
            </p>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-gray-800/60 rounded-2xl border border-gray-700/50 hover:border-gold-500/30 transition-all duration-300 p-6 hover:shadow-xl hover:shadow-gold-500/5 stagger-2">
          <h3 className="text-xl font-bold text-gray-100 mb-6 flex items-center gap-2">
            <User className="w-6 h-6 text-gold-400" />
            Personal Information
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                <span className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Emergency Contact
                </span>
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="input-field"
                placeholder="Name and phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                <span className="flex items-center gap-2">
                  <GiMuscleUp className="w-5 h-5" />
                  Fitness Goals
                </span>
              </label>
              <textarea
                value={fitnessGoals}
                onChange={(e) => setFitnessGoals(e.target.value)}
                className="input-field min-h-[120px] resize-none"
                placeholder="What are your fitness goals?"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 px-6 py-3 bg-gold-500/90 text-gray-900 rounded-xl font-semibold hover:bg-gold-500 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:shadow-gold-500/30"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>

      {/* Membership Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/60 rounded-2xl border border-gray-700/50 hover:border-gold-500/30 transition-all duration-300 p-6 hover:shadow-xl hover:shadow-gold-500/5 stagger-2">
          <h3 className="text-xl font-bold text-gray-100 mb-6">Membership Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-gray-700/50">
              <span className="text-gray-400 font-medium">Email</span>
              <span className="font-semibold text-gray-200">{user?.email}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-700/50">
              <span className="text-gray-400 font-medium">Member Since</span>
              <span className="font-semibold text-gray-200">
                {new Date(profile?.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-700/50">
              <span className="text-gray-400 font-medium">Current Plan</span>
              <span className="badge-gold">
                {tier?.name}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-700/50">
              <span className="text-gray-400 font-medium">Billing Cycle</span>
              <span className="font-semibold text-gray-200 capitalize">{subscription?.billing_cycle}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-400 font-medium">Next Billing Date</span>
              <span className="font-semibold text-gray-100">
                {subscription?.renewal_date
                  ? new Date(subscription.renewal_date).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/60 rounded-2xl border-2 border-gold-500/30 hover:border-gold-500/50 transition-all duration-300 p-6 hover:shadow-xl hover:shadow-gold-500/20 stagger-2">
          <h3 className="text-xl font-bold text-gold-400 mb-2">Upgrade Your Membership</h3>
          <p className="text-gray-300 mb-5 leading-relaxed">
            Get access to premium classes and unlimited bookings
          </p>
        </div>
      </div>
    </div>
  );
};
