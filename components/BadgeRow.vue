<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div class="badge-row">
    <span v-for="item in items" :key="item" class="badge">{{ item }}</span>
  </div>
</template>
