let photos = [];

// {
//   id: "id",
//   album: "album",
//   originalName: "originalName",
//   url: "url",
//   lastChange: "original",
//   history: [
//     {
//       status: "original",
//       lastModifiedDate: "lastModifiedDate",
//     },
//   ],
// },

const setPhotos = (value) => (photos = value);

export { setPhotos, photos };
