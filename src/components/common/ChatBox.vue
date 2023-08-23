<template>
  <v-row class="flex-column fill-height">
    <v-col
      :class="$vuetify.breakpoint.lg ? 'messages mb-5' : 'mt-15 mb-5 pb-10'"
      id="messagesDivId"
      v-if="!loader"
      ref="testing"
    >
      <div v-if="updatedMessages && updatedMessages.length">
        <div v-for="(message, index) in updatedMessages" :key="index">
          <!-- sticky-date -->
          <div
            v-if="message.newDate"
            :class="$vuetify.breakpoint.lg ? 'date' : 'date-mobile'"
          >
            <p>{{ message.createdAt | formatDate }}</p>
          </div>
          <div
            v-if="message.type === 'app' || message.type === 'email'"
            :class="[
              roleArray.includes(message.userRole) == true
                ? 'message send '
                : 'message receive',
              $vuetify.breakpoint.lg ? '' : 'singleMobileMessage',
            ]"
          >
            <MessageFormat
              :message="message"
              @openPrivateUrl="openPrivateUrl($event)"
            />
          </div>
        </div>
      </div>
      <div v-else class="no-message-found">
        <v-img src="@/assets/dashboard/no-message.svg" width="200"></v-img>
        <div class="mt-5 fw-400 fs-20 lh-27 f-avenir fs-normal">
          No Conversation Available
        </div>
      </div>
    </v-col>
    <v-col class="messages" v-else>
      <v-progress-linear indeterminate color="primary"></v-progress-linear>
    </v-col>
    <!-- <v-col cols="auto">
            <div class="audio" >
                <AudioWaveform :audio="'https://staskobzar.github.io/vue-audio-visual/file_example_MP3_1MG.mp3'"></AudioWaveform>
            </div>
        </v-col> -->
    <!-- New Design Updated with messages -->
    <v-col cols="auto actions-bar">
      <div
        :class="
          $vuetify.breakpoint.lg
            ? 'selected-images'
            : 'selected-images mb-15 mobile-action'
        "
      >
        <div class="img" v-if="uploadPreview">
          <v-img
            v-if="
              ['jpg', 'png', 'jpeg', 'gif', 'svg'].includes(
                uploadPreviewFileType
              )
            "
            height="60"
            width="60"
            :src="uploadPreview"
          ></v-img>
          <v-img
            v-else-if="
              ['doc', 'docx', 'xls', 'xlsx', 'csv', 'pdf', 'zip'].includes(
                uploadPreviewFileType
              )
            "
            height="60"
            width="60"
            :src="require(`@/assets/dashboard/${uploadPreviewFileType}.svg`)"
          ></v-img>
          <v-img
            v-else
            height="60"
            width="60"
            src="@/assets/dashboard/other.svg"
          ></v-img>
          <v-icon
            @click="
              clearFiles(), (uploadPreview = ''), (uploadPreviewFileType = '')
            "
            >mdi-close-octagon</v-icon
          >
        </div>

        <!-- <photo-collage-wrapper v-if="file.length !=0" gapSize="6px"
          v-bind='{
            width: "1200px",
            height: ["400px", "400px"],
            layout: [4],
            photos: [{ source:imageUploadPreview}],
            showNumOfRemainingPhotos: true,
          }'
        >
        </photo-collage-wrapper> -->
      </div>
    </v-col>
    <v-col cols="auto">
      <div
        :class="$vuetify.breakpoint.lg ? 'action' : 'action mobile-action'"
        v-if="ticket?.status != 'Complete' && !isAudioSelected"
      >
        <v-file-input
          id="fileUpload"
          label="File input"
          style="display: none"
          v-model="file"
          @change="vInputFileChange"
        ></v-file-input>

        <v-textarea
          class="pl-2"
          placeholder="Enter your message here...."
          @keydown.enter.exact.prevent
          @keyup.enter.exact="sendMessage()"
          @keydown.enter.shift.exact="newline"
          :disabled="recordMode == 'press'"
          rows="1"
          row-height="15"
          no-resize
          v-model="message"
        >
          <template v-slot:append>
            <!-- <img
              class="mr-4 cursor-pointer"
              width="18"
              height="18"
              @click="chooseFile"
              :src="require('@/assets/dashboard/paper-clip.svg')"
            /> -->
            <v-btn
              :disabled="recordMode == 'press'"
              class="attach-file"
              color="transparent"
              x-small
              depressed
              v-ripple="false"
            >
              <img
                class="cursor-pointer"
                width="18"
                height="18"
                @click="chooseFile"
                :src="require('@/assets/dashboard/paper-clip.svg')"
              />
              <!-- <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <img
                    v-bind="attrs"
                    v-on="on"
                    class="cursor-pointer"
                    width="18"
                    height="18"
                    :src="require('@/assets/dashboard/paper-clip.svg')"
                  />
                </template>
                <v-list>
                  <v-list-item class="cursor-pointer">
                    <v-list-item-title @click="chooseFile"
                      >Upload File</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item  class="cursor-pointer" @click="cameraDialog=true">
                    <v-list-item-title >Take Photo</v-list-item-title>
                  </v-list-item>
                </v-list>
                
              </v-menu> -->
            </v-btn>
          </template>
        </v-textarea>

        <IOSVoiceRecorder
          v-if="showIosVoiceRecorder"
          @close-voice-recorder="showIosVoiceRecorder = false"
        ></IOSVoiceRecorder>
        <span
          v-if="ios || safari || mobile"
          class="material-icons mt-1 iosVoiceRecorderIcon cursor-pointer"
          @click="showIosVoiceRecorder = true"
        >
          mic
        </span>

        <vue-record-audio
          v-else
          :mode="recordMode ? recordMode : 'press'"
          @stream="onStream"
          @result="audioResult"
        ></vue-record-audio>

        <v-btn
          v-if="$vuetify.breakpoint.lg"
          class="send"
          :loading="msgLoader"
          @click="sendMessage()"
          >Send <v-img src="@/assets/dashboard/send.svg"></v-img
        ></v-btn>

        <v-btn
          v-else
          depressed
          class="send"
          :loading="msgLoader"
          @click="sendMessage()"
          ><span class="material-icons"> send </span></v-btn
        >
        <!-- <audio controls muted v-else-if="isAudioSelected">
          <source :src="blobUrl" />
          Your browser does not support the audio element.
        </audio>
        
        <v-btn
          v-if="isAudioSelected"
          class="ma-0 pa-0 ml-2"
          fab
          x-small
          depressed
          dark
          color="red"
          @click="isAudioSelected = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn v-if="!isAudioSelected" class="send"
          >Send <v-icon>mdi-send</v-icon></v-btn
        > -->
      </div>
      <v-row
        :class="
          $vuetify.breakpoint.lg
            ? 'action save-audio'
            : 'save-audio d-flex justify-space-around mobile-action action'
        "
        v-if="ticket?.status != 'Complete' && isAudioSelected"
      >
        <v-col>
          <AudioWaveform
            v-if="blobUrl"
            :audio="blobUrl"
            id="attachedAudio"
          ></AudioWaveform>
        </v-col>
        <v-col cols="auto" @click="clearAudio()">
          <v-btn
            class="ma-0 px-0 ml-2 mt-4"
            :class="!$vuetify.breakpoint.lg ? 'mr-3' : ''"
            fab
            x-small
            depressed
            dark
            color="red"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn class="send" :loading="audioLoader" @click="sendAudio()"
            >Send <v-img src="@/assets/dashboard/send.svg"></v-img
          ></v-btn>
        </v-col>
      </v-row>
    </v-col>

    <!-- <v-card-actions class="ma-0 py-0 px-6">
      <span v-if="file.length != 0" class=""
        >{{ file.name }} | {{ bytesToSize }}</span
      >
      <span
        v-if="file.length != 0"
        @click="clearFiles"
        style="cursor: pointer"
        class="pl-2"
        >clear</span
      >
      <span v-if="file.length == 0" class="">No file has been selected</span>
    </v-card-actions> -->
    <CapturePhotoFromCamera
      v-if="cameraDialog"
      :dialog="cameraDialog"
      @capture="captureImage"
      @off-camera="cameraDialog = false"
    />
  </v-row>
  <!-- <div class="chat-box">     
    </div> -->
