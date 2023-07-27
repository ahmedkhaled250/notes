import userModel from "../../../../DB/model/user.model.js";
import cloudinary from "../../../service/cloudinary.js";
import bcrypt from "bcryptjs";
export const getProfile = async(req, res) => {
  const errMessage = req.flash("errMessage")[0];
  const users = await userModel.find(req.user._id).populate({
    path: 'notes'
  })
  res.render("profile", { users,errMessage });
};
export const profilePic = async (req, res) => {
  if (!req.file) {
    req.flash("errMessage", "please uploade your image");
    res.redirect("/api/v1/user/profile");
  } else {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      req.flash("errMessage", "In-valid user");
      res.redirect("/api/v1/auth/signin");
    } else {
      const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
        folder: `EJS/${user._id}/profilePic`,
      });
      await userModel.updateOne({ _id: user._id }, { profilePic: secure_url });
      res.redirect("/api/v1/user/profile");
    }
  }
};
export const deleteAccount = async (req, res) => {
  const user = await userModel.findById(req.user._id);
  if (!user) {
    req.flash("errMessage", "In-valid user");
    res.redirect("/api/v1/auth/signin");
  } else {
    await userModel.deleteOne({ _id: user._id });
    res.redirect("/api/v1/auth/signUp");
  }
};
export const getUpdateProfile = async(req, res) => {
  const errMessage = req.flash("errMessage")[0];
  const oldInput = req.flash("oldInput")[0];
  const user = await userModel.findById(req.user._id)
  res.render("updateProfile", { user,errMessage, oldInput });
};
export const updateProfile = async (req, res) => {
  const { name, password, phone } = req.body;
    let updateUser;
    if (password) {
      const hash = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));
      updateUser = await userModel.updateOne(
        { _id: req.user._id },
        { name, password: hash, phone },
      );
    }else{
      updateUser = await userModel.updateOne(
        { _id: req.user._id },
        { name,phone },
      );
    }
    if (updateUser) {
      res.redirect("/api/v1/user/profile");
    } else {
      req.flash("errMessage", "Fail to update your Profile");
      req.flash("oldInput", req.body);
      res.redirect("/api/v1/user/getUpdateProfile");
    }
};
