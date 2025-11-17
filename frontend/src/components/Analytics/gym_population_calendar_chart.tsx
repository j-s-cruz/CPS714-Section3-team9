import React, { useEffect, useState } from 'react';
import { Chart } from "react-google-charts";
import { getDailyVisitsData } from './analytics_service';

export const GymPopulationCalendarchart: React.FC = () => {

    const [chartData, setChartData] = useState<(string | number)[][]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getDailyVisitsData();
            setChartData(data as (string | number)[][]);
        };

        fetchData();
    }, []);

    var dailyGymUsageOptions = {
        title: 'Daily Gym Usage',
    };


    return (
        <div>
            { 
                (chartData.length > 0) && 
                <Chart
                    chartType="Calendar"
                    data={chartData}
                    options={dailyGymUsageOptions}
                />
            }
        </div>
    );
};

export default GymPopulationCalendarchart