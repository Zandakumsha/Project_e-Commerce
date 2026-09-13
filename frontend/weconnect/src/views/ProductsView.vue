<template>
  <section class="products-page">
    <div class="page-head">
      <div>
        <h1>Products</h1>
        <p>Manage your product catalog and pricing.</p>
      </div>
      <div class="head-actions">
        <RouterLink to="/add-products" class="btn btn-primary">+ Add product</RouterLink>
      </div>
    </div>

    <div class="panel">
      <div class="panel-head">
        <h3>All products</h3>
      </div>

      <div class="toolbar">
        <div class="search-wrap">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
          </svg>
          <input v-model="search" placeholder="Search products..." @input="page = 1" />
        </div>

        <div class="chip-row">
          <button
            v-for="f in ['All', 'In stock', 'Low stock', 'Out of stock']"
            :key="f"
            class="chip"
            :class="{ on: filter === f }"
            @click="setFilter(f)"
          >
            {{ f }}
          </button>
        </div>

        <div class="spacer" />
        <span class="result-count">{{ filtered.length }} result{{ filtered.length !== 1 ? 's' : '' }}</span>

        <div class="view-toggle">
          <button class="vt-btn" :class="{ on: view === 'list' }" title="List view" @click="setView('list')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
          </button>
          <button class="vt-btn" :class="{ on: view === 'grid' }" title="Card view" @click="setView('grid')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
        </div>
      </div>

      <!-- LIST VIEW -->
      <div v-if="view === 'list'" class="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th
                v-for="col in columns"
                :key="col.key"
                :class="{ sorted: sortKey === col.key }"
                @click="col.sortable && sortBy(col.key)"
              >
                {{ col.label }}
                <span v-if="col.sortable" class="sort">{{
                  sortKey === col.key ? (sortDir === 1 ? '▲' : '▼') : '▲'
                }}</span>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginated.length === 0" class="empty-row">
              <td :colspan="columns.length + 1">No results match your search.</td>
            </tr>
            <tr v-for="p in paginated" :key="p.id">
              <td>
                <div class="row-flex">
                  <div class="row-thumb">{{ p.img }}</div>
                  <span class="cell-main">{{ p.name }}</span>
                </div>
              </td>
              <td>{{ p.cat }}</td>
              <td>{{ fmtR(p.price) }}</td>
              <td>{{ p.stock }} units</td>
              <td><span class="badge" :class="badgeClass(p.status)">{{ p.status }}</span></td>
              <td class="actions-cell">
                <button class="icon-btn" title="Edit" @click="editStub(p)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
                  </svg>
                </button>
                <button class="icon-btn danger" title="Delete" @click="deleteProduct(p.id)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0-1 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 6" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- GRID VIEW -->
      <div v-else>
        <div v-if="paginated.length === 0" class="empty-grid">No results match your search.</div>
        <div v-else class="product-grid">
          <div v-for="p in paginated" :key="p.id" class="product-card">
            <div class="product-photo"><span class="emoji">{{ p.img }}</span></div>
            <div class="product-card-body">
              <h4>{{ p.name }}</h4>
              <div class="product-card-sub">{{ p.cat }} · SKU {{ p.sku }}</div>
              <div class="pc-track">
                <div class="pc-fill" :style="{ width: stockPct(p) + '%', background: stockColor(p) }" />
              </div>
              <div class="pc-stock-row">
                <span>{{ p.stock }} in stock</span>
                <span class="badge" :class="badgeClass(p.status)">{{ p.status }}</span>
              </div>
              <div class="pc-actions">
                <button class="btn btn-ghost btn-sm" @click="editStub(p)">View product</button>
                <button class="btn btn-ghost btn-sm" @click="restockStub(p)">Restock</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="pager">
        <span class="pager-info">
          Showing {{ filtered.length ? start + 1 : 0 }}–{{ Math.min(start + pageSize, filtered.length) }} of
          {{ filtered.length }}
        </span>
        <div class="pager-btns">
          <button class="pg-btn" :disabled="page <= 1" @click="page--">‹</button>
          <button
            v-for="p in totalPages"
            :key="p"
            class="pg-btn"
            :class="{ on: p === page }"
            @click="page = p"
          >
            {{ p }}
          </button>
          <button class="pg-btn" :disabled="page >= totalPages" @click="page++">›</button>
        </div>
      </div>
    </div>

    <!-- ADD PRODUCT MODAL -->
    <div class="overlay" :class="{ open: modalOpen }" @click.self="closeModal">
      <div class="modal">
        <div class="modal-head">
          <h3>Add product</h3>
          <button class="modal-x" @click="closeModal">✕</button>
        </div>
        <div class="modal-body">
          <div class="field" :class="{ error: errors.name }">
            <label>Product name</label>
            <input v-model="form.name" placeholder="e.g. Basmati Rice 5kg" />
            <div class="err">Enter a product name.</div>
          </div>
          <div class="field">
            <label>Category</label>
            <select v-model="form.cat" class="sel">
              <option v-for="c in categories" :key="c">{{ c }}</option>
            </select>
          </div>
          <div class="field" :class="{ error: errors.price }">
            <label>Price (ZAR)</label>
            <input v-model.number="form.price" type="number" placeholder="e.g. 249" />
            <div class="err">Enter a valid price.</div>
          </div>
          <div class="field" :class="{ error: errors.stock }">
            <label>Stock quantity</label>
            <input v-model.number="form.stock" type="number" placeholder="e.g. 120" />
            <div class="err">Enter a valid quantity.</div>
          </div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-ghost" @click="closeModal">Cancel</button>
          <button class="btn btn-primary" @click="submitProduct">Add product</button>
        </div>
      </div>
    </div>

    <div class="toast" :class="{ show: toast.visible }">{{ toast.message }}</div>
  </section>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { PRODUCT_STORAGE_KEY, DRAFT_STORAGE_KEY, readList, writeList } from '../utils/productStorage'

