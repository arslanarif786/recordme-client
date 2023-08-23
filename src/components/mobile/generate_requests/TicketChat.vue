<template>
  <div>
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
        Are you sure you want to reivew this ticket ?
      </template>
    </Dialog>
    <v-row justify="center">
      <v-dialog
        v-model="messageDialog"
        fullscreen
        hide-overlay
        persistent
        transition="dialog-bottom-transition"
        id="dialogDiv"
      >
        <v-card flat class="ma-0 pa-0 border-radius-0">
          <v-app-bar flat fixed color="#2b2442" dense dark>
            <v-toolbar-title>Ticket ID {{ ticket.ticketNo }}</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn dark text @click="closeDialog()" class="pr-0 mr-0">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-app-bar>

          <!-- tabs  -->

          <v-tabs
            hide-slider
            background-color="transparent"
            class="mt-12 static-navbar bg-white"
            v-model="tab"
            fixed-tabs
          >
            <!-- <v-row class="d-flex justify-start mt-0 pt-0 text-center"> -->

            <v-tab href="#chat" class="">
              <span class="pl-1 fs-13 fw-600 text-capitalize f-avenir bg-white"
                >Chat</span
              >
            </v-tab>
            <v-tab href="#file" @click="openFiles">
              <span class="pl-1 fs-13 fw-600 text-capitalize f-avenir"
                >Ticket Details</span
              >
            </v-tab>
            <!-- </v-row> -->
          </v-tabs>

          <v-divider />
          <v-tabs-items v-model="tab">
            <v-tab-item value="chat">
              <v-card
                flat
                class="mb-2"
                :id="$vuetify.breakpoint.lg ? '' : 'chatBoxDiv'"
              >
                <ChatBox :ticket="ticket" @file-sent="fileSent()"></ChatBox>
              </v-card>
            </v-tab-item>
            <v-tab-item value="file">
              <v-card>
                <v-tabs
                  v-model="detailtab"
                  class="-tabs justify-center d-flex static-navbar bg-white"
                >
                  <v-tab key="Details">Details</v-tab>
                  <v-tab key="Files" @click="openFiles">Files</v-tab>
                  <v-tab key="Timelines">Timelines</v-tab>
                  <v-tabs-slider color="white"></v-tabs-slider>
                  <!-- <v-tab key="Messages">Messages</v-tab> -->
                </v-tabs>

                <v-tabs-items v-model="detailtab">
                  <!-- detail tab start -->
                  <v-tab-item key="Details">
                    <v-card flat class="mt-5">
                      <div class="row d-flex ml-7 detail-div">
                        <v-col
                          cols="12"
                          class="col-md-8 detail-tab-value justify-start pl-0"
                        >
                          <v-chip
                            v-if="ticket.reviewFromSupervisorByClient == true"
                            class="complete-chip pr-2 mx-4 mt-1"
                            small
                          >
                            <v-icon
                              class="ma-0 pa-0"
                              color="chipColorCompleteText"
                              >mdi-circle-small</v-icon
                            >
                            Review Request
                          </v-chip>
                        </v-col>
                        <v-col cols="4" class="detail-tab-key justify-start"
                          >Ticket ID</v-col
                        >
                        <v-col
                          cols="8"
                          class="col-md-8 detail-tab-value justify-end"
                        >
                          {{ ticket.ticketNo }}
                        </v-col>
                        <v-col
                          cols="4"
                          class="col-md-4 detail-tab-key justify-start"
                          >Ticket Status</v-col
                        >
                        <v-col
                          cols="8"
                          class="col-md-8 detail-tab-value justify-end"
                        >
                          <v-chip
                            v-if="ticket.status == 'Complete'"
                            class="complete-chip pr-2"
                            small
                          >
                            <v-icon
                              class="ma-0 pa-0"
                              color="chipColorCompleteText"
                              >mdi-circle-small</v-icon
                            >
                            Complete
                          </v-chip>

                          <v-chip
                            v-else-if="ticket.status == 'InProgress'"
                            class="in-progress-chip pr-2"
                            small
                          >
                            <v-icon
                              class="ma-0 pa-0"
                              color="chipColorInProgressText"
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
                            <v-icon
                              class="ma-0 pa-0"
                              color="chipColorRejectedText"
                              >mdi-circle-small</v-icon
                            >
                            Rejected
                          </v-chip>

                          <v-chip v-else class="pending-chip pr-2" small>
                            <v-icon
                              class="ma-0 pa-0"
                              color="chipColorPendingText"
                              >mdi-circle-small</v-icon
                            >
                            Pending
                          </v-chip>
                        </v-col>

                        <v-col cols="4" class="col-md-4 detail-tab-key"
                          >Workspace</v-col
                        >
                        <v-col cols="8" class="col-md-8 detail-tab-value">
                          {{
                            ticket.workspaceName
                              ? ticket.workspaceName
                              : currentWorkspace.workspaceName
                          }}
                        </v-col>
                        <v-col cols="4" class="col-md-4 detail-tab-key"
                          >Ticket Type</v-col
                        >
                        <v-col cols="8" class="col-md-8 detail-tab-value">
                          {{ ticket.requestType }}
                        </v-col>
                        <v-col cols="4" class="col-md-4 detail-tab-key"
                          >Currency</v-col
                        >
                        <v-col cols="8" class="col-md-8 detail-tab-value">
                          {{ ticket.currency }}
                        </v-col>
                        <v-col cols="4" class="col-md-4 detail-tab-key"
                          >Type</v-col
                        >
                        <v-col cols="8" class="col-md-8 detail-tab-value">
                          {{ ticket.ticketType }}
                        </v-col>
                        <v-col cols="4" class="col-md-4 detail-tab-key"
                          >Created At</v-col
                        >
                        <v-col cols="8" class="col-md-8 detail-tab-value">
                          {{ ticket.createdAt | formatDate }}
                        </v-col>
                        <v-col cols="4" class="col-md-12 detail-tab-key"
                          >Description</v-col
                        >
                        <v-col cols="8" class="col-md-12 detail-tab-value">
                          {{ ticket.message }}
                        </v-col>
                        <v-col
                          cols="12"
                          class="col-md-12"
                          v-if="ticket.status == 'Complete'"
                        >
                          <div class="d-flex justify-center">
                            <Button
                              @button-clicked="reviewRequestDialog = true"
                              class="mr-2"
                              color="primary"
                            >
                              <template v-slot:buttonHeading>
                                <p class="ma-0 pa-0 white--text">
                                  Review Request
                                </p>
                              </template>
                            </Button>
                          </div>
                        </v-col>
                        <v-col
                          cols="12"
                          class="col-md-12"
                          v-if="
                            ticket.status == 'Audit' && user.role === 'client'
                          "
                        >
                          <div class="d-flex justify-center">
                            <Button
                              @button-clicked="auditRequestDialog = true"
                              class="mr-2"
                              color="primary"
                            >
                              <template v-slot:buttonHeading>
                                <p class="ma-0 pa-0 white--text">
                                  Audit Request
                                </p>
                              </template>
                            </Button>
                          </div>
                        </v-col>
                      </div>
                    </v-card>
                  </v-tab-item>

                  <!-- file tab start -->
                  <v-tab-item key="Files">
                    <v-card flat class="file-tab-row">
                      <div class="all-files mt-15">
                        <div class="title ml-4 mt-15 pt-10">All Files</div>
                        <div v-if="ticket.attachmentUrl">
                          <span class="ml-7">{{
                            ticket.attachmentUrl.split(".").pop()
                          }}</span>
                          <div
                            class="file"
                            v-if="
                              ticket.attachmentUrl.split('.').pop() !== 'wav'
                            "
                          >
                            <v-img
                              v-if="
                                [
                                  'jpg',
                                  'png',
                                  'jpeg',
                                  'doc',
                                  'docx',
                                  'xls',
                                  'xlsx',
                                  'pdf',
                                  'zip',
                                ].includes(
                                  ticket.attachmentUrl.split('.').pop()
                                )
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
                            <div class="file-name">
                              <p class="name">
                                {{
                                  ticket.attachmentName
                                    ? ticket.attachmentName
                                    : "Attached File"
                                }}
                              </p>
                              <p class="date">
                                Shared Date {{ ticket.createdAt | formatDate }}
                              </p>
                            </div>
                            <div class="file-action">
                              <v-img
                                src="@/assets/dashboard/download-pdf.svg"
                                @click="openPrivateUrl(ticket.attachmentUrl)"
                              ></v-img>
                              <!-- <v-img src="@/assets/dashboard/open-pdf.svg"></v-img> -->
                            </div>
                          </div>
                        </div>
                        <div v-for="(item, index) in ticket.files" :key="index">
                          <div
                            class="file"
                            v-if="
                              item.file.originalname.split('.').pop() !== 'wav'
                            "
                          >
                            <v-img
                              v-if="
                                [
                                  'jpg',
                                  'png',
                                  'jpeg',
                                  'doc',
                                  'xls',
                                  'xlsx',
                                  'pdf',
                                  'zip',
                                ].includes(
                                  item.file.originalname.split('.').pop()
                                )
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
                            <div class="file-name">
                              <p class="name">{{ item.file.originalname }}</p>
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
                              ></v-img>
                            </div>
                          </div>
                        </div>
                      </div>
                    </v-card>
                  </v-tab-item>

                  <!-- timelines tab start -->

                  <v-tab-item key="Timelines">
                    <v-card flat class="timeline-tab-row">
                      <div class="logs mt-15 pt-10 mx-2">
                        <div class="title ml-4 mt-15">Status</div>
                        <div
                          v-for="(value, key, index) in logsFunction"
                          :key="index"
                        >
                          <div class="date ml-2">{{ key }}</div>
                          <div
                            v-for="(item, indexA) in value"
                            :key="indexA"
                            class="time-status"
                          >
                            <p class="time">
                              {{ item.createdAt | formatTime }}
                            </p>
                            <p class="status" v-if="!item.action">
                              {{
                                item.status === "Created"
                                  ? `${item.status} by ${item.userId?.name}`
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
                            <div
                              v-else-if="item.action == 'change_request_type'"
                            >
                              <p class="status mb-0 pb-0">
                                Request Type Changed from
                              </p>
                              <p class="status mt-0 pt-0">
                                <b>{{ item?.data?.oldType }}</b> to
                                <b>{{ item?.data?.newType }}</b>
                              </p>
                            </div>
                            <p
                              class="status"
                              v-else-if="item.action == 'review'"
                            >
                              Review Request
                            </p>
                          </div>
                        </div>
                      </div>
                    </v-card>
                  </v-tab-item>

                  <!-- messages tab start -->

                  <v-tab-item key="Messages">
                    <XeroForm :ticket="ticket" />
                  </v-tab-item>
                </v-tabs-items>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
<script>
import EventBus from "../../../js/EventBus";
import ChatBox from "../../common/ChatBox.vue";
import { mapGetters } from "vuex";
import moment from "moment";
import UrlServices from "../../../services/Url";
import Button from "../../common/button/index.vue";
import Dialog from "../../common/dialog-box/index.vue";
import axios from "axios";
import ApiService from "../../../services/Api";
import XeroForm from "../../common/XeroForm.vue";

export default {
  name: "TicketChat",
  props: {
    ticket: Object,
  },
  components: { ChatBox, Button, Dialog, XeroForm },
  data() {
    return {
      messageDialog: true,
      tab: "chat",
      detailtab: null,
      reviewRequestDialog: false,
      clientHiddenLogs: ["Assign"],
      ticketDialogShow: false,
      newTicket: {},
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
    };
  },
  computed: {
    ...mapGetters({
      currentWorkspace: "auth/getCurrentWorkspace",
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
    // EventBus.$on("open-chat-dialog", (data) => {
    //   this.ticketDialogShow = true;
    //   this.newTicket=data;
    //    console.log("this is mobile ticket", this.newTicket);
    // });
    document.getElementById("dialogDiv").scrollHeight;
  },
  methods: {
    auditRequest() {
      if (this.ticketStatus == "")
        return this.$showNotificationBar("error", "Please select the status");
      this.$emit("audit-request", this.ticketStatus);
      this.ticketStatus = "";
      this.auditRequestDialog = false;
    },
    openFiles() {
      return new Promise((resolve, reject) => {
        ApiService.GetRequest(UrlServices.getTicketDetails + this.ticket._id)
          .then((res) => {
            this.ticket = res.data.ticket;
            console.log("this is obj", res.data.ticket);
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
    closeDialog() {
      this.ticketDialogShow = false;
      this.newTicket = {};
      this.$emit("close-message-dialog");
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
  },
};
</script>

<style scoped lang="scss">
.-tabs {
  border-left-style: outset;
  margin-top: 95px;
}

.-tabs .v-slide-group__content {
  height: 45px;
  background: #faf9ff;
  /* border-radius: 9px; */
  color: black;
}

.-tabs .v-tab {
  color: black !important;
  text-transform: capitalize;
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  color: #40415a;
  margin: 4px;
}

.-tabs .v-tab--active {
  color: #6634e9 !important;
  background: #ffffff;
  box-shadow: 0px 4px 7px rgba(119, 119, 119, 0.08);
  border-radius: 8.64641px;
}

.detail-tab-key {
  font-style: normal;
  font-weight: 600;
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

.all-files {
  height: 90vh;
  overflow-y: scroll;
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
    height: 90vh;
    overflow-y: scroll;
  }
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
    margin-left: 10px;
    margin-right: 10px;
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
    word-break: break-all;
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

.static-navbar {
  z-index: 8;
  position: fixed;
  overflow-y: hidden;
  overflow-x: hidden;
  left: 0;
  right: 0;
}

.toolbar {
  z-index: 100000000;
}
</style>
<style scoped>
#chatBoxDiv {
  height: 94vh !important;
  overflow-x: hidden;
  overflow-y: auto;
}

.v-dialog--fullscreen {
  height: 0% !important;
  overflow: hidden !important;
  overflow-y: hidden !important;
}

.detail-div {
  margin-top: 160px;
}
</style>
