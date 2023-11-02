import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  linkActiveClass: "active",
  linkExactActiveClass: "exact-active",
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/search",
      name: "search",
      component: () => import("../views/search/SearchView.vue"),
    },
    {
      path: "/imprint",
      name: "imprint",
      component: () => import("../views/ImprintView.vue"),
    },
    {
      path: "/result/:id/:tab",
      name: "result",
      component: () => import("../views/show-results/ResultView.vue"),
      props: true,
    },
    {
      path: "/browse",
      name: "browse",
      component: () => import("../views/BrowseView.vue"),
    },
    {
      path: "/composition",
      name: "composition",
      component: () => import("../views/DatasetCompositionView.vue"),
    },
  ],
});

export default router;
