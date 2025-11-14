import React, { useEffect, useState } from 'react';
import ReactApexChart from "react-apexcharts";

export const MostPopularChart: React.FC = () => {
    const [popularityData, setPopularityData] = useState<(string | number)[][]>([]);

    useEffect(() => {
        // const fetchData = async () => {
        //     const popularityDataTemp = await getPopularityData();
        //     setPopularityData(popularityDataTemp as (string | number)[][]);
        // };

        // fetchData();
    }, []);

    var chartInfo = {
        series: [{
            data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
        }],
        options: {
            chart: {
            type: 'bar',
            height: 380
            },
            plotOptions: {
            bar: {
                barHeight: '100%',
                distributed: true,
                horizontal: true,
                dataLabels: {
                position: 'bottom'
                },
            }
            },
            colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e',
            '#f48024', '#69d2e7'
            ],
            dataLabels: {
                enabled: true,
                textAnchor: 'start',
                style: {
                    colors: ['#fff']
                },
                formatter: function (val: any, opt: any) {
                    return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
                },
                offsetX: 0,
                dropShadow: {
                    enabled: true
                }
            },
            stroke: {
            width: 1,
            colors: ['#fff']
            },
            xaxis: {
            categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
                'United States', 'China', 'India'
            ],
            },
            yaxis: {
            labels: {
                show: false
            }
            },
            title: {
                text: 'Most Popular Classes',
                align: 'center',
                floating: true
            },
            tooltip: {
                theme: 'dark',
                x: {
                    show: false
                },
                y: {
                    title: {
                    }
                },
            },
            legend: {
                show: false
            }
        },
    }

    return (
        <div>
            <ReactApexChart options={chartInfo.options} series={chartInfo.series} type="bar" height={380} />
        </div>
    );
};

export default MostPopularChart;