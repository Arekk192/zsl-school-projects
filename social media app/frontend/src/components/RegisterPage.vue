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
          placeholder="Email Address"
          v-model="email"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="First Name"
          v-model="name"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Surname"
          v-model="lastName"
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

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"
    >
      <div class="bg-white p-8 rounded-md shadow-md max-w-lg mx-auto min-w-80">
        <div v-if="registerSuccess">
          <h3 class="text-xl font-semibold mb-4">Registration Successful!</h3>
          <p>
            Your account has been created. Please confirm your email by clicking
            the link below:
          </p>
          <a
            :href="confirmUrl"
            class="w-full text-wrap text-blue-500 mt-4 block"
            target="_blank"
            >Confirm registration</a
          >
          <button
            @click="showModal = false"
            class="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
          >
            Close
          </button>
        </div>
        <div v-else="registerSuccess">
          <h3 class="text-xl font-semibold mb-4">Registration Failed!</h3>
          <p>{{ registerError }}</p>
          <button
            @click="showModal = false"
            class="bg-blue-500 text-white px-4 py-2 rounded-md mt-6"
          >
            Close
          </button>
        </div>
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
      name: "",
      lastName: "",
      password: "",
      showModal: false,
      confirmUrl: "",
      registerSuccess: false,
      registerError: "",
    };
  },
  methods: {
    async register() {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/user/register",
          {
            email: this.email,
            name: this.name,
            lastName: this.lastName,
            password: this.password,
          }
        );

        const token = response.data.token;
        this.confirmUrl = `http://localhost:3000/api/user/confirm/${token}`;
        this.showModal = true;
        this.registerSuccess = true;
      } catch (error) {
        // console.error("Error during registration:", error.response.data);

        this.showModal = true;
        this.registerSuccess = false;
        this.registerError = error.response.data.error;
      }
    },
  },
};
</script>
