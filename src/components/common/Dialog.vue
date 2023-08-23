<template>
  <v-dialog
    v-model="dialog.show"
    width="400"
    class="create-workspace-dialog"
    persistent
  >
    <v-card height="380" class="pb-2">
      <v-card-title class="d-flex justify-space-between text-heading pb-0"
        ><p
          class="fs-18 f-inter font-weight-medium heading-text"
          style="letter-spacing: -0.3px"
        >
          {{ dialog.title }}
        </p>
        <span
          class="material-icons custom-close-icon"
          @click="(dialog.show = false), $refs.newWorkspace.reset()"
        >
          close
        </span>
      </v-card-title>
      <v-form onSubmit="return false;" ref="newWorkspace">
        <v-row class="ma-1 mt-0">
          <FormInput
            :input="input"
            v-for="(input, index) in dialog.inputs"
            :key="index"
            @update-value="emitValue(input, $event)"
            @on-enter="createWorkspace()"
          ></FormInput>
        </v-row>
      </v-form>
      <v-row class="d-flex justify-end mr-1 mt-3">
        <!-- create workspace button -->
        <v-btn
          v-if="dialog.for == 'create-workspace'"
          class="btn btn-primary primary--text text-capitalize mr-4 mt-0 create-workspace-btn"
          color="lightBackground"
          style="text-transform: none !important; letter-spacing: -0.3px"
          depressed
          small
          :loading="loader"
          @click="createWorkspace()"
          ><span class="fs-14">Create Workspace </span></v-btn
        >
      </v-row>
    </v-card>
  </v-dialog>
</template>
<script>
import FormInput from "../common/FormInput.vue";
import axios from "axios";
import UrlServices from "../../services/Url";
import apiService from "@/services/Api";
import { mapGetters } from "vuex";
export default {
  props: ["dialog"],
  data() {
    return {
      inputFields: [],
      loader: false,
    };
  },
  components: { FormInput },
  computed: {
    ...mapGetters({
      token: "auth/getAuthToken",
      user: "auth/getUser",
      currentWorkspace: "auth/getCurrentWorkspace",
      userWorkspaces: "auth/getUserWorkSpaces",
    }),
  },
  mounted() {},

  methods: {
    // Method to create new workspace
    createWorkspace() {
      let pattern = /\s\s+/g;
      if (this.dialog.inputs[0].model.length > 30) {
        return this.$showNotificationBar(
          "error",
          "Name must be less than 30 characters"
        );
      }
      if (pattern.test(this.dialog.inputs[0].model)) {
        return this.$showNotificationBar(
          "error",
          "Workspace name must be single spaced"
        );
      }
      if (!this.$refs.newWorkspace.validate())
        return this.$showNotificationBar(
          "error",
          "Please provide all the required fields"
        );
      this.inputFields = this.dialog;
      this.loader = true;
      apiService
        .PostRequest(UrlServices.createWorkspace, {
          name: this.inputFields.inputs[0].model,
          description: this.inputFields.inputs[1].model,
        })
        .then((res) => {
          this.$showNotificationBar(
            "success",
            "Workspace created successfully"
          );

          if (this.userWorkspaces.length === 0)
            this.$store.commit("auth/addCurrentWorkspace", res.data.workspace);
          this.userWorkspaces.push(res.data.workspace);
          this.$store.commit("auth/userWorkspaces", this.userWorkspaces);
          this.$refs.newWorkspace.reset();
          this.loader = false;
          this.dialog.show = false;
        })
        .catch((e) => {
          this.loader = false;
          this.$showNotificationBar("error", e.response.data.message);
        });
    },

    emitValue(event, value) {
      this.$emit("updateInput", [event, value]);
    },
  },
};
</script>
<style scoped>
.create-workspace-dialog {
  position: absolute;
  width: 400px;
  height: 900px !important;
  left: 0px;
  top: 0px;
  background: #ffffff !important;
  border-radius: 10px;
}
:deep(.v-dialog) {
  background-color: #ffffff !important;
}
.create-workspace-btn {
  font-weight: 700 !important;
  padding: 20px 40px !important;
  border-radius: 8px;
  width: 158px;
  height: 38px;
}
:deep .v-card .v-sheet .theme--light {
  height: 425px !important;
}
</style>
