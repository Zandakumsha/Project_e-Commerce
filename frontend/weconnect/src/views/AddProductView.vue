<template>
  <section class="add-product-page">
    <div class="page-layout">
      <div class="left-stack">
        <div class="panel card-form">
          <div class="section-title">Product Details &amp; Cataloging</div>

          <div class="field-block">
            <label>Wholesale product title</label>
            <input v-model="form.name" type="text" placeholder="e.g. Sugar Cane Takayew Bowls (750ml) - Pack of 500" />
          </div>

          <div class="field-row">
            <div class="field-block half">
              <label>Product category</label>
              <select v-model="form.category">
                <option value="Eco-friendly Packaging">Eco-friendly Packaging</option>
                <option value="Home Goods">Home Goods</option>
                <option value="Beauty">Beauty</option>
                <option value="Health & Medicine">Health &amp; Medicine</option>
              </select>
            </div>

            <div class="field-block half">
              <label>Stock keeping unit (SKU)</label>
              <input v-model="form.sku" type="text" placeholder="CFP-SCB-750M" />
            </div>
          </div>

          <div class="field-block">
            <label>Detailed description</label>
            <textarea v-model="form.description" placeholder="Enter detailed bulk buying features (dimensions, food certifications, materials used, thermal properties, pack densities, etc...)" />
          </div>
        </div>

        <div class="panel pricing-panel">
          <div class="section-title">Pricing &amp; Bulk Discount Tiers (ZAR)</div>

          <div class="field-row pricing-row">
            <div class="field-block half">
              <label>Base price per unit pack (R)</label>
              <input v-model.number="form.price" type="number" placeholder="550.00" />
            </div>

            <div class="field-block half">
              <label>Minimum order quantity (MOQ)</label>
              <input v-model.number="form.moq" type="number" placeholder="10 packs" />
            </div>
          </div>

          <div class="tier-row">
            <div class="tier-box">
              <span>10 - 49 packs</span>
              <strong>Base price (R 550)</strong>
            </div>
            <div class="tier-box">
              <span>50 - 99 packs</span>
              <strong>5% off (R 522.50)</strong>
            </div>
            <div class="tier-box">
              <span>100+ packs</span>
              <strong>10% off (R 495.00)</strong>
            </div>
          </div>
        </div>
      </div>

      <aside class="right-stack">
        <div class="panel media-panel">
          <div class="section-title small">Product Media</div>

          <div class="media-dropzone">
            <div class="drop-icon">⤴</div>
            <div>Drag product images here</div>
            <small>Supports JPG, PNG (Max 5MB)</small>
          </div>

          <div class="thumb-grid">
            <div v-for="(image, index) in previewImages" :key="index" class="thumb-card">
              <img :src="image" alt="Product preview" />
            </div>
            <button class="add-thumb" type="button">+</button>
          </div>
        </div>

        <div class="panel meta-panel">
          <div class="meta-row">
            <label>Initial stock qty</label>
            <input v-model.number="form.stockQty" type="number" placeholder="500 packs" />
          </div>

          <div class="meta-row">
            <label>Low stock alert</label>
            <input v-model.number="form.lowStock" type="number" placeholder="50 packs" />
          </div>

          <div class="meta-row">
            <label>Shipping weight (per pack)</label>
            <input v-model.number="form.weight" type="number" placeholder="2.5 kg" />
          </div>
        </div>

        <div class="action-stack">
          <button class="publish-btn" type="button" @click="publishProduct">Publish Product</button>
          <button class="draft-btn" type="button" @click="saveDraft">Save as Draft</button>
        </div>
      </aside>
    </div>

    <div v-if="drafts.length" class="draft-footer-panel">
      <div class="draft-footer-header">Saved drafts</div>
      <div class="draft-list">
        <div v-for="draft in drafts" :key="draft.id" class="draft-row">
          <div class="draft-meta">
            <strong>{{ draft.name || 'Untitled draft' }}</strong>
            <span>{{ draft.category || 'Uncategorized' }}</span>
          </div>
          <button class="draft-load-btn" type="button" @click="continueDraft(draft.id)">Load draft</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { PRODUCT_STORAGE_KEY, DRAFT_STORAGE_KEY, readList, writeList, createProductFromForm, createDraftFromForm } from '../utils/productStorage'

const router = useRouter()
const drafts = ref([])

const form = reactive({
  name: '',
  description: '',
  category: 'Eco-friendly Packaging',
  quantity: 1020,
  sku: 'CFP-SCB-750M',
  sellingType: 'in-store',
  stockQty: 500,
  lowStock: 50,
  weight: 2.5,
  moq: 10,
  length: 12,
  breadth: 12,
  width: 12,
  price: 550,
  compareAt: 320,
})

const previewImages = ref([
  'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
])

onMounted(() => {
  loadDrafts()
  const currentDraft = localStorage.getItem('weconnect_draft_current')
  if (currentDraft) {
    try {
      const parsed = JSON.parse(currentDraft)
      Object.assign(form, parsed)
      localStorage.removeItem('weconnect_draft_current')
    } catch (error) {
      console.warn('Failed to restore draft', error)
    }
  } else {
    const previousDrafts = readList(DRAFT_STORAGE_KEY, [])
    if (previousDrafts.length > 0) {
      const latestDraft = previousDrafts[previousDrafts.length - 1]
      Object.assign(form, latestDraft)
    }
  }
  loadDrafts()
})

