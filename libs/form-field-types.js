const FORM_FIELD_TYPES = {
  SIGN_IN: [
    {
      name: "email",
      type: "email",
      label: "Your Email",
      placeholder: "Enter Your Email",
      keyboardType: "email-address",
    },
    {
      name: "password",
      type: "password",
      label: "Password",
      placeholder: "Enter Your Password",
      keyboardType: "default",
    },
  ],
  SIGN_UP: [
    {
      name: "fullName",
      type: "default",
      label: "Full Name",
      placeholder: "Enter Your Full Name",
      keyboardType: "default",
    },
    {
      name: "email",
      type: "email",
      label: "Your Email",
      placeholder: "Enter Your Email",
      keyboardType: "email-address",
    },
    {
      name: "phoneNumber",
      type: "phone",
      label: "Phone Number",
      placeholder: "Enter Your Phone Number",
      keyboardType: "phone-pad",
    },
    {
      name: "password",
      type: "password",
      label: "Password",
      placeholder: "Enter Your Password",
      keyboardType: "default",
    },
    {
      name: "confirmPassword",
      type: "password",
      label: "Confirm Password",
      placeholder: "Enter Your Confirm Password",
      keyboardType: "default",
    },
  ],
  FORGOT_PASSWORD: [
    {
      name: "email",
      label: "Your Email",
      placeholder: "Enter Your Email",
      type: "email",
      keyboardType: "email-address",
    },
  ],
  RESET_PASSWORD: [
    {
      name: "newPassword",
      label: "New Password",
      type: "password",
      placeholder: "Enter Your New Password",
      onChangeCustom: (val) => {
        setPasswordValue(val);
        setPasswordStrength(getPasswordStrength(val));
      },
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "Confirm Your Password",
    },
  ],
};

export default FORM_FIELD_TYPES;
