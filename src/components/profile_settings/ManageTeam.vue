<template>
  <div class="mt-3 listing pl-0 pr-0">
    <v-data-table
      :headers="headers"
      :items="employees"
      :hide-default-footer="true"
      :loading="loader"
      fixed-header
      :search="search"
      max-height="500px"
      :itemsPerPage="pageItems"
    >
      <template v-slot:[`item.name`]="{ item }">
        <!-- <span v-if="item.firstName" class="fs-13 fw-600 f-avenir textPrimary--text"
          >{{ item.firstName }} {{ item.lastName }}</span
        > -->
        <span class="fs-13 font-weight-bold f-inter textPrimary--text">{{
          item.name
        }}</span>
      </template>
      <template v-slot:[`item.email`]="{ item }">
        <span class="fs-13 fw-400 f-inter textPrimary--text">{{
          item.email
        }}</span>
      </template>
      <template v-slot:[`item.users_workspaces`]="{ item }">
        <div v-if="item?.users_workspaces.length > 0">
          <div v-for="(listitem, index) in item?.users_workspaces" :key="index">
            <span
              v-if="index < 2"
              class="fs-13 fw-400 f-inter textPrimary--text"
              >{{ listitem.workspace.workspaceName }} ,</span
            >
            <v-menu offset-y open-on-hover>
              <template v-slot:activator="{ on, attrs }">
                <span
                  v-bind="attrs"
                  v-on="on"
                  v-if="index === 2"
                  class="fs-13 fw-400 f-inter textPrimary--text"
                >
                  (+{{ item?.users_workspaces.length - 2 }} others)</span
                >
              </template>
              <v-list>
                <div
                  v-for="(item, index) in item?.users_workspaces"
                  :key="index"
                >
                  <v-list-item v-if="index > 1">
                    <v-list-item-title class="cursor-pointer">{{
                      item.workspace.workspaceName
                    }}</v-list-item-title>
                  </v-list-item>
                </div>
              </v-list>
            </v-menu>
          </div>
        </div>
        <div v-else>-</div>
      </template>
      <template v-slot:[`item.createdAt`]="{ item }">
        <span class="fs-13 fw-400 f-inter textPrimary--text">
          {{ item.createdAt | formatDate }}
          -
          {{ item.createdAt | formatTime }}</span
        >
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <v-chip
          class="fs-13 f-inter"
          :class="
            item.status == 'Active' ? 'successColor--text' : 'errorColor--text'
          "
        >
          <v-img
            style="width: 13px; height: 13px"
            class="mr-2"
            :src="
              item.status == 'Active'
                ? require('@/assets/dashboard/complete.svg')
                : require('@/assets/dashboard/inactive.svg')
            "
          />
          <span class="font-weight-bold">{{ item.status }} </span>
        </v-chip>
      </template>
      <template v-slot:[`item.action`]="{ item }">
        <v-btn
          icon
          :color="item.status == 'Active' ? 'primary' : 'inActiveColor'"
          @click="blockOrUnblockEmployee(item)"
          :ripple="false"
        >
          <v-icon :ripple="false">{{
            item.status == "Active"
              ? "mdi-toggle-switch"
              : "mdi-toggle-switch-off"
          }}</v-icon>
        </v-btn>

        <!-- Edit Employee Button -->
        <v-btn icon color="primary" @click="editEmployee(item)" :ripple="false">
          <v-icon small>mdi-pencil</v-icon>
        </v-btn>
        <!-- Edit Employee Button End-->
      </template>
    </v-data-table>
    <pagination
      :itemsPerPage="pageItems"
      :page="paginate.page"
      :pageCount="paginate.lastPage"
      :totalCount="paginate.total"
      @next-page-change="fetchEmployees($event)"
      @prev-page-change="fetchEmployees($event)"
      @page-number-changed="fetchEmployees($event)"
      @items-per-page-change="fetchEmployees($event)"
    ></pagination>

    <!-- Dialog For edit Employee -->
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
          Edit Personal Information
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
                :disabled="input.disabled"
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
          <v-spacer></v-spacer>
          <v-btn
            class="primary--text lightBackground fs-13 f-inter create-btn"
            style="text-transform: none !important; letter-spacing: 0.3px"
            @click="updateEmployee()"
            :loading="editLoader"
            block
          >
            Save Changes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialog For edit Employee End -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import pagination from "../../components/common/Pagination.vue";
import EventBus from "../../js/EventBus";

