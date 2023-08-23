<template>
  <div
    class="d-flex justify-center align-center"
    style="min-height: 100vh; min-width: 100%"
  >
    <v-progress-circular
      indeterminate
      color="primary"
      :size="40"
    ></v-progress-circular>
  </div>
</template>
<script>
export default {
  name: "Loader",
  components: {},
  data() {
    return {};
  },
  props: {},
  computed: {},
  mounted() {},
  methods: {},
};
</script>

<style scoped></style>
