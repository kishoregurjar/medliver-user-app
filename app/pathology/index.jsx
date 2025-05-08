import { Text } from "react-native";
import React from "react";
import AppLayout from "@/components/layouts/AppLayout";
import Header from "@/components/common/Header";
import HomePromoCarouselPathology from "@/components/screens/pathology/HomePromoCarouselPathology";
import CategoriesPathology from "@/components/screens/pathology/CategoriesPathology";
import ContactOurExpert from "@/components/screens/pathology/ContactOurExpert";
import SpecialOfferPathology from "@/components/screens/pathology/SpecialOfferPathology";
import PopularTestPathology from "@/components/screens/pathology/PopularTestPathology";

export default function PathologyHome() {
  return (
    <AppLayout>
      {/* Header */}
      <Header />

      {/* Promo Banner */}
      <HomePromoCarouselPathology />

      {/* Contact Us */}
      <ContactOurExpert />

      {/* Categories */}
      <CategoriesPathology />

      {/* Special Offer */}
      <SpecialOfferPathology />

      {/* Popular Test */}
      <PopularTestPathology />
    </AppLayout>
  );
}
