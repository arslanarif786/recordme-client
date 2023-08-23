<template>
  <div>
    <Dialog
      :modal="modalValue"
      @close-clicked="modalValue = false"
      @save-clicked="closeChatMiniFunctionForXeroForm"
      v-if="currentWorkspace.rewriteInvoice || user.role == 'client'"
    >
      <template v-slot:header> Confirmation </template>
      <template v-slot:content>
        Are you sure you want to leave, all unsaved changes will be lost
      </template>
      <template v-slot:buttonHeading> Ok </template>
    </Dialog>
    <v-row class="ma-0 pa-0">
      <!-- File Preview -->

      <!-- Open Form -->
      <v-col class="ma-0 pa-0" :cols="12">
        <Loader v-if="dataLoader" />
        <div v-else>
          <div class="d-flex justify-end">
            <v-btn
              :loading="loader"
              text
              v-if="
                currentWorkspace.isAccountingSoftConnected &&
                currentWorkspace.rewriteInvoice &&
                user.role == 'client' &&
                (ticket.draft || ticket.status === 'Complete')
              "
              class="fs-15 mr-2 cursor-pointer primary--text text-capitalize fw-600"
              @click="submitInvoices()"
            >
              Submit Invoice<span class="text-lowercase">(s)</span>
            </v-btn>
          </div>
          <Form
            :draft="dataDraft"
            :ticket="ticketData"
            @new-invoice-object="setNewInvoiceObject"
          />
          <!-- <NoDraft v-else :ticket="ticketData" /> -->
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Button from "../common/button/index.vue";
import UrlServices from "../../services/Url";
import ApiService from "../../services/Api";
import axios from "axios";
import EventBus from "../../js/EventBus.js";
import Form from "./xero-form/FormInvoices.vue";
import Loader from "./xero-form/Loader.vue";
import NoDraft from "./xero-form/NoDraft.vue";
import Dialog from "../../components/common/dialog-box/index.vue";
export default {
  name: "XeroForm",
  components: {
    Button,
    Form,
    Loader,
    NoDraft,
    Dialog,
  },
  data() {
    return {
      /*
       ** Variables used for previewing Data
       */
      xeroHashMaps: {
        accountsHashmap: { ids: {}, all: [] },
        itemsHashmap: { ids: {}, all: [] },
      },
      ticketData: {},
      loader: false,
      modalValue: false,
      /*
       ** Variables used for xero Form
       */
      dataLoader: true,
      dataDraft: null,
      invoicesArr: [],
      draftArr: [],
      submittedData: false,
    };
  },
  props: {
    ticket: Object,
  },
  computed: {
    ...mapGetters({
      currentWorkspace: "auth/getCurrentWorkspace",
      token: "auth/getAuthToken",
      user: "auth/getUser",
    }),
  },
  mounted() {
    console.log(this.ticket);
    this.ticketData = this.ticket;
    /*
     ** Get Latest Details on Mount if api is not called
     */
    if (!this.dataDraft) this.getLatestDetails(this.ticket._id);
    EventBus.$on("get-xerohashmaps", (xerohashmaps) => {
      this.xeroHashMaps = xerohashmaps;
    });
  },
  methods: {
    setNewInvoiceObject(invoiceObj) {
      this.dataDraft = invoiceObj;
    },
    closeChatMiniFunctionForXeroForm() {
      this.modalValue = false;
      this.$router.push("/integration");
    },
    /**
     * This function submit invoices on Xero
     */
    async submitInvoices() {
      this.loader = true;
      const percentLookupRegex = /^%|%$/g;
      let inv = JSON.parse(JSON.stringify(this.dataDraft));
      let draft = JSON.parse(JSON.stringify(this.dataDraft));
      let invoices = inv.invoices;
      let draftInvoices = draft.invoices;
      // Declare hashmaps for unique Items and unique Accounts
      // Declare empty arrays for unique Items and unique Accounts
      const uniqueAccountsHashMap = {},
        uniqueAccounts = [];
      for (let i = 0; i < invoices.length; i++) {
        const { subTotal, totalTax, total, ...ele } = invoices[i];
        ele.name = ele.hasOwnProperty("name") ? ele.name : "";

        /**
         * xeroform header fields validations here
         */
        if (!ele.invoiceNumber) {
          this.loader = false;
          return this.$showNotificationBar(
            "error",
            `Invoice number is required`
          );
        }
        if (!ele.name) {
          this.loader = false;
          return this.$showNotificationBar("error", `Name is required`);
        }
        if (!ele.date) {
          this.loader = false;
          return this.$showNotificationBar("error", `Date is required`);
        }
        if (!ele.dueDate) {
          this.loader = false;
          return this.$showNotificationBar("error", `Due date is required`);
        }
        // xeroform header fields validations END

        if (Array.isArray(ele.lineItems)) {
          for (
            let lineItemIndex = 0;
            lineItemIndex < ele.lineItems.length;
            lineItemIndex++
          ) {
            const r = ele.lineItems[lineItemIndex];
            /**
             * Remove the duplication of all accounts with user accounts
             * and add the unique accounts in uniqueAccounts array
             */
            if (
              r.accountCode?.name &&
              !uniqueAccountsHashMap[r.accountCode.name]
            ) {
              uniqueAccounts.push({
                name: r.accountCode.name,
                type: r.accountCode.type,
              });
              uniqueAccountsHashMap[r.accountCode.name] = true;
            }
            console.log("uniqueAccounts and uniqueItems>>>", uniqueAccounts);

            // xeroform lineitems accountCode & itemCode validations here
            if (r.itemCode.id && !r.accountCode) {
              r.itemCode.id = "";
              //   this.loader = false;
              //   return this.$showNotificationBar(
              //     "error",
              //     `Account code is required`
              //   );
            }

            // xeroform lineitems validations here
            if (!r.description) {
              this.loader = false;
              return this.$showNotificationBar(
                "error",
                `Description is required`
              );
            }
            r.disc == "" ? (r.disc = "0") : r.disc;
            r.taxAmount == "" ? (r.taxAmount = "0") : r.taxAmount;

            if (r.itemCode.id === "") delete r["itemCode.id"];
            r["taxAmount"] =
              typeof r["taxAmount"] === "string"
                ? r["taxAmount"].replace(percentLookupRegex, "")
                : r["taxAmount"];
            if (ele.type == "ACCREC") {
              r["discountRate"] =
                typeof r.disc === "string"
                  ? r.disc.replace(percentLookupRegex, "")
                  : r.disc;
            } else {
              delete r["taxRate"];
              delete r["discountRate"];
              delete r.disc;
            }
          }
        } else ele.lineItems = [];

        /**
         * xeroform footer fields validations here
         */
        if (!ele.currencyCode) {
          this.loader = false;
          return this.$showNotificationBar("error", `Currency is required`);
        }
        // xeroform footer fields validations END
      }
      let userAccountsHashMapNameToCode = {};
      // Dispatch createAccountsToXero API here to get user's accounts name to code
      if (uniqueAccounts.length) {
        console.log(uniqueAccounts);
        userAccountsHashMapNameToCode = await ApiService.PutRequest(
          `${UrlServices.createAccountsToXero}/${this.currentWorkspace.workspaceId}`,
          {
            accounts: uniqueAccounts,
          }
        ).then((response) => response.data);
      }

      // Display snackbar "Accounts are created to Xero"
      const uniqueItems = [],
        uniqueItemsHashMap = {};
      for (let i = 0; i < invoices.length; i++) {
        const { lineItems } = invoices[i];
        if (Array.isArray(lineItems)) {
          for (
            let lineItemIndex = 0;
            lineItemIndex < lineItems.length;
            lineItemIndex++
          ) {
            const currentLineItem = lineItems[lineItemIndex];
            console.log("curentLineItems>>>", currentLineItem);
            /**
             * Conversion of accounts code to item names
             */
            if (currentLineItem.accountCode) {
              currentLineItem.accountCode =
                userAccountsHashMapNameToCode[currentLineItem.accountCode.name];
            }
            /**
             * Remove the duplication of all items with user items
             * and add the unique items in uniqueItems array
             */
            if (
              currentLineItem.itemCode.id &&
              !uniqueItemsHashMap[currentLineItem.itemCode.id]
            ) {
              console.log(this.xeroHashMaps.itemsHashmap.ids);
              uniqueItems.push({
                name: this.xeroHashMaps.itemsHashmap.ids[
                  currentLineItem.itemCode.id
                ]?.name,
                code: `bot-${currentLineItem.itemCode.id}`,
              });
              uniqueItemsHashMap[currentLineItem.itemCode.id] = true;
              // Fixed 'price List Item Code must not be more than than 30 characters long'
              if (currentLineItem?.itemCode.id?.includes("bot-bot-")) {
                currentLineItem.itemCode.id =
                  currentLineItem.itemCode.id.slice(4);
              }
            }
            /**
             * Conversion of `itemCode` to `bot-itemCode`
             */
            if (currentLineItem.itemCode.id)
              currentLineItem.itemCode.id = `bot-${currentLineItem.itemCode.id}`;
            // Fixed 'price List Item Code must not be more than than 30 characters long'
            if (currentLineItem?.itemCode.id?.includes("bot-bot-")) {
              currentLineItem.itemCode.id =
                currentLineItem.itemCode.id.slice(4);
            }
          }
        }
      }

      // Fixed 'price List Item Code must not be more than than 30 characters long'
      uniqueItems.forEach((ele) => {
        if (ele?.code?.includes("bot-bot-")) {
          ele.code = ele.code.slice(4);
        }
      });

      // trim the contact name in the invoices
      // as xero does not accept whitespace from both sides of a contact name
      invoices.forEach((e) => {
        let trimContactName = "";
        trimContactName = e.name.trim();
        e.name = trimContactName;

        // Here sets the formats of the lineItem fields
        e.lineItems.forEach((el) => {
          el.quantity = parseFloat(el.quantity);
          el.unitAmount = parseFloat(el.unitAmount);
          el.disc = parseFloat(el.disc);
          el.discountRate = parseFloat(el.discountRate);
          el.taxAmount = parseFloat(el.taxAmount);
          el.lineAmount = parseFloat(el.lineAmount);
        });
        e.subTotal = parseFloat(e.subTotal);
        e.totalTax = parseFloat(e.totalTax);
        e.total = parseFloat(e.total);
      });

      this.setXeroKeys(invoices);
      this.setDraftKeys(draftInvoices);

      // return promise to submit invoices on Xero
      return ApiService.PostRequest(
        `${UrlServices.submitInvoices}${this.currentWorkspace.workspaceId}`,
        {
          invoices: this.invoicesArr,
          ticketId: this.ticket._id,
          draft: { invoices: this.draftArr },
          items: uniqueItems,
        }
      )
        .then((res) => {
          this.loader = false;
          this.submittedData = true;
          this.$emit('submitted-data', this.submittedData);
          return this.$showNotificationBar(
            "success",
            `Response has been submitted`
          );
        })
        .catch((e) => {
          console.log("err", e);
          this.loader = false;
          return this.$showNotificationBar("error", e?.response?.data?.message);
        });
    },
    /**
     * get Latest Ticket Details
     */
    async getLatestDetails(ticketId) {
      try {
        let config = {
          method: "get",
          url: `${UrlServices.getTicketDetails}${ticketId}`,
          data: {
            status: status,
          },
          headers: {
            Authorization: this.token,
          },
        };
        let response = await axios(config);
        this.dataLoader = false;
        if (response?.data?.ticket?.draft)
          this.dataDraft = response?.data?.ticket?.draft;
        if (this.ticket?.draft) {
          this.dataDraft = this.setFieldValuesToNumberField(this.dataDraft);
          this.setLineItemsAndCalculations();
        }
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * This function sets the formats of the lineItem fields at the time of get draft data
     * @param {*} draftObj
     */
    setFieldValuesToNumberField(draftObj) {
      draftObj.invoices.forEach((e) => {
        e.lineItems.forEach((el) => {
          el.quantity = parseFloat(el.quantity);
          el.unitAmount = parseFloat(el.unitAmount);
          el.disc = parseFloat(el.disc);
          el.discountRate = parseFloat(el.discountRate);
          el.taxAmount = parseFloat(el.taxAmount);
          el.lineAmount = parseFloat(el.lineAmount);
        });
        e.subTotal = parseFloat(e.subTotal);
        e.totalTax = parseFloat(e.totalTax);
        e.total = parseFloat(e.total);
      });
      console.log("inside function", draftObj);
      return draftObj;
    },

    /**
     * This function sets lineItem fields and calculations according to them
     */
    setLineItemsAndCalculations() {
      this.dataDraft.invoices.forEach((e) => {
        e.lineItems.forEach((el) => {
          el.disc = el.disc ? el.disc : 0;
          el.discountRate = el.discountRate ? el.discountRate : 0;
          el.taxAmount = el.taxAmount ? el.taxAmount : 0;
          el.taxType = el.taxType ? el.taxType : "";
        });
      });
      this.calcTotalAmount(this.dataDraft.invoices);
      this.calcSubTotal(this.dataDraft.invoices);
      this.calcTotalTax(this.dataDraft.invoices);
      this.calcTotal(this.dataDraft.invoices);
    },

    /**
     * This function sets the permanent payload keys for Xero
     */
    setXeroKeys(invoices) {
      this.invoicesArr = [];
      for (let index = 0; index < invoices.length; ++index) {
        const invoiceObj = {};
        const invoice = invoices[index];

        invoiceObj["address"] = invoice["address"] ? invoice["address"] : "";
        invoiceObj["name"] = invoice["name"] ? invoice["name"] : "";
        invoiceObj["invoiceNumber"] = invoice["invoiceNumber"]
          ? invoice["invoiceNumber"]
          : "";
        invoiceObj["email"] = invoice["email"] ? invoice["email"] : "";
        invoiceObj["date"] = invoice["date"] ? invoice["date"] : "";
        invoiceObj["dueDate"] = invoice["dueDate"] ? invoice["dueDate"] : "";
        invoiceObj["expectedPaymentDate"] = invoice["expectedPaymentDate"]
          ? invoice["expectedPaymentDate"]
          : "";
        invoiceObj["plannedPaymentDate"] = invoice["plannedPaymentDate"]
          ? invoice["plannedPaymentDate"]
          : "";
        invoiceObj["type"] = invoice["type"] ? invoice["type"] : "";
        invoiceObj["invType"] = invoice["invType"] ? invoice["invType"] : "";
        invoiceObj["brandingThemeID"] = invoice["brandingThemeID"]
          ? invoice["brandingThemeID"]
          : "";
        invoiceObj["lineAmountTypes"] = invoice["lineAmountTypes"]
          ? invoice["lineAmountTypes"]
          : "";
        invoiceObj["status"] = invoice["status"] ? invoice["status"] : "";
        invoiceObj["lineItems"] = invoice["lineItems"]
          ? invoice["lineItems"]
          : "";
        invoiceObj["currencyCode"] = invoice["currencyCode"]
          ? invoice["currencyCode"]
          : "";
        invoiceObj["subTotal"] = invoice["subTotal"] ? invoice["subTotal"] : "";
        invoiceObj["totalTax"] = invoice["totalTax"] ? invoice["totalTax"] : "";
        invoiceObj["total"] = invoice["total"] ? invoice["total"] : "";
        invoiceObj["reference"] = invoice["reference"]
          ? invoice["reference"]
          : "";
        if (invoice["url"]) invoiceObj["url"] = invoice["url"];

        invoiceObj["lineItems"] = invoice.lineItems.map((ele) => {
          if (invoiceObj["type"] == "ACCREC") {
            return {
              itemCode: ele.itemCode.id ? ele.itemCode.id : "",
              description: ele.description ? ele.description : "",
              quantity: ele.quantity ? ele.quantity : 0,
              unitAmount: ele.unitAmount ? ele.unitAmount : 0,
              disc: ele.disc ? ele.disc : 0,
              discountRate: ele.discountRate ? ele.discountRate : 0,
              taxAmount: ele.taxAmount ? ele.taxAmount : 0,
              accountCode: ele.accountCode ? ele.accountCode : "",
              taxType: ele.taxType ? ele.taxType : "",
              lineAmount: ele.lineAmount ? ele.lineAmount : 0,
            };
          } else {
            return {
              itemCode: ele.itemCode.id ? ele.itemCode.id : "",
              description: ele.description ? ele.description : "",
              quantity: ele.quantity ? ele.quantity : 0,
              unitAmount: ele.unitAmount ? ele.unitAmount : 0,
              taxAmount: ele.taxAmount ? ele.taxAmount : 0,
              accountCode: ele.accountCode ? ele.accountCode : "",
              taxType: ele.taxType ? ele.taxType : "",
              lineAmount: ele.lineAmount ? ele.lineAmount : 0,
            };
          }
        });
        this.invoicesArr.push(invoiceObj);
      }
    },
    setDraftKeys(invoices) {
      this.draftArr = [];
      for (let index = 0; index < invoices.length; ++index) {
        const invoiceObj = {};
        const invoice = invoices[index];

        invoiceObj["address"] = invoice["address"] ? invoice["address"] : "";
        invoiceObj["name"] = invoice["name"] ? invoice["name"] : "";
        invoiceObj["invoiceNumber"] = invoice["invoiceNumber"]
          ? invoice["invoiceNumber"]
          : "";
        invoiceObj["email"] = invoice["email"] ? invoice["email"] : "";
        invoiceObj["date"] = invoice["date"] ? invoice["date"] : "";
        invoiceObj["dueDate"] = invoice["dueDate"] ? invoice["dueDate"] : "";
        invoiceObj["expectedPaymentDate"] = invoice["expectedPaymentDate"]
          ? invoice["expectedPaymentDate"]
          : "";
        invoiceObj["plannedPaymentDate"] = invoice["plannedPaymentDate"]
          ? invoice["plannedPaymentDate"]
          : "";
        invoiceObj["type"] = invoice["type"] ? invoice["type"] : "";
        invoiceObj["invType"] = invoice["invType"] ? invoice["invType"] : "";
        invoiceObj["brandingThemeID"] = invoice["brandingThemeID"]
          ? invoice["brandingThemeID"]
          : "";
        invoiceObj["lineAmountTypes"] = invoice["lineAmountTypes"]
          ? invoice["lineAmountTypes"]
          : "";
        invoiceObj["status"] = invoice["status"] ? invoice["status"] : "";
        invoiceObj["lineItems"] = invoice["lineItems"]
          ? invoice["lineItems"]
          : "";
        invoiceObj["currencyCode"] = invoice["currencyCode"]
          ? invoice["currencyCode"]
          : "";
        invoiceObj["subTotal"] = invoice["subTotal"] ? invoice["subTotal"] : "";
        invoiceObj["totalTax"] = invoice["totalTax"] ? invoice["totalTax"] : "";
        invoiceObj["total"] = invoice["total"] ? invoice["total"] : "";
        invoiceObj["reference"] = invoice["reference"]
          ? invoice["reference"]
          : "";
        if (invoice["url"]) invoiceObj["url"] = invoice["url"];

        invoiceObj["lineItems"] = invoice.lineItems.map((ele) => {
          if (invoiceObj["type"] == "ACCREC") {
            return {
              itemCode: ele.itemCode ? ele.itemCode : "",
              description: ele.description ? ele.description : "",
              quantity: ele.quantity ? ele.quantity : 0,
              unitAmount: ele.unitAmount ? ele.unitAmount : 0,
              disc: ele.disc ? ele.disc : 0,
              discountRate: ele.discountRate ? ele.discountRate : 0,
              taxAmount: ele.taxAmount ? ele.taxAmount : 0,
              accountCode: ele.accountCode ? ele.accountCode : "",
              taxType: ele.taxType ? ele.taxType : "",
              lineAmount: ele.lineAmount ? ele.lineAmount : 0,
            };
          } else {
            return {
              itemCode: ele.itemCode ? ele.itemCode : "",
              description: ele.description ? ele.description : "",
              quantity: ele.quantity ? ele.quantity : 0,
              unitAmount: ele.unitAmount ? ele.unitAmount : 0,
              taxAmount: ele.taxAmount ? ele.taxAmount : 0,
              accountCode: ele.accountCode ? ele.accountCode : "",
              taxType: ele.taxType ? ele.taxType : "",
              lineAmount: ele.lineAmount ? ele.lineAmount : 0,
            };
          }
        });
        this.draftArr.push(invoiceObj);
      }
    },

    /**
     * This function calculates the total lineAmount in every lineitem
     * @param {*} invoiceItem
     */
    calcTotalAmount(invoiceItem) {
      let total = 0;
      invoiceItem.forEach((inv) => {
        inv.lineItems.forEach((el) => {
          if (isNaN(el.quantity)) el.quantity = 0;
          if (isNaN(el.unitAmount)) el.unitAmount = 0;
          // el.discountRate = 0;
          // el.taxAmount = 0;
          if (typeof el.discountRate === "string")
            el.discountRate = el.discountRate.replace(/^%|%$/g, "");
          if (typeof el.taxAmount === "string")
            el.taxAmount = el.taxAmount.replace(/^%|%$/g, "");
          let x =
            invoiceItem.type === "ACCPAY"
              ? 1
              : (100 - Math.round(el.discountRate * 100) / 100) / 100;
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
      invoiceItem.forEach((inv) => {
        let invoiceSubTotal = 0;
        inv.lineItems.forEach((el) => {
          let totalLineAmount = Number(el.lineAmount);
          invoiceSubTotal += totalLineAmount;
        });
        inv["subTotal"] = Math.round(invoiceSubTotal * 100) / 100;
      });
    },

    /**
     * This function calculates the totalTax in footer
     * @param {*} invoiceItem
     */
    calcTotalTax(invoiceItem) {
      invoiceItem.forEach((inv) => {
        let invoiceTotalTax = 0;
        if (inv.lineAmountTypes == "Exclusive") {
          inv.lineItems.forEach((el) => {
            if (!el.taxAmount && el.taxAmount == undefined) el.taxAmount = 0;
            let totalTaxAmount = Number(el.taxAmount);
            invoiceTotalTax += totalTaxAmount;
          });
          inv["totalTax"] = Math.round(invoiceTotalTax * 100) / 100;
        } else {
          inv["totalTax"] = Math.round(invoiceTotalTax * 100) / 100;
        }
      });
    },

    /**
     * This function calculates final total(subTotal+totalTax) in footer
     * @param {*} invoiceItem
     */
    calcTotal(invoiceItem) {
      invoiceItem.forEach((inv) => {
        let total = 0;
        total = Number(inv.subTotal) + Number(inv.totalTax);
        inv["total"] = Math.round(total * 100) / 100;
      });
    },
  },

  // component beforeDestroy hook
  beforeDestroy() {
    console.log("checking if destroy is working or not ");
    // this.modalValue = true;
    // console.log(this.modalValue)

    // let text = "Press a button!\nEither OK or Cancel.";
    // if (confirm(text) == true) {
    //   text = "You pressed OK!";
    // } else {
    //   text = "You canceled!";
    // }
  },
};
</script>
