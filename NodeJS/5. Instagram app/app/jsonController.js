import photos from "./model.js";

// 200 - GET OK
// 201 - POST OK
// 202 - DELETE OK

const jsonController = {
  getall() {
    return photos;
  },
  get(id) {
    const photo = photos.filter((el) => el.id == id);
    return photo.length === 1
      ? { status: 200, ...photo[0] }
      : { status: 404, message: `photo with id ${id} not found` };
  },
  upload(file) {
    // TODO change that generating id method
    const id = Date.now();
    photos.push({
      status: 200,
      id: id,
      album: "album",
      originalName: "input.jpg",
      url: "",
      lastChange: "original",
      history: [{ status: "original", timestamp: id }],
    });
  },
};

export default jsonController;
