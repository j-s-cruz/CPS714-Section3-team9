import React, { useEffect, useState } from 'react';
import { Chart } from "react-google-charts";
import { getData } from './analytics_service';
import MembershipChart from './membership_chart';
import SignupsCancellationsChart from './signups_cancellations_chart';
import MostPopularChart from './most_popular_chart';
import MostBusyTimesChart from './most_busy_chart';
import GymUsageChart from './hourly_gym_usage_chart';
import GymUsageChartv2 from './hourly_gym_usage_chartv2';
import MembershipChartv2 from './membership_chartv2';
import GymPopulationCalendarchart from './gym_population_calendar_chart';
import DaysHoursChart from './days_hours_chart';

// https://www.react-google-charts.com/examples/
// https://developers.google.com/chart/interactive/docs


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
// just list them? same as gym usage?

// Show what times are most busy
// [member_id, checkin_datetime, checkout_datetime]

// Date gym usage? https://www.react-google-charts.com/examples/calendar
// ONLY WORKS FOR THE PAST 1 YEAR


export const Analytics: React.FC = () => {

    return (
        <div>
            <SignupsCancellationsChart />
            <br></br><br></br><br></br>

            <MostPopularChart />
            <br></br><br></br><br></br>
            
            <MostBusyTimesChart />
            <br></br><br></br><br></br>
            <GymUsageChartv2 />
            <br></br><br></br><br></br>
            <MembershipChartv2 />
            <br></br><br></br><br></br>
            <GymPopulationCalendarchart />
            <br></br><br></br><br></br>
            <DaysHoursChart />
        </div>
    );
};

export default Analytics;