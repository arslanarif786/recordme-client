<template>
  <v-menu
    offset-y
    class=""
    :close-on-click="hideOnClick"
    :close-on-content-click="hideOnClick"
  >
    <!-- textfield to search start -->
    <template v-slot:activator="{ on, attrs }">
      <!-- <template v-slot:activator="{ }"> -->
      <v-text-field
        rounded
        class="header-search-input pl-0 pr-0"
        prepend-icon="search"
        prepend-outer-icon="search"
        v-model="searchValue"
        color="white"
        background-color="appBarButtonBg"
        hide-details=""
        @click="hideOnClick = false"
        @input="debounceInput"
        @keyup.enter="debounceInput"
      >
        <template v-slot:append>
          <p
            v-if="!searchValue"
            class="input-placeholder-text inActiveColor--text ma-0 pa-0 px-4 fs-12 fw-400"
          >
            Search By Ticket No
            <!-- {{ `Search ${currentWorkspace.workspaceName}` | truncate(40) }} -->
          </p>
          <v-img
            id="v-step-4"
            v-bind="attrs"
            v-on="on"
            ref="filterImg"
            @click="hideOnClick = false"
            :src="require('@/assets/filters.svg')"
            class="myicon"
          ></v-img>
        </template>
      </v-text-field>
    </template>
    <!-- textfield to search end -->

    <!-- menu items list after click on search start here -->

    <v-list class="pa-0">
      <v-list-item class="ma-0">
        <v-list-item-content class="pa-0">
          <v-row justify="space-between" class="mt-1">
            <v-col md="6" sm="6" cols="6">
              <p class="fs-18 fw-600">Filters</p>
            </v-col>
            <v-col md="6" sm="6" cols="6" align="right">
              <p class="fs-14 fw-700">
                <span
                  class="material-icons cursor-pointer custom-close-icon"
                  @click="(hideOnClick = true), clearFields()"
                >
                  close
                </span>
              </p>
            </v-col>
          </v-row>
        </v-list-item-content>
      </v-list-item>
      <v-divider dark color="#E7E8F4"></v-divider>
      <v-row>
        <v-col cols="12" md="12" class="mt-3 pb-0 mb-0">
          <FormInput
            ref="textField1"
            :input="input"
            v-for="input in messageInput"
            :key="`${input}-message`"
            @update-value="(n) => (input.model = n)"
            @on-enter="advancedSearch()"
          ></FormInput>
        </v-col>

        <FormInput
          :input="input"
          v-for="(input, index) in inputList"
          :key="index"
          @update-date="setDate($event, value)"
        ></FormInput>

        <v-col
          cols="12"
          md="12"
          class="d-flex justify-space-between mt-0 pt-0 mb-0 pb-0"
        >
          <p class="fs-14 fw-600 pl-4 pt-2 pb-0 mb-0">Select Status Type</p>
          <p
            class="fs-10 fw-600 primary--text pr-5 pb-0 pt-2 mb-0 cursor-pointer f-avenir"
          >
            <span
              v-if="!statusCheckboxClear"
              @click="selectAllCheckboxes(inputFilterStatusCheckbox)"
              >Select All</span
            >
            <span v-else @click="clearCheckboxes('status')">Unselect All</span>
          </p>
        </v-col>

        <FormInput
          v-for="(input, index2) in inputFilterStatusCheckbox"
          :input="input"
          :key="`${index2}-2`"
          :selectedCheckboxes="inputFilterStatusCheckboxValues"
          @updateInput="updateInput($event, value)"
        ></FormInput>

        <v-col cols="12" md="12" class="d-flex justify-space-between">
          <p class="fs-14 fw-600 pl-4 pt-2 pb-0 mb-0">
            Select Generate Request Type
          </p>
          <p
            class="fs-10 fw-600 primary--text pr-5 pb-0 pt-2 mb-0 cursor-pointer f-avenir"
          >
            <span
              v-if="!requestCheckboxClear"
              @click="
                selectAllRequestCheckboxes(inputFilterRequestTypeCheckbox)
              "
              >Select All</span
            >
            <span v-else @click="clearCheckboxes('request')">Unselect All</span>
          </p>
        </v-col>

        <FormInput
          :input="input"
          v-for="(input, index3) in inputFilterRequestTypeCheckbox"
          :key="`${index3}-3`"
          :selected-checkboxes="inputFilterRequestTypeCheckboxValues"
          @updateInput="updateRequest($event, value)"
        ></FormInput>

        <v-col cols="12" md="12" class="mt-0 pt-3 pr-7" align="right">
          <v-btn
            class="btn-primary primary--text text-capitalize connect-btn"
            color="lightBackground"
            depressed
            width="108"
            height="38"
            @click="advancedSearch(), (hideOnClick = true)"
            ><span class="fw-600 fs-13">Apply Filter </span></v-btn
          >
        </v-col>
      </v-row>
    </v-list>
    <!-- menu items list after click on search end here -->
  </v-menu>
