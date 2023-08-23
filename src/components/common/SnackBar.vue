<template>
  <v-snackbar
    v-model="show"
    top
    right
    color="white"
    timeout="5000"
    elevation="1"
  >
    <!-- left side icon (success,error,info, warning etc) -->

    <!-- success icon -->
    <v-icon
      v-if="type == 'success'"
      @click="show = false"
      class="float-start"
      color="lightGreen"
    >
      mdi-check-circle
    </v-icon>

    <!-- error icon -->
    <v-icon
      v-if="type == 'error'"
      @click="show = false"
      class="float-start"
      color="red"
    >
      cancel
    </v-icon>

    <!-- warning icon -->
    <v-icon
      v-if="type == 'warning'"
      @click="show = false"
      class="float-start"
      color="orange"
    >
      warning
    </v-icon>

    <!-- info icon -->
    <v-icon
      v-if="type == 'info'"
      @click="show = false"
      class="float-start"
      color="blue"
    >
      info
    </v-icon>

    <!-- here is text of snackbar -->
    <span class="pl-1 primary--text fs-14 fw-500 snackbar-text"
      >{{ text }}
    </span>

    <!-- this is right side cancel icon 
    on click this icon we can hide snackbar -->
    <template v-slot:action="{ attrs }">
      <v-icon
        v-bind="attrs"
        @click="show = false"
        class="float-end mr-1"
        size="18"
        color="#bfbfbf"
      >
        close
      </v-icon>
    </template>
  </v-snackbar>
</template>

<script>
import EventBus from "@/js/EventBus";
export default {
  name: "Snackbar",
  data() {
    return {
      show: false,
      text: "",
      type: "",
    };
  },
  mounted() {
    EventBus.$on("show-snackbar", (data) => {
      this.text = data.text;
      this.type = data.type;

      this.show = true;
    });
    EventBus.$on("show-notification-bar", (data) => {
      this.text = data.message;
      this.type = data.type;
      this.show = true;
    });
  },
};
</script>

<style scoped>
.font-style-paragraph {
  font-family: Lato !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  text-align: center;
}
.snackbar-text {
  position: relative;
  top: 2px !important;
  text-align: justify !important;
  display: flex;
}
</style>
