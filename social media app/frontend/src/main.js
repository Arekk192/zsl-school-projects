import { createApp } from "vue";
import App from "./App.vue";
import store from "./data/store";
import router from "./router/index";
import "./style.css";

createApp(App).use(store).use(router).mount("#app");
