import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAxios from "@/hooks/useAxios";
import { useAuthUser } from "@/contexts/AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const LOCAL_CART_KEY = "guest-cart";

export const CartProvider = ({ children }) => {
  const { authUser } = useAuthUser();
  const isLoggedIn = !!authUser?.isAuthenticated;

  const { request: fetchCart, loading: isLoadingCart } = useAxios();
  const { request: updateQty } = useAxios();
  const { request: removeItemApi } = useAxios();
  const { request: addItemApi } = useAxios();

  const [isSyncingCart, setIsSyncingCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [localQuantities, setLocalQuantities] = useState({});
  const [lastQuantities, setLastQuantities] = useState({});
  const timers = useRef({});

  // Load cart from server
  const loadCart = async () => {
    const { data, error } = await fetchCart({
      url: "/user/get-cart",
      method: "GET",
      authRequired: true,
    });

    if (!error) {
      const items = data?.data?.items || [];
      setCartItems(items);
      const cleanedQuantities = Object.fromEntries(
        items.map((item) => [item.item_id._id, item.quantity])
      );
      setLocalQuantities(cleanedQuantities);
    }
  };

  // Load guest cart from AsyncStorage
  const loadLocalCart = async () => {
    try {
      const stored = await AsyncStorage.getItem(LOCAL_CART_KEY);
      if (stored) {
        const items = JSON.parse(stored);
        setCartItems(items);
        const qtyMap = Object.fromEntries(
          items.map((item) => [item.item_id._id, item.quantity])
        );
        setLocalQuantities(qtyMap);
      }
    } catch (e) {
      console.error("Failed to load guest cart", e);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadCart();
      syncGuestCartToServer(); // optional merge
    } else {
      loadLocalCart();
    }
  }, [authUser]);

  // Save local cart
  const saveLocalCart = async (items) => {
    try {
      await AsyncStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save local cart", e);
    }
  };

  // Sync guest cart to server after login
  const syncGuestCartToServer = async () => {
    if (isSyncingCart) return; // Prevent multiple syncs
    setIsSyncingCart(true);
    try {
      const stored = await AsyncStorage.getItem(LOCAL_CART_KEY);
      if (!stored) return;
      const guestItems = JSON.parse(stored);

      for (const item of guestItems) {
        await addItemApi({
          url: "/user/add-to-cart",
          method: "POST",
          payload: {
            productId: item.item_id._id,
            quantity: item.quantity,
            type: "Medicine",
          },
          authRequired: true,
        });
      }

      await AsyncStorage.removeItem(LOCAL_CART_KEY);
      await loadCart();
    } catch (e) {
      console.error("Failed to sync guest cart", e);
    } finally {
      setIsSyncingCart(false);
    }
  };

  const addToCartItem = async (productId, quantity, itemDetails = {}) => {
    if (!isLoggedIn) {
      const existing = cartItems.find((i) => i.item_id._id === productId);
      let updatedCart;
      if (existing) {
        updatedCart = cartItems.map((item) =>
          item.item_id._id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem = {
          item_id: { _id: productId, ...itemDetails },
          quantity,
          price: itemDetails.price || 0,
        };
        updatedCart = [...cartItems, newItem];
      }
      setCartItems(updatedCart);
      setLocalQuantities((prev) => ({
        ...prev,
        [productId]: (prev[productId] || 0) + quantity,
      }));
      await saveLocalCart(updatedCart);
      return;
    }

    const { data, error } = await addItemApi({
      url: "/user/add-to-cart",
      method: "POST",
      payload: {
        productId,
        quantity,
        type: "Medicine",
      },
      authRequired: true,
    });

    if (!error) {
      await loadCart();
    }

    return { data, error };
  };

  const updateQuantity = async (productId, newQty) => {
    setLocalQuantities((prev) => ({ ...prev, [productId]: newQty }));

    if (timers.current[productId]) clearTimeout(timers.current[productId]);

    timers.current[productId] = setTimeout(async () => {
      const latestQty = localQuantities[productId]; // use fresh reference
      const item = cartItems.find((i) => i.item_id._id === productId);
      if (!item || item.quantity === latestQty || latestQty < 1) return;

      const updatedCart = cartItems.map((i) =>
        i.item_id._id === productId ? { ...i, quantity: latestQty } : i
      );
      setCartItems(updatedCart);

      if (!isLoggedIn) {
        await saveLocalCart(updatedCart);
        return;
      }

      await updateQty({
        url: "/user/change-cart-product-quantity",
        method: "PUT",
        payload: { itemId: productId, quantity: latestQty, type: "Medicine" },
        authRequired: true,
      });

      delete timers.current[productId];
    }, 600);
  };

  const removeCartItem = async (productId) => {
    const updated = cartItems.filter((item) => item.item_id._id !== productId);
    setCartItems(updated);
    setLocalQuantities((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
    setLastQuantities((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });

    if (!isLoggedIn) {
      await saveLocalCart(updated);
      return;
    }

    await removeItemApi({
      url: "/user/remove-item-from-cart",
      method: "PUT",
      payload: { itemId: productId, type: "Medicine" },
      authRequired: true,
    });
  };

  const clearCart = async () => {
    setCartItems([]);
    setLocalQuantities({});
    setLastQuantities({});
    if (!isLoggedIn) {
      await AsyncStorage.removeItem(LOCAL_CART_KEY);
    }
  };

  const itemTotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum +
          (item.price ?? item.item_id.price ?? 0) *
            (localQuantities[item.item_id._id] || 1),
        0
      ),
    [cartItems, localQuantities]
  );

  const itemCount = useMemo(
    () =>
      cartItems.reduce(
        (count, item) => count + (localQuantities[item.item_id._id] || 0),
        0
      ),
    [cartItems, localQuantities]
  );

  const value = useMemo(
    () => ({
      isLoadingCart,
      isSyncingCart,
      cartItems,
      localQuantities,
      addToCartItem,
      updateQuantity,
      removeCartItem,
      clearCart,
      itemTotal,
      itemCount,
      reloadCart: isLoggedIn ? loadCart : loadLocalCart,
      setLastQuantityForProduct: (id, qty) =>
        setLastQuantities((prev) => ({ ...prev, [id]: qty })),
      getLastQuantityForProduct: (id) => lastQuantities[id] || 1,
    }),
    [
      cartItems,
      localQuantities,
      itemTotal,
      itemCount,
      isLoggedIn,
      lastQuantities,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
