<template>
  <v-toolbar flat dense class="static-navbar">
    <p
      class="ml-4 cursor-pointer"
      depressed
      v-for="(item, index) in items"
      :key="index"
    >
      <router-link
        v-if="!item.auth || user.role === 'client'"
        :to="item.to"
        :id="item?.id"
        class="remove-underline fw-500 f-inter fs-14"
        :class="
          $route.name == item.routeName ? 'white--text border' : 'inActiveColor--text'
        "
        >{{ item.title }}
      </router-link>
    </p>
  </v-toolbar>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Navbar",

  data() {
    return {
      items: [
        {
          title: "Dashboard",
          to: "/dashboard",
          routeName: "Dashboard",
          auth: false,
          id: "v-step-3",
        },
        {
          title: "Record Now",
          to: "/generate-request",
          routeName: "GenerateRequests",
          auth: false,
          id: "v-step-10",
        },
        {
          title: "Request History",
          to: "/requests-history",
          routeName: "RequestHistory",
          auth: false,
          id: "v-step-1",
        },
        {
          title: "Generate Report",
          to: "/generate-reports",
          routeName: "GenerateReports",
          auth: true,
          id: "v-step-6",
        },
        {
          title: "Integration",
          to: "/integration",
          routeName: "Integration",
          auth: true,
          id: "v-step-9",
        },
      ],
    };
  },

  computed: {
    ...mapGetters({
      user: "auth/getUser",
    }),
  },
};
</script>

<style scoped>
.border {
  border-bottom: 3px solid var(--v-primary-base);
  padding-bottom: 8px;
}
.static-navbar {
  padding-top: 10px;
  background-color: transparent !important;
}
.static-navbar >>> .v-toolbar__content {
  padding: 0 !important;
}
</style>
