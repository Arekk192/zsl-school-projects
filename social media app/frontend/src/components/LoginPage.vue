<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
    <div
      class="bg-white border border-gray-300 p-8 rounded-md shadow-md w-full max-w-sm"
    >
      <div class="mb-8 px-12"><img src="/app_logo.svg" alt="app_logo" /></div>
      <form @submit.prevent="login" class="space-y-3">
        <input
          type="text"
          placeholder="Email Address"
          v-model="email"
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
  <div
    v-if="showModal"
    class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"
  >
    <div class="bg-white p-8 rounded-md shadow-md max-w-lg mx-auto min-w-80">
      <div v-if="loginSuccess">
        <h3 class="text-xl font-semibold mb-4">Login Successful!</h3>
        <p>
          Your account has been created. Please confirm your email by clicking
          the link below:
        </p>
        <button
          @click="showModal = false"
          class="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
        >
          Close
        </button>
      </div>
      <div v-else="loginSuccess">
        <h3 class="text-xl font-semibold mb-4">Login Failed!</h3>
        <p class="first-letter:capitalize">{{ loginError }}</p>
        <button
          @click="showModal = false"
          class="bg-blue-500 text-white px-4 py-2 rounded-md mt-6"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      password: "",
      showModal: false,
      loginSuccess: false,
      loginError: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/user/login",
          { email: this.email, password: this.password }
        );

        console.log(response.data);

        if (response.data.token) this.$router.push("Home");
      } catch (error) {
        // console.error("Error during logging in:", error.response.data);

        this.showModal = true;
        this.loginSuccess = false;
        this.loginError = error.response.data.error;
      }
      console.log("Logging in:", this.email, this.password);
    },
  },
};
</script>
