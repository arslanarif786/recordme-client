<template>
  <v-container
    class="buttonBg rounded-lg"
    style="max-height: 80vh; overflow-y: scroll !important"
  >
    <!-- Invoice Details -->
    <div v-for="(invoiceItem, index) in newDataDraft?.invoices" :key="index">
      <v-row class="ma-0 pa-0 rounded-lg">
        <!-- Header -->
        <v-col cols="12" class="ma-0 pa-0 secondary rounded-lg">
          <span class="d-flex justify-center fs-18 strong">Invoice No: {{
            invoiceItem.invoiceNumber
          }}</span></v-col
        >
        <!-- Form Header Fields -->
        <v-col
          class="ma-0 pa-0 d-flex align-stretch"
          cols="6"
          v-for="(item, index) in headerData"
          :key="index"
        >
          <v-row class="ma-0 pa-1">
            <v-col cols="3" class="ma-0 pa-1 d-flex justify-left align-end">
              <span class="ma-0 pa-0 fs-10">
                <strong>{{ item.title }}</strong>
              </span></v-col
            >
            <v-col cols="9" v-if="item.model !== 'brandingThemes'" class="ma-0 pa-1 d-flex justify-center align-end">
              <!-- :label="item.label" -->
              <v-text-field
                v-if="(item.type = 'text-field')"
                outlined
                class="text-no-wrap rounded-md custom "
                :placeholder="item.placeholder"
                background-color="inputBackground"
                hide-details
                dense
                depressed
                :disabled="
                  item.disabled ? true : globalDisableFieldsValue ? true : !currentWorkspace.rewriteInvoice ? true : false
                "
                v-model="invoiceItem[item.model]"
              ></v-text-field>
            </v-col>
            <v-col cols="9" v-else-if="item.model == 'brandingThemes'" class="ma-0 pa-1 d-flex justify-center align-end">
              <v-text-field
                outlined
                class="text-no-wrap rounded-md custom "
                :placeholder="item.placeholder"
                background-color="inputBackground"
                hide-details
                dense
                depressed
                :disabled="
                  item.disabled ? true : globalDisableFieldsValue ? true : !currentWorkspace.rewriteInvoice ? true : false
                "
                v-if="(item.type = 'text-field')"
                :value="brandingTheme"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <!-- Billing Details -->
        <v-col cols="12" class="ma-0 pa-0 rounded-lg">
          <span class="d-flex justify-center fs-18 strong secondary--text"
            >Billing Details</span
          ></v-col
        >
        <!-- Add new Product -->
        <v-col cols="12" class="ma-0 pa-0 rounded-lg">
          <Button @button-clicked="addNewLineitem(invoiceItem)" class="mr-2" color="primary" v-if="currentWorkspace.rewriteInvoice && user.role =='client'">
            <template v-slot:buttonHeading>
              <p class="ma-0 pa-0 white--text">Add new Product</p>
            </template>
          </Button>
        </v-col>
      </v-row>
      <!-- Billing Details Header -->
      <div class="pb-3 overflow-x-auto">
        <v-row class="ma-0 pa-0 pt-2 d-flex flex-nowrap">
          <v-col
            v-for="(item, index) in headerFields"
            :key="index"
            :cols="$vuetify.breakpoint.lg ? item.colSize : '3' "
            class="ma-0 pa-0"
            :style="{
              border: `thin solid #6634E9`,
              display:
                (item.key === 'taxAmount' &&
                  invoiceItem.lineAmountTypes !== 'Exclusive') ||
                (item.key === 'disc' && invoiceItem.type === 'ACCPAY')
                  ? 'none !important'
                  : '',
            }"
          >
            <p
              class="ma-0 pa-0 fs-14 justify-center d-flex align-end overflow-hidden"
            >
              <strong>{{ item.heading }}</strong>
            </p>
          </v-col>
        </v-row>
        <!-- Billign Details -->
        <v-row
          class="ma-0 pa-0 d-flex flex-nowrap"
          v-for="(item, index) in invoiceItem.lineItems"
          :key="index"
        >
          <v-col
            v-for="(item1, index1) in headerFields"
            :key="index1"
            :cols="$vuetify.breakpoint.lg ? item1.colSize : '3'"
            class="ma-0 pa-0"
            :class="item1.key == 'action' ? '' : 'rounded-xl'"
            :style="{
              border: `thin solid #6634E9`,
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
              outlined
              class="text-no-wrap rounded-md custom"
              :placeholder="item.placeholder"
              background-color="inputBackground"
              hide-details
              dense
              :min="item1.type == 'number' ? '0' : ''"
              :max="item1.key == 'disc' ? '100' : ''"
              depressed
              :disabled="
                  item.disabled ? true : globalDisableFieldsValue ? true : !currentWorkspace.rewriteInvoice ? true : item1.key == 'lineAmount' ? true : false
                "
              v-model.number="item[item1.key]"
              :value="
                item1.key == 'lineAmount' ? calcTotalAmount(invoiceItem) : ''
              "
              :type="item1.type"
            ></v-text-field>

            <!-- Dropdown all items  -->
            <v-select
              v-else-if="
                item1.selectionType == 'select' && item1.key == 'itemCode'
              "
              :disabled="!currentWorkspace.rewriteInvoice || user.role == 'employee'"
              outlined
              class="text-no-wrap rounded-md custom"
              :placeholder="item.placeholder"
              background-color="inputBackground"
              hide-details
              dense
              solo
              :items="
                item['accountCode'] &&
                xeroHashMaps.accountsHashmap.ids[item['accountCode']]
                  ? xeroHashMaps.accountsHashmap.ids[item['accountCode']].items
                  : xeroHashMaps.itemsHashmap.all
              "
              color="appColor"
              :no-data-text="
                xeroHashMaps.itemsHashmap.all
                  ? 'Loading...'
                  : 'No Items available'
              "
              :value="item[item1.key]"
              @input="selectItem($event, item1.key, item)"
              item-value="id"
              item-text="name"
            >
              <template #item="{ item }">
                <span class="fs-10"> {{ item.name }}</span>
              </template>
              <template #selection="{ item }">
                <span class="fs-10">
                  {{ item.name.substr(0, 4)
                  }}{{ item.name.length > 4 ? ".." : "" }}
                </span>
              </template>
            </v-select>

            <!-- Dropdown all accounts  -->
            <v-select
              v-else-if="
                item1.selectionType == 'select' && item1.key == 'accountCode'
              "
              :disabled="!currentWorkspace.rewriteInvoice || user.role == 'employee'"
              outlined
              class="text-no-wrap rounded-md custom"
              :placeholder="item.placeholder"
              background-color="inputBackground"
              hide-details
              dense
              solo
              :items="
                item['itemCode'] &&
                xeroHashMaps.itemsHashmap.ids[item['itemCode']]
                  ? xeroHashMaps.itemsHashmap.ids[item['itemCode']].accounts
                  : xeroHashMaps.accountsHashmap.all
              "
              :no-data-text="
                xeroHashMaps.accountsHashmap.all
                  ? 'Loading...'
                  : 'No accounts available'
              "
              color="appColor"
              return-object
              @input="selectAccountType($event, item1.key, item)"
              item-text="name"
              :value="item[item1.key]"
            >
              <template #item="{ item }">
                <span class="fs-10"> {{ item.name }}</span>
              </template>
              <template #selection="{ item }">
                <span class="fs-10">
                  {{ item.name.substr(0, 13)
                  }}{{ item.name.length > 13 ? ".." : "" }}
                </span>
              </template>
            </v-select>

            <!-- Dropdown Tax Rates  -->
            <v-select
              v-else-if="
                item1.selectionType == 'select' && item1.key == 'taxType'
              "
              outlined
              class="text-no-wrap"
              :placeholder="item1.placeholder"
              background-color="inputBackground"
              hide-details
              dense
              solo
              height="1"
              :items="staticValues"
              color="appColor"
              :disabled="!currentWorkspace.rewriteInvoice || user.role == 'employee'"
              v-model="item[item1.key]"
              item-value="taxType"
            >
              <template #item="{ item }">
                <span
                  class="fs-10 font-style-paragraph mainTextColor--text ma-0 pa-0"
                >
                  {{ item.name }}</span
                >
              </template>
              <template #selection="{ item }">
                <span
                  class="fs-10 font-style-paragraph mainTextColor--text ma-0 pa-0"
                >
                  {{ item.name.substr(0, 5)
                  }}{{ item.name.length > 5 ? ".." : "" }}
                </span>
              </template>
            </v-select>

            <!-- Delete button  -->
            <span
              v-else-if=" item1.selectionType == 'button' && item1.key == 'action'"
              :class="$vuetify.breakpoint.lg ? 'mx-3' : 'd-flex justify-center' "
              >
            <v-icon
              :disabled="!currentWorkspace.rewriteInvoice || user.role == 'employee'"
              class="fs-20 mt-2 red--text delete-btn "
              style="cursor: pointer"
              @click="deleteField(invoiceItem, item, index)"
            >
              mdi-delete
            </v-icon>
          </span>
          </v-col>
        </v-row>
      </div>
      <!-- Billign Details Footer-->
      <v-row class="ma-0 pa-0 d-flex justify-end align-center">
        <v-col lg="6" md="8" sm="12">
          <div>
            <v-row
              class="ma-0 pa-0"
              v-for="(item, index) in footerFields"
              :key="index"
            >
              <v-col
                cols="3"
                class="ma-0 pa-0 d-flex justify-center align-center"
              >
                <span class="fs-10">
                  <strong>{{ item.label }}</strong>
                </span>
              </v-col>
              <v-col cols="9" class="ma-0 pa-0">
                <!-- Footer calculated fields -->
                <v-text-field
                  v-if="item.key != 'currencyCode'"
                  class="ma-1 pa-0"
                  :autocomplete="false"
                  flat
                  solo
                  hide-details
                  outlined
                  color="appColor"
                  :placeholder="item.placeholder"
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
                  disabled
                >
                </v-text-field>
                <!-- Currency Field -->
                <v-combobox
                  v-if="item.key == 'currencyCode'"
                  class="ma-1 pa-0"
                  flat
                  outlined
                  solo
                  hide-details
                  :items="currencies"
                  :disabled="!currentWorkspace.rewriteInvoice"
                  :value="invoiceItem.currencyCode"
                  @input="setCurrency($event)"
                  @focus="fetchCurrency()"
                  placeholder="Currency"
                  color="primary"
                  dense
                  item-value="code"
                  :return-object="false"
                >
                  <template v-slot:selection="{ item }">
                    <span
                      class="fs-10 font-style-paragraph mainTextColor--text ma-0 pa-0"
                    >
                      {{ item }}</span
                    >
                  </template>
                  <template v-slot:item="{ item }">
                    <span
                      v-if="currentWorkspace.isAccountingSoftConnected"
                      class="fs-10 font-style-paragraph mainTextColor--text ma-0 pa-0"
                    >
                      {{ item.code + " - " + item.description }}</span
                    >
                    <span
                      v-if="!currentWorkspace.isAccountingSoftConnected"
                      class="fs-10 font-style-paragraph mainTextColor--text ma-0 pa-0"
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
          </div>
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
      dataDraft: null,
      newDataDraft: null,
      currencyLoader: false,
      currencies: [],
      brandingTheme: '',
      brandingLoader: false,
      currencyList: ["USD", "PKR", "EUR", "GBP"],
      allAccountsItems: [],
      xeroHashMaps: {
        accountsHashmap: { ids: {}, all: [] },
        itemsHashmap: { ids: {}, all: [] },
      },
      headerData: [
        {
          title: "Invoice Number",
          placeholder: "Add Invoice Number",
          label: "Invoice Number",
          requiredField: [(v) => !!v || "Field is required"],
          type: "text-field",
          maxLength: "50",
          model: "invoiceNumber",
          disabled: true,
        },
        {
          title: "Email",
          placeholder: "Add Email here",
          label: "Email",
          requiredField: [(v) => !!v || "Field is required"],
          type: "text-field",
          maxLength: "50",
          model: "email",
          disabled: false,
        },
        {
          title: "Name",
          placeholder: "Enter Name here",
          label: "Name",
          requiredField: [(v) => !!v || "Field is required"],
          type: "text-field",
          maxLength: "50",
          model: "name",
          disabled: false,
        },
        {
          title: "Address",
          placeholder: "Enter Address here",
          label: "Address",
          requiredField: [(v) => !!v || "Field is required"],
          type: "text-field",
          maxLength: "50",
          model: "address",
          disabled: false,
        },
        {
          title: "Created At",
          placeholder: "Enter Created At here",
          label: "Created At",
          requiredField: [(v) => !!v || "Field is required"],
          type: "text-field",
          maxLength: "50",
          model: "date",
          disabled: false,
        },
        {
          title: "Due Date",
          placeholder: "Enter Due Date here",
          label: "Due Date",
          requiredField: [(v) => !!v || "Field is required"],
          type: "text-field",
          maxLength: "50",
          model: "dueDate",
          disabled: false,
        },
        {
          title: "Expected Payment Date",
          placeholder: "Enter Expected Payment Date here",
          label: "Expected Payment Date",
          requiredField: [(v) => !!v || "Field is required"],
          type: "text-field",
          maxLength: "50",
          model: "expectedPaymentDate",
          disabled: false,
        },
        {
          title: "Planned Date",
          placeholder: "Enter Planned Payment Date here",
          label: "Planned Date",
          requiredField: [(v) => !!v || "Field is required"],
          type: "text-field",
          maxLength: "50",
          model: "plannedPaymentDate",
          disabled: false,
        },
        {
          title: "Branding Themes",
          placeholder: "Enter Branding Themes here",
          label: "Branding Themes",
          requiredField: [(v) => !!v || "Field is required"],
          type: "text-field",
          maxLength: "50",
          model: "brandingThemes",
          disabled: true,
        },
        {
          title: "Line Amount Types",
          placeholder: "Enter Line Amount Types here",
          label: "Line Amount Types",
          requiredField: [(v) => !!v || "Field is required"],
          type: "text-field",
          maxLength: "50",
          model: "lineAmountTypes",
          disabled: true,
        },
        {
          title: "Reference",
          placeholder: "Enter Reference here",
          label: "Reference",
          requiredField: [(v) => !!v || "Field is required"],
          type: "text-field",
          maxLength: "50",
          model: "reference",
          disabled: false,
        },
        {
          title: "URL",
          placeholder: "Enter URL here",
          label: "URL",
          requiredField: [(v) => !!v || "Field is required"],
          type: "text-field",
          maxLength: "50",
          model: "url",
          disabled: false,
        },
        {
          title: "Status",
          placeholder: "Enter status here",
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
          heading: "Items",
          key: "itemCode",
          colSize: 2,
          placeholder: "items",
          type: "string",
          disabled: false,
        },
        {
          selectionType: "textfield",
          heading: "Description",
          key: "description",
          colSize: 3,
          type: "string",
          disabled: false,
        },
        {
          selectionType: "textfield",
          heading: "Quantity",
          key: "quantity",
          colSize: 2,
          type: "number",
          disabled: false,
        },
        {
          selectionType: "textfield",
          heading: "Unit Price",
          key: "unitAmount",
          colSize: 2,
          type: "number",
          disabled: false,
        },
        {
          selectionType: "textfield",
          heading: "Discount %",
          text: "Discount",
          key: "disc",
          colSize: 2,
          type: "number",
          disabled: false,
        },
        {
          selectionType: "textfield",
          heading: "Tax",
          text: "Tax",
          key: "taxAmount",
          colSize: 2,
          type: "number",
          disabled: false,
        },
        {
          selectionType: "textfield",
          heading: "Total",
          key: "lineAmount",
          colSize: 2,
          type: "number",
          disabled: true,
        },
        {
          selectionType: "select",
          heading: "Accounts",
          key: "accountCode",
          colSize: 3,
          type: "string",
          disabled: false,
        },
        {
          selectionType: "select",
          heading: "Tax Rates",
          key: "taxType",
          colSize: 2,
          type: "string",
          disabled: false,
        },
        {
          selectionType: "button",
          heading: "Action",
          key: "action",
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
  },
  computed: {
    ...mapGetters({
      currentWorkspace: "auth/getCurrentWorkspace",
      user: "auth/getUser"
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
      if(this.user.role === 'employee') return true;
      else return false;
    }
  },
  mounted() {
    this.dataDraft = this.draft;
    this.newDataDraft = JSON.parse(JSON.stringify(this.dataDraft));
    this.getTotalAccountItems();
    this.fetchBrandingThemes();
  },
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
        let x = invoiceItem.type === "ACCPAY" ? 1 : (100 - (Math.round(el.disc * 100) / 100)) / 100;
        total = +el.quantity * +el.unitAmount * x;
        el.lineAmount = (Math.round(total * 100) / 100);
      });
      this.getNewDraftData();
      return (Math.round(total * 100) / 100);
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
      invoiceItem["subTotal"] = (Math.round(invoiceSubTotal * 100) / 100);
      return (Math.round(invoiceSubTotal * 100) / 100);
    },

    /**
     * This function calculates the totalTax in footer
     * @param {*} invoiceItem
     */
    calcTotalTax(invoiceItem) {
      let invoiceTotalTax = 0;
      if (invoiceItem.lineAmountTypes == "Exclusive") {
        invoiceItem.lineItems.forEach((el) => {
          if (!el.taxAmount && el.taxAmount == undefined) el.taxAmount = "0";
          let totalTaxAmount = Number(el.taxAmount);
          invoiceTotalTax += totalTaxAmount;
        });
        invoiceItem["totalTax"] = (Math.round(invoiceTotalTax * 100) / 100);
      } else {
        invoiceItem["totalTax"] = (Math.round(invoiceTotalTax * 100) / 100);
      }
      return (Math.round(invoiceTotalTax * 100) / 100);
    },

    /**
     * This function calculates final total(subTotal+totalTax) in footer
     * @param {*} invoiceItem
     */
    calcTotal(invoiceItem) {
      let total = Number(this.calcSubTotal(invoiceItem)) + Number(this.calcTotalTax(invoiceItem));
      invoiceItem["total"] = (Math.round(total * 100) / 100);
      return (Math.round(total * 100) / 100);
    },

    /**
     * This function adds new lineitem for the specific invoice
     */
    addNewLineitem(invoiceItem) {
      console.log("here it is >>", invoiceItem);
      let sampleObject = {
        itemCode : "",
        description: "",
        unitAmount: 0,
        quantity: 0,
        taxAmount: 0,
        lineAmount: 0,
        disc: 0,
        accountCode : "",
        taxType : "",
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
      } else
          this.currencies = this.currencyList;
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
            console.log('brands>>>', res.data.brandingThemes);
            this.brandingTheme = res.data.brandingThemes.map(e => e.name);
            console.log(this.brandingTheme);
            // this.brandingThemes = res.data.brandingThemes.map(e => e.name);
          })
          .catch((err) => {
            this.brandingLoader = false;
            console.log('err', err);
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
      const accountNameAndType = { name: e.name, type: e.type };
      invoiceItem[key] = accountNameAndType;
    },
    /**
     * this function select Item
     */
     selectItem(e, key, invoiceItem) {
      invoiceItem[key] = e;
      const accounts = this.xeroHashMaps.itemsHashmap.ids[invoiceItem.itemCode]?.accounts;
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
     * This function gets new draft data of all the invoices
     */
    getNewDraftData() {
      EventBus.$emit('new-draft-data', this.newDataDraft.invoices);
      EventBus.$emit('old-draft-data', this.dataDraft.invoices);
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
::v-deep .v-text-field--outlined fieldset {
  color: var(--primary) !important;
}
::v-deep .v-text-field input {
  font-size: 12px;
}
</style>
