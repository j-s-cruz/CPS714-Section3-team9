import React, { useEffect, useState } from 'react';
import { Chart } from "react-google-charts";
import { getData } from './analytics_service';

// Track total active members

// name, address, age, gender, fitness goals, contact number, email, emergency phone number, which membership do they want, fitness goals (we can give a dropdown list) etc.
// [member_id, membership_type, signup_date, membership_status, cancellation_date]
// Line chart over time, take signups per month and cancellations per month and combine them for membership per month


// Track new signups
// Line chart over time, signups per month

// Track cancellations
// Line chart over time, cancellations per month


// Show which classes are most popular
// [class_name, class_time, instructor_name, attendance_count]
// Bar chart of class_name vs attendance_count


// Show which class times are most busy?
// just list them?

// Show what times are most busy    <- histogram over time
// [member_id, checkin_datetime, checkout_datetime]

// Date gym usage? https://www.react-google-charts.com/examples/calendar


export const Analytics: React.FC = () => {
    const [chartData, setChartData] = useState<(string | number)[][]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getData();
            setChartData(data as (string | number)[][]);
        };

        fetchData();
    }, []);

    var newSignupsData = [
        ['Month', 'New Signups'],
        [new Date('2024-01-01'), 50],
        [new Date('2024-02-01'), 75],
        [new Date('2024-03-01'), 100],
        [new Date('2024-04-01'), 80],
        [new Date('2024-05-01'), 120],
        [new Date('2025-06-01'), 90],
        [new Date('2025-07-01'), 110]
    ]
    
    var cancellationsData = [
        ['Month', 'New Signups'],
        [new Date('2024-01-01'), 5],
        [new Date('2024-02-01'), 7],
        [new Date('2024-03-01'), 10],
        [new Date('2024-04-01'), 8],
        [new Date('2024-05-01'), 12],
        [new Date('2025-06-01'), 9],
        [new Date('2025-07-01'), 11]
    ]

    var activeMembersData = [
        ['Month', 'New Signups'],
        [new Date('2024-01-01'), 500],
        [new Date('2024-02-01'), 750],
        [new Date('2024-03-01'), 1000],
        [new Date('2024-04-01'), 800],
        [new Date('2024-05-01'), 1200],
        [new Date('2025-06-01'), 900],
        [new Date('2025-07-01'), 1100]
    ]



    var lineData = [
        ['Time of Day', 'Number of Members in Gym'],
        ['12 am', 2],
        ['1 am', 3],
        ['2 am', 4],
        ['3 am', 2],
        ['4 am', 1],
        ['5 am', 0],
        ['6 am', 1],
        ['7 am', 2],
        ['8 am', 3],
        ['9 am', 4],
        ['10 am', 5],
        ['11 am', 2],
        ['12 pm', 2],
        ['1 pm', 3],
        ['2 pm', 4],
        ['3 pm', 2],
        ['4 pm', 1],
        ['5 pm', 0],
        ['6 pm', 1],
        ['7 pm', 2],
        ['8 pm', 3],
        ['9 pm', 4],
        ['10 pm', 5],
        ['11 pm', 2],
    ]

    var lineOptions = {
        title: 'Number of Gym Occupants by Time of Day',
        hAxis: {
            title: 'Time of Day',
            showTextEvery: 1,
            textPosition: 'out',
        }, 
        legend: "none",
    };

    return (
        <div>
            <Chart 
                chartType="LineChart"
                data={newSignupsData}
                options={lineOptions}
            />
            <br></br><br></br><br></br>
            <Chart 
                chartType="LineChart"
                data={lineData}
                options={lineOptions}
            />
            <br></br><br></br><br></br>
            <Chart
                chartType="ScatterChart"
                data={chartData}
                options={{
                    title: "Average Weight by Age",
                    legend: "none",
                }}
            />
        </div>
    );
};

export default Analytics;