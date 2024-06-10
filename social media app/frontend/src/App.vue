<script>
export default {
  mounted() {
    this.$store.dispatch("GET_PHOTOS_ACTION");
    this.$store.dispatch("GET_TAGS_ACTION");
  },
};
</script>

<template></template>

<style scoped></style>
