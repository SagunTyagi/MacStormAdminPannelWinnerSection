import axios from 'axios'

const axiosInstance = axios.create({
    // baseURL: 'https://macstormbattle-backend.onrender.com/api',
    baseURL:'https://macstormbattle-backend.onrender.com/api',
    withCredentials: true,
    // headers: {
    //     Authorization: 'Bearer API_KEY',
    // },
});
export default axiosInstance;        