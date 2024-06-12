// import { photos, setPhotos } from "./model.js";
import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { users } from "./model.js";

// 200 - GET OK
// 201 - POST OK
// 202 - DELETE OK

const { sign, verify } = jsonwebtoken;
const { compare, hash } = bcryptjs;

const createToken = (data) => {
  return sign({ data }, process.env.SECRET_KEY, { expiresIn: "1h" });
};

// const processToken = () => {
//   createToken();
//   verifyToken(
//     "CI6IkpXVCJ9.eHAiOjE2NTIyMDcyNDZ9.UFylfhywQgHeT20p-Q2DSHMrHhprGkEiH9k4lWYrYEQ"
//   );
// };

// processToken();

// const decryptPass = async (userpass, encrypted) => {
//   let decrypted = await compare(userpass, encrypted);
//   console.log(decrypted);
// };

// await decryptPass(
//   pass,
//   "$2a$10$9vVN9nX3Os1off9hCAV24eW0T/C.NwL1FooOyLjU9BbDO/w1jBAxy"
// );

const userController = {
  encryptPassword: async (password) =>
    await hash(password, process.env.ENCRYPTION_KEY),
  comparePassword: async (password, encryptPassword) =>
    await compare(password, encryptPassword),
  register(data) {
    // czy wszystkie dane sa wpisane

    const id = Date.now();
    const token = createToken(id);

    users.push({
      id,
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      confirmed: false,
      password: data.password,
    });

    return token;
  },

  verifyToken(token) {
    const data = verify(token, process.env.SECRET_KEY);
    console.log(data);
    return data;
  },
};

export default userController;
