<template>
  <div class="bg-white border border-gray-300 rounded-md shadow-md">
    <div class="flex items-center p-4">
      <p class="font-bold">{{ album }}</p>
    </div>
    <div v-if="!fetched">
      <p>jeszcze sie laduje</p>
    </div>
    <div v-else>
      <img :src="image" alt="post_image" class="w-full" />
    </div>
    <div class="p-4">
      <p class="font-bold">{{ album }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
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
      const getimage = `http://localhost:3000/api/getimage/${this.id}`;
      const response = await axios.get(getimage);

      this.image = `data:image/jpeg;base64,${decodeURI(response.data)}`;
      this.fetched = true;
    },
  },
  mounted() {
    this.fetchImage();
  },
};
</script>
