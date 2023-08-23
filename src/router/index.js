import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: {
      title: "Login | ",
    },
  },
  // {
  //   path: "/login",
  //   name: "Login",
  //   component: () => import("../views/Login.vue"),
  //   meta: {
  //     title: "Login | ",
  //   },
  // },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
    meta: {
      title: "Register | ",
    },
  },
  {
    path: "/verify-email",
    name: "VerifyEmail",
    component: () => import("../components/registration/VerifyEmail.vue"),
    meta: {
      title: "VerifyEmail | ",
    },
  },
  {
    path: "/forget-password",
    name: "ForgetPassword",
    component: () => import("../views/ForgetPassword.vue"),
    meta: {
      title: "Forgot Password | ",
    },
  },
  {
    path: "/verification/:token",
    name: "Verification",
    component: () => import("../views/Verification.vue"),
    meta: {
      title: "Verification | ",
    },
  },
  {
    path: "/login-verification",
    name: "LoginVerification",
    component: () => import("../views/LoginVerification.vue"),
    meta: {
      title: "LoginVerification | ",
    },
  },
  {
    path: "/change-password",
    name: "ChangePassword",
    component: () => import("../views/ChangePassword.vue"),
    meta: {
      title: "Reset Password | ",
    },
  },
  {
    path: "/xero-connection",
    name: "XeroConnection",
    component: () => import("../views/XeroConnection.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/Dashboard.vue"),
    meta: {
      auth: true,
    },
    children: [
      {
        path: "/no-workspace",
        name: "NoWorkspace",
        component: () => import("@/components/dashboard/NoWorkspace.vue"),
        meta: {
          auth: true,
          title: "No Workspace | ",
        },
      },
      {
        path: "/integration",
        name: "Integration",
        component: () => import("../views/Integration.vue"),
        meta: {
          auth: true,
          title: "Integration | ",
        },
      },
      {
        path: "/generate-reports",
        name: "GenerateReports",
        component: () => import("../views/GenerateReports.vue"),
        meta: {
          auth: true,
          title: "Generate Reports | ",
        },
      },
      {
        path: "/requests-history",
        name: "RequestHistory",
        component: () => import("@/views/dashboard/GenerateRequests.vue"),
        meta: {
          auth: true,
          title: "Request History | ",
        },
      },
      {
        path: "/generate-request",
        name: "GenerateRequests",
        component: () => import("../views/RequestHistory.vue"),
        meta: {
          auth: true,
          title: "Generate Requests | ",
        },
      },
      {
        path: "/settings",
        name: "Settings",
        component: () => import("@/views/Settings.vue"),
        meta: {
          auth: true,
          title: "Settings | ",
        },
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (to.meta.auth) {
    if (token) next();
    else next({ path: "/" });
  } else {
    if (token) {
      next({ path: "/dashboard" });
    } else next();
  }
});

export default router;
