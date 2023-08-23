<template>
  <v-dialog
    v-model="editDialog"
    persistent
    height="318"
    max-width="289"
    content-class="editprofile-dialog"
  >
    <v-card>
      <v-card-title
        class="dialogTitle--text fs-18 fw-500 f-inter justify-space-between"
      >
        Edit workspace
        <span
          class="material-icons custom-close-icon mt-3"
          @click="editDialog = false"
        >
          close
        </span>
      </v-card-title>

      <v-divider style="border: 0.3px solid #e8ebf6"></v-divider>
      <v-form ref="editInfo" justify="center">
        <v-row class="mt-3 pl-3 pr-3 px-3">
          <FormInput
         
            :input="editInfoFields[0]"
            :ref="editInfoFields[0].name"
            @update-value="(n) => (editInfoFields[0].model = n)"
            @change-type="changeType(editInfoFields[0])"
          >
          </FormInput>

          <FormInput
            :input="editInfoFields[1]"
            :ref="editInfoFields[1].name"
            @update-value="(n) => (editInfoFields[1].model = n)"
            @change-type="changeType(editInfoFields[1])"
            :readonly="true"
          >
          </FormInput>
        </v-row>
      </v-form>
      <v-card-actions class="pt-5 pb-7 justify-center">
        <v-btn
          :loading="loader"
          class="primary--text buttonBg fs-13 fw-900 f-avenir pass-btn"
          @click="editWorkspace"
          style="text-transform: none !important"
          width="229"
          height="44"
          elevation="0"
        >
          Save Changes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
const companyPositions = ["CEO", "COO", "CFO", "director"];
import currencyList from "../../../constants/sign-up/currencyList";
import { mapActions, mapGetters } from "vuex";
import CountryCode from "@/constants/sign-up/countryCode";
import rules from "@/constants/validation-rules";
import FormInput from "../../common/FormInput.vue";

export default {
  components: { FormInput },
  data() {
    return {
      editDialog: false,
      otherOptionSelected: false,
      loader: false,
      requiredRules: rules.required,
      selectRules: rules.select_field_required,
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
      currencyOption: {
        selected: [],
        options: currencyList,
      },
      editInfoFields: [
        {
          name: "workspaceName",
          label: "Workspace Name",
          placeholder: "Enter Workspace Name",
          type: "text",
          cols: 12,

          maxLength: "50",
          model: "",
          rules: [rules.required],
        },
        {
          name: "email",
          label: "Email",
          placeholder: "Enter Email",
          type: "text",
          cols: 12,
          maxLength: "30",
          model: "",
          rules: [rules.required],
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      workspace: "auth/getCurrentWorkspace",
    }),
  },
  methods: {
    ...mapActions({
      updateWorkspace: "auth/updateWorkspace",
    }),
    openEditWorkspaceDialog() {
      this.editDialog = true;
      this.fetchModalDetails();
    },
    editWorkspace() {
      if (!this.$refs.editInfo.validate()) {
        return this.$showNotificationBar(
          "error",
          "Please fill all the required fields"
        );
      }

      this.loader = true;
      const payload = {};
      this.editInfoFields.forEach(
        (field) => (payload[field.name] = field.model)
      );

      this.updateWorkspace(payload)

        .then((res) => {
          this.loader = false;
          this.editDialog = false;
          this.$showNotificationBar("success", "Updated Successfully");
          this.$emit("fetch-personal-info");
        })
        .catch((error) => {
          this.loader = false;
          this.$showNotificationBar(
            "error",
            error?.message ? error.message : "Error Occurred"
          );
        });
    },
    fetchModalDetails() {
      // setting global text fields
      this.$nextTick(() => {
        this.editInfoFields.forEach((info) => {
          info.model = this.workspace[info.name];
          if (this.$refs[info.name])
            this.$refs[info.name].setSpecificProperty(
              "textFieldmodel",
              this.workspace[info.name] || ""
            );
        });
      });
    },
    getSelectedValue(event) {
      this.otherOptionSelected = event == "other";
    },
  },
};
</script>

<style></style>
