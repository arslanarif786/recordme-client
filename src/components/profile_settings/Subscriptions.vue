<template>
  <div>
    <!-- Main profile -->
    <v-card flat class="profile-card mt-3">
      <v-card-title class="d-flex justify-space-between pt-30">
        <p class="fs-23 fw-500 f-avenir" align="left">Subscription & Billing Information</p>
        <v-btn outlined
          class="text-capitalize cancel-subscription fw-500 fs-13 f-avenir mr-4">Cancel Subscription</v-btn>
      </v-card-title>
      <v-row class="ma-2 ml-5 pa-0">
        <v-col
          v-for="(item, index) in personalInfo"
          :key="index"
          class="ma-0 pa-0"
          :cols="$vuetify.breakpoint.lg ? 6 : 12"
        >
          <div class="d-flex justify-space-around">
            <v-col md="4" class="ma-0 pa-0">
              <p class="fs-15 fw-400 f-avenir textPrimary--text">
                {{ item.name }}:
              </p>
            </v-col>
            <v-col md="8" class="ma-0 pa-0">
              <p class="fs-15 fw-600 sun f-avenir textPrimary--text" :class=" item.value == 'Active' ? 'subscription-status': item.value =='Premium' ? 'subscription-plan':'' ">
                {{ item.value }}
              </p>
            </v-col>
          </div>
        </v-col>
      </v-row>
    </v-card>
    <!-- transactions -->
    <v-card flat class="bg-none mt-7">
      <v-row class="ma-2 pa-0">
        <div class="col-12 listing pl-0 pr-0">
          <div class="header pa-30 pt-0 pb-0">Billing History</div>
          <v-data-table
            :headers="headers"
            :items="employees"
            :hide-default-footer="true"
            :loading="loader"
            fixed-header
            height="300px"
            :itemsPerPage="pageItems"
            class="pa-30 pt-0"
          >
            <template v-slot:[`item.name`]="{ item }">
              <!-- <span v-if="item.firstName" class="fs-13 fw-600 f-avenir textPrimary--text"
                >{{ item.firstName }} {{ item.lastName }}</span
              > -->
              <span class="fs-13 fw-600 f-avenir textPrimary--text"
                >{{ item.name }}</span
              >
            </template>
            <template v-slot:[`item.email`]="{ item }">
              <span class="fs-13 fw-400 f-avenir textPrimary--text">{{
                item.email
              }}</span>
            </template>
            <template v-slot:[`item.createdAt`]="{ item }">
              <span class="fs-13 fw-400 f-avenir textPrimary--text">
                {{ item.createdAt | formatDate }}
                -
                {{ item.createdAt | formatTime }}</span
              >
            </template>
            <template v-slot:[`item.status`]="{ item }">
              <v-chip
                class="fs-13 fw-400 f-avenir"
                :class="
                  item.status == 'Active' ? 'successColor--text' : 'errorColor--text'
                "
              >
                <v-img
                  style="width: 13px; height: 13px"
                  class="mr-2"
                  :src="
                    item.status == 'Active'
                      ? require('@/assets/dashboard/complete.svg')
                      : require('@/assets/dashboard/inactive.svg')
                  "
                />
                {{ item.status }}
              </v-chip>
            </template>
            <template v-slot:[`item.action`]="{ item }">
              <v-btn
                icon
                :color="item.status == 'Active' ? 'primary' : 'inActiveColor'"
                @click="blockOrUnblockEmployee(item)"
                :ripple="false"
              >
                <v-icon :ripple="false">{{
                  item.status == "Active"
                    ? "mdi-toggle-switch"
                    : "mdi-toggle-switch-off"
                }}</v-icon>
              </v-btn>
            </template>
          </v-data-table>
          <pagination
            :itemsPerPage="pageItems"
            :page="paginate.page"
            :pageCount="paginate.lastPage"
            :totalCount="paginate.total"
            @next-page-change="fetchEmployees($event)"
            @prev-page-change="fetchEmployees($event)"
            @page-number-changed="fetchEmployees($event)"
            @items-per-page-change="fetchEmployees($event)"
          ></pagination>
        </div>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import FormInput from "../common/FormInput.vue";
import { mapGetters } from "vuex";
import pagination from "../../components/common/Pagination.vue";
import EventBus from "../../js/EventBus";

