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

let tags = [
  "#love",
  "#instagood",
  "#fashion",
  "#instagram",
  "#photooftheday",
  "#art",
  "#photography",
  "#beautiful",
  "#nature",
  "#picoftheday",
  "#travel",
  "#happy",
  "#cute",
  "#instadaily",
  "#style",
  "#tbt",
  "#repost",
  "#followme",
  "#summer",
  "#reels",
  "#like4like",
  "#beauty",
  "#fitness",
  "#food",
];

// tags json
// [
//     "#love",
//     "#instagood",
//     "#fashion",
//     ...
//     ...
// ]

export { setPhotos, photos, tags };
