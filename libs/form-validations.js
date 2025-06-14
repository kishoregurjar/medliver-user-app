import * as yup from "yup";

const FORM_VALIDATIONS = {
  SIGN_UP: yup.object().shape({
    fullName: yup.string().required("Full Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: yup
      .string()
      .matches(
        /^[6-9]\d{9}$/,
        "Phone number must be a valid 10-digit Indian number"
      )
      .required("Phone number is required"),
    password: yup
      .string()
      .min(6, "Min 6 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm your password"),
    agree: yup
      .boolean()
      .oneOf([true], "You must agree to the terms and conditions"),
  }),
  LOGIN: yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  }),
  FORGOT_PASSWORD: yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
  }),
  RESET_PASSWORD: yup.object().shape({
    newPassword: yup
      .string()
      .min(6, "Minimum 6 characters")
      .required("New password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], "Passwords must match")
      .required("Please confirm your password"),
  }),
  CHANGE_PASSWORD: yup.object().shape({
    oldPassword: yup.string().required("Old password is required"),
    newPassword: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], "Passwords do not match")
      .required("Please confirm your new password"),
  }),
  EDIT_PROFILE: yup.object().shape({
    fullName: yup.string().required("Full name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: yup
      .string()
      .matches(
        /^[6-9]\d{9}$/,
        "Phone number must be a valid 10-digit Indian number"
      )
      .required("Phone number is required"),
    height: yup
      .number()
      .transform((value, originalValue) =>
        String(originalValue).trim() === "" ? null : Number(originalValue)
      )
      .nullable()
      .positive("Height must be positive")
      .integer("Height must be an integer"),
    weight: yup
      .number()
      .transform((value, originalValue) =>
        String(originalValue).trim() === "" ? null : Number(originalValue)
      )
      .nullable()
      .positive("Weight must be positive")
      .integer("Weight must be an integer"),
    bloodGroup: yup
      .string()
      .transform((value) => (value?.trim() === "" ? null : value))
      .nullable()
      .oneOf(
        [null, "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
        "Invalid blood group"
      ),
  }),
  INSURANCE_SUBMIT_ENQUIRY: yup.object().shape({
    full_name: yup.string().required("Full name is required"),
    phone_number: yup
      .string()
      .matches(
        /^[6-9]\d{9}$/,
        "Phone number must be a valid 10-digit Indian number"
      )
      .required("Phone number is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    lead_type: yup.string().required("Lead type is required"),
    age: yup
      .number()
      .typeError("Age must be a number")
      .required("Age is required")
      .positive("Age must be positive")
      .integer("Age must be an integer"),
    gender: yup.string().required("Gender is required"),
    coverage_for: yup.string().required("Coverage selection is required"),
    family_member_count: yup
      .number()
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

    income: yup
      .number()
      .typeError("Income must be a number")
      .required("Income is required"),
    nominee_name: yup.string().required("Nominee name is required"),
    nominee_relation: yup.string().required("Nominee relation is required"),
    lead_source: yup.string().required("Lead source is required"),
    agree: yup
      .boolean()
      .oneOf(
        [true],
        "You must confirm the information & agree to the terms and conditions"
      ),
  }),
  BOOK_CAB: yup.object().shape({
    patient_name: yup.string().required("Patient name is required"),
    patient_phone: yup
      .string()
      .matches(
        /^[6-9]\d{9}$/,
        "Phone number must be a valid 10-digit Indian number"
      )
      .required("Phone number is required"),
    emergency_type: yup.string().required("Emergency type is required"),
    address: yup.string().required("Pickup address is required"),
    destination_hospital: yup.string().required("Destination is required"),
    vehicle_type: yup.string().required("Vehicle type is required"),
    agree: yup
      .boolean()
      .oneOf(
        [true],
        "You must confirm the information & agree to the terms and conditions"
      ),
  }),
  BOOK_APPOINTMENT_DOCTOR: yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    address: yup.string().required("Address is required"),
    phone: yup
      .string()
      .matches(
        /^[6-9]\d{9}$/,
        "Phone number must be a valid 10-digit Indian number"
      )
      .required("Phone number is required"),
    disease: yup.string().required("Disease details are required"),
    agree: yup
      .boolean()
      .oneOf(
        [true],
        "You must confirm the information & agree to the terms and conditions"
      ),
  }),
  USER_ADD_ADDRESS: yup.object().shape({
    address_type: yup.string().required("Address type is required"),
    house_number: yup.string().required("House number is required"),
    street: yup.string(),
    landmark: yup.string(),
    city: yup.string().required("City is required"),
    state: yup.string(),
    pincode: yup
      .string()
      .required("Pincode is required")
      .matches(/^\d{6}$/, "Pincode must be 6 digits"),
    country: yup.string().required("Country is required"),
  }),
  USER_EDIT_ADDRESS: yup.object().shape({
    address_type: yup.string().required("Address type is required"),
    house_number: yup.string().required("House number is required"),
    street: yup.string(),
    landmark: yup.string(),
    city: yup.string().required("City is required"),
    state: yup.string(),
    pincode: yup
      .string()
      .required("Pincode is required")
      .matches(/^\d{6}$/, "Pincode must be 6 digits"),
    country: yup.string().required("Country is required"),
  }),
};

export default FORM_VALIDATIONS;
