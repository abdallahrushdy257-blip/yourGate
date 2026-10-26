import axios from "axios";
import { showError } from "../components/Toast";

// export const BASE_URL = "https://associations.morefortech.com/api";
// export const BASE_URL = "https://b6c4-197-36-151-217.ngrok-free.app/api";
export const BASE_URL = "http://192.168.1.6:8000/api";

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel && axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem("token");
          window.location.href = "/login";
          // showError("ليس لديك صلاحية الوصول، سيتم تحويلك لتسجيل الدخول");
          break;

        case 403:
          showError("لا تمتلك الصلاحية للوصول إلى هذه الصفحة");
          break;

        case 404:
          showError("الصفحة غير موجودة");
          break;

        case 500:
          showError("خطأ في الخادم، حاول لاحقًا");
          break;

        default:
          console.log(error.response.data?.message || "حدث خطأ غير متوقع");
      }
    } else if (error.request) {
      // showError("فقد الاتصال بالخادم");
    } else {
      showError(error.message);
    }

    return Promise.reject(error);
  },
);

export default API;
