<template>
  <v-dialog v-model="singleFileDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card class="ma-0 pa-0 border-radius-0" flat>
      <v-app-bar flat fixed color="#2b2442" dense dark>
        <v-toolbar-title>File</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn dark text @click="closeDialog()" class="pr-0 mr-0">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>

      <div class="file-viewer-side" v-if="selectedFile">
        <img v-if="
  ['jpg', 'png', 'jpeg'].includes(
    selectedFile.file.originalname.split('.').pop()
  ) && data
" width="100%" class="single-img" :src="file" />
        <VueDocPreview v-if="
  ['doc', 'docx', 'pptx', 'ppt', 'xlsx', 'xls'].includes(
    selectedFile.file.originalname.split('.').pop()
  ) && data
" :value="file" type="office" />

        <VuePdfEmbed v-if="
  ['pdf'].includes(selectedFile.file.originalname.split('.').pop()) &&
  data
" :source="file" />
      </div>
      <div v-else class="file-not-found-document">
        <v-img src="@/assets/dashboard/file.svg" width="200"></v-img>
        <div class="mt-5 fw-400 fs-20 lh-27 f-avenir fs-normal">
          No File found
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import FormInput from "../../../common/FormInput.vue";
import ChatBox from "../../../common/ChatBox.vue";
import VueDocPreview from "vue-doc-preview";
import VuePdfEmbed from "vue-pdf-embed/dist/vue2-pdf-embed";
import axios from "axios";
import UrlServices from "../../../../services/Url";
import { mapGetters } from "vuex";
import EventBus from "../../../../js/EventBus";
export default {
  components: { FormInput, ChatBox, VueDocPreview, VuePdfEmbed },
  name: "FilesDetail",
  props: {
    showSingleFile: Object,
  },
  computed: {
    ...mapGetters({
      currentWorkspace: "auth/getCurrentWorkspace",
      token: "auth/getAuthToken",
    }),
  },
  data() {
    return {
      singleFileDialog: true,
      data: false,
      file: "",
      selectedFile: "",
      showpopup: true,
      detailtab: "Details",
      fileid: "1",
      ticket: null,
    };
  },
  mounted() {
    if (this.showSingleFile.attachmentUrl) {
      this.openAttachedDocument(this.showSingleFile)
    } else {
      this.selectFile(this.showSingleFile);
    }
  },
  methods: {
    closeDialog() {
      this.$emit("close-single-file-dialog");
    },
    async openAttachedDocument(ticket) {
      this.file = null;
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
      console.log(this.selectedFile.fileUrl, "this is selected file");
      await this.openPrivateUrl(
        this.selectedFile.fileUrl
          ? this.selectedFile.fileUrl
          : this.selectedFile.attachmentUrl
      );
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
      this.tokenValidation().then(() => {
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

      }).catch(err => {
        console.log("err ======> openPrivateUrl", err);

      })
    },
    async tokenValidation() {
      let configToken = {
        method: "get",
        url: "/user/verify-token",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      };
      return axios(configToken)
    },

  },
};
</script>
<style scoped lang="scss">
.file-viewer-side {
  padding: 10px;
  height: auto;
  overflow-y: scroll;
  width: 100%;
  margin-top: 39px;

  img {
    max-width: 100%;
  }
}

.single-img {
  object-fit: contain;
  background-repeat: no-repeat;
  height: 100vh;
}
</style>
