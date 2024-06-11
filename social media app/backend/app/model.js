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
//       filter: "original",
//       lastModifiedDate: "lastModifiedDate",
//     },
//   ],
// },

const setPhotos = (value) => (photos = value);

let tags = [
  { id: 0, tag: "love", popularity: 38996 },
  { id: 1, tag: "instagood", popularity: 3225 },
  { id: 2, tag: "fashion", popularity: 75483 },
  { id: 3, tag: "instagram", popularity: 31139 },
  { id: 4, tag: "photooftheday", popularity: 90029 },
  { id: 5, tag: "art", popularity: 17962 },
  { id: 6, tag: "photography", popularity: 39691 },
  { id: 7, tag: "beautiful", popularity: 9798 },
  { id: 8, tag: "nature", popularity: 63859 },
  { id: 9, tag: "picoftheday", popularity: 96104 },
  { id: 10, tag: "travel", popularity: 20349 },
  { id: 11, tag: "happy", popularity: 78872 },
  { id: 12, tag: "cute", popularity: 7649 },
  { id: 13, tag: "instadaily", popularity: 92478 },
  { id: 14, tag: "style", popularity: 40146 },
  { id: 15, tag: "tbt", popularity: 4270 },
  { id: 16, tag: "repost", popularity: 67522 },
  { id: 17, tag: "followme", popularity: 1494 },
  { id: 18, tag: "summer", popularity: 26926 },
  { id: 19, tag: "reels", popularity: 82579 },
  { id: 20, tag: "like4like", popularity: 20223 },
  { id: 21, tag: "beauty", popularity: 15596 },
  { id: 22, tag: "fitness", popularity: 18268 },
  { id: 23, tag: "food", popularity: 59252 },
];

export { setPhotos, photos, tags };
