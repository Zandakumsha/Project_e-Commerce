<template>
  <section class="placeholder-page">
    <div class="placeholder-card">
      <p class="eyebrow">Overview</p>
      <h1>{{ title }}</h1>
      <p>This page is ready for future module work.</p>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'Page',
  },
})
</script>

<style scoped>
.placeholder-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f7f5f2;
  padding: 32px;
}

.placeholder-card {
  width: min(560px, 100%);
  background: #fff;
  border: 1px solid #e7e0d8;
  border-radius: 16px;
  box-shadow: 0 8px 28px rgba(60, 43, 38, 0.08);
  padding: 32px;
}

.eyebrow {
  margin: 0 0 10px;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #7c5f55;
  font-weight: 700;
}

h1 {
  margin: 0 0 10px;
  font-size: clamp(28px, 3vw, 40px);
  color: #3c2b26;
  font-family: Georgia, 'Times New Roman', serif;
}

p {
  margin: 0;
  font-size: 15px;
  color: #6b5d56;
}
</style>
