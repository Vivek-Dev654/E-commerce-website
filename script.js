/* =====================================================
   SHOPEASE — script.js
   Beginner-friendly JavaScript using:
   arrays, objects, functions, addEventListener,
   DOM manipulation, querySelector, innerHTML, localStorage
===================================================== */

/* ---------- 1. PRODUCT DATA ---------- */
/* Each product is a simple object stored inside an array */
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "electronics",
    price: 2499,
    rating: 4.5,
    img: "headphone.webp"
  },
  {
    id: 2,
    name: "Smart Watch",
    category: "electronics",
    price: 3999,
    rating: 4.3,
    img: "smartwatch.webp"
  },
  {
    id: 3,
    name: "Running Shoes",
    category: "fashion",
    price: 1899,
    rating: 4.6,
    img: "runningshoe.jpg"
  },
  {
    id: 4,
    name: "Casual T-Shirt",
    category: "fashion",
    price: 599,
    rating: 4.2,
    img: "t-shirt.webp"
  },
  {
    id: 5,
    name: "Backpack",
    category: "accessories",
    price: 1299,
    rating: 4.4,
    img: "backpack.webp"
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    category: "electronics",
    price: 1799,
    rating: 4.1,
    img: "speaker.webp"
  },
  {
    id: 7,
    name: "Coffee Mug",
    category: "home",
    price: 299,
    rating: 4.7,
    img: "coffe mug.jpg"
  },
  {
    id: 8,
    name: "Mobile Stand",
    category: "accessories",
    price: 399,
    rating: 4.0,
    img: "phone-stand.webp"
  }
];

/* Category list used to build the category cards */
const categories = [
  { id: "electronics", name: "Electronics", icon: "📱" },
  { id: "fashion", name: "Fashion", icon: "👗" },
  { id: "home", name: "Home", icon: "🏠" },
  { id: "accessories", name: "Accessories", icon: "🎒" }
];

/* ---------- 2. STATE VARIABLES ---------- */
let cart = [];              // Holds objects like { id, name, price, img, qty }
let activeCategory = "all"; // Currently selected category filter
let searchQuery = "";       // Currently typed search text

/* ---------- 3. GRAB DOM ELEMENTS ---------- */
const categoryGrid = document.querySelector("#categoryGrid");
const productGrid = document.querySelector("#productGrid");
const resultsInfo = document.querySelector("#resultsInfo");
const noResultsMsg = document.querySelector("#noResults");
const resetFilterBtn = document.querySelector("#resetFilterBtn");

const searchInput = document.querySelector("#searchInput");

const themeToggle = document.querySelector("#themeToggle");

const cartBtn = document.querySelector("#cartBtn");
const cartCount = document.querySelector("#cartCount");
const cartSidebar = document.querySelector("#cartSidebar");
const cartOverlay = document.querySelector("#cartOverlay");
const closeCartBtn = document.querySelector("#closeCartBtn");
const cartItemsBox = document.querySelector("#cartItems");
const cartTotalEl = document.querySelector("#cartTotal");
const emptyCartMsg = document.querySelector("#emptyCartMsg");
const continueShoppingBtn = document.querySelector("#continueShoppingBtn");
const clearCartBtn = document.querySelector("#clearCartBtn");
const checkoutBtn = document.querySelector("#checkoutBtn");

const hamburgerBtn = document.querySelector("#hamburgerBtn");
const navLinks = document.querySelector("#navLinks");

const shopNowBtn = document.querySelector("#shopNowBtn");
const exploreCatBtn = document.querySelector("#exploreCatBtn");

const contactForm = document.querySelector("#contactForm");
const contactSuccess = document.querySelector("#contactSuccess");

/* =====================================================
   4. THEME (DARK / LIGHT MODE)
===================================================== */

// Apply a theme name ("light" or "dark") to the page
function applyTheme(theme) {
  if (theme === "dark") {
    document.body.setAttribute("data-theme", "dark");
    themeToggle.textContent = "☀️";
  } else {
    document.body.removeAttribute("data-theme");
    themeToggle.textContent = "🌙";
  }
}

// On page load, read the saved theme from localStorage (default: light)
function initTheme() {
  const savedTheme = localStorage.getItem("shopease-theme") || "light";
  applyTheme(savedTheme);
}

