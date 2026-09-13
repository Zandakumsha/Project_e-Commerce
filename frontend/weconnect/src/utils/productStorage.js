export const PRODUCT_STORAGE_KEY = 'weconnect_published_products'
export const DRAFT_STORAGE_KEY = 'weconnect_product_drafts'

export function readList(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (error) {
    console.warn('Failed to read localStorage item:', key, error)
    return fallback
  }
}

export function writeList(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.warn('Failed to write localStorage item:', key, error)
  }
}

export function createProductFromForm(form, id = Date.now()) {
  const safeName = String(form.name || '').trim() || 'Untitled product'
  const safeCategory = String(form.category || 'Uncategorized')
  const stock = Number(form.stockQty ?? form.quantity ?? 0)
  const price = Number(form.price ?? 0)
  const status = stock === 0 ? 'Out of stock' : stock < 30 ? 'Low stock' : 'In stock'

  return {
    id,
    name: safeName,
    cat: safeCategory,
    sku: String(form.sku || `NEW-${Math.floor(Math.random() * 900 + 100)}`),
    price,
    stock,
    status,
    img: '📦',
    source: 'published',
  }
}

export function createDraftFromForm(form, id = Date.now()) {
  return {
    id,
    name: String(form.name || '').trim() || 'Untitled draft',
    category: String(form.category || 'Uncategorized'),
    sku: String(form.sku || ''),
    description: String(form.description || ''),
    price: Number(form.price ?? 0),
    stockQty: Number(form.stockQty ?? form.quantity ?? 0),
    lowStock: Number(form.lowStock ?? 0),
    weight: Number(form.weight ?? 0),
    moq: Number(form.moq ?? 0),
    createdAt: new Date().toISOString(),
  }
}
