<template>
  <div class="mb-16">
    <!-- Workspace settings -->
    <v-card v-if="user.role === 'client'" flat class="profile-card mt-3 pb-7 mt-5" :class="$vuetify.breakpoint.lg ? '' : 'custom-height'">
      <v-card-title class="d-flex justify-space-between">
        <p
          class="fs-23 fw-400 textPrimary--text f-inter ml-3" :class="$vuetify.breakpoint.lg ? 'pt-2' : 'pt-3'"
          align="left"
          style="letter-spacing: -0.3px"
        >
          Workspace Settings
        </p>
        <!-- {{ user }} -->

        <!-- Edit Workspace Button Hidden -->
        <v-btn
          outlined
          class="text-capitalize edit-button fw-500 fs-13 f-inter mr-4"
          @click="editWorkSpace"
          width="63"
          height="32"
          dense
        >
          <v-icon size="12" class="fs-13 fw-400">mdi-pencil</v-icon> Edit</v-btn
        >
      </v-card-title>

      <v-row class="ma-2 mt-0 pa-0">
        <div v-if="$vuetify.breakpoint.lg" class="upload-icon cursor-pointer" @click="chooseFiles">
          <v-img
            src="../../assets/svg-icons/cloud-upload.svg"
            width="16"
            height="13"
            class="file-upload"
          ></v-img>
        </div>
        <!-- {{ `${backendURL}slack/${token}?file=${currentWorkspace.workspaceProfilePicture}` }} -->

        <v-avatar v-if="$vuetify.breakpoint.lg" class="profile" color="grey" size="100" rounded>
          <v-img
            v-if="currentWorkspace.workspaceProfilePicture"
            :src="
              currentWorkspace.workspaceProfilePicture
                ? `${backendURL}slack/${token}?file=${currentWorkspace.workspaceProfilePicture}`
                : '../../assets/placeholder-image.png'
            "
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          <v-img v-else src="../../assets/placeholder-image.png"> </v-img>
          <input
            id="fileUpload"
            type="file"
            hidden
            @change="uploadFile($event)"
            accept=" image/jpeg, image/jpg, image/png"
          />
        </v-avatar>

        <div v-else class="d-flex justify-center mr-5" style="width:100%">
        <div class="upload-icon cursor-pointer" @click="chooseFiles">
          <v-img
            src="../../assets/svg-icons/cloud-upload.svg"
            width="16"
            height="13"
            class="file-upload"
          ></v-img>
        </div>
        <!-- {{ `${backendURL}slack/${token}?file=${currentWorkspace.workspaceProfilePicture}` }} -->

        <v-avatar class="profile" color="grey" size="100" rounded>
          <v-img
            v-if="currentWorkspace.workspaceProfilePicture"
            :src="
              currentWorkspace.workspaceProfilePicture
                ? `${backendURL}slack/${token}?file=${currentWorkspace.workspaceProfilePicture}`
                : '../../assets/placeholder-image.png'
            "
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          <v-img v-else src="../../assets/placeholder-image.png"> </v-img>
          <input
            id="fileUpload"
            type="file"
            hidden
            @change="uploadFile($event)"
            accept=" image/jpeg, image/jpg, image/png"
          />
        </v-avatar>
        </div>

        <v-col md="5" class="ml-9">
          <v-row :class="$vuetify.breakpoint.lg ? '' : 'mt-3'">
            <v-col md="2" sm="3" class="ma-0 pa-0">
              <p class="fs-15 fw-400 textPrimary--text">Name:</p>
            </v-col>
            <v-col md="6" sm="9" class="ma-0 pa-0">
              <p class="fs-15 fw-600 textPrimary--text">
                {{ currentWorkspace.workspaceName }}
              </p>
            </v-col>
          </v-row>
          <v-row class="mt-6">
            <v-col lg="2" md="2" class="ma-0 pa-0">
              <p class="fs-15 fw-400 textPrimary--text">Email:</p>
            </v-col>
            <v-col lg="8" md="8" class="ma-0 pa-0">
              <p class="fs-15 fw-600 textPrimary--text" v-if="$vuetify.breakpoint.lg">
                {{ currentWorkspace.email + "@" + smtp }}
              </p>
              <p class="fs-15 fw-600 textPrimary--text" v-else>
                {{ (currentWorkspace.email + "@" + smtp).substr(0,20) }}..
              </p>
            </v-col>
          </v-row>
        </v-col>
        <v-col md="3" class="ma-0 pa-0" :class="$vuetify.breakpoint.lg ? '' : 'mt-2'">
          <div class="d-flex">
            <div class="ma-0 pa-0" :class="$vuetify.breakpoint.lg ? '' : 'ml-9'">
              <p class="fs-15 fw-400 f-inter textPrimary--text">
                Approve Submission:
              </p>
            </div>
            <div class="ma-0 pa-0">
              <v-btn
                style="margin-left: 50% !important"
                class="d-flex justify-end mb-0 mt-0 align-baseline"
                icon
                :color="invoiceRewriteSwitch ? 'primary' : 'inActiveColor'"
                :ripple="false"
                @click="rewriteInvoice"
              >
                <v-icon size="28" :ripple="false">{{
                  invoiceRewriteSwitch ? "mdi-toggle-switch" : "mdi-toggle-switch-off"
                }}</v-icon>
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
      <!-- <v-row v-else class="ma-2 ml-5 pa-0">
        <v-col
          v-for="(item, index) in employeeInfo"
          :key="index"
          class="ma-0 pa-0"
          :cols="$vuetify.breakpoint.lg ? 6 : 12"
        >
          <div class="d-flex justify-space-around">
            <v-col :cols="$vuetify.breakpoint.md ? 4 : 5" class="ma-0 pa-0">
              <p class="fs-15 fw-400 f-inter textPrimary--text">
                {{ item.name }}:
              </p>
            </v-col>
            <v-col :cols="$vuetify.breakpoint.md ? 8 : 7" class="ma-0 pa-0">
              <p class="fs-15 fw-500 f-inter textPrimary--text">
                {{ item.value ? item.value : "-" }}
              </p>
            </v-col>
          </div>
        </v-col>
      </v-row> -->
    </v-card>
    <!-- Personal Information -->

    <!-- web screen -->
    <v-card flat class="profile-card mt-4" v-if="$vuetify.breakpoint.lg">
      <v-card-title class="d-flex justify-space-between">
        <p
          class="fs-23 fw-400 textPrimary--text f-inter ml-3 mt-2"
          align="left"
          style="letter-spacing: -0.3px"
        >
          Personal Information
        </p>
        <v-btn
          outlined
          class="text-capitalize edit-button fw-500 fs-13 f-inter mr-4"
          @click="openEditProfileDialog"
          v-if="user.role == 'client'"
          height="32"
        >
          <v-icon size="12">mdi-pencil</v-icon> Edit</v-btn
        >
      </v-card-title>
      <v-row
        class="ma-0 ml-7 pa-0 mt-3"
        v-if="user.role == 'client'"
        style="width: 100%"
      >
        <v-col md="4" xs="12" class="ma-0 pa-0">
          <v-row>
            <v-col md="3"  class="ma-0 py-0 pr-0">
              <p class="fs-15 fw-400 f-inter textPrimary--text">Full Name:</p>
            </v-col>
            <v-col md="4" class="ma-0 py-0 pr-0">
              <p class="fs-15 fw-600 f-inter textPrimary--text">
                {{ user.name }}
              </p>
            </v-col>
          </v-row>

          <v-row class="mt-6">
            <v-col md="3" class="ma-0 py-0 pr-0">
              <p class="fs-15 fw-400 f-inter textPrimary--text">Country:</p>
            </v-col>
            <v-col md="4" class="ma-0 py-0 pr-0">
              <p class="fs-15 fw-600 f-inter textPrimary--text">
                {{ user.country }}
              </p>
            </v-col>
          </v-row>
          <v-row class="mt-6">
            <v-col md="3" class="ma-0 py-0 pr-0">
              <p class="fs-15 fw-400 f-inter textPrimary--text">Designation:</p>
            </v-col>
            <v-col md="4" class="ma-0 py-0 pr-0">
              <p class="fs-15 fw-600 f-inter textPrimary--text">
                {{ user.companyPosition ? user.companyPosition : "-" }}
              </p>
            </v-col>
          </v-row>
        </v-col>

        <v-col md="4" xs="12" class="ma-0 pa-0">
          <v-row>
            <v-col md="4" class="ma-0 py-0 pr-0">
              <p class="fs-15 fw-400 f-inter textPrimary--text">
                Company Name:
              </p>
            </v-col>
            <v-col md="4" class="ma-0 py-0 pr-0">
              <p class="fs-15 fw-600 f-inter textPrimary--text">
                {{ user.companyName }}
              </p>
            </v-col>
          </v-row>
          <v-row class="mt-6">
            <v-col md="4" class="ma-0 py-0 pr-0">
              <p class="fs-15 fw-400 f-inter textPrimary--text">Currency:</p>
            </v-col>
            <v-col md="4" class="ma-0 py-0 pr-0">
              <v-chip color="#F4F1FE" label :ripple="false">
                <span class="fs-15 fw-600 f-inter textPrimary--text">
                  {{ user.currency[0] }}
                </span>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span
                      v-bind="attrs"
                      v-on="on"
                      id="hover-click-chip"
                      v-if="user.currency.length > 1"
                      class="grey--text text-caption"
                      >(+{{ user.currency.length - 1 }} others)</span
                    >
                  </template>

                  <span
                    v-for="currency in tooltipCurrency"
                    :key="currency"
                    class="d-flex flex-column"
                    >{{ currency }}</span
                  >
                </v-tooltip>
              </v-chip>
            </v-col>
          </v-row>
        </v-col>
        <v-col md="4" xs="12" class="ma-0 pa-0">
          <v-row>
            <v-col md="3" class="ma-0 py-0 pr-0">
              <p class="fs-15 fw-400 f-inter textPrimary--text">Email:</p>
            </v-col>
            <v-col md="6" class="ma-0 py-0 pr-0">
              <span class="fs-15 fw-600 f-inter textPrimary--text">
                {{ user.email }}
              </span>
              <span
                class="mb-0 primary--text fs-15 fw-400 f-inter cursor-pointer d-flex"
                @click="changeEmail"
                v-if="user.role == 'client'"
              >
                Change Email
              </span>
            </v-col>
          </v-row>
          <v-row class="mt-6">
            <v-col md="3" class="ma-0 pr-0">
              <p class="fs-15 fw-400 f-inter textPrimary--text">Password:</p>
            </v-col>
            <v-col md="9" class="ma-0 pr-0">
              <span class="fs-15 fw-600 f-inter textPrimary--text">
                **********
              </span>
              <span
                class="mb-2 primary--text fs-15 fw-400 f-inter cursor-pointer d-flex"
                @click="changePassword"
                v-if="user.role == 'client'"
              >
                Change Password
              </span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row v-else class="ma-2 ml-5 pa-0">
        <v-col
          v-for="(item, index) in employeeInfo"
          :key="index"
          class="ma-0 pa-0"
          :cols="$vuetify.breakpoint.lg ? 6 : 12"
        >
          <div class="d-flex justify-space-around">
            <v-col :cols="$vuetify.breakpoint.md ? 4 : 5" class="ma-0 pa-0">
              <p class="fs-15 fw-400 f-inter textPrimary--text">
                {{ item.name }}:
              </p>
            </v-col>
            <v-col :cols="$vuetify.breakpoint.md ? 8 : 7" class="ma-0 pa-0">
              <p class="fs-15 fw-500 f-inter textPrimary--text">
                {{ item.value ? item.value : "-" }}
              </p>
            </v-col>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <!-- mobile screen -->
    <v-card flat class="profile-card mt-3" v-else :class="$vuetify.breakpoint.lg ? '' : 'custom-height-second-block'">
      <v-card-title class="d-flex justify-space-between">
        <p
          class="fs-23 fw-400 textPrimary--text f-inter ml-3 pt-3"
          align="left"
          style="letter-spacing: -0.3px"
        >
          Personal Information
        </p>
        <v-btn
          outlined
          class="text-capitalize edit-button fw-500 fs-13 f-inter mr-4"
          @click="openEditProfileDialog"
          v-if="user.role == 'client'"
          height="32"
        >
          <v-icon size="12">mdi-pencil</v-icon> Edit</v-btn
        >
      </v-card-title>
      <div
        class="ma-0 ml-7 pa-0 mt-4"
        v-if="user.role == 'client'"
      >
          <v-row>
            <v-col md="6" sm="6"  class="ma-0 py-0 pr-0">
              <p class="fs-15 fw-400 f-inter textPrimary--text">Full Name:</p>
            </v-col>
            <v-col md="6" sm="6" class="ma-0 py-0 pr-0">
              <p class="fs-15 fw-600 f-inter textPrimary--text">
                {{ user.name }}
              </p>
            </v-col>
          </v-row>

          <v-row>
            <v-col md="6" sm="6" class="ma-0 py-0 pr-0">
              <p class="fs-15 fw-400 f-inter textPrimary--text">Country:</p>
            </v-col>
            <v-col md="6" sm="6" class="ma-0 py-0 pr-0">
              <p class="fs-15 fw-600 f-inter textPrimary--text">
                {{ user.country }}
              </p>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="6" sm="6" class="ma-0 py-0 pr-0">
              <p class="fs-15 fw-400 f-inter textPrimary--text">Designation:</p>
            </v-col>
            <v-col md="6" sm="6" class="ma-0 py-0 pr-0">
              <p class="fs-15 fw-600 f-inter textPrimary--text">
                {{ user.companyPosition ? user.companyPosition : "-" }}
              </p>
            </v-col>
          </v-row>
    
          <v-row>
            <v-col md="6" class="ma-0 py-0 pr-0">
              <p class="fs-15 fw-400 f-inter textPrimary--text">
                Company Name:
              </p>
            </v-col>
            <v-col md="6" class="ma-0 py-0 pr-0">
              <p class="fs-15 fw-600 f-inter textPrimary--text">
                {{ user.companyName }}
              </p>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="6" class="ma-0 py-0 pr-0">
              <p class="fs-15 fw-400 f-inter textPrimary--text">Currency:</p>
            </v-col>
            <v-col md="6" class="ma-0 py-0 pr-0">
              <v-chip color="#F4F1FE" label :ripple="false">
                <span class="fs-15 fw-600 f-inter textPrimary--text">
                  {{ user.currency[0] }}
                </span>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span
                      v-bind="attrs"
                      v-on="on"
                      id="hover-click-chip"
                      v-if="user.currency.length > 1"
                      class="grey--text text-caption"
                      >(+{{ user.currency.length - 1 }} others)</span
                    >
                  </template>

                  <span
                    v-for="currency in tooltipCurrency"
                    :key="currency"
                    class="d-flex flex-column"
                    >{{ currency }}</span
                  >
                </v-tooltip>
              </v-chip>
            </v-col>
          </v-row>
       
          <v-row>
            <v-col md="3" class="ma-0 py-0 pr-0">
              <p class="fs-15 fw-400 f-inter textPrimary--text">Email:</p>
            </v-col>
            <v-col md="9" class="ma-0 py-0 pr-0">
              <span class="fs-15 fw-600 f-inter textPrimary--text">
                {{ user.email.substr(0,15) }}..
              </span>
              <span
                class="mb-0 primary--text fs-15 fw-400 f-inter cursor-pointer d-flex"
                @click="changeEmail"
                v-if="user.role == 'client'"
              >
                Change Email
              </span>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="3" class="ma-0 pr-0">
              <p class="fs-15 fw-400 f-inter textPrimary--text">Password:</p>
            </v-col>
            <v-col md="9" class="ma-0 pr-0">
              <span class="fs-15 fw-600 f-inter textPrimary--text">
                **********
              </span>
              <span
                class="mb-2 primary--text fs-15 fw-400 f-inter cursor-pointer d-flex"
                @click="changePassword"
                v-if="user.role == 'client'"
              >
                Change Password
              </span>
            </v-col>
          </v-row>
      </div>

      <v-row v-else class="ma-2 ml-5 pa-0">
        <v-col
          v-for="(item, index) in employeeInfo"
          :key="index"
          class="ma-0 pa-0"
          :cols="$vuetify.breakpoint.lg ? 6 : 12"
        >
          <div class="d-flex justify-space-around">
            <v-col :cols="$vuetify.breakpoint.md ? 4 : 5" class="ma-0 pa-0">
              <p class="fs-15 fw-600 f-inter textPrimary--text">
                {{ item.name }}:
              </p>
            </v-col>
            <v-col :cols="$vuetify.breakpoint.md ? 8 : 7" class="ma-0 pa-0">
              <p class="fs-15 fw-600 f-inter textPrimary--text">
                {{ item.value ? item.value : "-" }}
              </p>
            </v-col>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <!-- CHANGE PASSWORD MODAL -->
    <ChangePassword ref="changePassword" />

    <!-- CHANGE EMAIL MODAL -->

    <ChangeEmail ref="changeEmail" />

    <!-- EDIT PERSONAL INFO -->
    <EditPersonalInfo
      ref="editPersonalInfo"
      @fetch-personal-info="updateInfo"
    />
    <!-- EDIT WORKSPACE -->
    <EditWorkspace ref="editWorkspace" />
  </div>
