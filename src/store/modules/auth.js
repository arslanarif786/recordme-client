// import apiService from "@/services/Api";
import axios from "axios";
import router from "../../router";
import UrlServices from "@/services/Url";
import apiService from "@/services/Api";
import Vue from "vue";

const initialState = () => {
  return {
    authToken: "",
    user: {},
    workspaces: [],
    users: [],
    tickets: {},
    currentWorkspace: {},
    userWorkspaces: [],
    activeWorkspace: "",
  };
};
const state = initialState();
const getters = {
  getAuthToken(state) {
    return state.authToken;
  },
  getUser(state) {
    return state.user;
  },
  getTickets(state) {
    return state.tickets;
  },
  getUserRole(state) {
    return state.user.role;
  },
  getUsers(state) {
    return state.users;
  },
  getAccountantUsers(state) {
    return state.users.filter((item) => item.role === "accountant");
  },
  getClientUsers(state) {
    return state.users.filter((item) => item.role === "client");
  },
  getWorkspaces(state) {
    return state.workspaces;
  },
  getCurrentWorkspace(state) {
    return state.currentWorkspace;
  },
  getUserWorkSpaces(state) {
    return state.userWorkspaces;
  },
  getActiveWorkspace(state) {
    return state.activeWorkspace;
  },
};
const mutations = {
  addAuthToken(state, payload) {
    state.authToken = payload;
  },
  addWorkspaces(state, workspaces) {
    state.workspaces = [...workspaces];
  },
  addTickets(state, payload) {
    state.tickets = payload;
  },
  addCurrentWorkspace(state, payload) {
    state.currentWorkspace = payload;
  },
  addUser(state, user) {
    state.user = user;
  },
  updateWorkspace(state, payload) {
    state.currentWorkspace = payload;
    state.userWorkspaces.filter((workspace) => {
      workspace._id == payload._id &&
        (workspace.workspaceName = payload.workspaceName);
    });
  },
  addUsers(state, users) {
    state.users = users;
  },
  userWorkspaces(state, workspaces) {
    state.userWorkspaces = workspaces;
  },
  setWorkspace(state, name) {
    state.activeWorkspace = name;
  },
  updateEmail(state, email) {
    state.user.email = email;
  },
  updateUserWorkspaces(state, value) {
    let foundIndex = state.userWorkspaces.findIndex((x) => x._id == value._id);
    Vue.set(state.userWorkspaces, foundIndex, value);
  },
  resetAuth(state) {
    Object.assign(state, initialState());
  },
  setUserSpecificProperty(state, { key, value }) {
    console.log(value, "val");
    state.currentWorkspace.auditTicket = value.enabled;
    state.userWorkspaces.find((workspace) => {
      workspace._id == value.id && (workspace.auditTicket = value.enabled);
    });
  },
  setWorkspaceEditInvoice(state, { key, value }) {
    state.currentWorkspace[key] = value;
  },
};

const actions = {
  // API to login user by providing valid credentials
  login({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(UrlServices.login, payload)
        .then((res) => {
          if (
            res.data.data.user.role === "client" ||
            res.data.data.user.role === "employee"
          ) {
            let allWorkSpaces = [];
            res.data.data.workspaces.forEach((workspace) => {
              allWorkSpaces.push(workspace.workspaceId);
            });
            commit("userWorkspaces", allWorkSpaces);
            if (allWorkSpaces.length > 0) {
              commit("addCurrentWorkspace", allWorkSpaces[0]);
            }
            // commit("workspaceID", workspace.workspaceId.workspaceId)

            commit("addAuthToken", `Bearer ${res.data.token.toString()}`);
            localStorage.setItem("token", res.data.token);
            commit("addUser", res.data.data.user);
            resolve(true);
          } else {
            reject("Incorrect email or password");
          }
        })
        .catch((e) => {
          reject(e.response.data);
        });
    });
  },

  // Method to set workspace name in header
  setWorkspace({ commit }, name) {
    commit("setWorkspace", name);
  },

  // Method to verify OTP code
  verifyOTP({ commit }, payload) {
    return new Promise((resolve, reject) => {
      apiService
        .PostRequest("/user/client/verify-otp", payload)
        .then((res) => {
          console.log(res.data, "res");
          commit("updateEmail", payload.newEmail);
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  async resendEmail(store, payload) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${UrlServices.resendEmail}${payload}`)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  signUp({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(UrlServices.signUp, payload)
        .then((res) => {
          console.log(res.data);
          resolve(res.data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  async updateUser({ state, commit }, payload) {
    payload.id = state.user._id;
    if (payload.country) delete payload.country;
    return new Promise((resolve, reject) => {
      apiService
        .PostRequest(UrlServices.updateUser, payload)
        .then((res) => {
          commit("addUser", res.data.user);
          resolve(res.data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  async updateWorkspace({ state, commit }, payload) {
    payload.id = state.user._id;
    return new Promise((resolve, reject) => {
      apiService
        .PostRequest(
          UrlServices.updateWorkspace + "/" + state.currentWorkspace._id,
          payload
        )
        .then((res) => {
          commit("updateWorkspace", res.data.workspace);
          resolve(res.data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  async selectWorkspace({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${UrlServices.selectWorkspace}${payload._id}`, {
          headers: { authorization: state.authToken },
        })
        .then((res) => {
          commit("addCurrentWorkspace", res.data.workspace);
          resolve(true);
        })
        .catch((e) => {
          console.log(e.message);
          reject(e);
        });
    });
  },
  async getUsers({ commit }, payload) {
    axios
      .get(UrlServices.getUsers)
      .then((res) => {
        commit("addUsers", res.data.users);
      })
      .catch((e) => {
        console.log(e.message);
      });
  },
  async getWorkspaces({ commit, state }, payload) {
    axios
      .get(UrlServices.getWorkspaces, {
        headers: { authorization: state.authToken },
      })
      .then((res) => {
        commit("addWorkspaces", res.data.workspaces);
      })
      .catch((e) => {
        console.log(e.message);
      });
  },
  async getTickets({ commit, state }, payload) {
    axios
      .get(`${UrlServices.getTickets}?page=${payload}`, {
        headers: { authorization: state.authToken },
      })
      .then((res) => {
        commit("addTickets", res.data);
      })
      .catch((e) => {
        console.log(e.message);
      });
  },
  async getWorkspacesForSpecificUser(localStore, payload) {
    const { commit, state } = localStore;
    axios
      .get(
        `${UrlServices.getWorkspacesForSpecificUser}?userId=${state.user._id}`,
        { headers: { authorization: state.authToken } }
      )
      .then((res) => {
        if (res.data.workspaces.length !== 0) {
          let newArray = res.data.workspaces.map((item) => {
            return item.workspaceId;
          });
          newArray = newArray.filter((n) => n);
          commit("addWorkspaces", newArray);
          if (payload?.ascSort == true)
            commit("addCurrentWorkspace", newArray[0]);
          else if (payload?.ascSort === false)
            commit("addCurrentWorkspace", newArray[newArray.length - 1]);
        }
        // router.push({ path: "/dashboard" })
      })
      .catch((e) => {
        console.log(e.message);
      });
  },
  async forgotPassword({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(UrlServices.forgotPassword, payload)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  async setPassword({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(UrlServices.resetPassword, payload)
        .then((res) => {
          resolve(res);
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
