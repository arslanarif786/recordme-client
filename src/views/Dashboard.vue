<template>
  <div
    class="mt-0"
    :style="
      $vuetify.breakpoint.lg
        ? 'padding: 60px 0px 0px !important'
        : 'padding: 10px 0px 0px !important'
    "
  >
    <DashboardHeader v-if="currentWorkspaceBoolean" />

    <!-- code start of filters -->
    <v-row
      class="mb-0 mx-6"
      v-if="$route.name == 'Dashboard' && currentWorkspaceBoolean"
      :class="$vuetify.breakpoint.lg ? 'mt-0' : 'mt-15'"
    >
      <v-col
        md="6"
        cols="12"
        sm="12"
        class="pt-0 mb-0 pb-0 ma-0 d-flex justify-space-between"
      >
        <p
          class="black--text fs-20 fw-600 f-inter mb-0 pb-0 cursor-pointer mt-3"
        >
          Dashboard
        </p>
        <p class="mt-1 pt-0 mb-0 pb-0" v-if="!$vuetify.breakpoint.lg">
          <v-btn
            large
            :class="
              $vuetify.breakpoint.lg
                ? 'create-btn mt-1 fs-20 fw-600 f-inter'
                : 'create-btn-mobile mt-1'
            "
            @click="$router.push({ path: 'generate-request' })"
            ><v-img src="@/assets/ticket/receipt.svg"></v-img>Record Now</v-btn
          >
        </p>
      </v-col>
      <v-col
        md="6"
        cols="12"
        sm="12"
        :class="
          $vuetify.breakpoint.lg
            ? 'pt-0 mb-0 pb-0 ma-0 mt-2 d-flex justify-end'
            : 'pt-0'
        "
      >
        <p
          class="black--text fs-14 fw-700 mb-0 pb-0 cursor-pointer mt-3 mr-10"
          v-if="$vuetify.breakpoint.lg && clearFilterData"
          @click="clearFilter()"
        >
          Clear Filter
        </p>

        <p class="mt-0 pt-0 mb-0 pb-0">
          <v-menu
            ref="menu"
            class="mt-0 pt-0"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            left
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="computedDateFormatted"
                :value="date"
                label="Select Date"
                :class="
                  $vuetify.breakpoint.lg
                    ? 'mt-0 pt-0 pr-0 custom-data-width'
                    : 'mt-3 w-100'
                "
                class="border-radius-7 custom-border-color"
                @click="menu = true"
                dense
                v-bind="attrs"
                outlined
                v-on="on"
                :hide-details="$vuetify.breakpoint.lg ? false : true"
              >
                <template v-slot:append>
                  <span
                    v-if="!$vuetify.breakpoint.lg && clearFilterData"
                    class="material-icons cursor-pointer"
                    @click="clearFilter()"
                  >
                    close
                  </span>
                  <span
                    v-else
                    class="material-icons cursor-pointer"
                    @click="menu = true"
                  >
                    event
                  </span>
                </template>
              </v-text-field>
            </template>

            <v-date-picker
              v-model="date"
              no-title
              scrollable
              type="month"
              :show-current="true"
              :max="lastMonthOfCurrentYear"
              color="#6634E9"
            >
              <v-spacer></v-spacer>
              <v-btn
                text
                color="secondary"
                @click="
                  () => {
                    menu = false;
                    date = '';
                  }
                "
              >
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                :disabled="disabled"
                @click="dataRequest()"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </p>
        <p class="mt-0 pt-0 mb-0 pb-0" v-if="$vuetify.breakpoint.lg">
          <v-btn
            large
            :class="
              $vuetify.breakpoint.lg
                ? 'create-btn f-inter'
                : 'create-btn-mobile f-inter'
            "
            @click="$router.push({ path: 'generate-request' })"
            ><v-img src="@/assets/ticket/receipt.svg"></v-img
            ><span class="f-inter">Record Now</span></v-btn
          >
        </p>
      </v-col>
    </v-row>

    <!-- code end of filters -->

    <NoWorkspace v-if="!currentWorkspaceBoolean" />
    <!-- DashboardStatics and DashboardChart will be show on only dashboard main page 
    so there is a condition on these components if route name is Dashboard then these will be show. -->
    <DashboardStatics
      v-if="$route.name == 'Dashboard' && currentWorkspaceBoolean"
    />
    <v-row>
      <v-col
        :md="
          currentWorkspace.isAccountingSoftConnected && user.role == 'client'
            ? '9'
            : '12'
        "
      >
        <DashboardChart
          v-if="$route.name == 'Dashboard' && currentWorkspaceBoolean"
        />
        <!-- && ticketStatsResponse -->
      </v-col>
      <v-col
        md="3"
        class="pa-0 mt-4"
        v-if="
          user.role === 'client' &&
          $route.name == 'Dashboard' &&
          currentWorkspaceBoolean &&
          currentWorkspace.isAccountingSoftConnected
        "
      >
        <DashboardBanks ref="banks" :toDate="date"/>
      </v-col>
    </v-row>
    <v-row
      v-if="
        user.role === 'client' &&
        $route.name == 'Dashboard' &&
        currentWorkspaceBoolean
      "
    >
      <v-col md="5" class="ml-8">
        <EmployeeStatus />
      </v-col>
    </v-row>

    <CustomDialog
      v-if="dialogData"
      :dialog="dialogData"
      @updateInput="updateInput($event)"
    />
    <router-view class="mt-15" />

    <!-- <CreateDialog
      @close-popup="
        () => {
          createTicketDialog = false;
        }
      "
      v-if="createTicketDialog"
    ></CreateDialog> -->
  </div>
