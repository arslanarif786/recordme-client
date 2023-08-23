<template>
  <v-btn
    class="text-capitalize fs-14 fw-500 px-5 rounded-lg elevation-0"
    @click="buttonClicked()"
    :class="color === undefined ? 'lightBackground' : color "
    :loading="loader"
  >
   <slot name="buttonHeading"></slot>
  </v-btn>
</template>

<script>
export default {
  name: "Button",
  props: {
    loader : Boolean,
    color : String,
    type: String
  },
  methods: {
    buttonClicked() {
        this.$emit('button-clicked')
    }
  }
};
</script>

<style scoped>
.v-btn:not(.v-btn--round).v-size--default {
    height: 36px !important;
}
</style>
