import axios from "axios";

const api = 'http://localhost:8000'

export const getData = async () => {

  return new Promise((resolve) => {
    resolve(
        [
        ["Age", "Weight"],
        [4, 16],
        [8, 25],
        [12, 40],
        [16, 55],
        [20, 70],
    ]);
  });
};

export const getMembershipData = async () => {
    try {
        const apiData = await axios.get<any[]>(api + '/data/membership_data');
        return apiData.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error.message);
            return error.message;
        } 
        else {
            console.log("Unexpected Error");
        }
    }
}

export const getSignupsData = async () => {
    try {
        const apiData = await axios.get<any[]>(api + '/data/signups_data');
        return apiData.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error.message);
            return error.message;
        } 
        else {
            console.log("Unexpected Error");
        }
    }
}

export const getCancellationsData = async () => {
    try {
        const apiData = await axios.get<any[]>(api + '/data/cancellations_data');
        return apiData.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error.message);
            return error.message;
        } 
        else {
            console.log("Unexpected Error");
        }
    }
}

export const getSignupsAndCancellationsData = async () => {
    try {
        const apiData = await axios.get<any[]>(api + '/data/signups_cancellations_data');
        return apiData.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error.message);
            return error.message;
        } 
        else {
            console.log("Unexpected Error");
        }
    }
}

export const getClassPopularityData = async () => {
    try {
        const apiData = await axios.get<any[]>(api + '/data/class_popularity_data');
        return apiData.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error.message);
            return error.message;
        } 
        else {
            console.log("Unexpected Error");
        }
    }
}

export const getClassBusyTimeData = async () => {
    try {
        const apiData = await axios.get<any[]>(api + '/data/class_busy_time_data');
        return apiData.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error.message);
            return error.message;
        } 
        else {
            console.log("Unexpected Error");
        }
    }
}

export const getGymOccupancyData = async () => {
    try {
        const apiData = await axios.get<any[]>(api + '/data/gym_occupancy_data');
        return apiData.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error.message);
            return error.message;
        } 
        else {
            console.log("Unexpected Error");
        }
    }
}

export const getDailyVisitsData = async () => {
    try {
        const apiData = await axios.get<any[]>(api + '/data/daily_visits_data');

        // Convert Python strings to Date objects
        var convertedData = apiData.data.map(item => [new Date(item[0]), item[1]])

        // Increment date by 1 because Typescript dates are 0-indexed
        convertedData = [['Day', 'Number of Gym Visits'], ...convertedData.map(item => [new Date(item[0].setDate(item[0].getDate() + 1)), item[1]])]
        console.log(convertedData);
        return convertedData;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error.message);
            return error.message;
        } 
        else {
            console.log("Unexpected Error");
        }
    }
}

export const getDaysHoursData = async () => {
    try {
        const apiData = await axios.get<any[]>(api + '/data/hourly_usage_data');
        console.log(apiData.data);
        return apiData.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error.message);
            return error.message;
        } 
        else {
            console.log("Unexpected Error");
        }
    }
}