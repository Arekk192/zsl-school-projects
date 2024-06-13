<template>
  <div class="bg-white border border-gray-300 rounded-md shadow-md">
    <div class="flex items-center p-4">
      <p class="font-bold">{{ album }}</p>
    </div>
    <img :src="image" alt="post_image" class="w-full" />
    <div class="p-4">
      <p>
        <span class="font-bold">{{ album }}</span>
        <!-- {{}} -->
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: Number,
    album: String,
    originalName: String,
    url: String,
    tags: Array,
  },
};
</script>
