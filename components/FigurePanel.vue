<script setup>
defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: '',
  },
  caption: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <figure class="figure-panel" :class="variant">
    <img :src="src" :alt="alt">
    <figcaption v-if="caption" class="caption">{{ caption }}</figcaption>
  </figure>
</template>
