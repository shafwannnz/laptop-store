// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById("mobileMenuBtn")
const mobileMenu = document.getElementById("mobileMenu")

mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("active")
})

// Close mobile menu when clicking on a link
const mobileMenuLinks = mobileMenu.querySelectorAll("a")
mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active")
  })
})

// Scroll Functions
function scrollToProducts() {
  document.getElementById("products").scrollIntoView({ behavior: "smooth" })
}

function scrollToContact() {
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" })
}

// WhatsApp Function
function openWhatsApp() {
  const phoneNumber = "6281234567890" // Ganti dengan nomor WhatsApp Anda
  const message = "Halo Zakk Store! Saya tertarik dengan produk laptop Anda. Bisa konsultasi?"
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  window.open(url, "_blank")
}

// Form Submit
function handleFormSubmit(event) {
  event.preventDefault()
  const form = event.target
  const formData = new FormData(form)

  // Get form values
  const name = form.querySelector('input[type="text"]').value
  const email = form.querySelector('input[type="email"]').value
  const phone = form.querySelector('input[type="tel"]').value
  const message = form.querySelector("textarea").value

  // Create WhatsApp message
  const whatsappMessage = `Halo Zakk Store!\n\nNama: ${name}\nEmail: ${email}\nNo. WhatsApp: ${phone}\n\nPesan: ${message}`

  // Open WhatsApp with message
  const phoneNumber = "6281234567890"
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`
  window.open(url, "_blank")

  // Reset form
  form.reset()
}

// Fade In Animation on Scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible")
    }
  })
}, observerOptions)

document.querySelectorAll(".fade-in").forEach((el) => {
  observer.observe(el)
})

// Navbar Shadow on Scroll
window.addEventListener("scroll", () => {
  const nav = document.querySelector("nav")
  if (window.scrollY > 0) {
    nav.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)"
  } else {
    nav.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.05)"
  }
})

// Initialize Lucide Icons
const lucide = window.lucide
if (lucide) {
  lucide.createIcons()
} else {
  console.error("Lucide icons library is not loaded.")
}

document.addEventListener("DOMContentLoaded", () => {
  loadCart()
})

let cart = []

// Load cart from localStorage on page load
function loadCart() {
  const savedCart = localStorage.getItem("zakkStoreCart")
  if (savedCart) {
    cart = JSON.parse(savedCart)
    updateCartUI()
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("zakkStoreCart", JSON.stringify(cart))
}

// Add product to cart
function addToCartProduct(product) {
  const existingItem = cart.find((item) => item.id === product.id)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      ...product,
      quantity: 1,
    })
  }

  saveCart()
  updateCartUI()

  // Show notification
  showNotification(`${product.name} ditambahkan ke keranjang!`)

  // Auto open cart
  setTimeout(() => {
    toggleCart()
  }, 500)
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  saveCart()
  updateCartUI()
}

// Update item quantity
function updateQuantity(productId, newQuantity) {
  if (newQuantity <= 0) {
    removeFromCart(productId)
    return
  }

  const item = cart.find((item) => item.id === productId)
  if (item) {
    item.quantity = newQuantity
    saveCart()
    updateCartUI()
  }
}

// Calculate total price
function calculateTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0)
}

// Format currency to Rupiah
function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

// Update cart UI
function updateCartUI() {
  const cartItemsContainer = document.getElementById("cartItems")
  const cartBadge = document.getElementById("cartBadge")
  const cartTotal = document.getElementById("cartTotal")

  // Update badge
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  if (totalItems > 0) {
    cartBadge.textContent = totalItems
    cartBadge.classList.remove("hidden")
  } else {
    cartBadge.classList.add("hidden")
  }

  // Update total
  const total = calculateTotal()
  cartTotal.textContent = formatCurrency(total)

  // Update items display
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="text-gray-500 text-center py-8">Keranjang Anda kosong</p>'
  } else {
    cartItemsContainer.innerHTML = cart
      .map(
        (item) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-content">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatCurrency(item.price)}</div>
          <div class="cart-item-controls">
            <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
            <span class="quantity-display">${item.quantity}</span>
            <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Hapus</button>
          </div>
        </div>
      </div>
    `,
      )
      .join("")
  }
}

// Toggle cart sidebar
function toggleCart() {
  const cartSidebar = document.getElementById("cartSidebar")
  const cartModal = document.getElementById("cartModal")

  cartSidebar.classList.toggle("active")
  cartModal.classList.toggle("active")
}

// Proceed to checkout
function proceedToCheckout() {
  if (cart.length === 0) {
    alert("Keranjang Anda kosong!")
    return
  }

  toggleCart()
  updateCheckoutUI()
  document.getElementById("checkoutModal").classList.remove("hidden")
}

// Close checkout
function closeCheckout() {
  document.getElementById("checkoutModal").classList.add("hidden")
}

// Update checkout UI
function updateCheckoutUI() {
  const checkoutItemsContainer = document.getElementById("checkoutItems")
  const checkoutTotal = document.getElementById("checkoutTotal")

  const total = calculateTotal()
  checkoutTotal.textContent = formatCurrency(total)

  checkoutItemsContainer.innerHTML = cart
    .map(
      (item) => `
    <div class="checkout-item">
      <span class="checkout-item-name">${item.name}</span>
      <span class="checkout-item-qty">x${item.quantity}</span>
      <span class="checkout-item-price">${formatCurrency(item.price * item.quantity)}</span>
    </div>
  `,
    )
    .join("")
}

// Handle checkout submit
function handleCheckoutSubmit(event) {
  event.preventDefault()

  const form = event.target
  const name = form.querySelector('input[type="text"]').value
  const email = form.querySelector('input[type="email"]').value
  const phone = form.querySelector('input[type="tel"]').value
  const address = form.querySelector("textarea").value

  // Create order summary
  const orderSummary = cart
    .map((item) => `${item.name} x${item.quantity} = ${formatCurrency(item.price * item.quantity)}`)
    .join("\n")

  const total = calculateTotal()

  const whatsappMessage = `Halo Zakk Store! 🛒\n\nSaya ingin melakukan pemesanan:\n\n${orderSummary}\n\n*Total: ${formatCurrency(total)}*\n\nData Pembeli:\nNama: ${name}\nEmail: ${email}\nNo. WhatsApp: ${phone}\nAlamat: ${address}\n\nTerima kasih!`

  const phoneNumber = "6287872429430" // Ganti dengan nomor WhatsApp Anda
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`

  window.open(url, "_blank")

  // Clear cart after checkout
  cart = []
  saveCart()
  updateCartUI()
  closeCheckout()

  showNotification("Pesanan Anda telah dikirim ke WhatsApp!")
}


// Show notification
function showNotification(message) {
  const notification = document.createElement("div")
  notification.className =
    "fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse"
  notification.textContent = message
  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 3000)
}
