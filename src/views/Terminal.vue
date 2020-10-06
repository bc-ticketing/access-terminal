<template>
  <div class="terminal-container">
    <div class="not-ready-state">
      <h1>Please wait</h1>
    </div>
    <div class="qr-scanning" v-if="qrReady">
      <h1 class="qr-instruction">
        Please scan this QR code with the Idetix App and follow the
        instructions!
      </h1>
      <vue-qrcode class="qr-code" :value="qrValue" :quality="quality" />
      <div v-if="error" class="error">
        <h2>Out of order! Please use a different terminal right now.</h2>
      </div>
    </div>
    <div class="change-connection">
      <md-button class="md-primary" @click="toConnection">Connection</md-button>
    </div>
    <div class="reconnect">
      <md-button class="md-primary" @click="reconnect">Reconnect</md-button>
    </div>
  </div>
</template>

<script>
import VueQrcode from "vue-qrcode";

export default {
  components: {
    VueQrcode
  },
  data: () => ({
    error: false,
    qrReady: true,
    quality: 1,
    qrValue:
      "start aösdkljfaölsdkjföasdjkflöajsdlöfkjasöldfjölasdjfölasjdölkfjasdöljfölskdjfösdlkjfadksölfjsö"
  }),
  methods: {
    toConnection() {
      this.$router.push({
        name: `Connection`
      });
    },
    reconnect() {}
  }
};
</script>

<style>
.not-ready-state {
  position: fixed;
  top: 50%;
  left: 50%;
  margin: -25% 0 0 -25%;
  width: 50%;
  height: 50%;
}
.qr-instruction {
  line-height: 1em;
  max-height: 5em;
  position: fixed;
  text-align: center;
  left: 10%;
  top: 5%;
  width: 80%;
}
.qr-code {
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
</style>
