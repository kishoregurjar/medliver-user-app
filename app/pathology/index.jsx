import React from "react";
import AppHomeCarousel from "@/components/common/AppHomeCarousel";
import ContactOurExpert from "@/components/screens/pathology/ContactOurExpert";
import AppCategories from "@/components/common/AppCategories";
import AppSpecialOffer from "@/components/common/AppSpecialOffer";
import PopularTestPathology from "@/components/screens/pathology/PopularTestPathology";
import AnimatedHeaderLayout from "@/components/layouts/AnimatedHeaderLayout";

export default function PathologyHome() {
  return (
    <AnimatedHeaderLayout>
      <AppHomeCarousel type="pathology" />
      <ContactOurExpert />
      <AppCategories type="pathology" />
      <AppSpecialOffer type="pathology" />
      <PopularTestPathology />
    </AnimatedHeaderLayout>
  );
}
