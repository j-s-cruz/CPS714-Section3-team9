import React, { useEffect, useState } from 'react';
import { getMemberTypesData } from '../analytics_service';
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
                foreColor: '#FFF'
            },
            legend: {
                    position: 'bottom'
            },
            title: {
                text: 'Number of Active Membership Types',
                align: 'left',
                style: {
                    fontSize: '16px',
                }
            },
            labels: memberTypesData[0],
            responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 20
                },
                legend: {
                    position: 'left'
                }
            }
            }]
        },
        
        
    }


    return (
        <div>
            { memberTypesData.length > 0 &&
                //@ts-expect-error
                <ReactApexChart options={chartInfo.options} series={chartInfo.series} type="pie" width={380} />
            }  
        </div>
    );
};

export default MemberTypesChart;