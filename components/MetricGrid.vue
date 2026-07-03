<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div class="metric-grid">
    <div v-for="item in items" :key="item.label" class="metric">
      <p class="metric-value">{{ item.value }}</p>
      <p class="metric-label">{{ item.label }}</p>
    </div>
  </div>
</template>
