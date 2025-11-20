import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  User,
  Bell,
  Clock,
  LogOut,
  Crown,
} from 'lucide-react';
import { GiWeightLiftingUp, GiMuscleUp, GiRunningShoe, GiBiceps } from 'react-icons/gi';
import { FaDumbbell } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/supabase';
import { ProfileEditor } from '../Profile/ProfileEditor';
import { ClassCalendar } from './ClassCalendar';

type TabType = 'dashboard' | 'profile' | 'staff';

// Define a specific type for the profile object, including the nested subscription data.
type ProfileWithSubscription = Database['public']['Tables']['profiles']['Row'] & {
  // membership_subscriptions is returned as an array when selecting relations
  membership_subscriptions: (Database['public']['Tables']['membership_subscriptions']['Row'] & {
    membership_tiers: Database['public']['Tables']['membership_tiers']['Row'] | null;
  })[] | null;
};

export const MemberDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [notifications] = useState<any[]>([]);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [myProfile, setMyProfile] = useState<ProfileWithSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (showProfileMenu && profileButtonRef.current) {
      const rect = profileButtonRef.current.getBoundingClientRect();
      // place the menu so its right edge aligns with the button's right edge
      const menuWidth = 224; // matches minWidth used when rendering
      setMenuPos({ top: rect.bottom + window.scrollY, left: rect.right - menuWidth + window.scrollX });
    }
  }, [showProfileMenu]);

  useEffect(() => {
    const HARDCODED_USER_ID = 'b41c76d2-0e38-4dec-8825-b10a0b841664';

    const fetchProfileData = async () => {
      try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*, membership_subscriptions(*, membership_tiers(*))')
            .eq('id', HARDCODED_USER_ID)
            .single();

          if (error) throw error;

          setMyProfile(data);
      } catch (error: any) {
        console.error('Error fetching profile:', error.message);
      }
      setLoading(false);
    };
    fetchProfileData();
  }, []);

  // This effect runs only when myProfile changes from null to a real value.
  useEffect(() => {
    if (myProfile?.id) {
      fetchUpcomingBookings(myProfile.id);
    }
  }, [myProfile]);


  const fetchUpcomingBookings = async (userId: string) => {
    const today = new Date();
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    const { data, error } = await supabase
      .from('class_bookings')
      .select(`
        id,
        status,
        class_schedules (
          scheduled_date,
          start_time,
          fitness_classes ( name )
        )
      `)
      .eq('user_id', userId)
      .gte('class_schedules.scheduled_date', today.toISOString().split('T')[0])
      .lte('class_schedules.scheduled_date', sevenDaysFromNow.toISOString().split('T')[0])
      .order('scheduled_date', { foreignTable: 'class_schedules', ascending: true });

    if (error) console.error('Error fetching bookings:', error);
    else {
      const all = data || [];
      // Filter out bookings that somehow don't have the joined schedule relation
      const valid = all.filter((b: any) => b?.class_schedules != null).sort((a, b) => {
        const dateA = new Date(`${a.class_schedules.scheduled_date}T${a.class_schedules.start_time}`);
        const dateB = new Date(`${b.class_schedules.scheduled_date}T${b.class_schedules.start_time}`);
        return dateA.getTime() - dateB.getTime();
      });
      if (valid.length !== all.length) {
        console.warn('Some bookings were missing class_schedules and were filtered out:', all.filter((b: any) => b?.class_schedules == null));
      }
      setUpcomingBookings(valid);
    }
  };

  function formatTime(start_time: string): string {
    let hours = 0;
    let minutes = 0;
    let period = "";

    const parts_of_time = start_time.split(':').map(Number);

    if (parts_of_time[0] > 12) {
      hours = parts_of_time[0] - 12;
      period = "PM";
    }
    else {
      hours = parts_of_time[0];
      period = "AM";
    }
    minutes = parts_of_time[1]; 

    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }


  /* User data */
  const subscription = myProfile?.membership_subscriptions?.[0];
  const tier = subscription?.membership_tiers;
  // The profiles table uses `profile_picture_url` (see `supabase.ts`). Use that field if present.
  const profile_picture = myProfile?.profile_picture_url || null;
  const userId = myProfile?.id || '';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Loading Profile...
      </div>
    );
  }

  // If loading is finished but the profile couldn't be fetched, show an error.
  if (!myProfile) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-red-400">
        Error: Could not load user profile. Please ensure that the database is linked properly.
      </div>
    );
  }

  /* Use initials if profile picture not found */ 
  const initials = (myProfile?.full_name || 'U').split(' ').map((p: string) => p[0]).slice(0, 2).join('');

  return (
    <div className="flex flex-col h-screen bg-gray-900 overflow-hidden">
      {/* Top Banner */}
      <header className="bg-gray-800/95 border-b border-gray-700/50 backdrop-blur-md shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* FITHUB LOGO */}
              <div className="bg-gold-500/90 p-2 rounded-lg shadow-md transition-all duration-300">
                <FaDumbbell className="w-6 h-6 text-gray-900" />
              </div>
              <span className="text-xl font-bold text-gold-400 tracking-tight">FitHub</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Section for dashboard and profile buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'dashboard'
                    ? 'bg-gold-500/90 text-gray-900 shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-gold-400'
                    }`}
                >
                  <GiBiceps className="w-4 h-4 inline mr-1" />
                  Dashboard
                </button>
                {/* Send to the profile editor */}
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'profile'
                    ? 'bg-gold-500/90 text-gray-900 shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-gold-400'
                    }`}
                >
                  <User className="w-4 h-4 inline mr-1" />
                  Profile
                </button>
              </div>

              {/* Notifications (Again haven't touched this at all) */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotificationMenu(!showNotificationMenu)}
                  onBlur={() => setShowNotificationMenu(false)} // This will close the notifcication menu when clicking outside of it, but it also closes it when clicking inside, needs a better solution later
                  className="relative p-2 text-gray-400 hover:text-gold-400 transition-all duration-200 hover:bg-gray-700/50 rounded-lg">
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-gold-500 rounded-full animate-pulse-gold shadow-lg shadow-gold-500/50"></span>
                  )}
                </button>
                
                {/* Notification drop down menu */}
                {showNotificationMenu && (
                  <div className="absolute right-0 w-56 h-60 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                  </div>
                )}
              </div>

              {/* Sign drop down and banner */}
              <div className="relative">
                {/* Profile button ref used to position the portal dropdown */}
                <button
                  ref={(el) => (profileButtonRef.current = el)}
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  onBlur={() => setShowProfileMenu(false)} // This keeps previous behaviour; portal positioning will prevent clipping
                  className="w-10 h-10 bg-gold-500/90 rounded-full flex items-center justify-center text-gray-900 font-bold text-sm shadow-md hover:shadow-gold-500/30 transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  {/* If a profile picture is defined then use it */}
                  {profile_picture ? (
                    <img src={profile_picture} className="w-full h-full object-cover" />
                  ) : (
                    <span>{initials}</span>
                  )}
                </button>

                {showProfileMenu && profileButtonRef.current && createPortal(
                  <div
                    className="bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden"
                    style={{
                      position: 'absolute',
                      top: menuPos.top,
                      left: menuPos.left,
                      minWidth: 224,
                      zIndex: 2147483647, // very high to ensure front layer
                    }}
                  >
                    <div className="p-4 border-b border-gray-700">
                      <div className="text-sm font-bold text-gray-100 truncate">{myProfile?.full_name || 'User'}</div>
                      <div className="text-xs text-gray-400 truncate">{myProfile?.full_name || 'no-email@example.com'}</div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => alert('Sign out functionality removed.')}
                        className="w-full flex items-center gap-3 p-2 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-red-400 transition-all duration-300"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-semibold">Sign Out</span>
                      </button>
                    </div>
                  </div>,
                  document.body
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Page */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Membership Status Widget */}
              <div className="relative rounded-2xl border border-gold-500/30 p-6 overflow-hidden hover:border-gold-500/30 hover:shadow-xl hover:shadow-gold-500/5 h-28">
                {/* Background Image For Membership Status */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1200&q=80')",
                  }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-gold-500/60 to-gold-600/60" />

                {/* Basic Membership Status Info */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Added a crown button that also sends you to the users profile page to see more info on membership */}
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="bg-gold-500/90 p-3 rounded-xl shadow-lg hover:bg-gold-500 transition-all duration-300 hover:scale-110 cursor-pointer"
                      title="Membership Details"
                    >
                      <Crown className="w-8 h-8 text-gray-900" />
                    </button>
                    <div>
                      <h2 className="text-2xl font-bold text-white drop-shadow-lg">{tier?.name || 'No Active Plan'}</h2>
                      <p className="text-gray-100 text-sm mt-1 drop-shadow">
                        {subscription?.status ? (
                          <span className="inline-flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg"></span>
                            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                          </span>
                        ) : (
                          'Inactive'
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-100 text-lg font-semibold drop-shadow">
                      {subscription?.renewal_date
                        ? `Renewal Date: ${subscription.renewal_date.split('T')[0]}`
                        : 'No renewal date'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Upcoming Classes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800/90 border border-gray-700/50 hover:border-gold-500/30 transition-all duration-300 p-6 hover:shadow-xl hover:shadow-gold-500/5 hover:-translate-y-1 stagger-1">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                      <GiRunningShoe className="w-6 h-6 text-gold-400" />
                      Upcoming Classes In The Next <span className="text-gold-400">7 Days!</span>
                    </h3>
                  </div>

                  <div className="mb-2 max-h-64 overflow-y-auto">
                    {upcomingBookings.length === 0 ? (
                      <div className="text-center py-16 bg-gray-700/30 rounded-xl border border-dashed border-gray-600">
                        <p className="text-gray-400 mb-4">No upcoming classes booked</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {upcomingBookings.map((booking: any) => {
                          const schedule = booking.class_schedules || booking.class_schedules;
                          const className = schedule?.fitness_classes?.name || 'Unknown class';
                          const scheduledDate = schedule?.scheduled_date
                            ? schedule.scheduled_date.split('T')[0]
                            : 'TBD';
                          const startTime = formatTime(schedule?.start_time || '');

                          return (
                            <div
                              key={booking.id}
                              className="flex items-start justify-between p-4 bg-gray-700/30 rounded-xl border border-gray-700/50 hover:border-gold-500/30 transition-all duration-200 hover:shadow-md hover:bg-gray-700/50"
                            >
                              <div className="flex-1">
                                <p className="font-semibold text-gray-100 text-lg">{className}</p>
                                <p className="text-sm text-gray-300 flex items-center gap-1 mt-2">
                                  <Clock className="w-4 h-4 text-gold-400" />
                                  {scheduledDate}{startTime ? ` at ${startTime}` : ''}
                                </p>
                              </div>
                              <button className="badge-gold test-xs"
                                onClick={() => {
                                  const scheduleElement = document.getElementById('class-calendar');
                                  {/* Scroll down to the calendar view for upcoming classes */ }
                                  scheduleElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                  }}>View</button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* View calendar button */}
                  <button
                    onClick={() => {
                      const scheduleElement = document.getElementById('class-calendar');
                      {/* Scroll down to the calendar view for upcoming classes */ }
                      scheduleElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="group w-full mt-2 px-6 py-4 bg-gold-500/90 hover:bg-gold-500 text-gray-900 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-gold-500/30 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <GiWeightLiftingUp className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
                    <span>View Schedule</span>
                  </button>
                </div>

                {/* Gym Acheivement Feed (Maybe goals we've acheived idk) */}
                <div className="bg-gray-800/60 border border-gray-700/50 hover:border-gold-500/30 transition-all duration-300 p-6 hover:shadow-xl hover:shadow-gold-500/5 hover:-translate-y-1 stagger-1">
                  <h3 className="text-xl font-bold text-gray-100 mb-5 flex items-center gap-2">
                    <GiMuscleUp className="w-7 h-7 text-gold-400" />
                    Gym Achievements Feed
                  </h3>
                  <div className="space-y-4">
                    {/* TODO: Add acheivement information here once we figure out what it is */}
                    <div className="text-center py-8 text-gray-400">
                      {/* TODO: Need to change this */}
                      <p>I genuinely have no idea what would go here :/</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Add a stock image of a gym for more asthetics and seperation */}
              <div className="relative rounded-2xl border border-gray-700/50 overflow-hidden h-48">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1689877020200-403d8542d95d?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
              </div>
              {/* Add the Class Calendar component to the page  */}
              <div id="class-calendar" className="stagger-2">
                <ClassCalendar userId={userId} />
              </div>
            </div>
          )}

          {activeTab === 'profile' && <ProfileEditor profile={myProfile} setProfile={setMyProfile} />}
        </div>
      </main>
    </div>
  );
};