<template>
  <v-dialog v-model="dialog" persistent max-width="360" class="pass-dialog">
    <v-card>
      <v-card-title
        class="fs-18 font-weight-medium f-inter textPrimary--text justify-space-between"
        style="letter-spacing: -0.3px"
      >
        Change Password
        <span
          class="material-icons custom-close-icon mt-3"
          @click="closeDialog()"
        >
          close
        </span>
      </v-card-title>
      <v-divider style="border: 0.3px solid #e8ebf6"></v-divider>
      <v-form class="mt-5 pl-5 pr-5" ref="changePassword">
        <v-text-field
          v-for="(input, index) in changePasswordFields"
          :key="index"
          filled
          :label="input.label"
          :placeholder="input.placeholder"
          :type="input.type"
          background-color="inputBackground"
          flat
          autocomplete="off"
          class="text-no-wrap rounded-md custom"
          v-on:keyup.enter="updatePassword()"
          :rules="
            input.name == 'newPassword'
              ? oldPasswordRule
              : input.name == 'confirmPassword'
              ? confirmPasswordRules
              : requiredField
          "
          :append-icon="
            input.name == 'password' ||
            input.name == 'newPassword' ||
            input.name == 'confirmPassword'
              ? input.showIcon
              : ''
          "
          @click:append="
            () =>
              input.type == 'password'
                ? ((input.type = 'text'), (input.showIcon = 'visibility'))
                : ((input.type = 'password'),
                  (input.showIcon = 'visibility_off'))
          "
          v-model="input.model"
        ></v-text-field>
      </v-form>
      <v-card-actions class="pb-5 justify-center">
        <v-btn
          :loading="loader"
          class="primary--text buttonBg fs-13 font-weight-medium f-avenir pass-btn rounded-lg"
          style="text-transform: none !important; letter-spacing: -0.3px"
          @click="updatePassword()"
          elevation="0"
          block
        >
          Update Password
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import apiService from "@/services/Api.js";
export default {
  data() {
    return {
      dialog: false,
      loader: false,
      requiredField: [
        (v) => !!v || "Field is required",
        (v) =>
          (v && v.length >= 6) ||
          "Length must be greater than or equal to 6 digits",
        (v) => (v && v.length <= 15) || "Maximum length must be 15 digits",
      ],
      oldPasswordRule: [
        (v) => !!v || "Field is required",
        (v) =>
          v !== this.changePasswordFields[0].model ||
          "New and old passwords cannot be same",
        (v) =>
          (v && v.length >= 6) ||
          "Length must be greater than or equal to 6 digits",
        (v) => (v && v.length <= 15) || "Maximum length must be 15 digits",
      ],
      confirmPasswordRules: [
        (v) => !!v || "Field is required",
        (v) =>
          v === this.changePasswordFields[1].model ||
          "The password confirmation does not match",
        (v) =>
          (v && v.length >= 6) ||
          "Length must be greater than or equal to 6 digits",
        (v) => (v && v.length <= 15) || "Maximum length must be 15 digits",
      ],

      changePasswordFields: [
        {
          name: "password",
          label: "Enter Old Password",
          placeholder: "********",
          type: "password",
          cols: 12,
          col_md: 12,
          showIcon: "visibility_off",
          model: "",
        },
        {
          name: "newPassword",
          label: "New Password",
          placeholder: "********",
          type: "password",
          cols: 12,
          col_md: 12,
          showIcon: "visibility_off",
          model: "",
        },
        {
          name: "confirmPassword",
          label: "Confirm Password",
          placeholder: "********",
          type: "password",
          cols: 12,
          col_md: 12,
          showIcon: "visibility_off",
          model: "",
        },
      ],
    };
  },
  methods: {
    closeDialog() {
      (this.dialog = false), this.$refs.changePassword.reset();
    },
    updatePassword() {
      if (!this.$refs.changePassword.validate()) {
        return this.$showNotificationBar(
          "error",
          "Fill the required fields properly"
        );
      }
      this.loader = true;
      apiService
        .PostRequest("user/client/change-password", {
          password: this.changePasswordFields[0].model,
          newPassword: this.changePasswordFields[1].model,
        })
        .then((res) => {
          this.loader = false;
          this.closeDialog();
          this.$showNotificationBar("success", "Password updated successfully");
        })
        .catch((err) => {
          this.loader = false;
          console.log(err, "err");
          this.$showNotificationBar("error", err.response.data.data);
        });
    },
  },
};
</script>

<style scoped>
.v-input--selection-controls {
  margin-top: 0 !important;
  padding-top: 0 !important;
}
.v-btn:not(.v-btn--round).v-size--default {
  height: 40px !important;
}
.pass-dialog {
  border-radius: 7px !important;
  background-color: var(--v-whiteColor-base) !important;
  height: 458px !important;
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
</style>
