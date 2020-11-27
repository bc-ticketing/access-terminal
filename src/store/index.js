import Vue from "vue";
import Vuex from "vuex";
import state from "./state";
import { EVENT_MINTABLE_AFTERMARKET_PRESALE_ABI } from "../util/EventMintableAftermarketPresale";

Vue.use(Vuex);
var Web3 = require("web3");

// var Contract = require("web3-eth-contract");

export default new Vuex.Store({
  state,
  mutations: {
    REGISTER_WEB3(state, payload) {
      console.log("REGISTER_WEB3", payload);
      state.web3 = payload;
    },
    // SET_EVENT_FACTORY(state, payload) {
    //   console.log("SET_EVENT_FACTORY", payload);
    //   state.eventFactory = payload;
    // },
    SET_EVENT_CONTRACT(state, payload) {
      console.log("SET_EVENT_CONTRACT", payload);
      state.eventContract = payload;
    },
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
      console.log("SET_AREA_To", payload);
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
    // Registers this terminal on the host-backend.
    registerWeb3({ commit }) {
      console.log("registerWeb3 action executed");
      const networkAddress =
        "https://kovan.infura.io/v3/" + process.env.VUE_APP_INFURA_ID;
      const provider = new Web3.providers.HttpProvider(networkAddress);
      const web3 = new Web3(provider);
      commit("REGISTER_WEB3", web3);
    },
    // setEventFactory({ commit }) {
    //   let eventFactory = new state.web3.eth.Contract(
    //     EVENT_FACTORY_ABI,
    //     EVENT_FACTORY_ADDRESS
    //   );
    //   commit("SET_EVENT_FACTORY", eventFactory);
    // },
    // Creates the Event contract instance.
    async setEventContract({ commit }, address) {
      console.log(state.web3);
      let eventContract = new state.web3.eth.Contract(
        EVENT_MINTABLE_AFTERMARKET_PRESALE_ABI,
        address
      );
      commit("SET_EVENT_CONTRACT", eventContract);
    },
  },
});
