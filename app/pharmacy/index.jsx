import Header from "@/components/common/Header";
import AppLayout from "@/components/layouts/AppLayout";
import BestSellerSection from "@/components/screens/pharmacy/BestSellerSection";
import CategoriesSection from "@/components/screens/pharmacy/CategoriesSection";
import HomePromoCarousel from "@/components/screens/pharmacy/HomePromoCarousel";
import SpecialOfferSection from "@/components/screens/pharmacy/SpecialOfferSection";
import TopPicksSection from "@/components/screens/pharmacy/TopPicksSection";

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
