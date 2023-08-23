<template>
  <v-container justify="space-between" id="loginPageContainer" fluid>
    <v-row style="height: 91.9vh">
      <v-col :cols="$vuetify.breakpoint.lg ? 6 : 12">
        <HeaderLogo />

        <v-row
          justify="center"
          class="mt-15 pt-15"
          no-gutters
          style="height: 83.9vh"
        >
          <v-col md="7" cols="12">
            <p class="fs-32 fw-500 ma-0 heading-text">Reset Password</p>
            <span class="fs-14 mb-5 fw-500"
              >Please chose your new password</span
            >
            <FormInput
              :customClass="`pl-0`"
              :input="input"
              v-for="(input, index) in inputList"
              :key="index"
              @on-enter="setPassword"
              @update-value="(n) => (input.model = n)"
            ></FormInput>

            <v-btn
              class="login-btn text-capitalize mt-3"
              depressed
              color="primary"
              block
              :loading="loader"
              @click="setPassword"
            >
              <span class="fs-14 fw-600">Reset Password</span>
            </v-btn>
            <router-link :to="{ name: 'Login' }" class="remove-underline ml-3"
              ><a class="back-to-login-btn text-capitalize justify-center">
                <span class="fs-14 fw-500 text-capitalize primary--text"
                  >Back To Login</span
                >
              </a></router-link
            >
          </v-col>
        </v-row>
      </v-col>
      <v-col
        cols="6"
        sm="6"
        align="center"
        class="loginPageBackground bg-img"
        v-show="$vuetify.breakpoint.lg"
      >
        <p class="right-bg-pera fs-27 white--text fw-500">
          Re Invent Your Accounting Processes <br />
          With RecordME Automated Services
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FormInput from "../components/common/FormInput.vue";
import HeaderLogo from "../components/registration/HeaderLogo";
import rules from "../constants/validation-rules";

export default {
  components: {
    FormInput,
    HeaderLogo,
  },

  data: () => ({
    inputList: [
      {
        name: "password",
        label: "New Password",
        placeholder: "********",
        type: "password",
        cols: 12,
        col_md: 12,
        showIcon: "visibility_off",
        model: "",
        class: "pl-0",
        rules: [rules.required, rules.password_length, rules.password_max_length],
      },
      {
        name: "confirmPassword",
        label: "Confirm New Password",
        placeholder: "********",
        type: "password",
        cols: 12,
        col_md: 12,
        showIcon: "visibility_off",
        model: "",
        class: "pl-0",
        rules: [rules.required, rules.password_length, rules.password_max_length],
      },
    ],
    loader: false,
    token: "",
  }),

  methods: {
    setPassword() {
      /**
       * Validations
       */
      if (!this.inputList[0].model || !this.inputList[1].model)
        return this.$showNotificationBar(
          "error",
          "Please provide all the required fields"
        );
        if (this.inputList[0].model.length >= 15 || this.inputList[1].model.length >= 15 )
        return this.$showNotificationBar(
          "error",
          "Password length must be less than 15 characters"
        );
        if (this.inputList[0].model.length < 6 || this.inputList[1].model.length < 6 )
        return this.$showNotificationBar(
          "error",
          "Password length must be greater than or equal to 6 characters"
        );
      if (
        this.inputList &&
        this.inputList[0].model != this.inputList[1].model
      ) {
        return this.$showNotificationBar("error", "Password mismatch");
      }
      this.loader = true;
      this.$store
        .dispatch("auth/setPassword", {
          newPassword: this.inputList[0].model,
          verifyPassword: this.inputList[1].model,
          token: this.token,
        })
        .then(() => {
          this.loader = false;
          this.$showNotificationBar(
            "success",
            "Password has been reset, Login again"
          );
          this.$router.push({ path: "/" });
        })
        .catch((e) => {
          this.loader = false;
          this.$showNotificationBar("error", e.response.data.message);
        });
    },
  },
  mounted() {
    if (!this.$route.query.token) this.$router.push("/");
    this.token = this.$route.query.token;
  },
};
</script>
<style scoped>
/**
Background image and peragrapgh styling of right section
*/
.bg-img {
  background: url("../assets/login-bg.svg") no-repeat bottom right;
}
.right-bg-pera {
  top: 12%;
  position: relative;
}
/**
Login button styling
*/
.v-btn:not(.v-btn--round).v-size--default {
  height: 50px !important;
  border-radius: 10px !important;
}
.v-btn--block {
  min-width: 98% !important;
}
</style>
