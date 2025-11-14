import React, { useEffect, useState } from 'react';
import ReactApexChart from "react-apexcharts";
import { getCancellationsData, getSignupsData } from './analytics_service';

// https://apexcharts.com/react-chart-demos/line-charts/syncing-charts/

export const SignupsCancellationsChart: React.FC = () => {

    const [signupsData, setSignupsData] = useState<(string | number)[][]>([]);
    const [cancellationsData, setCancellationsData] = useState<(string | number)[][]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const signupsDataTemp = await getSignupsData();
            setSignupsData(signupsDataTemp as (string | number)[][]);

            const cancellationsDataTemp = await getCancellationsData();
            setCancellationsData(cancellationsDataTemp as (string | number)[][]);
        };

        fetchData();
    }, []);
    
    var chartInfo = {       
        series: [{
            name: 'Signups',
            data: signupsData
        }],
        options: {
            chart: {
                id: 'fb',
                group: 'social',
                type: 'line',
            },
            xaxis: {
                type: 'datetime',
            },
            title: {
                text: 'New Signups Per Month',
                align: 'left'
            },
            stroke: {
                curve: 'smooth',
            },
            colors: ['#008FFB']
        },
        
        seriesLine2: [{
            name: 'Cancellations',
            data: cancellationsData
        }],
        optionsLine2: {
            chart: {
                id: 'tw',
                group: 'social',
                type: 'line',
            },
            xaxis: {
                type: 'datetime',
            },
            title: {
                text: 'Cancellations Per Month',
                align: 'left'
            },
            stroke: {
                curve: 'smooth',
            },
            colors: ['#ff0000ff']
        },    
    };

    return (
        <div>
            <div id="chart">
                {
                    (signupsData.length > 0) && (cancellationsData.length > 0) &&
                    <div>
                        <div id="chart-line">
                            <ReactApexChart options={chartInfo.options} series={chartInfo.series} type="line" height={160} />
                        </div>
                        <div id="chart-line2">
                            <ReactApexChart options={chartInfo.optionsLine2} series={chartInfo.seriesLine2} type="line" height={160} />
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default SignupsCancellationsChart;