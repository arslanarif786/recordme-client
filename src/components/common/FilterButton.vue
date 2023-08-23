<template>
  <v-menu
    offset-y
    class="filter-btn-menu"
    :close-on-click="hideOnClick"
    :close-on-content-click="hideOnClick"
  >
    <!-- textfield to search start -->

    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        class="btn btn-primary primary--text text-capitalize"
        color="lightBackground"
        depressed
        ><span class="material-icons"> tune </span>
      </v-btn>
    </template>
    <!-- textfield to search end -->

    <!-- menu items list after click on search start here -->

    <v-list class="pa-0">
      <v-list-item class="ma-0">
        <v-list-item-content class="pa-0">
          <v-row justify="space-between" class="mt-1">
            <v-col md="6" sm="6" cols="6">
              <p class="fs-18 fw-500">Filters</p>
            </v-col>
            <v-col md="6" sm="6" cols="6" align="right">
              <p class="fs-14 fw-700">
                <span
                  class="material-icons cursor-pointer custom-close-icon"
                  @click="hideOnClick = true"
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
            @click="hideOnClick = false"
          ></FormInput>
        </v-col>

        <v-col cols="12">
          <v-menu
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
            v-model="datePickerModal"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-for="(input, index) in inputList"
                :key="index"
                :label="input.label"
                :placeholder="input.placeholder"
                filled
                background-color="inputBackground"
                flat
                autocomplete="off"
                persistent-placeholder
                hide-details
                class="text-no-wrap rounded-md"
                :class="input.class"
                readonly
                v-bind="attrs"
                v-on="on"
                v-model="input.model"
                @change="setDate($event)"
                @update-value="(n) => (input.model = n)"
                @click="hideOnClick = false"
              ></v-text-field>
            </template>
            <v-date-picker v-model="dates" range no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="datePickerModal = false">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="setDate()"> OK </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>

        <v-col
          cols="12"
          md="12"
          class="d-flex justify-space-between mt-0 pt-0 mb-0 pb-0"
        >
          <p class="fs-14 fw-600 pl-4 pt-2 pb-0 mb-0">Select Status Type</p>

          <p
            class="fs-10 fw-600 primary--text pr-5 pb-0 pt-2 mb-0 cursor-pointer f-inter"
          >
            <span
              v-if="!statusCheckboxClear"
              @click="selectAllCheckboxes(inputFilterStatusCheckbox)"
              >Select All</span
            >
            <span v-else @click="clearCheckboxes('status')">Unselect All</span>
          </p>
        </v-col>

        <div class="row ml-5 mr-5 mb-0">
          <v-col
            v-for="(input, index) in inputFilterStatusCheckbox"
            :key="index"
            cols="4"
            class="mb-0 pb-0 pt-0"
          >
            <v-checkbox
              @click="hideOnClick = false"
              color="#6634e9"
              :value="input.label"
              :aria-checked="input.value ? true : false"
              hide-details
              :ripple="false"
              class="custom-filters-checkbox mt-0 pt-0 mb-0 pb-0"
              :v-model="input.model"
            >
              <template v-slot:label>
                <p class="fs-10 fw-400 pt-4 text-capitalize">
                  {{ input.label }}
                </p>
              </template>
            </v-checkbox>
          </v-col>
        </div>

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
        <div class="row ml-5 mr-5 mb-0">
          <v-col
            v-for="(input, index2) in inputFilterRequestTypeCheckbox"
            :key="`${index2}-2`"
            cols="4"
            class="mb-0 pb-0 pt-0"
          >
            <v-checkbox
              @click="hideOnClick = false"
              color="#4822b9"
              :value="input.label"
              :aria-checked="input.value ? true : false"
              hide-details
              :ripple="false"
              class="custom-filters-checkbox mt-0 pt-0 mb-0 pb-0"
              :v-model="input.model"
            >
              <template v-slot:label>
                <p class="fs-10 fw-400 pt-4 text-capitalize">
                  {{ input.label }}
                </p>
              </template>
            </v-checkbox>
          </v-col>
        </div>

        <v-col cols="12" md="12" class="mt-0 pt-3 pr-7 mb-0 pb-0" align="right">
          <!-- <v-btn
            class="btn-primary secondary--text text-capitalize clear-btn mr-3"
            color="#FFFFFF"
            depressed
            width="108"
            height="38"
            @click="clearFilter()"
            ><span class="fw-600 fs-13">Clear Filter </span></v-btn
          > -->
          <v-btn
            class="btn-primary primary--text text-capitalize connect-btn mb-3"
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
import FormInput from "../common/FormInput.vue";
import axios from "axios";
import UrlServices from "@/services/Url";
import { mapGetters } from "vuex";

