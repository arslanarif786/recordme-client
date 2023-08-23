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
              <h1 class="font-style-heading-auth mb-2">Verifying ...</h1>
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
import UrlServices from "@/services/Url";
import ApiService from "../services/Api";
export default {
  name: "Verification",
  components: {
    SnackBar,
    HeaderLogo,
  },
  data: () => ({}),
  created() {
    const { email, token } = this.$route.query;
    if (email && token) this.sendVerification(email, token);
    else this.$router.push("/");
  },
  methods: {
    async sendVerification(email, token) {
      try {
        const response = await ApiService.GetRequest(
          `${UrlServices.loginVerification}?email=${email}&token=${token}`
        );
        this.setData(response);
        this.reRoute(
          "success",
          "User has been logged-in successfully",
          "/generate-request"
        );
      } catch (error) {
        // this.reRoute(
        //   "error",
        //   "User cannot login with this paramters",
        //   "/login"
        // );
      }
    },
    reRoute(val, type, path) {
      this.$showNotificationBar(val, type);
      this.$router.push(path);
    },
    setData(res) {
      this.$store.commit(
        "auth/addAuthToken",
        `Bearer ${res.data.token.toString()}`
      );
      localStorage.setItem("token", res.data.token);
      let allWorkspaces = [];
      allWorkspaces.push(res.data.data.workspaces[0].workspaceId);
      this.$store.commit("auth/userWorkspaces", allWorkspaces);
      this.$store.commit("auth/addCurrentWorkspace", allWorkspaces[0]);

      this.$store.commit("auth/addUser", res.data.data.user);
    },
  },
};
</script>

<style scoped>
::v-deep .v-input--is-focused {
  border: 1px solid var(--v-appColor-base) !important;
}

::v-deep .v-input__append-outer .v-icon,
.v-input__prepend-outer .v-icon {
  margin-left: 20px !important;
}

::v-deep .v-btn__content {
  letter-spacing: 0.2px !important;
}

/**
Background image and paragraph styling of right section
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
