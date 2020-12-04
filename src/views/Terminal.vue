<template>
  <div class="terminal-container">
    <div class="qr-scanning-container" v-if="terminalStatus == `PENDING` && !error">
      <h1 class="qr-scanning-instruction">
        Scan this code and follow the instructions in the app!
      </h1>
      <vue-qrcode
        class="qr-scanning-code"
        :value="qrValue"
      />
    </div>

    <div
      class="status-container"
      v-if="terminalStatus == `GRANTED`"
      style="background-color: #118c19;"
      @click="handleGrantedClick()"
    >
      <div class="status-display-text-big">{{ nrTickets }}</div>
    </div>

    <div
      class="status-container"
      v-if="terminalStatus == `DENIED`"
      style="background-color: #bd0808;"
      @click="handleDeniedClick()"
    >
      <div class="status-display-text-message">{{ deniedMessage }}</div>
    </div>

    <div v-if="error">
      <h1 class="qr-scanning-instruction">
        {{ errorMessage}}
      </h1>
    </div>

    <div class="change-connection">
      <md-button class="md-primary" @click="toConnectionView"
        >Connection</md-button
      >
    </div>
  </div>
</template>

<script>
import VueQrcode from "vue-qrcode";
import {
  NEW_CODE_MAPPING,
  STATUS_MAPPING,
  STATUS_REQUEST_INTERVAL,
  QUERY_TERMINAL_ID,
  NR_TICKETS_MAPPING,
  DENIED_MESSAGE_MAPPING
} from "../util/constants";
import axios from "axios";
import sleep from "await-sleep";

export default {
  name: "Terminal",
  components: {
    VueQrcode
  },
  data: () => ({
    terminalStatus: "PENDING",
    status: "",
    nrTickets: 0,
    code: "",
    deniedMessage: "",
    alreadyHandlingGranted: false,
    alreadyHandlingDenied: false,

    error: false,
    errorMessage: "",
  }),
  computed: {
    terminalId() {
      return this.$store.state.terminalId;
    },
    qrValue() {
      return JSON.stringify({
        url: this.$store.state.baseURL,
        randId: this.code
      });
    },
    getStatusRequestURL() {
      return (
        this.$store.state.baseURL +
        STATUS_MAPPING +
        "?" +
        QUERY_TERMINAL_ID +
        this.terminalId
      );
    },
    getNewCodeRequestURL() {
      return (
        this.$store.state.baseURL +
        NEW_CODE_MAPPING +
        "?" +
        QUERY_TERMINAL_ID +
        this.terminalId
      );
    },
    getTicketAmountRequestURL() {
      return (
        this.$store.state.baseURL +
        NR_TICKETS_MAPPING +
        "?" +
        QUERY_TERMINAL_ID +
        this.terminalId
      )
    },
    getDeniedMessageRequestURL() {
      return (
        this.$store.state.baseURL +
        DENIED_MESSAGE_MAPPING +
        "?" +
        QUERY_TERMINAL_ID +
        this.terminalId
      )
    }
  },
  methods: {
    startPingInterval() {
      let pingInterval = setInterval(this.handleStatus, STATUS_REQUEST_INTERVAL);
      console.log("startet pingInterval", pingInterval);
    },
    showDenied() {
      this.terminalStatus = "DENIED";
    },
    showGranted(amount) {
      this.terminalStatus = "GRANTED";
      this.nrTickets = amount;
    },
    showQR() {
      this.terminalStatus = "PENDING";
    },
    async showError() {
      this.error = true;
      this.errorMessage = "Something went wrong. Please check your connection!";
      await sleep(3000);
      this.error = false;
    },
    toConnectionView() {
      this.$router.push({
        name: `Connection`
      });
    },
    async newCodeRequest() {
      this.alreadyHandlingDenied = false;
      this.alreadyHandlingGranted = false;
      try {
        const response = await axios.post(this.getNewCodeRequestURL);
        this.code = response.data;
      } catch(e) {
        this.showError();
      }
    },
    async handleStatus() {
      let status = await this.fetchStatus();
      console.log("fetching status", status);
      if (status == "PENDING") {
        this.showQR();
      } else if (status == "GRANTED" && !this.alreadyHandlingGranted) {
        this.handleGrantedStatus();
      } else if (status == "DENIED" && !this.alreadyHandlingDenied) {
        this.handleDeniedStatus();
      }
    },
    async handleGrantedStatus() {
      if (!this.alreadyHandlingGranted) {
        this.alreadyHandlingGranted = true;
        try {
          let ticketAmount =  await this.fetchTicketAmount();
          this.showGranted(ticketAmount);
        } catch(e) {
          this.showError();
        }
      }
    },
    async handleDeniedStatus() {
      if (!this.alreadyHandlingDenied) {
        this.alreadyHandlingDenied = true;
        try {
          this.deniedMessage = await this.fetchDeniedMessage();
          await sleep(2000);
          this.showDenied();
        } catch (e) {
          this.showError();
        }
      }
    },

    async fetchStatus() {
      try {
        let response = await axios.get(this.getStatusRequestURL);
        return response.data;
      } catch(e) {
        this.showError();
      }
    },
    async fetchTicketAmount() {
      let response = await axios.get(this.getTicketAmountRequestURL);
      return response.data;
    },
    async fetchDeniedMessage() {
      let response = await axios.get(this.getDeniedMessageRequestURL);
      return response.data;
    },
    async handleDeniedClick() {
      await this.newCodeRequest();
      this.alreadyHandlingDenied = false;
    },
    async handleGrantedClick() {
      let remaining = this.nrTickets - 1;
      if (remaining === 0) {
        await this.newCodeRequest();
        this.showQR();
        this.alreadyHandlingGranted = false;
      } else {
        this.nrTickets = remaining;
      }
    },
  },
  async created() {
    await this.newCodeRequest();
    this.status = await this.fetchStatus();
    this.startPingInterval();
  }
};
</script>

<style>
.qr-scanning-instruction {
  line-height: 1em;
  max-height: 5em;
  position: fixed;
  text-align: center;
  left: 10%;
  top: 5%;
  width: 80%;
}
.qr-scanning-code {
  position: fixed;
  top: 50%;
  left: 50%;
  margin: -25% 0 0 -25%;
  width: 50%;
  height: 50%;
}
.reconnect {
  position: fixed;
  bottom: 0;
  right: 0;
}
.change-connection {
  position: fixed;
  bottom: 0;
  left: 0;
}
.status-container {
  margin: auto;
  width: 70%;
  left: 50%;
  margin-left: -35%;
  height: 600px;
  /* Center vertically */
  position: absolute;
  top: 50%;
  margin-top: -300px; /* half this element's height */
}
.status-display-text-big {
  text-align: center;
  height: 600px;
  margin-top: 300px;
  font-size: 300px;
}
.status-display-text-message {
  text-align: center;
  height: 600px;
  line-height: 3rem;
  margin-top: 300px;
  font-size: 50px;
}
</style>