export default {
  name: "HeaderSearchBar",
  // watch:{
  //   isOpened: function(){
  //     this.hideOnClick ? this.hideOnClick=false : this.hideOnClick=true;
  //   }
  // },
  components: { FormInput },
  data: () => ({
    datePickerModal: false,
    hideOnClick: false,
    searchValue: null,
    // isOpened: false,
    dateRangeText: "",
    dates: [],
    messageInput: [
      {
        name: "message",
        label: "Description ",
        placeholder: "Search From Description",
        type: "text",
        cols: 12,
        col_md: 12,
        model: "",
        value: null,
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
        class: "ml-3 mr-3 pt-0 mb-0 pb-0",
        model: "",
        value: null,
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
        col_md: 6,
        value: false,
        class: "pl-7 pr-7 pt-0 mb-0 pb-0 mt-0",
        model: null,
      },
      {
        name: "in_progress",
        label: "InProgress",
        placeholder: "",
        type: "checkbox",
        cols: 12,
        col_md: 6,
        value: false,
        class: "pl-7 pr-7 pt-0 mb-0 pb-0 mt-0",
        model: null,
      },
      {
        name: "completed",
        label: "Complete",
        placeholder: "",
        type: "checkbox",
        cols: 12,
        col_md: 6,
        value: false,
        class: "pl-7 pr-7 pt-0 mb-0 pb-0 mt-0",
        model: null,
      },
      {
        name: "awaiting_response",
        label: "AwaitingResponse",
        placeholder: "",
        type: "checkbox",
        cols: 12,
        col_md: 6,
        value: false,
        class: "pl-7 pr-7 pt-0 mb-0 pb-0 mt-0",
        model: null,
      },
      {
        name: "review_request",
        label: "ReviewRequest",
        placeholder: "",
        type: "checkbox",
        cols: 12,
        col_md: 6,
        value: false,
        class: "pl-7 pr-7 pt-0 mb-0 pb-0 mt-0",
        model: null,
      },

      // {
      //   name: "client_responded",
      //   label: "ClientResponded",
      //   placeholder: "",
      //   type: "checkbox",
      //   cols: 12,
      //   col_md: 6,
      //   value: false,
      //   class: "pl-7 pr-7 pt-0 mb-0 pb-0 mt-0",
      //   model: null,
      // },
    ],
    inputFilterRequestTypeCheckboxValues: [],
    inputFilterRequestTypeCheckbox: [
      {
        name: "bank_transaction",
        label: "bank transaction",
        placeholder: "",
        type: "checkbox",
        cols: 12,
        col_md: 6,
        value: false,
        class: "pl-7 pr-7 pt-0 mb-0 pb-0 mt-0",
        model: null,
      },
      {
        name: "bills",
        label: "bill",
        placeholder: "",
        type: "checkbox",
        cols: 12,
        col_md: 6,
        value: false,
        class: "pl-7 pr-7 pt-0 mb-0 pb-0 mt-0",
        model: null,
      },
      {
        name: "invoices",
        label: "invoice",
        placeholder: "",
        type: "checkbox",
        cols: 12,
        col_md: 6,
        value: false,
        class: "pl-7 pr-7 pt-0 mb-0 pb-0 mt-0",
        model: null,
      },
      {
        name: "expenses_claims",
        label: "expenses claim",
        placeholder: "",
        type: "checkbox",
        cols: 12,
        col_md: 6,
        value: false,
        class: "pl-7 pr-7 pt-0 mb-0 pb-0 mt-0",
        model: null,
      },
      {
        name: "quotations",
        label: "quotations",
        placeholder: "",
        type: "checkbox",
        cols: 12,
        col_md: 6,
        value: false,
        class: "pl-7 pr-7 pt-0 mb-0 pb-0 mt-0",
        model: null,
      },

      {
        name: "payroll_data",
        label: "payroll data",
        placeholder: "",
        type: "checkbox",
        cols: 12,
        col_md: 6,
        value: false,
        class: "pl-7 pr-7 pt-0 mb-0 pb-0 mt-0",
        model: null,
      },
    ],
    statusCheckboxClear: false,
    requestCheckboxClear: false,
  }),

  mounted() {
    this.clearFilterOnMount();
    // this.clearAllValues()
    // this.getRequestTypes();
    // var thiss = this;
    // EventBus.$on("search-filter", function () {
    //   alert();
    // });
  },

  computed: {
    ...mapGetters({
      currentWorkspace: "auth/getCurrentWorkspace",
    }),
  },

  methods: {
    clearFilterOnMount() {
      const obj = {
        dateRange: "",
        messageFilter: "",
        searchStatus: [],
        requestType: [],
      };
      this.$store.commit("ticket/setAdvancedSearch", obj);
    },
    clearAllValues() {
      this.inputFilterStatusCheckboxValues = [];
      this.inputFilterRequestTypeCheckboxValues = [];
    },
    setDate(event) {
      console.log(event);
      this.inputList[0].model = this.dates;
      this.datePickerModal = false;
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
      if (this.$route.path !== "/generate-request")
        this.$router.push({ path: "/generate-request" });
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
    },
  },
};
</script>

<style scoped>
.v-menu__content {
  display: inline-block;

  left: 820px !important;
  min-width: 30% !important;
  width: 30% !important;
  height: 505px !important;
  min-height: 505px !important;
  background-color: #fff !important;
}

:deep(.v-picker__body) {
  border: 1 ps solid rgb(193, 188, 188) !important;
}
.v-btn:not(.v-btn--round).v-size--default {
  height: 41px;
  min-width: 64px;
  padding: 0px 16px;
  border-radius: 7px;
}
</style>
