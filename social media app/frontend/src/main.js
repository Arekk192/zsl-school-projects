import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import store from "./data/store";

createApp(App).use(store).mount("#app");
