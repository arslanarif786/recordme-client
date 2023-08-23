<template>
  <v-app app>
    <v-app-bar class="header-bg" app flat>
      <v-toolbar-title class="d-flex">
        <span class="material-icons white--text" @click.stop="drawer = !drawer">
          menu
        </span>

        <v-navigation-drawer
          v-model="drawer"
          absolute
          temporary
          height="100vh"
          style="z-index: 999 !important"
        >
          <v-list-item>
            <v-list-item-avatar>
              <v-img
                class="pa-0 ma-0"
                :src="require('@/assets/dummy-workspace.svg')"
              />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title class="fs-14 fw-400 text-capitalize">{{
                user.name
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list
            dense
            v-for="item in items"
            :key="item.title"
            class="my-0 py-0"
          >
            <router-link
              v-if="!item.auth || user.role === 'client'"
              :to="item.to"
              class="remove-underline text-capitalize"
              :class="
                $route.name == item.routeName ? 'primary--text' : 'heading-text'
              "
            >
              <v-list-item link>
                <v-list-item-icon>
                  <v-icon
                    :class="
                      $route.name == item.routeName
                        ? 'primary--text'
                        : 'heading-text'
                    "
                    >{{ item.icon }}</v-icon
                  >
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title
                    :class="
                      $route.name == item.routeName
                        ? 'primary--text'
                        : 'heading-text'
                    "
                  >
                    {{ item.title }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </router-link>
          </v-list>
          <v-divider></v-divider>
          <v-list-item v-for="item in secondList" :key="item.title" link>
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content @click="item.to == '/logout' ? logout() : ''">
              <v-list-item-title>
                <router-link
                  v-if="!item.auth || user.role === 'client'"
                  :to="item.to"
                  class="remove-underline"
                  :class="
                    $route.name == item.routeName
                      ? 'primary--text'
                      : 'heading-text'
                  "
                  >{{ item.title }}
                </router-link>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-navigation-drawer>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <MobileHeaderFilters />

      <NotificationDropDown class="mb-3" v-if="role === 'client'" />
      <div class="d-flex appBarButtonBg mobile-workspace-spacing">
      <v-avatar
        color="#7147F6"
        class="white--text workspace-default-img"
        size="26"
        tile
      >
        {{
          activeWorkspace?.workspaceName[0].toUpperCase() | truncate(10)
        }}</v-avatar
      >

      <HeaderWorkSpaceDropdown />
      </div>
    </v-app-bar>
  </v-app>
</template>
<script>
import { mapGetters } from "vuex";
import EventBus from "@/js/EventBus";
import HeaderWorkSpaceDropdown from "../dashboard/partials/HeaderWorkSpaceDropdown.vue";
import HeaderSearchBar from "../dashboard/partials/HeaderSearchBar.vue";
import MobileHeaderFilters from "../dashboard/partials/mobile/MobileHeaderFilters.vue";
import MobileHeaderRightDropdown from "../dashboard/partials/mobile/MobileHeaderRightDropdown.vue";
import ApiService from "../../services/Api";
import NotificationDropDown from "../dashboard/partials/NotificationDropDown.vue";
export default {
  name: "MobileHeader",
  data() {
    return {
      drawer: false,
      items: [
        {
          title: "Dashboard",
          to: "/dashboard",
          routeName: "Dashboard",
          auth: false,
          icon: "mdi-view-dashboard",
        },
        {
          title: "Record Now",
          to: "/generate-request",
          routeName: "GenerateRequests",
          auth: false,
          icon: "mdi-receipt-text",
        },
        {
          title: "Request History",
          to: "/requests-history",
          routeName: "RequestHistory",
          auth: false,
          icon: "mdi-forum",
        },
        {
          title: "Generate Report ",
          to: "/generate-reports",
          routeName: "GenerateReports",
          auth: false,
          icon: "mdi-flag",
        },
        {
          title: "Integration",
          to: "/integration",
          routeName: "Integration",
          auth: true,
          icon: "mdi-eye",
        },
        {
          title: "Settings",
          to: "/settings",
          routeName: "Settings",
          auth: true,
          icon: "mdi-wrench",
        },
      ],
      secondList: [
        {
          title: "Logout",
          to: "/logout",
          routeName: "Logout",
          auth: true,
          icon: "mdi-logout",
        },
      ],
    };
  },
  components: {
    HeaderWorkSpaceDropdown,
    HeaderSearchBar,
    MobileHeaderRightDropdown,
    MobileHeaderFilters,
    NotificationDropDown,
  },
  computed: {
    ...mapGetters({
      activeWorkspace: "auth/getCurrentWorkspace",
      user: "auth/getUser",
      role: "auth/getUserRole",
    }),
    showMenu() {
      return this.toggleMenu || this.$vuetify.breakpoint.mdAndUp;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/").then(() => {
        this.$store.dispatch("resetStoreState");
        location.reload(true);
      });
    },
  },
};
</script>

<style scoped>
.v-navigation-drawer {
  overflow: auto !important;
}
.mobile-workspace-spacing{
  padding: 7px;
  border-radius: 30px;
}
</style>
