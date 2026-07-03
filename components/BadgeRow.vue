<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
  variant: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="badge-row">
    <span
      v-for="item in items"
      :key="item"
      :class="variant ? ['model-pill', variant] : 'badge'"
      v-html="item"
    />
  </div>
</template>