<template>
  <v-container
    justify="space-between"
    class="pl-7"
    id="loginPageContainer"
    fluid
  >
    <v-row style="height: 100vh">
      <v-col :cols="$vuetify.breakpoint.lg ? 8 : 12" flat>
        <!-- Logo  -->

        <HeaderLogo />

        <v-row
          :class="$vuetify.breakpoint.lg ? 'mt-15 ml-10 pl-10' : 'ml-5 pl-5'"
        >
          <!-- create account heading col  -->
          <v-col md="12" cols="12" class="mt-5 pl-0">
            <p class="fs-32 textPrimary--text fw-500 ma-0 heading-text">
              Create Account
            </p>
            <span class="fs-12 mb-5 textPrimary--text fw-500"
              >Please provide the following information blew</span
            >
          </v-col>
        </v-row>
        <v-form ref="signUp">
          <v-row justify="center">
            <!-- Input to create an account  -->

            <FormInput
              :input="input"
              v-for="(input, index) in inputList"
              :key="index"
              @update-value="(n) => (input.model = n)"
              @on-enter="signUp"
              @change-type="changeType(input)"
            >
            </FormInput>
          </v-row>
        </v-form>
        <!-- continue button row 
        align:right class is assign to this col 
       -->
        <v-row class="justify-center bottom-action-signup">
          <v-col
            class="pl-5 mt-4"
            :cols="$vuetify.breakpoint.lg ? 11 : 12"
            flat
          >
            <router-link
              :to="{ name: 'Login' }"
              class="remove-underline text-capitalize justify-center"
              :class="$vuetify.breakpoint.lg ? 'back-to-login-btn' : 'mb-4'"
              ><span class="fs-14 fw-500 text-inital primary--text"
                >Back to login</span
              ></router-link
            >

            <v-btn
              class="primary--text text-capitalize mt-3"
              :class="$vuetify.breakpoint.lg ? '' : 'cont-btn-lg'"
              color="lightBackground"
              depressed
              @click="signUp"
              :loading="loader"
              ><span class="fw-600 fs-14 f-avenir">Continue </span
              ><v-icon dark right> east </v-icon></v-btn
            >
          </v-col>
        </v-row>
      </v-col>

      <!-- Right side image of register page  -->
      <v-col
        cols="4"
        sm="4"
        justify="end"
        class="loginPageBackground bg-img pl-12 pt-10"
        v-show="$vuetify.breakpoint.lg"
      >
        <v-btn
          class="btn btn-primary primary--text"
          small
          color="#312A4C"
          depressed
          >Integration</v-btn
        >
        <p class="fs-27 mt-3 white--text fw-500">
          Integrate Your Existing <br />
          Accounting Software with <br />
          RecordME
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FormInput from "../components/common/FormInput.vue";
import HeaderLogo from "../components/registration/HeaderLogo";
import CountryCode from "../constants/sign-up/countryCode";
import CurrencyList from "../constants/sign-up/currencyList";
import EventBus from "../js/EventBus";
import rules from "../constants/validation-rules";
export default {
  name: "Login",

  components: {
    FormInput,
    HeaderLogo,
  },

  data: () => ({
    /**
     * Desc: This is list of all inputs , thats show on register page
     * options: this prop is used to append option into select input
     * showInput:@param(Boolean)
     *  showInput: This is used to hide or show field on register page
     * showIcon: This field is used to append an icon on input field (specialy we use  on passward input )
     * cols: This prop is used to make column of row dynamic
     * col_md: what should be the column in a row when page is open on medium screen
     */
    inputList: [
      {
        name: "name",
        label: "First Name",
        placeholder: "Enter Your First Name Here",
        type: "text",
        cols: 12,
        col_md: 5,
        maxLength: "30",
        model: "",
        rules: [rules.required],
      },
      // {
      //   name: "lastName",
      //   label: "Last Name",
      //   placeholder: "Enter Your last Name Here",
      //   type: "text",
      //   cols: 12,
      //   col_md: 5,
      //   maxLength: "30",
      //   model: "",
      //   rules: [rules.required],
      // },
      {
        name: "email",
        label: "Email",
        placeholder: "Enter Your Email Here",
        type: "email",
        cols: 12,
        col_md: 5,
        maxLength: "40",
        model: "",
        rules: [rules.required, rules.email],
      },
      // {
      //   name: "companyPosition",
      //   label: "Designation",
      //   placeholder: "Select Your Designation",
      //   type: "select",
      //   cols: 12,
      //   col_md: 5,
      //   options: [
      //     { label: "CEO (Chief Executive Officer)", value: "CEO" },
      //     { label: "Director", value: "director" },
      //     { label: "COO (Chief Operating Officer)", value: "COO" },
      //     { label: "CFO (Chief Financial Officer)", value: "CFO" },
      //     { label: "Other", value: "other" },
      //   ],
      //   isMultiple: false,
      //   other: true,
      //   model: "",
      //   rules: [rules.required],
      // },
      // {
      //   name: "companyName",
      //   label: "Company Name",
      //   placeholder: "Enter Your Company Name Here",
      //   type: "text",
      //   cols: 12,
      //   col_md: 5,
      //   maxLength: "50",
      //   model: "",
      //   rules: [rules.required],
      // },
      // {
      //   name: "industry",
      //   label: "Industry",
      //   placeholder: "Select Your Industry",
      //   type: "select",
      //   cols: 12,
      //   col_md: 5,
      //   value: "",
      //   showInput: false,
      //   rules: [rules.required],
      //   options: [
      //     { label: "Information Technology", value: "informationTechnology" },
      //     {
      //       label: "Finance & Accounting Service",
      //       value: "FinanceAccountingService",
      //     },
      //     { label: "Manufacturing", value: "manufacturing" },
      //     { label: "Construction", value: "construction" },
      //     { label: "Services", value: "services" },
      //     { label: "Other", value: "other" },
      //   ],
      //   isMultiple: false,
      //   other: true,
      //   model: "",
      // },
      // {
      //   name: "currency",
      //   label: "Currency",
      //   placeholder: "Select Your Currency",
      //   type: "chipSelect",
      //   cols: 12,
      //   col_md: 5,
      //   options: CurrencyList,
      //   isMultiple: true,
      //   model: "",
      //   rules: [rules.select_field_required],
      // },
      {
        name: "country",
        label: "Country",
        placeholder: "Select Your Country",
        type: "select",
        cols: 12,
        col_md: 5,
        options: CountryCode,
        isMultiple: false,
        model: "+92",
      },
      {
        name: "password",
        label: "Password",
        placeholder: "Enter Your Password Here",
        type: "password",
        cols: 12,
        col_md: 5,
        showIcon: "visibility_off",
        model: "",
      },
      // {
      //   name: "confirmPassword",
      //   label: "Confirm Password",
      //   placeholder: "Enter Your Password Again to Confirm ",
      //   type: "password",
      //   cols: 12,
      //   col_md: 5,
      //   showIcon: "visibility_off",
      //   model: "",
      //   rules: [
      //     rules.required,
      //     rules.password_length,
      //     rules.password_max_length,
      //   ],
      // },
    ],
    model: {},
    loader: false,
    successResponse: false,
  }),

  methods: {
    changeType(input) {
      let field = this.inputList.find((item) => item.label === input.label);
      if (field != -1) field.type = "text";
    },
    signUp() {
      this.inputList.forEach((item) => {
        this.model[item.name] = item.model;
      });
      // change in functionality for currency as it is being sent in Array format.
      // this.model["currency"] = [this.model["currency"]];
      if (!this.$refs.signUp.validate()) {
        this.$showNotificationBar(
          "error",
          "Please provide all the required fields"
        );
        // if (!this.model.password || !this.model.confirmPassword) {
        //   return this.$showNotificationBar(
        //     "error",
        //     "Please provide all the required fields"
        //   );
        // }
        if (this.model.password.length < 6) {
          return this.$showNotificationBar(
            "error",
            "Password length must be greater than or equal to 6 characters"
          );
        }
        if (this.model.password.length >= 15) {
          return this.$showNotificationBar(
            "error",
            "Password length must be less than 15 characters"
          );
        }
        return;
      }
      // if (this.model && this.model.password != this.model.confirmPassword) {
      //   return this.$showNotificationBar("error", "Password mismatch");
      // }
      this.loader = true;
      const payload = this.createPayload();
      this.$store
        .dispatch("auth/signUp", payload)
        .then((response) => {
          this.$showNotificationBar("success", response.message);
          this.loader = false;
          window.open(response.url, "_blank");
          this.successResponse = true;
          localStorage.setItem("tempEmail", this.model.email);
          this.$router.push({ name: "VerifyEmail" });
        })
        .catch((e) => {
          this.error(e.response.data.message);
          this.loader = false;
        });
    },
    createPayload() {
      // const { ...model } = this.model;
      const { firstName, ...model } = this.model;
      // model["name"] = firstName + " " + lastName;
      return model;
    },
    resendEmail() {
      this.$store
        .dispatch("auth/resendEmail", this.model.email)
        .then((response) => {
          this.$showNotificationBar("success", "Email has been sent");
        })
        .catch((e) => {
          let text = e.message;
          this.error(text);
        });
    },
    error(text) {
      this.$showNotificationBar("error", text);

      this.loader = false;
    },
  },
};
</script>
<style scoped lang="scss">
.email-verfication {
  .check-verification-title {
    line-height: 34px;
    letter-spacing: -0.02em;
    color: #40415a;
    margin-bottom: 28px;
  }
  .resend-email-parent {
    max-width: 410px;
    padding-top: 17px;
  }
  .email-box {
    max-width: 481px;
    max-height: 65px;
    background: #fbfafd;
    border-radius: 6px;
    .label {
      line-height: 16px;
      color: #40415a;
      padding: 13px 0px 0px 17px;
    }
    .resend-email-parent {
      max-width: 410px;
      padding-top: 17px;
    }
    .email {
      line-height: 20px;
      color: #9d9eab;
      padding: 0px 0px 10px 17px;
    }
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

  span {
    margin-right: 20px;
  }
}
</style>
<style scoped>
/**
Background image and peragrapgh styling of right section
*/
.bg-img {
  background: url("../assets/register-bg.svg") no-repeat bottom right;
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
  border-radius: 8px !important;
}

.bottom-action-signup .col {
  display: flex;
  justify-content: space-between;
  padding-left: 24px;
  padding-right: 51px;
  align-items: flex-end;
}
.backto-login-btn {
  position: absolute;
  left: 28px;
  top: 6%;
}
.arrow-back-icon {
  position: relative;
  top: 7px;
}
.back-to-login-btn {
  position: relative;
  left: 0% !important;
  margin-left: 32px;
  margin-bottom: 15px;
}
.cont-btn-lg {
  position: absolute;
  margin-left: 55%;
  display: flex;
}
</style>
