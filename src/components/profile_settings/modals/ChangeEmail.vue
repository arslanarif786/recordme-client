<template>
  <div>
    <v-dialog
      v-model="emailDialog"
      persistent
      max-width="360"
      class="pass-dialog"
    >
      <v-card>
        <v-card-title
          class="fs-18 font-weight-medium f-inter textPrimary--text justify-space-between"
          style="letter-spacing: -0.3px"
        >
          Change Email
          <span
            class="material-icons custom-close-icon mt-3"
            @click="closeDialog()"
          >
            close
          </span>
        </v-card-title>
        <v-divider style="border: 0.3px solid #e8ebf6"></v-divider>
        <v-form class="mt-5 pl-5 pr-5" ref="changeEmail">
          <v-text-field
            v-for="(input, index) in changeEmailFields"
            :key="index"
            filled
            :label="input.label"
            :placeholder="input.placeholder"
            :type="input.type"
            background-color="inputBackground"
            flat
            autocomplete="off"
            class="text-no-wrap rounded-md custom"
            :rules="
              input.name == 'newEmail'
                ? emailRules
                : input.name == 'confirmNewEmail'
                ? confirmEmailRules
                : requiredField
            "
            :append-icon="input.name == 'password' ? input.showIcon : ''"
            @click:append="
              () =>
                input.type == 'password'
                  ? ((input.type = 'text'), (input.showIcon = 'visibility'))
                  : ((input.type = 'password'),
                    (input.showIcon = 'visibility_off'))
            "
            v-model="input.model"
            v-on:keyup.enter="updateEmail()"
          ></v-text-field>
        </v-form>
        <v-card-actions class="pb-5 justify-center">
          <v-btn
            :loading="loader"
            class="primary--text buttonBg fs-13 font-weight-mediumf-inter pass-btn rounded-lg"
            style="text-transform: none !important; letter-spacing: -0.3px"
            @click="updateEmail()"
            elevation="0"
            block
          >
            Update Email
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- OTP VERIFY MODAL -->
    <v-dialog
      v-model="otpDialog"
      persistent
      max-width="360"
      class="pass-dialog"
    >
      <v-card>
        <v-card-title
          class="fs-18 font-weight-medium f-inter textPrimary--text justify-space-between"
          style="letter-spacing: -0.3px"
        >
          Change Email
          <span
            class="material-icons custom-close-icon mt-3"
            @click="closeOtpDialog()"
          >
            close
          </span>
        </v-card-title>
        <v-divider style="border: 0.3px solid #e8ebf6"></v-divider>
        <p class="ml-6 mt-4 fs-15 font-weight-medium textPrimary--text f-inter">
          Verify Email
        </p>
        <p class="ml-6 subHeading--text fs-13 f-inter">
          Email verification code has been sent to
          <b>{{ changeEmailFields[0].model }}</b>
        </p>
        <v-form ref="verifyOtp" class="d-flex justify-center">
          <div style="max-width: 200px">
            <v-otp-input
              length="4"
              width="100px"
              type="number"
              class="otp-input"
              v-model="otp"
              v-on:keyup.enter="verifyOTP()"
            ></v-otp-input>
          </div>
        </v-form>
        <v-card-actions class="pb-5 justify-center mt-8">
          <v-btn
            :loading="loader"
            class="primary--text buttonBg fs-13 font-weight-medium f-inter pass-btn rounded-lg"
            style="text-transform: none !important; letter-spacing: -0.3px"
            @click="verifyOTP()"
            elevation="0"
            block
          >
            Verify Email
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import apiService from "@/services/Api.js";
export default {
  data() {
    return {
      emailDialog: false,
      otpDialog: false,
      loader: false,
      otp: null,
      changeEmailFields: [
        {
          name: "newEmail",
          label: "Enter New Email",
          placeholder: "john@example.com",
          type: "email",
          cols: 12,
          col_md: 12,
          model: "",
        },
        {
          name: "confirmNewEmail",
          label: "Confirm New Email",
          placeholder: "john@example.com",
          type: "email",
          cols: 12,
          col_md: 12,
          model: "",
        },
        {
          name: "password",
          label: "Enter Recordme Password",
          placeholder: "********",
          type: "password",
          cols: 12,
          col_md: 12,
          showIcon: "visibility_off",
          model: "",
        },
      ],
      requiredField: [
        (v) => !!v || "Field is required",
        (v) =>
          (v && v.length >= 6) ||
          "Length must be greater than or equal to 6 digits",
        (v) => (v && v.length <= 15) || "Maximum length must be 15 digits",
      ],
      emailRules: [
        (v) => !!v || "Field is required",
        (v) =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(v) ||
          "E-mail must be valid",
      ],
      confirmEmailRules: [
        (v) => !!v || "Field is required",
        (v) =>
          v === this.changeEmailFields[0].model ||
          "The email confirmation does not match",
        (v) =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(v) ||
          "E-mail must be valid",
      ],
    };
  },
  methods: {
    updateEmail() {
      if (!this.$refs.changeEmail.validate()) {
        return this.$showNotificationBar(
          "error",
          "Fill the required fields properly"
        );
      }
      this.loader = true;
      localStorage.setItem("newEmail", this.changeEmailFields[0].model);
      apiService
        .PostRequest("user/client/change-email", {
          newEmail: this.changeEmailFields[0].model,
          password: this.changeEmailFields[2].model,
        })
        .then(() => {
          this.closeDialog();
          this.loader = false;
          this.otpDialog = true;
        })
        .catch((err) => {
          this.loader = false;
          console.log(err.response);
          this.$showNotificationBar("error", err.response.data.data);
        });
    },
    // Method to verify OTP and update email
    verifyOTP() {
      if (!this.$refs.verifyOtp.validate()) {
        return this.$showNotificationBar(
          "error",
          "Fill the required fields properly"
        );
      }
      this.loader = true;
      this.$store
        .dispatch("auth/verifyOTP", {
          OTP: this.otp,
          newEmail: localStorage.getItem("newEmail"),
        })
        .then(() => {
          this.loader = false;
          this.otpDialog = false;
          localStorage.removeItem("newEmail");
          this.$refs.verifyOtp.reset();
          this.$showNotificationBar(
            "success",
            "Email updated successfully, please login again"
          );
          setTimeout(() => {
            localStorage.clear();
            window.location.reload();
          }, 2000);
        })
        .catch((err) => {
          this.loader = false;
          // this.otpDialog = false;
          console.log("error", err);
          this.$showNotificationBar("error", err.response.data.data);
        });
    },
    closeDialog() {
      (this.emailDialog = false), this.$refs.changeEmail.reset();
    },
    closeOtpDialog() {
      (this.otpDialog = false), this.$refs.verifyOtp.reset();
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
.otp-input >>> .v-text-field__slot {
  background: var(--v-buttonBg-base) !important;
  border: 0.3px solid var(--v-primary-base) !important;
  border-radius: 6px !important;
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
