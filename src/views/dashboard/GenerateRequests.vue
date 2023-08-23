<template>
  <div class="listing" style="margin-top: 5px !important">
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
    <div class="header ticket-row mt-1" v-if="$vuetify.breakpoint.lg">
      <p class="textPrimary--text fs-20 fw-600 textPrimary--text f-inter">
        Request History
      </p>
      <div class="action">
        <!-- show all filters which have been applied -->
        <p
          class="mt-3 mr-2 mb-0 dark--text fw-12 fw-400"
          v-if="clearFilterValue"
        >
          Filter By:
        </p>
        <ShowFilters :filtersData="filtersData" v-if="clearFilterValue" />
        <v-btn
          v-if="clearFilterValue"
          class="text-capitalize clear-btn mr-3 mt-6 mb-0"
          color="primary"
          depressed
          width="108"
          height="38"
          text
          @click="clearFilter()"
          ><span class="fw-600 fs-13 black--text mb-0"
            >Clear Filter
          </span></v-btn
        >
        <v-select
          :disabled="clearFilterValue"
          :items="items"
          class="request-filter"
          label="All"
          solo
          dense
          v-model="status"
          item-text="label"
          item-value="value"
          value="item"
          @change="getTicketsbyStatus"
        ></v-select>
        <!-- <FilterButton/> -->
        <v-btn
          id="v-step-2"
          class="create-btn f-inter fw-600 fs-14"
          @click="$router.push({ path: 'generate-request' })"
          ><v-img src="@/assets/ticket/receipt.svg"></v-img>Record Now</v-btn
        >
      </div>
    </div>

    <!-- This code insert in DOM when application open in mobile -->

    <div
      class="row action header justify-space-between mt-16 ticket-row"
      v-if="!$vuetify.breakpoint.lg"
      style="width: 90% !important"
    >
      <div class="" cols="12" col-sm="12" col-md="6" col-lg="6">
        <p class="black--text fs-20 fw-600">Request History</p>
      </div>
      <div class="" cols="12" col-sm="12" col-md="6" col-lg="6">
        <v-btn
          class="create-btn"
          @click="$router.push({ path: 'generate-request' })"
          ><v-img src="@/assets/ticket/receipt.svg"></v-img>Record Now</v-btn
        >
      </div>
      <div
        class="ma-0 pa-0 w-100 mt-3"
        cols="12"
        col-sm="12"
        col-md="6"
        col-lg="6"
      >
        <v-select
          :disabled="clearFilterValue"
          :items="items"
          class="request-filter"
          label="All"
          solo
          dense
          v-model="status"
          item-text="label"
          item-value="value"
          value="item"
          @change="getTicketsbyStatus"
          hide-details=""
        ></v-select>
      </div>
      <div class="w-100" cols="12" col-sm="12" col-md="6" col-lg="6">
        <!-- show all filters which have been applied -->
        <div class="d-flex justify-space-between">
          <p
            class="mt-3 mr-2 mb-0 dark--text fw-12 fw-400"
            v-if="clearFilterValue"
          >
            Filter By:
          </p>
          <p>
            <v-btn
              v-if="clearFilterValue"
              class="text-capitalize clear-btn mr-3 mt-6 mb-0"
              color="primary"
              depressed
              width="108"
              height="38"
              text
              @click="clearFilter()"
              ><span class="fw-600 fs-13 black--text mb-0"
                >Clear Filter
              </span></v-btn
            >
          </p>
        </div>
        <ShowFilters :filtersData="filtersData" v-if="clearFilterValue" />
      </div>
    </div>
    <div>
      <v-data-table
        id="v-step-5"
        :headers="headers"
        :items="tickets"
        :hide-default-footer="true"
        :loading="loader"
        fixed-header
        :height="tickets.length > 10 ? '550px' : ''"
        :itemsPerPage="paginate.itemsPerPage"
        :class="$vuetify.breakpoint.lg ? 'table' : 'mobile-table'"
      >
        <template v-slot:[`item.createdAt`]="{ item }">
          <span class="textPrimary--text fw-500 fs-13 f-inter">
            {{ item.createdAt | formatDate }}
            /
            {{ item.createdAt | formatTime }}
          </span>
        </template>

        <template v-slot:[`item.message`]="{ item }">
          <div
            class="cursor-pointer ticket-description textPrimary--text fw-600 f-inter fs-13"
            @click="$vuetify.breakpoint.lg ? openMessageDialog(item) : ''"
          >
            {{ item.message }}
          </div>
        </template>

        <template v-slot:[`item.ticketNo`]="{ item }">
          <div class="cursor-pointer textPrimary--text fw-500 fs-13 f-inter">
            <span @click="copyText(item.ticketNo)">{{ item.ticketNo }}</span>

            <!-- <v-icon class="material-icons" color="primary" small
            >content_copy</v-icon
          > -->
          </div>
        </template>

        <template v-slot:[`item.requestType`]="{ item }">
          <div
            class="cursor-pointer textPrimary--text fw-600 fs-13 f-inter"
            @click="$vuetify.breakpoint.lg ? openMessageDialog(item) : ''"
          >
            {{ changeStringToSentenceCase(item.requestType) }}
          </div>
        </template>

        <template v-slot:[`item.status`]="{ item }">
          <div class="d-flex">
            <v-chip
              v-if="item.status == 'Complete'"
              class="complete-chip px-5 f-inter fw-600 fs-12"
              small
              >Complete</v-chip
            >
            <v-chip
              v-else-if="item.status == 'InProgress'"
              class="in-progress-chip px-5 f-inter fw-600 fs-12"
              small
              >In Progress</v-chip
            >
            <v-chip
              v-else-if="item.status == 'AwaitingResponse'"
              class="awaiting-response-chip px-5 f-inter fw-600 fs-12"
              small
              >Awaiting Response</v-chip
            >
            <v-chip
              v-else-if="item.status == 'ClientResponded'"
              class="client-responded-chip px-5 f-inter fw-600 fs-12"
              small
              >Responded</v-chip
            >
            <v-chip
              v-else-if="item.status == 'ReviewRequest'"
              class="review-request-chip px-5 f-inter fw-600 fs-12"
              small
              >Review Request</v-chip
            >

            <v-chip
              v-else-if="item.status == 'Audit'"
              class="audit-chip px-5 f-inter fw-600 fs-12"
              small
            >
              Audit
            </v-chip>

            <v-chip
              v-else-if="item.status == 'Rejected'"
              class="rejected-chip px-5 f-inter fw-600 fs-12"
              small
            >
              Rejected
            </v-chip>

            <v-chip v-else class="pending-chip px-5 f-inter fw-600 fs-12" small
              >Pending</v-chip
            >
            <div
              v-if="
                item.reviewFromSupervisorByClient && item.status != 'Complete'
              "
              class="ml-2"
            >
              <v-img
                height="24"
                width="24"
                src="@/assets/generate-request/review-request.svg"
              ></v-img>
            </div>
          </div>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <!-- if screen is lg then these actions will be show  -->
          <div class="actions">
            <v-badge
              v-if="
                item.unreadBy &&
                item.unreadBy[user._id] !== undefined &&
                item.unreadBy[user._id] > 0
              "
              :content="item.unreadBy[user._id]"
              class="message-icon cursor-pointer"
              bordered
              color="error"
              overlap
              @click.native="
                $vuetify.breakpoint.lg
                  ? openMessageDialog(item)
                  : openMobileMessageDialog(item)
              "
            >
              <v-img
                class="cursor-pointer"
                src="@/assets/dashboard/message.png"
                max-width="26"
              ></v-img>
            </v-badge>
            <v-img
              v-else
              class="cursor-pointer"
              @click="
                $vuetify.breakpoint.lg
                  ? openMessageDialog(item)
                  : openMobileMessageDialog(item)
              "
              src="@/assets/ticket/chat-dots.svg"
              max-width="16"
            ></v-img>

            <v-img
              class="cursor-pointer"
              src="@/assets/ticket/paper-clip.svg"
              @click="
                $vuetify.breakpoint.lg
                  ? openFilesDialog(item)
                  : openMobileFilesDialog(item)
              "
              max-width="16"
            ></v-img>
          </div>
        </template>
      </v-data-table>
    </div>
    <div :class="$vuetify.breakpoint.lg ? 'mt-16' : 'mobile-pagination'">
      <pagination
        :itemsPerPage="paginate.itemsPerPage"
        :page="paginate.page"
        :pageCount="paginate.lastPage"
        :totalCount="paginate.total"
        @next-page-change="getTickets($event)"
        @prev-page-change="getTickets($event)"
        @page-number-changed="getTickets($event)"
        @items-per-page-change="getTickets($event)"
      ></pagination>
    </div>
    <MessageBox
      :ticket="ticketDetails"
      @close-popup="closeChat"
      @file-sent="openMessageDialog(ticketDetails)"
      @review-request="reviewRequest(ticketDetails)"
      @audit-request="(val) => auditRequest(val, ticketDetails)"
      v-if="messageBoxDialog"
    ></MessageBox>
    <DocumentViewer
      :ticket="ticketDetails"
      @close-popup="filesDialog = false"
      v-if="filesDialog"
    ></DocumentViewer>

    <!-- for mobile -->

    <TicketChat
      v-if="mobileMessageDialog"
      @close-message-dialog="closeChat"
      :ticket="mobileTicket"
      @audit-request="(val) => auditRequest(val, ticketDetails)"
      @review-request="reviewRequest(ticketDetails)"
    >
    </TicketChat>
    <FilesDetail
      v-if="mobileFilesDialog"
      @close-file-dialog="mobileFilesDialog = false"
      :mobileFilesDialog="mobileFilesDialog"
      :ticket="ticketDetails"
    ></FilesDetail>
  </div>
