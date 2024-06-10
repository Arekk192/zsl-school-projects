import axios from "axios";
import { createStore } from "vuex";

const state = {};

const getters = {
  GET_PHOTOS(state) {
    return state.photos;
  },
  GET_TAGS(state) {
    return state.tags;
  },
};

const actions = {
  async GET_PHOTOS_ACTION({ commit }) {
    try {
      const response = await axios.get("http://localhost:3000/api/photos");
      console.log("response.data", response.data);
      commit("SET_PHOTOS", response.data);
    } catch (error) {
      console.error("error: " + error);
    }
  },
  async GET_TAGS_ACTION({ commit }) {
    try {
      const response = await axios.get("http://localhost:3000/api/tags");
      console.log("response.data", response.data);
      commit("SET_TAGS", response.data);
    } catch (error) {
      console.error("error: " + error);
    }
  },
};

const mutations = {
  SET_PHOTOS(state, photos) {
    state.photos = photos;
  },
  SET_TAGS(state, tags) {
    state.tags = tags;
  },
};

export default createStore({ state, getters, actions, mutations });
