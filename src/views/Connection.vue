<template>
  <div class="connection-container">
    <form>
      <md-card>
        <md-card-header>
          <div class="md-title">Connection to Socket</div>
        </md-card-header>
        <md-card-content style="padding: 20px">
          <md-field>
            <md-input v-model="url" />
          </md-field>
        </md-card-content>
        <md-card-actions>
          <div class="connect-button-container">
            <md-button class="connect-button md-primary" @click="connect()"
              >Connect</md-button
            >
          </div>
        </md-card-actions>
      </md-card>
    </form>
    <div class="go-to-terminal">
      <md-button class="md-primary" @click="goToTerminal()">Terminal</md-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Connection",
  components: {},
  data: () => ({
    url: "wss:"
  }),
  methods: {
    connect() {
      this.$root.$on("connectionEstablished", async () => {
        this.$router.push({
          name: `Terminal`
        });
      });
      let socket;
      try {
        socket = new WebSocket(this.url);
      } catch (e) {
        console.log(e);
      }
      console.log(socket);
      this.$store.commit("updateSocket", socket);
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
  top: 50%;
  left: 50%;
  margin: -10% 0 0 -45%;
  width: 90%;
  height: 80%;
  /* left: 20px;
  right: 20px;
  top: 30%;
  margin: auto;
  vertical-align: middle; */
}
.go-to-terminal {
  position: fixed;
  right: 0;
  bottom: 0;
}
/* .connect-button-container { */
/* position: absolute; */
/* width: 70%; */
/* margin: -5% 0 0 -35%; */
/* height: 5%; */
/* bottom: 0; */
/* } */
</style>
