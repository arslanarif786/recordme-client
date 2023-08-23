<template>
  <div>
    <v-row :class="$vuetify.breakpoint.lg ?'logout-btn-row':'logout-btn-pwa'">
      <v-col cols="12" class=" d-flex justify-end">
        <v-btn class="white--text mr-3  text-capitalize border-radius-7" depressed  width="100px" height="40px" color="#382F56" small  @click="logout()"><span class="material-icons fs-18">
logout
</span><span class="fs-14 fw-500">Logout</span></v-btn>
      </v-col>
    </v-row>
    <v-row class="workspace-img-div mt-15">
      <img class="mt-15" src="@/assets/dashboard/empty-workspace.svg" />
      <p class="fs-24 fw-500 noWorkspace-pera">Opps workspace is empty</p>
      <v-btn
        @click="createWorkSpace()"
        class="btn-primary primary--text text-capitalize create-workspace-btn"
        color="lightBackground"
        depressed
        width="228"
        height="35"
        ><span class="fw-600 fs-14 text-capitalize"
          >Create New Workspace
        </span></v-btn
      >
    </v-row>
  </div>
</template>
<script>
import EventBus from "@/js/EventBus";
import rules from "@/constants/validation-rules";

export default {
  name: "NoWorkspace",
  data() {
    return {
      createWorkspaceInputList: [
        {
          name: "workspace_name",
          label: "Workspace Name*",
          placeholder: "Enter Your Workspace Name Here",
          type: "text",
          cols: 12,
          col_md: 12,
          model: "",
          rules: [rules.required],
          class:'pt-0 mt-0'

        },
        {
          name: "description",
          label: "Description",
          placeholder: "Enter Your Message Here...",
          type: "textarea",
          cols: 12,
          col_md: 12,
          model: "",
          class:'pt-0 mt-0'
        },
      ],
    };
  },
  methods: {
    createWorkSpace() {
      EventBus.$emit("show-dialog", {
        show: true,
        title: "Create Workspace ",
        inputs: this.createWorkspaceInputList,
        dialogType: "form",
        for: "create-workspace",
      });
    },
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/").then(() => {
        this.$store.dispatch("resetStoreState");
        location.reload(true);
      });
    },
  },
};
</script>
<style scoped>
.workspace-img-div {
  height: 80vh;
  align-items: center;
  justify-items: center;
  display: grid;
}
.noWorkspace-pera {
  bottom: 65% !important;
  position: relative;
}
.create-workspace-btn {
  border-radius: 8px;
  padding: 23px 33px !important;
  bottom: 120% !important;
  position: relative;
  gap: 10px;
}
.logout-btn-row{
  position: relative;
  bottom: 50px;
  background-color: #2B2442;
}
.logout-btn-pwa{
  position: relative;
  background-color: #2B2442;
}
</style>