const router = useRouter()

/* ---------------- data ---------------- */
const categoryIcons = {
  'Grains & Cereals': '🌾',
  Spices: '🟤',
  Packaging: '📦',
  Beverages: '🥤',
  Dairy: '🧀',
}
const categories = Object.keys(categoryIcons)

const products = reactive(readList(PRODUCT_STORAGE_KEY, [
  { id: 1, name: 'Basmati Rice 5kg', cat: 'Grains & Cereals', sku: 'GC-101', price: 249, stock: 182, status: 'In stock', img: 'BR' },
  { id: 2, name: 'Turmeric Powder 500g', cat: 'Spices', sku: 'SP-044', price: 89, stock: 12, status: 'Low stock', img: 'TP' },
  { id: 3, name: 'Kraft Paper Bags (100pk)', cat: 'Packaging', sku: 'CF-088', price: 159, stock: 0, status: 'Out of stock', img: 'KB' },
  { id: 4, name: 'Cinnamon Sticks 250g', cat: 'Spices', sku: 'SP-057', price: 64, stock: 340, status: 'In stock', img: 'CS' },
  { id: 5, name: 'Sparkling Water 24pk', cat: 'Beverages', sku: 'BV-019', price: 210, stock: 58, status: 'In stock', img: 'SW' },
  { id: 6, name: 'Cheddar Cheese Block 2kg', cat: 'Dairy', sku: 'DY-032', price: 175, stock: 9, status: 'Low stock', img: 'CC' },
  { id: 7, name: 'Rolled Oats 10kg', cat: 'Grains & Cereals', sku: 'GC-118', price: 310, stock: 124, status: 'In stock', img: 'RO' },
  { id: 8, name: 'Compostable Cups (500pk)', cat: 'Packaging', sku: 'CF-140', price: 420, stock: 0, status: 'Out of stock', img: 'CU' },
  { id: 9, name: 'Black Peppercorns 1kg', cat: 'Spices', sku: 'SP-063', price: 195, stock: 76, status: 'In stock', img: 'BP' },
  { id: 10, name: 'Almond Milk 1L (12pk)', cat: 'Beverages', sku: 'BV-027', price: 288, stock: 41, status: 'In stock', img: 'AM' },
  { id: 11, name: 'Brown Lentils 25kg', cat: 'Grains & Cereals', sku: 'GC-129', price: 540, stock: 18, status: 'Low stock', img: 'BL' },
  { id: 12, name: 'Corrugated Boxes (Medium, 50pk)', cat: 'Packaging', sku: 'CF-102', price: 275, stock: 203, status: 'In stock', img: 'CB' },
]))

