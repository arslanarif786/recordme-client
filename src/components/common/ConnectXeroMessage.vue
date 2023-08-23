<template>
  <div>
    <v-snackbar
      v-if="user.status == 'Active' && $vuetify.breakpoint.lg"
      color="lightBackground"
      v-model="modal"
      timeout="-1"
      top
      class="mt-10 snack"
    >
      <span class="d-flex justify-center primary--text f-inter fs-12">
        Please connect this workspace with an accounting software!
        <a
          @click="moveToIntegration()"
          class="ml-3 text-decoration-underline f-inter font-weight-medium fs-12"
          ><b>Connect Accounting Software</b></a
        >
      </span>
    </v-snackbar>
    <v-snackbar
      v-if="user.status == 'Active' && !$vuetify.breakpoint.lg"
      color="lightBackground"
      v-model="modal"
      timeout="-1"
      bottom
      class="mt-10"
    >
      <span class="d-flex justify-center primary--text f-inter fw-500 fs-10">
        Please connect this workspace with an accounting software!
        <a
          @click="moveToIntegration()"
          class="ml-3 text-decoration-underline f-inter fw-500 fs-10"
          ><b>Connect Xero</b></a
        >
      </span>
    </v-snackbar>
  </div>
</template>

<script>
import Button from "../common/button";
import { mapGetters } from "vuex";

export default {
  name: "ConnectXeroMessage",
  props: {
    modal: Boolean,
  },
  components: {
    Button,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      user: "auth/getUser",
    }),
  },
  methods: {
    /**
     * Method to move the user to Integration Page
     */
    moveToIntegration() {
      this.$router.push("/integration");
    },
  },
};
</script>

<style scoped>
:deep .snack .v-snack__wrapper {
  max-width: 100% !important;
}
</style>