</template>
<script>
import moment from "moment";
import EventBus from "../js/EventBus";
import DashboardHeader from "../components/dashboard/Header.vue";
// import DashboardNavbar from "../components/dashboard/Navbar.vue";
import DashboardStatics from "../components/dashboard/DashboardStatics.vue";
import DashboardChart from "../components/dashboard/DashboardChart.vue";
import CustomDialog from "../components/common/Dialog.vue";
import NoWorkspace from "../components/dashboard/NoWorkspace.vue";
import MobileHeader from "../components/common/MobileHeader.vue";
import CreateDialog from "../components/common/CreateDialog.vue";
import ConnectXeroMessage from "@/components/common/ConnectXeroMessage.vue";
import DashboardBanks from "../components/dashboard/DashboardBanks.vue";
import EmployeeStatus from "../components/dashboard/EmployeeStatus.vue";

import { mapGetters } from "vuex";
export default {
  name: "Dashboard",
  components: {
    DashboardHeader,
    // DashboardNavbar,
    DashboardStatics,
    DashboardChart,
    CustomDialog,
    NoWorkspace,
    MobileHeader,
    CreateDialog,
    ConnectXeroMessage,
    DashboardBanks,
    EmployeeStatus,
  },
  data() {
    const maxMonth = moment().format("YYYY-MM");
    return {
      createTicketDialog: false,
      dialogData: [],
      date: "",
      menu: false,
      endOfMonth: null,
      startOfMonth: null,
      disabled: false,
      lastMonthOfCurrentYear: maxMonth,
      clearFilterData: false,
      filterObj: {},
      ticketStatsResponse: false,
    };
  },

  computed: {
    ...mapGetters({
      currentWorkspace: "auth/getCurrentWorkspace",
      user: "auth/getUser",
      workspaces: "auth/getUserWorkSpaces",
    }),
    getXeroModal() {
      return (
        // !["Login", "Register", "Integration"].includes(this.$route.name) &&
        !this.currentWorkspace.isAccountingSoftConnected &&
        this.user.role === "client" &&
        this.workspaces.length > 0
      );
    },

    currentWorkspaceBoolean() {
      return Object.keys(this.currentWorkspace).length > 0 ? true : false;
    },
    dashboardFilterData() {
      return this.filterObj;
    },
    computedDateFormatted() {
      this.date
        ? (this.startOfMonth = moment(this.date, "YYYY-MM")
            .startOf("month")
            .format("YYYY-MM-DD"))
        : "";
      this.date
        ? (this.endOfMonth = moment(this.date, "YYYY-MM")
            .endOf("month")
            .format("YYYY-MM-DD"))
        : "";

      if (!["Dashboard"].includes(this.$route.name)) {
        this.date = "";
        this.clearFilterData = false;
      }

      return this.date ? moment(this.date, "YYYY-MM").format("MMMM YYYY") : "";
    },
  },
  mounted() {
  
    EventBus.$on("show-dialog", (data) => {
      this.dialogData = data;
    });
    console.log("dashboard chart>>> before emit>>>");
    EventBus.$on("ticket-stats-response", (res) => {
      if (res) this.ticketStatsResponse = true;
    });
    console.log("dashboard chart>>> after emit>>>");
  },
  methods: {
    /**
     * Desc: This function has been called when date has been changed on dashboard
     * we have a variable filterObj @param{obj} type and pass startOfMonth and endOfMonth value
     * lastly we emit an event which has been listen both child component of DashboardStatics.vue and DashboardChart.vue
     */
    dataRequest() {
      // validation
      if (!this.startOfMonth) {
        this.$showNotificationBar("error", "Please Select Month");
        return false;
      }

      // passing value of startOfMonth
      this.filterObj.startOfMonth = this.startOfMonth;
      // passing value of endOfMonth
      // if endofDate include current month then this.endOfMonth will be equal to current date
      if (moment(this.endOfMonth).month() == moment().month()) {
        this.endOfMonth = moment().format("YYYY-MM-DD");
      }
     
      this.filterObj.endOfMonth = this.endOfMonth;
      // make value of clearFilterData true to show clear filter btn
      this.clearFilterData = true;
      // to hide menu of date picker make menu value false
      this.menu = false;
      // emit event to child component to call api
      EventBus.$emit("dashboard-filter", this.filterObj);
      this.$refs.banks.getOpningBalance()

    },

    /**
     * Desc: This function has been called when user click on clear filter btn
     * we have a variable filterObj @param{obj} type and make it empty
     * and then we pass this empty variable to EventBus emit
     * lastly we emit an event which has been listen both child component of DashboardStatics.vue and DashboardChart.vue
     */
    clearFilter() {
      // hide clear filter btn
      this.clearFilterData = false;
      // make date empty
      this.date = "";
      // make obj empty and pass this obj to event
      this.filterObj = {};
      this.startOfMonth = null;
      // emit event
      EventBus.$emit("dashboard-filter", this.filterObj);
    },

    updateInput(val) {
      let field = this.dialogData.inputs.findIndex(
        (item) => item.label === val[0].label
      );
      if (field != -1) {
        this.dialogData.inputs[field].model = val[1];
      }
    },
    updateValue(value, input) {
      console.log(value, input);
    },
  },
};
</script>
<style scoped>
.w-100 {
  width: 100% !important;
}
:deep .v-text-field--outlined fieldset {
  color: var(--v-dashboardBlockBorderColor-base) !important;
}
.custom-data-width {
  width: 160px;
}
.create-btn {
  background-color: rgba(53, 16, 167, 0.05) !important;
  border-radius: 8px;
  min-height: 38px;
  min-width: 145.25px;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: var(--v-primary-base);
  text-transform: capitalize;
  box-shadow: none;
  margin-left: 10px;
  font-family: "inter";
}

.create-btn-mobile {
  background-color: rgba(53, 16, 167, 0.05) !important;
  border-radius: 8px;
  min-height: 38px;
  min-width: 145.25px;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: var(--v-primary-base);
  text-transform: capitalize;
  box-shadow: none;
  margin-left: 10px;
}
:deep .custom-border-color .v-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--v-dateTextColor-base) !important;
}
</style>
