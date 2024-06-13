<template>
  <div class="bg-white border border-gray-300 rounded-md shadow-md">
    <div class="flex items-center p-4">
      <p class="font-bold">{{ album }}</p>
    </div>
    <div v-if="!fetched">
      <p>loading...</p>
    </div>
    <div v-else>
      <div class="aspect-square flex items-center justify-center">
        <img :src="image" alt="post_image" class="w-full" />
      </div>
    </div>
    <div class="p-4 flex items-center justify-start gap-x-2">
      <p v-for="tag in tags" class="font-bold">#{{ tag }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fetched: false,
      image: null,
    };
  },
  props: {
    id: Number,
    album: String,
    originalName: String,
    url: String,
    tags: Array,
  },
  methods: {
    async fetchImage() {
      this.image = `http://localhost:3000/api/getimage/${this.id}`;
      this.fetched = true;
    },
  },
  mounted() {
    this.fetchImage();
  },
};
</script>
