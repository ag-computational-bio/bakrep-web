import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/main.css";
import { initApi } from "./BakrepApi";
import { initDbxrefApi } from "./DbxrefApi";

const base = import.meta.env.BASE_URL;

const configUrl = import.meta.env.DEV
  ? "/config/config.json"
  : base + (base.endsWith("/") ? "" : "/") + "config/config.json";

fetch(configUrl)
  .then((r) => {
    if (!r.ok) {
      throw "App configuration not found. Please contact the server administrator if this error persists.";
    }
    return r.json();
  })
  .then((config) => {
    initApi(config["bakrep-api-url"]);
    initDbxrefApi(config["dbxref-api-url"]);
    const app = createApp(App);
    app.use(router);
    app.mount("#app");
  })
  .catch((e) => {
    document.body.innerHTML = `<div class="d-flex justify-content-center vh-100 align-items-center alert alert-danger">Error: ${e}</div>`;
  });