export default {
  components: {
    pagination,
  },
  props: ["search"],
  data() {
    return {
      //edit Loader check
      editLoader: false,
      // dialog check
      dialog: false,
      // employee Dialog Fields
      employeeDialogFields: [
        {
          name: "fullName",
          label: "Full Name*",
          placeholder: "Enter Full Name",
          type: "text",
          cols: 12,
          col_md: 12,
          model: "",
          disabled: true,
        },
        {
          name: "email",
          label: "Email*",
          placeholder: "Enter Your Email Here",
          type: "email",
          cols: 12,
          col_md: 12,
          model: "",
          disabled: true,
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
      emailRules: [
        (v) => !!v || "Field is required",
        (v) =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(v) ||
          "E-mail must be valid",
      ],
      requiredFieldRules: [(v) => !!v || "Field is required"],
      requiredFieldRulesForWorkspaces: [
        (v) => v.length > 0 || "Atleast one workspace is required",
      ],
      employeeForEdit: false,
      loader: false,
      status: false,
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Email", value: "email", sortable: false },
        { text: "Workspaces", value: "users_workspaces", sortable: false },
        { text: "Created At", value: "createdAt", sortable: false },
        { text: "Status", value: "status", sortable: false },
        { text: "Action", value: "action", sortable: false },
      ],
    };
  },
  mounted() {
    this.fetchEmployees();
    EventBus.$on("get-employees", () => {
      this.$store.dispatch("user/fetchEmployees");
    });
  },
  beforeDestroy() {
    EventBus.$off("get-employees");
  },
  computed: {
    ...mapGetters({
      employees: "user/getEmployees",
      paginate: "ticket/getPaginate",
      pageItems: "ticket/getPageItems",
      workspaces: "auth/getUserWorkSpaces",
    }),
  },
  methods: {
    // Remove Workspace By Clicking on Cross Button
    removeWorkspaceFromWorkspaceModel(workspace) {
      let index = this.employeeDialogFields[2].model.findIndex(
        (item) => item._id === workspace._id
      );
      this.employeeDialogFields[2].model.splice(index, 1);
    },
    // Update Employee APi
    updateEmployee() {
      if (!this.$refs.newEmployee.validate()) {
        return this.$showNotificationBar(
          "error",
          "Please fill all the required fields"
        );
      }
      this.editLoader = true;

      this.$store
        .dispatch("user/changeStatus", {
          id: this.employeeForEdit._id,
          status: this.employeeForEdit.status,
          workspacesIds: this.employeeDialogFields[2].model,
          name: this.employeeDialogFields[0].model,
        })
        .then((res) => {
          this.editLoader = false;
          this.dialog = false;
          this.$refs.newEmployee.reset();
          this.$showNotificationBar("success", "Employee updated successfully");
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
          this.editLoader = false;
        });
    },
    // open Edit Employee Dialog
    editEmployee(employee) {
      this.employeeForEdit = employee;
      this.employeeDialogFields.forEach((item) => {
        if (item.name === "fullName") item.model = employee.name;
        else if (item.name === "email") item.model = employee.email;
        else if (item.name === "workspaces") {
          employee?.users_workspaces.forEach((eachWs) => {
            item.model.push(eachWs.workspace._id);
          });
        }
      });
      this.dialog = true;
    },
    // close Edit Employee Dialog
    closeDialog() {
      this.$refs.newEmployee.reset();
      this.dialog = false;
      this.employeeForEdit = null;
    },
    // method to fetch employees
    fetchEmployees(pgNo) {
      if (pgNo === undefined || pgNo === null) pgNo = 1;
      this.loader = true;
      this.$store
        .dispatch("user/fetchEmployees", pgNo)
        .then((res) => {
          console.log(res.data.count, pgNo, this.pageItems);
          this.$store.commit("ticket/setPageItems", this.pageItems);
          this.$store.commit("ticket/setPaginate", {
            itemsPerPage: this.pageItems,
            page: pgNo,
            lastPage: res.data.count < 10 ? 1 : Math.ceil(res.data.count / 10),
            total: res.data.count,
          });
          this.$store.commit("user/fetchEmployees", res.data.users);
          this.loader = false;
        })
        .catch(() => {
          this.loader = false;
        });
    },

    // Method to dispatch action which will activate/ in-activate employee
    blockOrUnblockEmployee(emp) {
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
  },
};
</script>

<style scoped>
.emp-dialog {
  background-color: #fff !important;
  border-radius: 10px !important;
  min-height: 387px !important;
}
:deep .v-btn--is-elevated {
  box-shadow: 0px 0px 0px 0px rgb(0 0 0 / 0%), 0px 2px 2px 0px rgb(0 0 0 / 0%),
    0px 1px 5px 0px rgb(0 0 0 / 0%) !important;
}
:deep .select-chip .v-chip {
  background: #f4f1fe !important;
  color: #6634e9 !important;
  padding: 10px !important;
  border-radius: 14px !important;
}
</style>
