<template>
  <div class="text-center">
    <Dialog
      :modal="auditRequestDialog"
      @close-clicked="auditRequestDialog = false"
      @save-clicked="auditRequest()"
    >
      <template v-slot:header> Confirmation </template>
      <template v-slot:content>
        Please select the desired status
        <v-select
          hide-details
          label="Status*"
          background-color="inputBackground"
          class="text-no-wrap rounded-md custom"
          filled
          item-text="label"
          item-value="value"
          :items="ticketStatusForEmployees"
          v-model="ticketStatus"
        ></v-select>
      </template>
    </Dialog>
    <Dialog
      :modal="reviewRequestDialog"
      @close-clicked="reviewRequestDialog = false"
      @save-clicked="reviewRequest()"
    >
      <template v-slot:header> Confirmation </template>
      <template v-slot:content>
        Are you sure you want to review this ticket ?
      </template>
    </Dialog>
    <Dialog
      :modal="previewFileDialog.dialog"
      @close-clicked="closePreviewFileDialog()"
      width="1000px"
    >
      <template v-slot:header>
        Ticket ID {{ previewFileDialog.headingName }}
      </template>
      <template v-slot:content>
        <iframe
          :src="previewFileDialog.url"
          width="100%"
          height="800px"
          style="border: none"
        />
      </template>
      <template v-slot:doNotShowButtonHeadingSlot>true</template>
    </Dialog>
    <Dialog
      :modal="modalValue"
      @close-clicked="closeClickedDialogXeroForm"
      @save-clicked="saveClickedDialogXeroForm"
    >
      <template v-slot:header> Confirmation </template>
      <template v-slot:content>
        Are you sure you want to leave, all unsaved changes will be lost
      </template>
      <template v-slot:buttonHeading> Ok </template>
    </Dialog>
    <v-dialog
      v-model="showpopup"
      content-class="messagebox"
      width="100%"
      persistent
    >
      <v-row>
        <v-col md="12" cols="auto" class="messagebox-parent">
          <v-card-title class="d-flex justify-space-between pt-5 pb-0">
            <v-row>
              <v-col
                md="8"
                class="left-side-message-box"
                style="max-width: 69.98%; flex: 69.98%"
              >
                <div class="d-flex justify-space-between">
                  <p class="fs-19 fw-600 f-inter">
                    Ticket ID
                    <span class="fs-19 fw-500">{{ ticket.ticketNo }}</span>
                  </p>
                  <!-- <div
                    v-if="currentWorkspace.isAccountingSoftConnected &&
                      currentWorkspace.rewriteInvoice &&
                      user.role == 'client' &&
                      ticket.draft &&
                      detailtab == 0"
                    class="fs-16 mr-2 cursor-pointer primary--text fw-600"
                    @click="submitButton = true"
                  >
                    Submit Invoice<span class="text-lowercase">(s)</span>
                  </div> -->
                </div>
              </v-col>
              <v-col
                md="4"
                class="side-action"
                style="max-width: 30%; flex: 30%"
              >
                <div class="d-flex ma-0 pa-0 app">
                  <p class="fs-18 fw-600 f-inter">Ticket Details</p>
                  <v-chip
                    v-if="ticket.reviewFromSupervisorByClient == true"
                    class="complete-chip pr-2 mx-4 mt-1"
                    small
                  >
                    <v-icon class="ma-0 pa-0" color="chipColorCompleteText"
                      >mdi-circle-small</v-icon
                    >
                    Review Request
                  </v-chip>
                </div>
                <span
                  class="material-icons custom-close-icon"
                  @click="
                    $emit('close-popup', {
                      key1: currentWorkspace.rewriteInvoice
                        ? openXeroForm
                        : false,
                      key2: compareDraftData(),
                      key3: submittedData
                    })
                  "
                >
                  close
                </span>
              </v-col>
            </v-row>
          </v-card-title>
        </v-col>
        <v-col md="8" sm="12" style="max-width: 70%; flex: 70%">
          <ChatBox
            v-if="!openXeroForm"
            :ticket="ticket"
            @file-sent="fileSent()"
          ></ChatBox>

          <!-- <XeroForm :ticket="ticket" v-if="openXeroForm" /> -->
          <XeroFormNew :ticket="ticket" v-if="openXeroForm" @submitted-data="submittedData = true" />
        </v-col>
        <v-col class="detail-tabs" md="4" sm="12" style="max-width: 30%">
          <v-tabs centered v-model="detailtab" class="pr-1 custom-tabs-width">
            <v-tab
              @click="openXeroForm = true"
              key="TicketInfo"
              class="fs-13 fw-600 f-inter ml-1 custom-tab-margin"
              >Ticket Info</v-tab
            >
            <v-tab
              @click="closeXeroForminTabs()"
              key="Details"
              class="fs-13 fw-600 f-inter custom-tab-margin"
              >Details</v-tab
            >
            <v-tab
              @click="closeXeroForminTabs()"
              key="Files"
              class="fs-13 fw-600 f-inter custom-tab-margin"
              >Files</v-tab
            >
            <v-tab
              @click="closeXeroForminTabs()"
              key="TimeLines"
              class="fs-13 fw-600 f-inter custom-tab-margin"
              >Logs</v-tab
            >
            <!-- <v-tab @click="openXeroForm = true" key="Messages">Messages</v-tab> -->
            <v-tabs-slider color="white"></v-tabs-slider>
          </v-tabs>
          <v-tabs-items v-model="detailtab">
            <v-tab-item key="TicketInfo">
              <v-card flat class="file-tab-row">
                <div v-if="attachment">
                  <XeroFormFilePreview
                    class="mt-5 custom-border"
                    :data="data"
                    :file="file"
                    :selectedFile="selectedFile"
                  />
                </div>
                <div
                  v-else
                  style="min-height: 70vh"
                  class="d-flex justify-center align-center"
                >
                  <div class="d-flex flex-column">
                    <NoAttachmentIcon />
                    <span class="mt-4 ml-4"> No attachment </span>
                  </div>
                </div>
              </v-card>
            </v-tab-item>
            <v-tab-item key="Details">
              <v-card flat>
                <div class="row detail-tab-row">
                  <div class="col-md-4 detail-tab-key">Ticket ID</div>
                  <div class="col-md-8 detail-tab-value">
                    {{ ticket.ticketNo }}
                  </div>
                  <div class="col-md-4 detail-tab-key">Ticket Status</div>
                  <div class="col-md-8 detail-tab-value">
                    <v-chip
                      v-if="ticket.status == 'Complete'"
                      class="complete-chip pr-2"
                      small
                    >
                      <v-icon class="ma-0 pa-0" color="chipColorCompleteText"
                        >mdi-circle-small</v-icon
                      >
                      Complete
                    </v-chip>

                    <v-chip
                      v-else-if="ticket.status == 'InProgress'"
                      class="in-progress-chip pr-2"
                      small
                    >
                      <v-icon class="ma-0 pa-0" color="chipColorInProgressText"
                        >mdi-circle-small</v-icon
                      >
                      In Progress
                    </v-chip>

                    <v-chip
                      v-else-if="ticket.status == 'AwaitingResponse'"
                      class="awaiting-response-chip pr-2"
                      small
                    >
                      <v-icon
                        class="ma-0 pa-0"
                        color="chipColorAwaitingResponseText"
                        >mdi-circle-small</v-icon
                      >
                      Awaiting Response
                    </v-chip>

                    <v-chip
                      v-else-if="ticket.status == 'ClientResponded'"
                      class="client-responded-chip pr-2"
                      small
                    >
                      <v-icon
                        class="ma-0 pa-0"
                        color="chipColorClientRespondedText"
                        >mdi-circle-small</v-icon
                      >
                      Responded
                    </v-chip>

                    <v-chip
                      v-else-if="ticket.status == 'ReviewRequest'"
                      class="review-request-chip pr-2"
                      small
                    >
                      <v-icon
                        class="ma-0 pa-0"
                        color="chipColorReviewRequestText"
                        >mdi-circle-small</v-icon
                      >
                      Review Request
                    </v-chip>

                    <v-chip
                      v-else-if="ticket.status == 'Audit'"
                      class="audit-chip pr-2"
                      small
                    >
                      <v-icon class="ma-0 pa-0" color="chipColorAuditText"
                        >mdi-circle-small</v-icon
                      >
                      Audit
                    </v-chip>

                    <v-chip
                      v-else-if="ticket.status == 'Rejected'"
                      class="rejected-chip pr-2"
                      small
                    >
                      <v-icon class="ma-0 pa-0" color="chipColorRejectedText"
                        >mdi-circle-small</v-icon
                      >
                      Rejected
                    </v-chip>

                    <v-chip v-else class="pending-chip pr-2" small>
                      <v-icon class="ma-0 pa-0" color="chipColorPendingText"
                        >mdi-circle-small</v-icon
                      >
                      Pending
                    </v-chip>
                  </div>

                  <div class="col-md-4 detail-tab-key">Workspace</div>
                  <div class="col-md-8 detail-tab-value">
                    {{
                      ticket.workspaceName
                        ? ticket.workspaceName
                        : currentWorkspace.workspaceName
                    }}
                  </div>
                  <div class="col-md-4 detail-tab-key">Ticket Type</div>
                  <div class="col-md-8 detail-tab-value">
                    {{ ticket.requestType }}
                  </div>
                  <div class="col-md-4 detail-tab-key">Currency</div>
                  <div class="col-md-8 detail-tab-value">
                    {{ ticket.currency }}
                  </div>
                  <div class="col-md-4 detail-tab-key">Type</div>
                  <div class="col-md-8 detail-tab-value">
                    {{ ticket.ticketType }}
                  </div>
                  <div class="col-md-4 detail-tab-key">Created At</div>
                  <div class="col-md-8 detail-tab-value">
                    {{ ticket.createdAt | formatDate }}
                  </div>
                  <div class="col-md-12 detail-tab-key">Description</div>
                  <div class="col-md-12 detail-tab-value">
                    {{ ticket.message }}
                  </div>
                  <div class="col-md-12" v-if="ticket.status == 'Complete'">
                    <div class="d-flex justify-center">
                      <Button
                        @button-clicked="reviewRequestDialog = true"
                        class="mr-2"
                        color="primary"
                      >
                        <template v-slot:buttonHeading>
                          <p class="ma-0 pa-0 white--text">Review Request</p>
                        </template>
                      </Button>
                    </div>
                  </div>
                  <div
                    class="col-md-12"
                    v-if="ticket.status == 'Audit' && user.role === 'client'"
                  >
                    <div class="d-flex justify-center">
                      <Button
                        @button-clicked="auditRequestDialog = true"
                        class="mr-2"
                        color="primary"
                      >
                        <template v-slot:buttonHeading>
                          <p class="ma-0 pa-0 white--text">Audit Request</p>
                        </template>
                      </Button>
                    </div>
                  </div>
                </div>
              </v-card>
            </v-tab-item>
            <v-tab-item key="Files">
              <v-card flat class="file-tab-row">
                <div class="title">All Files</div>
                <div class="all-files">
                  <div v-if="ticket.attachmentUrl">
                    <div
                      class="file"
                      v-if="ticket.attachmentUrl.split('.').pop() !== 'wav'"
                    >
                      <v-img
                        v-if="
                          [
                            'jpg',
                            'png',
                            'jpeg',
                            'pdf',
                            'docs',
                            'doc',
                            'xls',
                            'xlsx',
                            'csv',
                            'docx',
                            'zip',
                          ].includes(ticket.attachmentUrl.split('.').pop())
                        "
                        class="file-img"
                        max-width="26"
                        :src="
                          require(`@/assets/dashboard/${ticket.attachmentUrl
                            .split('.')
                            .pop()}.svg`)
                        "
                      ></v-img>
                      <v-img
                        v-else
                        class="file-img"
                        max-width="26"
                        src="@/assets/dashboard/other.svg"
                      ></v-img>
                      <div
                        class="file-name"
                        @click="openLinkInNewWindow(ticket.attachmentUrl, true)"
                      >
                        <p class="name" v-if="ticket.attachmentName">
                          {{ ticket.attachmentName | minimizeFileName }}
                        </p>
                        <p class="name" v-else>Attached File</p>
                        <p class="date">
                          Shared Date {{ ticket.createdAt | formatDate }}
                        </p>
                      </div>
                      <div class="file-action">
                        <v-img
                          src="@/assets/dashboard/download-pdf.svg"
                          @click="openPrivateUrl(ticket.attachmentUrl)"
                        ></v-img>
                        <v-img
                          src="@/assets/dashboard/open-pdf.svg"
                          @click="openLinkInNewWindow(ticket.attachmentUrl)"
                        ></v-img>
                      </div>
                    </div>
                  </div>
                  <div v-for="(item, index) in ticket.files" :key="index">
                    <div
                      class="file"
                      v-if="item.file.originalname.split('.').pop() !== 'wav'"
                    >
                      <v-img
                        v-if="
                          [
                            'jpg',
                            'png',
                            'jpeg',
                            'pdf',
                            'docs',
                            'doc',
                            'xls',
                            'xlsx',
                            'csv',
                            'docx',
                            'zip',
                          ].includes(item.file.originalname.split('.').pop())
                        "
                        class="file-img"
                        max-width="26"
                        :src="
                          require(`@/assets/dashboard/${item.file.originalname
                            .split('.')
                            .pop()}.svg`)
                        "
                      ></v-img>
                      <v-img
                        v-else
                        class="file-img"
                        max-width="26"
                        src="@/assets/dashboard/other.svg"
                      ></v-img>
                      <div
                        class="file-name"
                        @click="openLinkInNewWindow(item.fileUrl, true)"
                      >
                        <p class="name">
                          {{ item.file.originalname | minimizeFileName }}
                        </p>
                        <p class="date">
                          Shared Date {{ item.createdAt | formatDate }}
                        </p>
                      </div>
                      <div class="file-action">
                        <v-img
                          src="@/assets/dashboard/download-pdf.svg"
                          @click="openPrivateUrl(item.fileUrl)"
                        ></v-img>
                        <v-img
                          src="@/assets/dashboard/open-pdf.svg"
                          @click="openLinkInNewWindow(item.fileUrl)"
                        ></v-img>
                      </div>
                    </div>
                  </div>
                </div>
              </v-card>
            </v-tab-item>
            <v-tab-item key="Timelines">
              <v-card flat class="timeline-tab-row">
                <div class="title">Status</div>
                <div class="logs">
                  <div v-for="(value, key, index) in logsFunction" :key="index">
                    <div class="date">{{ key }}</div>
                    <div
                      v-for="(item, indexA) in value"
                      :key="indexA"
                      class="time-status"
                    >
                      <p class="time">{{ item.createdAt | formatTime }}</p>
                      <p class="status" v-if="!item.action">
                        {{
                          item.status === "Created"
                            ? `${item.status} by
                                              ${item.userId?.name}`
                            : item.status
                        }}
                      </p>
                      <p
                        class="status"
                        v-else-if="item.action == 'change_status'"
                      >
                        {{
                          item.status === "Created"
                            ? `${item.status} by ${item.userId?.name}`
                            : item.status
                        }}
                      </p>
                      <div v-else-if="item.action == 'change_request_type'">
                        <p class="status mb-0 pb-0">
                          Request Type Changed from
                        </p>
                        <p class="status mt-0 pt-0">
                          <b>{{ item?.data?.oldType }}</b> to
                          <b>{{ item?.data?.newType }}</b>
                        </p>
                      </div>
                      <p class="status" v-else-if="item.action == 'review'">
                        Review Request
                      </p>
                    </div>
                  </div>
                </div>
              </v-card>
            </v-tab-item>
            <v-tab-item key="Messages">
              <v-card flat>
                <div class="row detail-tab-row">
                  <div class="col-md-4 detail-tab-key">Ticket ID</div>
                  <div class="col-md-8 detail-tab-value">
                    {{ ticket.ticketNo }}
                  </div>
                  <div class="col-md-4 detail-tab-key">Ticket Status</div>
                  <div class="col-md-8 detail-tab-value">
                    <v-chip
                      v-if="ticket.status == 'Complete'"
                      class="complete-chip pr-2"
                      small
                    >
                      <v-icon class="ma-0 pa-0" color="chipColorCompleteText"
                        >mdi-circle-small</v-icon
                      >
                      Complete
                    </v-chip>

                    <v-chip
                      v-else-if="ticket.status == 'InProgress'"
                      class="in-progress-chip pr-2"
                      small
                    >
                      <v-icon class="ma-0 pa-0" color="chipColorInProgressText"
                        >mdi-circle-small</v-icon
                      >
                      In Progress
                    </v-chip>

                    <v-chip
                      v-else-if="ticket.status == 'AwaitingResponse'"
                      class="awaiting-response-chip pr-2"
                      small
                    >
                      <v-icon
                        class="ma-0 pa-0"
                        color="chipColorAwaitingResponseText"
                        >mdi-circle-small</v-icon
                      >
                      Awaiting Response
                    </v-chip>

                    <v-chip
                      v-else-if="ticket.status == 'ClientResponded'"
                      class="client-responded-chip pr-2"
                      small
                    >
                      <v-icon
                        class="ma-0 pa-0"
                        color="chipColorClientRespondedText"
                        >mdi-circle-small</v-icon
                      >
                      Responded
                    </v-chip>

                    <v-chip
                      v-else-if="ticket.status == 'ReviewRequest'"
                      class="review-request-chip pr-2"
                      small
                    >
                      <v-icon
                        class="ma-0 pa-0"
                        color="chipColorReviewRequestText"
                        >mdi-circle-small</v-icon
                      >
                      Review Request
                    </v-chip>

                    <v-chip
                      v-else-if="ticket.status == 'Audit'"
                      class="audit-chip pr-2"
                      small
                    >
                      <v-icon class="ma-0 pa-0" color="chipColorAuditText"
                        >mdi-circle-small</v-icon
                      >
                      Audit
                    </v-chip>

                    <v-chip
                      v-else-if="ticket.status == 'Rejected'"
                      class="rejected-chip pr-2"
                      small
                    >
                      <v-icon class="ma-0 pa-0" color="chipColorRejectedText"
                        >mdi-circle-small</v-icon
                      >
                      Rejected
                    </v-chip>

                    <v-chip v-else class="pending-chip pr-2" small>
                      <v-icon class="ma-0 pa-0" color="chipColorPendingText"
                        >mdi-circle-small</v-icon
                      >
                      Pending
                    </v-chip>
                  </div>

                  <div class="col-md-4 detail-tab-key">Workspace</div>
                  <div class="col-md-8 detail-tab-value">
                    {{
                      ticket.workspaceName
                        ? ticket.workspaceName
                        : currentWorkspace.workspaceName
                    }}
                  </div>
                  <div class="col-md-4 detail-tab-key">Ticket Type</div>
                  <div class="col-md-8 detail-tab-value">
                    {{ ticket.requestType }}
                  </div>
                  <div class="col-md-4 detail-tab-key">Currency</div>
                  <div class="col-md-8 detail-tab-value">
                    {{ ticket.currency }}
                  </div>
                  <div class="col-md-4 detail-tab-key">Type</div>
                  <div class="col-md-8 detail-tab-value">
                    {{ ticket.ticketType }}
                  </div>
                  <div class="col-md-4 detail-tab-key">Created At</div>
                  <div class="col-md-8 detail-tab-value">
                    {{ ticket.createdAt | formatDate }}
                  </div>
                  <div class="col-md-12 detail-tab-key">Description</div>
                  <div class="col-md-12 detail-tab-value">
                    {{ ticket.message }}
                  </div>
                  <div class="col-md-12" v-if="ticket.status == 'Complete'">
                    <div class="d-flex justify-center">
                      <Button
                        @button-clicked="reviewRequestDialog = true"
                        class="mr-2"
                        color="primary"
                      >
                        <template v-slot:buttonHeading>
                          <p class="ma-0 pa-0 white--text">Review Request</p>
                        </template>
                      </Button>
                    </div>
                  </div>
                  <div
                    class="col-md-12"
                    v-if="ticket.status == 'Audit' && user.role === 'client'"
                  >
                    <div class="d-flex justify-center">
                      <Button
                        @button-clicked="auditRequestDialog = true"
                        class="mr-2"
                        color="primary"
                      >
                        <template v-slot:buttonHeading>
                          <p class="ma-0 pa-0 white--text">Audit Request</p>
                        </template>
                      </Button>
                    </div>
                  </div>
                </div>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-dialog>
  </div>
