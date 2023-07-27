import joi from 'joi' 
export const updateProfile = {
    body: joi
      .object()
      .required()
      .keys({
        name: joi.string(),
        password: joi
          .string()
          .pattern(
            new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
          ),
        phone: joi.string(),
      }),
  }