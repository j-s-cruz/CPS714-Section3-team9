import React, { useEffect, useState } from 'react';
import ReactApexChart from "react-apexcharts";

// https://apexcharts.com/react-chart-demos/line-charts/syncing-charts/

export const SignupsCancellationsChart: React.FC = () => {

    const [chartData, setChartData] = useState<(string | number)[][]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getMembershipData();
            setChartData(data as (string | number)[][]);
        };

        fetchData();
    }, []);
    
    var chartInfo = {
        series: [{
            name: 'Members',
            data: chartData
        }],
        options: {
            chart: {
            type: 'area',
            stacked: false,
            height: 350,
            zoom: {
                type: 'x',
                enabled: true,
                autoScaleYaxis: true
            },
            toolbar: {
                autoSelected: 'zoom'
            }
            },
            dataLabels: {
                enabled: false
            },
            markers: {
                size: 0,
            },
            title: {
                text: 'Number of FitHub Members',
                align: 'left'
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: false,
                    opacityFrom: 0.5,
                    opacityTo: 0,
                    stops: [0, 90, 100]
                },
            },
            yaxis: {
                // title: {
                //     text: 'Number of Members'
                // },
            },
            xaxis: {
                type: 'datetime',
            },
            tooltip: {
                shared: false,
            }
        },
    };

    return (
        <div>
            <div id="chart">
                {
                    (chartData.length > 0) &&
                    //@ts-expect-error
                    <ReactApexChart options={chartInfo.options} series={chartInfo.series} type="area" height={350} />
                }
            </div>
        </div>
    );
}

export default SignupsCancellationsChart;