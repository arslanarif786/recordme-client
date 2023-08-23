<template>
  <v-container justify="space-between" id="loginPageContainer" fluid>
    <SnackBar />
    <v-row style="height: 91.9vh">
      <v-col :cols="$vuetify.breakpoint.lg ? 6 : 12">
        <HeaderLogo />

        <v-row
          justify="center"
          class="mt-15 pt-15"
          no-gutters
          style="height: 91.9vh"
        >
          <v-col md="7" cols="12">
            <div>
              <div v-if="xeroFlow">
                <span
                  :class="
                    $vuetify.breakpoint.lg
                      ? 'desktop-btn-width ml-5 mt-3'
                      : 'mob-btn-width'
                  "
                  data-layout="block"
                  data-border-radius="10"
                  data-size="large"
                  data-theme="dark"
                  data-xero-sso
                  data-bypass
                  :data-href="`${vueAppURL}xero/signup-with-xero`"
                  data-label="Sign In with Xero"
                ></span>
              </div>
              <h1 v-else class="font-style-heading-auth mb-2">Verifying ...</h1>
            </div>
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
import SnackBar from "../components/common/SnackBar.vue";
import HeaderLogo from "../components/registration/HeaderLogo.vue";
import axios from "axios";
import UrlServices from "@/services/Url";
export default {
  name: "Verification",
  components: {
    SnackBar,
    HeaderLogo,
  },
  data: () => ({
    xeroFlow: false,
    vueAppURL: process.env.VUE_APP_BACK_END_URL,
  }),
  created() {
    this.getProfileWithWorkspace();
  },
  methods: {
    loginFromXero() {
      const script = document.createElement("script");
      script.src = "https://edge.xero.com/platform/sso/xero-sso.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    },
    getProfileWithWorkspace() {
      const token = this.$route.params.token;
      if (this.$route.query.from === "xero") {
        axios
          .get("user/get-profile-with-workspaces", {
            headers: { authorization: `Bearer ${token}` },
          })
          .then((res) => {
            console.log("res>> ", res);
            const allWorkSpaces = [];
            res.data.workspaces.forEach((workspace) => {
              allWorkSpaces.push(workspace.workspaceId);
            });
            this.$store.commit("auth/userWorkspaces", allWorkSpaces);
            if (allWorkSpaces.length > 0) {
              this.$store.commit("auth/addCurrentWorkspace", allWorkSpaces[0]);
            }
            localStorage.setItem("token", token);
            this.$store.commit("auth/addAuthToken", `Bearer ${token}`);
            this.$store.commit("auth/addUser", res.data.user);
            this.$router.push("/dashboard");
            this.xeroFlow = false;
          })
          .catch((err) => {
            console.log("err>>", err);
            this.loginFromXero();
            this.xeroFlow = true;
            return this.$showNotificationBar("error", err);
          });
      } else {
        if (token) this.sendVerification(token);
      }
    },
    sendVerification(token) {
      axios
        .get(`${UrlServices.verification}?token=${token}`)
        .then((res) => {
          this.reRoute(res.data.message, "success");
        })
        .catch((e) => {
          this.reRoute(JSON.parse(e.request.response).message, "error");
        });
    },
    reRoute(val, type) {
      this.$showNotificationBar("success", "User has been verified");
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.font-style {
  font-family: Lato !important;
}

.font-style-paragraph {
  font-family: Lato !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  text-align: center;
}

::v-deep .v-input--is-focused {
  border: 1px solid var(--v-appColor-base) !important;
}

.bg {
  width: 40.6vw;
  min-height: 96vh;
  position: absolute;
  top: 0;
  left: 0;
  /* background: url("../../assets/login/img.png") no-repeat center center; */
  background-size: cover;
  transform: scale(1.1);
}

::v-deep .v-input__append-outer .v-icon,
.v-input__prepend-outer .v-icon {
  margin-left: 20px !important;
}

::v-deep .v-btn__content {
  letter-spacing: 0.2px !important;
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

.margin-left {
  margin-left: 200px;
}
.desktop-btn-width {
  width: 397px !important;
}
.mob-btn-width {
  min-width: 358px !important;
}
</style>