// Toggle between light and dark, then save the choice
themeToggle.addEventListener("click", function () {
  const isDark = document.body.getAttribute("data-theme") === "dark";
  const newTheme = isDark ? "light" : "dark";
  applyTheme(newTheme);
  localStorage.setItem("shopease-theme", newTheme);
});

/* =====================================================
   5. RENDER CATEGORIES
===================================================== */

function renderCategories() {
  let html = "";

  categories.forEach(function (cat) {
    html += `
      <div class="category-card" data-category="${cat.id}">
        <div class="icon">${cat.icon}</div>
        <h3>${cat.name}</h3>
      </div>
    `;
  });

  categoryGrid.innerHTML = html;

  // Add a click listener to every category card
  const cards = document.querySelectorAll(".category-card");
  cards.forEach(function (card) {
    card.addEventListener("click", function () {
      const chosenCategory = card.getAttribute("data-category");
      activeCategory = chosenCategory;
      searchQuery = "";
      searchInput.value = "";
      highlightActiveCategory();
      renderProducts();
      document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
    });
  });
}

// Adds the "active" CSS class to the selected category card
function highlightActiveCategory() {
  const cards = document.querySelectorAll(".category-card");
  cards.forEach(function (card) {
    if (card.getAttribute("data-category") === activeCategory) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  });
}

/* =====================================================
   6. RENDER PRODUCTS (with search + category filtering)
===================================================== */

// Build a simple star rating string, e.g. "★★★★☆"
function getStarString(rating) {
  const fullStars = Math.round(rating);
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += i <= fullStars ? "★" : "☆";
  }
  return stars;
}

function renderProducts() {
  // Step 1: filter by category
  let filtered = products.filter(function (product) {
    return activeCategory === "all" || product.category === activeCategory;
  });

  // Step 2: filter by search text (case-insensitive)
  if (searchQuery.trim() !== "") {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(function (product) {
      return product.name.toLowerCase().includes(query);
    });
  }

  // Step 3: update the "Showing X products" text
  if (activeCategory === "all" && searchQuery.trim() === "") {
    resultsInfo.textContent = "Showing all products";
  } else {
    resultsInfo.textContent = `Showing ${filtered.length} product(s)`;
  }

  // Step 4: handle "no products found"
  if (filtered.length === 0) {
    productGrid.innerHTML = "";
    noResultsMsg.style.display = "block";
    return;
  }
  noResultsMsg.style.display = "none";

  // Step 5: build the product cards HTML
  let html = "";
  filtered.forEach(function (product) {
    html += `
      <div class="product-card">
        <img src="${product.img}" alt="${product.name}" />
        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <h3 class="product-name">${product.name}</h3>
          <div class="product-rating">
            ${getStarString(product.rating)} <span>(${product.rating})</span>
          </div>
          <div class="product-price">₹${product.price}</div>
        </div>
        <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
      </div>
    `;
  });

  productGrid.innerHTML = html;

  // Step 6: attach "Add to Cart" listeners to the new buttons
  const addButtons = document.querySelectorAll(".add-to-cart-btn");
  addButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const productId = Number(btn.getAttribute("data-id"));
      addToCart(productId);
    });
  });
}

// "Show All" button clears filters and search
resetFilterBtn.addEventListener("click", function () {
  activeCategory = "all";
  searchQuery = "";
  searchInput.value = "";
  highlightActiveCategory();
  renderProducts();
});

/* =====================================================
   7. SEARCH BOX
===================================================== */

searchInput.addEventListener("input", function () {
  searchQuery = searchInput.value;
  // Typing a search resets the category filter to "all"
  activeCategory = "all";
  highlightActiveCategory();
  renderProducts();
});

/* =====================================================
   8. SHOPPING CART
===================================================== */

function addToCart(productId) {
  // Find the product object from the products array
  const product = products.find(function (p) {
    return p.id === productId;
  });

  if (!product) return;

  // Check if this product is already in the cart
  const existingItem = cart.find(function (item) {
    return item.id === productId;
  });

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      qty: 1
    });
  }

  updateCartUI();
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter(function (item) {
    return item.id !== productId;
  });
  updateCartUI();
}