export default {
  components: { FormInput,pagination },
  data() {
    return {
      loader: false,
      status: false,
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Email", value: "email", sortable: false },
        { text: "Created At", value: "createdAt", sortable: false },
        { text: "Status", value: "status", sortable: false },
        { text: "Action", value: "action", sortable: false },
      ],
      personalInfo: [
        {
          name: "Subscription Plan",
          value: "Premium",
        },
        {
          name: "Subscription date",
          value: "30 October 2022",
        },
        {
          name: "Credit Card",
          value: "**** 2356",
        },
        {
          name: "Card Expiry",
          value: "03/27",
        },
        {
          name: "Next Billing Date",
          value: "30 November 2022",
        },
        {
          name: "Status",
          value: "Active",
        },
      ]
    };
  },
  mounted() {
    this.fetchEmployees();
    EventBus.$on("get-employees", () => {
      this.$store.dispatch('user/fetchEmployees')
    });
  },
  beforeDestroy() {
    EventBus.$off("get-employees")
  },
  computed: {
    ...mapGetters({
      employees: "user/getEmployees",
      paginate: "ticket/getPaginate",
      pageItems: "ticket/getPageItems",
    }),
  },
  methods: {
    // method to fetch employees
    fetchEmployees(pgNo) {
      if(pgNo === undefined || pgNo === null) pgNo = 1
      this.loader = true;
      this.$store
        .dispatch("user/fetchEmployees",pgNo)
        .then((res) => {
           console.log(res.data.count, pgNo, this.pageItems)
          this.$store.commit("ticket/setPageItems", this.pageItems)
          this.$store.commit("ticket/setPaginate", {
              itemsPerPage: this.pageItems,
              page: pgNo,
              lastPage: res.data.count < 10 ? 1 : Math.ceil(res.data.count / 10),
              total: res.data.count,
            });
          this.$store.commit("user/fetchEmployees",res.data.users)
          this.loader = false;
        })
        .catch(() => {
          this.loader = false;
        });
    },
    // Method to dispatch action which will activate/ in-activate employee
    blockOrUnblockEmployee(emp) {
      this.$store
        .dispatch("user/changeStatus", {
          id: emp._id,
          status:
            emp.status == "Active"
              ? "InActive"
              : emp.status == "InActive"
              ? "Active"
              : "",
        })
        .then(() => {
          this.$showNotificationBar("success", "User updated successfully");
        });
    },
  },
};
</script>

<style scoped>
.profile-card {
  background-color: var(--v-inputBackground-base) !important;
  border-radius: 5px;
}
.cancel-subscription {
  height: 31.04px;
  border: 1px solid var(--v-CancelRed-base) !important;
  border-radius: 6px;
  color: var(--v-CancelRed-base) !important;
}
.pass-dialog {
  border-radius: 7px !important;
  background-color: var(--v-whiteColor-base) !important;
  height: 458px !important;
}
:deep .v-btn--is-elevated {
  box-shadow: 0px 0px 0px 0px rgb(0 0 0 / 0%), 0px 2px 2px 0px rgb(0 0 0 / 0%),
    0px 1px 5px 0px rgb(0 0 0 / 0%) !important;
}
.pass-btn {
  border-radius: 10px !important;
  width: 299px !important;
  height: 46px !important;
  text-transform: none !important;
}
.otp-input >>> .v-text-field__slot {
  background: var(--v-buttonBg-base) !important;
  border: 0.3px solid var(--v-primary-base) !important;
  border-radius: 6px !important;
}
:deep .v-input__slot {
  margin-bottom: 0 !important;
}
.default-selection-dropdown .v-select__slot label {
  z-index: 1;
}
.default-selection-dropdown .v-select__selections {
  padding-top: 5px !important;
}
.default-selection-dropdown .v-text-field__slot {
  margin-top: 10px;
}

/* when edit personal info then disabled btn css  */
.theme--light.v-btn.v-btn--disabled.v-btn--has-bg{
  background-color: #f5f2fd !important;
  color: var(--v-primary-base) !important;
}

.subscription-plan {
  color: var(--v-primary-base) !important;
}
.subscription-status{
  color: var(--v-successColor-base) !important;
}

.listing {
  border: 1px solid #E8EBF4 !important;
  border-radius: 5px !important;
}
</style>
