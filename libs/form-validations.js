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
  RESET_PASSWORD: Yup.object().shape({
    newPassword: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Please confirm your password"),
  }),
  INSURANCE_SUBMIT_ENQUIRY: Yup.object().shape({
    full_name: Yup.string().required("Full name is required"),
    phone_number: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    lead_type: Yup.string().required("Lead type is required"),
    age: Yup.number()
      .typeError("Age must be a number")
      .required("Age is required")
      .positive("Age must be positive")
      .integer("Age must be an integer"),
    gender: Yup.string().required("Gender is required"),
    coverage_for: Yup.string().required("Coverage selection is required"),
    family_member_count: Yup.number()
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

    income: Yup.number()
      .typeError("Income must be a number")
      .required("Income is required"),
    nominee_name: Yup.string().required("Nominee name is required"),
    nominee_relation: Yup.string().required("Nominee relation is required"),
    lead_source: Yup.string().required("Lead source is required"),
  }),
};

export default FORM_VALIDATIONS;
