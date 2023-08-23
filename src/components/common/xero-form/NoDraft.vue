<template>
  <div
    class="d-flex justify-center align-center"
    style="min-height: 100vh; min-width: 100%"
  >
    <span>Your request is {{ ticket.status }}</span>
  </div>
</template>
<script>
export default {
  name: "Loader",
  components: {},
  data() {
    return {};
  },
  props: {
    ticket: Object
  },
  computed: {},
  mounted() {},
  methods: {},
};
</script>

<style scoped></style>
