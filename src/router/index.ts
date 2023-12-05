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
        gc: decodeTuple(route.query.qc as string),
        contig: decodeTuple(route.query.qc as string),
        size: decodeTuple(route.query.size as string),
        quality: decodeTuple(route.query.quality as string),
        contamination: decodeTuple(route.query.contamination as string),
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

function decodeTuple(tuple: string, defaultTuple: any): any {
  if (tuple) {
    const arr = tuple.split(";");
    return { from: Number.parseInt(arr[0]), to: Number.parseInt(arr[1]) };
  } else {
    return { from: 0, to: 100 };
  }
}

function getTupleRange(fieldId: string) {}
