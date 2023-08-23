import Vue from "vue";
import Vuex from "vuex";
import * as modules from "./modules";
import createPersistedState from "vuex-persistedstate";
import ApiService from "../services/Api"

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  modules,
  actions: {
    resetStoreState: ({ commit }) => {
      commit("user/resetAuth");
      commit("auth/resetAuth");
      commit("ticket/resetAuth");
    },
    logout({ dispatch }) {
      ApiService.GetRequest('user/log-out').then((res) => {
        console.log(res.data, "SUCCESS");
      }).catch((err) => {
        console.log(err.response, "ERR")
      })
      // dispatch('resetStoreState')
      localStorage.removeItem("token");
    }
  },
});
