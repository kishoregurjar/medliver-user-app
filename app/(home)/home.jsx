import Header from "@/components/common/Header";
import NavigationTiles from "@/components/common/NavigationTiles";
import AppLayout from "@/components/layouts/AppLayout";
import { useAuthUser } from "@/contexts/AuthContext";

export default function HomeScreen() {
  const { authUser } = useAuthUser();
  console.log("authUser Home", authUser);

  return (
    <AppLayout>
      {/* Header */}
      <Header />

      {/* Navigation Tiles */}
      <NavigationTiles />
    </AppLayout>
  );
}
