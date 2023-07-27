import { roles } from "../../middleWear/auth.js";

export const endPoint = {
  logOut: [roles.Admin, roles.Hr, roles.User],
};