</template>
<script>
import FormInput from "../common/FormInput.vue";
import { register } from "vue-advanced-chat";
import ChatBox from "../common/ChatBox.vue";
import XeroForm from "../common/XeroForm.vue";
import XeroFormNew from "../common/XeroFormNew.vue";
import { mapGetters } from "vuex";
import moment from "moment";
import UrlServices from "../../services/Url";
import axios from "axios";
import Dialog from "../common/dialog-box";
import Button from "../common/button";
import lodash from "lodash";
import EventBus from "../../js/EventBus";
import XeroFormFilePreview from "./xero-form/XeroFormFilePreview.vue";
import NoAttachmentIcon from "./icons/noAttachment.vue";
register();
export default {
  components: {
    FormInput,
    ChatBox,
    Dialog,
    Button,
    XeroForm,
    XeroFormNew,
    XeroFormFilePreview,
    NoAttachmentIcon,
  },
  data() {
    return {
      modalValue: false,
      openXeroForm: true,
      submittedData: false,
      ticketData: {},
      newDraftData: [],
      oldDraftData: [],
      data: false,
      attachment: true,
      file: null,
      selectedFile: {},
      previewFileDialog: {
        dialog: false,
        url: "",
        headingName: "",
      },
      clientHiddenLogs: ["Assign"],
      showpopup: true,
      detailtab: "TicketInfo",
      reviewRequestDialog: false,
      auditRequestDialog: false,
      ticketStatusForEmployees: [
        {
          label: "Approve",
          value: "approved",
        },
        {
          label: "Reject",
          value: "rejected",
        },
      ],
      ticketStatus: "",
      namesToBeReplaced: {
        Pending: "Pending",
        InProgress: "In Progress",
        AwaitingResponse: "Awaiting Response",
        ClientResponded: "Responded",
        Complete: "Completed",
        ReviewRequest: "Review Request",
      },
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
    logsFunction() {
      let obj = {};
      this.ticket?.logs?.forEach((item) => {
        if (
          !item.action ||
          item.action == "change_status" ||
          item.action == "change_request_type" ||
          item.action == "review"
        ) {
          if (!this.clientHiddenLogs.includes(item.status)) {
            item.status = this.namesToBeReplaced[item["status"]]
              ? this.namesToBeReplaced[item["status"]]
              : item["status"];
            if (obj[moment(item.createdAt).format("YYYY MMM DD")] === undefined)
              obj[moment(item.createdAt).format("YYYY MMM DD")] = [item];
            else obj[moment(item.createdAt).format("YYYY MMM DD")].push(item);
          }
        }
      });
      return obj;
    },
  },
  mounted() {
    this.ticketData = this.ticket;
    /*
     ** Show attachment
     */
    if (this.ticketData?.attachmentName && !this.file) {
      this.openAttachedDocument(this.ticketData);
      this.attachment = true;
    }
    // if there is no attachment
    else if (!this.ticketData?.attachmentName) {
      this.attachment = false;
    }

    EventBus.$on("old-draft-data", (oldData) => {
      this.oldDraftData = oldData;
    });
    EventBus.$on("new-draft-data", (newData) => {
      this.newDraftData = newData;
    });
  },
  methods: {
    /**
     * This function compare new draft data and old draft data of all the invoices
     */
    compareDraftData() {
      const isEqual = lodash.isEqual(this.newDraftData, this.oldDraftData);
      return isEqual;
    },
    closeClickedDialogXeroForm() {
      this.modalValue = false;
      this.detailtab = 2;
    },
    saveClickedDialogXeroForm() {
      this.modalValue = false;
      this.openXeroForm = false;
    },
    closeXeroForminTabs() {
      if (!this.openXeroForm || !this.currentWorkspace.rewriteInvoice) {
        this.openXeroForm = false;
        return;
      }
      console.log("here we need to compare data in order to show dialog");
      if(this.submittedData || this.compareDraftData()) return (this.openXeroForm = false);
      else if (!this.submittedData || !this.compareDraftData()) return (this.modalValue = true);
    },
    auditRequest() {
      if (this.ticketStatus == "")
        return this.$showNotificationBar("error", "Please select the status");
      this.$emit("audit-request", this.ticketStatus);
      this.ticketStatus = "";
      this.auditRequestDialog = false;
    },
    reviewRequest() {
      this.$emit("review-request");
      this.reviewRequestDialog = false;
    },
    fileSent() {
      this.$emit("file-sent");
    },
    openPrivateUrl(url) {
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
      var config = {
        method: "post",
        url: UrlServices.slack,
        data: data,
        responseType: "blob",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      axios(config)
        .then(function (response) {
          let blob = new Blob([response.data], {
            type: response.headers["content-type"],
          });
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            var base64data = reader.result;
            this.imageUrl = base64data;
          };

          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = url.split("/")[url.split("/").length - 1];
          link.click();
          link.remove();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    async openLinkInNewWindow(url, openInTab = false) {
      this.tokenValidation()
        .then(() => {
          let filePath =
            url.search("files/") > -1
              ? url
              : url.split("https://files.slack.com/")[1];
          let mytoken = this.token.substring(7);
          let check = ["doc", "xls", "docx", "ppt"].includes(
            url.split(".").pop()
          );
          let newUrl = `${process.env.VUE_APP_BACK_END_URL}${UrlServices.slack}/${mytoken}?file=${filePath}`;
          if (!openInTab)
            window.open(
              check
                ? `https://view.officeapps.live.com/op/embed.aspx?src=${newUrl}`
                : newUrl,
              "_blank"
            );
          else {
            this.previewFileDialog.headingName = this.ticket.ticketNo;
            this.previewFileDialog.url = check
              ? `https://view.officeapps.live.com/op/embed.aspx?src=${newUrl}`
              : newUrl;
            this.previewFileDialog.dialog = true;
          }
        })
        .catch((err) => {
          console.log("err ======> openLinkInNewWindow", err);
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
    closePreviewFileDialog() {
      this.previewFileDialog = {
        dialog: false,
        url: "",
        headingName: "",
      };
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
  },
  beforeDestroy() {
    EventBus.$off("old-draft-data");
    EventBus.$off("new-draft-data");
  },
};
</script>
<style scoped lang="scss">
::v-deep .v-chip.v-size--small {
  border-radius: 6px !important;
  justify-content: center !important;
}

.custom-close-icon {
  position: relative;
  bottom: 0px;
  padding: 0px;
  font-size: 26px;
  border-radius: 3px;
  color: #40415a;
  cursor: pointer;
  width: 28px;
  height: 28px;
  background: #ffffff;
  border: 1px solid #e8ebf4;
  border-radius: 4px;
}

.side-action {
  display: flex;
  justify-content: space-between;
  padding-left: 34px;
  padding-right: 0px;
  border-bottom-style: inset;
  border-width: 1.8px !important;
  border-color: hsl(225, 35%, 93%) !important;
}

.detail-tab-key {
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 19px;
  color: #40415a;
}

.detail-tab-value {
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 19px;
  color: #40415a;
}

.file-tab-row {
  .title {
    font-style: normal;
    font-weight: 600;
    font-size: 15px !important;
    line-height: 20px;
    color: #40415a;
    margin-top: 20px;
    margin-bottom: 13px;
  }

  .file {
    display: flex;
    margin-top: 12px;
    background: #ffffff;
    border: 1px solid #e8ebf4;
    border-radius: 8px;
    padding: 11px;
    cursor: pointer;

    .file-action {
      display: none;

      .v-image {
        height: 27px;
        width: 27px;
        margin-left: 10px;
      }
    }
  }

  .file:hover {
    outline: rgba(102, 52, 233, 1) auto 1px;

    .file-action {
      display: flex !important;
      margin-right: 10px !important;
      margin-left: auto !important;
      background: white !important;
      background: linear-gradient(
        269.34deg,
        #ffffff 53.16%,
        rgba(255, 255, 255, 0) 176.03%
      );

      // display: block !important;
      .v-image {
        height: 27px;
        width: 27px;
        margin-left: 10px;
      }
    }
  }

  .file p {
    padding: 0px;
    margin-bottom: 0px !important;
  }

  .file-name {
    margin-left: 10px;
  }

  .file-name .name {
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 18px;
    color: #40415a;
  }

  .file-name .date {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #9d9eab;
  }
}

.timeline-tab-row {
  .title {
    font-style: normal;
    font-weight: 600;
    font-size: 15px !important;
    line-height: 20px;
    color: #40415a;
    margin-top: 17px;
  }

  .date {
    margin-top: 29px;
    font-weight: 500;
    font-size: 15px;
    line-height: 20px;
    color: #40415a;
  }

  .time-status {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
    background: #ffffff;
    border: 1px solid #e8ebf4;
    border-radius: 8px;
  }

  .time-status p {
    padding: 18px;
    margin-bottom: 0px !important;
  }

  .time-status .time {
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 18px;
    color: #40415a;
  }

  .time-status .status {
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 18px;
    color: #40415a;
  }

  .logs {
    height: 70vh;
    overflow-y: scroll;
    padding-right: 25px;
  }
}

.all-files {
  height: 60vh;
  overflow-y: scroll;
  padding-right: 25px;
  padding-left: 2px;
}
</style>
<style>
::v-deep .vac-room-header {
  display: none !important;
}

::v-deep .room-header {
  display: none !important;
}

.messagebox {
  position: absolute;
  right: 0px;
  margin: 0px;
  top: 0px;
  background: white;
  max-height: 100% !important;
  height: 100vh;
  /* border-top-left-radius: 25px; */
  /* border-bottom-left-radius: 25px; */
  margin-top: 10px !important;
  /* overflow: hidden; */
}

.detail-tabs {
  padding-left: 34px;
  height: 88vh;
  /* border-left-style: outset; */
  border-width: 1.8px !important;
  border-color: hsl(225, 35%, 93%) !important;
}

/* .detail-tabs .v-slide-group__content {
  height: 45px;
  background: #faf9ff;
  padding-inline: 4px;
  color: black;
} */

.detail-tabs .v-tab {
  color: black !important;
  text-transform: capitalize;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;
  color: #40415a;
}

.detail-tabs .v-tab--active {
  color: #6634e9 !important;
  background: #ffffff;
  box-shadow: 0px 4px 7px rgba(119, 119, 119, 0.08);
  border-radius: 8.64641px;
}

.detail-tabs .detail-tab-row {
  padding-top: 52px;
  height: 70vh;
  overflow-y: scroll;
  padding-right: 25px;
}

.v-chip__content .v-icon .icon-size-color {
  color: #faad13;
  font-size: 6px;
}

.left-side-message-box {
  border-right-style: inset;
  border-bottom-style: inset;
  padding-left: 0px !important;
  border-width: 1.8px !important;
  border-color: hsl(225, 35%, 93%) !important;
}

.messagebox-parent {
  padding-left: 25px !important;
  padding: 6px;
}
@media only screen and (min-width: 1440px) {
  .v-slide-group__next {
    display: none;
  }
  .v-slide-group__prev {
    display: none;
  }
  .custom-tabs-width {
   width: 393px !important;
  }
}
.custom-border {
  border: 1px solid rgb(224, 221, 221);
}
.custom-tab-margin {
  margin-top: 4px;
  margin-bottom: 6px;
}
.app p {
  margin-bottom: 4px !important;
}
</style>
