import axios from "axios";
import Vue from "vue";
import UrlServices from "@/services/Url";
import ApiService from "../../services/Api";

const initialState = () => {
  return {
    tickets: [],
    faq: [],
    ticket: {},
    search: "",
    status: "All",
    page: "",
    messages: [],
    pageItems: 10,
    paginate: {
      itemsPerPage: 10,
      page: 1,
      lastPage: 10,
      total: 100,
    },
    advancedSearch: {
      dateRange: "",
      messageFilter: "",
      searchStatus: [],
      requestType: [],
    },
  };
};
const state = initialState();
const getters = {
  getPaginate(state) {
    return state.paginate;
  },
  getPageItems(state) {
    return state.pageItems;
  },
  getMessages(state) {
    return state.messages;
  },
  getTickets(state) {
    return state.tickets;
  },
  getFaq(state) {
    return state.faq;
  },
  getTicket(state) {
    return state.ticket;
  },

  getSearch(state) {
    return state.search;
  },
  getStatus(state) {
    return state.status;
  },
  getPage(state) {
    return state.page;
  },
  getAdvancedSearch(state) {
    return state.advancedSearch;
  },
};
const mutations = {
  setPageItems(state, payload) {
    state.pageItems = payload;
  },
  setPaginate(state, payload) {
    state.paginate = payload;
  },
  addNewTicketinTickets(state, payload) {
    state.tickets.unshift(payload);
  },
  addTickets(state, payload) {
    state.tickets = payload;
  },
  updateFaq(state, value) {
    let foundIndex = state.faq.findIndex((x) => x._id == value._id);
    Vue.set(state.faq, foundIndex, value);
  },
  setFaq(state, value) {
    state.faq = value;
  },
  resetAuth(state) {
    Object.assign(state, initialState());
  },
  setTicketAsReadable(state, payload) {
    Vue.set(
      state.faq,
      state.tickets.findIndex((x) => x.ticket_no == payload.ticket_no),
      payload
    );
  },

  setStatus(state, payload) {
    state.status = payload;
  },
  setPage(state, payload) {
    state.page = payload;
  },
  setSearch(state, payload) {
    state.search = payload;
  },
  setTicket(state, payload) {
    state.ticket = payload;
  },
  setMessages(state, payload) {
    state.messages = payload;
  },
  setAdvancedSearch(state, payload) {
    state.advancedSearch.dateRange = payload.dateRange;
    state.advancedSearch.messageFilter = payload.messageFilter;
    state.advancedSearch.searchStatus = payload.searchStatus;
    state.advancedSearch.requestType = payload.requestType;
  },
  updateSpecificTicket(state, payload) {
    let index = state.tickets.findIndex((item) => item._id === payload._id);
    if (index !== -1) {
      Vue.set(state.tickets, index, payload);
    }
  },
};

const actions = {
  getAllMessagesByTicketId({ commit, rootState }, payload) {
    const { authToken } = rootState.auth;
    return new Promise((resolve, reject) => {
      axios
        .get(`${UrlServices.getAllMessagesByTicketId}?ticketId=${payload.id}`, {
          headers: {
            Authorization: authToken,
          },
        })
        .then((res) => {
          // commit("setMessages", res.data.messages);
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  updateFaq({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      const body = {
        type: payload.type,
        questions: payload.questions,
      };
      axios
        .put(`${UrlServices.updateFaq}${payload._id}`, body, {
          headers: {
            Authorization: state.authToken,
          },
        })
        .then((res) => {
          commit("updateFaq", payload);
          resolve(true);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  getFaq({ commit, state }) {
    return new Promise((resolve, reject) => {
      axios
        .get(UrlServices.getFaq, {
          headers: {
            Authorization: state.authToken,
          },
        })
        .then((res) => {
          commit("setFaq", res.data.data);
          resolve(true);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  /**
   *
   * @param {*} param0
   * @param {*} payload
   * @returns filtered tickets or all tickets against specific workspace if no filter is applied
   */
  getTasks({ commit, rootState, state }, payload) {
    const obj = {
      size: state.pageItems,
      page: payload,
      search: state.search,
      status: state.status,
      dateRange: state.advancedSearch.dateRange,
      messageFilter: state.advancedSearch.messageFilter,
      requestType: state.advancedSearch.requestType,
    };
    if (payload === undefined || payload === null) obj["page"] = 1;
    if (state.search.trim() === "") obj["search"] = null;
    if (state.status === "All" && state.advancedSearch.searchStatus.length == 0)
      obj["status"] = null;
    else if (state.advancedSearch.searchStatus.length !== 0)
      obj["status"] = state.advancedSearch.searchStatus;
    if (state.advancedSearch.dateRange.trim() === "") obj["dateRange"] = null;
    if (state.advancedSearch.messageFilter.trim() === "")
      obj["messageFilter"] = null;
    if (state.advancedSearch.requestType.length == 0) obj["requestType"] = null;
    const { currentWorkspace, authToken } = rootState.auth;
    if (!currentWorkspace || currentWorkspace == {}) return;
    let paramsObject = {
      ticketNo: obj.search == null ? "" : obj.search,
      page: obj.page == null ? "" : obj.page,
      dateRange: obj.dateRange == null ? "" : obj.dateRange,
      message: obj.messageFilter == null ? "" : obj.messageFilter,
      size: obj.size == null ? "" : obj.size,
    };
    if (!Array.isArray(obj.status))
      obj.status !== null ? (paramsObject["status"] = [obj.status]) : "";
    else obj.status.length > 0 ? (paramsObject["status"] = obj.status) : "";
    if (!Array.isArray(obj.requestType))
      obj.requestType !== null
        ? (paramsObject["requestType"] = [obj.requestType])
        : "";
    else
      obj.requestType.length > 0
        ? (paramsObject["requestType"] = obj.requestType)
        : "";

    console.log(paramsObject, "Param");
    return new Promise((resolve, reject) => {
      // ApiService.GetRequest(
      //   `${UrlServices.getTasks}${currentWorkspace["workspaceId"]}`, paramsObject
      // )
      const { authToken } = rootState.auth;
      axios
        .get(`${UrlServices.getTasks}${currentWorkspace["workspaceId"]}`, {
          params: paramsObject,
          headers: {
            Authorization: authToken,
          },
        })
        .then((res) => {
          const { tickets, count } = res.data;
          if (tickets) {
            commit("addTickets", tickets);
            commit("setPaginate", {
              itemsPerPage: state.pageItems,
              page: obj["page"],
              lastPage: count < 10 ? 1 : Math.ceil(count / 10),
              total: count,
            });
            resolve(res);
          }
          resolve(true);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  setTicketAsReadable({ commit, rootState, state }, payload1, payload2) {
    return new Promise((resolve, reject) => {
      const obj = {
        page: payload2,
        search: state.search,
        status: state.status,
      };
      if (payload2 === undefined) obj["page"] = 1;
      if (state.search.trim() === "") obj["search"] = null;
      if (state.status === "All") obj["status"] = null;
      const { currentWorkspace, authToken } = rootState.auth;
      if (!currentWorkspace || currentWorkspace == {}) return;
      axios
        .post(
          `${UrlServices.setTicketAsReadable}?workspaceId=${currentWorkspace["workspaceId"]}&status=${obj.status}&page=${obj.page}`,
          {
            ticketId: payload1._id,
          },
          {
            headers: {
              Authorization: authToken,
            },
          }
        )
        .then((res) => {
          const { tickets, count } = res.data;
          if (tickets) {
            commit("addTickets", tickets);
            resolve(res);
          }
          resolve(true);
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
