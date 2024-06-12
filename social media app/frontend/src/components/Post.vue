<template>
  <div class="bg-white border border-gray-300 rounded-md shadow-md">
    <div class="flex items-center p-4">
      <img :src="userImage" alt="user_image" class="h-10 w-10 rounded-full" />
      <div class="ml-4">
        <p class="font-bold">{{ username }}</p>
      </div>
    </div>
    <img :src="image" alt="post_image" class="w-full" />
    <div class="p-4">
      <p>
        <span class="font-bold">{{ username }}</span> {{ caption }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    username: String,
    userImage: String,
    image: String,
    caption: String,
  },
};
</script>
