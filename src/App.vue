<template>
  <v-app>
    <audio id="myAudioClient">
      <source :src="soundClient" type="audio/ogg" />
      <source :src="soundClient" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>

    <audio id="auditNotification">
      <source :src="auditNotification" type="audio/ogg" />
      <source :src="auditNotification" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
    <SnackBar />
    <v-main style="padding: 0px !important">
      <router-view></router-view>

      <PendingUserSnackbar v-if="showVerifyEmailBar" />
      <ConnectXeroMessage v-if="getXeroModal" :modal="getXeroModal" />
      <!-- <v-tour name="myTour" :steps="steps"></v-tour> -->
      <VueTour
        v-if="
          ![
            'Login',
            'Register',
            'ForgetPassword',
            'Verification',
            'VerifyEmail',
            'LoginVerification',
            'ChangePassword',
          ].includes($route.name) && $vuetify.breakpoint.lg
        "
      />
    </v-main>
  </v-app>
</template>

<script>
import ConnectXeroMessage from "./components/common/ConnectXeroMessage.vue";
import SnackBar from "./components/common/SnackBar.vue";
import PendingUserSnackbar from "./components/common/PendingUserSnackbar.vue";
import soundClient from "./assets/beep_sms.mp3";
import auditNotification from "./assets/audit_notification.wav";
import VueTour from "./components/common/VueTour.vue";
import socket from "./services/SocketIo";
import { mapGetters } from "vuex";
import ApiService from "./services/Api";
import UrlServices from "./services/Url";
// import firebase from "./js/FireBase"
export default {
  name: "App",
  components: { SnackBar, PendingUserSnackbar, ConnectXeroMessage, VueTour },

  data: () => ({
    modal: true,
    messages: "",
    soundClient: soundClient,
    auditNotification: auditNotification,
  }),
  computed: {
    ...mapGetters({
      token: "auth/getAuthToken",
      user: "auth/getUser",
      currentWorkspace: "auth/getCurrentWorkspace",
      workspaces: "auth/getUserWorkSpaces",
    }),
    /**
     * Method to get Xero Modal Component
     */
    getXeroModal() {
      return (
        ![
          "Login",
          "Register",
          "Integration",
          "ForgetPassword",
          "Verification",
          "VerifyEmail",
          "LoginVerification",
          "ChangePassword",
        ].includes(this.$route.name) &&
        !this.currentWorkspace.isAccountingSoftConnected &&
        this.user.role === "client" &&
        this.workspaces.length > 0
      );
    },
    showVerifyEmailBar() {
      return (
        ![
          "Login",
          "Register",
          "Integration",
          "ForgetPassword",
          "Verification",
          "VerifyEmail",
          "LoginVerification",
          "ChangePassword",
        ].includes(this.$route.name) && this.user.role === "client"
      );
    },
  },
  mounted() {
    this.getProfile();
    // firebase(document);
    var self = this;
    window.addEventListener(
      "focus",
      function () {
        self.pauseSound(false);
      },
      false
    );
  },
  methods: {
    /*
     ** Get Profile API added if user is logged in
     */
    async getProfile() {
      try {
        if (!localStorage.getItem("token")) return;
        const response = await ApiService.GetRequest(UrlServices.getProfile);
        if (response.data.user)
          this.$store.commit("auth/addUser", response?.data?.user);
      } catch (error) {
        console.log(error);
      }
    },
    playSound(play) {
      var x = document.getElementById("myAudioClient");
      if (play) {
        x.play();
        this.$store.dispatch("ticket/getTasks");
      }
    },
    // This fuction is user to pause sound of notification
    pauseSound(play) {
      var x = document.getElementById("myAudioClient");
      x.pause();
    },
    subscribe() {
      // ticket socket has been removed because client does not need any notification if ticket has been created.
      // socket.on("ticket", (body) => {
      //   if (this.token) {
      //     if (
      //       this.workspaces.filter(
      //         (workspace) => workspace.workspaceId == body.workspaceId
      //       ).length
      //     ) {
      //       this.$store.dispatch("ticket/getTasks");
      //       EventBus.$emit("show-snackbar", {
      //         text: `New ticket received`,
      //         type: "success",
      //       });
      //       this.playSound(true);
      //     }
      //   }
      // });
      socket.on("update-user-data", (body) => {
        if (this.token && body._id === this.user._id) {
          this.$store.commit("auth/addUser", body);
        }
      });
      // socket for checking workspace with xero for multiple logins
      socket.on("xero-connection", (body) => {
        // set UserWorkspaces
        if (this.token && body.userId === this.user._id) {
          this.$store.commit("auth/updateUserWorkspaces", body.workspace);
          // check if workspace is current then update this
          if (this.currentWorkspace._id === body.workspace._id)
            this.$store.commit("auth/addCurrentWorkspace", body.workspace);
        }
      });

      // employee tickets
      socket.on("employee-tickets", (body) => {
        // set UserWorkspaces
        if (this.token && body.clientDetail._id === this.user._id) {
          // update workspaces
          this.$store.commit("auth/updateUserWorkspaces", body.workspace);
          // check if workspace is current then update this
          if (this.currentWorkspace._id === body.workspace._id) {
            this.$store.commit("auth/addCurrentWorkspace", body.workspace);
            // show snack bar
            this.$showNotificationBar(
              "success",
              `New ticket received for Audit`
            );
            // play audit notification tone
            document.getElementById("auditNotification").play();
            return;
          }
        }
      });

      socket.on("comment", (body) => {
        if (this.token)
          if (
            body.userId !== this.user._id &&
            this.workspaces.filter(
              (workspace) => workspace._id == body.workspaceId
            ).length
          ) {
            if (
              this.user.role === "employee" &&
              body.createdBy === this.user._id
            ) {
              this.playSound(true);
              return this.$showNotificationBar(
                "success",
                `New message received`
              );
            } else if (this.user.role === "client") {
              this.playSound(true);
              return this.$showNotificationBar(
                "success",
                `New message received`
              );
            }
          }
      });
    },
  },

  created() {
    this.subscribe();
    var self = this;
    document.addEventListener("click", function () {
      document.getElementById("myAudioClient").pause();
    });
  },
  beforeDestroy() {
    socket.off("employee-tickets");
  },
};
</script>

<style>
/* this code is to resist input fields background fill when field is being auto-complete
 e.g login page
*/
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px #fbfafd inset !important;
}
</style>