</template>

<script>
import FilterButton from "../../components/common/FilterButton.vue";
import ShowFilters from "../../components/common/ShowFilters.vue";
import TicketChat from "../../components/mobile/generate_requests/TicketChat.vue";
import FilesDetail from "../../components/mobile/generate_requests/FilesDetail.vue";
import MessageBox from "../../components/common/MessageBox.vue";
import DocumentViewer from "../../components/common/DocumentViewer.vue";
import Pagination from "../../components/common/Pagination.vue";
import { mapGetters } from "vuex";
import UrlServices from "../../services/Url";
import axios from "axios";
import EventBus from "../../js/EventBus";
import socket from "../../services/SocketIo";
import Vue from "vue";
import ApiService from "../../services/Api";
import { isMobile } from "mobile-device-detect";
import Dialog from "../../components/common/dialog-box";

export default {
  name: "GenerateReports",
  components: {
    MessageBox,
    Pagination,
    DocumentViewer,
    FilterButton,
    ShowFilters,
    TicketChat,
    FilesDetail,
    Dialog,
  },
  data() {
    return {
      currentDevice: isMobile,
      mobileMessageDialog: false,
      mobileTicket: {},
      clearFilterValue: false,
      status: "All",
      tickets: [],
      loader: false,
      ticketDetails: {},
      createTicketDialog: false,
      messageBoxDialog: false,
      filesDialog: false,
      mobileFilesDialog: false,
      filtersData: [],
      dialog: {
        show: true,
        title: "Record Now",
        dialogType: "form",
        for: "create-ticket",
        inputs: [
          {
            name: "ticket_type",
            label: "Ticket type",
            placeholder: "Select ticket type",
            type: "select",
            options: ["Bill", "Voucher"],
            cols: 12,
            col_md: 12,
          },
          {
            name: "description",
            label: "Description",
            placeholder: "Enter Your Message Here...",
            type: "textarea",
            cols: 12,
            col_md: 12,
          },
        ],
      },
      headers: [
        {
          text: "Description",
          align: "start",
          sortable: false,
          value: "message",
        },
        { text: "Created At", value: "createdAt", sortable: false },
        { text: "Ticket No", value: "ticketNo", sortable: false },
        { text: "Type", value: "requestType", sortable: false },
        { text: "Status", value: "status", sortable: false, id: "v-step-5" },
        { text: "Action", value: "action", sortable: false },
      ],
      items: [
        {
          label: "All",
          value: "All",
        },
        {
          label: "Complete",
          value: "Complete",
        },
        {
          label: "Pending",
          value: "Pending",
        },
        {
          label: "In Progress",
          value: "InProgress",
        },
        {
          label: "Awaiting Response",
          value: "AwaitingResponse",
        },
        {
          label: "Responded",
          value: "ClientResponded",
        },
        {
          label: "Audit",
          value: "Audit",
        },
        {
          label: "Rejected",
          value: "Rejected",
        },
        // "All",
        // "Complete",
        // "Pending",
        // "InProgress",
        // "AwaitingResponse",
        // "ClientResponded",
        // "Assign",
      ],
      modalValue: false,
    };
  },
  created() {
    // employee tickets
    socket.on("employee-tickets", (body) => {
      if (
        this.token &&
        body.clientDetail._id === this.user._id &&
        this.currentWorkspace._id === body.workspace._id
      ) {
        this.getTickets(null);
      }
    });
    socket.on("ticket-status-update", (body) => {
      if (this.token) {
        if (
          // body.userId === this.user._id &&
          this.currentWorkspace.workspaceId === body.workspaceId
        ) {
          let index = this.tickets.findIndex((item) => item._id === body._id);
          if (index !== -1) Vue.set(this.tickets, index, body);
        }
      }
    });
    socket.on("update-tickets-in-employee-owner", (body) => {
      if (
        this.token &&
        body.clientDetail._id === this.user._id &&
        this.currentWorkspace._id === body.workspace._id
      ) {
        this.getTickets(null);
      }
    });
    socket.on("comment", (body) => {
      if (
        this.currentWorkspace._id === body.workspaceId
        // && body.userId !== this.user._id
      ) {
        let index = this.tickets.find((item) => item._id == body.ticketId);
        if (index !== undefined) {
          if (
            (this.messageBoxDialog || this.mobileMessageDialog) &&
            this.ticketDetails._id === body.ticketId
          )
            return;
          else {
            if (index.unreadBy && index.unreadBy[this.user._id] !== undefined)
              index.unreadBy[this.user._id] =
                index?.unreadBy[this.user._id] + 1;
            else {
              index["unreadBy"] = {};
              index.unreadBy[this.user._id] = 1;
            }
          }
        }
      }
    });
    EventBus.$on("ticket-for-audit", (ticket) => {
      if (this.currentDevice) {
        this.openMobileMessageDialog(ticket);
      } else {
        this.openMessageDialog(ticket);
      }
    });
    EventBus.$on("advance-search", () => {
      this.clearFilterValue = true;
      this.resetSomeData();
      this.getTickets(null);
    });
    EventBus.$on("global-search", () => {
      //this.resetSomeData();
      this.getTickets(null);
    });
    EventBus.$on("advance-search-filters-data", (data) => {
      this.clearFilterValue = true;
      this.filtersData = [];
      data.requestType.forEach((element) => {
        if (element.length > 1) {
          this.filtersData.push(element);
        }
      });
      data.searchStatus.forEach((ele) => {
        if (ele.length > 1) {
          this.filtersData.push(ele);
        }
      });

      data.dateRange.length > 0 ? this.filtersData.push(data.dateRange) : "";
      data.messageFilter.length > 0
        ? this.filtersData.push(data.messageFilter)
        : "";
    });
  },
  computed: {
    ...mapGetters({
      currentWorkspace: "auth/getCurrentWorkspace",
      paginate: "ticket/getPaginate",
      user: "auth/getUser",
      token: "auth/getAuthToken",
      advancedSearch: "ticket/getAdvancedSearch",
    }),
  },

  watch: {},
  mounted() {
    this.resetSomeData();
    this.getTickets(null);
    // if (localStorage.getItem("advanceRoute") == "true") this.clearFilterValue = true;
    /**
     * This below event calls only
     * when filtersData has minimum one object
     * clearFilterValue is true
     */
    EventBus.$on("clear-filters", () => {
      if (this.filtersData && this.clearFilterValue) {
        this.$router.go(this.$router.currentRoute);
        this.clearFilterValue = false;
      }
    });
  },
  beforeDestroy() {
    socket.off("employee-tickets");
    socket.off("update-tickets-in-employee-owner");
    socket.off("ticket-status-update");
    EventBus.$off("global-search");
    EventBus.$off("ticket-for-audit");
    this.resetSomeData();
    this.clearFilter(true);
  },
  methods: {
    //API Call
    async updateAuditRequest(status, ticketId) {
      let config = {
        method: "post",
        url: `${UrlServices.updatedAuditTicketStatus}${ticketId}`,
        data: {
          status: status,
        },
        headers: {
          Authorization: this.token,
        },
      };
      return await axios(config);
    },

    async auditRequest(status, ticket) {
      try {
        //Api Call
        let res = await this.updateAuditRequest(status, ticket._id);
        this.$showNotificationBar("success", "Audit Request has been updated");
        // set data here
        if (this.currentDevice) {
          this.openMobileMessageDialog(ticket);
        } else {
          this.openMessageDialog(ticket);
        }
      } catch (e) {
        this.$showNotificationBar("error", e?.message);
      }
    },
    copyText(text) {
      navigator.clipboard.writeText(text);

      this.$showNotificationBar("success", "Ticket No. has been copied!");
    },
    closeChat(payload) {
      if (!payload) return this.closeChatMiniFunctionForXeroForm();
      const {
        key1: xeroFormValue,
        key2: getComparisonValueBoolean,
        key3: submittedData,
      } = payload;
      if (xeroFormValue) {
        if (submittedData || getComparisonValueBoolean) {
          this.mobileMessageDialog = false;
          this.messageBoxDialog = false;
        } else if (!submittedData || !getComparisonValueBoolean)
          this.modalValue = true;
      } else {
        this.closeChatMiniFunctionForXeroForm();
      }
    },
    closeChatMiniFunctionForXeroForm() {
      this.modalValue = false;
      this.mobileMessageDialog = false;
      this.messageBoxDialog = false;
      this.mobileTicket = {};
      this.$store.dispatch(
        "ticket/setTicketAsReadable",
        this.ticketDetails,
        this.page
      );
      this.ticketDetails = {};
    },
    async reviewRequest(ticket) {
      this.reviewTicket(ticket);
    },
    changeStringToSentenceCase(item) {
      const arr = item.toLowerCase().split(" ");
      for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
      }
      return arr.join(" ");
    },
    seachFilter() {
      EventBus.$emit("search-filter");
    },
    clearFilter(val) {
      const obj = {
        dateRange: "",
        messageFilter: "",
        searchStatus: [],
        requestType: [],
      };
      this.$store.commit("ticket/setAdvancedSearch", obj);
      this.clearFilterValue = false;
      // localStorage.removeItem("advanceRoute");
      val ? "" : this.$router.go(this.$router.currentRoute);
    },
    async reviewTicket(ticket) {
      console.log(ticket._id);

      axios
        .get(`${UrlServices.reviewTicket}${ticket._id}`, {
          headers: {
            Authorization: this.token,
          },
        })
        .then((response) => {
          if (this.currentDevice) {
            this.openMobileMessageDialog(ticket);
          } else {
            this.openMessageDialog(ticket);
          }

          let index = this.tickets.findIndex(
            (item) => item._id === response.data.ticket._id
          );
          if (index !== -1) {
            Vue.set(this.tickets, index, response.data.ticket);
          }
          //this.$store.commit('ticket/updateSpecificTicket', response.data.ticket)
        })
        .catch((error) => {
          this.$showNotificationBar("error", error);
        });
    },
    async openMessageDialog(ticket) {
      try {
        if (ticket.isSeen == false || ticket.unreadBy[this.user._id] > 0) {
          // ticket message
          let newTicket = { ...ticket };
          if (
            newTicket.unreadBy &&
            newTicket.unreadBy[this.user._id] !== undefined &&
            newTicket.unreadBy[this.user._id] > 0
          ) {
            newTicket.unreadBy[this.user._id] = 0;
            let index = this.tickets.findIndex(
              (item) => item._id === ticket._id
            );
            if (index !== -1) Vue.set(this.tickets, index, newTicket);
          }
          // end Tickets
          this.$store
            .dispatch("ticket/setTicketAsReadable", ticket, this.page)
            .then((res) => {
              console.log("res here =>", res);
            })
            .catch((e) => console.log(e));
        }
        // let response = await ApiService.GetRequest(
        //   UrlServices.getTicketDetails + ticket._id
        // );
        let response = await ApiService.GetRequest(
          UrlServices.getTicketDetails + ticket._id
        );

        if (response.data && response.data.ticket)
          this.ticketDetails = response.data.ticket;

        if (this.currentDevice) {
          this.mobileMessageDialog = true;
        } else {
          this.messageBoxDialog = true;
        }
      } catch (error) {
        console.log("error in retrieving data", error.message);
      }
    },
    async openMobileMessageDialog(ticket) {
      try {
        if (ticket.isSeen == false || ticket.unreadBy[this.user._id] > 0) {
          // ticket message
          let newTicket = { ...ticket };
          if (
            newTicket.unreadBy &&
            newTicket.unreadBy[this.user._id] !== undefined &&
            newTicket.unreadBy[this.user._id] > 0
          ) {
            newTicket.unreadBy[this.user._id] = 0;
            let index = this.tickets.findIndex(
              (item) => item._id === ticket._id
            );
            if (index !== -1) Vue.set(this.tickets, index, newTicket);
          }
          // end Tickets
          this.$store
            .dispatch("ticket/setTicketAsReadable", ticket, this.page)
            .then((res) => {
              console.log("res here =>", res);
            })
            .catch((e) => console.log(e));
        }
        let response = await ApiService.GetRequest(
          UrlServices.getTicketDetails + ticket._id
        );
        if (response.data && response.data.ticket)
          this.ticketDetails = response.data.ticket;
        // this.messageBoxDialog = true;
        this.mobileMessageDialog = true;
        EventBus.$emit("open-chat-dialog", this.ticketDetails);
        this.mobileTicket = this.ticketDetails;
      } catch (error) {
        console.log("error in retrieving data", error.message);
      }
    },
    async openFilesDialog(ticket) {
      try {
        if (ticket.isSeen == false || ticket.unreadBy[this.user._id] > 0) {
          this.$store
            .dispatch("ticket/setTicketAsReadable", ticket, this.page)
            .then((res) => (this.tickets = res.data.tickets))
            .catch((e) => console.log(e, "er1"));
        }
        let response = await ApiService.GetRequest(
          UrlServices.getTicketDetails + ticket._id
        );
        if (response.data && response.data.ticket)
          this.ticketDetails = response.data.ticket;
        this.filesDialog = true;
      } catch (error) {
        console.log("error in retrieving data", error.message);
      }
    },
    async openMobileFilesDialog(ticket) {
      try {
        if (ticket.isSeen == false || ticket.unreadBy[this.user._id] > 0) {
          this.$store
            .dispatch("ticket/setTicketAsReadable", ticket, this.page)
            .then((res) => (this.tickets = res.data.tickets))
            .catch((e) => console.log(e, "er1"));
        }
        // let response = await ApiService.GetRequest(
        //   UrlServices.getTicketDetails + ticket._id
        // );
        let response = await ApiService.GetRequest(
          UrlServices.getTicketDetails + ticket._id
        );

        if (response.data && response.data.ticket)
          this.ticketDetails = response.data.ticket;
        this.mobileFilesDialog = true;
      } catch (error) {
        console.log("error in retrieving data", error.message);
      }
    },
    getTickets(pgNo) {
      this.loader = true;
      this.$store.dispatch("ticket/getTasks", pgNo).then((res) => {
        this.tickets = res.data.tickets;
        this.loader = false;
      });
    },
    getTicketsbyStatus() {
      this.$store.commit("ticket/setStatus", this.status);
      this.getTickets(null);
    },
    resetSomeData() {
      this.$store.commit("ticket/setStatus", "All");
      this.$store.commit("ticket/setPaginate", {
        itemsPerPage: 10,
        page: 1,
        lastPage: 10,
        total: 100,
      });
    },
  },
};
</script>

<style lang="scss">
.table {
  top: 70px !important;
  position: relative;
}

.mobile-table {
  top: 160px !important;
  position: relative;
}

.mobile-pagination {
  margin-top: 180px !important;
}

.ticket-row {
  position: fixed !important;
  z-index: 3 !important;
  background: white;
  width: 96%;
}

.v-badge__badge {
  border-radius: 10px;
  color: #ffffff;
  display: inline-block;
  font-size: 9px;
  height: 13px;
  letter-spacing: 0;
  line-height: 1;
  padding: 2px 4px;
  min-width: 5px;
}
</style>

<style scoped>
::v-deep .v-chip.v-size--small {
  border-radius: 6px !important;
  justify-content: center !important;
}

.v-btn:not(.v-btn--round).v-size--default {
  height: 0px !important;
  border-radius: 8px !important;
}

.v-chip-group .v-slide-group__content {
  padding: 0px !important;
}

.w-100 {
  width: 100% !important;
}
</style>
