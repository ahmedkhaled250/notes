import { roles } from "../../middleWear/auth.js";

export const endPoint = {
  addNote: [roles.Admin, roles.User],
};
