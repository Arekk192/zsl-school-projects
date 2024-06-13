<template>
  <div class="bg-gray-100 min-h-screen">
    <nav class="bg-white shadow-md py-4">
      <div class="container mx-auto px-4 flex justify-start items-center">
        <img src="/app_logo.svg" alt="app_logo" class="h-8" />
      </div>
    </nav>
    <div class="container mx-auto px-4 py-8 flex">
      <!-- Sidebar -->
      <aside class="w-1/4 bg-white shadow-md rounded-md p-4">
        <div class="flex flex-col space-y-4">
          <button
            @click="openNewPostOverlay"
            class="bg-blue-500 text-white text-center py-2 rounded-md hover:bg-blue-600"
          >
            Add New Post
          </button>
        </div>
      </aside>
      <!-- Main Content -->
      <main class="w-3/4 ml-4">
        <PostFeed />
      </main>
    </div>

    <!-- New Post Overlay -->
    <div
      v-if="showNewPostOverlay"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
    >
      <div
        class="w-[732px] h-[640px] bg-white max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg"
      >
        <div v-if="currentStep === 1">
          <div class="flex justify-between items-center p-2 border-b">
            <div class="px-4 py-2 opacity-0">Next</div>
            <h3 class="text-lg font-semibold">{{ getOverlayTitle }}</h3>
            <button
              @click="nextStep"
              class="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Next
            </button>
          </div>
          <div class="flex flex-col items-center p-4">
            <input type="file" @change="onFileChange" class="mb-4" />
          </div>
        </div>
        <div v-else-if="currentStep === 2">
          <div class="flex justify-between items-center p-2 border-b">
            <button
              @click="prevStep"
              class="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Back
            </button>
            <h3 class="text-lg font-semibold">{{ getOverlayTitle }}</h3>
            <button
              @click="nextStep"
              class="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Next
            </button>
          </div>

          <div class="p-4">
            <h4 class="mb-4">Crop Image (Placeholder)</h4>
          </div>
        </div>
        <div v-else-if="currentStep === 3">
          <div class="flex justify-between items-center p-2 border-b">
            <button
              @click="prevStep"
              class="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Back
            </button>
            <h3 class="text-lg font-semibold">{{ getOverlayTitle }}</h3>
            <button
              @click="nextStep"
              class="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Next
            </button>
          </div>
          <div>
            <div class="grid grid-rows-3 grid-cols-3">
              <div
                class="relative"
                @click="setFilter({ r: 137, g: 233, b: 172 })"
              >
                <div
                  class="bg-green-400 opacity-65 absolute w-full h-full"
                ></div>
                <img :src="selectedFileUrl" alt="filtered_image" />
              </div>
              <div
                class="relative"
                @click="setFilter({ r: 151, g: 196, b: 252 })"
              >
                <div
                  class="bg-blue-400 opacity-65 absolute w-full h-full"
                ></div>
                <img :src="selectedFileUrl" alt="filtered_image" />
              </div>
              <div
                class="relative"
                @click="setFilter({ r: 250, g: 163, b: 163 })"
              >
                <div class="bg-red-400 opacity-65 absolute w-full h-full"></div>
                <img :src="selectedFileUrl" alt="filtered_image" />
              </div>
              <div
                class="relative"
                @click="setFilter({ r: 252, g: 184, b: 128 })"
              >
                <div
                  class="bg-orange-400 opacity-65 absolute w-full h-full"
                ></div>
                <img :src="selectedFileUrl" alt="filtered_image" />
              </div>
              <div
                class="relative"
                @click="setFilter({ r: 252, g: 222, b: 103 })"
              >
                <div
                  class="bg-yellow-400 opacity-65 absolute w-full h-full"
                ></div>
                <img :src="selectedFileUrl" alt="filtered_image" />
              </div>
              <div
                class="relative"
                @click="setFilter({ r: 248, g: 163, b: 207 })"
              >
                <div
                  class="bg-pink-400 opacity-65 absolute w-full h-full"
                ></div>
                <img :src="selectedFileUrl" alt="filtered_image" />
              </div>
              <div
                class="relative"
                @click="setFilter({ r: 198, g: 179, b: 252 })"
              >
                <div
                  class="bg-violet-400 opacity-65 absolute w-full h-full"
                ></div>
                <img :src="selectedFileUrl" alt="filtered_image" />
              </div>
              <div
                class="relative"
                @click="setFilter({ r: 252, g: 213, b: 112 })"
              >
                <div
                  class="bg-amber-400 opacity-65 absolute w-full h-full"
                ></div>
                <img :src="selectedFileUrl" alt="filtered_image" />
              </div>
              <div
                class="relative"
                @click="setFilter({ r: 240, g: 168, b: 251 })"
              >
                <div
                  class="bg-fuchsia-400 opacity-65 absolute w-full h-full"
                ></div>
                <img :src="selectedFileUrl" alt="filtered_image" />
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="currentStep === 4">
          <div class="flex justify-between items-center p-2 border-b">
            <button
              @click="prevStep"
              class="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Back
            </button>
            <h3 class="text-lg font-semibold">{{ getOverlayTitle }}</h3>
            <button
              @click="publishPost"
              class="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Publish
            </button>
          </div>
          <div class="h-[584px] overflow-scroll py-4">
            <div>
              <p
                v-for="tag in GET_TAGS"
                :key="tag.id"
                class="select-none"
                :class="{
                  ['font-bold text-green-600']: tags.includes(tag.tag),
                }"
                @click="modifyTag(tag.tag)"
              >
                {{ `#${tag.tag}` }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions, mapGetters } from "vuex/dist/vuex.cjs.js";
