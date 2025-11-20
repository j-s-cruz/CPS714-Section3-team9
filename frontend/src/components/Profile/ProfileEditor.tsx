import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, User, Phone, Upload, Edit2, X, Crown} from 'lucide-react';
import { GiMuscleUp } from 'react-icons/gi';
import { Database } from '../../lib/supabase';

// Re-using the same type definition from MemberDashboard for consistency
type ProfileWithSubscription = Database['public']['Tables']['profiles']['Row'] & {
  // membership_subscriptions comes back as an array when using a relation select
  membership_subscriptions: (Database['public']['Tables']['membership_subscriptions']['Row'] & {
    membership_tiers: Database['public']['Tables']['membership_tiers']['Row'] | null;
  })[] | null;
};

interface ProfileEditorProps {
  profile: ProfileWithSubscription | null;
  setProfile: (profile: ProfileWithSubscription | null) => void;
}

export const ProfileEditor = ({ profile, setProfile }: ProfileEditorProps) => {
  const userId = profile?.id;

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fitnessGoals, setFitnessGoals] = useState('');
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingGoals, setIsEditingGoals] = useState(false);

  useEffect(() => {
    // Load initial data from the profile
    const nameParts = (profile?.full_name || '').split(' ');
    setFirstName(nameParts[0] || '');
    setLastName(nameParts.slice(1).join(' ') || '');
    setEmail(profile?.email || '');
    setPhoneNumber(profile?.phone_number || '');
    setFitnessGoals(profile?.fitness_goals || '');
    setProfilePicture(profile?.profile_picture_url || '');
  }, [profile]);

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
    const nameParts = (profile?.full_name || '').split(' ');
    setFirstName(nameParts[0] || '');
    setLastName(nameParts.slice(1).join(' ') || '');
    setPhoneNumber(profile?.phone_number || '');
    setProfilePicture(profile?.profile_picture_url || '');
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
    setFitnessGoals(profile?.fitness_goals || '');
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

    // Guard Clause: Ensure we have a user ID before proceeding.
    if (!userId) {
      setError("Cannot update profile: User ID is missing.");
      return;
    }

    setLoading(true);

    /* Reset from previous submit if somehow not done so already */
    setSuccess(false);
    setError("");

    try {
      /* check format of phone number and email before submitting */
      if (invalidEmailFormat(email)) throw new Error('Invalid email format');

      if (invalidPhoneNumberFormat(phoneNumber)) throw new Error('Invalid phone number format');

      /* Assuming name is one DB field */
      const fullName = `${firstName} ${lastName}`.trim();

      const updates = {
        full_name: fullName,
        phone_number: forcePhoneNumberFormat(phoneNumber),
        email: email,
        profile_picture_url: profilePicture,
        fitness_goals: fitnessGoals,
      };

      // Type helpers for the generated supabase types can be strict in this workspace; ignore type-checking for the runtime call
      // @ts-ignore
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select(`
          *,
          membership_subscriptions!left (
            *,
            membership_tiers (*)
          )
        `)
        .single();

      if (error) throw error;

      // Update the state in the parent MemberDashboard component with the returned data
      if (profile) {
        // @ts-ignore - merge runtime row data into the profile state
        setProfile({ ...profile, ...data });
      }

      setSuccess(true);
      setIsEditingProfile(false);
      setIsEditingGoals(false);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setError("Error Updating Profile: " + err.message);
      setTimeout(() => setError(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  function forcePhoneNumberFormat(number: string): string {
    /* Remove all non-digit characters */
    const digits = number.replace(/\D/g, '');
    return `(${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6)}`;

  }

  /* Returns true if the email is invalid */
  function invalidEmailFormat(email: string): boolean {
    if (email.length === 0) return true;
    else if (!email.includes('@') || !email.includes('.') || email.indexOf('@') > email.lastIndexOf('.') || email.startsWith('@') || email.endsWith('.') || email.endsWith('@') || email.endsWith('.')) return true;
    else return false;
  }

  function invalidPhoneNumberFormat(number: string): boolean {
    const digits = number.replace(/\D/g, '');
    return digits.length !== 10;
  }

  const subscription = profile?.membership_subscriptions?.[0];
  const tier = subscription?.membership_tiers;

  return (
    <div className="space-y-6">
      {/* Success Message If User Updates Info Correctly */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-6 py-4 rounded-xl flex items-center gap-3 shadow-lg animate-scale-in">
          <X className="w-6 h-6" />
          <span className="font-medium">{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-gold-500/20 border border-gold-500 text-gold-400 px-6 py-4 rounded-xl flex items-center gap-3 shadow-lg animate-scale-in">
          <Save className="w-6 h-6" />
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
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/60 to-gold-600/60 z-0" />
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

            {isEditingProfile && (
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
            )}
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
                Phone Number
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
            className="bg-gold-500/90 p-3 rounded-xl shadow-lg hover:bg-gold-500 transition-all cursor-pointer h-14 w-auto flex items-center gap-3"
            title="Membership Details">
            <Crown className="w-6 h-6 text-gray-900" />
            <span className="text-xl font-bold text-gray-900">Membership Details</span>
          </div>
          {tier && subscription ? (
            <div className="space-y-4 mt-6 text-sm flex-grow">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-400 uppercase tracking-wider">Tier</span>
                <span className="font-bold text-gold-400 text-base">{tier.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-400 uppercase tracking-wider">Status</span>
                <span className="font-medium text-gray-100 capitalize bg-green-500/20 px-2 py-1 rounded-md">{subscription.status}</span>
              </div>
              {subscription.renewal_date && (
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-400 uppercase tracking-wider">Next Renewal</span>
                  <span className="font-medium text-gray-100">
                    {subscription.renewal_date.split('T')[0]}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-gray-400">No active membership found.</p>
            </div>
          )}

          {/* Button that should send you to billing details */}
          <button
            className="mt-6 px-4 py-2 bg-gold-500/90 hover:bg-gold-500 text-gray-900 rounded-lg font-medium transition-all duration-300 text-sm w-full"
          >
            Upgrade Membership & View Billing Details
          </button>
        </div>
      </div>

      {/* Fitness Goals Widget */}
      <div className="relative bg-gray-800/60 border border-gray-700/50 hover:border-gold-500/30 transition-all duration-300 p-6 hover:shadow-xl hover:shadow-gold-500/5 stagger-2">
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
