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
};

export default jsonController;
