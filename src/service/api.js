import axios from "axios";
import config from "./config";
// import router from '../router'

let token = sessionStorage.getItem("token") === "undefined"? null: sessionStorage.getItem("token")
let api = axios.create({
  baseURL: config.BASEURL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

api.interceptors.response.use(
  (response) => {
    if (response.status === 200 || response.status === 201) {
      // console.log("todo bien...");
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    if (error.response.status) {
      switch (error.response.status) {
        case 400:
          console.log(error);
          break;
        case 401:
          window.location.href = "/";
          break;

        case 403:
          console.log(error);
          break;
        case 404:
          console.log(error);
          break;
        case 500:
          console.log(error);
          break;

        case 502:
          console.log(error);
      }
      return Promise.reject(error.response);
    }
  }
);

export default api;
