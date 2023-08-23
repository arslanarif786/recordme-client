<template>
  <v-menu
    offset-y
    :class="$vuetify.breakpoint.md ? 'md-drop' : 'lg-drop'"
    class="menu-dropdown"
    min-width="121px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="ma-0 text-capitalize"
        color="appBarButtonBg"
        rounded
        small
        v-bind="attrs"
        v-on="on"
      >
        <template v-slot-icon>
          <v-img
            class="pa-0 ma-0"
            :src="require('@/assets/dummy-workspace.svg')"
            width="19px"
            height="18px"
          />
          <span class="fs-10 fw-500 text-white pa-0 ma-0 pl-1 text-capitalize">
            {{ fullName | truncate(15) }}
          </span>
        </template>

        <span class="material-icons text-white"> expand_more </span>
      </v-btn>
    </template>
    <v-list class="pa-0 list">
      <v-list-item
        class="ma-0 dropdown-list"
        v-for="(item, index) in items"
        :key="index"
      >
        <v-list-item-content class="cursor-pointer pa-0">
          <v-list-item-icon
            class="cusror-pointer ma-0 pa-0"
            @click="routeToProfile(item)"
          >
            <v-icon
              small
              color="primary"
              class="material-icons mt-2"
              size="18dp"
            >
              {{ item.icon }}
            </v-icon>
            <v-list-item-title class="pl-2 mt-1"
              ><span
                class="remove-underline fs-14 fw-400 f-avenir textPrimary--text"
                >{{ item.text }}</span
              >
            </v-list-item-title>
          </v-list-item-icon>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "HeaderRightDropdown",
  data: () => ({
    items: [
      {
        icon: "settings",
        text: "Settings",
        to: "/settings",
      },
      {
        icon: "power_settings_new",
        text: "Logout",
        to: "/",
      },
    ],
  }),
  computed: {
    ...mapGetters({ user: "auth/getUser" }),

    fullName() {
      // if(this.user.firstName){
      //   return this.user.firstName + ' ' + this.user.lastName;
      // }
      return this.user.name;
    },
  },
  methods: {
    routeToProfile(item) {
      item.text == "Settings"
        ? this.$router.push(item.to)
        : item.text == "Logout"
        ? this.logout()
        : "";
    },

    /**
     * Method to logout the application
     */
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
.v-btn:not(.v-btn--round).v-size--small {
  height: 35px !important;
  border-radius: 50px;
  top: 7px;
}
.v-menu__content {
  position: fixed !important;
  min-width: 120px !important;
  /* left: 1250px !important; */
  /* width: 111px; */
}
.md-drop >>> .v-menu__content {
  left: 1250px !important;
}
.sm-drop >>> .v-menu__content {
  left: 1300px !important;
}
::v-deep .v-list-item {
  min-height: 40px !important;
}
.list {
  border-radius: 6px !important;
  width: 130px !important;
}
/* .dropdown-list:hover {
  background-color: var(--v-lightBackground-base) !important;
} */
</style>
