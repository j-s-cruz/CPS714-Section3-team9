import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Save, User, Phone, Upload, Edit2, X, Crown } from 'lucide-react';
import { GiMuscleUp, GiTrophy } from 'react-icons/gi';

export const ProfileEditor = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fitnessGoals, setFitnessGoals] = useState('');
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingGoals, setIsEditingGoals] = useState(false);

  useEffect(() => {
    if (profile) {
      const fullname = (profile.full_name || '').split(' ');
      setFirstName(fullname[0] || '');
      setLastName(fullname.slice(1).join(' ') || '');
      setEmail(user?.email || '');
      setPhoneNumber(profile.phone_number || '');
      setFitnessGoals(profile.fitness_goals || '');
      setProfilePicture(profile.profile_picture || '');
    } else {
      /* Dummy data */
      setFirstName('Vlad');
      setLastName('Scraba');
      setEmail('Vlad.Scraba@torontomu.ca');
      setPhoneNumber('(123) 456-7890');
      setFitnessGoals('-Finish CPS714 Project\n-Exercise regularly\n-Eat healthy');
      setProfilePicture('');
    }
  }, [profile, user]);

  /* if the user hits the edit button enable the fields in the form */
  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  /* if the user hits the cancel button it should reset the form*/
  const handleCancelProfile = () => {
    setIsEditingProfile(false);

    if (profile) {
      const nameParts = (profile.full_name || '').split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setEmail(user?.email || '');
      setPhoneNumber(profile.phone_number || '');
      setProfilePicture(profile.profile_picture || '');
    } else {
      /* Dummy data */
      setFirstName('Vlad');
      setLastName('Scraba');
      setEmail('Vlad.Scraba@torontomu.ca');
      setPhoneNumber('(123) 456-7890');
      setProfilePicture('');
    }
  };

  /* same logic as above but for fitness goals */
  const handleEditGoals = () => {
    setIsEditingGoals(true);
  };

  const handleCancelGoals = () => {
    setIsEditingGoals(false);
    if (profile) {
      setFitnessGoals(profile.fitness_goals || '');
    } else {
      setFitnessGoals('-Finish CPS714 Project\n-Exercise regularly\n-Eat healthy');
    }
  };

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

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const fullName = `${firstName} ${lastName}`.trim();

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone_number: phoneNumber,
          profile_picture: profilePicture,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      await refreshProfile();
      setSuccess(true);
      setIsEditingProfile(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitGoals = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          fitness_goals: fitnessGoals,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      await refreshProfile();
      setSuccess(true);
      setIsEditingGoals(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {success && (
        <div className="bg-gold-500/20 border border-gold-500 text-gold-400 px-6 py-4 rounded-xl flex items-center gap-3 shadow-lg animate-scale-in">
          <GiTrophy className="w-6 h-6" />
          <span className="font-medium">Profile updated successfully!</span>
        </div>
      )}

      {/* Membership Status Widget */}
      <div className="relative rounded-2xl border border-gold-500/30 p-6 overflow-hidden hover:border-gold-500/30 hover:shadow-xl hover:shadow-gold-500/5 h-28">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1200&q=80')",
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/60 to-gold-600/60" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Combined Profile Picture & Personal Information Section */}
        <div className="bg-gray-800/60 border border-gray-700/50 hover:border-gold-500/30 transition-all duration-300 p-6 hover:shadow-xl hover:shadow-gold-500/5 stagger-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
              <User className="w-6 h-6 text-gold-400" />
              Personal Information
            </h3>
            {!isEditingProfile ? (
              <button
                onClick={handleEditProfile}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-gold-400 rounded-lg font-medium transition-all duration-300 text-sm"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancelProfile}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-red-400 rounded-lg font-medium transition-all duration-300 text-sm"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSubmitProfile}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-gold-500/90 hover:bg-gold-500 text-gray-900 rounded-lg font-medium transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          {/* Profile Picture at Top */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-700/50 hover:border-gold-500/50 transition-all duration-300 shadow-lg">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700/50 flex items-center justify-center">
                    <User className="w-10 h-10 text-gray-500" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePictureUpload}
                  className="hidden"
                />
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-gold-400 rounded-lg font-medium transition-all duration-300 border border-gray-600/50 hover:border-gold-500/50 text-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                </div>
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmitProfile} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input-field"
                  disabled={!isEditingProfile}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input-field"
                  disabled={!isEditingProfile}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                disabled
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                <span className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </span>
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="input-field"
                placeholder="(123) 456-7890"
                disabled={!isEditingProfile}
              />
            </div>
          </form>
        </div>

        {/* Combined Membership Details & Upgrade Section */}
        <div className="bg-gray-800/60 border border-gray-700/50 hover:border-gold-500/30 transition-all duration-300 p-6 hover:shadow-xl hover:shadow-gold-500/5 stagger-1 h-full flex flex-col">
          <div
            className="bg-gold-500/90 p-3 rounded-xl shadow-lg hover:bg-gold-500 transition-all cursor-pointer h-14 w-auto flex items-center gap-8"
            title="Membership Details">
            <Crown className="w-8 h-8 text-gray-900" />
            <h3 className="text-xl font-bold text-gray-900">Membership Details</h3>

          </div>
          <div className="space-y-4">
            <h3 className="text-lg text-gray-200">
              Need to figure out what goes here
            </h3>
          </div>

          <button className="w-full mt-6 px-6 py-3 bg-gold-500/90 text-gray-900 rounded-xl font-semibold hover:bg-gold-500 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:shadow-gold-500/30 mt-auto">
            <GiTrophy className="w-5 h-5" />
            Upgrade Membership
          </button>
        </div>
      </div>

      {/* Fitness Goals Widget */}
      <div className="relative bg-gray-800/60 border border-gray-700/50 hover:border-gold-500/30 transition-all duration-300 p-6 hover:shadow-xl hover:shadow-gold-500/5 stagger-2">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1550&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        />
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
            <GiMuscleUp className="w-6 h-6 text-gold-400" />
            Fitness Goals
          </h3>
          {!isEditingGoals ? (
            <button
              onClick={handleEditGoals}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-gold-400 rounded-lg font-medium transition-all duration-300 text-sm"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancelGoals}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-red-400 rounded-lg font-medium transition-all duration-300 text-sm"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSubmitGoals}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gold-500/90 hover:bg-gold-500 text-gray-900 rounded-lg font-medium transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>

        <textarea
          value={fitnessGoals}
          onChange={(e) => setFitnessGoals(e.target.value)}
          className="input-field min-h-[160px] resize-none w-full relative z-10"
          placeholder="What are your fitness goals?"
          disabled={!isEditingGoals}
        />
      </div>
    </div>
  );
};
