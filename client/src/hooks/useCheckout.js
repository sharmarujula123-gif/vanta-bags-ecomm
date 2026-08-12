import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import addressService from "../services/addressService";
import orderService from "../services/orderService";
import paymentService from "../services/paymentService";
import cartService from "../services/cartService";
import useAuthStore from "../store/authStore";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true), {
        once: true,
      });
      existingScript.addEventListener("error", () => resolve(false), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const useCheckout = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingAddress, setSavingAddress] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const loadCheckout = useCallback(async () => {
    try {
      setLoading(true);

      const [cartData, addressData, pendingOrderData] =
        await Promise.all([
          cartService.getCart(),
          addressService.getAddresses(),
          orderService.getPendingPaymentOrder(),
        ]);

      const loadedCart = cartData.data?.cart || null;
      const loadedAddresses = addressData.data?.addresses || [];
      const loadedPendingOrder =
        pendingOrderData.data?.order || null;

      setCart(loadedCart);
      setAddresses(loadedAddresses);

      // A pending order is recoverable only when the cart is empty.
      // This prevents mixing a new cart with an older reserved order.
      setPendingOrder(
        !loadedCart?.items?.length ? loadedPendingOrder : null
      );

      const defaultAddress = loadedAddresses.find(
        (address) => address.isDefault
      );

      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
      } else if (loadedAddresses.length > 0) {
        setSelectedAddressId(loadedAddresses[0]._id);
      } else {
        setSelectedAddressId(null);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load checkout"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    loadCheckout();
  }, [isAuthenticated, loadCheckout]);

  const selectedAddress = useMemo(
    () =>
      addresses.find(
        (address) => address._id === selectedAddressId
      ),
    [addresses, selectedAddressId]
  );

  const checkoutCart = useMemo(() => {
    if (cart?.items?.length) return cart;

    if (!pendingOrder?.items?.length) return cart;

    return {
      items: pendingOrder.items.map((item) => ({
        product: {
          _id: item.product,
          name: item.name,
          price: item.price,
          images: item.image ? [item.image] : [],
        },
        quantity: item.quantity,
      })),
    };
  }, [cart, pendingOrder]);

  const subtotal = useMemo(() => {
    if (pendingOrder && !cart?.items?.length) {
      return Number(pendingOrder.subtotal || 0);
    }

    return (
      cart?.items?.reduce(
        (total, item) =>
          total +
          Number(item.product?.price || 0) * item.quantity,
        0
      ) || 0
    );
  }, [cart, pendingOrder]);

  const shipping = pendingOrder && !cart?.items?.length
    ? Number(pendingOrder.shippingFee || 0)
    : subtotal >= 2000
      ? 0
      : 100;

  const total = pendingOrder && !cart?.items?.length
    ? Number(pendingOrder.total || 0)
    : subtotal + shipping;

  const selectAddress = (address) => {
    setSelectedAddressId(address._id);
  };

  const openAddressForm = () => setShowAddressForm(true);
  const closeAddressForm = () => setShowAddressForm(false);

  const createAddress = async (addressData) => {
    try {
      setSavingAddress(true);

      const data = await addressService.createAddress(addressData);
      const newAddress = data.data?.address;

      if (newAddress) {
        setAddresses((current) => {
          if (newAddress.isDefault) {
            return [
              newAddress,
              ...current.map((address) => ({
                ...address,
                isDefault: false,
              })),
            ];
          }

          return [...current, newAddress];
        });

        setSelectedAddressId(newAddress._id);
      }

      setShowAddressForm(false);
      toast.success("Address saved");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to save address"
      );
    } finally {
      setSavingAddress(false);
    }
  };

  const deleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      await addressService.deleteAddress(id);

      setAddresses((current) =>
        current.filter((address) => address._id !== id)
      );

      if (selectedAddressId === id) {
        setSelectedAddressId(null);
      }

      toast.success("Address deleted");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to delete address"
      );
    }
  };

  const openRazorpay = async (order) => {
    const paymentData = await paymentService.createPayment(
      order._id
    );

    const razorpayOrder = paymentData.data?.razorpayOrder;

    if (!razorpayOrder) {
      throw new Error("Unable to initialize payment");
    }

    const loaded = await loadRazorpayScript();

    if (!loaded) {
      throw new Error("Unable to load Razorpay");
    }

    const options = {
      key: paymentData.data?.razorpayKeyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency || "INR",
      name: "Vanta Bags",
      description: `Order #${order._id}`,
      order_id: razorpayOrder.id,
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: selectedAddress?.phone || order.shippingAddress?.phone || "",
      },
      theme: {
        color: "#1c1917",
      },
      handler: async (response) => {
        try {
          await paymentService.verifyPayment({
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          });

          setPendingOrder(null);
          setPlacingOrder(false);
          toast.success("Payment successful");
          window.location.href = `/order-success/${order._id}`;
        } catch (error) {
          setPlacingOrder(false);
          toast.error(
            error.response?.data?.message ||
              "Payment verification failed"
          );
        }
      },
      modal: {
        ondismiss: () => {
          setPlacingOrder(false);
          toast.error("Payment was cancelled. You can retry this order.");
        },
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", () => {
      setPlacingOrder(false);
      toast.error("Payment failed. You can retry this order.");
    });

    razorpay.open();
  };

  const placeOrder = async () => {
    if (!selectedAddress && !pendingOrder) {
      toast.error("Please select a shipping address");
      return;
    }

    if (!cart?.items?.length && !pendingOrder) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setPlacingOrder(true);

      let order = pendingOrder;

      if (!order) {
        const orderData = await orderService.createOrder(
          selectedAddress
        );

        order = orderData.data?.order;

        if (!order?._id) {
          throw new Error("Order was not created");
        }

        setPendingOrder(order);
      }

      await openRazorpay(order);
    } catch (error) {
      setPlacingOrder(false);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to place order"
      );
    }
  };

  return {
    user,
    cart: checkoutCart,
    addresses,
    selectedAddressId,
    selectedAddress,
    loading,
    savingAddress,
    placingOrder,
    showAddressForm,
    subtotal,
    shipping,
    total,
    selectAddress,
    openAddressForm,
    closeAddressForm,
    createAddress,
    deleteAddress,
    placeOrder,
    reload: loadCheckout,
  };
};

export default useCheckout;
