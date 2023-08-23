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
            <p class="fs-20 fw-600 f-inter ma-0 textPrimary--text">Login</p>
            <span class="fs-14 mb-5 fw-500 f-inter textPrimary--text"
              >Enter your credentials to access your account</span
            >
            <v-form ref="login">
              <FormInput
                :customClass="`pl-0`"
                :input="input"
                v-for="(input, index) in inputList"
                @update-value="(n) => (input.model = n)"
                @on-enter="login"
                :key="index"
                ref="login"
              ></FormInput>
            </v-form>
            <p
              class="ma-0 primary--text fs-13 pr-3 f-inter fw-600"
              align="right"
            >
              <router-link
                :to="{ name: 'ForgetPassword' }"
                class="remove-underline"
              >
                <a href="#" class="primary--text">Forgot Password ?</a>
              </router-link>
            </p>

            <v-btn
              class="mt-5 login-btn text-capitalize"
              depressed
              color="primary"
              block
              :loading="loader"
              @click="login"
            >
              <p class="fs-14 pt-3 fw-600 f-inter">Login</p>
            </v-btn>

            <span class="d-flex justify-center my-3 f-inter fw-500">
              <span> or </span><br />
            </span>

            <span class="d-flex justify-center set-spacing">
              <span
                :class="
                  $vuetify.breakpoint.lg
                    ? 'desktop-btn-width f-inter fw-500'
                    : 'mob-btn-width f-inter fw-500'
                "
                data-layout="block"
                data-border-radius="10"
                data-size="large"
                data-theme="dark"
                data-xero-sso
                :data-href="`${vueAppURL}xero/signup-with-xero`"
                data-label="Sign In with Xero"
              ></span>
            </span>
            <!-- <p class="mt-5 fs-13" align="left">
              Don't have an account ?
              <router-link to="/register" class="remove-underline"><span class="primary--text fs-13">Create a new
                  one</span></router-link>
            </p> -->
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
import EventBus from "../js/EventBus";
import rules from "../constants/validation-rules";
export default {
  name: "Login",

  components: {
    FormInput,
    HeaderLogo,
  },
  data: () => ({
    vueAppURL: process.env.VUE_APP_BACK_END_URL,
    /**
     * Desc:This is dynamic list to show inputs of page
     * showIcon:this prop is use to show eye icon of password field
     *  * cols: This prop is used to make column of row dynamic
     * col_md: what should be the column in a row when page is open on medium screen
     */
    inputList: [
      {
        name: "email",
        label: "Email",
        placeholder: "Enter Your Email Here",
        type: "email",
        cols: 12,
        col_md: 12,
        class: "pl-0 mt-2",
        model: "",
        rules: [rules.required, rules.email],
      },
      {
        name: "password",
        label: "Password",
        placeholder: "Enter Your Password Here",
        type: "password",
        cols: 12,
        col_md: 12,
        class: "pl-0 mt-2",
        showIcon: "visibility_off",
        model: "",
        rules: [
          rules.required,
          rules.password_length,
          rules.password_max_length,
        ],
      },
    ],
    loader: false,
    resendEmailText: false,
    appUrl: false,
  }),

  mounted() {
    this.loginFromXero();
  },
  beforeDestroy() {
    document.body.removeChild(document.getElementById("xero-sso"));
  },
  methods: {
    loginFromXero() {
      const script = document.createElement("script");
      script.src = "https://edge.xero.com/platform/sso/xero-sso.js";
      script.id = "xero-sso";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    },
    /**
     * Method to login user
     */
    login() {
      if (!this.inputList[0].model || !this.inputList[1].model)
        return this.$showNotificationBar(
          "error",
          "Please provide all the required fields"
        );
      if (
        this.inputList[1].model.length < 6 ||
        this.inputList[1].model.length >= 15
      )
        return this.$showNotificationBar(
          "error",
          "Password must contain 6-15 characters"
        );
      this.loader = true;
      this.$store
        .dispatch("auth/login", {
          email: this.inputList[0].model.toLowerCase().trim(),
          password: this.inputList[1].model.trim(),
          firebaseToken: localStorage.getItem("firebaseToken"),
        })
        .then(() => {
          this.loader = false;
          localStorage.setItem("tempEmail", "");
          this.$router.push({ path: "/dashboard" });
          this.loader = false;
        })
        .catch((e) => {
          this.loader = false;
          if (e === "Please verify your email first!")
            this.resendEmailText = true;
          if (e === "Incorrect email or password") this.appUrl = true;
          this.error(e.message);
        });
    },
    error(text) {
      this.$showNotificationBar("error", text);
      this.loader = false;
    },
    /**
     * Method to resend email to user
     */
    resendEmail() {
      this.$store
        .dispatch("auth/resendEmail", this.inputList[0].model)
        .then((response) => {
          this.$showNotificationBar("success", "Email has been sent");
          this.resendEmailText = false;
        })
        .catch((e) => {
          let text = e.message;
          this.error(text);
        });
    },
  },
};
</script>
<style>
.inputs-row {
  position: relative;
  bottom: 10% !important;
  left: 138.9px;
  top: 161px;
}

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
.desktop-btn-width {
  width: 397px !important;
}
.mob-btn-width {
  min-width: 330px !important;
}
.set-spacing {
  margin-left: -6px;
}
</style>
