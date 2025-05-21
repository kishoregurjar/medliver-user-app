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
  const { request: addItemApi } = useAxios(); // ✅ New request hook for adding

  const [cartItems, setCartItems] = useState([]);
  const [localQuantities, setLocalQuantities] = useState({});
  const timers = useRef({});

  // ✅ Load cart on login or refresh
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

  // ✅ Add to Cart (used in AddToCartModalButton)
  const addToCartItem = async (productId, quantity) => {
    const { data, error } = await addItemApi({
      method: "POST",
      url: "/user/add-to-cart",
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
        const newItem = data?.data?.item; // if backend returns item
        if (newItem) {
          setCartItems((prev) => [...prev, newItem]);
          setLocalQuantities((prev) => ({
            ...prev,
            [productId]: quantity,
          }));
        } else {
          await loadCart(); // fallback
        }
      }
    }

    return { data, error };
  };

  // ✅ Debounced Quantity Update
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

      const { data, error } = await updateQty({
        url: "/user/change-cart-product-quantity",
        method: "PUT",
        payload: { itemId: productId, quantity: newQty, type: "Medicine" },
        authRequired: true,
      });

      if (!error) {
        setLocalQuantities((prev) => ({ ...prev, [productId]: newQty }));
      }

      delete timers.current[productId];

      return { data, error };
    }, 600);
  };

  // ✅ Remove Item
  const removeCartItem = async (itemId) => {
    const { data, error } = await removeItemApi({
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

    return { data, error };
  };

  // ✅ Cart Totals
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

  const value = useMemo(
    () => ({
      cartItems,
      localQuantities,
      addToCartItem, // ✅ Available to components
      updateQuantity,
      removeCartItem,
      itemTotal,
      itemCount,
      reloadCart: loadCart,
    }),
    [cartItems, localQuantities, itemTotal, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
