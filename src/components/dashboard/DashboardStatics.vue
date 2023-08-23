<template>
  <v-container fluid class="pl-4 pt-0 mt-0">
    <v-row class="ma-2 mt-3">
      <!-- md="2" -->
      <!-- cols="12" -->
      <!-- sm="12" -->
      <v-col
        class="pt-0 pb-0"
        :sm="!$vuetify.breakpoint.lg ? 12 : ''"
        :cols="!$vuetify.breakpoint.lg ? 12 : ''"
        v-for="(item, index) in items"
        :key="index"
      >
        <v-card
          class="p-1 border-radius-7 mt-1 dashboardBlockColor custom-dashboard-border"
          outlined
          height="90"
          @click="moveToGenerateRequest(item)"
        >
          <v-row class="mt-2 ml-4 mr-4">
            <v-col cols="10" class="ml-0 pl-0">
              <v-list-item-title
                class="fs-14 fw-400 textPrimary--text f-inter mb-1 pa-0 ma-0 text-capitalize"
              >
                {{ item.heading }}
              </v-list-item-title>
              <p class="fs-22 textPrimary--text f-inter fw-600">{{ item.count }}</p>
            </v-col>
            <v-col cols="2" class="pa-0">
              <v-img
                :src="item.img"
                :width="item.width"
                :height="item.height"
                class="mt-2"
              ></v-img>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import EventBus from "../../js/EventBus";

export default {
  name: "DashboardStatics",
  props: {
    filter: Object,
  },
  data() {
    return {
      filterObj: {},
      items: [
        {
          img: require("../../assets/dashboard/total.svg"),
          heading: "Total",
          count: 0,
          width: "20px",
          height: "20.63px",
          value: "Total",
        },
        {
          img: require("../../assets/dashboard/pending.svg"),
          heading: "Pending",
          count: 0,
          width: "20px",
          height: "20.63px",
          value: "Pending",
        },
        {
          img: require("../../assets/dashboard/in-progress.svg"),
          heading: "In Progress",
          count: 0,
          width: "20px",
          height: "20.63px",
          value: "InProgress",
        },
        {
          img: require("../../assets/dashboard/awaiting-response.svg"),
          heading: "Awaiting Response",
          count: 0,
          width: "20px",
          height: "20.63px",
          value: "AwaitingResponse",
        },
        // {
        //   img: require("../../assets/dashboard/client-responded.svg"),
        //   heading: "Responded",
        //   count: 0,
        //   width: "20px",
        //   height: "20.63px",
        //   value: "ClientResponded",
        // },
        {
          img: require("../../assets/dashboard/Completed.png"),
          heading: "Completed",
          count: 0,
          width: "25px",
          height: "17px",
          value: "Complete",
        },
        {
          img: require("../../assets/dashboard/request-reviewed.svg"),
          heading: "Review Request",
          count: 0,
          width: "20px",
          height: "20.63px",
          value: "ReviewRequest",
        },
      ],

      statuses: [
        "Total",
        "Pending",
        "In Progress",
        "Awaiting Response",
        // "Responded",
        "Completed",
        "Review Request",
      ],
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/getUser",
      currentWorkspace: "auth/getCurrentWorkspace",
    }),
  },
  mounted() {
    // Method to dispatch ticket stats against workspace id
    this.dataRequest();
    EventBus.$on("dashboard-filter", (data) => {
      this.filterObj = data;
      this.dataRequest();
    });
  },
  methods: {
    /**
     * If the startOfMonth and endOfMonth properties of the filterObj object have a length greater than 4, 
     * then from and to properties are added to the payload object with their respective values.
     * The method then dispatches the ticketStats action to the store. 
     * When the promise resolves, the total count of tickets returned by the server is assigned to the first item in array.
     */
    dataRequest() {
      const payload = {
        id: this.currentWorkspace.workspaceId,
      };
      if (this.filterObj.startOfMonth && this.filterObj.startOfMonth.length > 4)
        payload.from = this.filterObj.startOfMonth;
      if (this.filterObj.endOfMonth && this.filterObj.endOfMonth.length > 4)
        payload.to = this.filterObj.endOfMonth;

      this.$store
        .dispatch("dashboard/ticketStats", payload)
        .then((res) => {
          this.items[0].count = res.data.total;
          res.data.data.forEach((data) => {
            let statusIndex = this.statuses.indexOf(data.status);
            statusIndex != -1 && (this.items[statusIndex].count = data.count);
          });
          EventBus.$emit("ticket-stats-response", true);
        })
        .catch((err) => {
          console.log(err, "comp");
          EventBus.$emit("ticket-stats-response", true);
        });
    },
    moveToGenerateRequest(item) {
      if (item.value == "Total")
        return this.$router.push({ path: "/requests-history" });
      const obj = {
        dateRange: "",
        messageFilter: "",
        searchStatus: [item.value],
        requestType: [],
      };
      setTimeout(function () {
        EventBus.$emit("advance-search-filters-data", obj);
      }, 100);
      this.$store.commit("ticket/setAdvancedSearch", obj);
      localStorage.setItem("advanceRoute", true);
      this.$router.push({ path: "/requests-history" });
    },
  },
};
</script>

<style scoped>
:deep(.v-list-item__title) {
  font-size: 14px;
  font-weight: 400;
}
.custom-dashboard-border {
    border: 1px solid var(--v-dashboardBlockBorderColor-base) !important;
}
</style>
