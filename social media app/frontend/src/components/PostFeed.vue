<template>
  <div class="space-y-8">
    <Post
      v-for="post in GET_PHOTOS"
      :key="post.id"
      :id="post.id"
      :album="post.album"
      :originalName="post.originalName"
      :url="post.url"
      :tags="post.tags"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex/dist/vuex.cjs.js";
import Post from "./Post.vue";

export default {
  components: { Post },
  data() {
    return {
      posts: [
        // {
        //   id: 1,
        //   username: "user1",
        //   userImage: "https://via.placeholder.com/150",
        //   image: "https://via.placeholder.com/500",
        // },
        // {
        //   id: 2,
        //   username: "user2",
        //   userImage: "https://via.placeholder.com/150",
        //   image: "https://via.placeholder.com/500",
        // },
      ],
    };
  },
  methods: { ...mapActions(["GET_PHOTOS_ACTION"]) },
  computed: { ...mapGetters(["GET_PHOTOS", "GET_TAGS"]) },
  mounted() {
    this.$store.dispatch("GET_PHOTOS_ACTION");
  },
};
</script>
