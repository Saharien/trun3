import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Hitlist from "../views/Hitlist.vue";
import Dashboard from "../views/Dashboard.vue";
import { authGuard } from "../auth/authGuard";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/hitlist",
    name: "Hitlist",
    component: Hitlist,
    beforeEnter: authGuard,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Dashboard,
    beforeEnter: authGuard,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
