<template>
  <v-dialog
    v-model="editDialog"
    persistent
    height="387"
    max-width="470"
    content-class="editprofile-dialog"
  >
    <v-card>
      <v-card-title
        class="fs-18 font-weight-medium f-inter textPrimary--text justify-space-between"
        style="letter-spacing: -0.3px"
      >
        Edit Profile
        <span
          class="material-icons custom-close-icon mt-3"
          @click="editDialog = false"
        >
          close
        </span>
      </v-card-title>
      <v-divider style="border: 0.3px solid #e8ebf6"></v-divider>
      <v-form ref="editInfo" justify="center">
        <v-row class="pl-3 pr-3">
          <v-col md="6" sm="12">
            <FormInput
              :input="editInfoFields[0]"
              :ref="editInfoFields[0].name"
              @update-value="(n) => (editInfoFields[0].model = n)"
              @change-type="changeType(editInfoFields[0])"
            >
            </FormInput>
          </v-col>
          <v-col md="6" sm="12">
            <FormInput
              :input="editInfoFields[1]"
              :ref="editInfoFields[1].name"
              @update-value="(n) => (editInfoFields[1].model = n)"
              @change-type="changeType(editInfoFields[1])"
            >
            </FormInput>
          </v-col>
        </v-row>
        <v-row class="pl-3 pr-3">
          <v-col class="custom-column" cols="12">
            <v-select
              hide-details
              :items="companyPosition.options"
              label="Designation*"
              background-color="inputBackground"
              class="text-no-wrap rounded-md custom"
              :class="otherOptionSelected ? 'default-selection-dropdown' : ''"
              filled
              item-text="label"
              item-value="value"
              :menu-props="{
                closeOnContentClick: false,
                bottom: true,
                offsetY: true,
              }"
              placeholder="input.placeholder"
              :rules="[requiredRules]"
              v-on:change="getSelectedValue($event)"
              v-model="companyPosition.selected"
            >
              <template v-slot:selection="{ item }">
                <div v-if="item.value == 'other'">
                  <v-text-field
                    :autofocus="true"
                    v-if="otherOptionSelected"
                    :rules="[requiredRules]"
                    filled
                    background-color="inputBackground"
                    flat
                    autocomplete="false"
                    hide-details
                    class="text-no-wrap rounded-md custom"
                    v-model="companyPosition.selectedModelForOther"
                  >
                  </v-text-field>
                </div>
                <div v-else>{{ item.label }}</div>
              </template>
            </v-select>
          </v-col>

          <FormInput
            v-if="!user.country || user.country == 'false'"
            :input="editInfoFields[2]"
            :ref="editInfoFields[2].name"
            @update-value="(n) => (editInfoFields[2].model = n)"
            @change-type="changeType(editInfoFields[2])"
          >
          </FormInput>
          <v-col>
            <v-autocomplete
              hide-details
              :items="currencyOption.options"
              label="Currency*"
              background-color="inputBackground"
              class="text-no-wrap rounded-md custom fixed-height"
              filled
              chips
              item-text="label"
              item-value="value"
              :menu-props="{
                closeOnContentClick: false,
                bottom: true,
                offsetY: true,
              }"
              :multiple="true"
              v-model="currencyOption.selected"
            >
              <template v-slot:selection="{ item, index }">
                <v-chip
                  v-if="index === 0 || index === 1"
                  class="multiple-selection-chip mt-2"
                  >{{ item.label }}
                </v-chip>
                <span
                  id="hover-click-chip"
                  v-if="index === 2"
                  class="grey--text text-caption"
                  >(+{{ currencyOption.selected.length - 2 }} others)</span
                >
              </template>
            </v-autocomplete>
          </v-col>
        </v-row>
      </v-form>

      <v-card-actions class="mt-5 pb-5">
        <v-spacer></v-spacer>
        <v-btn
          class="primary--text lightBackground fs-13 font-weight-medium f-avenir create-btn"
          style="text-transform: none !important; letter-spacing: -0.3px"
          @click="editProfileInfo()"
          :loading="loader"
          elevation="0"
          block
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
          name: "name",
          label: "Full Name*",
          placeholder: "Enter Full Name",
          type: "text",
          cols: 12,
          maxLength: "30",
          model: "",
          rules: [rules.required],
        },

        {
          name: "companyName",
          label: "Company Name*",
          placeholder: "Enter Company Name",
          type: "text",
          cols: 12,
          col_md: 12,
          maxLength: "50",
          model: "",
          rules: [rules.required],
        },

        {
          name: "country",
          label: "Country",
          placeholder: "Select Your Country",
          type: "select",
          cols: 12,
          col_md: 6,
          options: CountryCode,
          isMultiple: false,
          model: "+92",
          rules: [rules.required],
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/getUser",
    }),
  },
  methods: {
    ...mapActions({
      updateUser: "auth/updateUser",
    }),
    openEditProfileDialog() {
      this.editDialog = true;
      this.fetchModalDetails();
    },
    editProfileInfo() {
      if (!this.$refs.editInfo.validate()) {
        return this.$showNotificationBar(
          "error",
          "Please fill all the required fields"
        );
      }
      if (!this.currencyOption.selected.length) {
        return this.$showNotificationBar("error", "Currency field required");
      }
      this.loader = true;
      const payload = {};
      this.editInfoFields.forEach(
        (field) => (payload[field.name] = field.model)
      );
      payload.companyPosition =
        this.companyPosition.selected !== "other"
          ? this.companyPosition.selected
          : this.companyPosition.selectedModelForOther;
      payload.currency = this.currencyOption.selected
        ? this.currencyOption.selected
        : "";
      this.updateUser(payload)
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
        this.currencyOption.selected = this.user.currency;
        // this.currencyOption.selected = this.user.currency?.length ? this.user.currency :this.user.currency;
        if (companyPositions.includes(this.user.companyPosition)) {
          this.companyPosition.selected = this.user.companyPosition;
        } else {
          this.companyPosition.selectedModelForOther =
            this.user.companyPosition;
          this.companyPosition.selected = "other";
          this.otherOptionSelected = true;
        }
        this.editInfoFields.forEach((info) => {
          console.log(info, "================");
          info.model = this.user[info.name];
          if (this.$refs[info.name])
            this.$refs[info.name].setSpecificProperty(
              "textFieldmodel",
              this.user[info.name] || ""
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
