import axios from 'axios'

const axiosInstance = axios.create({
    // baseURL: 'https://api-v1.macstrombattle.com/api',
    baseURL:'https://api-v1.macstrombattle.com/api',
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
});
export default axiosInstance;        