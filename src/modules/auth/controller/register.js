import userModel from "../../../../DB/model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../../../service/sendEmail.js";
export const getSignUp = (req, res) => {
  const errMessage = req.flash("errMessage")[0];
  const oldInput = req.flash("oldInput")[0];
  console.log(oldInput);
  const validationErr = req.flash("validationErr");
  res.render("signUp", { errMessage, oldInput, validationErr });
};
export const signUp = async (req, res) => {
  const { name, email, password, phone } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    // res.render("signUp", { errMessage: "Email exist" });
    req.flash("errMessage", "Email exist");
    req.flash("oldInput", req.body);
    res.redirect("/api/v1/auth/signUp");
  } else {
    const hash = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));
    const savedUser = await userModel.create({
      name,
      email,
      password: hash,
      phone,
    });
    const token = jwt.sign({ id: savedUser._id }, process.env.emailToken, {
      expiresIn: "1h",
    });
    const tokenRefresh = jwt.sign(
      { id: savedUser._id },
      process.env.emailToken
    );
    const link1 = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmemail/${token}`;
    const link2 = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/Refreshtoken/${tokenRefresh}`;
    const message = `
    <a href="${link1}">Confirm email</a>
    <br>
    <a href="${link2}">Refresh your email</a>
    `;
    await sendEmail(savedUser.email, "Confirm email", message);
    res.redirect("/api/v1/auth/signin");
  }
};
export const confirmEmail = async (req, res) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.emailToken);
  if (!decoded?.id) {
    res.redirect("/api/v1/auth/signup");
  } else {
    const user = await userModel.updateOne(
      { _id: decoded.id, confirmEmail: false },
      { confirmEmail: true }
    );
    user?.modifiedCount
      ? res.redirect("/api/v1/auth/signin")
      : res.redirect("/api/v1/auth/signup");
  }
};
export const RefreshToken = async (req, res) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.emailToken);
  if (!decoded?.id) {
    res.redirect("/api/v1/auth/signUp");
  } else {
    const user = await userModel.findById(decoded.id);
    if (user.confirmEmail) {
      res.redirect("/api/v1/auth/signin");
    } else {
      const token = jwt.sign({ id: user._id }, process.env.emailToken,{expiresIn:60*5});
      const link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmemail/${token}`;
      const message = `
        <a href="${link}">Confirm email</a>
        `;
      await sendEmail(user.email, "confirm email", message);
      res.redirect("/api/v1/auth/signin");
    }
  }
};
export const getSignIn = (req, res) => {
  const errMessage = req.flash("errMessage")[0];
  const oldInput = req.flash("oldInput")[0];
  const validationErr = req.flash("validationErr");
  res.render("signin", { errMessage, oldInput, validationErr });
};
export const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    // res.render("signin", { errMessage: "Email not exist" });
    req.flash("errMessage", "Email not exist");
    req.flash("oldInput", req.body);
    res.redirect("/api/v1/auth/signin");
  } else {
    if (!user.confirmEmail) {
      //   res.render("signin", { errMessage: "Please confirm your email" });
      req.flash("errMessage", "Please confirm your email");
      req.flash("oldInput", req.body);
      res.redirect("/api/v1/auth/signin");
    } else {
      const compare = bcrypt.compareSync(password, user.password);
      if (!compare) {
        // res.render("signin", { errMessage: "Fail to password" });
        req.flash("errMessage", "In-valid password");
        req.flash("oldInput", req.body);
        res.redirect("/api/v1/auth/signin");
      } else {
        req.session.user = {
          _id: user._id,
        };
        res.redirect("/api/v1/user/profile");
      }
    }
  }
};
export const logOut = async (req, res) => {
  req.session.destroy();
  res.redirect("/api/v1/auth/signin");
};
