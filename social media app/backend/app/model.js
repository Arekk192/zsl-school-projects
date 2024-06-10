let photos = [];

// {
//   id: "id",
//   album: "album",
//   originalName: "originalName",
//   url: "url",
//   lastChange: "original",
//   tags: [],
//   history: [
//     {
//       status: "original",
//       lastModifiedDate: "lastModifiedDate",
//     },
//   ],
// },

const setPhotos = (value) => (photos = value);

let tags = [
  { id: 0, name: "#love", popularity: 38996 },
  { id: 1, name: "#instagood", popularity: 3225 },
  { id: 2, name: "#fashion", popularity: 75483 },
  { id: 3, name: "#instagram", popularity: 31139 },
  { id: 4, name: "#photooftheday", popularity: 90029 },
  { id: 5, name: "#art", popularity: 17962 },
  { id: 6, name: "#photography", popularity: 39691 },
  { id: 7, name: "#beautiful", popularity: 9798 },
  { id: 8, name: "#nature", popularity: 63859 },
  { id: 9, name: "#picoftheday", popularity: 96104 },
  { id: 10, name: "#travel", popularity: 20349 },
  { id: 11, name: "#happy", popularity: 78872 },
  { id: 12, name: "#cute", popularity: 7649 },
  { id: 13, name: "#instadaily", popularity: 92478 },
  { id: 14, name: "#style", popularity: 40146 },
  { id: 15, name: "#tbt", popularity: 4270 },
  { id: 16, name: "#repost", popularity: 67522 },
  { id: 17, name: "#followme", popularity: 1494 },
  { id: 18, name: "#summer", popularity: 26926 },
  { id: 19, name: "#reels", popularity: 82579 },
  { id: 20, name: "#like4like", popularity: 20223 },
  { id: 21, name: "#beauty", popularity: 15596 },
  { id: 22, name: "#fitness", popularity: 18268 },
  { id: 23, name: "#food", popularity: 59252 },
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
