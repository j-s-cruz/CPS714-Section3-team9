import { useState, useEffect } from 'react';
import { admin_supabase } from './supabaseClient';
import { Users, Calendar, TrendingUp, DollarSign, Plus, Bell, BarChart3 } from 'lucide-react';
import DumbbellIcon from '../../assets/dumbbell.png';



export const StaffDashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalClasses: 0,
    todayBookings: 0,
  });
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [profiles, subscriptions, classes, bookings] = await Promise.all([
      admin_supabase.from('profiles').select('id', { count: 'exact' }),
      admin_supabase.from('membership_subscriptions').select('id', { count: 'exact' }).eq('status', 'active'),
      admin_supabase.from('class').select('id', { count: 'exact' }),
      admin_supabase
        .from('class_bookings')
        .select('id', { count: 'exact' })
        .eq('status', 'confirmed')
        .gte('booked_at', new Date().toISOString().split('T')[0]),
    ]);

    setStats({
      totalMembers: profiles.count || 0,
      activeMembers: subscriptions.count || 0,
      totalClasses: classes.count || 0,
      todayBookings: bookings.count || 0,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-slate-500 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">Staff Dashboard
          <img src={DumbbellIcon} alt="Dashboard DumbbellIcon Icon" className='w-10 h-9 relative -top-0.5'/>
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddClass(true)}
            className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-500 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Class
          </button>
          <button
            onClick={() => setShowAnnouncement(true)}
            className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-500 transition flex items-center gap-2"
          >
            <Bell className="w-4 h-4" />
            Announce
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-6 shadow-md border border-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white">Total Members</span>
            <Users className="w-5 h-5 text-orange" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalMembers}</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-md border border-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white">Active Subscriptions</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.activeMembers}</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-md border border-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white">Total Classes</span>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalClasses}</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-md border border-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white">Today's Bookings</span>
            <BarChart3 className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.todayBookings}</p>
        </div>
      </div>

      <div className="mb-6">
        <Report/>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MemberManagement />
        <ClassManagement />
      </div>
      {showAddClass && <AddClassModal onClose={() => setShowAddClass(false)} />}
      {showAnnouncement && <AnnouncementModal onClose={() => setShowAnnouncement(false)} />}
    </div>
  );
};

//COMPONENT: REPORTS & ANALYTICS

const Report = () => {
  const [charts, setCharts] = useState<any[]>([]);

  useEffect(() => {
    //fetchReports();//to be included by team 8, these are just placeholders
  }, []);

  //const fetchReports = async () => {}

  return(
    <div
        style={{
        width: "100%",
        height: "300px", // reserve height for charts
        border: "2px dashed #ccc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#999",
        fontStyle: "italic",
      }}
    >
    Reports & Analytics Charts
    </div>
  );
};

