import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('nashwa_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('nashwa_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem('nashwa_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('nashwa_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('nashwa_coupon');
    }
  }, [appliedCoupon]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const addToCart = (product, quantity = 1) => {
    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { id: product.id, product, quantity }];
    });
    showToast(`Added "${product.name}" to your basket`);
  };

  const removeFromCart = (productId) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  // Calculations
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Free shipping threshold: $25 (৳3,000 in BDT)
  const freeShippingThreshold = 25;
  const isFreeShipping = subtotal >= freeShippingThreshold || appliedCoupon?.type === 'shipping';
  // Standard Bangladesh 64-district courier fee: $1.00 (৳120 in BDT)
  const shippingFee = subtotal === 0 ? 0 : isFreeShipping ? 0 : 1.0;

  // Calculate discount based on subtotal
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discountAmount = (subtotal * appliedCoupon.discount_amount) / 100;
    } else if (appliedCoupon.type === 'fixed') {
      discountAmount = Math.min(subtotal, appliedCoupon.discount_amount);
    } else if (appliedCoupon.type === 'shipping') {
      discountAmount = 1.0;
    }
  }

  const totalPrice = Math.max(0, subtotal - discountAmount + shippingFee);

  const applyCoupon = async (code) => {
    if (!code || !code.trim()) {
      return { success: false, error: 'Please enter a valid promotional code.' };
    }
    try {
      const res = await fetch('/api/orders/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), subtotal })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to apply coupon.' };
      }
      setAppliedCoupon({
        code: data.code,
        type: data.type,
        discount_amount: data.discount_amount,
        description: data.description
      });
      showToast(`Promo "${data.code}" applied! ${data.description}`);
      return { success: true, message: data.description };
    } catch {
      return { success: false, error: 'Network error validating coupon.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Promotional discount removed');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        discountAmount,
        shippingFee,
        isFreeShipping,
        freeShippingThreshold,
        totalPrice,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen(!isCartOpen),
        toast,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

