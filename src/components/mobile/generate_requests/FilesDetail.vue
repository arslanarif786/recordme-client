<template>
  <v-dialog
    v-model="mobileFilesDialog"
    fullscreen
    hide-overlay
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card flat>
      <v-app-bar flat fixed color="#2b2442" dense dark>
        <v-toolbar-title>Ticket ID {{ ticket.ticketNo }}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn dark text @click="closeDialog()" class="pr-0 mr-0">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>

      <v-row
        justify="center"
        class="ma-2 mt-15"
        v-if="ticket.files?.length >= 1 || ticket.attachmentUrl"
      >
        <v-expansion-panels accordion flat class="documents-list">
          <v-expansion-panel v-if="ticket.attachmentUrl" class="documents">
            <v-expansion-panel-header
              expand-icon=""
              :class="
                selectedFile._id == ticket._id
                  ? 'active cursor-pointer border-1 mb-1'
                  : 'cursor-pointer border-1 mb-1'
              "
              @click="openSingleFile(ticket)"
            >
              <v-row>
                <v-col cols="12">
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
                </v-col>
                <v-col cols="2">
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
                </v-col>
                <v-col cols="10">
                  <p class="file-name mt-1">
                    {{
                      ticket.attachmentName
                        ? ticket.attachmentName
                        : "Attached File"
                    }}
                  </p>
                  <p class="secondary--text">
                    Shared Date {{ ticket.createdAt | formatDate }}
                  </p>
                </v-col>
              </v-row>
            </v-expansion-panel-header>
          </v-expansion-panel>
          <v-expansion-panel v-for="(item, index) in ticket.files" :key="index">
            <v-expansion-panel-header
              expand-icon=""
              :class="
                selectedFile._id == item._id
                  ? 'active cursor-pointer border-1 mb-1'
                  : 'cursor-pointer border-1 mb-1'
              "
              @click="openSingleFile(item)"
            >
              <v-row>
                <v-col cols="12">
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
                </v-col>
                <v-col cols="2">
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
                    width="45"
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
                </v-col>
                <v-col cols="10">
                  <p class="file-name mt-1">{{ item.file.originalname }}</p>
                  <p class="secondary--text">
                    Shared Date {{ item.createdAt | formatDate }}
                  </p>
                </v-col>
              </v-row>

              <!-- <div class="description">
                <div class="detail">
                  <p class="file-name">{{ item.file.originalname }}</p>
                  <p class="file-date">
                    Shared Date {{ item.createdAt | formatDate }}
                  </p>
                </div>
              </div> -->
            </v-expansion-panel-header>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>

      <div v-else class="file-not-found-document">
        <v-img src="@/assets/dashboard/file.svg" width="200"></v-img>
        <div class="mt-5 fw-400 fs-20 lh-27 f-avenir fs-normal">
          No File Found
        </div>
      </div>
    </v-card>
    <SingleFile
      @close-single-file-dialog="
        () => {
          (FileDialog = false), (showSingleFile = '');
        }
      "
      v-if="FileDialog"
      :showSingleFile="showSingleFile"
    />
  </v-dialog>
</template>
<script>
import SingleFile from "../generate_requests/partials/ViewSingleFile.vue";

import { mapGetters } from "vuex";
import EventBus from "../../../js/EventBus";
export default {
  components: { SingleFile },
  name: "FilesDetail",
  props: {
    ticket: Object,
    mobileFilesDialog: Boolean,
  },
  computed: {
    ...mapGetters({
      currentWorkspace: "auth/getCurrentWorkspace",
    }),
  },
  data() {
    return {
      FileDialog: false,
      file: "",
      selectedFile: "",
      backendURL: process.env.VUE_APP_BACK_END_URL,
      showSingleFile: "",
    };
  },
  mounted() {
    console.log("ticket is here", this.ticket);
  },
  methods: {
    openSingleFile(item) {
      this.FileDialog = true;
      this.showSingleFile = item;
      // EventBus.$emit("show-single-file", item);
    },
    closeDialog() {
      this.$emit("close-file-dialog");
    },
  },
};
</script>
<style scoped lang="scss">
.file-not-found-document {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 10%;
  top: 40%;
  left: 50%;
  position: sticky;
}
.progressbar {
  position: absolute !important;
  z-index: 10;
  left: 40%;
}
.border-1 {
  border: 1px solid rgb(180, 173, 173);
  border-radius: 5px !important;
}
.file-name {
  word-break: break-all !important;
}
.not-scroll{
  -webkit-animation: alternate;
  overflow: hidden;
  display: none;


}
</style>