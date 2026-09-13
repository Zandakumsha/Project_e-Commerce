<template>
  <aside class="sidebar">
    <div class="sidebar_brand">
      <div class="sidebar_brand-icon">
        <img :src="logo" alt="WeConnect logo" class="sidebar_brand-logo" />
      </div>
      <div class="sidebar_brand-text">
        <h2>WeConnect</h2>
        <span>SUPPLIER NETWORK</span>
      </div>
    </div>

    <nav class="sidebar_navigation">
      <RouterLink to="/dashboard" class="sidebar_nav-item" exact-active-class="sidebar_nav-item--active">
        <span class="sidebar_nav-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14.5h7V20H4zm9-11h7v7h-7zm0 9h7v7h-7zM4 4h7v7H4z"/></svg>
        </span>
        <span>Dashboard</span>
        <span class="sidebar_notification-dot"></span>
      </RouterLink>

      <RouterLink to="/products" class="sidebar_nav-item" exact-active-class="sidebar_nav-item--active">
        <span class="sidebar_nav-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6.5A2.5 2.5 0 0 1 8.5 4h7A2.5 2.5 0 0 1 18 6.5v11A2.5 2.5 0 0 1 15.5 20h-7A2.5 2.5 0 0 1 6 17.5zm2.5-.5a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-.5-.5zm1.5 3h4v2h-4zm0 4h6v2h-6z"/></svg>
        </span>
        <span>Products</span>
        <span class="sidebar_notification-dot"></span>
      </RouterLink>

      <RouterLink to="/orders" class="sidebar_nav-item" exact-active-class="sidebar_nav-item--active">
        <span class="sidebar_nav-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 4h10M7 12h6M7 16h8"/></svg>
        </span>
        <span>Orders</span>
        <span class="sidebar_notification-dot"></span>
      </RouterLink>

      <RouterLink to="/stockmanagement" class="sidebar_nav-item" exact-active-class="sidebar_nav-item--active">
        <span class="sidebar_nav-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5zm8 1.5 6.2-3.5L12 3.5 5.8 6.5zm-6 3.7 5 2.8v3.2l-5-2.8zm12 0v3.2l-5 2.8v-3.2z"/></svg>
        </span>
        <span>Stock Management</span>
        <span class="sidebar_notification-dot"></span>
      </RouterLink>

      <RouterLink to="/deliveries" class="sidebar_nav-item" exact-active-class="sidebar_nav-item--active">
        <span class="sidebar_nav-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h10v8H3zm12 0h3l3 4v4h-2.5A2.5 2.5 0 0 1 16 17.5 2.5 2.5 0 0 1 13.5 15H12V7h3zm-1 10.5A1.5 1.5 0 0 0 13.5 19 1.5 1.5 0 0 0 15 17.5 1.5 1.5 0 0 0 13.5 16 1.5 1.5 0 0 0 12 17.5zM5 9.5h6v3H5z"/></svg>
        </span>
        <span>Deliveries</span>
        <span class="sidebar_notification-dot"></span>
      </RouterLink>

      <RouterLink to="/reviews" class="sidebar_nav-item" exact-active-class="sidebar_nav-item--active">
        <span class="sidebar_nav-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 17.3 5.4 3.2-1.5-6.2L21 9.4l-6.3-.6L12 3l-2.7 5.8L3 9.4l4.9 4.9-1.5 6.2z"/></svg>
        </span>
        <span>Reviews</span>
        <span class="sidebar_notification-dot"></span>
      </RouterLink>

      <RouterLink to="/profile" class="sidebar_nav-item" exact-active-class="sidebar_nav-item--active">
        <span class="sidebar_nav-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12.5A3.5 3.5 0 1 0 12 5.5a3.5 3.5 0 0 0 0 7zm-7 6.5a7 7 0 0 1 14 0v1H5zm15-11.5h2v2h-2v2h-2v-2h-2V7.5h2v-2h2z"/></svg>
        </span>
        <span>Business Profile</span>
        <span class="sidebar_notification-dot"></span>
      </RouterLink>
    </nav>

    <button class="sidebar_logout" @click="logout">
      <span class="sidebar_logout-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7V5a3 3 0 0 1 3-3h5a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3h-5a3 3 0 0 1-3-3v-2h2v2a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-5a1 1 0 0 0-1 1v2zm-1.5 6.5h8v2h-8v2.5L3 12l4.5-6v2.5z"/></svg>
      </span>
      <span>Log out</span>
    </button>
  </aside>
</template>

<script setup>
import logo from '../assets/link-icon-white.png'
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/products')
}
</script>

<style scoped>
/* ========================================================= SIDEBAR ========================================================= */
.sidebar {
  width: 250px;
  height: 100vh;
  position: sticky;
  top: 0;
  left: 0;
  background: #523a33;
  color: #c9b7ae;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  z-index: 1000;
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
}

