import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AuthProvider } from "./AuthContext";
import { ConfigProvider } from "./ConfigContext";
import { LocationProvider } from "./LocationContext";
import { CartProvider } from "./CartContext";
import { NotificationProvider } from "./NotificationContext";
import { NavigationHistoryProvider } from "./NavigationHistoryContext";
import { ToastProvider } from "@gluestack-ui/toast";

export default function AppProviders({ children }) {
  return (
    <GluestackUIProvider>
      <AuthProvider>
        <ConfigProvider>
          <LocationProvider>
            <CartProvider>
              <NotificationProvider>
                <NavigationHistoryProvider>
                  <ToastProvider>
                    {children}
                  </ToastProvider>
                </NavigationHistoryProvider>
              </NotificationProvider>
            </CartProvider>
          </LocationProvider>
        </ConfigProvider>
      </AuthProvider>
    </GluestackUIProvider>
  );
}