const columns = [
  { key: 'name', label: 'Product', sortable: true },
  { key: 'cat', label: 'Category', sortable: true },
  { key: 'price', label: 'Price', sortable: true },
  { key: 'stock', label: 'Stock', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
]

/* ---------------- toolbar state ---------------- */
const search = ref('')
const filter = ref('All')
const view = ref('list')
const sortKey = ref(null)
const sortDir = ref(1)
const page = ref(1)
const pageSize = computed(() => (view.value === 'grid' ? 6 : 6))

function setFilter(f) {
  filter.value = f
  page.value = 1
}
function setView(v) {
  view.value = v
  page.value = 1
}
function sortBy(key) {
  if (sortKey.value === key) sortDir.value *= -1
  else {
    sortKey.value = key
    sortDir.value = 1
  }
}

/* ---------------- derived lists ---------------- */
const filtered = computed(() => {
  let rows = products
  if (filter.value !== 'All') rows = rows.filter((r) => r.status === filter.value)
  if (search.value) {
    const q = search.value.toLowerCase()
    rows = rows.filter((r) => (r.name + ' ' + r.cat).toLowerCase().includes(q))
  }
  if (sortKey.value) {
    rows = [...rows].sort((a, b) => {
      const av = a[sortKey.value]
      const bv = b[sortKey.value]
      if (typeof av === 'string') return av.localeCompare(bv) * sortDir.value
      return (av - bv) * sortDir.value
    })
  }
  return rows
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)))
const start = computed(() => (page.value - 1) * pageSize.value)
const paginated = computed(() => filtered.value.slice(start.value, start.value + pageSize.value))

watch(totalPages, (tp) => {
  if (page.value > tp) page.value = tp
})

/* ---------------- helpers ---------------- */
function fmtR(n) {
  return 'R' + n.toLocaleString()
}
function badgeClass(status) {
  return (
    {
      'In stock': 'badge-green',
      'Low stock': 'badge-amber',
      'Out of stock': 'badge-red',
    }[status] || 'badge-gray'
  )
}
function stockPct(p) {
  return Math.min(100, Math.round((p.stock / 350) * 100))
}
function stockColor(p) {
  return p.stock === 0 ? 'var(--red)' : p.stock < 30 ? 'var(--amber)' : 'var(--green)'
}

/* ---------------- actions ---------------- */
function editStub(p) {
  showToast(`Edit ${p.name} — coming soon.`)
}
function restockStub(p) {
  showToast(`Restock request sent for ${p.name}.`)
}
function deleteProduct(id) {
  const p = products.find((x) => x.id === id)
  if (!p) return
  if (!confirm(`Remove "${p.name}" from your catalog?`)) return
  const idx = products.findIndex((x) => x.id === id)
  products.splice(idx, 1)
  showToast('Product removed')
}

/* ---------------- modal ---------------- */
const modalOpen = ref(false)
const form = reactive({ name: '', cat: categories[0], price: null, stock: null })
const errors = reactive({ name: false, price: false, stock: false })

function openModal() {
  form.name = ''
  form.cat = categories[0]
  form.price = null
  form.stock = null
  errors.name = errors.price = errors.stock = false
  modalOpen.value = true
}
function closeModal() {
  modalOpen.value = false
}
function submitProduct() {
  errors.name = !form.name.trim()
  errors.price = !(form.price > 0)
  errors.stock = !(form.stock >= 0)
  if (errors.name || errors.price || errors.stock) return

  const status = form.stock === 0 ? 'Out of stock' : form.stock < 30 ? 'Low stock' : 'In stock'
  products.unshift({
    id: Date.now(),
    name: form.name.trim(),
    cat: form.cat,
    price: form.price,
    stock: form.stock,
    status,
    sku: 'NEW-' + Math.floor(Math.random() * 900 + 100),
    img: categoryIcons[form.cat] || '📦',
  })
  closeModal()
  showToast(`"${form.name.trim()}" added to your catalog`)
}

/* ---------------- toast ---------------- */
const toast = reactive({ visible: false, message: '' })
let toastTimer = null

onMounted(() => {
  syncProductsFromStorage()
})

function syncProductsFromStorage() {
  const stored = readList(PRODUCT_STORAGE_KEY, [])
  if (stored.length) {
    products.splice(0, products.length, ...stored)
    writeList(PRODUCT_STORAGE_KEY, stored)
  }
}

function showToast(msg) {
  toast.message = msg
  toast.visible = true
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.visible = false), 2600)
}
</script>

<style scoped>
.products-page {
  --brown-900: #3c2b26;
  --brown-800: #523a33;
  --brown-700: #684d45;
  --brown-600: #7c5f55;
  --cream: #f7f5f2;
  --cream-card: #ffffff;
  --line: #e7e0d8;
  --line-soft: #f0ebe4;
  --ink: #2c211d;
  --ink-soft: #6b5d56;
  --ink-mute: #a89a92;
  --orange: #e0793c;
  --orange-dark: #c9631f;
  --green: #3f7a53;
  --green-tint: #e5f2e8;
  --amber: #b8842a;
  --amber-tint: #faf0dd;
  --red: #c14a3f;
  --red-tint: #faeae7;
  --radius: 12px;
  --shadow: 0 1px 2px rgba(60, 43, 38, 0.04), 0 4px 16px rgba(60, 43, 38, 0.05);
  padding: 28px 34px 60px;
  font-family: 'Figtree', 'Segoe UI', Inter, system-ui, -apple-system, sans-serif;
  color: var(--ink);
  font-size: 14px;
}
h1, h3, h4 { font-family: Georgia, 'Times New Roman', serif; }

