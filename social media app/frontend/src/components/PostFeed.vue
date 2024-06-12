<template>
  <div class="space-y-8">
    <Post
      v-for="post in posts"
      :key="post.id"
      :username="post.username"
      :userImage="post.userImage"
      :image="post.image"
      :caption="post.caption"
    />
  </div>
</template>

<script>
import Post from "./Post.vue";

export default {
  components: {
    Post,
  },
  data() {
    return {
      posts: [
        {
          id: 1,
          username: "user1",
          userImage: "https://via.placeholder.com/150",
          image: "https://via.placeholder.com/500",
          caption: "Beautiful day!",
        },
        {
          id: 2,
          username: "user2",
          userImage: "https://via.placeholder.com/150",
          image: "https://via.placeholder.com/500",
          caption: "Enjoying the sunset",
        },
      ],
    };
  },
};
</script>
