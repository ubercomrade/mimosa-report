<script setup>
defineProps({
  type: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="callout" :class="type">
    <slot />
  </div>
</template>
