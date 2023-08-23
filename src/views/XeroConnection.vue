<template>
  <v-container
    justify="space-between"
    class="pa-7"
    id="loginPageContainer"
    fluid
  >
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
              <h1 class="font-style-heading-auth mb-2">Verifiying ...</h1>
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
import {mapGetters} from'vuex'
export default {
  name: "XeroConnection",
  components: {
    SnackBar,
    HeaderLogo
  },
  computed : {
    ...mapGetters({
      currentWorkspace :  "auth/getCurrentWorkspace"
    })
  },
  data: () => ({}),
  created() {
    const token = this.$route.query.token;
    const workspace = this.$route.query.workspaceId;
    if (token && workspace) this.sendVerification(token,workspace);
    else this.$router.push("/integration");
  },
  methods: {
    sendVerification(token,workspace) {
      if(this.currentWorkspace.workspaceId !== workspace) 
      {
        this.$router.push("/integration"); 
        return
      }
      let workspaceDetails = {... this.currentWorkspace}
      workspaceDetails.isAccountingSoftConnected = true
      this.$store.commit("auth/updateUserWorkspaces", workspaceDetails)
      this.$store.commit("auth/addCurrentWorkspace", workspaceDetails)
      this.reRoute()
    },
    reRoute() {
      this.$showNotificationBar(
            "success",
            "Workspace has been connected to Xero"
          ) 
      this.$router.push("/integration");
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
</style>
