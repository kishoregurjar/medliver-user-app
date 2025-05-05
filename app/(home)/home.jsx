
import Header from "@/components/common/Header";
import NavigationTiles from "@/components/common/NavigationTiles";
import AppLayout from "@/components/layouts/AppLayout";

export default function HomeScreen() {
  return (
    <AppLayout>
      {/* Header */}
      <Header />

      {/* Navigation Tiles */}
      <NavigationTiles />
    </AppLayout>
  );
}