</template>
<script>
import CapturePhotoFromCamera from "../common/CapturePhotoFromCamera.vue";
import { PhotoCollageWrapper } from "vue-photo-collage";
import AudioWaveform from "../common/AudioWaveform.vue";
import MessageFormat from "../common/MessageFormat.vue";
import IOSVoiceRecorder from "../common/ios/audio/IOSVoiceRecoder.vue";
import { mapGetters } from "vuex";
import moment from "moment";
import UrlServices from "../../services/Url";
import axios from "axios";
import EventBus from "../../js/EventBus";
import socket from "../../services/SocketIo";

import { isIOS, isSafari, isMobile } from "mobile-device-detect";

export default {
  name: "ChatBox",
  components: {
    PhotoCollageWrapper,
    AudioWaveform,
    MessageFormat,
    IOSVoiceRecorder,
    CapturePhotoFromCamera,
  },
  data() {
    return {
      cameraDialog: false,
      showIosVoiceRecorder: false,
      ios: isIOS,
      safari: isSafari,
      mobile: isMobile,
      mode: "press",
      message: "",
      audioLoader: false,
      msgLoader: false,
      file: [],
      blobUrl: "",
      blobData: "",
      isAudioSelected: false,
      recordMode: "",
      loader: true,
      uploadPreview: "",
      uploadPreviewFileType: "",
      roleArray: ["client", "employee"],
      messages: [],
      audio: "",
      testing: "",
    };
  },
  props: {
    ticket: Object,
  },
  computed: {
    ...mapGetters({
      currentWorkspace: "auth/getCurrentWorkspace",
      token: "auth/getAuthToken",
    }),
    updatedMessages() {
      let comments = this.messages;
      comments = comments.map((curr, i, array) => {
        if (i == 0) {
          curr["newDate"] = true;
          return curr;
        }
        const currentValue = moment(curr.createdAt).format("YYYY MM DD");
        const previousValue = moment(array[i - 1].createdAt).format(
          "YYYY MM DD"
        );
        curr["newDate"] = true;
        if (currentValue === previousValue) curr["newDate"] = false;
        return curr;
      });
      return comments;
    },
    bytesToSize() {
      const bytes = this.file.size;
      if (bytes > 5000000) {
        return false;
      }
      var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (bytes == 0) return "0 Byte";
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
    },
  },
  created() {
    this.getMessagesByTicketId();
    this.subscribe();
  },
  mounted() {
    EventBus.$on("save-ios-audio", (data) => {
      this.blobData = "";
      this.blobUrl = data.url;
      this.blobData = data.blob;
      data.url ? this.sendAudio() : "";
    });
  },
  methods: {
    captureImage(data) {
      console.log("this is capture image in parent", data);
      this.file = new File([data], "image.jpeg", {
        type: data.type,
      });
      this.cameraDialog = false;
      this.vInputFileChange(data);
    },
    callback(data) {
      console.log("this is callback data===>", data);
    },
    clearAudio() {
      this.isAudioSelected = false;
      this.recordMode = "";
    },
    subscribe() {
      socket.on("comment", (body) => {
        if (this.token)
          if (this.ticket.ticketNo == body.ticketNo) {
            this.getMessagesByTicketId();
          }
      });
    },
    async sendMessage() {
      console.log("this is file in send message", this.file);
      if (this.message.trim().length === 0 && this.file.length === 0) return;
      this.msgLoader = true;
      let formdata = new FormData();
      if (this.file.length != 0) formdata.append("file", this.file);
      formdata.append("message", this.message);
      axios
        .post(
          `${UrlServices.sendMessage}${this.ticket.workspaceId}/${
            this.ticket._id
          }/${this.ticket.fileTimestamp || 23}`,
          formdata,
          {
            headers: {
              Authorization: this.token,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          console.log("this is res", res);
          if (this.file.length != 0) this.$emit("file-sent");
          this.clearFiles();
          this.uploadPreview = "";
          this.uploadPreviewFileType = "";
          this.getMessagesByTicketId();
        });
    },
    clearFiles() {
      this.msgLoader = false;
      this.audioLoader = false;
      this.isAudioSelected = false;
      this.file = [];
      this.previewFromFileInput = null;
      this.isActive = true;
      this.message = "";
    },
    async sendAudio() {
      this.audioLoader = true;
      let formdata = new FormData();
      const file = new File([this.blobData], "audio.wav", {
        type: "audio/wav",
      });

      formdata.append("file", file);
      axios
        .post(
          `${UrlServices.sendMessage}${this.ticket.workspaceId}/${
            this.ticket._id
          }/${this.ticket.fileTimestamp || 23}`,
          formdata,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          this.getMessagesByTicketId();
          this.msgLoader = false;
          this.loader = false;
          this.isAudioSelected = false;
          this.audioLoader = false;
          this.blobUrl = "";
          this.blobData = "";
          this.showIosVoiceRecorder = false;
        });
    },
    async vInputFileChange(file) {
      this.uploadPreview = URL.createObjectURL(file);
      this.uploadPreviewFileType = file.name
        ? file.name.split(".").pop()
        : "jpeg";
      this.preview = null;
      this.isActive = true;
      if (this.bytesToSize != false) {
        if (file.type.startsWith("image/")) {
          return new Promise(async (resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve((this.preview = reader.result));
            reader.onerror = (error) => reject(error);
            this.isActive = false;
            this.file.value = "";
          });
        }
      } else {
        this.file.value = "";
        this.clearFiles();
        return this.$showNotificationBar(
          "error",
          "File size should be less than 5 MB."
        );
      }
    },
    getMessagesByTicketId() {
      this.$store
        .dispatch("ticket/getAllMessagesByTicketId", {
          id: this.ticket._id,
        })
        .then((res) => {
          this.loader = false;
          this.messages = res.data.messages;
          if (this.loader == false) {
            setTimeout(function () {
              var objDiv = document.getElementById("chatBoxDiv");
              if (!objDiv) {
                objDiv = document.getElementById("messagesDivId");
              }
              console.log("this is obj of scroll", objDiv);
              objDiv.scrollTop = objDiv.scrollHeight;
            }, 1);
          }
        })
        .catch((e) => {
          console.log("catch here =>", e);
        });
    },
    chooseFile() {
      document.getElementById("fileUpload").click();
    },
    audioResult(data) {
      this.isAudioSelected = true;
      this.blobUrl = window.URL.createObjectURL(data);
      this.blobData = data;
      this.recordMode = "";
    },
    onStream(stream) {
      this.recordMode = "press";
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
  beforeDestroy() {
    // socket.removeAllListeners("comment");
  },
};
</script>

<style lang="scss" scoped>
.mobile-action {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: white;
  padding-bottom: 10px;
  z-index: 10000000000000;
  // z-index : 1;
}

.selected-images {
  display: flex;
  justify-content: flex-end;
  .img {
    position: relative;
    width: 60px;
    margin-right: 20px;
  }
  .v-icon {
    position: absolute;
    top: -15px;
    right: -15px;
  }
}
p {
  margin-bottom: 0px;
}
.date {
  display: flex;
  justify-content: center;
  font-size: 12px;
}
.date-mobile {
  display: flex;
  justify-content: center;
  font-size: 12px;
  margin-top: 50px;
}

.sticky-date {
  position: sticky;
  top: 0;
  z-index: 999;
  p {
    max-width: 120px;
    background: #dfdede;
    padding: 9px;
    border-radius: 13px;
    color: #6634e9;
  }
}
.messages {
  overflow: scroll;
  height: 35vh;
}
.message {
  max-width: 400px;
  width: fit-content;
}
.msg {
  background: #fafbfc;
  border-radius: 12px 12px 12px 0px;
  max-width: 400px;
  padding: 12px 10px 8px 10px;
  margin-top: 10px;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;
  color: #40415a;
  min-width: fit-content;
  width: 100%;
}
.time {
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
  line-height: 15px;
  color: #9d9eab;
  margin-top: 7px;
}
.receive {
  margin-left: 20px;
}
.send {
  margin-right: 20px;
  margin-left: auto;
}
.singleMobileMessage {
  top: 50px;
  position: relative;
  padding-left: 8px;
  padding-right: 0px;
}
.send .msg {
  background: #faf9ff;
  word-break: break-all !important;
}
.action {
  padding-left: 20px;
  display: flex;
  .v-btn {
    margin-left: 10px;
    margin-top: 10px;
  }
  .record {
    background: rgba(102, 52, 233, 0.07);
    border-radius: 6px;
    height: 40px;
  }
  .send {
    background: #6634e9;
    border-radius: 6px !important;
    height: 40px !important;
    width: 78px;
    text-transform: capitalize;
    color: white;
  }
}
.action .v-input {
  background: #ffffff;
  border: 1px solid #e8ebf4;
  border-radius: 6px;
  height: 52px;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  color: #9d9eab;
  .v-text-field__slot {
    margin-left: 10px;
    margin-bottom: 10px;
  }
}
.vue-audio-recorder {
  background-color: #6635e9;
  width: 40px;
  height: 40px;
  margin-top: 11px;
  margin-left: 7px;
}
.no-message-found {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 35%;
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 27px;
  color: #40415a;
  .content {
    margin-top: 16px;
  }
}
.attach-file {
  padding-bottom: 15px !important;
}
.theme--light.v-btn:hover::before {
  opacity: 0 !important;
}
</style>

<style scoped>
.v-input__slot::before {
  border-style: none !important;
}
.vue-photo-collage {
  width: auto !important;
}
.vue-photo-grid {
  max-width: 120px;
  max-height: 120px;
}
.vue-photo-row {
  height: 120px !important;
  display: flex;
  justify-content: flex-end;
  margin-right: 20px;
  padding: 20px;
}
.save-audio #audioplayer {
  max-width: 100% !important;
  width: 100% !important;
}
.scrollable {
  overflow-y: scroll;
  height: calc(100vh - 20px);
}
.iosVoiceRecorderIcon {
  color: #ede7fd;
  font-size: 35px;
  border-radius: 60%;
  width: 48px;
  background-color: #6534e9;
  padding-top: 7px;
  padding-left: 6px;
  margin-left: 10px;
}
</style>
