<template>
  <v-container>
    <v-row
      class="pa-0 ma-0"
      :style="
        $vuetify.breakpoint.xs
          ? ' margin-top: 46px !important'
          : 'margin-top: 0px !important;'
      "
    >
      <v-col md="6" cols="12" class="pb-0 pa-0">
        <p class="textPrimary--text fs-23 fw-600 f-inter">Settings</p>
      </v-col>
    </v-row>
    <v-col
      md="6"
      cols="12"
      class="d-flex justify-end pa-0"
      :class="$vuetify.breakpoint.lg ? 'float-right' : ''"
      v-if="showCreateButton"
    >
      <v-text-field
        outlined
        flat
        dense
        solo
        autocomplete="off"
        class="text-no-wrap rounded-lg mr-2 textPrimary--text fw-500 fs-12 custom-placeholder"
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search team"
        hide-details
        clearable
        filled
      ></v-text-field>
      <div class="approve-request rounded-lg d-flex justify-space-around">
        <span
          :class="$vuetify.breakpoint.lg ? '' : 'ellipsis-text'"
          class="f-inter fs-12 fw-500 dark--text d-flex align-center"
        >
          Approve team requests
        </span>
        <v-btn
          icon
          :color="auditTicketSwitch ? 'primary' : 'inActiveColor'"
          :ripple="false"
          @click="statusTeamRequest()"
        >
          <v-icon :ripple="false">{{
            auditTicketSwitch ? "mdi-toggle-switch" : "mdi-toggle-switch-off"
          }}</v-icon>
        </v-btn>
      </div>
      <v-btn
        style="letter-spacing: -0.3px"
        class="create-emp lightBackground primary--text f-inter fs-12 fw-600 mb-4 create-employee-btn"
        large
        @click="dialog = true"
        ><v-img
          style="width: 17px; height: 17px"
          class="mr-2"
          src="@/assets/dashboard/user.svg"
        ></v-img>
        Create Employee</v-btn
      >
    </v-col>
    <!-- Tabs -->
    <v-tabs v-model="tab" hide-slider class="pa-0 ma-0">
      <v-tab class="pa-0"
        ><span class="fs-13 fw-600 text-capitalize f-inter ls-0"
          >Profile</span
        ></v-tab
      >
      <v-tab v-if="user.role == 'client'"
        ><span id="v-step-8" class="fs-13 fw-600 text-capitalize f-inter ls-0">
          Manage Team
        </span></v-tab
      >
      <!-- <v-tab
        ><span class="fs-13 fw-600 text-capitalize f-inter"
          >Subscriptions</span
        ></v-tab
      > -->
    </v-tabs>
    <v-divider></v-divider>
    <!-- Tab items -->
    <v-tabs-items v-model="tab" style="width: inherit">
      <v-tab-item>
        <profile />
      </v-tab-item>
      <v-tab-item>
        <manage-team :search="search" />
      </v-tab-item>
      <v-tab-item>
        <Subscriptions />
      </v-tab-item>
    </v-tabs-items>
    <!-- Create employee dialog -->
    <!-- <v-form ref="createEmployee" justify="center"> -->
    <v-dialog
      v-model="dialog"
      persistent
      height="387"
      max-width="470"
      class="emp-dialog"
    >
      <v-card>
        <v-card-title
          style="letter-spacing: -0.3px"
          class="dialogTitle--text fs-18 font-weight-medium f-inter justify-space-between"
        >
          Create Employee
          <span
            class="material-icons custom-close-icon mt-3"
            @click="closeDialog()"
          >
            close
          </span>
        </v-card-title>
        <v-divider style="border: 0.3px solid #e8ebf6"></v-divider>
        <v-form ref="newEmployee" justify="center">
          <v-row class="mt-5 pl-3 pr-3">
            <v-col
              v-for="(input, index) in employeeDialogFields"
              :key="index"
              :md="input.col_md ?? 12"
              :cols="input.cols ?? 6"
              class="pt-0 pb-0"
            >
              <v-text-field
                v-if="input.type != 'select'"
                filled
                :label="input.label"
                :placeholder="input.placeholder"
                :type="input.type"
                background-color="inputBackground"
                flat
                autocomplete="off"
                class="text-no-wrap rounded-md custom"
                :append-icon="
                  input.name == 'password' || input.name == 'confirmPassword'
                    ? input.showIcon
                    : ''
                "
                v-on:keyup.enter="createEmployee()"
                @click:append="
                  () =>
                    input.type == 'password'
                      ? ((input.type = 'text'), (input.showIcon = 'visibility'))
                      : ((input.type = 'password'),
                        (input.showIcon = 'visibility_off'))
                "
                v-model="input.model"
                :rules="
                  input.name == 'email'
                    ? emailRules
                    : input.name == 'confirmPassword'
                    ? confirmPasswordRules
                    : input.name == 'password'
                    ? passwordLengthRules
                    : requiredFieldRules
                "
              ></v-text-field>

              <v-select
                background-color="inputBackground"
                class="text-no-wrap rounded-md custom select-chip"
                filled
                v-if="input.type == 'select'"
                :items="workspaces"
                label="Select Workspace*"
                dense
                multiple
                hide-details
                clearable
                v-model="input.model"
                item-text="workspaceName"
                item-value="_id"
                :rules="requiredFieldRulesForWorkspaces"
                :menu-props="{
                  closeOnContentClick: false,
                  bottom: true,
                  offsetY: true,
                }"
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index < 2">
                    <span class="font-weight-medium">
                      {{ item.workspaceName }}
                    </span>
                    <!-- <v-icon @click="removeWorkspaceFromWorkspaceModel(item)" class="ml-2" color="primary" small>mdi-close-circle-outline</v-icon> -->
                  </v-chip>
                  <v-chip v-else-if="index === 2">
                    <span class="font-weight-medium">
                      (+{{ input.model.length - 2 }} others)
                    </span>
                  </v-chip>
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-form>

        <v-card-actions class="mt-5 pb-5">
          <v-btn
            block
            class="primary--text lightBackground fs-13 f-inter create-btn"
            style="text-transform: none !important"
            @click="createEmployee()"
            :loading="loader"
          >
            Save Changes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- </v-form> -->
  </v-container>
