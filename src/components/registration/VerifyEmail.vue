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
    
            <p class="f-avenir fw-500 fs-25 textPrimary--text ml-3">
              Check Your Email For Verification Link
            </p>
            <div class="email-box pt-2 pb-2">
              <div class="fw-500 fs-15 f-avenir textPrimary--text ml-4">
                Your Email:
              </div>
              <div class="f-avenir fs-15 fw-500 inActiveColor--text ml-4">
                {{ email }}
              </div>
            </div>
            <div class="ml-3 mt-5">
              <span class="f-avenir fs-14 fw-400 greyColor--text"
                >Didn’t receive the email? Please check your spam folder or try
                to resend the email</span
              >
            </div>
    
           
            <!-- <v-btn
              class="login-btn text-capitalize mt-20 send-reset-link"
              depressed
              color="primary"
              block
              :loading="loader"
              @click="resendEmail()"
            >
              <span class="fs-14 fw-600 lh-19">Resend Email</span>
            </v-btn>

            <router-link :to="{ name: 'Login' }" class="remove-underline"
              ><a class="back-to-login-btn text-capitalize justify-center">
                <span class="fs-14 fw-500 lh-19 text-capitalize primary--text"
                  >Back To Login</span
                >
              </a></router-link
            > -->
          </v-col>
        </v-row>
        <v-row :class="$vuetify.breakpoint.lg ? 'resendBtn-position' :''">
          <v-col md="7" cols="12" flat class="resend-email-action" :class="$vuetify.breakpoint.lg ?'ml-10 pl-10':''">
            <router-link :to="{ name: 'Login' }" class="remove-underline">
              <span class="f-avenir fs-14 fw-500 text-inital primary--text mr-5"
                >Back to login</span
              >
            </router-link>
            <v-btn
              class="primary--text text-capitalize"
              color="lightBackground"
              depressed
              @click="resendEmail()"
            >
              <span class="fw-600 fs-14 f-avenir">Resend Email </span></v-btn
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
import FormInput from "../../components/common/FormInput.vue";
import HeaderLogo from "../../components/registration/HeaderLogo";
import EventBus from "../../js/EventBus";
import rules from "../../constants/validation-rules";
export default {
  name: "VerifyEmail",
  components: {
    FormInput,
    HeaderLogo,
  },

  data: () => ({
    model: {},
    loader: false,
    successResponse: true,
    email: localStorage.getItem("tempEmail")
      ? localStorage.getItem("tempEmail")
      : "example.gmail.com",
  }),

  methods: {
    resendEmail() {
      this.$store
        .dispatch("auth/resendEmail", this.email)
        .then((response) => {
          this.$showNotificationBar("success", "Email has been sent");
        })
        .catch((e) => {
          this.loader = false;
          this.$showNotificationBar("error", e.response.data.message);
          // this.error(text);
        });
    },
  },
};
</script>
<style scoped lang="scss">
.email-verfication {
  .email-box {
    max-width: 481px !important;
    background: var(--v-lightBackground-base) !important;
    border-radius: 6px !important;
  }
  .resend-email-action {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 13px;

    button {
      margin-left: 20px;
    }
  }
}
.resend-email-action {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.resendBtn-position{
  position: relative;
  left: 115px;
}
</style>
<style scoped>

/**
Background image and peragrapgh styling of right section
*/
.bg-img {
  background: url("../../assets/register-bg.svg") no-repeat bottom right;
}
.right-bg-pera {
  top: 3%;
  position: relative;
}
/**
Login button styling
*/
.v-btn:not(.v-btn--round).v-size--default {
  height: 50px !important;
  border-radius: 10px !important;
}

.bottom-action-signup .col {
  display: flex;
  justify-content: space-between;
  padding-left: 24px;
  padding-right: 51px;
  align-items: flex-end;
}
</style>
