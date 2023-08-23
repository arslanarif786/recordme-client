<template>
  <v-chip-group active-class="deep-purple--text text--accent-4 mb-0" mandatory>
    <div v-for="(item, index) in filtersDataUpdated" :key="`${index}-2`">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-chip
            v-bind="item.length > 30 ? attrs : ''"
            v-on="item.length > 30 ? on : ''"
            class="px-4 ml-0 fs-12 fw-400 primary--text active v-chip--active"
            v-if="index < 3"
            >{{ items[item] ? items[item].text : item | truncate(30) }}</v-chip
          >
        </template>
        <span>{{ item }}</span>
      </v-tooltip>
    </div>

    <v-menu offset-y open-on-hover>
      <template v-slot:activator="{ on, attrs }">
        <v-chip
          v-bind="attrs"
          v-on="on"
          v-show="filtersDataUpdated.length > 3"
          class="
            pl-5
            pr-5
            ml-0
            fs-12
            fw-400
            primary--text primary--text
            active
            v-chip--active
          "
          >+ {{ filtersDataUpdated.length - 3 }} More</v-chip
        >
      </template>
      <v-list>
        <div v-for="(item, index) in filtersDataUpdated" :key="index">
          <v-list-item v-if="index > 2">
            <v-list-item-title class="cursor-pointer">{{
              items[item] ? items[item].text : item | truncate(30)
            }}</v-list-item-title>
          </v-list-item>
        </div>
      </v-list>
    </v-menu>
  </v-chip-group>
</template>

<script>
import moment from "moment"
export default {
  name: "ShowFilters",
  props: ["filtersData"],
  data() {
    return {
      items: {
        "Pending": {
          name: "pending",
          label: "Pending",
          placeholder: "",
          type: "checkbox",
          cols: 12,
          col_md: 4,
          value: false,
          class: "pl-7 pr-7 pt-0 mb-0 pb-0 mt-0",
          text: "Pending",
        },
        "InProgress": {
          name: "in_progress",
          label: "InProgress",
          placeholder: "",
          type: "checkbox",
          cols: 12,
          col_md: 4,
          value: false,
          class: "pl-1 pr-7 pt-0 mb-0 pb-0 mt-0",
          text: "In Progress",
        },
        "AwaitingResponse": {
          name: "awaiting_response",
          label: "AwaitingResponse",
          placeholder: "",
          type: "checkbox",
          cols: 12,
          col_md: 4,
          value: false,
          class: "pl-1 pr-7 pt-0 mb-0 pb-0 mt-0",
          text: "Awaiting Response",
        },
        "Complete": {
          name: "completed",
          label: "Complete",
          placeholder: "",
          type: "checkbox",
          cols: 12,
          col_md: 4,
          value: false,
          class: "pl-7 pr-7 pt-0 mb-0 pb-0 mt-0",
          text: "Complete",
        },

        "ReviewRequest": {
          name: "review_request",
          label: "ReviewRequest",
          placeholder: "",
          type: "checkbox",
          cols: 12,
          col_md: 4,
          value: false,
          class: "pl-1 pr-7 pt-0 mb-0 pb-0 mt-0",
          text: "Review Request",
        },

        "ClientResponded": {
          name: "client_responded",
          label: "ClientResponded",
          placeholder: "",
          type: "checkbox",
          cols: 12,
          col_md: 4,
          value: false,
          class: "pl-1 pr-7 pt-0 mb-0 pb-0 mt-0",
          text: "Responded",
        },

        "BILL": {
          name: "bills",
          label: "BILL",
          placeholder: "",
          type: "checkbox",
          cols: 12,
          col_md: 4,
          value: false,
          class: "pl-7 pr-7 pt-0 mb-0 pb-0 mt-0",
          text: "Bill",
        },
        "BANK TRANSACTION": {
          name: "bank_transaction",
          label: "BANK TRANSACTION",
          placeholder: "",
          type: "checkbox",
          cols: 12,
          col_md: 4,
          value: false,
          class: "pl-1 pr-7 pt-0 mb-0 pb-0 mt-0",
          text: "Bank Transaction",
        },
        INVOICE: {
          name: "invoices",
          label: "INVOICE",
          placeholder: "",
          type: "checkbox",
          cols: 12,
          col_md: 4,
          value: false,
          class: "pl-1 pr-7 pt-0 mb-0 pb-0 mt-0",
          text: "Invoice",
        },
        "EXPENCES CLAIM": {
          name: "expenses_claims",
          label: "EXPENCES CLAIM",
          placeholder: "",
          type: "checkbox",
          cols: 12,
          col_md: 4,
          value: false,
          class: "pl-7 pr-7 pt-0 mb-0 pb-0 mt-0",
          text: "Expenses Claim",
        },
        QUOTATIONS: {
          name: "quotations",
          label: "QUOTATIONS",
          placeholder: "",
          type: "checkbox",
          cols: 12,
          col_md: 4,
          value: false,
          class: "pl-1 pr-7 pt-0 mb-0 pb-0 mt-0",
          text: "Quotation",
        },
        "PAYROLL DATA": {
          name: "payroll_data",
          label: "PAYROLL DATA",
          placeholder: "",
          type: "checkbox",
          cols: 12,
          col_md: 4,
          value: false,
          class: "pl-1 pr-7 pt-0 mb-0 pb-0 mt-0",
          text: "Payroll Data",
        },
        PAYMENT: {
          name: "payment",
          label: "PAYMENT",
          placeholder: "",
          type: "checkbox",
          cols: 12,
          col_md: 4,
          value: false,
          class: "pl-7 pr-7 pt-0 mb-0 pb-0 mt-0",
          text: "Payment",
        },
        SALARY: {
          name: "salary",
          label: "SALARY",
          placeholder: "",
          type: "checkbox",
          cols: 12,
          col_md: 4,
          value: false,
          class: "pl-1 pr-7 pt-0 mb-0 pb-0 mt-0",
          text: "Salary",
        },
        VOUCHER: {
          name: "voucher",
          label: "VOUCHER",
          placeholder: "",
          type: "checkbox",
          cols: 12,
          col_md: 4,
          value: false,
          class: "pl-1 pr-7 pt-0 mb-0 pb-0 mt-0",
          text: "Voucher",
        },
        OTHERS: {
          name: "others",
          label: "OTHERS",
          placeholder: "",
          type: "checkbox",
          cols: 12,
          col_md: 4,
          value: false,
          class: "pl-7 pr-7 pt-0 mb-0 pb-0 mt-0",
          text: "Others",
        },
      },
    };
  },
  computed: {
    filtersDataUpdated() {
      return this.filtersData.map(item => {
        if(item.includes('~')){
          return item.split('~').map(item => moment(item).format("DD MMM YYYY")).join(" - ")
        }
        else return item
      })
    
    }
  }
};
</script>
<style scoped>
.v-slide-group__wrapper{
  overflow: auto !important;
}
</style>