.page-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 22px; flex-wrap: wrap; }
.page-head h1 { font-size: 24px; margin: 0 0 5px; color: var(--brown-900); font-weight: 600; }
.page-head p { margin: 0; color: var(--ink-soft); font-size: 13.5px; }

.btn { display: inline-flex; align-items: center; gap: 7px; border-radius: 9px; border: 1px solid transparent; padding: 10px 16px; font-size: 13.5px; font-weight: 600; cursor: pointer; white-space: nowrap; font-family: inherit; }
.btn-primary { background: var(--orange); color: #fff; }
.btn-primary:hover { background: var(--orange-dark); }
.btn-ghost { background: #fff; border-color: var(--line); color: var(--brown-900); }
.btn-ghost:hover { border-color: var(--brown-600); }
.btn-sm { padding: 7px 11px; font-size: 12.5px; border-radius: 7px; }

.icon-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--line); background: #fff; display: inline-flex; align-items: center; justify-content: center; color: var(--ink-soft); cursor: pointer; }
.icon-btn:hover { border-color: var(--brown-600); color: var(--brown-900); }
.icon-btn.danger:hover { border-color: var(--red); color: var(--red); }

.panel { background: var(--cream-card); border-radius: var(--radius); border: 1px solid var(--line); box-shadow: var(--shadow); overflow: hidden; }
.panel-head { padding: 16px 20px; border-bottom: 1px solid var(--line-soft); }
.panel-head h3 { margin: 0; font-size: 15px; font-weight: 600; color: var(--brown-900); }

.toolbar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding: 14px 20px; border-bottom: 1px solid var(--line-soft); }
.search-wrap { position: relative; flex: 1; min-width: 180px; max-width: 320px; }
.search-wrap svg { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--ink-mute); }
.search-wrap input { width: 100%; padding: 9px 12px 9px 34px; border-radius: 8px; border: 1px solid var(--line); background: var(--cream); font-size: 13px; color: var(--ink); outline: none; font-family: inherit; }
.search-wrap input:focus { border-color: var(--orange); background: #fff; }
.chip-row { display: flex; gap: 7px; flex-wrap: wrap; }
.chip { padding: 6px 13px; border-radius: 20px; border: 1px solid var(--line); background: #fff; font-size: 12.5px; font-weight: 600; color: var(--ink-soft); cursor: pointer; }
.chip:hover { border-color: var(--brown-600); }
.chip.on { background: var(--brown-800); border-color: var(--brown-800); color: #fff; }
.spacer { flex: 1; }
.result-count { font-size: 12.5px; color: var(--ink-mute); }

.view-toggle { display: flex; gap: 2px; background: var(--cream); padding: 3px; border-radius: 9px; border: 1px solid var(--line); flex-shrink: 0; }
.vt-btn { width: 32px; height: 28px; border: none; background: transparent; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: var(--ink-mute); cursor: pointer; }
.vt-btn:hover { color: var(--brown-800); }
.vt-btn.on { background: #fff; color: var(--brown-900); box-shadow: 0 1px 2px rgba(60, 43, 38, 0.1); }

.tbl-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; min-width: 640px; }
thead th { text-align: left; font-size: 11.5px; font-weight: 700; letter-spacing: 0.3px; color: var(--ink-mute); padding: 12px 20px; border-bottom: 1px solid var(--line-soft); background: #fcfaf7; white-space: nowrap; cursor: pointer; user-select: none; }
thead th:hover { color: var(--brown-800); }
thead th .sort { opacity: 0.5; margin-left: 3px; font-size: 10px; }
thead th.sorted .sort { opacity: 1; color: var(--orange); }
tbody td { padding: 13px 20px; border-bottom: 1px solid var(--line-soft); font-size: 13.5px; color: var(--ink); vertical-align: middle; }
tbody tr:last-child td { border-bottom: none; }
tbody tr:hover { background: #fbf8f5; }
.cell-main { font-weight: 600; color: var(--brown-900); }
.row-thumb { width: 38px; height: 38px; border-radius: 8px; background: var(--line-soft); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 18px; }
.row-flex { display: flex; align-items: center; gap: 12px; }
.actions-cell { display: flex; gap: 6px; justify-content: flex-end; }
.empty-row td { text-align: center; padding: 44px 20px; color: var(--ink-mute); }
.empty-grid { padding: 44px 20px; text-align: center; color: var(--ink-mute); }

.badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 11px; border-radius: 20px; font-size: 11.5px; font-weight: 700; }
.badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; }
.badge-green { background: var(--green-tint); color: var(--green); } .badge-green::before { background: var(--green); }
.badge-amber { background: var(--amber-tint); color: var(--amber); } .badge-amber::before { background: var(--amber); }
.badge-red { background: var(--red-tint); color: var(--red); } .badge-red::before { background: var(--red); }
.badge-gray { background: #f0ece7; color: var(--ink-soft); } .badge-gray::before { background: var(--ink-mute); }

.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; padding: 20px; }
.product-card { border: 1px solid var(--line); border-radius: 12px; overflow: hidden; background: #fff; display: flex; flex-direction: column; transition: box-shadow 0.15s, border-color 0.15s; }
.product-card:hover { border-color: var(--brown-600); box-shadow: var(--shadow); }
.product-photo { height: 112px; background: var(--line-soft); display: flex; align-items: center; justify-content: center; }
.product-photo .emoji { font-size: 34px; }
.product-card-body { padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
.product-card-body h4 { margin: 0; font-size: 14.5px; color: var(--brown-900); font-weight: 600; line-height: 1.3; }
.product-card-sub { font-size: 12px; color: var(--ink-mute); margin-top: -6px; }
.pc-track { height: 6px; border-radius: 6px; background: var(--line-soft); overflow: hidden; }
.pc-fill { height: 100%; border-radius: 6px; }
.pc-stock-row { display: flex; align-items: center; justify-content: space-between; font-size: 12.5px; color: var(--ink-soft); margin-top: 2px; }
.pc-actions { margin-top: auto; display: flex; gap: 8px; padding-top: 2px; }
.pc-actions .btn { flex: 1; justify-content: center; }

.pager { display: flex; align-items: center; justify-content: space-between; padding: 13px 20px; flex-wrap: wrap; gap: 10px; }
.pager-info { font-size: 12.5px; color: var(--ink-mute); }
.pager-btns { display: flex; gap: 6px; }
.pg-btn { min-width: 30px; height: 30px; border-radius: 7px; border: 1px solid var(--line); background: #fff; font-size: 12.5px; font-weight: 600; color: var(--ink-soft); padding: 0 8px; cursor: pointer; }
.pg-btn:hover:not(:disabled) { border-color: var(--brown-600); color: var(--brown-900); }
.pg-btn.on { background: var(--brown-800); border-color: var(--brown-800); color: #fff; }
.pg-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.overlay { position: fixed; inset: 0; background: rgba(44, 33, 29, 0.45); display: none; align-items: center; justify-content: center; z-index: 50; padding: 20px; }
.overlay.open { display: flex; }
.modal { background: #fff; border-radius: 14px; width: 100%; max-width: 460px; max-height: 88vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25); }
.modal-head { padding: 18px 22px; border-bottom: 1px solid var(--line-soft); display: flex; align-items: center; justify-content: space-between; }
.modal-head h3 { margin: 0; font-size: 16px; color: var(--brown-900); }
.modal-x { background: none; border: none; font-size: 18px; color: var(--ink-mute); width: 28px; height: 28px; border-radius: 7px; cursor: pointer; }
.modal-x:hover { background: var(--line-soft); color: var(--ink); }
.modal-body { padding: 20px 22px; display: flex; flex-direction: column; gap: 14px; }
.modal-foot { padding: 16px 22px; border-top: 1px solid var(--line-soft); display: flex; justify-content: flex-end; gap: 10px; }
.field label { display: block; font-size: 12px; font-weight: 700; color: var(--ink-soft); margin-bottom: 6px; }
.field input, .field select { width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--line); background: var(--cream); font-size: 13.5px; color: var(--ink); font-family: inherit; }
.field input:focus, .field select:focus { outline: none; border-color: var(--orange); background: #fff; }
.err { color: var(--red); font-size: 12px; margin-top: 5px; display: none; }
.field.error input { border-color: var(--red); }
.field.error .err { display: block; }

.toast { position: fixed; bottom: 24px; right: 24px; background: var(--brown-900); color: #fff; padding: 13px 20px; border-radius: 10px; font-size: 13.5px; font-weight: 600; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); z-index: 60; transform: translateY(20px); opacity: 0; transition: all 0.25s; pointer-events: none; }
.toast.show { transform: translateY(0); opacity: 1; }
</style>