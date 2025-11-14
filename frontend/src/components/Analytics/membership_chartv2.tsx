import React, { useEffect, useState } from 'react';
import { getMembershipData } from './analytics_service';
import ReactApexChart from "react-apexcharts";

export const MembershipChartv2: React.FC = () => {

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
              name: 'Gym Membership',
              data: chartData
            }],
            options: {
              chart: {
                id: 'chart2',
                type: 'line',
                height: 230,
                dropShadow: {
                    enabled: true,
                    enabledOnSeries: [1]
                },
                toolbar: {
                  autoSelected: 'pan',
                  show: false
                },
                zoom: {
                    type: 'x',
                    enabled: true,
                    autoScaleYaxis: true
                },
              },
              colors: ['#008FFB'],
              stroke: {
                width: 3
              },
              dataLabels: {
                enabled: false
              },
              stroke: {
                width: [2,6],
                curve: ['straight','monotoneCubic']
              },
              fill: {
                opacity: [1,0.75],
              },
              markers: {
                size: 0
              },
              yaxis: [
                {
                  seriesName: 'Gym Membership',
                  axisTicks: {
                    show: true,
                    color: '#008FFB'
                  },
                  axisBorder: {
                    show: true,
                    color: '#008FFB'
                  },
                  labels: {
                    style: {
                      colors: '#008FFB',
                    }
                  },
                  title: {
                    text: "Flies",
                    style: {
                      color: '#008FFB'
                    }
                  },
                }
              ],
              xaxis: {
                type: 'datetime'
              }
            },
          
            seriesLine: [{
              name: 'Gym Membership',
              data: chartData
            }],
            optionsLine: {
              chart: {
                id: 'chart1',
                height: 130,
                type: 'area',
                brush:{
                  target: 'chart2',
                  enabled: true
                },
                selection: {
                  enabled: true
                },
              },
              colors: ['#008FFB'],
              stroke: {
                width: [1, 3],
                curve: ['straight', 'monotoneCubic']
              },
              fill: {
                type: 'gradient',
                gradient: {
                  opacityFrom: 0.91,
                  opacityTo: 0.1,
                }
              },
              xaxis: {
                type: 'datetime',
                tooltip: {
                  enabled: false
                }
              },
              yaxis: {
                max: 100,
                tickAmount: 2
              }
            },
          
          
        };

    return (
        <div>
            <div id="chart">
                {
                    (chartData.length > 0) &&
                    <div id="wrapper">
                        <div id="chart-line2">
                            <ReactApexChart options={chartInfo.options} series={chartInfo.series} type="line" height={230} />
                        </div>
                        <div id="chart-line">
                            <ReactApexChart options={chartInfo.optionsLine} series={chartInfo.seriesLine} type="area" height={130} />
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default MembershipChartv2;