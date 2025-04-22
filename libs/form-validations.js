import * as Yup from "yup";

const FORM_VALIDATIONS = {
  SIGN_UP: Yup.object().shape({
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    password: Yup.string()
      .min(6, "Min 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm your password"),
    agree: Yup.boolean().oneOf([true], "You must agree to the terms"),
  }),
  LOGIN: Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  }),
  FORGOT_PASSWORD: Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  }),
};

export default FORM_VALIDATIONS;
