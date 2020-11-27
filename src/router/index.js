import Vue from "vue";
import VueRouter from "vue-router";
import Connection from "../views/Connection.vue";
import Terminal from "../views/Terminal.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Connection",
    component: Connection
  },
  {
    path: "/terminal",
    name: "Terminal",
    component: Terminal
  }
];

const router = new VueRouter({
  routes
});

export default router;
