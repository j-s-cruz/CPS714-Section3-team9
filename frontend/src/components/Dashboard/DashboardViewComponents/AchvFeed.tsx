/* TODO: Add something here. Still not sure what this actually is */
import { GiMuscleUp } from 'react-icons/gi';

export const AchvFeed = () => {
  return (
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
  );
};