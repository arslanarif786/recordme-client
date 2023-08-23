<template>
  <v-container
    class="rounded-lg custom-padding"
    style="max-height: 80vh; overflow-y: scroll !important"
  >
    <!-- Invoices Details -->
    <!-- Invoices get from draft -->
    <div v-if="editableForm">
      <div v-for="(invoiceItem, index) in dataDraft?.invoices" :key="index">
        <v-row class="ma-0 pa-0 rounded-lg" :class="index > 0 ? 'mt-8' : ''">
          <!-- Form Header Fields -->
          <v-col
            class="ma-0 pa-0 d-flex align-stretch"
            cols="3"
            v-for="(item, index) in headerData"
            :key="index"
          >
            <v-row class="ma-1 pa-1">
              <v-text-field
                :type="item.type"
                :label="item.label"
                :placeholder="item.placeholder"
                class="text-no-wrap custom rounded-md fs-12 f-inter fw-400"
                background-color="inputBackground"
                filled
                hide-details
                persistent-placeholder
                :disabled="
                  item.disabled
                    ? true
                    : globalDisableFieldsValue
                    ? true
                    : !currentWorkspace.rewriteInvoice
                    ? true
                    : false
                "
                v-model="invoiceItem[item.model]"
              ></v-text-field>
            </v-row>
          </v-col>
        </v-row>

        <!-- Billing Details -->
        <div class="d-flex justify-space-between align-center mt-5">
          <div class="ma-0 pa-0 rounded-lg">
            <span class="fs-16 f-inter fw-600 pl-2 textPrimary--text"
              >Billing Details</span
            >
          </div>
          <div class="ma-0 pa-0 mr-2 rounded-lg">
            <v-select
              :items="lineItems"
              :disabled="
                user.role != 'client' || !currentWorkspace.rewriteInvoice
              "
              label="Columns"
              class="col-width"
              attach
              multiple
              outlined
              solo
              dense
              flat
              chips
              return-object
              @input="addAndRemoveLineItems($event, index, invoiceItem)"
            >
              <!-- item-text="name" -->
              <!-- :value="product[item.key]" -->
              <template #item="{ item }">
                <span
                  class="fs-12 font-style-paragraph mainTextColor--text ma-0 pa-0"
                >
                  {{ item.text }}</span
                >
              </template>
              <template #selection="{ item }">
                <span
                  class="fs-12 font-style-paragraph mainTextColor--text ma-0 pa-0"
                >
                  {{ item.text }}
                </span>
              </template>
            </v-select>
          </div>
        </div>

        <!-- Billing Details Header -->
        <div class="pb-3 overflow-x-auto">
          <v-row class="ma-0 pa-0 pt-2 mb-1 d-flex flex-nowrap">
            <v-col
              v-for="(item, index2) in headerFields"
              v-if="item.index == index || item.index == 'default'"
              :key="index2"
              :cols="$vuetify.breakpoint.lg ? item.colSize : '3'"
              class="ma-0 pa-0"
              :class="
                item.key == 'action' || item.key == 'description'
                  ? ''
                  : 'custom-width'
              "
              :style="{
                display:
                  (item.key === 'taxAmount' &&
                    invoiceItem.lineAmountTypes !== 'Exclusive') ||
                  (item.key === 'disc' && invoiceItem.type === 'ACCPAY')
                    ? 'none !important'
                    : '',
              }"
            >
              <p
                class="ma-0 pa-0 fs-14 justify-start d-flex align-end overflow-hidden fw-600 textPrimary--text f-inter ml-3"
              >
                {{ item.heading }}
              </p>
            </v-col>
          </v-row>
          <!-- Billign Details -->
          <v-row
            class="ma-0 pa-0 d-flex flex-nowrap"
            v-for="(item, index3) in invoiceItem.lineItems"
            :key="index3"
          >
            <v-col
              v-for="(item1, index1) in headerFields"
              v-if="item1.index == index || item1.index == 'default'"
              :key="index1"
              :cols="$vuetify.breakpoint.lg ? item1.colSize : '3'"
              class="ma-0 pa-1"
              :class="
                item1.key == 'action' || item1.key == 'description'
                  ? ''
                  : 'rounded-xl custom-width'
              "
              :style="{
                display:
                  (item1.key === 'taxAmount' &&
                    invoiceItem.lineAmountTypes !== 'Exclusive') ||
                  (item1.key === 'disc' && invoiceItem.type === 'ACCPAY')
                    ? 'none !important'
                    : '',
              }"
            >
              <!-- number text-fields -->
              <v-text-field
                v-if="item1.selectionType == 'textfield'"
                filled
                flat
                persistent-placeholder
                class="text-no-wrap rounded-md fs-12"
                :placeholder="item1.placeholder"
                background-color="inputBackground"
                hide-details
                dense
                :min="item1.type == 'number' ? '0' : ''"
                :max="item1.key == 'disc' ? '100' : ''"
                depressed
                :disabled="
                  item.disabled
                    ? true
                    : globalDisableFieldsValue
                    ? true
                    : !currentWorkspace.rewriteInvoice
                    ? true
                    : item1.key == 'lineAmount'
                    ? true
                    : false
                "
                v-model.number="item[item1.key]"
                :value="
                  item1.key == 'lineAmount' ? calcTotalAmount(invoiceItem) : ''
                "
                :type="item1.type"
              ></v-text-field>

              <!-- Dropdown all items  -->
              <v-autocomplete
                v-else-if="
                  item1.selectionType == 'select' && item1.key == 'itemCode'
                "
                :disabled="
                  !currentWorkspace.rewriteInvoice || user.role == 'employee'
                "
                class="text-no-wrap rounded-md fs-12"
                :placeholder="item1.placeholder"
                background-color="inputBackground"
                hide-details
                dense
                flat
                solo
                :items="
                  item['accountCode'] &&
                  xeroHashMaps.accountsHashmap.ids[item['accountCode']]
                    ? xeroHashMaps.accountsHashmap.ids[item['accountCode']]
                        .items
                    : xeroHashMaps.itemsHashmap.all
                "
                color="appColor"
                :value="item[item1.key]"
                @input="selectItem($event, item1.key, item)"
                return-object
                item-text="name"
              >
                <template #item="{ item }">
                  <span class="fs-12"> {{ item.name }}</span>
                </template>
                <template #selection="{ item }">
                  <span class="fs-12">
                    {{ item.name.substr(0, 11)
                    }}{{ item.name.length > 11 ? ".." : "" }}
                  </span>
                </template>
              </v-autocomplete>

              <!-- Dropdown all account head  -->
              <v-autocomplete
                v-else-if="
                  item1.selectionType == 'select' && item1.key == 'accountCode'
                "
                :disabled="
                  !currentWorkspace.rewriteInvoice || user.role == 'employee'
                "
                class="text-no-wrap rounded-md fs-12"
                :placeholder="item1.placeholder"
                background-color="inputBackground"
                hide-details
                dense
                flat
                solo
                :items="
                  item['itemCode'] &&
                  xeroHashMaps.itemsHashmap.ids[item['itemCode']]
                    ? xeroHashMaps.itemsHashmap.ids[item['itemCode']].accounts
                    : xeroHashMaps.accountsHashmap.all
                "
                color="appColor"
                return-object
                @input="selectAccountType($event, item1.key, item)"
                item-text="name"
                :value="item[item1.key]"
              >
                <template #item="{ item }">
                  <span class="fs-12"> {{ item.name }}</span>
                </template>
                <template #selection="{ item }">
                  <span class="fs-12">
                    {{ item.name.substr(0, 12)
                    }}{{ item.name.length > 12 ? ".." : "" }}
                  </span>
                </template>
              </v-autocomplete>

              <!-- Dropdown Tax Rates  -->
              <v-select
                v-else-if="
                  item1.selectionType == 'select' && item1.key == 'taxType'
                "
                class="text-no-wrap fs-12"
                :placeholder="item1.placeholder"
                background-color="inputBackground"
                hide-details
                dense
                flat
                solo
                height="1"
                :items="staticValues"
                color="appColor"
                :disabled="
                  !currentWorkspace.rewriteInvoice || user.role == 'employee'
                "
                v-model="item[item1.key]"
                item-value="taxType"
              >
                <template #item="{ item }">
                  <span
                    class="fs-12 font-style-paragraph mainTextColor--text ma-0 pa-0"
                  >
                    {{ item.name }}</span
                  >
                </template>
                <template #selection="{ item }">
                  <span
                    class="fs-12 font-style-paragraph mainTextColor--text ma-0 pa-0"
                  >
                    {{ item.name.substr(0, 11)
                    }}{{ item.name.length > 11 ? ".." : "" }}
                  </span>
                </template>
              </v-select>

              <!-- Delete button  -->
              <div
                v-else-if="
                  item1.selectionType == 'button' &&
                  item1.key == 'action' &&
                  currentWorkspace.rewriteInvoice &&
                  user.role == 'client'
                "
                :class="
                  $vuetify.breakpoint.lg ? 'ml-2' : 'd-flex justify-center'
                "
                class="pa-1 deleteIcon custom-delete-btn"
                @click="deleteField(invoiceItem, item, index3)"
              >
                <v-img
                  src="../../../../public/img/icons/bin.png"
                  class="ma-2"
                />
              </div>
            </v-col>
          </v-row>
        </div>
        <!-- Add new Product -->
        <v-col cols="3" class="ma-0 ml-2 mb-6 pa-0 rounded-lg">
          <div
            class="d-flex justify-start"
            v-if="user.role == 'client' && currentWorkspace.rewriteInvoice"
          >
            <div
              class="mr-2 fs-13 fw-600 f-inter cursor-pointer primary--text"
              @click="addNewLineitem(invoiceItem)"
            >
              + Add New Product
            </div>
          </div>
        </v-col>
        <!-- Billign Details Footer-->
        <v-divider />
        <v-row class="ma-0 mt-3 mb-10 pa-0 d-flex justify-end align-center">
          <v-col
            lg="3"
            md="8"
            sm="12"
            class="ma-0 pa-0 mt-1"
            v-for="(item, index) in footerFields"
            :key="index"
          >
            <!-- Footer calculated fields -->
            <v-text-field
              :label="item.label"
              :placeholder="item.placeholder"
              class="text-no-wrap rounded-md custom ma-1 pa-0 fs-14 custom-footer primary--text"
              background-color="inputBackground"
              hide-details
              filled
              persistent-placeholder
              readonly
              v-if="item.key != 'currencyCode'"
              :autocomplete="false"
              :type="item.type"
              dense
              :value="
                item.key == 'subTotal'
                  ? calcSubTotal(invoiceItem)
                  : item.key == 'totalTax'
                  ? calcTotalTax(invoiceItem)
                  : item.key == 'total'
                  ? calcTotal(invoiceItem)
                  : ''
              "
            >
            </v-text-field>
            <!-- Currency Field -->
            <v-combobox
              v-if="item.key == 'currencyCode'"
              class="text-no-wrap rounded-md custom ma-1 pa-0 currency-field fs-14"
              filled
              hide-details
              persistent-placeholder
              :items="currencies"
              :disabled="
                !currentWorkspace.rewriteInvoice || user.role != 'client'
              "
              :value="invoiceItem.currencyCode"
              @input="setCurrency($event)"
              @focus="fetchCurrency()"
              placeholder="Currency"
              color="primary"
              item-value="code"
              :return-object="false"
              :label="item.label"
              background-color="inputBackground"
              :menu-props="{
                closeOnContentClick: false,
                bottom: true,
                offsetY: true,
              }"
            >
              <template v-slot:selection="{ item }">
                <span
                  class="fs-14 font-style-paragraph primary--text ma-0 pa-0"
                >
                  {{ item }}</span
                >
              </template>
              <template v-slot:item="{ item }">
                <span
                  v-if="currentWorkspace.isAccountingSoftConnected"
                  class="fs-12 font-style-paragraph mainTextColor--text ma-0 pa-0"
                >
                  {{ item.code + " - " + item.description }}</span
                >
                <span
                  v-if="!currentWorkspace.isAccountingSoftConnected"
                  class="fs-12 font-style-paragraph mainTextColor--text ma-0 pa-0"
                >
                  {{ item }}</span
                >
              </template>
              <template v-slot:append-item>
                <div class="fs-10 text-center" v-if="currencyLoader">
                  <span>Loading...</span>
                </div>
              </template>
            </v-combobox>
          </v-col>
        </v-row>
        <hr />
      </div>
    </div>

    <!-- When no invoice get from draft -->
    <div v-else>
      <v-row class="ma-0 pa-0 rounded-lg">
        <!-- Form Header Fields -->
        <v-col
          class="ma-0 pa-0 d-flex align-stretch"
          cols="3"
          v-for="(item, index) in headerData"
          :key="index"
        >
          <v-row class="ma-1 pa-1">
            <v-text-field
              :type="item.type"
              :label="item.label"
              :placeholder="'Extracting...'"
              hide-details
              class="text-no-wrap custom rounded-md fs-12 f-inter fw-400"
              background-color="inputBackground"
              filled
              dense
              persistent-placeholder
              disabled
            ></v-text-field>
          </v-row>
        </v-col>
      </v-row>

      <!-- Billing Details -->
      <div class="d-flex justify-space-between align-center mt-5">
        <div class="ma-0 pa-0 rounded-lg">
          <span class="fs-16 f-inter fw-600 pl-2 textPrimary--text"
            >Billing Details</span
          >
        </div>
        <div class="ma-0 pa-0 mr-2 rounded-lg">
          <v-select
            label="Columns"
            class="col-width"
            id="column-fields"
            attach
            multiple
            outlined
            solo
            dense
            flat
            chips
            disabled
          >
          </v-select>
        </div>
      </div>

      <!-- Billing Details Header -->
      <div class="pb-3 overflow-x-auto">
        <v-row class="ma-0 pa-0 d-flex flex-nowrap">
          <v-col
            v-for="(item, index) in headerFields"
            :key="index"
            :cols="$vuetify.breakpoint.lg ? item.colSize : '3'"
            class="ma-0 pa-0"
            :class="
              item.key == 'action' || item.key == 'description'
                ? ''
                : 'custom-width'
            "
          >
            <p
              v-if="item.heading !== 'Action'"
              class="ma-0 pa-0 fs-14 justify-start d-flex align-end overflow-hidden fw-600 textPrimary--text f-inter ml-4"
            >
              {{ item.heading }}
            </p>
          </v-col>
        </v-row>
        <!-- Billign Details -->
        <v-row class="pl-3 mt-1">
          <v-col
            v-for="(item1, index1) in headerFields"
            :key="index1"
            :cols="$vuetify.breakpoint.lg ? item1.colSize : '3'"
            class="ma-0 pa-1 mb-2"
            :class="
              item1.key == 'action' || item1.key == 'description'
                ? ''
                : 'rounded-xl custom-width'
            "
          >
            <!-- number text-fields -->
            <v-text-field
              v-if="item1.selectionType == 'textfield'"
              filled
              flat
              persistent-placeholder
              class="text-no-wrap rounded-md fs-12"
              :label="item1.label"
              :placeholder="'Extracting...'"
              background-color="inputBackground"
              hide-details
              dense
              depressed
              disabled
              :type="item1.type"
            ></v-text-field>

            <!-- Dropdown all items  -->
            <v-autocomplete
              v-else-if="
                item1.selectionType == 'select' && item1.key == 'itemCode'
              "
              disabled
              class="text-no-wrap rounded-md fs-12"
              :label="item1.label"
              :placeholder="'Extracting...'"
              background-color="inputBackground"
              hide-details
              dense
              flat
              solo
              color="appColor"
            >
            </v-autocomplete>

            <!-- Dropdown all account head  -->
            <v-autocomplete
              v-else-if="
                item1.selectionType == 'select' && item1.key == 'accountCode'
              "
              disabled
              class="text-no-wrap rounded-md fs-12"
              :label="item1.label"
              :placeholder="'Extracting...'"
              background-color="inputBackground"
              hide-details
              dense
              flat
              solo
              color="appColor"
            >
            </v-autocomplete>
          </v-col>
        </v-row>
      </div>
      <v-col cols="3" class="ma-0 ml-1 mb-6 pa-0 rounded-lg"> </v-col>
      <!-- Billign Details Footer-->
      <v-divider />
      <v-row class="ma-0 mt-3 mb-10 pa-0 d-flex justify-end align-center">
        <v-col
          lg="3"
          md="8"
          sm="12"
          class="ma-0 pa-0 mt-1"
          v-for="(item, index) in footerFields"
          :key="index"
        >
          <!-- Footer calculated fields -->
          <v-text-field
            :label="item.label"
            :placeholder="'Extracting...'"
            class="text-no-wrap rounded-md custom ma-1 pa-0 fs-12"
            background-color="inputBackground"
            hide-details
            filled
            persistent-placeholder
            disabled
            :autocomplete="false"
            :type="item.type"
            dense
          >
          </v-text-field>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import Button from "../../common/button";
