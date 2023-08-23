<template>
  <div>
    <div v-if="$vuetify.breakpoint.lg">
      <v-app>
        <v-app-bar
          flat
          app
          dense
          fixed
          elevate-on-scroll
          id="toolbar"
          class="headerColor"
        >
          <DashboardNavbar
            v-if="currentWorkspaceBoolean && $vuetify.breakpoint.lg"
          />
          <v-spacer></v-spacer>
          <v-toolbar-items class="hidden-sm-and-down">
            <!-- search input start -->
            <HeaderSearchBar />

            <!-- notification drop down -->
            <NotificationDropDown v-if="role == 'client'" class="my-1 mr-2" />

            <!-- search input end -->
            <v-toolbar-title
              class="d-flex appBarButtonBg workspace-dropdown-spacing custom-title-width"
            >
              <v-avatar
                color="primary"
                class="white--text workspace-default-img mt-1"
                size="26"
              >
                {{
                  activeWorkspace?.workspaceName[0].toUpperCase() | truncate(10)
                }}</v-avatar
              >
              <HeaderWorkSpaceDropdown id="v-step-0" />
            </v-toolbar-title>
            <!-- <HeaderRightDropdown /> -->
          </v-toolbar-items>
        </v-app-bar>
      </v-app>
    </div>
    <div v-if="!$vuetify.breakpoint.lg">
      <MobileHeader />
    </div>
  </div>
</template>

<script>
import HeaderWorkSpaceDropdown from "../dashboard/partials/HeaderWorkSpaceDropdown.vue";
import HeaderSearchBar from "../dashboard/partials/HeaderSearchBar.vue";
import MobileHeaderSearchBar from "./partials/mobile/MobileHeaderFilters.vue";
import HeaderRightDropdown from "../dashboard/partials/HeaderRightDropdown.vue";
import NotificationDropDown from "../dashboard/partials/NotificationDropDown.vue";
import DashboardNavbar from "@/components/dashboard/Navbar.vue";

import MobileHeader from "../common/MobileHeader.vue";
import { mapGetters } from "vuex";
export default {
  name: "Header",

  components: {
    HeaderWorkSpaceDropdown,
    HeaderSearchBar,
    HeaderRightDropdown,
    MobileHeaderSearchBar,
    MobileHeader,
    NotificationDropDown,
    DashboardNavbar,
  },
  mounted() {},
  data() {
    return {
      drawer: true,
      tab: null,
      toggleMenu: false,
    };
  },
  computed: {
    ...mapGetters({
      activeWorkspace: "auth/getCurrentWorkspace",
      role: "auth/getUserRole",
    }),
    currentWorkspaceBoolean() {
      return Object.keys(this.activeWorkspace).length > 0 ? true : false;
    },
    showMenu() {
      return this.toggleMenu || this.$vuetify.breakpoint.mdAndUp;
    },
  },
};
</script>

<style scoped>
.v-btn--icon.v-size--default {
  width: 38px !important;
}

:deep(.workspace-default-img) {
  border-radius: 15px !important;
}
:deep(.v-input__icon--prepend .v-icon) {
  position: relative;
  left: 35px;
  z-index: 1000;
  font-size: 20px;
  color: white;
}
:deep(.v-toolbar__title) {
  font-size: 1rem !important;
  border-radius: 40px !important;
}
:deep(.theme--light.v-input input) {
  color: #e8ebf4 !important;
}
:deep(.v-application--wrap) {
  min-height: 0% !important;
}
.workspace-dropdown-spacing {
  margin: 8px 0px 7px 0px !important;
  padding-left: 7px !important;
}
.custom-title-width {
  max-width: 171px !important;
}
</style>
