<template>
  <v-container
    justify="space-between"
    id="loginPageContainer forgot-password"
    fluid
  >
    <v-row>
      <v-col :cols="$vuetify.breakpoint.lg ? 6 : 12">
        <HeaderLogo />

        <v-row justify="center" class="mt-15 pt-15" no-gutters>
          <v-col md="7" cols="12">
            <p class="fs-32 fw-500 ma-0 pl-0 lh-44 heading-text">
              Forgot Password
            </p>
            <span class="fs-14 mb-6 mt-3 fw-500 lh-19"
              >Send a link to your email to reset password</span
            >
            <v-form onSubmit="return false;" ref="forgotPassword">
              <FormInput
                :customClass="`pl-0`"
                :input="input"
                v-for="(input, index) in inputList"
                :key="index"
                @update-value="(n) => (input.model = n)"
                @on-enter="sendEmail"
              ></FormInput>
            </v-form>
            <v-btn
              class="login-btn text-capitalize mt-20 send-reset-link"
              depressed
              color="primary"
              block
              :loading="loader"
              @click="sendEmail"
            >
              <span class="fs-14 fw-600 lh-19">Send Reset Link</span>
            </v-btn>

            <router-link :to="{ name: 'Login' }" class="remove-underline"
              ><a class="back-to-login-btn text-capitalize justify-center">
                <span class="fs-14 fw-500 lh-19 text-capitalize primary--text"
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
        class="loginPageBackground bg-img right-side-bgimage"
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
import rules from "@/constants/validation-rules";

export default {
  components: {
    FormInput,
    HeaderLogo,
  },

  data: () => ({
    loader: false,
    inputList: [
      {
        name: "email",
        label: "Email",
        placeholder: "Enter Your Email Here",
        type: "email",
        cols: 12,
        col_md: 12,
        model: "",
        class: "pl-0",
        rules: [rules.required],
      },
    ],
  }),
  methods: {
    sendEmail() {
      if (!this.$refs.forgotPassword.validate()) {
        return this.$showNotificationBar(
          "error",
          "Please provide all the required fields"
        );
      }
      this.loader = true;
      this.$store
        .dispatch("auth/forgotPassword", {
          email: this.inputList[0].model.toLowerCase().trim(),
        })
        .then(() => {
          this.$showNotificationBar(
            "success",
            "Email has been sent, Kindly check"
          );
          this.loader = false;
          this.inputList[0].model = ""
          this.$refs.forgotPassword.reset();
        })
        .catch((e) => {
          this.loader = false;
          this.error(e.response.data.message);
        });
    },
    error(text) {
      this.$showNotificationBar("error", text);
      this.loader = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.send-reset-link {
  margin-top: 6px;
  margin-bottom: 19px;
}
.v-btn:not(.v-btn--round).v-size--default {
  height: 50px !important;
  border-radius: 10px !important;
}
</style>
<style>
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

.v-btn--block {
  min-width: 98% !important;
}
</style>
