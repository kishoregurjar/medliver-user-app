import * as yup from "yup";

const FORM_VALIDATIONS = {
  SIGN_UP: yup.object().shape({
    fullName: yup.string().required("Full Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    password: yup.string()
      .min(6, "Min 6 characters")
      .required("Password is required"),
    confirmPassword: yup.string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm your password"),
    agree: yup.boolean().oneOf([true], "You must agree to the terms"),
  }),
  LOGIN: yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  }),
  FORGOT_PASSWORD: yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
  }),
  RESET_PASSWORD: yup.object().shape({
    newPassword: yup.string()
      .min(6, "Minimum 6 characters")
      .required("New password is required"),
    confirmPassword: yup.string()
      .oneOf([yup.ref("newPassword")], "Passwords must match")
      .required("Please confirm your password"),
  }),
  INSURANCE_SUBMIT_ENQUIRY: yup.object().shape({
    full_name: yup.string().required("Full name is required"),
    phone_number: yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    lead_type: yup.string().required("Lead type is required"),
    age: yup.number()
      .typeError("Age must be a number")
      .required("Age is required")
      .positive("Age must be positive")
      .integer("Age must be an integer"),
    gender: yup.string().required("Gender is required"),
    coverage_for: yup.string().required("Coverage selection is required"),
    family_member_count: yup.number()
      .transform((value, originalValue) =>
        String(originalValue).trim() === "" ? undefined : value
      )
      .nullable()
      .when("coverage_for", {
        is: "family",
        then: (schema) =>
          schema
            .typeError("Family member count must be a number")
            .required("Family member count is required")
            .min(1, "At least one family member required"),
        otherwise: (schema) => schema.notRequired(),
      }),

    income: yup.number()
      .typeError("Income must be a number")
      .required("Income is required"),
    nominee_name: yup.string().required("Nominee name is required"),
    nominee_relation: yup.string().required("Nominee relation is required"),
    lead_source: yup.string().required("Lead source is required"),
  }),
  BOOK_APPOINTMENT_DOCTOR: yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    address: yup.string().required("Address is required"),
    phone: yup
      .string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    disease: yup.string().required("Disease details are required"),
    confirmation: yup.boolean().oneOf([true], "You must confirm the information"),
  }),
};

export default FORM_VALIDATIONS;
