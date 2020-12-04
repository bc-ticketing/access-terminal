<template>
  <div class="connection-container">
    <form>
      <md-card>
        <md-card-header>
          <div class="md-title">
            Configure the Connection to your Access-Backend
          </div>
        </md-card-header>
        <md-card-content style="padding: 20px">
          <div class="base-url-container">
            <md-field>
              <label for="base-url">Base URL</label>
              <md-input name="base-url" id="base-url" v-model="baseURL">
              </md-input>
            </md-field>
          </div>
          <div class="register-secret-container">
            <md-field>
              <label for="register-secret">Secret</label>
              <md-input
                name="register-secret"
                id="register-secret"
                v-model="registerSecret"
              >
              </md-input>
            </md-field>
          </div>
          <div class="area-from-container">
            <md-field>
              <label for="areaFrom">From</label>
              <md-select
                type="string"
                id="areaFrom"
                name="areaFrom"
                v-model="areaFrom"
              >
                <md-option v-if="areaTo !== `ENTRANCE`" value="ENTRANCE">Entrance Area</md-option>
                <md-option v-if="areaTo !== `GENERAL`" value="GENERAL">General Area</md-option>
                <md-option v-if="areaTo !== `SEATINGAREA1`" value="SEATINGAREA1">Seating Area 1</md-option>
                <md-option v-if="areaTo !== `SEATINGAREA2`" value="SEATINGAREA2">Seating Area 2</md-option>
                <md-option v-if="areaTo !== `VIPAREA`" value="VIPAREA">VIP Area</md-option>
              </md-select>
            </md-field>
          </div>
          <div class="area-to-container">
            <md-field>
              <label for="areaTo">To</label>
              <md-select
                type="string"
                id="areaTo"
                name="areaTo"
                v-model="areaTo"
              >
                <md-option v-if="areaFrom !== `ENTRANCE`" value="ENTRANCE">Entrance Area</md-option>
                <md-option v-if="areaFrom !== `GENERAL`" value="GENERAL">General Area</md-option>
                <md-option v-if="areaFrom !== `SEATINGAREA1`" value="SEATINGAREA1">Seating Area 1</md-option>
                <md-option v-if="areaFrom !== `SEATINGAREA2`" value="SEATINGAREA2">Seating Area 2</md-option>
                <md-option v-if="areaFrom !== `VIPAREA`" value="VIPAREA">VIP Area</md-option>
              </md-select>
            </md-field>
          </div>
        </md-card-content>
        <md-card-actions>
          <div class="connect-button-container">
            <md-button class="connect-button md-primary" @click="register()"
              >Register Terminal</md-button
            >
          </div>
        </md-card-actions>
      </md-card>
    </form>

    <div v-if="showStatusMessage" class="status-message">
      <md-progress-bar :md-mode="processBarMode"></md-progress-bar>
      <p class="process-message">
        {{ processMessage }}
      </p>
    </div>
    <div class="go-to-terminal">
      <md-button class="md-primary" @click="goToTerminal()">Terminal</md-button>
    </div>
  </div>
</template>

<script>
import {
  REGISTER_MAPPING,
  QUERY_SECRET,
  QUERY_AREA_FROM,
  QUERY_AREA_TO,
  DEFAULT_ERROR,
  PROGRESS_DETERMINATE
} from "../util/constants";
import axios from "axios";

export default {
  name: "Connection",
  components: {},
  data: () => ({
    sending: false,
    showStatusMessage: false,
    processBarMode: PROGRESS_DETERMINATE,
    processMessage: DEFAULT_ERROR,

    baseURL: "",
    registerSecret: "",
    areaFrom: "ENTRANCE",
    areaTo: "",

    eventAddress: "",
    tickets: [],
    data: null
  }),
  computed: {
    formatBaseURL() {
      if (this.baseURL.slice(-1) === "/") {
        return this.baseURL.slice(0, -1);
      }
      return this.baseURL;
    },
    registerRequestURL() {
      return (
        this.formatBaseURL +
        REGISTER_MAPPING +
        "?" +
        QUERY_SECRET +
        this.registerSecret +
        "&" +
        QUERY_AREA_FROM +
        this.areaFrom +
        "&" +
        QUERY_AREA_TO +
        this.areaTo
      );
    },
    formValid() {
      return (
        this.baseURL != "" &&
        this.registerSecret != "" &&
        this.areaFrom != null &&
        this.areaTo != null
      );
    },
  },
  methods: {
    showStatus(processBarMode, message) {
      this.processBarMode = processBarMode;
      this.processMessage = message;
      this.showStatusMessage = true;
    },
    hideStatus() {
      this.showStatusMessage = false;
    },
    showErrorStatus() {
      this.showStatus(PROGRESS_DETERMINATE, DEFAULT_ERROR);
      setTimeout(() => {
        this.hideStatus();
      }, 5000);
    },
    async register() {
      if (!this.formValid) {
        this.showErrorStatus();
      } else {
        this.$store.dispatch("setBaseURL", this.formatBaseURL);
        this.$store.dispatch("setAreaFrom", this.areaFrom);
        this.$store.dispatch("setAreaTo", this.areaTo);
        const response = await this.registerRequest();
        const terminalId = response.data;
        this.$store.dispatch("setTerminalId", terminalId);
        this.goToTerminal();
      }
    },
    async registerRequest() {
      return await axios.post(this.registerRequestURL);
    },
    goToTerminal: function() {
      this.$router.push({
        name: `Terminal`
      });
    }
  }
};
</script>

<style>
.connection-container {
  position: fixed;
  top: 20%;
  left: 50%;
  margin: -10% 0 0 -45%;
  width: 90%;
  height: 80%;
}
.event-address-container {
  display: flex;
}
.base-url-container {
  display: flex;
}
.go-to-terminal {
  position: fixed;
  right: 0;
  bottom: 0;
}
.status-message {
  text-align: center;
}
</style>
