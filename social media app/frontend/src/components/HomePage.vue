<template>
  <div class="bg-gray-100 min-h-screen">
    <nav class="bg-white shadow-md py-4">
      <div class="container mx-auto px-4 flex justify-between items-center">
        <img src="/app_logo.svg" alt="app_logo" class="h-8" />
        <input
          type="text"
          placeholder="Search"
          class="bg-gray-200 rounded-full px-4 py-2"
        />
        <div class="flex space-x-4">
          <router-link to="/" class="text-gray-700 hover:text-black">
            Home
          </router-link>
          <router-link to="/profile" class="text-gray-700 hover:text-black">
            Profile
          </router-link>
          <router-link to="/explore" class="text-gray-700 hover:text-black">
            Explore
          </router-link>
        </div>
      </div>
    </nav>
    <div class="container mx-auto px-4 py-8">
      <PostFeed />
    </div>
  </div>
</template>

<script>
import PostFeed from "./PostFeed.vue";

export default {
  components: {
    PostFeed,
  },
};
</script>
