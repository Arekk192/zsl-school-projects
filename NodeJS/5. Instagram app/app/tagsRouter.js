import { tags } from "./model";

// GET /api/tags/raw
// - pobranie wszystkich tagów bez konwersji na obiekty
//
// GET /api/tags
// - pobranie wszystkich tagów z konwersją na obiekty
//
// GET /api/tags/1
// - pobranie jednego taga
//
// POST /api/tags
// - utworzenie nowego taga
//
// -------
// PATCH /api/photos/tags
// - aktualizacja danych zdjęcia o nowy tag
//
// PATCH /api/photos/tags/mass
// - aktualizacja danych zdjęcia o tablicę nowych tag-ów
//
// GET /api/photos/tags/12345
// - pobranie tagów danego zdjęcia

const tagsRouter = async (req, res) => {
  if (req.method === "GET" && req.url === "/api/tags") {
  } else if (req.method === "GET" && req.url.match(/\/api\/tags\/([0-9]+)/)) {
  } else if (req.method === "POST" && req.url === "/api/tags") {
  } else if (
    req.method === "DELETE" &&
    req.url.match(/\/api\/tags\/([0-9]+)/)
  ) {
  }
};
