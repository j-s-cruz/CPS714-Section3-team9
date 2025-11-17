import React from 'react';
import SignupsCancellationsChart from './signups_cancellations_chart';
import MostPopularChart from './most_popular_chart';
import MostBusyTimesChart from './most_busy_chart';
import GymUsageChartv2 from './hourly_gym_usage_chartv2';
import MembershipChartv2 from './membership_chartv2';
import DaysHoursChart from './days_hours_chart';
import ActiveMembers from './active_members';
import MemberTypesChart from './member_types_chart';
import Card from './Card';

export const Analytics: React.FC = () => {
    return (
        <div className="w-full p-6 bg-slate-800 text-slate-100 rounded-lg border-2 border-[#ca8a04]">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <div className="min-h-[260px]">
                                <SignupsCancellationsChart />
                            </div>
                        </Card>

                    </div>

                    <div className="space-y-6">
                        <Card>
                            <ActiveMembers />
                        </Card>

                        <Card>
                            <MemberTypesChart />
                        </Card>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <Card>
                        <MembershipChartv2 />
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <MostPopularChart />
                    </Card>
                    <Card>
                        <MostBusyTimesChart />
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <Card>
                        <DaysHoursChart />
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <Card>
                        <GymUsageChartv2 />
                    </Card>
                </div>
            </div>
        </div>
        
    );
};

export default Analytics;