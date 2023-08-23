import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueAxios from "vue-axios";
import vuetify from "./plugins/vuetify";
import css from "@/styles/style.css";
import { showNotificationBar } from "./services/SnackBar";
import VueRecord from "@codekraft-studio/vue-record";
import AudioVisual from "vue-audio-visual";
import HighchartsVue from "highcharts-vue";
import Highcharts from "highcharts";
import "./js/filters";
import "./registerServiceWorker";
import AudioRecorder from "vue-audio-recorder";
import ApiService from "./services/Api";
import VueTour from "vue-tour";

require("vue-tour/dist/vue-tour.css");

// Vue.use(Highcharts);
Vue.prototype.$showNotificationBar = showNotificationBar;
Vue.use(HighchartsVue);
Vue.use(AudioVisual);
Vue.use(VueRecord);
Vue.use(AudioRecorder);
Vue.use(VueAxios, axios);
Vue.use(VueTour);
Vue.config.productionTip = false;

Vue.filter("minimizeFileName", function (value) {

  if (!value) return
  const file = value.split(".");
  const ext = file[file.length - 1];
  let name = value
  if (value.length >= 13) {
    name = `${name.substring(0, 10)}... .${ext}`
  }
  return name
});

if (process.env.VUE_APP_ENVIRONMENT == "Production") {
  console.log = function () { };
}

let refreshTokenPromise; // this holds any in-progress token refresh requests

/**
 * call the refresh token API
 */
const refreshTokenSet = () =>
  axios
    .get("/client/refresh-token")
    .then((response) => {
      console.log("data========>", response.data.token);
      localStorage.setItem("token", response.data.token);
      store.commit("auth/addAuthToken", `Bearer ${response.data.token}`);
      return response.data.token;
    })
    .catch((err) => {
      console.log("refreshTokenSet =====>", err);
    });

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    console.log("in the interceptor ==>", error?.response?.data);

    if (
      error?.response?.status === 401 &&
      error?.response?.data?.name !== "xero"
    ) {
      console.log(
        "SHOULD ASK FOR NEW ACCESS AND REFRESH TOKEN",
        error.response
      );

      if (!refreshTokenPromise) {
        console.log("********* YOU CAN MAKE THE REFRESH TOKEN API CALL");
        // check for an existing in-progress request
        // if nothing is in-progress, start a new refresh token request

        refreshTokenPromise = refreshTokenSet().then((token) => {
          refreshTokenPromise = null; // clear state
          console.log("***************************TOKEN =====>", token);
          return token;
        });

        console.log(
          "WHAAAT ====> refreshTokenPromise OUTSIDE THEN BLOCK ===> ",
          refreshTokenPromise
        );
      }

      console.log("/////////refreshTokenPromise\\\\\\\\\\\\\\ ===>");
      return refreshTokenPromise.then(async (token) => {
        console.log(
          "refreshTokenPromise ORIGINAL REQUEST THAT FAILED =====>",
          error.config
        );

        error.config.headers = {
          ...error.config.headers,
          Authorization: "Bearer " + token,
        };

        console.log("UPDATED CONFIGURATIONS ==<>", error.config);
        console.log("*******MAKING RETRY API CALL ===>, ", error.config);
        return axios(error.config)
          .then((response) => {
            console.log("RETRY API RESPONSE =====>", response.data);
            return response;
          })
          .catch((err) => {
            console.log("RETRY API ERRR =====>", err);
            return err;
          });
      });
    } else if (
      error.response.status === 403 &&
      error?.response?.data?.name !== "xero"
    ) {
      localStorage.clear();
      window.location.href = "/";
      setTimeout(() => {
        store.dispatch("resetStoreState");
      }, 1000);

      // localStorage.removeItem("token");
      // console.log(error, "err");
      // await router.push("/login");
      // setTimeout(() => {
      //   router.push("/login");
      // }, 2000);
    }
    return Promise.reject(error);
  }
);

axios.defaults.baseURL = process.env.VUE_APP_BACK_END_URL;

new Vue({
  router,
  store,
  css,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