import PostFeed from "./PostFeed.vue";

export default {
  components: { PostFeed },
  data() {
    return {
      showNewPostOverlay: false,
      currentStep: 1,
      selectedFile: null,
      selectedFileUrl: "",
      tags: [],
      filter: {},
    };
  },
  methods: {
    openNewPostOverlay() {
      this.showNewPostOverlay = true;
    },
    closeNewPostOverlay() {
      this.showNewPostOverlay = false;
      this.currentStep = 1;
      this.selectedFile = null;
      this.selectedFileUrl = "";
      this.tags = [];
      this.filter = {};
    },
    nextStep() {
      if (this.currentStep < 4) this.currentStep++;
    },
    prevStep() {
      if (this.currentStep > 1) this.currentStep--;
    },
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
      this.selectedFileUrl = URL.createObjectURL(event.target.files[0]);
    },
    modifyTag(tag) {
      const index = this.tags.indexOf(tag);
      index === -1 ? this.tags.push(tag) : this.tags.splice(index, 1);
    },
    setFilter(filter) {
      this.filter = filter;
    },
    async publishPost() {
      const formData = new FormData();
      formData.append("file", this.selectedFile);
      formData.append("album", "user");

      try {
        const url = "http://localhost:3000/api/photos";
        const response = await axios.post(url, formData);

        this.tags.forEach((tag) => {
          const data = { ["photo_id"]: response.data.id, tag };
          axios.patch("http://localhost:3000/api/photos/tags", data);
        });

        if (this.filter) {
          axios.patch("http://localhost:3000/api/filters", {
            photo_id: await response.data.id,
            filter: "tint",
            tint: this.filter,
          });
        }
      } catch (error) {
        console.error(error);
      }
      this.closeNewPostOverlay();
    },
    ...mapActions(["GET_TAGS_ACTION"]),
  },
  computed: {
    getOverlayTitle() {
      switch (this.currentStep) {
        case 1:
          return "Upload Photo";
        case 2:
          return "Crop Image";
        case 3:
          return "Add Filters";
        case 4:
          return "Tag Photo";
        default:
          return "";
      }
    },
    ...mapGetters(["GET_PHOTOS", "GET_TAGS"]),
  },
  mounted() {
    this.$store.dispatch("GET_TAGS_ACTION");
  },
};
</script>
