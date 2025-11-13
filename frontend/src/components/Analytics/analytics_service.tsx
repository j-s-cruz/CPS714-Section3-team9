import axios from "axios";
import { MembershipChartData } from "./analytics_models";

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