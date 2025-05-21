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

  const [cartItems, setCartItems] = useState([]);
  const [localQuantities, setLocalQuantities] = useState({});
  const timers = useRef({});

  const loadCart = async () => {
    if (!authUser?.token) return;
    const { data, error } = await fetchCart({
      url: "/user/get-cart",
      method: "GET",
      authRequired: true,
    });
    if (!error) {
      const items = data?.data?.items || [];
      setCartItems(items);
      setLocalQuantities(
        Object.fromEntries(
          items.map((item) => [item.item_id._id, item.quantity])
        )
      );
    }
  };

  useEffect(() => {
    loadCart();
  }, [authUser]);

  const updateQuantity = (productId, newQty) => {
    setLocalQuantities((prev) => ({ ...prev, [productId]: newQty }));

    if (timers.current[productId]) clearTimeout(timers.current[productId]);

    timers.current[productId] = setTimeout(async () => {
      const item = cartItems.find((i) => i.item_id._id === productId);
      if (!item || item.quantity === newQty || newQty < 1) return;

      setCartItems((prev) =>
        prev.map((i) =>
          i.item_id._id === productId ? { ...i, quantity: newQty } : i
        )
      );

      await updateQty({
        url: "/user/change-cart-product-quantity",
        method: "PUT",
        payload: { itemId: productId, quantity: newQty, type: "Medicine" },
        authRequired: true,
      });
    }, 600);
  };

  const removeCartItem = async (itemId) => {
    const { error } = await removeItemApi({
      url: "/user/remove-item-from-cart",
      method: "PUT",
      payload: { itemId, type: "Medicine" },
      authRequired: true,
    });

    if (!error) {
      setCartItems((prev) =>
        prev.filter((item) => item.item_id._id !== itemId)
      );
      setLocalQuantities((prev) => {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      });
    }
  };

  const itemTotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum + item.price * (localQuantities[item.item_id._id] || 1),
        0
      ),
    [cartItems, localQuantities]
  );

  const value = useMemo(
    () => ({
      cartItems,
      localQuantities,
      updateQuantity,
      removeCartItem,
      itemTotal,
      reloadCart: loadCart,
    }),
    [cartItems, localQuantities]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
