import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";

export const socialButtons = [
  {
    icon: AntDesign,
    iconName: "google",
    color: "#000",
    text: "Continue with Google",
  },
  {
    icon: FontAwesome,
    iconName: "facebook",
    color: "#4267B2",
    text: "Continue with Facebook",
  },
  {
    icon: Ionicons,
    iconName: "logo-apple",
    color: "#000",
    text: "Continue with Apple",
  },
];

const IMAGES = {
  APP: {
    LOGO: require("../assets/logos/logo.png"),
    LOGO_H: require("../assets/logos/logo_horizontal.png"),
  },
  PAGES: {
    LETS_START: require("../assets/images/lets_start.png"),
    LOGIN: require("../assets/images/login.png"),
  },
  COMPONENTS: {
    USER: require("../assets/images/user.png"),
    MEDICINE_1: require("../assets/images/medicine_1.png"),
    MEDICINE_2: require("../assets/images/medicine_2.png"),
    MEDICINE_3: require("../assets/images/medicine_3.png"),
    MEDICINE_4: require("../assets/images/medicine_4.png"),
    MEDICINE_5: require("../assets/images/medicine_5.png"),
  },
};

const STATIC = {
  IMAGES,
};

export default STATIC;