/* ========================================================= BRAND ========================================================= */
.sidebar_brand {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 6px 10px;
  margin-bottom: 42px;
  flex-shrink: 0;
}

.sidebar_brand-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-size: 21px;
  line-height: 1;
  flex-shrink: 0;
}

.sidebar_brand-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.sidebar_brand-text {
  display: flex;
  flex-direction: column;
}

.sidebar_brand-text h2 {
  margin: 0;
  color: #ffffff;
  font-family: Georgia, serif;
  font-size: 21px;
  font-weight: 600;
  line-height: 1.1;
}

.sidebar_brand-text span {
  margin-top: 6px;
  color: #bdaaa1;
  font-family: figtree;
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 1.4px;
}

/* ========================================================= NAVIGATION ========================================================= */
.sidebar_navigation {

  display: flex;
  flex-direction: column;
  gap: 7px;
  flex: 1;
}

/* ========================================================= NAVIGATION ITEMS ========================================================= */
.sidebar_nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  min-height: 48px;
  padding: 0 15px;
  box-sizing: border-box;
  border-radius: 10px;
  color: #c9b7ae;
  text-decoration: none;
  font-family: figtree;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

/* ========================================================= HOVER ========================================================= */
.sidebar_nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  transform: translateX(2px);
}

/* ========================================================= EXACT ACTIVE PAGE ========================================================= */
/* IMPORTANT: We use the custom exact-active-class: sidebar_nav-item--active instead of router-link-active. This prevents a parent route such as: /products from remaining active when the user is on: /products/add /products/edit /products/details Only the exact route receives the active styling. */
.sidebar_nav-item--active {
  background: #684d45;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* ========================================================= ACTIVE ICON ========================================================= */
.sidebar_nav-item--active .sidebar_nav-icon {
  color: #ffffff;
}

/* ========================================================= NAVIGATION ICON ========================================================= */
.sidebar_nav-icon {
  width: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bba99f;
  flex-shrink: 0;
}

.sidebar_nav-icon svg,
.sidebar_logout-icon svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* ========================================================= NOTIFICATION DOT ========================================================= */
/* Hidden by default. */
.sidebar_notification-dot {
  display: none;
  width: 7px;
  height: 7px;
  margin-left: auto;
  border-radius: 50%;
  background: #e79b63;
  flex-shrink: 0;
}

/* Show the dot ONLY on the EXACT active route. */
.sidebar_nav-item--active .sidebar_notification-dot {
  display: block;
}

/* ========================================================= LOGOUT ========================================================= */
.sidebar_logout {
  margin-top: auto;
  width: 100%;
  min-height: 52px;
  padding: 14px 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  background: transparent;
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #c9b7ae;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease;
  flex-shrink: 0;
}

.sidebar_logout:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}

.sidebar_logout-icon {
  width: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
}

/* ========================================================= TABLET ========================================================= */
@media (max-width: 900px) {
  .sidebar {
    width: 220px;
    padding: 22px 16px;
  }

  .sidebar_brand-text h2 {
    font-size: 19px;
  }

  .sidebar_nav-item {
    min-height: 46px;
    font-size: 13px;
  }

  .sidebar_nav-icon {
    font-size: 17px;
  }
}

/* ========================================================= MOBILE ========================================================= */
@media (max-width: 700px) {
  .sidebar {
    position: relative;
    top: auto;
    left: auto;
    width: 100%;
    height: auto;
    min-height: auto;
    padding: 14px 16px;
    overflow-y: visible;
    overflow-x: hidden;
  }

  .sidebar_brand {
    margin-bottom: 18px;
  }

  .sidebar_brand-icon {
    width: 34px;
    height: 34px;
    font-size: 19px;
  }

  .sidebar_brand-logo {
    width: 34px;
    height: 34px;
  }

  .sidebar_brand-text h2 {
    font-size: 19px;
  }

  .sidebar_navigation {
    flex-direction: row;
    overflow-x: auto;
    gap: 8px;
    padding-bottom: 5px;
    flex: none;
    scrollbar-width: none;
  }

  .sidebar_navigation::-webkit-scrollbar {
    display: none;
  }

  .sidebar_nav-item {
    width: auto;
    min-width: max-content;
    min-height: 44px;
    padding: 0 14px;
    gap: 9px;
    font-size: 13px;
  }

  .sidebar_nav-icon {
    width: 19px;
    font-size: 16px;
  }

  .sidebar_logout {
    display: none;
  }
}

/* ========================================================= SMALL MOBILE ========================================================= */
@media (max-width: 450px) {
  .sidebar {
    padding: 12px;
  }

  .sidebar_brand {
    padding: 4px;
  }

  .sidebar_navigation {
    gap: 6px;
  }

  .sidebar_nav-item {
    padding: 0 12px;
    min-height: 42px;
  }
}
</style>
