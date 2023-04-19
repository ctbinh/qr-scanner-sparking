import Axios from 'axios';
import axiosRetry from 'axios-retry';
import { BACKEND_URL } from '@env';

interface BodyData {
    method: string;
    params?: object;
}

export interface IResponse {
    returnCode: number;
    returnMessage: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: null | any[];
}

const axios = Axios.create({
    baseURL: BACKEND_URL,
    headers: {
        Accept: 'application/json,application/x-www-form-urlencoded,text/plain,*/*',
        'Content-Type': 'application/json',
        'X-mock-match-request-body': true,
    },
});

axiosRetry(axios, { retries: 3 });

axios.interceptors.request.use(
    function (config) {
        if (config.headers) {
            config.headers.authorization = `Bearer accessToken`;
            return config;
        }
        return config;
    },
    function (error) {
        // Làm gì đó với lỗi request
        return Promise.reject(error);
    },
);

export const postData = async (endpoint: string, data: BodyData): Promise<IResponse> => {
    try {
        const response = await axios.post(`/${endpoint}`, data, {
            headers: {
                Authorization: `Bearer accessToken`,
            },
        });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getData = async (endpoint: string) => {
    try {
        const response = await axios.get(`/${endpoint}`);
        return response;
    } catch (error) {
        console.error('lỗi', error);
        throw error;
    }
};
