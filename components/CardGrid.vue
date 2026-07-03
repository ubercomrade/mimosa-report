<script setup>
defineProps({
  columns: {
    type: [Number, String],
    default: 2,
  },
})
</script>

<template>
  <div class="card-grid" :class="`columns-${columns}`">
    <slot />
  </div>
</template>
