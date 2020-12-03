import Vue from "vue";
import Vuex from "vuex";
import state from "./state";

Vue.use(Vuex);

export default new Vuex.Store({
  state,
  mutations: {
    SET_TERMINAL_ID(state, payload) {
      console.log("SET_TERMINAL_ID", payload);
      state.terminalId = payload;
    },
    SET_BASE_URL(state, payload) {
      console.log("SET_BASE_URL", payload);
      state.baseURL = payload;
    },
    SET_AREA_FROM(state, payload) {
      console.log("SET_AREA_FROM", payload);
      state.areaFrom = payload;
    },
    SET_AREA_TO(state, payload) {
      console.log("SET_AREA_TO", payload);
      state.areaTo = payload;
    },
    SET_CODE(state, payload) {
      console.log("SET_CODE", payload);
      state.code = payload;
    },
  },
  actions: {
    setTerminalId({ commit }, terminalId) {
      commit("SET_TERMINAL_ID", terminalId);
    },
    setBaseURL({ commit }, baseURL) {
      commit("SET_BASE_URL", baseURL);
    },
    setAreaFrom({ commit }, areaFrom) {
      commit("SET_AREA_FROM", areaFrom);
    },
    setAreaTo({ commit }, areaTo) {
      commit("SET_AREA_TO", areaTo);
    },
    setCode({ commit }, code) {
      commit("SET_CODE", code);
    },
  },
});
