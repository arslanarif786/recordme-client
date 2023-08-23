import axios from "axios";
import router from "../../router";
import UrlServices from "@/services/Url";
import apiService from "@/services/Api.js";

const initialState = () => {
  return {
    date: "",
  };
};

const state = initialState();

const getters = {
  getFilterDate(state) {
    return state.date;
  },
};
const mutations = {
  setFilterDate(state, payload) {
    state.date = payload;
  },
};

const actions = {
  ticketStats({ commit }, workspace) {
    return new Promise((resolve, reject) => {
      const url =
        workspace.from && workspace.to
          ? `from=${workspace.from}&to=${workspace.to}`
          : "";
      apiService
        .GetRequest(`${UrlServices.ticketStats}/${workspace.id}?${url}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  reconciledTransections({ commit }, workspace) {
     return new Promise((resolve, reject) => {
      const url =
        workspace.from && workspace.to
          ? `from=${workspace.from}&to=${workspace.to}`
          : "";
      apiService
        .GetRequest(`${UrlServices.ticketStats}/${workspace.id}?${url}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  ticketGraph({ commit }, workspace) {
    return new Promise((resolve, reject) => {
      apiService
        .GetRequest(
          `${UrlServices.ticketGraph}/${workspace.id}?date=${workspace.date}`
        )
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  employeeStats({ commit }, workspace) {
    return new Promise((resolve, reject) => {
      console.log(workspace);
      apiService
        .GetRequest(`${UrlServices.employeeStats}/${workspace.workspaceId}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
