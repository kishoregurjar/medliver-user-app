import { AntDesign } from "@expo/vector-icons";

export const socialButtons = [
  {
    icon: AntDesign,
    iconName: "google",
    color: "#000",
    text: "Continue with Google",
  },
  // {
  //   icon: FontAwesome,
  //   iconName: "facebook",
  //   color: "#4267B2",
  //   text: "Continue with Facebook",
  // },
  // {
  //   icon: Ionicons,
  //   iconName: "logo-apple",
  //   color: "#000",
  //   text: "Continue with Apple",
  // },
];

export const accountOptions = [
  {
    label: "Offers",
    icon: "pricetags-outline",
    path: "/account/offers",
    requiresAuth: false,
  },
  {
    label: "Orders",
    icon: "cart-outline",
    path: "/account/orders",
    requiresAuth: true,
  },
  {
    label: "My Diagnostic Tests",
    icon: "calendar-outline",
    path: "/account/diagnostics",
    requiresAuth: true,
  },
  {
    label: "My Prescriptions",
    icon: "medkit-outline",
    path: "/account/prescriptions",
    requiresAuth: true,
  },
  {
    label: "My Addresses",
    icon: "home-outline",
    path: "/account/addresses",
    requiresAuth: true,
  },
  {
    label: "Notifications",
    icon: "notifications-outline",
    path: "/notifications",
    requiresAuth: false,
  },
  {
    label: "Help",
    icon: "help-circle-outline",
    path: "/account/help",
    requiresAuth: false,
  },
  {
    label: "Privacy Policy",
    icon: "shield-checkmark-outline",
    path: "/account/privacy-policy",
    requiresAuth: false,
  },
  {
    label: "Terms of Use",
    icon: "document-text-outline",
    path: "/account/terms-of-use",
    requiresAuth: false,
  },
];

const IMAGES = {
  APP: {
    LOGO: require("../assets/logos/logo.png"),
    LOGO_FULL: require("../assets/logos/logo_full.png"),
    LOGO_TEXT: require("../assets/logos/logo_text.png"),
    BACKGROUND: require("../assets/images/app_background.png"),
    COVER: require("../assets/images/app_cover.png"),
  },
  PAGES: {
    LETS_START: require("../assets/images/lets_start_screen.png"),
    LOGIN: require("../assets/images/signin_registration_screen.png"),
    FORGOT: require("../assets/images/forgot_screen.png"),
    VERIFICATION: require("../assets/images/verify_otp_screen.png"),
    SUPPORT_HELP: require("../assets/images/support_help_screen.png"),
  },
  COMPONENTS: {
    HOME_NAV_TILE_1: require("../assets/images/buy_medicine.png"),
    HOME_NAV_TILE_2: require("../assets/images/book_test.png"),
    HOME_NAV_TILE_3: require("../assets/images/buy_insurance.png"),
    HOME_NAV_TILE_4: require("../assets/images/book_cab.png"),
    PROMO_PHARMACY: require("../assets/images/promo_pharmacy.png"),
    PROMO_PATHOLOGY: require("../assets/images/promo_pathology.png"),
    MEDICINE_1: require("../assets/images/medicine_1.png"),
    MEDICINE_2: require("../assets/images/medicine_2.png"),
    MEDICINE_3: require("../assets/images/medicine_3.png"),
    MEDICINE_4: require("../assets/images/medicine_4.png"),
    PATHOLOGY_CAT_1: require("../assets/images/pathology_cat_1.png"),
    PATHOLOGY_CAT_2: require("../assets/images/pathology_cat_2.png"),
  },
};

const STATIC = {
  IMAGES,
};

export default STATIC;
