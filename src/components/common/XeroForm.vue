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
      <v-col
        class="ma-0 pa-0 documents-view"
        v-if="$vuetify.breakpoint.lg && ticket?.attachmentName"
        cols="4"
      >
        <XeroFormFilePreview
          :data="data"
          :file="file"
          :selectedFile="selectedFile"
        />
      </v-col>
      <!-- Open Form -->
      <v-col
        class="ma-0 pa-0"
        :cols="$vuetify.breakpoint.lg && ticket?.attachmentName ? 8 : 12"
      >
        <Loader v-if="dataLoader" />
        <div v-else>
          <div v-if="dataDraft" class="d-flex justify-end mb-2">
            <Button
              v-if="
                currentWorkspace.isAccountingSoftConnected &&
                currentWorkspace.rewriteInvoice &&
                user.role == 'client'
              "
              @button-clicked="submitInvoices"
              :loader="loader"
              class="mr-2"
              color="primary"
            >
              <template v-slot:buttonHeading>
                <p class="ma-0 pa-0 white--text text-capitalize">
                  Submit Invoice<span class="text-lowercase">(s)</span>
                </p>
              </template>
            </Button>
            <Button
              v-if="
                !currentWorkspace.isAccountingSoftConnected &&
                user.role == 'client'
              "
              @button-clicked="modalValue = true"
              class="mr-2"
              color="primary"
            >
              <template v-slot:buttonHeading>
                <p class="ma-0 pa-0 white--text">Connect Xero</p>
              </template>
            </Button>
          </div>
          <Form v-if="dataDraft" :draft="dataDraft" />
          <NoDraft v-else :ticket="ticketData"/>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import moment from "moment";
import Button from "../common/button/index.vue";
import UrlServices from "../../services/Url";
import ApiService from "../../services/Api";
import axios from "axios";
import EventBus from "../../js/EventBus.js";
import XeroFormFilePreview from "./xero-form/XeroFormFilePreview.vue";
import Form from "./xero-form/Form.vue";
import Loader from "./xero-form/Loader.vue";
import NoDraft from "./xero-form/NoDraft.vue";
import Dialog from "../../components/common/dialog-box/index.vue";
export default {
  name: "XeroForm",
  components: {
    Button,
    XeroFormFilePreview,
    Form,
    Loader,
    NoDraft,
    Dialog
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
      data: false,
      file: null,
      selectedFile: {},
      /*
       ** Variables used for xero Form
       */
      dataLoader: true,
      dataDraft: null,
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
     ** Show attachment
     */
    if (this.ticket?.attachmentName && !this.file) {
      this.openAttachedDocument(this.ticket);
    }
    /*
     ** Get Latest Details on Mount if api is not called
     */
    if (!this.draft) this.getLatestDetails(this.ticket._id);
    EventBus.$on("get-xerohashmaps", (xerohashmaps) => {
      this.xeroHashMaps = xerohashmaps;
    });
  },
  methods: {
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
          return this.$showNotificationBar("error", `Created at is required`);
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
            if (r.itemCode && !r.accountCode) {
              this.loader = false;
              return this.$showNotificationBar(
                "error",
                `Account code is required`
              );
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

            if (r.itemCode === "") delete r["itemCode"];
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
              currentLineItem.itemCode &&
              !uniqueItemsHashMap[currentLineItem.itemCode]
            ) {
              console.log(this.xeroHashMaps.itemsHashmap.ids);
              uniqueItems.push({
                name: this.xeroHashMaps.itemsHashmap.ids[
                  currentLineItem.itemCode
                ].name,
                code: `bot-${currentLineItem.itemCode}`,
              });
              uniqueItemsHashMap[currentLineItem.itemCode] = true;
            }
            /**
             * Conversion of `itemCode` to `bot-itemCode`
             */
            if (currentLineItem.itemCode)
              currentLineItem.itemCode = `bot-${currentLineItem.itemCode}`;
          }
        }
      }

      // trim the contact name in the invoices
      // as xero does not accept whitespace from both sides of a contact name
      invoices.forEach((e) => {
        let trimContactName = '';
        trimContactName = e.name.trim();
        e.name = trimContactName;

        // Here sets the formats of the lineItem fields
        e.lineItems.forEach((el) => {
          el.quantity = parseInt(el.quantity);
          el.unitAmount = parseFloat(el.unitAmount);
          el.disc = parseFloat(el.disc);
          el.taxAmount = parseFloat(el.taxAmount);
          el.lineAmount = parseFloat(el.lineAmount);
        })
        e.subTotal = parseFloat(e.subTotal);
        e.totalTax = parseFloat(e.totalTax);
        e.total = parseFloat(e.total);
      })

      // return promise to submit invoices on Xero
      return ApiService.PostRequest(
        `${UrlServices.submitInvoices}${this.currentWorkspace.workspaceId}`,
        {
          invoices,
          ticketId: this.ticket._id,
          draft: draft,
          items: uniqueItems,
        }
      )
      .then((res) => {
        this.loader = false;
        return this.$showNotificationBar("success", `Response has been submitted`);
      })
      .catch((e) => {
        console.log('err',e);
        this.loader = false;
        return this.$showNotificationBar("error", e?.response?.data?.message);
      });
  },
    /*
     ** Preview Functions to get Preview
     */
    async openAttachedDocument(ticket) {
      let obj = {
        _id: ticket._id,
        file: {
          originalname: ticket.attachmentName
            ? ticket.attachmentName
            : `Attached File.${ticket.attachmentUrl.split(".").pop()}`,
        },
        createdAt: ticket.createdAt,
        fileUrl: ticket.attachmentUrl,
      };
      this.selectedFile = obj;
      await this.openPrivateUrl(this.selectedFile.fileUrl);
    },
    async openPrivateUrl(url) {
      this.tokenValidation()
        .then(() => {
          var data = {
            token:
              this.currentWorkspace.source === "slack"
                ? this.currentWorkspace.botToken
                : "test-string",
          };
          data["file"] =
            url.search("files/") > -1
              ? url
              : url.split("https://files.slack.com/")[1];
          let mytoken = this.token;
          mytoken = mytoken.substring(7);
          this.file = `${process.env.VUE_APP_BACK_END_URL}${UrlServices.slack}/${mytoken}?file=${data?.file}`;
          this.data = true;
        })
        .catch((err) => {
          console.log("openPrivateUrl ===> ", err);
        });
    },
    async tokenValidation() {
      let configToken = {
        method: "get",
        url: "/user/verify-token",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      };
      return axios(configToken);
    },
    /*
     ** get Latest Ticket Details
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
          this.dataDraft = this.setFieldValuesToNumberField(this.dataDraft);
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
          el.quantity = parseInt(el.quantity);
          el.unitAmount = parseFloat(el.unitAmount);
          el.disc = parseFloat(el.disc);
          el.taxAmount = parseFloat(el.taxAmount);
          el.lineAmount = parseFloat(el.lineAmount);
        })
        e.subTotal = parseFloat(e.subTotal);
        e.totalTax = parseFloat(e.totalTax);
        e.total = parseFloat(e.total);
      })
      console.log('inside function', draftObj);
      return draftObj;
    }
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

<style scoped></style>
