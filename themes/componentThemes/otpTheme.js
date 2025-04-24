// src/themes/componentThemes/otpTheme.js

import { appColors } from "../colorTokens";

export const otpTheme = {
  containerStyle: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 30,
  },
  pinCodeContainerStyle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.gray300,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  pinCodeTextStyle: {
    fontSize: 18,
    fontWeight: "bold",
    color: appColors.black,
  },
  focusStickStyle: {
    backgroundColor: appColors.green500,
    height: 2,
    width: "100%",
    marginTop: 4,
  },
  focusedPinCodeContainerStyle: {
    borderColor: appColors.green500,
  },
  placeholderTextStyle: {
    color: appColors.gray400,
    fontSize: 18,
  },
  filledPinCodeContainerStyle: {
    borderColor: appColors.green500,
  },
  disabledPinCodeContainerStyle: {
    backgroundColor: appColors.gray100,
  },
};