</template>

<script>
import CountryCode from "@/constants/sign-up/countryCode";
// import CurrencyList from "@/constants/sign-up/currencyList";
import FormInput from "../common/FormInput.vue";
import apiService from "@/services/Api.js";
import { mapActions, mapGetters } from "vuex";

import UrlServices from "@/services/Url";
import ChangeEmail from "./modals/ChangeEmail.vue";
import ChangePassword from "./modals/ChangePassword.vue";
import EditPersonalInfo from "./modals/EditPersonalInfo.vue";
import EditWorkspace from "./modals/EditWorkspace.vue";
export default {
  components: {
    FormInput,
    ChangeEmail,
    ChangePassword,
    EditPersonalInfo,
    EditWorkspace,
  },
  data() {
    return {
      otp: null,
      dialog: false,
      smtp: process.env.VUE_APP_SMTP_MAIL,
      editDialog: false,
      profilePicture: null,
      backendURL: process.env.VUE_APP_BACK_END_URL,
      loader: false,
      countryName: "",
      auditTicketSwitch: false,
      invoiceRewriteSwitch: false,
      employeeInfo: [
        {
          name: "Full Name",
          value: "",
        },
        {
          name: "Email",
          value: "",
        },
      ],
      personalInfo: [
        {
          name: "Name",
          value: "",
        },
        {
          name: "Designation",
          value: "",
        },
        {
          name: "Company Name",
          value: "",
        },
        {
          name: "Country",
          value: "",
        },
        {
          name: "Currency",
          value: "",
        },
      ],
      token: null,
      companyPosition: {
        selected: null,
        selectedModelForOther: "",
        options: [
          { label: "CEO (Chief Executive Officer)", value: "CEO" },
          { label: "Director", value: "director" },
          { label: "COO (Chief Operating Officer)", value: "COO" },
          { label: "CFO (Chief Financial Officer)", value: "CFO" },
          { label: "Other", value: "other" },
        ],
      },
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/getUser",
      // token: "auth/getAuthToken",
      currentWorkspace: "auth/getCurrentWorkspace",
    }),
    tooltipCurrency() {
      return this.user.currency.slice(1);
    },
  },

  mounted() {
    if (localStorage.getItem("token"))
      this.token = localStorage.getItem("token");
    this.auditTicketSwitch = this.currentWorkspace.auditTicket;
    this.invoiceRewriteSwitch = this.currentWorkspace.rewriteInvoice;
    // this.user.role === 'client' ? this.updateInfo() : this.fetchEmployeeInfo();
    this.user.role === "client"
      ? this.updateInfo()
      : ((this.employeeInfo[0].value = this.user.name),
        (this.employeeInfo[1].value = this.user.email));
  },
  methods: {
    ...mapActions({
      updateUser: "auth/updateUser",
    }),

    /**
     * This functions copy the text from the textfield in the copy email modal
     */
    copyLink() {
      // Get the text field
      var copyText = `${this.currentWorkspace.email}@${this.SMTPEmail}`;
      // Copy the text inside the text field
      navigator.clipboard.writeText(copyText);
      // Show notification
      this.$showNotificationBar("success", "Email copied");
    },
    chooseFiles() {
      document.getElementById("fileUpload").click();
    },
    changeEmail() {
      this.$refs.changeEmail.emailDialog = true;
    },
    changePassword() {
      this.$refs.changePassword.dialog = true;
    },
    editWorkSpace() {
      this.$refs.editWorkspace.openEditWorkspaceDialog();
    },

    /**
     * Method to set profile picture of the workspace
     */
    uploadFile(event) {
      const file = event.target.files[0];
      if (file.size >= 5000000) {
        this.$showNotificationBar(
          "error",
          "File Size should be less than 5 mb."
        );
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      apiService
        .PostRequest(
          `${UrlServices.updateProfilePicture}/${this.currentWorkspace.workspaceId}`,
          formData
        )
        .then((res) => {
          this.$store.commit("auth/addCurrentWorkspace", res.data.data);
          this.$showNotificationBar(
            "success",
            `Profile picture of workspace updated successfully`
          );
        })
        .catch((e) => {
          console.log("err>>", e);
        });
    },

    /**
     * Method to enable/disable ticket approval
     */
    // enableDisableAudit() {
    //   apiService
    //     .PostRequest(
    //       UrlServices.enableDisableAudit + "/" + this.currentWorkspace._id,
    //       {
    //         auditTicket: this.auditTicketSwitch,
    //       }
    //     )
    //     .then((res) => {
    //       const enabled = res.data.msg.auditTicket;
    //       this.$store.commit("auth/setUserSpecificProperty", {
    //         key: "auditTicket",
    //         value: enabled,
    //       });
    //       this.$showNotificationBar(
    //         "success",
    //         `Audit of ticket request has been ${
    //           enabled ? "enabled" : "disabled"
    //         } successfully`
    //       );
    //     })
    //     .catch((e) => {
    //       console.log("err>>", e);
    //     });
    // },

    /**
     * Method to enable/disable option to rewrite invoice
     */
    rewriteInvoice() {
      this.invoiceRewriteSwitch = !this.invoiceRewriteSwitch;
      apiService
        .PostRequest(
          UrlServices.invoiceEdit + "/" + this.currentWorkspace._id,
          {
            rewriteInvoice: this.invoiceRewriteSwitch,
          }
        )
        .then((res) => {
          const enabled = res.data.workspace.rewriteInvoice;
          this.$store.commit("auth/setWorkspaceEditInvoice", {
            key: "rewriteInvoice",
            value: enabled,
          });
          this.$showNotificationBar(
            "success",
            `Permission to edit invoice has been ${
              enabled ? "enabled" : "disabled"
            } successfully`
          );
        })
        .catch((e) => {
          console.log("err>>", e);
        });
    },

    /**
     * Method to set company position
     */
    setCompanyPosition(companyPosition) {
      const found = this.companyPosition.options.find(
        (el) => el.value === companyPosition
      );
      return found ? found.label : companyPosition;
    },

    /**
     * Method to fetch user details in modal
     */

    openEditProfileDialog() {
      this.$refs.editPersonalInfo.openEditProfileDialog();
    },

    // Method to fetch personal info of client
    updateInfo() {
      let name = this.user.name;
      this.countryName = CountryCode.find(
        (country) => country.value == this.user.country
      )?.label;
      let currency = this.user.currency.toString();
      currency = currency.replaceAll(",", ", ");
      this.personalInfo.forEach((info) => {
        info.name == "Designation"
          ? (info.value = this.setCompanyPosition(this.user.companyPosition))
          : info.name == "Company Name"
          ? (info.value = this.user.companyName)
          : info.name == "Country"
          ? (info.value = this.countryName)
          : info.name == "Currency"
          ? (info.value = currency)
          : info.name == "Name"
          ? (info.value = name)
          : "";
      });
    },
  },
};
</script>

