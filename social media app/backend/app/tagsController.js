import { tags } from "./model.js";

const tagsController = {
  getAllRawTags() {
    return tags.map((el) => el.tag);
  },
  getAllTags() {
    return tags;
  },
  getTag(id) {
    const data = tags.filter((el) => el.id == id);
    return data.length == 1 ? data[0] : null;
  },
  createNewTag(data) {
    const id = tags.length;
    const tag = data.tag;
    const popularity = data.popularity;
    tags.push({ id, tag, popularity });
  },
};

export default tagsController;
