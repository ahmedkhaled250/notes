import joi from "joi";

export const signup = {
  body: joi
    .object()
    .required()
    .keys({
      name: joi.string().required(),
      email: joi.string().email().required(),
      password: joi
        .string()
        .pattern(
          new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        )
        .required(),
      cPassword: joi.string().valid(joi.ref("password")).required(),
      role: joi.string(),
      phone: joi.string(),
    }),
};
export const signin = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().email().required(),
      password: joi
        .string()
        .pattern(
          new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        )
        .required(),
    }),
};
