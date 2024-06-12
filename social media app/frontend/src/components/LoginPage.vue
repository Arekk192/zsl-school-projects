<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
    <div
      class="bg-white border border-gray-300 p-8 rounded-md shadow-md w-full max-w-sm"
    >
      <div class="mb-8 px-12"><img src="/app_logo.svg" alt="app_logo" /></div>
      <form @submit.prevent="login" class="space-y-3">
        <input
          type="text"
          placeholder="Username"
          v-model="username"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          v-model="password"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          class="bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-600"
        >
          Log in
        </button>
      </form>
      <div class="flex items-center my-4">
        <div class="flex-grow border-t border-gray-300"></div>
      </div>
      <a href="#" class="text-blue-500 text-sm block text-center mt-4"
        >Forgot password?</a
      >
    </div>
    <div
      class="bg-white border border-gray-300 p-4 mt-4 text-center rounded-md shadow-md w-full max-w-sm"
    >
      <p>
        Don't have an account?
        <router-link to="/register" class="text-blue-500">Sign up</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    login() {
      console.log("Logging in:", this.username, this.password);
    },
  },
};
</script>

<style scoped>
.font-logo {
  font-family: "Billabong", cursive;
}
</style>