//COMPONENT: MEMBER MANAGEMENT
const MemberManagement = () => {
  const [members, setMembers] = useState<any[]>([
    {
      id: 1,
      full_name: 'Reyhan Emik',
      created_at: new Date().toISOString(),
      membership_subscriptions: [{membership_tiers: {name: 'Gold'}}],
    },
    {
      id: 2,
      full_name: 'Rana Hamood',
      created_at: new Date().toISOString(),
      membership_subscriptions: [{membership_tiers: {name: 'Gold'}}]
    },
  ]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchMembers(); 
  }, []);

  //Function to fetch data from Supabase
  const fetchMembers = async () => {
    try{
        const { data } = await supabase
        .from('profiles') //the table in Supabase we fetch from
        .select('*, membership_subscriptions(*, membership_tiers(name))')
        .order('created_at', { ascending: false }) //get newest members first
        .limit(25);

        if (data && data.length > 0) {
          setMembers(data) // if fetch from DB was successful and data exists, replace the members state with the fetched data
        } else {
          setMembers(prevMembers => prevMembers); //if no data was fetched, keep prev dummy values in 'members'
        }
      } catch (error) {
        console.log("Error getting members from DB: ", error); //keep dummy members if there was an error
        setMembers(prevMembers => prevMembers); 
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-sm border border-white self-start">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left text-white font-bold text-lg mb-4 flex justify-between items-center"
      >
        Member Management
        <span className="text-slate-300 text-l">{open ? '-' : '+'}</span> 
      </button>

      {open && (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-semibold text-slate-900">{member.full_name}</p>
                <p className="text-sm text-slate-600">
                  {member.membership_subscriptions[0]?.membership_tiers?.name || 'No subscription'}
                </p>
              </div>
              <span className="text-sm text-slate-500">
                {new Date(member.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

//COMPONENT: CLASS MANAGEMENT
const ClassManagement = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [openClass, setOpenClass] = useState(false);

  useEffect(() => {
    fetchAllClasses();
  }, []);

  const fetchAllClasses = async () => {
    try{
      const { data, error } = await admin_supabase
        .from('class')
        .select('*')
        .order('class_name');
      
      if (error){
        console.log("Issues fetching classes: ", error);
        return;
      }
      if (data){
        const formatted_name = data.map((cls) => ({
          ...cls,
          instructor_name:  `${cls.instructor_fname ?? ""} ${cls.instructor_lname ?? ""}`.trim(),

        }));
        setClasses(formatted_name);
      }
    
  }catch (err){
    console.log("some error occured:", err);
  }
  };

  return (
     <div className="bg-gray-800 rounded-xl p-6 shadow-sm border border-white self-start">
        <button
          onClick={() => setOpenClass(!openClass)}
          className="w-full text-left text-white font-bold text-lg mb-4 flex justify-between items-center"
        >
          Class Management
          <span className="text-slate-300 text-l">{openClass ? '-' : '+'}</span> 
        </button>
        {openClass &&
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {classes.map((cls, index) => (
              <div key={cls.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-yellow-600">{cls.class_name}</p>
                    <p className="text-sm text-slate-600">{cls.instructor_name}</p>
                    <p className="text-xs text-slate-600">{cls.day} {cls.time}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-slate-700">Bookings: {cls.total_bookings} Capacity: {cls.capacity} </span>
              </div>
            ))}
          </div>
        }
    </div>
  );
};

//COMPONENT: ADD CLASS FEAUTURE
const AddClassModal = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    classId: '',
    first_name: '',
    last_name: '',
    capacity: '',
    date: '',
    time: '',
  });
 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await admin_supabase.from('Class').insert({
        class_name: formData.classId,
        instructor_fname: formData.first_name, 
        instructor_lname: formData.last_name,
        capacity: formData.capacity,
        day: formData.date,
        time: formData.time,

        
      });

      if (error) throw error;
      onClose();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-200 rounded-xl border-8 border-slate-700 p-6 max-w-md w-full m-4">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Schedule New Class</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-yellow-600 mb-2">Class</label>
            <input
              type="text"
              value={formData.classId}
              onChange={(e) => {
                if (!/^[a-zA-Z\s]*$/.test(e.target.value))  // /regex/.test(string) --> for client-side input validation
                {
                  console.error("Input for the 'Class' field is invalid or you entered an empty string.")
                  return; 
                }
                setFormData({ ...formData, classId: e.target.value })            
                }}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              placeholder="ex: Boxing and Kickboxing"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-600 mb-2">Instructor First Name</label>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 italic"
              required
              placeholder="ex: Nico"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-yellow-600 mb-2">Instructor Last Name</label>
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 italic"
              required
              placeholder="ex: Ali Walsh"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-600 mb-2">Set Class Capacity</label>
            <input
              type="number"
              min="0"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 italic"
              required
              placeholder="ex: 14"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-600 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-600 mb-2">Start Time</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AnnouncementModal = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    priority: 'normal',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('announcements').insert({
        title: formData.title,
        message: formData.message,
        priority: formData.priority,
        is_active: true,
      });

      if (error) throw error;
      onClose();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full m-4">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Create Announcement</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 text-black"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 text-black"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700"
            >
              Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
