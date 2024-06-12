// import { photos, setPhotos } from "./model.js";
import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { setUsers, users } from "./model.js";

// 200 - GET OK
// 201 - POST OK
// 202 - DELETE OK

const { sign, verify, decode } = jsonwebtoken;
const { compare, hash } = bcryptjs;

const getUserById = (id) => {
  const usersArr = users.filter((user) => user.id == id);
  return usersArr.length ? usersArr[0] : null;
};

const userController = {
  register: async (data) => {
    if (data.name && data.lastName && data.email && data.password) {
      const id = Date.now();
      const token = sign({ id }, process.env.SECRET_KEY, { expiresIn: "1h" });
      const notConfirmedUsers = [];
      let userExist = false;

      users.forEach((user) => {
        if (user.email == data.email)
          user.confirmed ? (userExist = true) : notConfirmedUsers.push(user);
      });

      if (notConfirmedUsers.length) {
        const ids = notConfirmedUsers.map((el) => el.id);
        setUsers(users.filter((user) => !ids.includes(user.id)));
      }

      if (!userExist) {
        try {
          const key = parseInt(process.env.ENCRYPTION_KEY);
          const password = await hash(data.password, key);
          users.push({ id, ...data, confirmed: false, password });

          return { token };
        } catch (error) {
          console.log(error);
          return { error };
        }
      } else return { error: `user with email ${data.email} already exist` };
    } else return { error: `missing data` };
  },

  confirmUser: async (token) => {
    let error = "";
    let message = "";

    try {
      let decoded = verify(token, process.env.SECRET_KEY);

      if (decoded.exp < Date.now()) {
        let userToConfirm = getUserById(decoded.id);
        if (userToConfirm) {
          setUsers(
            users.map((user) => {
              if (user.id == decoded.id)
                !user.confirmed
                  ? (user.confirmed = true)
                  : (error = `user ${user.id} have been comfirmed`);

              return user;
            })
          );
          message = `user ${userToConfirm.id} confirmed`;
        } else error = `user with id ${decoded.id} not exist`;
      } else error = "token expired";
    } catch (err) {
      error = err.message;
    }

    return error ? { error } : { message };
  },

  login(data) {},
};

export default userController;