import ApiService from "@/services/Api.js";
import UrlServices from "@/services/Url";
import EventBus from "../../../js/EventBus";
import { setAccountItemsHashMaps } from "../../../services/AccountsItemsHashmap";
export default {
  name: "Form",
  components: { Button },
  data() {
    return {
      lineItems: [
        { text: "Disc %", key: "disc" },
        { text: "Tax", key: "taxAmount" },
        { text: "Tax Rate", key: "taxType" },
      ],
      lineItemsColWidth: "13% !important",
      dataDraft: null,
      oldDataDraft: null,
      editableForm: false,
      tableIndex: {},
      itemArr: [],
      itemArrDif: [],
      selected: "",
      invoiceIndex: null,
      currencyLoader: false,
      currencies: [],
      brandingTheme: "",
      brandingLoader: false,
      currencyList: ["USD", "PKR", "EUR", "GBP"],
      allAccountsItems: [],
      xeroHashMaps: {
        accountsHashmap: { ids: {}, all: [] },
        itemsHashmap: { ids: {}, all: [] },
      },
      ticketData: {},
      newInvoiceForm: {
        invoices: [
          {
            address: "",
            balanceDue: "",
            currencyCode: "",
            date: "",
            discount: "",
            dueDate: "",
            email: "",
            invoiceNumber: "01",
            lineItems: [
              {
                description: "",
                disc: 0,
                lineAmount: 0,
                quantity: 0,
                taxAmount: 0,
                unitAmount: 0,
                itemCode: "",
                accountCode: "",
                taxType: "",
              },
            ],
            name: "",
            subTotal: 0,
            totalTax: 0,
            total: 0,
            status: "DRAFT",
            type: "ACCREC",
            lineAmountTypes: "Exclusive",
          },
        ],
      },
      headerData: [
        {
          title: "Name",
          placeholder: "Enter name",
          label: "Name",
          requiredField: [(v) => !!v || "Field is required"],
          type: "text-field",
          maxLength: "50",
          model: "name",
          disabled: false,
        },
        {
          title: "Invoice Number",
          placeholder: "Enter number",
          label: "Invoice Number",
          requiredField: [(v) => !!v || "Field is required"],
          type: "text-field",
          maxLength: "50",
          model: "invoiceNumber",
          disabled: true,
        },
        {
          title: "Reference",
          placeholder: "Enter reference",
          label: "Reference",
          requiredField: [(v) => !!v || "Field is required"],
          type: "text-field",
          maxLength: "50",
          model: "reference",
          disabled: false,
        },
        {
          title: "Branding Theme",
          placeholder: "Enter branding theme",
          label: "Branding Theme",
          requiredField: [(v) => !!v || "Field is required"],
          type: "text-field",
          maxLength: "50",
          model: "brandingThemes",
          disabled: true,
        },
        {
          title: "Date",
          placeholder: "Enter date",
          label: "Date",
          requiredField: [(v) => !!v || "Field is required"],
          type: "date",
          maxLength: "50",
          model: "date",
          disabled: false,
        },
        {
          title: "Due Date",
          placeholder: "Enter due date",
          label: "Due Date",
          requiredField: [(v) => !!v || "Field is required"],
          type: "date",
          maxLength: "50",
          model: "dueDate",
          disabled: false,
        },
        {
          title: "Line Amount Type",
          placeholder: "Enter line amount type",
          label: "Line Amount Type",
          requiredField: [(v) => !!v || "Field is required"],
          type: "text-field",
          maxLength: "50",
          model: "lineAmountTypes",
          disabled: true,
        },
        {
          title: "Status",
          placeholder: "Enter status",
          label: "Status",
          requiredField: [(v) => !!v || "Field is required"],
          type: "text-field",
          maxLength: "50",
          model: "status",
          disabled: true,
        },
      ],
      fieldsColSize: {
        description: 3,
        quantity: 2,
        unitAmount: 2,
        discount: 2,
        tax: 2,
        total: 2,
      },
      headerFields: [
        {
          selectionType: "select",
          heading: "Item",
          key: "itemCode",
          index: "default",
          colSize: 2,
          placeholder: "Enter Item",
          type: "string",
          disabled: false,
        },
        {
          selectionType: "textfield",
          heading: "Description",
          key: "description",
          placeholder: "Enter description",
          index: "default",
          colSize: 3,
          type: "string",
          disabled: false,
        },
        {
          selectionType: "textfield",
          heading: "Quantity",
          key: "quantity",
          placeholder: "0",
          index: "default",
          colSize: 2,
          type: "number",
          disabled: false,
        },
        {
          selectionType: "textfield",
          heading: "Unit Price",
          key: "unitAmount",
          placeholder: "0",
          index: "default",
          colSize: 2,
          type: "number",
          disabled: false,
        },
        {
          selectionType: "select",
          heading: "Account Head",
          key: "accountCode",
          placeholder: "Enter account",
          index: "default",
          colSize: 2,
          type: "string",
          disabled: false,
        },
        {
          selectionType: "textfield",
          heading: "Total",
          key: "lineAmount",
          index: "default",
          colSize: 2,
          type: "number",
          disabled: true,
        },
        {
          selectionType: "button",
          heading: "",
          key: "action",
          index: "default",
          colSize: 1,
          type: "none",
          disabled: false,
        },
      ],
      footerFields: [
        {
          label: "Sub Total",
          placeholder: "Sub Total",
          type: "number",
          key: "subTotal",
        },
        {
          label: "Tax Amount",
          placeholder: "Tax Amount",
          type: "number",
          key: "totalTax",
        },
        {
          label: "Currency",
          placeholder: "Currency",
          type: "string",
          key: "currencyCode",
        },
        {
          label: "Total",
          placeholder: "Total",
          type: "number",
          key: "total",
        },
      ],
    };
  },
  props: {
    draft: Object,
    ticket: Object,
  },
  computed: {
    ...mapGetters({
      currentWorkspace: "auth/getCurrentWorkspace",
      user: "auth/getUser",
    }),
    /**
     * values for tax rates field when xero is not connected
     */
    staticValues() {
      let taxTypeArr = [
        { name: "Sales Tax on Imports(0%)", taxType: "GSTONIMPORTS" },
        { name: "Tax Exempt(0%)", taxType: "NONE" },
        { name: "Tax on Purchases(0%)", taxType: "INPUT" },
        { name: "Tax on Sales(0%)", taxType: "OUTPUT" },
      ];
      return taxTypeArr;
    },
    globalDisableFieldsValue() {
      if (this.user.role === "employee") return true;
      else return false;
    },
  },
  watch: {
    newInvoiceForm: {
      handler() {
        this.$emit("new-invoice-object", this.newInvoiceForm);
      },
      deep: true,
    },
  },
  mounted() {
    this.ticketData = this.ticket;
    this.dataDraft = this.draft ? this.draft : {};

    if (this.dataDraft || this.currentWorkspace.rewriteInvoice)
      this.editableForm = true;

    console.log(
      "before>>",
      this.draft,
      this.currentWorkspace.rewriteInvoice,
      this.ticketData.status
    );

    // newInvoiceForm case handled
    if (this.editableForm) {
      if (
        !this.draft &&
        this.currentWorkspace.rewriteInvoice &&
        this.ticketData.status === "Complete"
      ) {
        this.dataDraft = this.newInvoiceForm;
      } else if (this.draft) {
        this.editableForm = true;
      } else if (!this.draft) {
        this.editableForm = false;
      }
    }

    if (this.dataDraft)
      this.oldDataDraft = JSON.parse(JSON.stringify(this.dataDraft));

    // set calculations for copied duplicate draft data
    if(this.oldDataDraft) {
      // set old duplicate draft data calculations for totalLineAmount
      this.calcTotalAmountForOldData();
      // set old duplicate data calculations for subTotal
      this.calcSubTotalForOldData();
      // set old duplicate data calculations for totalTax
      this.calcTotalTaxForOldData();
      // set old duplicate data calculations for final Total
      this.calcTotalForOldData();
    }
    this.getTotalAccountItems();
  },

  // this.fetchBrandingThemes();
  methods: {
    /**
     * This function calculates the total lineAmount in every lineitem
     * @param {*} invoiceItem
     */
    calcTotalAmount(invoiceItem) {
      let total = 0;
      invoiceItem.lineItems.forEach((el) => {
        if (isNaN(el.quantity)) el.quantity = 0;
        if (isNaN(el.unitAmount)) el.unitAmount = 0;
        if (isNaN(el.disc)) el.disc = 0;
        if (isNaN(el.taxAmount)) el.taxAmount = 0;
        if (typeof el.disc === "string")
          el.disc = el.disc.replace(/^%|%$/g, "");
        if (typeof el.taxAmount === "string")
          el.taxAmount = el.taxAmount.replace(/^%|%$/g, "");
        let x =
          invoiceItem.type === "ACCPAY"
            ? 1
            : (100 - Math.round(el.disc * 100) / 100) / 100;
        total = +el.quantity * +el.unitAmount * x;
        el.lineAmount = Math.round(total * 100) / 100;
      });

      // get new and old draft data to compare the field values
      this.getDraftData();
      return Math.round(total * 100) / 100;
    },

    /**
     * This function calculates every LineAmount total value for old duplicate data draft
     * so that one can compare old and new draft data
     */
    calcTotalAmountForOldData() {
      let total = 0;
      this.oldDataDraft.invoices.forEach((invoiceItem) => {
        invoiceItem.lineItems.forEach((el) => {
          if (isNaN(el.quantity)) el.quantity = 0;
          if (isNaN(el.unitAmount)) el.unitAmount = 0;
          if (isNaN(el.disc)) el.disc = 0;
          if (isNaN(el.taxAmount)) el.taxAmount = 0;
          if (typeof el.disc === "string")
            el.disc = el.disc.replace(/^%|%$/g, "");
          if (typeof el.taxAmount === "string")
            el.taxAmount = el.taxAmount.replace(/^%|%$/g, "");
          let x =
            invoiceItem.type === "ACCPAY"
              ? 1
              : (100 - Math.round(el.disc * 100) / 100) / 100;
          total = +el.quantity * +el.unitAmount * x;
          el.lineAmount = Math.round(total * 100) / 100;
        });
      });
    },

    /**
     * This function calculates the subTotal in footer
     * @param {*} invoiceItem
     */
    calcSubTotal(invoiceItem) {
      let invoiceSubTotal = 0;
      invoiceItem.lineItems.forEach((el) => {
        let totalLineAmount = Number(el.lineAmount);
        invoiceSubTotal += totalLineAmount;
      });
      invoiceItem["subTotal"] = Math.round(invoiceSubTotal * 100) / 100;
      return Math.round(invoiceSubTotal * 100) / 100;
    },

    /**
     * This function calculates subTotal value for old duplicate data draft
     * so that one can compare old and new draft data
     */
    calcSubTotalForOldData() {
      this.oldDataDraft.invoices.forEach((invoiceItem) => {
        let invoiceSubTotal = 0;
        invoiceItem.lineItems.forEach((el) => {
          let totalLineAmount = Number(el.lineAmount);
          invoiceSubTotal += totalLineAmount;
        });
        invoiceItem["subTotal"] = Math.round(invoiceSubTotal * 100) / 100;
      });
    },

    /**
     * This function calculates the totalTax in footer
     * @param {*} invoiceItem
     */
    calcTotalTax(invoiceItem) {
      let invoiceTotalTax = 0;
      if (invoiceItem.lineAmountTypes == "Exclusive") {
        invoiceItem.lineItems.forEach((el) => {
          if (!el.taxAmount && el.taxAmount == undefined) el.taxAmount = 0;
          let totalTaxAmount = Number(el.taxAmount);
          invoiceTotalTax += totalTaxAmount;
        });
        invoiceItem["totalTax"] = Math.round(invoiceTotalTax * 100) / 100;
      } else {
        invoiceItem["totalTax"] = Math.round(invoiceTotalTax * 100) / 100;
      }
      return Math.round(invoiceTotalTax * 100) / 100;
    },

    /**
     * This function calculates totalTax value for old duplicate data draft
     * so that one can compare old and new draft data
     */
    calcTotalTaxForOldData() {
      this.oldDataDraft.invoices.forEach((invoiceItem) => {
        let invoiceTotalTax = 0;
        if (invoiceItem.lineAmountTypes == "Exclusive") {
          invoiceItem.lineItems.forEach((el) => {
            if (!el.taxAmount && el.taxAmount == undefined) el.taxAmount = 0;
            let totalTaxAmount = Number(el.taxAmount);
            invoiceTotalTax += totalTaxAmount;
          });
          invoiceItem["totalTax"] = Math.round(invoiceTotalTax * 100) / 100;
        } else {
          invoiceItem["totalTax"] = Math.round(invoiceTotalTax * 100) / 100;
        }
      });
    },

    /**
     * This function calculates final total(subTotal+totalTax) in footer
     * @param {*} invoiceItem
     */
    calcTotal(invoiceItem) {
      let total =
        Number(this.calcSubTotal(invoiceItem)) +
        Number(this.calcTotalTax(invoiceItem));
      invoiceItem["total"] = Math.round(total * 100) / 100;
      return Math.round(total * 100) / 100;
    },

    /**
     * This function calculates final total value for old duplicate data draft
     * so that one can compare old and new draft data
     */
    calcTotalForOldData() {
      this.oldDataDraft.invoices.forEach((invoiceItem) => {
        let total =
          Number(invoiceItem["subTotal"]) + Number(invoiceItem["totalTax"]);
        invoiceItem["total"] = Math.round(total * 100) / 100;
      });
    },

    /**
     * This function adds new lineitem for the specific invoice
     */
    addNewLineitem(invoiceItem) {
      let sampleObject = {
        itemCode: "",
        description: "",
        unitAmount: 0,
        quantity: 0,
        taxAmount: 0,
        lineAmount: 0,
        discountRate: 0,
        accountCode: "",
        taxType: "",
      };
      // let Arr = [];
      // if(this.currentWorkspace.isAccountingSoftConnected) {
      // this.categories?.trackingCategories.forEach((item) => {
      //   let obj = {
      //     trackingCategoryID: item.trackingCategoryID,
      //     trackingOptionID: "",
      //   };
      //   Arr.push(obj);
      // });
      // }
      // if (Arr.length > 0) sampleObject["tracking"] = Arr;

      invoiceItem.lineItems.push(sampleObject);
    },

    /**
     * This function fetch all the currencies
     */
    fetchCurrency() {
      if (this.currentWorkspace.isAccountingSoftConnected) {
        this.currencyLoader = true;
        ApiService.GetRequest(
          `${UrlServices.xeroCurrencies}/${this.currentWorkspace.workspaceId}`
        )
          .then((res) => {
            this.currencyLoader = false;
            this.currencies = res.data.currencies;
          })
          .catch((err) => {
            this.currencyLoader = false;
            console.log(err);
          });
      } else this.currencies = this.currencyList;
    },

    /**
     * This function inputs the currency field
     */
    setCurrency(e) {
      if (e != null) {
        this.dataDraft.invoices.forEach((inv) => {
          inv.currencyCode = e.toUpperCase();
        });
      }
    },

    /**
     * Method to fetch Branding themes from Xero
     */
    fetchBrandingThemes() {
      if (this.currentWorkspace.isAccountingSoftConnected) {
        this.brandingLoader = true;
        ApiService.GetRequest(
          `${UrlServices.getBrandingThemes}/${this.currentWorkspace.workspaceId}`
        )
          .then((res) => {
            this.brandingLoader = false;
            console.log("brands>>>", res.data.brandingThemes);
            this.brandingTheme = res.data.brandingThemes.map((e) => e.name);
            console.log(this.brandingTheme);
            // this.brandingThemes = res.data.brandingThemes.map(e => e.name);
          })
          .catch((err) => {
            this.brandingLoader = false;
            console.log("err", err);
          });
      }
    },

    /**
     * This function gets all the accounts and items
     */
    getTotalAccountItems() {
      ApiService.GetRequest(UrlServices.getTotalAccountItems)
        .then((res) => {
          this.allAccountsItems = res?.data?.data;
          const resp = setAccountItemsHashMaps(
            this.allAccountsItems,
            this.xeroHashMaps
          );
          console.log("hashmaps", resp);
          if (resp) {
            this.xeroHashMaps.accountsHashmap = resp.accountsHashmap;
            this.xeroHashMaps.itemsHashmap = resp.itemsHashmap;
            EventBus.$emit("get-xerohashmaps", resp);
          }
        })
        .catch((e) => {
          console.log("err", e);
        });
    },

    /**
     * this function select account type
     */
    selectAccountType(e, key, invoiceItem) {
      console.log(e, "==========Event=========");
      const accountNameAndType = { name: e.name, type: e.type };
      invoiceItem[key] = accountNameAndType;
    },
    /**
     * this function select Item
     */
    selectItem(e, key, invoiceItem) {
      console.log(e, key, invoiceItem);
      invoiceItem[key] = e;
      console.log("eeeeee", e);
      const accounts =
        this.xeroHashMaps.itemsHashmap.ids[invoiceItem.itemCode.id]?.accounts;
      console.log(accounts[0]);
      console.log(invoiceItem.accountCode);
      if (Array.isArray(accounts) && accounts.length)
        invoiceItem.accountCode = accounts[0];
      else invoiceItem.accountCode = null;
    },

    /**
     * This function delete the lineitem with emit method
     * @param {*} invoiceItem
     * @param {*} index
     */
    deleteField(invoiceItem, item, index) {
      invoiceItem.lineItems.splice(index, 1);
    },

    /**
     *  This function selects the lineitem
     */
    createHeader(
      selectionType,
      heading,
      text,
      index,
      key,
      placeholder,
      colSize,
      type,
      disabled
    ) {
      return {
        selectionType: selectionType,
        heading: heading,
        text: text,
        index: index,
        key: key,
        placeholder: placeholder,
        colSize: colSize,
        type: type,
        disabled: disabled,
      };
    },

    /**
     * This function adds and remove the columns in the lineitems
     * @param {*} e (input element)
     * @param {*} index
     */
    addAndRemoveLineItems(e, invIndex, invoiceItem) {
      // console.log("event", e);
      // console.log("event length", e.length);
      // console.log("invoice Index", invIndex);
      // console.log("item Arr", this.itemArr);
      // console.log("item Arr length", this.itemArr.length);

      const indexExist = this.tableIndex[`tab${invIndex}`];

      // Add OR Remove columns
      if (indexExist) {
        // console.log('IFFFF >>> ', indexExist);

        // Add columns in headerFields
        if (e.length > this.tableIndex[`tab${invIndex}`].length) {
          this.tableIndex[`tab${invIndex}`] = e;

          let lastElement = [...e].pop();
          console.log("last ele >", lastElement);
          if (lastElement.key == "disc")
            this.headerFields.splice(
              this.headerFields.length - 1,
              0,
              this.createHeader(
                "textfield",
                "Disc %",
                "Discount",
                invIndex,
                "disc",
                "0",
                2,
                "number",
                false
              )
            );
          else if (lastElement.key == "taxAmount")
            this.headerFields.splice(
              this.headerFields.length - 1,
              0,
              this.createHeader(
                "textfield",
                "Tax",
                "Tax",
                invIndex,
                "taxAmount",
                "0",
                2,
                "number",
                false
              )
            );
          else if (lastElement.key == "taxType")
            this.headerFields.splice(
              this.headerFields.length - 1,
              0,
              this.createHeader(
                "select",
                "Tax Rate",
                "Tax Rate",
                invIndex,
                "taxType",
                "Enter tax rate",
                2,
                "string",
                false
              )
            );
        }

        // remove columns from headerFields
        else {
          // extract element that has been removed
          let [lastElement] = this.tableIndex[`tab${invIndex}`].filter(
            (value) => !e.includes(value)
          );
          // remove headerFields with respect to last element
          this.headerFields.splice(
            this.headerFields.findIndex(
              (value) => value.key === lastElement.key
            ),
            1
          );
          // remove values of specific column's element from invoice
          invoiceItem.lineItems.forEach((ele) => {
            if (lastElement.key == "disc") ele.disc = ele.disc ? ele.disc : 0;
            if (lastElement.key == "taxAmount")
              ele.taxAmount = ele.taxAmount ? ele.taxAmount : 0;
            if (lastElement.key == "taxType")
              ele.taxType = ele.taxType ? ele.taxType : "";
          });
          this.tableIndex[`tab${invIndex}`] = e;
        }
      }

      // Create table array with index
      else {
        this.tableIndex[`tab${invIndex}`] = [e[0]];

        // add column in headerFields
        let lastElement = [...e].pop();
        console.log("last ele >", lastElement);
        if (lastElement.key == "disc")
          this.headerFields.splice(
            this.headerFields.length - 1,
            0,
            this.createHeader(
              "textfield",
              "Disc %",
              "Discount",
              invIndex,
              "disc",
              "0",
              2,
              "number",
              false
            )
          );
        else if (lastElement.key == "taxAmount")
          this.headerFields.splice(
            this.headerFields.length - 1,
            0,
            this.createHeader(
              "textfield",
              "Tax",
              "Tax",
              invIndex,
              "taxAmount",
              "0",
              2,
              "number",
              false
            )
          );
        else if (lastElement.key == "taxType")
          this.headerFields.splice(
            this.headerFields.length - 1,
            0,
            this.createHeader(
              "select",
              "Tax Rate",
              "Tax Rate",
              invIndex,
              "taxType",
              "Enter tax rate",
              2,
              "string",
              false
            )
          );
      }
    },

    /**
     * This function gets new draft data of all the invoices
     */
    getDraftData() {
      EventBus.$emit("new-draft-data", this.dataDraft.invoices);
      EventBus.$emit("old-draft-data", this.oldDataDraft.invoices);
    },
  },

  // component beforeDestroy hook
  beforeDestroy() {
    this.allAccountsItems = [];
    this.xeroHashMaps = {};
  },
};
</script>

