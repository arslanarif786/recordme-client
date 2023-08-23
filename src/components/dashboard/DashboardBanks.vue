<template>
  <div class="ml-4">
    <div v-if="banks.rows.length > 0">
      <span class="fw-600 fs-18 f-inter ml-2"> Banks </span>

      <div class="bank-main mt-3">
        <div v-for="(bank, index) in banks.rows" :key="index">
          <div
            v-if="bank.rowType != 'SummaryRow'"
            class="bank-card pa-4 dashboardBlockColor custom-dashboard-border"
          >
            <div class="d-flex justify-space-between">
              <div>
                <div class="fw-400 fs-14 f-inter">Closing balance</div>
                <div class="fs-22 fw-600">
                  {{ closingBalance[index].value }}
                </div>
              </div>

              <div class="bank-chip d-flex">
                <img src="../../assets/dashboard/bank.svg" alt="" />
                <span class="fw-500 fs-10 f-inter ml-1 ellipsis-text">
                  {{ bank?.cells[0]?.value }}</span
                >
              </div>
            </div>
            <div class="d-flex justify-space-between">
              <div class="d-flex flex-column fs-12 fw-500 f-inter">
                <span> Opening balance </span>
                <span class="fs-12 fw-700">{{ bank?.cells[1]?.value }}</span>
              </div>
              <div class="bank-chip d-flex" v-if="reconciles[index].data">
                <!-- <img src="../../assets/dashboard/bank.svg" alt="" /> -->
                <span class="fw-500 fs-10 f-inter ml-1 ellipsis-text">
                  Reconcile</span
                >
              </div>
            </div>
          </div>
          <!-- <div v-else>
            <div class="bank-main mt-3">
              <div
                class="bank-card pa-4 d-flex justify-center align-center dashboardBlockColor custom-dashboard-border"
              >
                <div class="fw-600 fs-14 f-inter textPrimary--text">
                  No banks
                </div>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import ApiService from "../../services/Api";
export default {
  props: {
    toDate: {
      default: "",
    },
  },
  data() {
    return {
      banks: [],
      closingBalance: [],
      reconciles: [],
    };
  },
  computed: {
    ...mapGetters({
      currentWorkspace: "auth/getCurrentWorkspace",
      user: "auth/getUser",
    }),
    currentDate() {
      const date = new Date(); // get the current date and time
      const formattedDate = moment(date).format("YYYY-MM-DD");
      return formattedDate;
    },
  },
  mounted() {
    this.getOpningBalance();
  },
  methods: {
    getOpningBalance() {
      let dateUrl = `?from=${
        this.toDate == "" ? this.currentDate : this.toDate
      }&to=${this.currentDate}`;
      ApiService.GetRequest(
        `xero/bank-summary/${this.currentWorkspace.workspaceId}${
          this.toDate == "" ? "" : dateUrl
        }`
      )
        .then((res) => {
          this.banks = res.data.reports[0].rows[1];
        })
        .catch((err) => {
          console.log(err);
        });
      this.getClosingBalance();
    },
    getClosingBalance() {
      ApiService.GetRequest(
        `xero/bank-summary/${this.currentWorkspace.workspaceId}?from=${this.currentDate}&to=${this.currentDate}`
      )
        .then((res) => {
          let closingBalance = res.data.reports[0].rows[1].rows;
          let values = [];
          let rows = [];
          let balance = [];
          let accounts = [];
          let bankAccounts = [];
          let attributes = [];
          let accountIds = [];
          closingBalance.map((val) => {
            values.push(val);
          });
          // console.log(values, "vallll");
          values.map((bal) => {
            rows.push(bal.cells);
          });
          rows.map((bal) => {
            // console.log(bal, "balllll");
            balance.push(bal[1]);
            accounts.push(bal[0]);
          });
          rows.map((accounts) => {
            // console.log(bal, "balllll");

            bankAccounts.push(accounts[0]);
          });
          bankAccounts.map((attr) => {
            attributes.push(attr.attributes);
          });
          attributes.map((val) => {
            accountIds.push(val);
          });

          accountIds = accountIds.filter((item) => item !== undefined);
          console.log(accountIds, "accounts arr");
          accountIds.forEach((item) => {
            console.log(item[0].value);
            let ids = item[0].value;
            ApiService.GetRequest(
              `/xero/unreconciled-transactions/${this.currentWorkspace.workspaceId}?accountID=${ids}`
            ).then((res) => {
              let data = res.data.unreconcile;
              console.log(res.data.unreconcile);
              this.reconciles.push({
                id: ids,
                data: data,
              });
            });
          });
          console.log(this.reconciles);
          this.closingBalance = balance;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.bank-main {
  max-height: 395px;
  overflow-y: auto;
}
.bank-card {
  height: 117px !important;
  width: 90%;
  border: 1px solid var(--v-inputBackground-base);
  background: var(--v-inputBackground-base);
  border-radius: 6.28px;
  margin-bottom: 7px;
}

.bank-chip {
  height: 32px;
  width: 112px;
  margin-top: 8px;
  background: var(--v-lightBackground-base);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}
.ellipsis-text {
  margin: 0px;
  white-space: nowrap !important;
  width: 60px;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
.custom-dashboard-border {
  border: 1px solid var(--v-dashboardBlockBorderColor-base) !important;
}
</style>
