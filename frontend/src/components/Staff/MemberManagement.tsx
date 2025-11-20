import { useEffect, useState } from "react";
import { admin_supabase} from "./supabaseClient";

const MemberManagement = () => {
  const [members, setMembers] = useState<any[]>([]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchMembers(); 
  }, []);

  //Function to fetch data from Supabase
  const fetchMembers = async () => {
    try{
      //Get User Profiles first
        const { data: profilesData, error: profilesError } = await admin_supabase
        .from('profiles') //the table in Supabase we fetch from
        .select('*')
        .order('created_at', { ascending: false }); //get newest members first
      
      if (profilesError){
        console.error("Error occured while fetching profiles: ", profilesError);
        throw profilesError;
      }
      if (!profilesData){
        console.log("DATA is NULL: ", {profilesData})
        return;
      }

      //Then retrive all memberships
      const {data: membershipsData, error: membershipsError} = await admin_supabase
      .from('memberships')
      .select('*')
      if (membershipsError){
        console.error("Error occured while fetching memberships: ", membershipsError);
        throw membershipsError;
      } 
      //manually map each profile to thier memberships. The reason i do this is cuz, there is no FK relatoinship supabase knows about in its schema cache even though memberships.user_id points to profiles.id. I got this error --> PGRST200, 'searched for FK relationship but no match was found. Could not find a relationship between profiles and memberships in schema cache
      //profiledata is an array.  Map iterates over the array and returns a new one where each one can be transformed.
      const mergeData = profilesData.map(profile => ({ 
        ...profile, //spread operator: copy all existing properties of profile into new object.
        memberships: membershipsData?.filter(m => m.user_id === profile.id) || [], //memberships is the new property too add to each profile. using filter to keep only ones that match m.user id and profile.id
      }));

      console.log(mergeData);
      setMembers(mergeData);
    }catch (error){
      console.log("error happened while fetching members: ", error);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-sm border border-yellow-500 self-start">
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
                  {member.memberships?.[0]?.tier || 'No subscription'}
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

export default MemberManagement;