import * as yup from "yup";

export const createUserValidation = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required().min(8),
  phone: yup.string().nullable(),
});

export const getUserByIdValidation = yup.object({
  id: yup.number().required(),
});