function changeQty(productId, amount) {
  const item = cart.find(function (i) {
    return i.id === productId;
  });
  if (!item) return;

  item.qty += amount;

  if (item.qty <= 0) {
    removeFromCart(productId);
  } else {
    updateCartUI();
  }
}

function clearCart() {
  cart = [];
  updateCartUI();
}

// Rebuilds the cart sidebar HTML and totals based on the `cart` array
function updateCartUI() {
  // Total number of items (sum of all quantities)
  const totalItems = cart.reduce(function (sum, item) {
    return sum + item.qty;
  }, 0);
  cartCount.textContent = totalItems;

  // Total price
  const totalPrice = cart.reduce(function (sum, item) {
    return sum + item.price * item.qty;
  }, 0);
  cartTotalEl.textContent = `₹${totalPrice}`;

  // Empty cart message
  if (cart.length === 0) {
    cartItemsBox.innerHTML = "";
    emptyCartMsg.style.display = "block";
    return;
  }
  emptyCartMsg.style.display = "none";

  // Build cart item rows
  let html = "";
  cart.forEach(function (item) {
    html += `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}" />
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>₹${item.price} x ${item.qty}</p>
          <div class="qty-controls">
            <button class="qty-btn" data-id="${item.id}" data-amount="-1">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" data-id="${item.id}" data-amount="1">+</button>
          </div>
        </div>
        <button class="remove-item-btn" data-id="${item.id}" title="Remove">🗑️</button>
      </div>
    `;
  });

  cartItemsBox.innerHTML = html;

  // Attach listeners for quantity buttons
  document.querySelectorAll(".qty-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const id = Number(btn.getAttribute("data-id"));
      const amount = Number(btn.getAttribute("data-amount"));
      changeQty(id, amount);
    });
  });

  // Attach listeners for remove buttons
  document.querySelectorAll(".remove-item-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const id = Number(btn.getAttribute("data-id"));
      removeFromCart(id);
    });
  });
}

/* ---------- Cart sidebar open / close ---------- */
function openCart() {
  cartSidebar.classList.add("open");
  cartOverlay.classList.add("show");
}

function closeCart() {
  cartSidebar.classList.remove("open");
  cartOverlay.classList.remove("show");
}

cartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
continueShoppingBtn.addEventListener("click", closeCart);

clearCartBtn.addEventListener("click", function () {
  clearCart();
});

checkoutBtn.addEventListener("click", function () {
  if (cart.length === 0) {
    alert("Your cart is empty. Add some products first!");
    return;
  }
  alert("Thank you for shopping with ShopEase!");
  clearCart();
  closeCart();
});

/* =====================================================
   9. MOBILE NAVBAR (HAMBURGER MENU)
===================================================== */

hamburgerBtn.addEventListener("click", function () {
  navLinks.classList.toggle("open");
});

// Close the mobile menu whenever a nav link is clicked
document.querySelectorAll(".nav-links a").forEach(function (link) {
  link.addEventListener("click", function () {
    navLinks.classList.remove("open");
  });
});

/* =====================================================
   10. HERO BUTTONS
===================================================== */

shopNowBtn.addEventListener("click", function () {
  document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
});

exploreCatBtn.addEventListener("click", function () {
  document.querySelector("#categories").scrollIntoView({ behavior: "smooth" });
});

/* =====================================================
   11. FOOTER CATEGORY LINKS
===================================================== */

document.querySelectorAll("[data-footer-cat]").forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    activeCategory = link.getAttribute("data-footer-cat");
    highlightActiveCategory();
    renderProducts();
    document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
  });
});

/* =====================================================
   12. CONTACT FORM
===================================================== */

contactForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Stop the page from reloading

  // In a real project this would send data to a server.
  // Here we just show a success message (no backend required).
  contactSuccess.textContent = "Thank you! Your message has been received.";
  contactSuccess.style.display = "block";

  contactForm.reset();

  // Hide the message again after a few seconds
  setTimeout(function () {
    contactSuccess.style.display = "none";
  }, 4000);
});

/* =====================================================
   13 INITIAL PAGE LOAD.
===================================================== */

function init() {
  initTheme();
  renderCategories();
  renderProducts();
  updateCartUI();
}

init();