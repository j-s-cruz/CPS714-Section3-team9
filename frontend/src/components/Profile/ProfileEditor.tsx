import { useState, useEffect } from 'react';
import { Save, User, Phone, Upload, Edit2, X, Crown } from 'lucide-react';
import { GiBiceps, GiMuscleUp, GiTrophy } from 'react-icons/gi';
import dummyData from '../../data/data.json';

export const ProfileEditor = () => {
  // TODO: Replace with actual auth when available
  const user = { email: 'user@example.com', id: '123' };
  const profile: any = null;
  const refreshProfile = async () => console.log('Refresh profile');
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fitnessGoals, setFitnessGoals] = useState('');
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingGoals, setIsEditingGoals] = useState(false);

  useEffect(() => {
    /* TODO: Need to change this. profile comes from an old section related to the auth form. This should be handled by team 1s stuff*/
    if (profile) {
      /* This assumes the databse only contains full name. Should probably change this otherwise */
      const fullname = (profile.full_name || '').split(' ');
      setFirstName(fullname[0] || '');
      setLastName(fullname[1] || '');
      setEmail(user?.email || '');
      /* Again assuming we even have phone number as a field */
      setPhoneNumber(profile.phone_number || '');
      setFitnessGoals(profile.fitness_goals || '');
      setProfilePicture(profile.profile_picture || '');
    } else {
      /* Dummy data to be used if profile does not return anything */
      const dummyProfile = (dummyData as any).profiles?.[0] || {};
      const nameParts = (dummyProfile.full_name || '').split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setEmail(dummyProfile.email || '');
      setPhoneNumber(dummyProfile.phone_number || '(123) 456-7890');
      setFitnessGoals(dummyProfile.fitness_goals || '-Finish CPS714 Project\n-Exercise regularly\n-Eat healthy');
      setProfilePicture(dummyProfile.profile_picture || '');
    }
  }, [profile, user]);

  /* if the user hits the edit button enable the fields in the form */
  const handleEditProfile = () => {
    setSuccess(false);
    setError(false);
    setIsEditingProfile(true);
  };

  /* if the user hits the cancel button it should reset the form*/
  const handleCancelProfile = () => {
    setSuccess(false);
    setError(false);
    setIsEditingProfile(false);

    /* If the user hits cancel we reset the form to the original data */
    if (profile) {
      const nameParts = (profile.full_name || '').split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setEmail(user?.email || '');
      setPhoneNumber(profile.phone_number || '');
      setProfilePicture(profile.profile_picture || '');
    } else {
      const dummyProfile = (dummyData as any).profiles?.[0] || {};
      const nameParts = (dummyProfile.full_name || '').split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setEmail(dummyProfile.email || '');
      setPhoneNumber(dummyProfile.phone_number || '(123) 456-7890');
      setProfilePicture(dummyProfile.profile_picture || '');
    }
  };

  /* same logic as above but for fitness goals */
  const handleEditGoals = () => {
    setSuccess(false);
    setError(false);
    setIsEditingGoals(true);
  };

  const handleCancelGoals = () => {
    setSuccess(false);
    setError(false);
    setIsEditingGoals(false);
    if (profile) {
      setFitnessGoals(profile.fitness_goals || '');
    } else {
      const dummyProfile = (dummyData as any).profiles?.[0] || {};
      setFitnessGoals(dummyProfile.fitness_goals || '-Finish CPS714 Project\n-Exercise regularly\n-Eat healthy');
    }
  };

  const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    /* Make sure the sure selects a file */
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      /* Use a FileReader to convert the image to string */
      const reader = new FileReader();

      /* Once the file is read, set the profile picture (as a string to be able to store in a database) */
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  /* This function submits changes to the database (for both profile and goals) */
  const handleSubmitButton = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    /* Reset from previous submit if somehow not done so already */
    setSuccess(false);
    setError(false);

    try {
      /* Assuming name is one DB field */
      // const fullName = `${firstName} ${lastName}`.trim();

      /* Update the database entry related to user ID */
      // TODO: Replace with actual supabase call when available
      // const { error: updateError } = await supabase
      //   .from('profiles')
      //   .update({
      //     full_name: fullName,
      //     phone_number: phoneNumber,
      //     profile_picture: profilePicture,
      //     email: email,
      //     fitness_goals: fitnessGoals,
      //   })
      //   .eq('id', user?.id);
      const updateError = null; // Mock for now

      if (updateError) throw updateError;

      await refreshProfile();
      setSuccess(true);
      setIsEditingProfile(false);
      setIsEditingGoals(false);
      setTimeout(() => setSuccess(false), 1000);
    } catch (error: any) {
      /* PURELY FOR TESTING. SINCE AN UPDATE ALWAYS RETURNS ERROR. COMMENT THIS LINE OUT IF NOT DONE SO */
      // setSuccess(true);
      // setTimeout(() => setSuccess(false), 1000);

      /* Actual code that should show fail */
      setError(true);
      setTimeout(() => setError(false), 1000);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message If User Updates Info Correctly */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-6 py-4 rounded-xl flex items-center gap-3 shadow-lg animate-scale-in">
          <X className="w-6 h-6" />
          <span className="font-medium">Error updating profile. Please try again.</span>
        </div>
      )}
      {success && (
        <div className="bg-gold-500/20 border border-gold-500 text-gold-400 px-6 py-4 rounded-xl flex items-center gap-3 shadow-lg animate-scale-in">
          <GiBiceps className="w-6 h-6" />
          <span className="font-medium">Profile updated successfully!</span>
        </div>
      )}

      {/* Same Widget From Dashboard But With Buttons and INFO removed */}
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
                  onClick={handleSubmitButton}
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

          {/* Form for profile information */}
          <form onSubmit={handleSubmitButton} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                {/* Update first name */}
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
                {/* Update last name */}
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
              {/* Update email name */}
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                disabled={!isEditingProfile}
                required
              />
            </div>

            <div>
              {/* Update phone number (not actually sure if phone number is needed but added anyways) */}
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
            <span className="text-xl font-bold text-gray-900">Membership Details</span>

          </div>
          <div className="space-y-4">
            <h3 className="text-lg text-gray-200">
              Need to figure out what goes here
            </h3>
          </div>

          {/* Button that should send you to billing details */}
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
                onClick={handleSubmitButton}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gold-500/90 hover:bg-gold-500 text-gray-900 rounded-lg font-medium transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>

        {/* Update fitness goals */}
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
