<template>
  <v-dialog v-model="modal" :width="mainWidth" persistent :fullscreen="fullScreenCheck">
    <v-card class="card-class">
      <v-card-title class="primary--text">
        <slot name="header"></slot>
        <v-spacer></v-spacer>
        <v-icon @click="close()" color="primary">mdi-close</v-icon>
      </v-card-title>
      <v-divider></v-divider>
      <v-container class="py-0 pt-1">
        <v-card-text class="py-0">
          <slot name="content"></slot>
        </v-card-text>

        <v-card-actions v-if="doNotShowButtonHeadingSlot" class="mt-3">
          <v-col cols="12" class="pb-0 pr-0 d-flex">
            <v-spacer></v-spacer>
            <Button
              @button-clicked="close()"
              :loader="cancelLoader"
              class="mr-2"
              color="white"
            >
              <template v-slot:buttonHeading>
                <p class="ma-0 pa-0 red--text">Cancel</p>
              </template>
            </Button>

            <Button
              @button-clicked="save()"
              :loader="buttonLoader"
              class="mr-2"
            >
              <template v-if="hasButtonHeadingSlot" v-slot:buttonHeading>
                <p class="ma-0 pa-0 primary--text">{{ hasButtonHeadingSlot }}</p>
              </template>
              <template v-else v-slot:buttonHeading>
                <p class="ma-0 pa-0 primary--text">Submit</p>
              </template>
            </Button>
          </v-col>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import Button from "../button";
export default {
  name: "dialogBox",
  components: {
    Button,
  },
  props: {
    buttonLoader: Boolean,
    modal: Boolean,
    width: String,
    fullScreenCheck : Boolean,
  },
  data() {
    return {
      cancelLoader: false,
      saveLoader: false,
      mainWidth: "450",
    };
  },
  mounted() {
    if (this.width) this.mainWidth = this.width;
  },
  computed: {
    hasButtonHeadingSlot() {
      if (this.$slots["buttonHeading"] !== undefined) {
        return this.$slots["buttonHeading"][0].text;
      } else {
        return false;
      }
    },
    doNotShowButtonHeadingSlot() {
      if (this.$slots["doNotShowButtonHeadingSlot"] !== undefined) {
        return false;
      } else {
        return true;
      }
    },
    //  updatedModal(){
    //    this.cancelLoader = false
    //    this.saveLoader = false
    //    return this.modal
    //  }
  },
  created() {},
  methods: {
    close() {
      // this.cancelLoader = true,
      this.$emit("close-clicked");
    },
    save() {
      // this.saveLoader = true
      this.$emit("save-clicked");
    },
  },
};
</script>

<style scoped>
::v-deep .v-input--is-focused {
  border: 1px solid var(--v-appColor-base) !important;
}
::v-deep .v-btn__content {
  letter-spacing: 0.2px !important;
}
</style>
