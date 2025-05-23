// contexts/CartContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import useAxios from "@/hooks/useAxios";
import { useAuthUser } from "@/contexts/AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { authUser } = useAuthUser();

  const { request: fetchCart } = useAxios();
  const { request: updateQty } = useAxios();
  const { request: removeItemApi } = useAxios();
  const { request: addItemApi } = useAxios();

  const [cartItems, setCartItems] = useState([]);
  const [localQuantities, setLocalQuantities] = useState({});
  const [lastQuantities, setLastQuantities] = useState({});

  const timers = useRef({});

  // 🚀 Load Cart on Login
  const loadCart = async () => {
    if (!authUser?.token) return;

    const { data, error } = await fetchCart({
      url: "/user/get-cart",
      method: "GET",
      authRequired: true,
    });

    if (!error) {
      const items = data?.data?.items || [];

      // 🧼 Clean stale quantities
      const cleanedQuantities = Object.fromEntries(
        items.map((item) => [item.item_id._id, item.quantity])
      );

      setCartItems(items);
      setLocalQuantities(cleanedQuantities);
    }
  };

  useEffect(() => {
    loadCart();
  }, [authUser]);

  const addToCartItem = async (productId, quantity) => {
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
      const existing = cartItems.find((i) => i.item_id._id === productId);
      if (existing) {
        updateQuantity(productId, existing.quantity + quantity);
      } else {
        const newItem = data?.data?.item;
        if (newItem) {
          setCartItems((prev) => [...prev, newItem]);
          setLocalQuantities((prev) => ({
            ...prev,
            [productId]: quantity,
          }));
        } else {
          await loadCart();
        }
      }

      // 🎯 Persist last quantity
      setLastQuantities((prev) => ({ ...prev, [productId]: quantity }));
    }

    return { data, error };
  };

  const updateQuantity = (productId, newQty) => {
    setLocalQuantities((prev) => ({ ...prev, [productId]: newQty }));

    if (timers.current[productId]) clearTimeout(timers.current[productId]);

    timers.current[productId] = setTimeout(async () => {
      const item = cartItems.find((i) => i.item_id._id === productId);
      if (!item || item.quantity === newQty || newQty < 1) return;

      const updatedCart = cartItems.map((i) =>
        i.item_id._id === productId ? { ...i, quantity: newQty } : i
      );

      setCartItems(updatedCart);

      const { error } = await updateQty({
        url: "/user/change-cart-product-quantity",
        method: "PUT",
        payload: { itemId: productId, quantity: newQty, type: "Medicine" },
        authRequired: true,
      });

      if (!error) {
        setLocalQuantities((prev) => ({
          ...prev,
          [productId]: newQty,
        }));
      }

      delete timers.current[productId];
    }, 600);
  };

  const removeCartItem = async (productId) => {
    const { data, error } = await removeItemApi({
      url: "/user/remove-item-from-cart",
      method: "PUT",
      payload: { itemId: productId, type: "Medicine" },
      authRequired: true,
    });

    if (!error) {
      setCartItems((prev) =>
        prev.filter((item) => item.item_id._id !== productId)
      );

      // 🧼 Clean up both local and last quantity
      setLocalQuantities((prev) => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });

      setLastQuantities((prev) => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
    }

    return { data, error };
  };

  // ✅ Totals
  const itemTotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum + item.price * (localQuantities[item.item_id._id] || 1),
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

  // 🎯 Persistent Quantity Utility
  const setLastQuantityForProduct = (productId, qty) =>
    setLastQuantities((prev) => ({ ...prev, [productId]: qty }));

  const getLastQuantityForProduct = (productId) =>
    lastQuantities[productId] || 1;

  const value = useMemo(
    () => ({
      cartItems,
      localQuantities,
      addToCartItem,
      updateQuantity,
      removeCartItem,
      itemTotal,
      itemCount,
      reloadCart: loadCart,
      setLastQuantityForProduct,
      getLastQuantityForProduct,
    }),
    [cartItems, localQuantities, itemTotal, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
