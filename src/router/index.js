import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import form from "./form";
import formsMulti from "./formsMulti";
import tables from "./tables";
import viewgird from "./viewGird";
import store from "../store/index";
import redirect from "./redirect";
import charts from "./charts";
import monitor from "./monitor";
import analyse from "./analyse";
import purview from "./purview";
import { ElMessage } from "element-plus";

const routes = [
  {
    path: "/",
    name: "Index",
    component: () => import("@/views/Index"),
    redirect: "/gis",
    children: [
      ...form, //Demo表单路由
      ...formsMulti,
      ...tables, //tables
      ...viewgird,
      ...redirect,
      ...charts,
      ...monitor, //监测数据路由
      ...analyse, //分析路由
      ...purview,
      {
        path: "/home",
        name: "home",
        component: () => import("@/views/Home.vue"),
      },
      {
        path: "/UserInfo",
        name: "UserInfo",
        component: () => import("@/views/system/UserInfo.vue"),
      },
      {
        path: "/sysMenu",
        name: "sysMenu",
        component: () => import("@/views/system/Sys_Menu.vue"),
      },
      {
        path: "/coder",
        name: "coder",
        component: () => import("@/views/builder/coder.vue"),
      },
      {
        path: "/formDraggable", //表单设计
        name: "formDraggable",
        component: () => import("@/views/formDraggable/formDraggable.vue"),
      },
      {
        path: "/formSubmit", //表单提交页面
        name: "formSubmit",
        component: () => import("@/views/formDraggable/FormSubmit.vue"),
        meta: {
          keepAlive: false,
        },
      },
      {
        path: "/formCollectionResultTree", //显示收集的数据表单
        name: "formCollectionResultTree",
        component: () =>
          import("@/views/formDraggable/FormCollectionResultTree.vue"),
        meta: {
          keepAlive: false,
        },
      },
      {
        path: "/signalR",
        name: "signalR",
        component: () => import("@/views/signalR/Index.vue"),
        meta: {
          keepAlive: false,
        },
      },
      {
        path: "/flowdemo", //发起流程示例
        name: "flowdemo",
        component: () => import("@/views/system/flow/FlowDemo.vue"),
        meta: {
          keepAlive: false,
        },
      },
      {
        path: "/gis",
        name: "gis",
        component: () => import("@/views/gis/index.vue"),
      },
      {
        path: "/games/gomoku",
        name: "Gomoku",
        component: () => import("@/views/games/Gomoku.vue"),
      },
      {
        path: "/formula/index",
        name: "formula",
        component: () => import("@/views/formula/index.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/app/guide",
    name: "apphome",
    meta: {
      anonymous: true,
    },
    component: () => import("@/views/h5/Guide.vue"),
  },
  {
    path: "/bigdata",
    name: "bigdata",
    component: () => import("@/views/charts/bigdata.vue"),
    meta: {
      keepAlive: false,
    },
  },
  {
    path: "/largeScreen",
    name: "largeScreen",
    component: () => import("@/views/charts/largeScreen.vue"),
    meta: {
      keepAlive: false,
    },
  },
  //   边坡雷达平台
  {
    path: "/radarLarge",
    name: "radarLarge",
    component: () => import("@/views/charts/radarLarge.vue"),
    meta: {
      keepAlive: false,
    },
  },
  //测试
  {
    path: "/bigtest",
    name: "bigtest",
    component: () => import("@/views/charts/bigtest.vue"),
    meta: {
      keepAlive: false,
    },
  },
  // 监测运维
  {
    path: "/bigDataF",
    name: "bigDataF",
    component: () => import("@/views/charts/bigDataF.vue"),
    meta: {
      keepAlive: false,
    },
  },

  {
    path: "/Gomoku",
    name: "Gomoku",
    component: () => import("@/views/games/Gomoku.vue"),
    meta: {
      keepAlive: false,
    },
  },

  // 墨镜客户端
  {
    path: "/getExe",
    name: "getExe",
    component: () => import("@/views/getExe.vue"),
    meta: {
      keepAlive: false,
    },
  },

  {
    path: "/LxLogin",
    name: "LxLogin",
    component: () => import("@/views/LxLogin.vue"),
    meta: {
      keepAlive: false,
    },
  },
  {
    path: "/dataview",
    name: "dataview",
    component: () => import("@/views/dataview.vue"),
    meta: {
      keepAlive: false,
    },
  },
  {
    path: "/deviceLargeScreen",
    name: "deviceLargeScreen",
    component: () => import("@/views/charts/deviceLargeScreen.vue"),
    meta: {
      keepAlive: false,
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(), //createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  //没有菜单权限 通过地址栏访问 直接拦截跳转登录界面去
  let menuTree = JSON.parse(localStorage.getItem("menuTree")) || null;
  if (menuTree) {
    let navmap = menuTree.map((item) => item.url);
    if (
      navmap.indexOf(to.fullPath) == -1 &&
      to.fullPath != "/404" &&
      to.fullPath != "/" &&
      to.fullPath != "/login"
    ) {
      if (to.fullPath.indexOf("/login") == -1) {
        ElMessage.error("无权限访问！");
      }
      return next({ path: "/login" });
    }
  }

  if (to.matched.length == 0) return next({ path: "/404" });
  //2020.06.03增加路由切换时加载提示
  store.dispatch("onLoading", true);
  if (
    (to.hasOwnProperty("meta") && to.meta.anonymous) ||
    store.getters.isLogin() ||
    to.path == "/login" ||
    to.path == "/dataview"
  ) {
    return next();
  }
  next({ path: "/login", query: { redirect: Math.random() } });
});
router.afterEach((to, from) => {
  store.dispatch("onLoading", false);
});
router.onError((error) => {
  // const targetPath = router.currentRoute.value.matched;

  try {
    console.log(error.message);
    if (process.env.NODE_ENV == "development") {
      alert(error.message);
    }
    localStorage.setItem("route_error", error.message);
  } catch (e) {}
  window.location.href = "/";
});
export default router;
