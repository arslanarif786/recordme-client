<template>
  <div class="text-center">
    <v-dialog
      v-model="showpopup"
      content-class="messagebox"
      width="90%"
      persistent
    >
      <v-row class="header">
        <v-col md="8" class="left-side">
          <div v-if="selectedFile" class="ml-2">
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
                ].includes(selectedFile.file.originalname.split('.').pop())
              "
              class="file-type"
              max-width="40"
              :src="
                require(`@/assets/dashboard/${selectedFile.file.originalname
                  .split('.')
                  .pop()}.svg`)
              "
            >
            </v-img>
            <v-img
              v-else
              class="file-types"
              max-width="26"
              max-height="33"
              src="@/assets/dashboard/other.svg"
            ></v-img>
          </div>
          <div class="detail" v-if="selectedFile">
            <p class="name">{{ selectedFile.file.originalname }}</p>
            <p class="date">
              Shared Date {{ selectedFile.createdAt | formatDate }}
            </p>
          </div>
        </v-col>
        <v-col md="4" class="right-side">
          <v-row>
            <v-col md="10" class="pl-0">
              <p class="fs-18 fw-600 mb-0">
                Ticket ID <span>{{ ticket.ticketNo }}</span>
              </p>
              <p class="sub-title mb-0">Recent Documents</p>
            </v-col>
            <v-col md="1" class="pl-0 pr-10">
              <span
                class="material-icons custom-close-icon"
                @click="$emit('close-popup')"
              >
                close
              </span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <!-- <v-divider inset class="mb-4"></v-divider> -->
      <v-row>
        <v-col md="8" class="documents-view">
          <div class="file-viewer-side" v-if="selectedFile">
            <img
              v-if="
                ['jpg', 'png', 'jpeg', 'svg'].includes(
                  selectedFile.file.originalname.split('.').pop()
                ) && data
              "
              :src="file"
            />
            <VueDocPreview
              v-if="
                ['doc', 'docx', 'pptx', 'ppt', 'xlsx', 'xls'].includes(
                  selectedFile.file.originalname.split('.').pop()
                ) && data
              "
              :value="file"
              type="office"
            />
            <VuePdfEmbed
              v-if="
                ['pdf'].includes(
                  selectedFile.file.originalname.split('.').pop()
                ) && data
              "
              :source="file"
            />
          </div>
          <div v-else class="file-not-found-document">
            <v-img src="@/assets/dashboard/file.svg" width="200"></v-img>
            <div class="mt-5 fw-400 fs-20 lh-27 f-inter fs-normal">
              No File Selected
            </div>
          </div>
        </v-col>
        <v-col md="4" class="side-action">
          <div class="documents-list">
            <div v-if="ticket.attachmentUrl">
              <div
                class="documents"
                :class="selectedFile._id == ticket._id ? 'active' : ''"
                @click="openAttachedDocument(ticket)"
              >
                <v-img
                  v-if="
                    ticket.previewFileName &&
                    ticket.previewFileName !== 'type not supported'
                  "
                  class="preview-image"
                  :src="backendURL + ticket.previewFileName"
                  width="304px"
                  height="111px"
                  cover
                ></v-img>
                <v-img
                  v-else
                  class="preview-image"
                  src="@/assets/general-format.jpeg"
                  width="304px"
                  height="111px"
                  contain
                ></v-img>

                <div class="description">
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
                    class="file-type"
                    max-width="26"
                    max-height="33"
                    :src="
                      require(`@/assets/dashboard/${ticket.attachmentUrl
                        .split('.')
                        .pop()}.svg`)
                    "
                  ></v-img>
                  <v-img
                    v-else
                    class="file-types"
                    max-width="26"
                    max-height="33"
                    src="@/assets/dashboard/other.svg"
                  ></v-img>
                  <div class="detail">
                    <p class="file-name" v-if="ticket.attachmentName">
                      {{ ticket.attachmentName | minimizeFileName }}
                    </p>
                    <p class="file-name" v-else>Attached File</p>
                    <p class="file-date">
                      Shared Date {{ ticket.createdAt | formatDate }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div v-for="(item, index) in ticket.files" :key="index">
              <div
                class="documents"
                :class="selectedFile._id == item._id ? 'active' : ''"
                @click="selectFile(item)"
                v-if="item.file.originalname.split('.').pop() !== 'wav'"
              >
                <v-img
                  v-if="
                    item.previewFileName &&
                    item.previewFileName !== 'type not supported'
                  "
                  class="preview-image"
                  :src="backendURL + item.previewFileName"
                  width="304px"
                  height="111px"
                  cover
                ></v-img>
                <v-img
                  v-else
                  class="preview-image"
                  src="@/assets/general-format.jpeg"
                  width="304px"
                  height="111px"
                  contain
                ></v-img>
                <div class="description">
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
                    class="file-type"
                    max-width="26"
                    max-height="33"
                    :src="
                      require(`@/assets/dashboard/${item.file.originalname
                        .split('.')
                        .pop()}.svg`)
                    "
                  ></v-img>
                  <v-img
                    v-else
                    class="file-types"
                    max-width="26"
                    max-height="33"
                    src="@/assets/dashboard/other.svg"
                  ></v-img>
                  <div class="detail">
                    <p class="file-name">
                      {{ item.file.originalname | minimizeFileName }}
                    </p>
                    <p class="file-date">
                      Shared Date {{ item.createdAt | formatDate }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-dialog>
  </div>
</template>
<script>
import FormInput from "../common/FormInput.vue";
import ChatBox from "../common/ChatBox.vue";
import VueDocPreview from "vue-doc-preview";
import VuePdfEmbed from "vue-pdf-embed/dist/vue2-pdf-embed";
import axios from "axios";
import UrlServices from "../../services/Url";
import { mapGetters } from "vuex";
export default {
  components: { FormInput, ChatBox, VueDocPreview, VuePdfEmbed },
  props: {
    ticket: Object,
  },
  computed: {
    ...mapGetters({
      currentWorkspace: "auth/getCurrentWorkspace",
      token: "auth/getAuthToken",
    }),
  },
  data() {
    return {
      data: false,
      file: "",
      selectedFile: "",
      showpopup: true,
      detailtab: "Details",
      fileid: "1",
      backendURL: process.env.VUE_APP_BACK_END_URL,
      previewImage: null,
    };
  },
  methods: {
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
    async selectFile(file) {
      (this.data = false), (this.file = "");
      this.selectedFile = file;
      await this.openPrivateUrl(this.selectedFile.fileUrl);
      // if (
      //   this.selectedFile.file.originalname.split(".").pop() === "png" ||
      //   this.selectedFile.file.originalname.split(".").pop() === "ipg"
      // )
      //   this.getImage();
      //   if (
      //   this.selectedFile.file.originalname.split(".").pop() === "pdf"
      // )
      //   this.getPdf();
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
    convertBlobToBase64: (blob) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(blob);
      }),
  },
};
</script>
<style scoped>
::v-deep .preview-image .v-image__image {
  background-position: top !important;
}
</style>
<style scoped lang="scss">
// .chat-box {
//   height: 86vh !important;
// }
.active {
  border: 1px solid #6634e9 !important;
}

.documents-list {
  height: 100vh;
  overflow-y: scroll;
  padding-right: 28px;
  padding-bottom: 150px;
}

// .header {
//   // padding: 23px;
// }
.right-side {
  padding: 25px;
  border-bottom-style: inset;
  border-width: 1.8px !important;
  border-color: hsl(225, 35%, 93%) !important;
}

.left-side {
  display: flex !important;
  border-right-style: inset;
  background: #fbfafd;
  border-radius: 29px 0px 0px 0px;
  padding: 23px;
  border-width: 1.8px !important;
  border-color: hsl(225, 35%, 93%) !important;

  .file-type {
    height: 46px;
    width: 46px;
    max-width: 46px;
  }

  .name {
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    color: #40415a;
  }

  .date {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    color: #9d9eab;
  }

  p {
    margin-left: 10px;
    margin-bottom: 0px !important;
  }
}

.documents {
  background: #ffffff;
  border: 1px solid #e8ebf4;
  border-radius: 8px;
  padding: 11px;
  margin-bottom: 16px;
  // min-width: 328px;
  cursor: pointer;

  .description {
    display: flex;
    margin-top: 8px;
  }

  .file-type {
    height: 32px;
    max-width: 32px;
  }

  .detail {
    margin-left: 5px;
  }

  .file-name {
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 19px;
    color: #40415a;
  }

  .file-date {
    font-style: normal;
    font-weight: 400;
    font-size: 10.5px;
    line-height: 14px;
    color: #9d9eab;
  }
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

.documents-view {
  border-right-style: inset;
  border-width: 1.8px !important;
  border-color: hsl(225, 35%, 93%) !important;

  ::-webkit-scrollbar {
    width: 5px;
    margin-right: 10px;
    margin-left: auto;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    border-radius: 5px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #e8ebf4;
    border: 2px solid #e8ebf4;
    border-radius: 6px;
    transform: matrix(-1, 0, 0, 1, 0, 0);
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    // background: #E8EBF4;
    border: 2px solid #e8ebf4;
    border-radius: 6px;
    transform: matrix(-1, 0, 0, 1, 0, 0);
  }
}

.file-viewer-side {
  padding: 10px;
  height: 100vh;
  overflow-y: scroll;
  width: 100%;

  img {
    max-width: 100%;
  }
}

.side-action {
  display: flex;
  justify-content: space-between;

  ::-webkit-scrollbar {
    width: 5px;
    margin-right: 10px;
    margin-left: auto;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    border-radius: 5px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #e8ebf4;
    border: 2px solid #e8ebf4;
    border-radius: 6px;
    transform: matrix(-1, 0, 0, 1, 0, 0);
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    // background: #E8EBF4;
    border: 2px solid #e8ebf4;
    border-radius: 6px;
    transform: matrix(-1, 0, 0, 1, 0, 0);
  }

  .row {
    margin-left: 23px;
  }

  p {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    color: #40415a;
    margin-bottom: 0px;

    span {
      font-weight: 500;
      margin-left: 15px;
    }
  }

  .sub-title {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    color: #9d9eab;
  }
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
}

.file-not-found-document {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 10%;
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
  height: 98vh;
  /* border-top-left-radius: 25px; */
  /* border-bottom-left-radius: 25px; */
  margin-top: 20px;
  overflow: hidden;
}

.detail-tabs {
  padding-left: 34px;
  height: 88vh;
  border-left-style: outset;
}

.detail-tabs .v-slide-group__content {
  height: 45px;
  background: #faf9ff;
  /* border-radius: 9px; */
  color: black;
}

.detail-tabs .v-tab {
  color: black !important;
  text-transform: capitalize;
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
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
}
</style>
