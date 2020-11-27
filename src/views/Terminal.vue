<template>
  <div class="terminal-container">
    <div class="qr-scanning-container" v-if="terminalStatus == `PENDING`">
      <h1 class="qr-scanning-instruction">
        Scan this code and follow the instructions in the app!
      </h1>
      <vue-qrcode
        class="qr-scanning-code"
        :value="qrValue"
        :quality="quality"
      />
    </div>

    <div
      class="status-container"
      v-if="terminalStatus == `GRANTED`"
      style="background-color: #118c19;"
      @click="handleEntry()"
    >
      <div class="status-display-text-big">5</div>
    </div>

    <div
      class="status-container"
      v-if="terminalStatus == `DENIED`"
      style="background-color: #bd0808;"
      @click="getNewCode()"
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
  QUERY_TERMINAL_ID
} from "../util/constants";
import axios from "axios";

export default {
  name: "Terminal",
  components: {
    VueQrcode
  },
  data: () => ({
    terminalStatus: "PENDING",
    nrTickets: 0,
    code: "",

    quality: 1
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
    getStatusRequest() {
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
    }
  },
  methods: {
    runStatusInterval() {
      if (this.timer !== null) {
        return;
      }
      this.timer = setInterval(async () => {
        console.log("fetching status");
        let status = await this.getStatus();
        console.log(status);
      }, STATUS_REQUEST_INTERVAL);
    },
    stopStatusInterval() {
      clearInterval(this.timer);
      this.timer = null;
    },
    /**
     * decrements the number of tickets allowed to enter
     */
    handleEntry() {
      if (this.nrTickets == 0) {
        this.getNewCode();
        this.status = "PENDING";
      }
    },
    toConnectionView() {
      this.$router.push({
        name: `Connection`
      });
    },
    async newCodeRequest() {
      console.log("executing newCodeRequest");
      const codeResponse = await axios.post(this.getNewCodeRequestURL);
      console.log(codeResponse);
      this.code = codeResponse.data;
      console.log(this.code);
      this.setStatus("PENDING");
      this.statusInterval();
      // call interval method fetching status here
    },
    async getNewCodeRequest() {
      return await axios.post(this.getNewCodeRequestURL);
    },
    statusInterval() {
      // todo: fetch status in interval and upon GRANTED or DENIED
      // -> stop interval and change status
      // -> if GRANTED -> request number of tickets and display
    }
  },
  async created() {
    this.newCodeRequest();
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
