<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
    <div
      class="bg-white border border-gray-300 p-8 rounded-md shadow-md w-full max-w-sm"
    >
      <div class="mb-8 px-12"><img src="/app_logo.svg" alt="app_logo" /></div>
      <h2 class="text-center text-gray-500 mt-8 mb-4">
        Sign up to see photos and videos from your friends.
      </h2>
      <form @submit.prevent="register" class="space-y-3">
        <input
          type="email"
          placeholder="Mobile Number or Email"
          v-model="email"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Full Name"
          v-model="fullName"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
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
          Sign up
        </button>
      </form>
      <p class="text-gray-500 text-sm mt-4">
        By signing up, you agree to our
        <a href="#" class="text-blue-500">Terms</a>,
        <a href="#" class="text-blue-500">Privacy Policy</a> and
        <a href="#" class="text-blue-500">Cookies Policy</a>.
      </p>
    </div>
    <div
      class="bg-white border border-gray-300 p-4 mt-4 text-center rounded-md shadow-md w-full max-w-sm"
    >
      <p>
        Have an account?
        <router-link to="/login" class="text-blue-500">Log in</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      fullName: "",
      username: "",
      password: "",
    };
  },
  methods: {
    register() {
      console.log(
        "Registering:",
        this.email,
        this.fullName,
        this.username,
        this.password
      );
    },
  },
};
</script>

<style scoped>
.font-logo {
  font-family: "Billabong", cursive;
}
</style>
