<template>
  <v-toolbar-title
    class="pl-2"
    :class="$vuetify.breakpoint.lg ? 'mt-1' : 'mt-0'"
  >
    <v-menu offset-y max-height="300px" min-width="239px" class="menu-position menu-width">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="pa-0 ma-0 text-capitalize"
          color="header-bg"
          dark
          v-bind="attrs"
          v-on="on"
        >
          <span v-if="activeWorkspace">
            <span v-if="$vuetify.breakpoint.lg">{{
              activeWorkspace.workspaceName | truncate(10)
            }}</span>
            <span v-if="!$vuetify.breakpoint.lg">{{
              activeWorkspace.workspaceName | truncate(5)
            }}</span>
          </span>
          <span v-else> No Workspace </span>
          <span class="material-icons"> expand_more </span>
        </v-btn>
      </template>
      <v-list dense>
        <v-list-group
          :value="true"
          no-action
          expand
          class="pt-0 mt-0 pl-0"
          @click.stop
        >
          <template v-slot:activator>
            <v-list-item-icon class="ma-0 pt-2 dropdown-icon">
              <Workspaces />
              <!-- <v-icon medium color="#6634E9"> mdi-domain </v-icon> -->
              <v-list-item-title class="pl-2 pt-2 fs-14"
                ><p class="pa-0 ma-0 fw-400">Workspaces</p>
              </v-list-item-title>
            </v-list-item-icon>
          </template>

          <v-list-item-group
          style="max-height: 100px !important; overflow-y: scroll !important"
          class="pl-6"
        >
          <v-list-item
            v-for="(item, index) in workspaces.slice().reverse()"
            :key="index"
            height="1"
            class="cursor-pointer pa-0"
            :class="
              activeWorkspace.workspaceName == item.workspaceName
                ? 'active-workspace-class primary--text pl-3'
                : 'pl-3'
            "
            @click="changeWorkspace(item)"
          >
            <!-- <v-avatar
              color="#7147F6"
              class="white--text workspace-default-img"
              size="20"
              tile
            >
              {{
                item?.workspaceName[0].toUpperCase() | truncate(10)
              }}</v-avatar
            > -->
            <v-list-item-title class="pl-3 pr-2">
              <span class="fs-14 fw-400 text-capitalize">
                {{ item.workspaceName | truncate(24) }}
              </span>
              <!-- <span
                class="text-center align-center primary--text fs-11 fw-500 badge-span ml-2"
              >
                23
              </span> -->
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
        <v-list-item-group>
        <v-list-item
          v-if="user.role === 'client'"
          class="ma-0"
          @click="createWorkSpace()"
        >
          <v-list-item-content class="cursor-pointer pa-0">
            <v-list-item-icon class="ma-0">
              <v-icon medium class="dropdown-btn-color"> mdi-plus </v-icon>
              <v-list-item-title class="pl-2 fs-14"
                ><p class="pa-0 ma-0 fw-400">Create New Workspace</p>
              </v-list-item-title>
            </v-list-item-icon>
          </v-list-item-content>
        </v-list-item>
        </v-list-item-group>
        </v-list-group>


        <v-list v-if="$vuetify.breakpoint.lg" class="pa-0 list">
        <v-list-item
          class="ma-0 dropdown-list"
          v-for="(item, index) in items"
          :key="index"
        >
          <v-list-item-content class="cursor-pointer pa-0">
            <v-divider></v-divider>
            <v-list-item-icon
              class="cusror-pointer ma-0 pa-0 my-2"
              @click="routeToProfile(item)"
            >
              <v-icon
                v-if="item.to == '/'"
                small
                class="material-icons mt-2 dropdown-btn-color"
                size="18dp"
              >
                {{ item.icon }}
              </v-icon>
              <Settings v-else-if="item.to == '/settings'"/>
              <v-list-item-title class="pl-2 mt-1"
                ><span
                  class="remove-underline fs-14 fw-400 f-avenir dropdown-btn-color"
                  >{{ item.text }}</span
                >
              </v-list-item-title>
            </v-list-item-icon>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      </v-list>
    </v-menu>
  </v-toolbar-title>
</template>

<script>
import EventBus from "@/js/EventBus";
import rules from "../../../constants/validation-rules";
import Workspaces from "../../common/icons/workspace.vue"
import Settings from "../../common/icons/settings.vue"
import { mapGetters } from "vuex";
export default {
  name: "HeaderWorkSpaceDropdown",
  components: { Workspaces, Settings },
  data: () => ({
    selectedWorkspace: "",
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
    createWorkspaceInputList: [
      {
        name: "workspace_name",
        label: "Workspace Name*",
        placeholder: "Enter Your Workspace Name Here",
        type: "text",
        cols: 12,
        col_md: 12,
        model: "",
        class: "pt-0 mt-0",
        rules: [rules.required, rules.workspace_max_length],
      },
      {
        name: "description",
        label: "Description*",
        placeholder: "Enter Your Message Here...",
        type: "textarea",
        cols: 12,
        col_md: 12,
        model: "",
        class: "pt-0 mt-0",
      },
    ],
  }),
  computed: {
    ...mapGetters({
      workspaces: "auth/getUserWorkSpaces",
      activeWorkspace: "auth/getCurrentWorkspace",
      allWorkspaces: "auth/getWorkspaces",
      user: "auth/getUser",
    }),
  },
  mounted() {
    // this.$store.dispatch("auth/getWorkspacesForSpecificUser");
  },
  methods: {
    /**
     * Method to create a workspace
     */
    createWorkSpace() {
      EventBus.$emit("show-dialog", {
        show: true,
        title: "Create Workspace ",
        inputs: this.createWorkspaceInputList,
        dialogType: "form",
        for: "create-workspace",
      });
    },

    /**
     *
     * @param {*} workspace
     * Method to switch between workspace from list
     */
    changeWorkspace(workspace) {
      this.$store.commit("auth/addCurrentWorkspace", workspace);
      this.$router.go(this.$router.currentRoute);
    },

    /**
     *
     * @param {*} item
     * Method to route user to profile settings
     */
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
::v-deep .v-list-item--active {
  background-color: transparent !important;
  color: #6634E9;
}
.v-list-item {
  min-height: 36px !important;
}
:deep .v-list-item:hover {
  background-color: transparent !important;
}
/* :deep .v-list-group:hover {
  background-color: none !important;
} */
.v-chip {
  padding-left: 8px !important ;
  padding-right: 8px !important ;
  background-color: #f0ebfd !important;
}
:deep(.v-btn:not(.v-btn--round).v-size--default) {
  height: 0px !important;
}
:deep .menu-position {
  top: 40px !important;
}
:deep(.workspace-default-img) {
  border-radius: 3px !important;
}
:deep .active-workspace-class .v-list-item__title{
  color: #6634E9 !important;
}

:deep .v-list-item[data-v-3df619b2]:hover {
    background-color: #ffffff !important;
}
.dropdown-btn-color {
  color: #9d9eab;
  font-size: 16px;
}
:deep .v-list-group .v-list-group__header .v-list-item__icon.v-list-group__header__append-icon{
  margin-left: -12px !important;
  margin-top: 6px !important;
  width: 35px !important;
}

:deep .v-icon .notranslate .material-icons .theme--light{
  font-size: 10px !important;
}

</style>
