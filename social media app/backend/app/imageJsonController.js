import { photos, setPhotos } from "./model.js";

// 200 - GET OK
// 201 - POST OK
// 202 - DELETE OK

const jsonController = {
  getAllPhotos() {
    return photos;
  },
  getPhoto(id) {
    const photo = photos.filter((el) => el.id == id);
    return photo.length === 1 ? photo[0] : null;
  },
  uploadPhoto(photo) {
    photos.push(photo);
  },
  deletePhoto(id) {
    setPhotos(photos.filter((el) => el.id != id));
  },
  addTagToPhoto(id, tag) {
    const tags = this.getPhoto(id).tags;
    tags.push(tag);
    setPhotos(photos.map((el) => (el.id === id ? { ...el, tags } : el)));
  },
  getPhotoTags(photo) {
    return photo.tags;
  },
  updatePhotoHistory(id, filter) {
    const timestamp = Date.now();
    const photo = this.getPhoto(id);
    photo.lastChange = timestamp;
    photo.history.push({ filter, timestamp });
  },
};

export default jsonController;
