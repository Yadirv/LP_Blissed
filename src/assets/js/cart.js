/**
 * Cart Management System - Blissed Skin
 * Handles shopping cart operations with localStorage
 * GTM events integration for e-commerce tracking
 */

const BlissedCart = (function () {
  "use strict";

  const CART_KEY = "blissed_cart";
  const CART_VERSION = "1.0";

  // Product catalog with full data
  const PRODUCT_CATALOG = {
    "ACNE-PATCH-60": {
      item_id: "ACNE-PATCH-60",
      item_name: "60 Effective Zit Patches in Four Sizes",
      item_category: "Skincare",
      item_brand: "Blissed Skin",
      price: 13.99,
      currency: "USD",
      image: "../assets/products/Product-acne-patch-60-Front.png",
    },
    "ACNE-PATCH-30": {
      item_id: "ACNE-PATCH-30",
      item_name: "30 Zit Patches in Four Sizes",
      item_category: "Skincare",
      item_brand: "Blissed Skin",
      price: 8.75,
      currency: "USD",
      image: "../assets/products/Product-acne-patch-30-Front.png",
    },
    "ACNE-PATCH-20": {
      item_id: "ACNE-PATCH-20",
      item_name: "20 Extra Large Effective Zit Patches",
      item_category: "Skincare",
      item_brand: "Blissed Skin",
      price: 8.49,
      currency: "USD",
      image: "../assets/products/Product-acne-patch-20-Front.png",
    },
    "NASAL-STRIP-40": {
      item_id: "NASAL-STRIP-40",
      item_name: "BlissedSkin Nasal Strips Sleep - 40 Count",
      item_category: "Sleep",
      item_brand: "Blissed Skin",
      price: 13.99,
      currency: "USD",
      image: "../assets/products/Product-Nasal-Strip-40-Front.png",
    },
  };

  /**
   * Get cart from localStorage
   */
  function getCart() {
    try {
      const cartData = localStorage.getItem(CART_KEY);
      if (!cartData) return [];

      const parsed = JSON.parse(cartData);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Error loading cart:", error);
      return [];
    }
  }

  /**
   * Save cart to localStorage
   */
  function saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      return true;
    } catch (error) {
      console.error("Error saving cart:", error);
      return false;
    }
  }

  /**
   * Get product data by ID
   */
  function getProductData(productId) {
    return PRODUCT_CATALOG[productId] || null;
  }

  /**
   * Add item to cart
   */
  function addToCart(productId, quantity = 1) {
    const productData = getProductData(productId);
    if (!productData) {
      console.error("Product not found:", productId);
      return false;
    }

    const cart = getCart();
    const existingItemIndex = cart.findIndex((item) => item.item_id === productId);

    if (existingItemIndex !== -1) {
      // Update quantity if item already in cart
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.push({
        ...productData,
        quantity: quantity,
      });
    }

    const saved = saveCart(cart);

    if (saved) {
      // Fire GTM add_to_cart event
      fireAddToCartEvent(productData, quantity);

      // Update cart UI if visible
      updateCartUI();

      return true;
    }

    return false;
  }

  /**
   * Remove item from cart
   */
  function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter((item) => item.item_id !== productId);
    saveCart(cart);
    updateCartUI();
  }

  /**
   * Update item quantity
   */
  function updateQuantity(productId, quantity) {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    const cart = getCart();
    const itemIndex = cart.findIndex((item) => item.item_id === productId);

    if (itemIndex !== -1) {
      cart[itemIndex].quantity = quantity;
      saveCart(cart);
      updateCartUI();
    }
  }

  /**
   * Clear cart
   */
  function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartUI();
  }

  /**
   * Get cart total
   */
  function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }

  /**
   * Get total items count
   */
  function getItemCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  }

  /**
   * Fire GTM add_to_cart event
   */
  function fireAddToCartEvent(productData, quantity) {
    if (typeof window.dataLayer === "undefined") {
      console.warn("GTM dataLayer not found");
      return;
    }

    window.dataLayer.push({
      event: "add_to_cart",
      ecommerce: {
        currency: productData.currency,
        value: productData.price * quantity,
        items: [
          {
            item_id: productData.item_id,
            item_name: productData.item_name,
            item_category: productData.item_category,
            item_brand: productData.item_brand,
            price: productData.price,
            quantity: quantity,
          },
        ],
      },
    });

    console.log("GTM add_to_cart event fired:", productData.item_id);
  }

  /**
   * Fire GTM begin_checkout event
   */
  function fireBeginCheckoutEvent() {
    if (typeof window.dataLayer === "undefined") {
      console.warn("GTM dataLayer not found");
      return;
    }

    const cart = getCart();
    const items = cart.map((item) => ({
      item_id: item.item_id,
      item_name: item.item_name,
      item_category: item.item_category,
      item_brand: item.item_brand,
      price: item.price,
      quantity: item.quantity,
    }));

    window.dataLayer.push({
      event: "begin_checkout",
      ecommerce: {
        currency: "USD",
        value: getCartTotal(),
        items: items,
      },
    });

    console.log("GTM begin_checkout event fired");
  }

  /**
   * Update cart UI elements
   */
  function updateCartUI() {
    const count = getItemCount();
    const total = getCartTotal();

    // Update cart count badges
    const countElements = document.querySelectorAll(".cart-count");
    countElements.forEach((el) => {
      el.textContent = count;
      el.style.display = count > 0 ? "inline" : "none";
    });

    // Update cart total displays
    const totalElements = document.querySelectorAll(".cart-total");
    totalElements.forEach((el) => {
      el.textContent = `$${total.toFixed(2)}`;
    });
  }

  /**
   * Show success notification
   */
  function showNotification(message, type = "success") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `cart-notification ${type}`;
    notification.innerHTML = `
            <div class="flex items-center gap-2 bg-white px-6 py-3 rounded-lg shadow-lg border-l-4 ${
              type === "success" ? "border-green-500" : "border-red-500"
            }">
                <svg class="w-5 h-5 ${type === "success" ? "text-green-500" : "text-red-500"}" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-gray-800 font-medium">${message}</span>
            </div>
        `;

    // Add styles
    notification.style.position = "fixed";
    notification.style.top = "20px";
    notification.style.right = "20px";
    notification.style.zIndex = "9999";
    notification.style.animation = "slideIn 0.3s ease-out";

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease-out";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Public API
  return {
    add: addToCart,
    remove: removeFromCart,
    update: updateQuantity,
    clear: clearCart,
    get: getCart,
    getTotal: getCartTotal,
    getCount: getItemCount,
    getProduct: getProductData,
    beginCheckout: fireBeginCheckoutEvent,
    updateUI: updateCartUI,
    notify: showNotification,
  };
})();

// Initialize cart on page load
document.addEventListener("DOMContentLoaded", function () {
  BlissedCart.updateUI();
});

// Add CSS for notifications
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = BlissedCart;
}