</template>

<script>
import FormInput from "../../common/FormInput.vue";
import { mapGetters } from "vuex";
import EventBus from "../../../js/EventBus";
import moment from "moment";
import { debounce } from "debounce";

export default {
  name: "HeaderSearchBar",
  components: { FormInput },
  data: () => ({
    hideOnClick: false,
    searchValue: null,
    dateRangeText: "",
    dates: "",
    messageInput: [
      {
        name: "message",
        label: "Description",
        placeholder: "Search From Description",
        type: "text",
        cols: 12,
        col_md: 12,
        model: "",
      },
    ],

    /**
     * Desc:This is dynamic list to show inputs of dates in filters
     * showIcon:this prop is use to show eye icon of password field
     *  * cols: This prop is used to make column of row dynamic
     * col_md: what should be the column in a row when page is open on medium screen
     */
    inputList: [
      {
        name: "date_range",
        label: "Date Range",
        placeholder: "Select Date",
        type: "date",
        range: "range",
        cols: 12,
        col_md: 12,
        class: "pl-7 pr-7 pt-0 mb-0 pb-0",
        model: "",
        showDateFormat: "",
      },
    ],
    /**
     * Desc:This is dynamic list to show inputs of status checkboxes
     */
    inputFilterStatusCheckboxValues: [],
    inputFilterStatusCheckbox: [
      {
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
      {
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
      {
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
      {
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

      {
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

      // {
      //   name: "client_responded",
      //   label: "ClientResponded",
      //   placeholder: "",
      //   type: "checkbox",
      //   cols: 12,
      //   col_md: 4,
      //   value: false,
      //   class: "pl-1 pr-7 pt-0 mb-0 pb-0 mt-0",
      //   text : "Responded"
      // },
      {
        name: "audit",
        label: "Audit",
        placeholder: "",
        type: "checkbox",
        cols: 12,
        col_md: 4,
        value: false,
        class: "pl-1 pr-7 pt-0 mb-0 pb-0 mt-0",
        text: "Audit",
      },
      {
        name: "rejected",
        label: "Rejected",
        placeholder: "",
        type: "checkbox",
        cols: 12,
        col_md: 4,
        value: false,
        class: "pl-7 pr-7 pt-0 mb-0 pb-0 mt-0",
        text: "Rejected",
      },
    ],
    inputFilterRequestTypeCheckboxValues: [],
    inputFilterRequestTypeCheckbox: [
      {
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
      {
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
      {
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
      {
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
      {
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
      {
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
      {
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
      {
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
      {
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
      {
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
    ],
    statusCheckboxClear: false,
    requestCheckboxClear: false,
  }),

  mounted() {
    this.clearFilterOnMount();
  },

  computed: {
    ...mapGetters({
      currentWorkspace: "auth/getCurrentWorkspace",
    }),
  },

  methods: {
    debounceInput: debounce(function (e) {
      if (e.length >= 3 || !e || !e.keyCode == 13) {
        this.$store.commit("ticket/setSearch", this.searchValue);
        if (this.$route.path !== "/requests-history")
          this.$router.push({ path: "/requests-history" });
        else EventBus.$emit("global-search");
      }
      if (e.keyCode == 13) {
        if (this.searchValue.length == 1 || this.searchValue.length == 2) {
          this.$store.commit("ticket/setSearch", this.searchValue);
          if (this.$route.path !== "/requests-history")
            this.$router.push({ path: "/requests-history" });
          else EventBus.$emit("global-search");
        }
      }
    }, 400),
    clearFilterOnMount() {
      const obj = {
        dateRange: "",
        messageFilter: "",
        searchStatus: [],
        requestType: [],
      };
      this.$store.commit("ticket/setSearch", "");
      this.$store.commit("ticket/setAdvancedSearch", obj);
    },
    clearAllValues() {
      this.inputFilterStatusCheckboxValues = [];
      this.inputFilterRequestTypeCheckboxValues = [];
    },
    setDate(val) {
      this.inputList[0].model = val;
      let updatedArr = val
        .split("~")
        .map((item) => moment(item).format("DD MMM YYYY"));
      this.inputList[0].showDateFormat = updatedArr.join(" - ");
    },

    selectAllCheckboxes(array) {
      this.inputFilterStatusCheckboxValues = array.map((ele) => {
        ele.value = true;
        return ele.label;
      });
      this.statusCheckboxClear = true;
    },

    selectAllRequestCheckboxes(array) {
      this.inputFilterRequestTypeCheckboxValues = array.map((ele) => {
        ele.value = true;
        return ele.label;
      });
      this.requestCheckboxClear = true;
    },

    selectedBoxes(array) {
      var res = false;
      array.map((ele) => {
        ele.value == true ? (res = true) : "";
      });
      return res;
    },

    clearFields() {
      this.$refs.textField1[0].resetTextFieldModel();
      this.inputList[0].model = "";
      this.inputList[0].showDateFormat = "";
      this.inputFilterStatusCheckboxValues = [];
      this.inputFilterRequestTypeCheckboxValues = [];
    },

    clearCheckboxes(array) {
      if (array == "status") {
        this.inputFilterStatusCheckboxValues = [];
        this.statusCheckboxClear = false;
      } else {
        this.inputFilterRequestTypeCheckboxValues = [];
        this.requestCheckboxClear = false;
      }
    },

    clearFilter() {
      this.$refs.textField1[0].resetTextFieldModel();
      this.inputList[0].model = "";
      this.inputList[0].showDateFormat = "";
      this.inputFilterStatusCheckboxValues = [];
      this.inputFilterRequestTypeCheckboxValues = [];
      this.advancedSearch();
    },

    updateInput(val) {
      let index = this.inputFilterStatusCheckboxValues.findIndex(
        (item) => item === val
      );
      if (index == -1) this.inputFilterStatusCheckboxValues.push(val);
      else this.inputFilterStatusCheckboxValues.splice(index, 1);
    },

    updateRequest(val) {
      let index = this.inputFilterRequestTypeCheckboxValues.findIndex(
        (item) => item === val
      );
      if (index == -1) this.inputFilterRequestTypeCheckboxValues.push(val);
      else this.inputFilterRequestTypeCheckboxValues.splice(index, 1);
    },

    advancedSearch() {
      this.setPayload(
        this.inputList[0].model,
        this.messageInput[0].model,
        this.inputFilterStatusCheckboxValues,
        this.inputFilterRequestTypeCheckboxValues
      );
      if (this.$route.path !== "/requests-history") {
        this.$router.push({ path: "/requests-history" });
      }
    },
    setPayload(
      inputList,
      messageInput,
      inputFilterStatusCheckboxValues,
      inputFilterRequestTypeCheckboxValues
    ) {
      const obj = {
        dateRange: inputList,
        messageFilter: messageInput,
        searchStatus: inputFilterStatusCheckboxValues,
        requestType: inputFilterRequestTypeCheckboxValues,
      };
      this.$store.commit("ticket/setAdvancedSearch", obj);
      EventBus.$emit("advance-search");
      setTimeout(() => {
        EventBus.$emit("advance-search-filters-data", obj);
      }, 100);
    },
  },
};
</script>
<style scoped>
.v-menu__content {
  top: 45px !important;
}
.header-search-input {
  position: relative;
  right: 8px;
  top: 8px;
  width: 340px !important;
  min-width: 340px !important;
}
::v-deep .v-text-field__slot {
  padding-left: 14px !important;
}

::v-deep .v-input__icon--prepend .v-icon {
  position: relative;
  z-index: 1000;
  font-size: 16px;
  color: white;
  left: 45px !important;
}
.input-placeholder-text {
  position: absolute;
  left: 25px;
  top: 11px;
}

.v-menu__content {
  display: inline-block;
  z-index: 10 !important;
  left: 730px !important;
  min-width: 34.5% !important;
  width: 34.5% !important;
  height: 560px !important;
  min-height: 560px !important;
  background-color: #fff !important;
}
:deep(.v-input--selection-controls .v-input__slot > .v-label) {
  height: 30px !important;
}
:deep(.v-input--selection-controls) {
  padding-top: 0px !important;
  margin-top: 0px !important;
}
.clear-btn {
  border: 1px solid #e8ebf4 !important;
  border-radius: 8px !important;
}
.connect-btn {
  border-radius: 8px !important;
}

:deep(.v-input__icon--append .v-icon) {
  color: #fff !important;
  cursor: pointer;
  position: relative;
  left: 80% !important;
}

.myicon {
  cursor: pointer !important;
  left: 10px !important;
  top: 2px !important;
}
.cross-icon {
  border: 1px solid #e5e1e1;
  border-radius: 5px;
  font-size: 18px !important;
}
</style>