</template>

<script>
import ManageTeam from "@/components/profile_settings/ManageTeam.vue";
import Subscriptions from "@/components/profile_settings/Subscriptions";
import profile from "@/components/profile_settings/Profile.vue";
import FormInput from "../components/common/FormInput.vue";
import apiService from "@/services/Api.js";
import UrlServices from "@/services/Url";
import { mapGetters } from "vuex";
import EventBus from "../js/EventBus";
export default {
  components: { profile, ManageTeam, Subscriptions, FormInput },
  data() {
    return {
      tab: null,
      dialog: false,
      loader: false,
      auditTicketSwitch: false,
      search: "",
      isRequestApproved: "Active",
      showCreateButton: false,
      employeeDialogFields: [
        {
          name: "fullName",
          label: "Full Name*",
          placeholder: "Enter Full Name",
          type: "text",
          cols: 12,
          col_md: 12,
          model: "",
        },
        {
          name: "email",
          label: "Email*",
          placeholder: "Enter Your Email Here",
          type: "email",
          cols: 12,
          col_md: 12,
          model: "",
        },
        {
          name: "password",
          label: "Password*",
          placeholder: "Enter Password",
          type: "password",
          cols: 12,
          col_md: 6,
          showIcon: "visibility_off",
          model: "",
        },
        {
          name: "confirmPassword",
          label: "Confirm Password*",
          placeholder: "Enter Password",
          type: "password",
          cols: 12,
          col_md: 6,
          showIcon: "visibility_off",
          model: "",
        },
        {
          name: "workspaces",
          label: "Select Workspace*",
          placeholder: "Select Workspace",
          type: "select",
          cols: 12,
          col_md: 12,
          model: [],
        },
      ],
      requiredFieldRulesForWorkspaces: [
        (v) => v.length > 0 || "Atleast one workspace is required",
      ],
      emailRules: [
        (v) => !!v || "Field is required",
        (v) =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(v) ||
          "E-mail must be valid",
      ],
      passwordLengthRules: [
        (v) => !!v || "Field is required",
        (v) =>
          (v && v.length >= 6) ||
          "Length must be greater than or equal to 6 digits",
        (v) =>
          (v && v.length <= 15) ||
          "Length must be less than or equal to 15 digits",
      ],
      confirmPasswordRules: [
        (v) => !!v || "Field is required",
        (v) =>
          v === this.employeeDialogFields[3].model || "Password does not match",
        (v) =>
          (v && v.length >= 6) ||
          "Length must be greater than or equal to 6 digits",
        (v) =>
          (v && v.length <= 15) ||
          "Length must be less than or equal to 15 digits",
      ],
      requiredFieldRules: [(v) => !!v || "Field is required"],
    };
  },
  watch: {
    tab() {
      this.tab == 1
        ? (this.showCreateButton = true)
        : (this.showCreateButton = false);
    },
  },
  computed: {
    ...mapGetters({
      user: "auth/getUser",
      paginate: "ticket/getPaginate",
      workspaces: "auth/getUserWorkSpaces",
      currentWorkspace: "auth/getCurrentWorkspace",
    }),
  },
  methods: {
    // Method to close create employee dialog and resetting fields
    approveRequest(emp) {
      this.$store
        .dispatch("user/changeStatus", {
          id: emp._id,
          status:
            emp.status == "Active"
              ? "InActive"
              : emp.status == "InActive"
              ? "Active"
              : "",
        })
        .then(() => {
          this.$showNotificationBar("success", "User updated successfully");
        });
    },
    closeDialog() {
      this.$refs.newEmployee.reset();
      this.dialog = false;
    },
    // Method to create new employee
    createEmployee() {
      if (!this.$refs.newEmployee.validate()) {
        return this.$showNotificationBar(
          "error",
          "Please fill all the required fields"
        );
      }
      if (
        this.employeeDialogFields[2].model != this.employeeDialogFields[3].model
      ) {
        return this.$showNotificationBar(
          "error",
          "The password confirmation does not match"
        );
      }

      this.loader = true;
      this.$store
        .dispatch("user/createEmployee", {
          name: this.employeeDialogFields[0].model,
          email: this.employeeDialogFields[1].model,
          password: this.employeeDialogFields[2].model,
          workspaces: this.employeeDialogFields[4].model,
          role: "employee",
        })
        .then((res) => {
          this.loader = false;
          this.dialog = false;
          this.$refs.newEmployee.reset();
          this.$showNotificationBar("success", "Employee created successfully");
          EventBus.$emit("get-employees");
          this.$store.commit("ticket/setPaginate", {
            itemsPerPage: 10,
            page: 1,
            lastPage:
              this.paginate.total + 1 < 10
                ? 1
                : Math.ceil((this.paginate.total + 1) / 10),
            total: this.paginate.total + 1,
          });
        })
        .catch((err) => {
          this.$showNotificationBar("error", err.response.data.message);
          console.log(err.response, "create emp err");
          this.loader = false;
          // this.dialog = false;
        });
    },
    statusTeamRequest() {
      this.auditTicketSwitch = !this.auditTicketSwitch;
      apiService
        .PostRequest(
          UrlServices.enableDisableAudit + "/" + this.currentWorkspace._id,
          {
            auditTicket: this.auditTicketSwitch,
          }
        )
        .then((res) => {
          const enabled = res.data.msg.auditTicket;
          this.$store.commit("auth/setUserSpecificProperty", {
            key: "auditTicket",
            value: enabled,
          });
          this.$showNotificationBar(
            "success",
            `Approve team request has been ${
              enabled ? "enabled" : "disabled"
            } successfully`
          );
        })
        .catch((e) => {
          console.log("err>>", e);
        });
    },
  },
  mounted() {
    this.auditTicketSwitch = this.currentWorkspace.auditTicket;
  },
};
</script>

