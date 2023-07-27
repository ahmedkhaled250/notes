import { Router } from "express";
import { auth } from "../../middleWear/auth.js";
import { validation } from "../../middleWear/validation.js";
import * as validators from "./auth.validation.js";
import { endPoint } from "./auth.endPoint.js";
import * as RC from "./controller/register.js";
const router = Router();
router.get("/signup", RC.getSignUp);
router.post(
  "/signup",
  validation(validators.signup),
  RC.signUp
);
router.get("/confirmemail/:token", RC.confirmEmail);
router.get("/Refreshtoken/:token", RC.RefreshToken);
router.get("/signin", RC.getSignIn);
router.post(
  "/signin",
  validation(validators.signin, "/auth/signin"),
  RC.signIn
);
router.get("/logout", auth(endPoint.logOut), RC.logOut);
export default router;
