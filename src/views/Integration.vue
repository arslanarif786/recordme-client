<template>
  <v-container
    :style="
      $vuetify.breakpoint.lg
        ? 'margin-top: 0px !important'
        : 'margin-top: 49px !important'
    "
  >
    <v-row>
      <v-col md="12" cols="12" sm="12" class="pb-0">
        <p class="pa-0 ma-0 black--text fs-20 fw-600 f-inter">Integration</p>

        <p class="py-2 ma-0 fs-13 fw-400 text-wrap-normal">
          Not seeing your desired software?
          <u @click="feedbackDialog = true" style="cursor: pointer"
            ><b>Let us know</b></u
          >
        </p>
      </v-col>
      <v-col
        md="4"
        lg="3"
        cols="12"
        sm="12"
        class="pt-0"
        v-for="(item, index) in items"
        :key="index"
        :id="item.id"
      >
        <v-card class="p-1 custom-int-card" outlined>
          <v-skeleton-loader
            v-if="skeletonLoader"
            type="article, list-item"
          ></v-skeleton-loader>
          <v-row v-if="!skeletonLoader" class="pa-5">
            <v-col cols="2" class="pa-0 pl-3">
              <v-img
                :src="getImgUrl(item.img)"
                width="35"
                height="32"
                class="mt-2"
              ></v-img>
            </v-col>
            <v-col cols="10" class="ml-0 pl-3">
              <v-list-item-title
                class="fs-16 fw-500 mb-1 pa-0 ma-0 text-capitalize"
              >
                {{ item.heading }}
                <span v-if="organizationName">({{ organizationName }})</span>
                <v-list-item-subtitle
                  class="pt-2 fs-13 fw-400 text-wrap-normal"
                  justify="center"
                  >{{ item.sub_heading }}</v-list-item-subtitle
                >
              </v-list-item-title>
            </v-col>

            <!-- this button only show , when screen is  lg -->
            <v-col
              :class="
                $vuetify.breakpoint.lg
                  ? 'pt-0 pb-1'
                  : 'pt-0 pb-1 justify-items-center display-grid'
              "
              cols="12"
            >
              <img
                v-if="!currentWorkspace.isAccountingSoftConnected"
                :src="connectXeroButton"
                class="xero-branded-button"
                @click="connectWorkspace(item)"
              />
              <img
                v-if="currentWorkspace.isAccountingSoftConnected"
                :src="disconnectXeroButton"
                class="xero-branded-button"
                @click="disConnectWorkspace(item)"
              />

              <!-- <v-btn
                class="btn-primary primary--text text-capitalize connect-btn"
                :color="
                  currentWorkspace.isAccountingSoftConnected
                    ? 'active-button'
                    : 'lightBackground'
                "
                depressed
                width="228"
                height="35"
                small
                @click="
                  currentWorkspace.isAccountingSoftConnected
                    ? disConnectWorkspace(item)
                    : connectWorkspace(item)
                "
                ><span
                  class="fw-500 fs-14"
                  :class="
                    currentWorkspace.isAccountingSoftConnected
                      ? 'active-button'
                      : ''
                  "
                  >{{
                    currentWorkspace.isAccountingSoftConnected
                      ? "Connected"
                      : "Connect"
                  }} </span
                ><v-icon
                  dark
                  :class="
                    currentWorkspace.isAccountingSoftConnected
                      ? 'active-button'
                      : ''
                  "
                  right
                  v-if="!currentWorkspace.isAccountingSoftConnected"
                >
                  east
                </v-icon></v-btn
              > -->
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <Dialog
      :modal="dialog"
      :buttonLoader="dialogButtonLoader"
      @close-clicked="dialog = false"
      @save-clicked="disConnectXeroAccountingSoftware()"
    >
      <template v-slot:header> Confirmation </template>
      <template v-slot:content>
        Are you sure you want to disconnect Xero?
      </template>
      <template v-slot:buttonHeading> Yes </template>
    </Dialog>

    <Dialog
      :modal="feedbackDialog"
      :buttonLoader="feedbackDialogButtonLoader"
      @close-clicked="closeFeedbackDialog()"
      @save-clicked="saveFeedback()"
    >
      <template v-slot:header> Feedback </template>
      <template v-slot:content>
        Please select the desired accounting software
        <v-form ref="form" v-model="validate" lazy-validation>
          <v-select
            label="Select Software"
            background-color="inputBackground"
            class="text-no-wrap rounded-lg custom mt-2 mr-2"
            filled
            item-text="label"
            item-value="value"
            :items="desiredSoftware?.softwares"
            :rules="desiredSoftwareRules"
            v-model="desiredSoftware.software"
            hide-details
          ></v-select>
          <v-text-field
            v-if="desiredSoftware.software == 'other'"
            background-color="inputBackground"
            flat
            autocomplete="off"
            class="text-no-wrap rounded-lg custom mr-2 mt-2"
            v-model="desiredSoftware.other"
            label="Software Name"
            placeholder="Enter your desired software name"
            :rules="desiredSoftwareRules"
            clearable
            filled
            hide-details
            maxlength="25"
          ></v-text-field>

          <v-textarea
            background-color="inputBackground"
            flat
            autocomplete="off"
            class="text-no-wrap rounded-lg custom mr-2 mt-2"
            v-model="desiredSoftware.description"
            label="Description"
            placeholder="Enter Description"
            clearable
            filled
            :rules="desiredSoftwareRules"
            hide-details
            no-resize
            maxlength="500"
          ></v-textarea>
        </v-form>
      </template>
    </Dialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import UrlServices from "../services/Url";