<style scoped>
.col-width {
  width: 150px;
}
:deep .col-width .v-label {
  font-size: 14px;
  color: var(--v-headerColor-base) !important;
}
:deep .v-list-item__action {
  margin-right: 16px !important;
}
:deep .v-text-field__slot > .v-label {
  font-weight: 600;
}
:deep .currency-field .v-select__slot > .v-label {
  font-weight: 600;
  margin-top: -6px;
}
:deep .currency-field .v-select__selections {
  padding-top: 30px !important;
}
:deep .v-text-field--outlined fieldset {
  color: rgb(243, 241, 241) !important;
}
:deep .custom .v-text-field__slot {
  height: 63px !important;
}

:deep .custom .v-select__slot {
  height: 63px !important;
}
:deep .v-text-field--filled:not(.v-text-field--single-line) input {
  margin-top: 30px;
}
:deep .v-select.v-text-field:not(.v-text-field--single-line) input {
  margin-top: 0px !important;
}
:deep .v-text-field .v-input__slot {
  border-radius: 6px !important;
}
.custom-delete-btn {
  width: 36px;
  height: 38px;
  border-radius: 6px;
  cursor: pointer;
}
:deep .custom-footer input {
  color: var(--v-primary-base) !important;
}
.custom-width {
  max-width: 13.99% !important;
}
.custom-padding {
  padding-left: 22px !important;
}
:deep .col-1 {
  max-width: 5% !important;
}
</style>
