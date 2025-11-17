import axios from "axios";

const api = 'http://localhost:8000'

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

export const getDaysHoursData = async () => {
    try {
        const apiData = await axios.get<any[]>(api + '/data/hourly_usage_data');
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

export const getNumberActiveMembers = async () => {
    try {
        const apiData = await axios.get<any[]>(api + '/data/number_active_members');
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

export const getMemberTypesData = async () => {
    try {
        const apiData = await axios.get<any[]>(api + '/data/member_types_data');
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