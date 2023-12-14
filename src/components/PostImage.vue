<template>
  <img class="spot-image" :src="imageUrl" alt="Camping Spot Image" />
</template>

<script setup lang="ts">

interface Props {
  imageUrl: string;
}

defineProps<Props>();

</script>

<style scoped>
.spot-image {
  width: 100%;
  object-fit: cover;
  display: block;
}
</style>