<style scoped>
.v-application .mt-15 {
  margin-top: 16px !important;
}
.v-btn:not(.v-btn--round).v-size--default {
  height: 45px !important;
}
.create-emp {
  /* height: 40px !important; */
  border-radius: 8px !important;
  text-transform: none !important;
}
.emp-dialog {
  background-color: #fff !important;
  border-radius: 10px !important;
  min-height: 387px !important;
}
:deep .v-btn--is-elevated {
  box-shadow: 0px 0px 0px 0px rgb(0 0 0 / 0%), 0px 2px 2px 0px rgb(0 0 0 / 0%),
    0px 1px 5px 0px rgb(0 0 0 / 0%) !important;
}
.create-btn {
  width: 74px !important;
  height: 38px !important;
  background: #f4f1fe;
  border-radius: 8px;
  font-weight: 600 !important;
  letter-spacing: -0.3px;
}
:deep .v-text-field__details {
  white-space: break-spaces !important;
}
.v-btn:not(.v-btn--round).v-size--default {
  /* height: 0px !important; */
  border-radius: 10px !important;
}
:deep .select-chip .v-chip {
  background: #f4f1fe !important;
  color: #6634e9 !important;
  padding: 10px !important;
  border-radius: 14px !important;
}
:deep .search-field {
  padding-top: 0 !important;
  margin-top: 0 !important;
  border-bottom: 1px solid black;
  height: 35px !important;
}
.create-employee-btn {
  height: 39px !important;
}
.approve-request {
  width: 200px;
  height: 39px;
  border: 0.6px solid rgba(232, 235, 244, 1);
  border-radius: 5px;
  margin-right: 9px;
}
:deep .v-input--selection-controls {
  margin-top: 0px !important;
}
:deep .v-input__icon {
  width: 14px !important;
  min-width: 14px !important;
}
:deep .v-icon {
  font-size: 14px;
  color: black;
}
.v-text-field--outlined >>> fieldset {
  border-color: rgba(232, 235, 244, 1);
}
:deep .custom-placeholder input::placeholder {
  color: black !important;
}

.v-input__slot {
  min-height: 37px !important;
}
.ellipsis-text {
  margin: 0px;
  white-space: nowrap !important;
  width: 70px;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
</style>
