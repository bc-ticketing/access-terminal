<template>
  <div class="terminal-container">
    <div class="qr-scanning-container" v-if="terminalStatus == `PENDING`">
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
      <div class="status-display-text-message">The signature was invalid!</div>
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
  NR_TICKETS_MAPPING
} from "../util/constants";
import axios from "axios";

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
  },
  methods: {
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
    toConnectionView() {
      this.$router.push({
        name: `Connection`
      });
    },
    async newCodeRequest() {
      const codeResponse = await this.getNewCodeRequest();
      this.code = codeResponse.data;
      console.log("fetched following code", this.code);
    },
    async getNewCodeRequest() {
      return await axios.post(this.getNewCodeRequestURL);
    },
    async executeStatusRequest() {
      return await axios.get(this.getStatusRequestURL);
    },
    async executeTicketAmountRequest() {
      return await axios.get(this.getTicketAmountRequestURL);
    },
    async processStatus() {
      console.log("processing status");
      if (this.status === "DENIED") {
        this.showDenied();
      } else if (this.status === "GRANTED") {
        let amount = await this.fetchTicketAmount();
        this.showGranted(amount);
      }
    },
    /**
     * Runs pings in an interval and stops as soon as the status has changed.
     */
    async startPinningStatusAndProcessWhenChanged() {
      this.$on("statuschanged", () => {
        clearInterval(pingInterval);
        this.processStatus();
      })
      let pingInterval = setInterval(this.pingForStatus, STATUS_REQUEST_INTERVAL);
    },
    /**
     * Fetches the status from the host-backend once
     */
    async pingForStatus() {
      let status = await this.fetchStatus();
      console.log("pingForStatus", status);
      if (this.status != status) {
        this.$emit("statuschanged");
        console.log("statuschanged emitted");
      }
    },
    async fetchStatus() {
      let response = await this.executeStatusRequest();
      return response.data;
    },
    async fetchTicketAmount() {
      let response = await this.executeTicketAmountRequest();
      return response.data;
    },

    // Handling Denied and Granted States

    async handleDeniedClick() {
      await this.newCodeRequest();
      this.status = await this.fetchStatus();
      console.log("should be PENDING", this.status);
      this.startPinningStatusAndProcessWhenChanged();
    },
    async handleGrantedClick() {
      console.log("handleGrantedClick executing");
      // one person may enter per click
      let remaining = this.nrTickets - 1;
      if (remaining === 0) {
        await this.newCodeRequest();
        this.status = await this.fetchStatus();
        console.log("should be PENDING", this.status);
        this.startPinningStatusAndProcessWhenChanged();
      } else {
        this.nrTickets = remaining;
      }
    },
  },
  async created() {
    await this.newCodeRequest();
    this.status = await this.fetchStatus();
    console.log("status after first fetchStatus - should be PENDING", this.status);

    // executing interval pinging the backend for a status change
    this.startPinningStatusAndProcessWhenChanged();
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
  margin-top: 300px;
  font-size: 50px;
}
</style>
