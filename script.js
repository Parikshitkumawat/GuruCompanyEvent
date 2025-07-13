// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all functionality
  initMobileMenu()
  initScrollAnimations()
  initCounters()
  initFormValidation()
  initSmoothScrolling()
  setActiveNavLink()
})

// Mobile Menu Functionality
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const mobileMenu = document.querySelector(".mobile-menu")
  const mobileMenuClose = document.querySelector(".mobile-menu-close")
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-menu .nav-link")

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.add("active")
      document.body.style.overflow = "hidden"
    })

    mobileMenuClose.addEventListener("click", () => {
      mobileMenu.classList.remove("active")
      document.body.style.overflow = ""
    })

    // Close menu when clicking on a link
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active")
        document.body.style.overflow = ""
      })
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenu.classList.remove("active")
        document.body.style.overflow = ""
      }
    })
  }
}

// Scroll Animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  }, observerOptions)

  // Observe all animation elements
  const animatedElements = document.querySelectorAll(".fade-in, .slide-in-left, .slide-in-right")
  animatedElements.forEach((el) => observer.observe(el))
}

// Counter Animation
function initCounters() {
  const counters = document.querySelectorAll(".stat-number")

  const countUp = (element, target) => {
    let current = 0
    const increment = target / 100
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }

      // Format number based on target
      if (target >= 1000) {
        element.textContent = Math.floor(current / 100) + "+"
      } else if (target >= 100) {
        element.textContent = Math.floor(current) + "+"
      } else {
        element.textContent = Math.floor(current) + "+"
      }
    }, 20)
  }

    //  we will change ----   if (target >= 1000) {
    //     element.textContent = Math.floor(current / 1000) + "K+"
    //   } else if (target >= 100) {
    //     element.textContent = Math.floor(current) + "%"
    //   } else {
    //     element.textContent = Math.floor(current) + "+"
    //   }
    // }, 20)

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = Number.parseInt(entry.target.dataset.target)
        countUp(entry.target, target)
        observer.unobserve(entry.target)
      }
    })
  })

  counters.forEach((counter) => observer.observe(counter))
}

// Form Validation
function initFormValidation() {
  const forms = document.querySelectorAll("form")

  forms.forEach((form) => {
    form.addEventListener("submit", handleFormSubmit)

    // Real-time validation
    const inputs = form.querySelectorAll(".form-control")
    inputs.forEach((input) => {
      input.addEventListener("blur", () => validateField(input))
      input.addEventListener("input", () => clearError(input))
    })
  })
}

function validateField(field) {
  const value = field.value.trim()
  const fieldName = field.name
  let isValid = true
  let errorMessage = ""

  // Clear previous errors
  clearError(field)

  // Required field validation
  if (field.hasAttribute("required") && !value) {
    isValid = false
    errorMessage = `${getFieldLabel(fieldName)} is required.`
  }

  // Email validation
  if (fieldName === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      isValid = false
      errorMessage = "Please enter a valid email address."
    }
  }

  // Phone validation
  if (fieldName === "phone" && value) {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
    if (!phoneRegex.test(value.replace(/[\s\-$$$$]/g, ""))) {
      isValid = false
      errorMessage = "Please enter a valid phone number."
    }
  }

  if (!isValid) {
    showError(field, errorMessage)
  }

  return isValid
}

function showError(field, message) {
  field.classList.add("error")
  let errorElement = field.parentNode.querySelector(".error-message")
  if (!errorElement) {
    errorElement = document.createElement("div")
    errorElement.className = "error-message"
    field.parentNode.appendChild(errorElement)
  }
  errorElement.textContent = message
  errorElement.style.display = "block"
}

function clearError(field) {
  field.classList.remove("error")
  const errorElement = field.parentNode.querySelector(".error-message")
  if (errorElement) {
    errorElement.style.display = "none"
  }
}

function getFieldLabel(fieldName) {
  const labels = {
    name: "Name",
    email: "Email",
    phone: "Phone",
    eventType: "Event Type",
    budget: "Budget",
    message: "Message",
    date: "Date",
  }
  return labels[fieldName] || fieldName
}

async function handleFormSubmit(e) {
  e.preventDefault()

  const form = e.target
  const formData = new FormData(form)
  const submitBtn = form.querySelector('button[type="submit"]')
  const originalBtnText = submitBtn.innerHTML

  // Validate all fields
  const inputs = form.querySelectorAll(".form-control[required]")
  let isFormValid = true

  inputs.forEach((input) => {
    if (!validateField(input)) {
      isFormValid = false
    }
  })

  if (!isFormValid) {
    return
  }

  // Show loading state
  submitBtn.innerHTML = '<span class="loading"></span> Sending...'
  submitBtn.disabled = true

  try {
    // Using Formspree for form submission
    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })

    if (response.ok) {
      showSuccessMessage(form)
      form.reset()
    } else {
      throw new Error("Form submission failed")
    }
  } catch (error) {
    showErrorMessage(form, "Sorry, there was an error sending your message. Please try again.")
  } finally {
    submitBtn.innerHTML = originalBtnText
    submitBtn.disabled = false
  }
}

function showSuccessMessage(form) {
  let successElement = form.querySelector(".success-message")
  if (!successElement) {
    successElement = document.createElement("div")
    successElement.className = "success-message"
    form.insertBefore(successElement, form.firstChild)
  }
  successElement.textContent = "Thank you! Your message has been sent successfully. We'll get back to you soon."
  successElement.style.display = "block"

  setTimeout(() => {
    successElement.style.display = "none"
  }, 5000)
}

function showErrorMessage(form, message) {
  let errorElement = form.querySelector(".form-error-message")
  if (!errorElement) {
    errorElement = document.createElement("div")
    errorElement.className = "error-message form-error-message"
    form.insertBefore(errorElement, form.firstChild)
  }
  errorElement.textContent = message
  errorElement.style.display = "block"

  setTimeout(() => {
    errorElement.style.display = "none"
  }, 5000)
}

// Smooth Scrolling
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]')

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const targetId = link.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        const headerHeight = document.querySelector(".header").offsetHeight
        const targetPosition = targetElement.offsetTop - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })
}

// Set Active Navigation Link
function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html"
  const navLinks = document.querySelectorAll(".nav-link")

  navLinks.forEach((link) => {
    const href = link.getAttribute("href")
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active")
    }
  })
}

// Utility Functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Image Lazy Loading
function initLazyLoading() {
  const images = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}

// Initialize lazy loading if images with data-src exist
if (document.querySelectorAll("img[data-src]").length > 0) {
  initLazyLoading()
}
