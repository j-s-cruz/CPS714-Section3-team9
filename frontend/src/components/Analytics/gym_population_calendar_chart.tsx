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
        title: 'Daily Gym Usage Year-To-Date',
        hAxis: {
            //use style for horizontal axis 
             textStyle: { color: '#FFF' }
        },
        vAxis: {
            //use style for horizontal axis 
             textStyle: { color: '#FFF' }
        }
    };


    return (
        <div>
            { 
                (chartData.length > 0) && 
                <div
                    style={{ color: '#ffe3e3d2' }}
                >
                    <Chart
                        chartType="Calendar"
                        data={chartData}
                        options={dailyGymUsageOptions}
                    />
                </div>
            }
        </div>
    );
};

export default GymPopulationCalendarchart