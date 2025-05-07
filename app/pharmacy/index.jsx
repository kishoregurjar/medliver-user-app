import Header from "@/components/common/Header";
import AppLayout from "@/components/layouts/AppLayout";
import HomePromoCarousel from "@/components/screens/HomePromoCarousel";
import CategoriesSection from "@/components/screens/CategoriesSection";
import BestSellerSection from "@/components/screens/BestSellerSection";
import SpecialOfferSection from "@/components/screens/SpecialOfferSection";
import TopPicksSection from "@/components/screens/TopPicksSection";

const PharmacyHome = () => {

  return (
    <AppLayout>
      {/* Header */}
      <Header />

      {/* Promo Banner */}
      <HomePromoCarousel />

      {/* Categories */}
      <CategoriesSection />

      {/* Best Seller */}
      <BestSellerSection />

      {/* Special Offer */}
      <SpecialOfferSection />

      {/* Top Picks */}
      <TopPicksSection />
    </AppLayout>
  );
};

export default PharmacyHome;
