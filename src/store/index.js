import Vue from "vue";
import Vuex from "vuex";
import state from "./state";
// import getWeb3 from "../util/getWeb3";
// import getIpfs from "../util/getIpfs";
// import { Event } from "../util/event";
// import { FungibleTicketType, NonFungibleTicketType, NonFungibleTicket } from "../util/tickets";

// import { argsToCid } from "idetix-utils";
// import { EVENT_FACTORY_ABI, EVENT_FACTORY_ADDRESS } from "../util/constants/EventFactory";
// import { IDENTITY_ABI, IDENTITY_ADDRESS } from "../util/constants/Identity";
// import { EVENT_MINTABLE_AFTERMARKET_PRESALE_ABI } from "../util/constants/EventMintableAftermarketPresale";

Vue.use(Vuex);

export default new Vuex.Store({
  state,
  mutations: {
    updateSocket(state, payload) {
      console.log("updateSocket mutation executed", payload);
      state.socket = payload;
    },
  },
});
