<template>
  <v-toolbar-title class="pa-0 ma-0 pt-3 appBarButtonBg" :class="$vuetify.breakpoint.lg ? 'set-bell-spacing' : 'mobile-bell-spacing'">
    <v-menu offset-y bottom left max-height="300px">
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on" @click="getNotificationDetails()">
          
          <v-badge
            color="red"
            dot
            :content="activeWorkspace?.workspaceNotifications"
            :value="activeWorkspace?.workspaceNotifications"
            >
            <!-- overlap -->
            <BellIcon />
            <!-- <v-icon color="white" size="20">mdi-bell</v-icon> -->
          </v-badge>
        </div>
      </template>
      <v-list>
        <v-list-item-group
          :style="
            $vuetify.breakpoint.lg
              ? 'max-height: 200px !important; overflow-y: scroll !important; min-height: 200px;  max-width: 400px; min-width: 400px'
              : 'max-height: 200px !important; overflow-y: scroll !important; min-height: 200px;'
          "
        >
          <div
            v-if="apiResponse"
            class="d-flex justify-center align-center"
            style="min-height: 200px; max-height: 200px"
          >
            <v-progress-circular
              indeterminate
              color="primary"
              height="10"
            ></v-progress-circular>
          </div>

          <div v-else-if="!apiResponse && notificationLength > 0">
            <div v-for="(item, index) in responseArray" :key="index">
              <div class="cursor-pointer" @click="openTicket(item)">
                <v-list-item three-line class="pa-2 pt-4">
                  <v-list-item-content>
                    <span
                      class="fs-13 fw-400 px-2 primary--text"
                      style="word-break: break-all"
                    >
                      <b>{{
                        item.logs[0].status === "Created"
                          ? item?.logs[0]?.userId?.name
                          : "Employee"
                      }}</b>
                      created <b>{{ item.ticketNo }}</b>
                    </span>

                    <!-- <v-list-item-subtitle class="px-2 primary--text"> {{item.message}}</v-list-item-subtitle> -->

                    <v-list-item-subtitle class="px-2 pt-2">
                      {{ item.createdAt | formatDate }} -
                      {{ item.createdAt | formatTime }}</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
              </div>
            </div>
          </div>
          <div
            v-else
            class="d-flex flex-column justify-center align-center"
            style="min-height: 200px; max-height: 200px"
          >
            <v-img
              contain
              aspect-ratio="1"
              src="@/assets/dashboard/no-new-notification.png"
              width="100"
              max-width="100"
              max-height="100"
              height="100"
            ></v-img>
            <span class="fs-14 fw-400 text-capitalize">
              No new notification
            </span>
          </div>
        </v-list-item-group>
        <v-divider></v-divider>
      </v-list>
    </v-menu>
  </v-toolbar-title>
</template>

<script>
import { mapGetters } from "vuex";
import UrlServices from "../../../services/Url";
import axios from "axios";
import BellIcon from "../../common/icons/bell.vue"
import EventBus from "../../../js/EventBus";

export default {
  name: "NotificationDropDown",
  data: () => ({
    apiResponse: false,
    notificationLength: 0,
    responseArray: [],
  }),
  components: {
    BellIcon
  },
  computed: {
    ...mapGetters({
      // workspaces: "auth/getUserWorkSpaces",
      activeWorkspace: "auth/getCurrentWorkspace",
      // allWorkspaces: "auth/getWorkspaces",
      user: "auth/getUser",
      token: "auth/getAuthToken",
    }),
  },
  mounted() {
    // this.$store.dispatch("auth/getWorkspacesForSpecificUser");
  },
  methods: {
    //API Call
    async getNotifications() {
      var config = {
        method: "get",
        url: `${UrlServices.auditTickets}${this.activeWorkspace.workspaceId}`,
        headers: {
          Authorization: this.token,
        },
      };
      return await axios(config);
    },
    //Get Notifications Details
    async getNotificationDetails() {
      try {
        this.apiResponse = true;
        //Api Call
        let res = await this.getNotifications();
        this.responseArray = res.data.data;
        this.notificationLength = this.responseArray.length;
        //Clear Notifications
        this.clearNotificationCount();
        this.apiResponse = false;
      } catch (e) {
        this.$showNotificationBar("error", e?.message);
      }
    },
    openTicket(ticket) {
      if (this.$route.path !== "/requests-history")
        this.$router.push({ path: "/requests-history" });
      setTimeout(function () {
        EventBus.$emit("ticket-for-audit", ticket);
      }, 100);
      // EventBus.$emit('ticket-for-audit',ticket)
    },
    //Clear Notifications
    clearNotificationCount() {
      let workspaceDetails = { ...this.activeWorkspace };
      workspaceDetails.workspaceNotifications = 0;
      this.$store.commit("auth/updateUserWorkspaces", workspaceDetails);
      this.$store.commit("auth/addCurrentWorkspace", workspaceDetails);
    },
  },
};
</script>
<style scoped>
.badge-span {
  position: relative;
  background-color: #f0ebfd;
  border-radius: 15px;
  width: 25px;
  height: 17.59px;
  float: right;
  font-family: "avenir";
}
::v-deep .v-list-item--active {
  background-color: #f4f1fe;
}
.v-list-item {
  min-height: 36px !important;
}
.v-list-item:hover {
  background-color: #f0ebfd !important;
}
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
:deep(.active-workspace-class) {
  background-color: #f0ebfd !important;
}
.set-bell-spacing {
  padding: 8px 12px 10px 12px !important;
  margin-top: 7px !important;
  margin-bottom: 6px !important;
}
.mobile-bell-spacing {
  padding: 10px 12px 5px 12px !important;
  margin-top: 7px !important;
  margin-bottom: 5px !important;
  margin-right: 6px !important;
}
</style>
