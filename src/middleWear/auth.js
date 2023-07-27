import userModel from "../../DB/model/user.model.js";
export const roles = {
  Admin: "Admin",
  Hr: "Hr",
  User: "User",
};
export const auth = (accessRoles = []) => {
  return async (req, res, next) => {
    if (!req?.session?.user) {
        req.flash("errMessage","not login user")
        res.redirect("/api/v1/auth/signin");
    } else {
        const user = await userModel
        .findById(req.session.user._id)
        .select("name email profilePic role");
        if (!user) {
          req.flash("errMessage","In-valid user")
          res.redirect("/api/v1/auth/signup");
        } else {
            if (accessRoles.includes(user.role)) {
                req.user = user;
                next();
            } else {
            req.flash("errMessage","Not authorised")
            res.redirect("/api/v1/auth/signin");
        }
      }
    }
  };
};
