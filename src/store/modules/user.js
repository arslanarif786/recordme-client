import EventBus from "@/js/EventBus";
import axios from "axios";
import UrlServices from "@/services/Url";
import apiService from "@/services/Api.js";

const initialState = () => {
  return {
    userWorkspaces: [],
    workspaces: [],
    workspaceswithFilter: [],
    employees: [],
  };
};
const state = initialState();
const getters = {
  getUserWorkspaces(state) {
    return state.userWorkspaces;
  },
  getWorkspaces(state) {
    return state.workspaces;
  },
  getworkspacesWithFilter(state) {
    return state.workspaceswithFilter;
  },
  getEmployees(state) {
    return state.employees;
  },
};
const mutations = {
  addUserWorkspaces(state, payload) {
    state.userWorkspaces = payload;
  },
  addWorkspaces(state, payload) {
    state.workspaces = payload;
  },
  addWorkspaceswithFilter(state, payload) {
    state.workspaceswithFilter = payload;
  },
  fetchEmployees(state, employees) {
    state.employees = employees;
  },
  newEmployee(state, employee) {
    state.employees.unshift(employee);
  },
  updateEmployee(state, employee) {
    state.employees.find((item) => {
      item._id == employee._id && (item.status = employee.status);
    });
  },
  resetAuth(state) {
    Object.assign(state, initialState());
  },
};

const actions = {
  // Method to fetch all employees of client
  fetchEmployees({ commit, rootState },pgNo) {
    return new Promise((resolve, reject) => {
      apiService
        .GetRequest(
          `${UrlServices.employee}`,
         {
            page : pgNo,
            size : rootState.ticket.pageItems
         },
         {
          headers: {
            Authorization: state.authToken,
          },
        }
        )
        .then((res) => {
          commit("fetchEmployees", res.data.users);
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },
  // Method to create new employee
  createEmployee({ commit }, payload) {
    return new Promise((resolve, reject) => {
      apiService
        .PostRequest(UrlServices.employee, payload)
        .then((res) => {
          // commit("newEmployee", res.data.user);
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },

  // Method to block/unblock status of employee
  changeStatus({ commit }, status) {
    return new Promise((resolve, reject) => {
      apiService
        .PostRequest(UrlServices.updateEmployee, status)
        .then((res) => {
          commit("updateEmployee", res.data.user);
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },
  async addUserWorkspaces({ commit }, { token, workspace, sentId, user }) {
    try {
      if (!user) return;
      return new Promise((resolve, reject) => {
        const data = {
          workspaceId: workspace?._id,
          userRole: sentId,
          userId: user,
        };
        axios
          .post(UrlServices.addUserWorkspaces, data, {
            headers: {
              Authorization: token,
            },
          })
          .then(function(response) {
            resolve(response);
          })
          .catch(function(error) {
            reject(error.message);
          });
      });
    } catch (error) {
      return error.message;
    }
  },
  async addWorkspaces({ commit }, payload) {
    commit("addUserWorkspaces", payload);
  },
  async getworkspacesWithFilter(store, payload) {
    axios
      .get(UrlServices.getworkspacesWithFilter + payload, {
        headers: { authorization: store.rootState.auth.authToken },
      })
      .then((res) => {
        
        store.commit("addWorkspaceswithFilter", res.data.workspaces);
      })
      .catch((error) => {
        console.log("error: getWorkspace: ", error.message);
      });
  },
  async getWorkspaces({ commit }, payload) {
    axios
      .get(UrlServices.getWorkspaces + payload)
      .then((res) => {
        commit("addWorkspace", res.data.workspaces);
      })
      .catch((error) => {
        console.log("error: getWorspace: ", error.message);
      });
  },
  async create(store, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(UrlServices.createUser, payload, {
          headers: { authorization: store.rootState.auth.authToken },
        })
        .then((response) => {
          if (response.data.user) {
            resolve(true);
          } else {
            console.log(e);
            reject(JSON.parse(e.request.response).message);
          }
        })
        .catch((e) => {
          reject(JSON.parse(e.request.response).message);
        });
    });
  },
  async deleteUser(store, payload) {
    return new Promise((resolve, reject) => {
      axios
        .delete(UrlServices.deleteUser, {
          headers: { authorization: store.rootState.auth.authToken },
          data: payload,
        })
        .then((response) => {
          this.$showNotificationBar(
            "success",
            "Successfully Deleted"
          ) 
          resolve(true);
        })
        .catch((e) => {
          this.$showNotificationBar(
            "error",
            "Something bad happened"
          ) 
          reject(e);
        });
    });
  },
  async unAssignWorkspace(store, payload) {
    return new Promise((resolve, reject) => {
      axios
        .delete(UrlServices.unAssignWorkspace, {
          headers: { authorization: store.rootState.auth.authToken },
          data: payload,
        })
        .then((response) => {
          resolve(response);
        })
        .catch((e) => {
          reject(e);
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
