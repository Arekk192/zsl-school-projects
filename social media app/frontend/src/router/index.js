import { createRouter, createWebHistory } from "vue-router";
import RegisterPage from "../components/RegisterPage.vue";
import LoginPage from "../components/LoginPage.vue";
import HomePage from "../components/HomePage.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "Login", component: LoginPage },
  { path: "/register", name: "Register", component: RegisterPage },
  { path: "/home", name: "Home", component: HomePage },
];

const router = createRouter({ history: createWebHistory(), routes });

export default router;
