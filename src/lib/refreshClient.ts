import axios from "axios";

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 너는 http://localhost:8000
  withCredentials: true, // refresh_token 쿠키 전송 필수
});

export default refreshClient;
