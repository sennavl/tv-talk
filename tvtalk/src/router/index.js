import Vue from "vue";
import Router from "vue-router";
import Home from "@/components/Home";
import Test from "@/components/Test";
import Profile from "@/components/Profile";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/home",
      name: "Home",
      component: Home
    },
    {
      path: "/test",
      name: "Test",
      component: Test
    },
    {
      path: "/profile",
      name: "Profile",
      component: Profile
    },
    {
      path: "*",
      redirect: "/home"
    }
  ]
});

export default router;
