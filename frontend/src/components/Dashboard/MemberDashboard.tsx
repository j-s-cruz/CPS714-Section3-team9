import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  User,
  TrendingUp,
  Settings,
  Bell,
  Clock,
  LogOut,
} from 'lucide-react';
import { GiWeightLiftingUp, GiMuscleUp, GiRunningShoe } from 'react-icons/gi';
import { FaDumbbell } from 'react-icons/fa';
import { ProfileEditor } from '../Profile/ProfileEditor';
import { StaffDashboard } from '../Staff/StaffDashboard';
import { ClassCalendar } from './ClassCalendar';

type TabType = 'dashboard' | 'profile' | 'staff';

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + 1;
  return new Date(d.setDate(diff));
}

export const MemberDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    fetchUpcomingBookings();
    fetchNotifications();
  }, []);

  const fetchUpcomingBookings = async () => {
    /* Place holder for fetching upcoming bookings from team 3 */
    await supabase
      .from('ph')
      .select('ph');


    /* Dummy data. Once we get the database we can ignore this*/
    const dummyEvents: any[] = [
      {
        id: '1',
        title: 'Morning Yoga',
        start_time: '9:00 AM',
        end_time: '3:00 PM',
        date: '2025-11-15',
        instructor: 'Instructor'
      },
      {
        id: '2',
        title: 'HIIT Training',
        start_time: '6:00 PM',
        end_time: '7:00 PM',
        date: '2025-11-16',
        instructor: 'Instructor'
      },
      {
        id: '3',
        title: 'Spin Class',
        start_time: '10:00 AM',
        end_time: '11:00 AM',
        date: '2025-11-18',
        instructor: 'Instructor'
      },
      {
        id: '4',
        title: 'CrossFit',
        start_time: '7:00 AM',
        end_time: '8:00 AM',
        date: '2025-11-19',
        instructor: 'Instructor'
      },
      {
        id: '5',
        title: 'Pilates',
        start_time: '5:30 PM',
        end_time: '6:30 PM',
        date: '2025-11-20',
        instructor: 'Instructor'
      },
      {
        id: '6',
        title: 'Boxing',
        start_time: '8:00 AM',
        end_time: '9:00 AM',
        date: '2025-11-21',
        instructor: 'Instructor'
      },
      {
        id: '7',
        title: 'Zumba',
        start_time: '12:00 PM',
        end_time: '1:00 PM',
        date: '2025-11-22',
        instructor: 'Instructor'
      },
      {
        id: '8',
        title: 'Power Lifting',
        start_time: '4:00 PM',
        end_time: '5:00 PM',
        date: '2025-11-23',
        instructor: 'Instructor'
      },
      {
        id: '9',
        title: 'Power Lifting',
        start_time: '4:00 PM',
        end_time: '5:00 PM',
        date: '2025-11-13',
        instructor: 'Instructor'
      },
      {
        id: '1',
        title: 'lmao?',
        start_time: '9:00 AM',
        end_time: '3:00 PM',
        date: '2025-11-11',
        instructor: 'Instructor'
      }
    ];

    // Get this week's start (Monday) and end (Sunday)
    const now = new Date();
    const weekStart = startOfWeek(now);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    /* Limit the upcoming events to this week and filter out past events */
    const thisWeekEvents = dummyEvents
      .filter(event => {
        /* Parse date string as local date (avoid timezone issues) */
        const [year, month, day] = event.date.split('-').map(Number);
        const eventDate = new Date(year, month - 1, day);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        /* Keep event only if its today or on a future day within this week */
        return eventDate >= weekStart && eventDate <= weekEnd && eventDate >= today;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.start_time}`);
        const dateB = new Date(`${b.date} ${b.start_time}`);
        return dateA.getTime() - dateB.getTime();
      });

    setUpcomingBookings(thisWeekEvents);
    console.log('Bookings set');
  };

  const fetchNotifications = async () => {
    /* Placeholder for notifications database */
    const { data } = await supabase
      .from('ph')
      .select('ph');

    setNotifications(data || []);
  };

  const subscription = profile?.membership_subscriptions?.[0];
  const tier = subscription?.membership_tiers;
  const initials = (profile?.full_name || 'U').split(' ').map((p: string) => p[0]).slice(0, 2).join('');

  return (
    <div className="flex flex-col h-screen bg-gray-900 overflow-hidden">
      {/* Banner */}
      <header className="bg-gray-800/95 border-b border-gray-700/50 backdrop-blur-md shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gold-500/90 p-2 rounded-lg shadow-md hover:shadow-gold-500/30 transition-all duration-300 hover:scale-105">
                <FaDumbbell className="w-6 h-6 text-gray-900" />
              </div>
              <span className="text-xl font-bold text-gold-400 tracking-tight">FitHub</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gold-400 transition-all duration-200 hover:bg-gray-700/50 rounded-lg">
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-gold-500 rounded-full animate-pulse-gold shadow-lg shadow-gold-500/50"></span>
                )}
              </button>

              {/* Section for dashboard and profile buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'dashboard'
                    ? 'bg-gold-500/90 text-gray-900 shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-gold-400'
                    }`}
                >
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  Dashboard
                </button>
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
                {profile?.is_staff && (
                  <button
                    onClick={() => setActiveTab('staff')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'staff'
                      ? 'bg-gold-500/90 text-gray-900 shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-gold-400'
                      }`}
                  >
                    <Settings className="w-4 h-4 inline mr-1" />
                    Staff Panel
                  </button>
                )}
              </div>

              {/* Sign out section */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-10 h-10 bg-gold-500/90 rounded-full flex items-center justify-center text-gray-900 font-bold text-sm shadow-md hover:shadow-gold-500/30 transition-all duration-300 hover:scale-105"
                >
                  {initials}
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-700">
                      <div className="text-sm font-bold text-gray-100 truncate">{profile?.full_name || 'User'}</div>
                      <div className="text-xs text-gray-400 truncate">{user?.email}</div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={signOut}
                        className="w-full flex items-center gap-3 p-2 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-red-400 transition-all duration-300"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-semibold">Sign Out</span>
                      </button>
                    </div>
                  </div>
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
              <div className="relative rounded-2xl border border-gold-500/30 p-6 overflow-hidden">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1200&q=80')",
                  }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-gold-500/60 to-gold-600/60" />

                {/* Content */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-gold-500/90 p-3 rounded-xl shadow-lg">
                      <GiMuscleUp className="w-8 h-8 text-gray-900" />
                    </div>
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
                        ? `Renews ${new Date(subscription.renewal_date).toLocaleDateString()}`
                        : 'No renewal date'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800/90 rounded-2xl border border-gray-700/50 hover:border-gold-500/30 transition-all duration-300 p-6 hover:shadow-xl hover:shadow-gold-500/5 hover:-translate-y-1 stagger-1">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                      <GiRunningShoe className="w-6 h-6 text-gold-400" />
                      Upcoming Classes
                    </h3>
                  </div>

                  <div className="mb-2 max-h-64 overflow-y-auto">
                    {console.log('Rendering bookings, length:', upcomingBookings.length, 'bookings:', upcomingBookings)}
                    {upcomingBookings.length === 0 ? (
                      <div className="text-center py-16 bg-gray-700/30 rounded-xl border border-dashed border-gray-600">
                        <p className="text-gray-400 mb-4">No upcoming classes booked</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {upcomingBookings.map((booking: any) => (
                          <div
                            key={booking.id}
                            className="flex items-start justify-between p-5 bg-gray-700/30 rounded-xl border border-gray-700/50 hover:border-gold-500/30 transition-all duration-200 hover:shadow-md hover:bg-gray-700/50"
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-gray-100 text-lg">
                                {booking.title}
                              </p>
                              <p className="text-sm text-gray-300 flex items-center gap-1 mt-2">
                                <Clock className="w-4 h-4 text-gold-400" />
                                {new Date(booking.date).toLocaleDateString()} at{' '}
                                {booking.start_time}
                              </p>
                            </div>
                            <span className="badge-status text-xs">Confirmed</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* View calendar button */}
                  <button
                    onClick={() => {
                      const scheduleElement = document.getElementById('class-calendar');
                      scheduleElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="group w-full mt-2 px-6 py-4 bg-gold-500/90 hover:bg-gold-500 text-gray-900 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-gold-500/30 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <GiWeightLiftingUp className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
                    <span>View Schedule</span>
                  </button>
                </div>

                <div className="bg-gray-800/60 rounded-2xl border border-gray-700/50 hover:border-gold-500/30 transition-all duration-300 p-6 hover:shadow-xl hover:shadow-gold-500/5 hover:-translate-y-1 stagger-2">
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

              {/* class calendar section */}
              <div id="class-calendar" className="stagger-2">
                <ClassCalendar userId={user?.id} />
              </div>
            </div>
          )}

          {activeTab === 'profile' && <ProfileEditor />}
          {activeTab === 'staff' && profile?.is_staff && <StaffDashboard />}
        </div>
      </main>
    </div>
  );
};