<style scoped>
.edit-button.v-btn:not(.v-btn--round).v-size--default {
  height: 32px !important;
  border-radius: 6px !important;
}
.upload-icon {
  width: 25px;
  height: 25px;
  background-color: rgba(252, 252, 252, 1);
  position: relative;
  left: 113px;
  top: 68px;
  z-index: 1;
  border-radius: px;
}
.custom-height {
  min-height: 43vh;
}
.custom-height-second-block {
  min-height: 50vh;
}
.file-upload {
  position: relative;
  top: 6px;
  left: 3px;
}
.v-input--selection-controls {
  margin-top: 0 !important;
  padding-top: 0 !important;
}

.profile-card {
  background-color: var(--v-inputBackground-base) !important;
  border-radius: 5px;
  height: 241px;
}
.edit-button {
  width: 64.84px;
  border: 1px solid var(--v-primary-base) !important;
  border-radius: 6px;
  color: var(--v-primary-base) !important;
}

:deep .v-btn--is-elevated {
  box-shadow: 0px 0px 0px 0px rgb(0 0 0 / 0%), 0px 2px 2px 0px rgb(0 0 0 / 0%),
    0px 1px 5px 0px rgb(0 0 0 / 0%) !important;
}

:deep .v-input__slot {
  margin-bottom: 0 !important;
}
.default-selection-dropdown .v-select__slot label {
  z-index: 1;
}
.default-selection-dropdown .v-select__selections {
  padding-top: 5px !important;
}
.default-selection-dropdown .v-text-field__slot {
  margin-top: 10px;
}

/* when edit personal info then disabled btn css  */
.theme--light.v-btn.v-btn--disabled.v-btn--has-bg {
  background-color: #f5f2fd !important;
  color: var(--v-primary-base) !important;
}

:deep
  .v-input--is-label-active
  .v-input__control
  .v-input__slot
  .v-input--selection-controls__input
  .v-input--switch__track {
  height: 20px !important;
  width: 44px !important;
  background: #6634e9 !important;
  opacity: 1 !important;
}
:deep .v-input--selection-controls__input .v-input--switch__track {
  height: 20px !important;
  width: 44px !important;
}
:deep .v-input--selection-controls__input .v-input--switch__thumb {
  height: 16px !important;
  top: calc(50% - 12px) !important;
  width: 15px !important;
  background: white;
}
</style>
<style>
.editprofile-dialog {
  overflow-x: hidden !important;
}
</style>
