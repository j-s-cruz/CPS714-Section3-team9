import React, { useEffect, useState } from 'react';
import { getMemberTypesData } from './analytics_service';
import ReactApexChart from 'react-apexcharts';

export const MemberTypesChart: React.FC = () => {
    const [memberTypesData, setMemberTypesData] = useState<(string | number)[][]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const memberTypesData: any = await getMemberTypesData();
            setMemberTypesData(memberTypesData as (string | number)[][]);
        };

        fetchData();
    }, []);

    var chartInfo = {
        series: memberTypesData[1],
        options: {
            chart: {
            width: 380,
            type: 'pie',
            },
            labels: memberTypesData[0],
            responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                width: 200
                },
                legend: {
                position: 'bottom'
                }
            }
            }]
        },
        
        
    }


    return (
        <div>
            { memberTypesData.length > 0 &&
                <ReactApexChart options={chartInfo.options} series={chartInfo.series} type="pie" width={380} />
            }  
        </div>
    );
};

export default MemberTypesChart;