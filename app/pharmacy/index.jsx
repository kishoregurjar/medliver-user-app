import Header from "@/components/common/Header";
import AppLayout from "@/components/layouts/AppLayout";
import BestSellerPharmacy from "@/components/screens/pharmacy/BestSellerPharmacy";
import CategoriesPharmacy from "@/components/screens/pharmacy/CategoriesPharmacy";
import HomePromoCarouselPharmacy from "@/components/screens/pharmacy/HomePromoCarouselPharmacy";
import SpecialOfferPharmacy from "@/components/screens/pharmacy/SpecialOfferPharmacy";
import TopPicksPharmacy from "@/components/screens/pharmacy/TopPicksPharmacy";

const PharmacyHome = () => {

  return (
    <AppLayout>
      {/* Header */}
      <Header />

      {/* Promo Banner */}
      <HomePromoCarouselPharmacy />

      {/* Categories */}
      <CategoriesPharmacy />

      {/* Best Seller */}
      <BestSellerPharmacy />

      {/* Special Offer */}
      <SpecialOfferPharmacy />

      {/* Top Picks */}
      <TopPicksPharmacy />
    </AppLayout>
  );
};

export default PharmacyHome;
