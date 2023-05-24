import Joi from "@hapi/joi";

export const authSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),

  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),

  confPassword: Joi.ref("password"),
  access_token: [Joi.string(), Joi.number()],
});
