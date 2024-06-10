import { tags } from "./model.js";

const tagsController = {
  getAllRawTags() {
    return tags.map((tag) => tag.name);
  },
  getAllTags() {
    return tags;
  },
  getTag(id) {
    const data = tags.filter((el) => el.id == id);
    return data.length == 1 ? data[0] : null;
  },
  createNewTag(tag) {
    const id = tags.length;
    const name = tag.name[0] === "#" ? tag.name : `#${tag.name}`;
    const popularity = tag.popularity;
    tags.push({ id, name, popularity });
  },
};

export default tagsController;