import Dialog from "../components/common/dialog-box";
import ApiService from "../services/Api";
import connectXero from "../assets/xero-buttons/connect-blue.svg";
import disconnectXero from "../assets/xero-buttons/disconnect-blue.svg";
export default {
  components: {
    Dialog,
  },

  computed: {
    ...mapGetters({
      currentWorkspace: "auth/getCurrentWorkspace",
      workspaces: "auth/getUserWorkSpaces",
      token: "auth/getAuthToken",
    }),
  },

  data: () => ({
    connectXeroButton: connectXero,
    disconnectXeroButton: disconnectXero,
    loader: false,
    skeletonLoader: true,
    dialog: false,
    dialogButtonLoader: false,
    organizationName: "",
    // feedbackDialog Variables
    feedbackDialog: false,
    feedbackDialogButtonLoader: false,
    desiredSoftwareRules: [(v) => !!v || "Field cannot be empty"],
    desiredSoftware: {
      softwares: [
        {
          label: "Fresh Books",
          value: "Fresh Books",
        },
        {
          label: "Visma",
          value: "Visma",
        },
        {
          label: "Quickbooks",
          value: "Quickbooks",
        },
        {
          label: "Zoho",
          value: "Zoho",
        },
        {
          label: "Wave Account",
          value: "Wave Account",
        },
        {
          label: "Freeagent",
          value: "Freeagent",
        },
        {
          label: "Other",
          value: "other",
        },
      ],
      software: "",
      other: "",
      description: "",
    },
    validate: false,
    // feedbackDialog Variables end
    items: [
      // {
      //   img: "int-1.svg",
      //   heading: "Fresh Books",
      //   sub_heading: "Lorem Ipsum is simply dummy text of the printing",
      //   to: "/dashboard",
      // },
      // {
      //   img: "int-2.svg",
      //   heading: "Visma",
      //   sub_heading: "Lorem Ipsum is simply dummy text of the printing",
      //   to: "/dashboard",
      // },
      // {
      //   img: "int-3.svg",
      //   heading: "Quickbooks",
      //   sub_heading: "Lorem Ipsum is simply dummy text of the printing",
      //   to: "/dashboard",
      // },
      {
        img: "int-4.svg",
        heading: "Xero",
        sub_heading:
          "Online accounting software for your business,connects you to your bank, accountant, bookkeeper, and other business apps.",
        to: "/dashboard",
        id: "v-step-7",
      },
      // {
      //   img: "int-5.svg",
      //   heading: "Zoho",
      //   sub_heading: "Lorem Ipsum is simply dummy text of the printing",
      //   to: "/dashboard",
      // },
      // {
      //   img: "int-1.svg",
      //   heading: "Fresh Books",
      //   sub_heading: "Lorem Ipsum is simply dummy text of the printing",
      //   to: "/dashboard",
      // },
      // {
      //   img: "int-6.svg",
      //   heading: "Wave Account",
      //   sub_heading: "Lorem Ipsum is simply dummy text of the printing",
      //   to: "/dashboard",
      // },
      // {
      //   img: "int-7.svg",
      //   heading: "Freeagent",
      //   sub_heading: "Lorem Ipsum is simply dummy text of the printing",
      //   to: "/dashboard",
      // },
    ],
  }),
  mounted() {
    this.getOrganization();
  },
  methods: {
    /**
     * Method to fetch connected Xero organization name
     */
    getOrganization() {
      this.skeletonLoader = true;
      ApiService.GetRequest(
        `xero/organization/${this.currentWorkspace.workspaceId}`
      )
        .then((res) => {
          this.skeletonLoader = false;
          res.data.organisations.map((org) => {
            this.organizationName = org.legalName;
          });
        })
        .catch((err) => {
          this.skeletonLoader = false;
          let payload = {
            ...this.currentWorkspace,
          };
          // find workspace in all workspaces
          let singleWorkspace = this.workspaces.find(
            (e) => e._id === payload._id
          );
          // set isAccountingSoftConnected key to false in all workspaces
          if (singleWorkspace) {
            singleWorkspace["isAccountingSoftConnected"] = false;
          }
          this.$store.commit("auth/userWorkspaces", this.workspaces);
          // set isAccountingSoftConnected key to false
          payload.isAccountingSoftConnected = false;
          // update currentWorkspace
          this.$store.commit("auth/addCurrentWorkspace", payload);
        });
    },
    // method to save Feedback in Feedback Dialog
    async saveFeedback() {
      try {
        if (!this.$refs.form.validate()) return;
        this.feedbackDialogButtonLoader = true;
        let data = {
          softwareName:
            this.desiredSoftware.software === "other"
              ? this.desiredSoftware.other
              : this.desiredSoftware.software,
          description: this.desiredSoftware.description,
        };
        await ApiService.PostRequest(UrlServices.userFeedback, data);
        this.$showNotificationBar(
          "success",
          "Thankyou for your precious feedback."
        );
        this.closeFeedbackDialog();
      } catch (error) {
        this.$showNotificationBar("error", error.response.data.message);
        this.feedbackDialogButtonLoader = false;
      }
    },
    // method to close Feedback Dialog and Reset
    closeFeedbackDialog() {
      this.$refs.form.reset();
      this.feedbackDialog = false;
      this.feedbackDialogButtonLoader = false;
      this.$refs.form.resetValidation();
    },
    getImgUrl(pic) {
      return require("../assets/integration/" + pic);
    },
    disConnectWorkspace(item) {
      if (item.heading == "Xero") {
        this.dialog = true;
        // this.disConnectXeroAccountingSoftware();
      }
    },
    /**
     * Method to disconnect Xero organization
     */
    disConnectXeroAccountingSoftware() {
      this.dialogButtonLoader = true;
      ApiService.GetRequest(
        `${UrlServices.disconnectXero}/${this.currentWorkspace._id}`,
        {
          headers: {
            Authorization: this.token,
          },
        }
      )
        .then((res) => {
          this.$showNotificationBar("success", "Successfully disconnected");
          let payload = {
            ...this.currentWorkspace,
          };
          payload.isAccountingSoftConnected = false;
          this.$store.commit("auth/addCurrentWorkspace", payload);
          this.$store.commit("auth/updateUserWorkspaces", payload);
          this.dialog = false;
          this.dialogButtonLoader = false;
          this.organizationName = "";
        })
        .catch((e) => {
          this.dialogButtonLoader = false;
          this.$showNotificationBar("error", e.response.data.message);
        });
    },
    /**
     *
     * @param {*} item
     * Method to connect Xero organization
     */
    connectWorkspace(item) {
      if (item.heading == "Xero") this.connectXeroAccountingSoftware();
    },
    /**
     * Method to connect account software with application
     */
    connectXeroAccountingSoftware() {
      try {
        this.loader = true;
        this.validation(this.currentWorkspace);
        const { workspaceId } = this.currentWorkspace;
        let token = localStorage.getItem("token");
        ApiService.GetRequest(
          `xero/connect?token=${token}&workspaceId=${workspaceId}`
        ).then((response) => {
          console.log("connectXeroAccountingSoftware ===>", response.data);
          window.location.href = response.data.url;
        });
      } catch (e) {
        this.$showNotificationBar("error", e.message);
        this.loader = false;
      }
    },
    validation(workspace) {
      if (workspace.isAccountingSoftConnected == true) {
        throw new Error("Workspace is already Connected");
      }
    },
  },
};
</script>
<style scoped>
.connect-btn {
  border-radius: 8px;
}

.custom-int-card {
  border-radius: 8px;
}
.active-button {
  background-color: #6634e9 !important;
  border-radius: 8px;
  color: #fff !important;
}
.xero-branded-button {
  border-radius: 10px;
  width: 100%;
  height: 80%;
  cursor: pointer;
}
</style>
