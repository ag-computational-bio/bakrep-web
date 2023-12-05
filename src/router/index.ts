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
      props: (route) => ({
        offset: parseInt(route.query.offset as string),
        limit: parseInt(route.query.limit as string),
        query: route.query.query,
      }),
    },
    {
      path: "/imprint",
      name: "imprint",
      component: () => import("../views/ImprintView.vue"),
    },
    {
      path: "/result/:id",
      name: "result",
      component: () => import("../views/show-results/ResultView.vue"),
      props: true,
    },
    {
      path: "/result/:id/:tab",
      name: "result-tab",
      component: () => import("../views/show-results/ResultView.vue"),
      props: true,
    },
    {
      path: "/browse",
      name: "browse",
      component: () => import("../views/BrowseView.vue"),
      props: (route) => ({
        offset: parseInt(route.query.offset as string),
        limit: parseInt(route.query.limit as string),
        gc: route.query.qc,
        contig: route.query.qc,
        size: route.query.size,
        quality: route.query.quality,
        contamination: route.query.contamination,
        field: route.query.field,
        order: route.query.order,
      }),
    },
    {
      path: "/composition",
      name: "composition",
      component: () => import("../views/DatasetCompositionView.vue"),
    },
    {
      path: "/statistics",
      name: "statistics",
      component: () => import("../views/statistics/StatisticsView.vue"),
    },
  ],
});

export default router;
