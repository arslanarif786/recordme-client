<template>
  <v-snackbar
    v-if="user.status != 'Active' && countDownString"
    v-model="show"
    color="lightBackground"
    :timeout="timeout"
    :top="$vuetify.breakpoint.lg ? true : false"
    class="mt-10"
    multi-line
  >
    <span class="d-flex justify-center primary--text">
      Email not verified yet. Please verify your email before:
    </span>
    <span class="d-flex justify-center primary--text">
      {{ countDownString | formatDate }}</span
    >
  </v-snackbar>
</template>

<script>
import { mapGetters } from "vuex";
import ApiService from "../../services/Api";
let interval = null;
export default {
  name: "PendingUserSnackbar",
  data() {
    return {
      show: true,
      timeout: -1,
      countDownString: null,
      validatedHours: 48,
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/getUser",
    }),
  },
  mounted() {
    /*
     ** Count Check on mounted
     */
    if (this.user.status != "Active" && this.show == true)
      this.countDownTimer();
  },
  methods: {
    /*
     ** Add required hours in count down timer and setup Timer value
     */
    countDownTimer() {
      let lastDate = new Date(this.user.createdAt);
      lastDate.setHours(
        new Date(this.user.createdAt).getHours() + this.validatedHours
      );
      this.setupTimer(lastDate);
    },
    /*
     ** show TimerValue and logout if interval is negative
     */
    setupTimer(distance) {
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        let now = new Date().getTime();
        let timeLeft = distance - now;
        if (timeLeft < 0) {
          this.logOutUser();
          return;
        }
        // let days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        // let hours = Math.floor(
        //   (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        // );
        // let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        // let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        // this.countDownString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        this.countDownString = distance.toISOString();
      }, 1000);
    },
    /*
     ** Clear interval, update string and call for logout
     */
    logOutUser() {
      this.countDownString = "Time Up !";
      clearInterval(interval);
      this.logout();
    },
    /*
     ** Logout API integrated
     */
    async logout() {
      try {
        await ApiService.GetRequest("/log-out");
        this.$store.dispatch("resetStoreState");
        localStorage.removeItem("token");
        this.$router.push("/");
      } catch (error) {
        console.log("error", error);
      }
    },
  },
};
</script>
