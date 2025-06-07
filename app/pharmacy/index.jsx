import React from "react";
import AppHomeCarousel from "@/components/common/AppHomeCarousel";
import BestSellerPharmacy from "@/components/screens/pharmacy/BestSellerPharmacy";
import TopPicksPharmacy from "@/components/screens/pharmacy/TopPicksPharmacy";
import AppSpecialOffer from "@/components/common/AppSpecialOffer";
import AnimatedHeaderLayout from "@/components/layouts/AnimatedHeaderLayout";

export default function PharmacyHome() {
  return (
    <AnimatedHeaderLayout>
      <AppHomeCarousel />
      <BestSellerPharmacy />
      <AppSpecialOffer />
      <TopPicksPharmacy />
    </AnimatedHeaderLayout>
  );
}