function loadDrafts() {
  drafts.value = readList(DRAFT_STORAGE_KEY, [])
}

function goBack() {
  router.push('/products')
}

function removeImage(index) {
  previewImages.value.splice(index, 1)
}

function publishProduct() {
  const product = createProductFromForm(form)
  const products = readList(PRODUCT_STORAGE_KEY, [])
  products.unshift(product)
  writeList(PRODUCT_STORAGE_KEY, products)
  router.push('/products')
}

function saveDraft() {
  const existingDrafts = readList(DRAFT_STORAGE_KEY, [])
  const draft = createDraftFromForm(form)
  existingDrafts.unshift(draft)
  writeList(DRAFT_STORAGE_KEY, existingDrafts)
  loadDrafts()
}

function continueDraft(id) {
  const draft = drafts.value.find((item) => item.id === id)
  if (!draft) return
  Object.assign(form, draft)
}
</script>

<style scoped>
.add-product-page {
  min-height: 100vh;
  background: #f3efe9;
  padding: 28px 24px 40px;
  color: #2e2724;
  font-family: 'Figtree', 'Segoe UI', sans-serif;
}

.page-layout {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.45fr 0.8fr;
  gap: 24px;
  align-items: start;
}

.left-stack,
.right-stack {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.panel {
  background: rgba(255, 255, 255, 0.52);
  border: 1px solid #d9cfc4;
  border-radius: 12px;
  padding: 18px 18px 16px;
  box-shadow: 0 1px 0 rgba(60, 43, 38, 0.03);
}

.section-title {
  margin: 0 0 18px;
  font-weight: 700;
  font-size: 15px;
  color: #3e2f2c;
  letter-spacing: 0.01em;
}

.section-title.small {
  font-size: 15px;
  margin-bottom: 14px;
}

.field-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.half {
  width: 100%;
}

label {
  font-size: 11px;
  font-weight: 700;
  color: #6f6057;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

input,
textarea,
select {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #d3c7bd;
  border-radius: 8px;
  background: #f5f1ec;
  padding: 11px 12px;
  font: inherit;
  color: #2d221f;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #b87b51;
  background: #fff;
}

textarea {
  min-height: 135px;
  resize: vertical;
}

.card-form {
  padding-bottom: 8px;
}

.pricing-panel {
  padding-bottom: 20px;
}

.pricing-row {
  margin-bottom: 18px;
}

.tier-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.tier-box {
  background: #f7f3ee;
  border: 1px solid #dccdbd;
  border-radius: 8px;
  padding: 10px 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  color: #584b45;
}

.tier-box span {
  font-size: 12px;
  color: #7b6a61;
}

.tier-box strong {
  font-size: 11px;
  font-weight: 700;
  color: #483d39;
}

.media-panel {
  padding: 16px 18px 18px;
}

.media-dropzone {
  border: 1px dashed #d2c1b5;
  background: rgba(245, 241, 236, 0.8);
  border-radius: 10px;
  min-height: 116px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 6px;
  color: #5d4d45;
  font-size: 13px;
  margin-bottom: 16px;
}

.drop-icon {
  font-size: 24px;
  color: #78675f;
}

.media-dropzone small {
  color: #8a786f;
  font-size: 11px;
}

.thumb-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.thumb-card {
  width: 90px;
  height: 90px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #dbcfc2;
  background: #efe9e3;
}

.thumb-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.add-thumb {
  width: 90px;
  height: 90px;
  border-radius: 10px;
  border: 1px dotted #cdb7a7;
  background: #f7f2ee;
  color: #7a685f;
  font-size: 34px;
  cursor: pointer;
}

.meta-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 18px;
}

.meta-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-row label {
  display: block;
}

.action-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.publish-btn,
.draft-btn {
  border: none;
  border-radius: 10px;
  padding: 13px 16px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
}

.publish-btn {
  background: #d98a55;
  color: white;
}

.draft-btn {
  background: #f2efe9;
  border: 1px solid #d7c5b6;
  color: #4a3f3a;
}

.draft-footer-panel {
  max-width: 1200px;
  margin: 18px auto 0;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid #d9cfc4;
  border-radius: 12px;
  padding: 16px 18px;
}

.draft-footer-header {
  font-size: 14px;
  font-weight: 700;
  color: #3f312d;
  margin-bottom: 12px;
}

.draft-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.draft-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: #f8f4f0;
  border: 1px solid #e0d4c8;
  border-radius: 10px;
}

.draft-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.draft-meta strong {
  font-size: 14px;
  color: #3e2f2c;
}

.draft-meta span {
  font-size: 12px;
  color: #75655d;
}

.draft-load-btn {
  border: 1px solid #d7bfaa;
  background: white;
  color: #3d312c;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
}

@media (max-width: 980px) {
  .page-layout {
    grid-template-columns: 1fr;
  }
}
</style>
