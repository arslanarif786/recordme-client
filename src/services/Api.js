import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";

// import { config } from "@/config/development";
import router from "../router/index";
// const baseURL = `${config.baseURL}`;

// axios.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   function (error) {
//     if (error.response.status === 401) {
//       localStorage.removeItem("token");
//       if (router.currentRoute.meta.auth) router.push("/");
//     }
//     throw error;
//   }
// );
axios.defaults.withCredentials = true;

const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    axios.defaults.baseURL = process.env.VUE_APP_BACK_END_URL; //current
    axios.defaults.headers.common["Content-Type"] = "application/json";
  },
  PostRequest(url, data) {
    return axios({
      method: "POST",
      url: url,
      data: data,
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    }).then((response) => response);
  },
  GetRequest(url, data) {
    return axios({
      method: "GET",
      url: url,
      params: data,
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    }).then((response) => response);
  },
  DeleteRequest(url) {
    return axios({
      method: "DELETE",
      url: url,
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    }).then((response) => response);
  },
  PutRequest(url, data) {
    return axios({
      method: "PUT",
      url: url,
      data : data,
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    }).then((response) => response);
  },
};

export default ApiService;
